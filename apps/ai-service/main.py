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
            prompt = f"""
Bạn là trợ lý học tập AI của hệ thống Thư viện AI.

Nhiệm vụ:
- Trả lời trực tiếp, thân thiện, dễ hiểu bằng tiếng Việt.
- Hỗ trợ sinh viên tìm tài liệu, học tập, sử dụng thư viện, diễn đàn, nhóm học tập.
- Nếu người dùng hỏi về kiến thức học tập, hãy giải thích rõ ràng và có ví dụ nếu phù hợp.
- Nếu người dùng hỏi tài liệu cụ thể mà bạn chưa có dữ liệu, hãy hướng dẫn họ tìm trong mục Thư viện.
- Không bịa rằng bạn đã đọc tài liệu nếu chưa có dữ liệu tài liệu.

Câu hỏi của người dùng:
{question}

Trả lời:
"""

            response = llm.invoke(robust_sanitize(prompt))

            return {
                "message": robust_sanitize(str(response)),
                "conversationId": robust_sanitize(request.conversationId)
            }

        # =========================
        # Nếu đã có vector DB thì tìm tài liệu liên quan
        # Nhưng nếu tài liệu không liên quan thì vẫn trả lời bằng kiến thức chung
        # =========================
        docs = vector_store.similarity_search(question, k=12)

        if not docs:
            prompt = f"""
Bạn là trợ lý học tập AI của hệ thống Thư viện AI.

Nhiệm vụ:
- Trả lời trực tiếp câu hỏi của người dùng bằng tiếng Việt.
- Giải thích dễ hiểu, có ví dụ nếu phù hợp.
- Không nói rằng "không tìm thấy trong tài liệu".
- Nếu câu hỏi liên quan đến tìm tài liệu, hãy gợi ý từ khóa tìm kiếm trong thư viện.

Câu hỏi:
{question}

Trả lời:
"""
            response = llm.invoke(robust_sanitize(prompt))

            return {
                "message": robust_sanitize(str(response)),
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

        prompt = f"""
Bạn là Trợ lý học tập AI của hệ thống Thư viện AI.

Nhiệm vụ:
- Trả lời trực tiếp câu hỏi của người dùng bằng tiếng Việt.
- Ưu tiên sử dụng tài liệu tham khảo nếu tài liệu có liên quan rõ ràng đến câu hỏi.
- Nếu tài liệu tham khảo không liên quan hoặc không đủ thông tin, hãy bỏ qua tài liệu và trả lời bằng kiến thức chung của bạn.
- Không được mở đầu bằng các câu như:
  "Tài liệu không cung cấp thông tin..."
  "Trong tài liệu không có..."
  "Tôi xin lỗi, nhưng tài liệu..."
  "Không tìm thấy thông tin trong tài liệu..."
  "Dựa trên tài liệu được cung cấp..."
- Chỉ nhắc đến tên giáo trình và số trang khi nội dung tài liệu thật sự liên quan trực tiếp đến câu hỏi.
- Không bịa tên giáo trình, tên tài liệu hoặc số trang.
- Trình bày rõ ràng, dễ hiểu, có ví dụ nếu phù hợp.
- Nếu câu hỏi là khái niệm kỹ thuật, hãy giải thích theo cấu trúc:
  1. Khái niệm
  2. Cách hoạt động hoặc ý nghĩa
  3. Ví dụ dễ hiểu
  4. Khi nào nên dùng

TÀI LIỆU THAM KHẢO NẾU CÓ LIÊN QUAN:
{context[:6000]}

CÂU HỎI:
{question}

TRẢ LỜI TRỰC TIẾP:
"""

        response = llm.invoke(robust_sanitize(prompt))
        clean_response = robust_sanitize(str(response))

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