import sys
import io
import os
import requests
import re
import traceback
from typing import Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# LangChain Imports
from langchain_community.llms import Ollama
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

# Force UTF-8 for standard streams on Windows
try:
    if hasattr(sys.stdout, "buffer"):
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")
except Exception:
    pass

print("--- AI SERVICE STARTING ---")

app = FastAPI(title="LIBRIA AI PRO")

# =========================
# Configuration
# =========================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Model Ollama đang dùng
OLLAMA_MODEL = "qwen2.5:3b"

# Đường dẫn vector DB theo folder ai-service hiện tại
VECTOR_DB_PATH = os.path.join(BASE_DIR, "vector_db")

# Backend Spring Boot chạy port 8080
BACKEND_BASE_URL = "http://localhost:8080"

# Initialize LLM
llm = Ollama(
    model=OLLAMA_MODEL,
    temperature=0.2,
    base_url="http://localhost:11434"
)

# Initialize Embeddings
print("Initializing Embeddings model...")
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Global Vector Store variable
vector_store = None


def robust_sanitize(text):
    if text is None:
        return ""
    if not isinstance(text, str):
        text = str(text)

    # Remove surrogate characters that cause UTF-8 encode errors
    return re.sub(r"[\ud800-\udfff]", "", text)


# =========================
# Anti "không tìm thấy tài liệu" helpers
# =========================

VI_STOPWORDS = {
    "là", "gì", "và", "của", "có", "cho", "về", "trong", "các", "một",
    "những", "được", "không", "nào", "hãy", "giải", "thích", "tôi",
    "muốn", "tìm", "tài", "liệu", "với", "theo", "khi", "như", "thế",
    "ở", "để", "này", "đó", "ra", "sao", "bạn", "giúp", "hỏi", "nói"
}

FORBIDDEN_ANSWER_PATTERNS = [
    "xin lỗi",
    "không tìm thấy thông tin",
    "không thấy thông tin",
    "không tìm thấy",
    "tài liệu không cung cấp",
    "trong tài liệu không có",
    "tài liệu tham khảo chủ yếu",
    "không có thông tin liên quan",
    "không thấy thông tin liên quan",
    "dựa trên tài liệu được cung cấp",
    "dựa vào tài liệu được cung cấp",
    "tài liệu được cung cấp không",
    "các tài liệu tham khảo mà bạn đã cung cấp",
]


def normalize_words(text: str):
    text = robust_sanitize(text).lower()
    text = re.sub(r"[^a-zA-ZÀ-ỹ0-9\s+#.]", " ", text)
    words = [w.strip() for w in text.split() if len(w.strip()) >= 3]
    return [w for w in words if w not in VI_STOPWORDS]


def is_context_relevant(question: str, context: str) -> bool:
    """
    Kiểm tra tài liệu tìm được có thật sự liên quan câu hỏi không.
    Nếu không liên quan thì không đưa context vào prompt.
    """
    question_words = set(normalize_words(question))
    context_words = set(normalize_words(context[:8000]))

    if not question_words or not context_words:
        return False

    question_lower = question.lower()
    context_lower = context.lower()

    important_terms = [
        "spring boot",
        "rest api",
        "jwt",
        "react",
        "java",
        "mysql",
        "database",
        "quarkus",
        "docker",
        "hibernate",
        "jpa",
        "frontend",
        "backend",
        "api",
        "spring security",
        "cloudinary",
        "vite",
        "nodejs",
        "node js",
        "fastapi",
        "ollama",
        "rag",
        "faiss",
    ]

    for term in important_terms:
        if term in question_lower and term not in context_lower:
            return False

    overlap = question_words.intersection(context_words)

    return len(overlap) >= 1


def contains_forbidden_answer(answer: str) -> bool:
    answer_lower = robust_sanitize(answer).lower()
    first_part = answer_lower[:900]
    return any(pattern in first_part for pattern in FORBIDDEN_ANSWER_PATTERNS)


def build_general_prompt(question: str) -> str:
    return f"""
Bạn là trợ lý học tập AI của hệ thống Thư viện AI.

YÊU CẦU BẮT BUỘC:
- Trả lời trực tiếp câu hỏi của người dùng bằng tiếng Việt.
- Không mở đầu bằng "Xin lỗi".
- Không nói "không tìm thấy trong tài liệu".
- Không nói "tài liệu không cung cấp thông tin".
- Không nói "tài liệu tham khảo chủ yếu đề cập đến".
- Không nhắc rằng bạn thiếu tài liệu tham khảo.
- Nếu câu hỏi là kiến thức học tập hoặc kỹ thuật, hãy dùng kiến thức chung để giải thích rõ ràng.
- Nếu người dùng hỏi tìm tài liệu, hãy gợi ý từ khóa tìm kiếm trong thư viện.
- Trình bày dễ hiểu, có ví dụ nếu phù hợp.

Nếu câu hỏi là khái niệm kỹ thuật, hãy trả lời theo cấu trúc:
1. Khái niệm
2. Cách hoạt động hoặc ý nghĩa
3. Ví dụ dễ hiểu
4. Khi nào nên dùng

Câu hỏi:
{question}

Trả lời trực tiếp:
"""


def build_retry_prompt(question: str) -> str:
    return f"""
Bạn là trợ lý học tập AI.

Hãy trả lời trực tiếp câu hỏi sau bằng kiến thức chung.

QUY TẮC BẮT BUỘC:
- Không được nói "Xin lỗi".
- Không được nói "không tìm thấy thông tin".
- Không được nhắc đến tài liệu tham khảo.
- Không được nói tài liệu không liên quan.
- Trả lời ngay vào nội dung chính.

Câu hỏi:
{question}

Trả lời:
"""


def call_llm_with_guard(prompt: str, question: str) -> str:
    """
    Gọi LLM, nếu model vẫn trả lời kiểu không tìm thấy tài liệu
    thì gọi lại bằng prompt thường.
    """
    response = llm.invoke(robust_sanitize(prompt))
    clean_response = robust_sanitize(str(response)).strip()

    if contains_forbidden_answer(clean_response):
        retry_prompt = build_retry_prompt(question)
        response = llm.invoke(robust_sanitize(retry_prompt))
        clean_response = robust_sanitize(str(response)).strip()

    return clean_response


def load_vector_store():
    global vector_store

    if os.path.exists(VECTOR_DB_PATH):
        try:
            vector_store = FAISS.load_local(
                VECTOR_DB_PATH,
                embeddings,
                allow_dangerous_deserialization=True
            )
            print("Vector store loaded successfully.")
        except Exception as e:
            print(f"Failed to load vector store: {e}")
            vector_store = None
    else:
        print("Vector store not found. Chatbot will still work in normal chat mode.")


load_vector_store()


class ChatRequest(BaseModel):
    message: str
    conversationId: Optional[str] = None


class IngestRequest(BaseModel):
    filePath: str
    title: Optional[str] = None


@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        question = robust_sanitize(request.message)

        if not question.strip():
            return {
                "message": "Bạn vui lòng nhập câu hỏi để mình hỗ trợ nhé.",
                "conversationId": robust_sanitize(request.conversationId)
            }

        # =========================
        # Nếu chưa có vector DB thì vẫn chat bình thường
        # =========================
        if not vector_store:
            prompt = build_general_prompt(question)
            clean_response = call_llm_with_guard(prompt, question)

            return {
                "message": clean_response,
                "conversationId": robust_sanitize(request.conversationId)
            }

        # =========================
        # Nếu đã có vector DB thì tìm tài liệu liên quan
        # Nếu tài liệu không liên quan thì trả lời bằng kiến thức chung
        # =========================
        docs = vector_store.similarity_search(question, k=12)

        if not docs:
            prompt = build_general_prompt(question)
            clean_response = call_llm_with_guard(prompt, question)

            return {
                "message": clean_response,
                "conversationId": robust_sanitize(request.conversationId)
            }

        # Collect filenames for resolution
        filenames_to_resolve = set()

        for doc in docs:
            source_path = doc.metadata.get("source", "")
            if source_path:
                filenames_to_resolve.add(os.path.basename(source_path))

        # Resolve titles via Backend API
        resolved_titles = {}

        if filenames_to_resolve:
            try:
                backend_url = f"{BACKEND_BASE_URL}/api/documents/resolve-titles"
                params = {"filenames": ",".join(list(filenames_to_resolve))}
                resp = requests.get(backend_url, params=params, timeout=5)

                if resp.status_code == 200:
                    resolved_titles = resp.json()
            except Exception as e:
                print(f"Failed to resolve titles from backend: {e}")

        context_parts = []

        for doc in docs:
            source_path = doc.metadata.get("source", "Tài liệu không tên")
            basename = os.path.basename(source_path)

            source_name = resolved_titles.get(basename)

            if not source_name or source_name == basename:
                source_name = doc.metadata.get("title", basename)

            page = doc.metadata.get("page", 0)
            content = robust_sanitize(doc.page_content)

            context_parts.append(
                f"[Giáo trình: {source_name} - Trang {page + 1}]: {content}"
            )

        context = "\n\n".join(context_parts)

        # Nếu context không liên quan thì bỏ tài liệu, trả lời bằng kiến thức chung
        if not is_context_relevant(question, context):
            prompt = build_general_prompt(question)
            clean_response = call_llm_with_guard(prompt, question)

            return {
                "message": clean_response,
                "conversationId": robust_sanitize(request.conversationId)
            }

        # Nếu context liên quan thì dùng context
        prompt = f"""
Bạn là Trợ lý học tập AI của hệ thống Thư viện AI.

YÊU CẦU BẮT BUỘC:
- Trả lời trực tiếp câu hỏi của người dùng bằng tiếng Việt.
- Chỉ dùng tài liệu tham khảo nếu nó liên quan trực tiếp đến câu hỏi.
- Nếu tài liệu chưa đủ, hãy bổ sung bằng kiến thức chung.
- Không mở đầu bằng "Xin lỗi".
- Không nói "không tìm thấy trong tài liệu".
- Không nói "tài liệu không cung cấp thông tin".
- Không nói "tài liệu tham khảo chủ yếu đề cập đến".
- Không nói "dựa trên tài liệu được cung cấp".
- Không nói tài liệu không liên quan.
- Chỉ nhắc tên giáo trình và số trang khi nội dung tài liệu thật sự liên quan trực tiếp.
- Không bịa tên giáo trình, tên tài liệu hoặc số trang.
- Trình bày rõ ràng, dễ hiểu, có ví dụ nếu phù hợp.

Nếu câu hỏi là khái niệm kỹ thuật, hãy trình bày theo cấu trúc:
1. Khái niệm
2. Cách hoạt động hoặc ý nghĩa
3. Ví dụ dễ hiểu
4. Khi nào nên dùng

Tài liệu tham khảo liên quan:
{context[:6000]}

Câu hỏi:
{question}

Trả lời trực tiếp:
"""

        clean_response = call_llm_with_guard(prompt, question)

        return {
            "message": clean_response,
            "conversationId": robust_sanitize(request.conversationId)
        }

    except Exception as e:
        traceback.print_exc()
        return {
            "message": f"Lỗi hệ thống AI service: {robust_sanitize(str(e))}",
            "conversationId": "error"
        }


@app.post("/api/summarize")
async def summarize(request: IngestRequest):
    try:
        loader = PyMuPDFLoader(request.filePath)
        docs = loader.load()

        content = robust_sanitize("\n".join([doc.page_content for doc in docs]))

        prompt = f"""
Hãy tóm tắt nội dung sau một cách chi tiết, khoa học, dễ hiểu bằng tiếng Việt:

{content[:8000]}
"""

        response = llm.invoke(robust_sanitize(prompt))

        return {
            "summary": robust_sanitize(str(response))
        }

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=robust_sanitize(str(e)))


@app.post("/api/flashcards")
async def flashcards(request: IngestRequest):
    try:
        loader = PyMuPDFLoader(request.filePath)
        docs = loader.load()

        content = robust_sanitize("\n".join([doc.page_content for doc in docs]))

        prompt = f"""
Tạo 5 flashcards từ nội dung sau.
Trả về bằng tiếng Việt, dạng JSON list.
Mỗi phần tử gồm:
- question
- answer

Nội dung:
{content[:6000]}
"""

        response = llm.invoke(robust_sanitize(prompt))

        return {
            "flashcards": robust_sanitize(str(response))
        }

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=robust_sanitize(str(e)))


@app.post("/api/quiz")
async def quiz(request: IngestRequest):
    try:
        loader = PyMuPDFLoader(request.filePath)
        docs = loader.load()

        content = robust_sanitize("\n".join([doc.page_content for doc in docs]))

        prompt = f"""
Tạo bài kiểm tra 5 câu hỏi trắc nghiệm từ nội dung sau.
Trả về bằng tiếng Việt, dạng JSON.
Mỗi câu gồm:
- question
- options
- correctAnswer
- explanation

Nội dung:
{content[:6000]}
"""

        response = llm.invoke(robust_sanitize(prompt))

        return {
            "quiz": robust_sanitize(str(response))
        }

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=robust_sanitize(str(e)))


@app.post("/api/ingest")
async def ingest_document(request: IngestRequest):
    global vector_store

    try:
        if not os.path.exists(request.filePath):
            raise HTTPException(
                status_code=400,
                detail=f"File không tồn tại: {request.filePath}"
            )

        loader = PyMuPDFLoader(request.filePath)
        documents = loader.load()

        # Add title to metadata if provided
        if request.title:
            for d in documents:
                d.metadata["title"] = request.title

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=150
        )

        texts = text_splitter.split_documents(documents)

        if vector_store is None:
            vector_store = FAISS.from_documents(texts, embeddings)
        else:
            vector_store.add_documents(texts)

        vector_store.save_local(VECTOR_DB_PATH)

        return {
            "status": "success",
            "chunks": len(texts)
        }

    except HTTPException:
        raise

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=robust_sanitize(str(e)))


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "model": OLLAMA_MODEL,
        "vectorDbPath": VECTOR_DB_PATH,
        "vectorStoreLoaded": vector_store is not None
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)