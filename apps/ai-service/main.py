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

# Force UTF-8 for standard streams on Windows to prevent UnicodeEncodeError in logs
try:
    if hasattr(sys.stdout, 'buffer'):
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
except:
    pass

print("--- AI SERVICE STARTING ---")

app = FastAPI(title="LIBRIA AI PRO")

# Configuration
OLLAMA_MODEL = "qwen2.5:7b"
VECTOR_DB_PATH = "e:/digital-library-system/apps/ai-service/vector_db"

# Initialize LLM
llm = Ollama(model=OLLAMA_MODEL, temperature=0.1, base_url="http://localhost:11434")

# Initialize Embeddings
print("Initializing Embeddings model...")
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Global Vector Store variable
vector_store = None

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

load_vector_store()

class ChatRequest(BaseModel):
    message: str
    conversationId: Optional[str] = None

class IngestRequest(BaseModel):
    filePath: str
    title: Optional[str] = None

def robust_sanitize(text):
    if not isinstance(text, str):
        return str(text)
    # Remove surrogate characters (D800-DFFF) that cause 'utf-8' codec can't encode errors
    return re.sub(r'[\ud800-\udfff]', '', text)

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        if not vector_store:
            return {
                "message": "Hệ thống chưa nạp tài liệu. Vui lòng upload tài liệu trước.",
                "conversationId": robust_sanitize(request.conversationId)
            }
        
        question = robust_sanitize(request.message)
        
        # Retrieve context
        docs = vector_store.similarity_search(question, k=12)
        if not docs:
            return {"message": "Không tìm thấy thông tin phù hợp.", "conversationId": robust_sanitize(request.conversationId)}
            
        # Collect filenames for resolution
        filenames_to_resolve = set()
        for doc in docs:
            source_path = doc.metadata.get('source', '')
            if source_path:
                filenames_to_resolve.add(os.path.basename(source_path))
        
        # Resolve titles via Backend API
        resolved_titles = {}
        if filenames_to_resolve:
            try:
                backend_url = "http://localhost:5000/api/documents/resolve-titles"
                params = {"filenames": ",".join(list(filenames_to_resolve))}
                resp = requests.get(backend_url, params=params, timeout=5)
                if resp.status_code == 200:
                    resolved_titles = resp.json()
            except Exception as e:
                print(f"Failed to resolve titles from backend: {e}")

        context_parts = []
        for doc in docs:
            source_path = doc.metadata.get('source', 'Tài liệu không tên')
            basename = os.path.basename(source_path)
            
            # Prioritize Backend resolution (Real DB title) over internal PDF metadata
            source_name = resolved_titles.get(basename)
            
            # Fallback to metadata title if backend resolution didn't yield something new
            if not source_name or source_name == basename:
                source_name = doc.metadata.get("title", basename)
            
            page = doc.metadata.get('page', 0)
            content = robust_sanitize(doc.page_content)
            context_parts.append(f"[Giáo trình: {source_name} - Trang {page + 1}]: {content}")
        
        context = "\n\n".join(context_parts)
        
        prompt = f"""Bạn là Trợ lý học tập chuyên nghiệp của Đại học Trung Vương. 
Hãy trả lời câu hỏi dựa trên nội dung tài liệu được cung cấp. 

YÊU CẦU QUAN TRỌNG:
1. Bạn phải nêu rõ tên giáo trình (ví dụ: "Theo giáo trình [Tên giáo trình]...") và số trang khi trả lời. 
2. Không trả lời chung chung là "tài liệu cung cấp". Hãy gọi đích danh tên giáo trình từ ngữ cảnh.
3. Trả lời bằng tiếng Việt, định dạng Markdown rõ ràng.

TÀI LIỆU CUNG CẤP:
{context[:6000]}

CÂU HỎI: {question}

TRẢ LỜI:"""
        
        response = llm.invoke(robust_sanitize(prompt))
        clean_response = robust_sanitize(str(response))
        
        return {"message": clean_response, "conversationId": robust_sanitize(request.conversationId)}
    except Exception as e:
        traceback.print_exc()
        return {"message": f"Lỗi hệ thống: {robust_sanitize(str(e))}", "conversationId": "error"}

@app.post("/api/summarize")
async def summarize(request: IngestRequest):
    try:
        loader = PyMuPDFLoader(request.filePath)
        docs = loader.load()
        content = robust_sanitize("\n".join([doc.page_content for doc in docs]))
        prompt = f"Hãy tóm tắt nội dung sau một cách chi tiết và khoa học:\n\n{content[:8000]}"
        response = llm.invoke(prompt)
        return {"summary": robust_sanitize(str(response))}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=robust_sanitize(str(e)))

@app.post("/api/flashcards")
async def flashcards(request: IngestRequest):
    try:
        loader = PyMuPDFLoader(request.filePath)
        docs = loader.load()
        content = robust_sanitize("\n".join([doc.page_content for doc in docs]))
        prompt = f"Tạo 5 flashcards (question - answer) từ nội dung này. Trả về JSON list:\n{content[:6000]}"
        response = llm.invoke(prompt)
        return {"flashcards": robust_sanitize(str(response))}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=robust_sanitize(str(e)))

@app.post("/api/quiz")
async def quiz(request: IngestRequest):
    try:
        loader = PyMuPDFLoader(request.filePath)
        docs = loader.load()
        content = robust_sanitize("\n".join([doc.page_content for doc in docs]))
        prompt = f"Tạo bài kiểm tra 5 câu hỏi trắc nghiệm kèm đáp án đúng. Trả về JSON:\n{content[:6000]}"
        response = llm.invoke(prompt)
        return {"quiz": robust_sanitize(str(response))}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=robust_sanitize(str(e)))

@app.post("/api/ingest")
async def ingest_document(request: IngestRequest):
    global vector_store
    try:
        loader = PyMuPDFLoader(request.filePath)
        documents = loader.load()
        
        # Add title to metadata if provided
        if request.title:
            for d in documents:
                d.metadata["title"] = request.title
                
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)
        texts = text_splitter.split_documents(documents)
        if vector_store is None:
            vector_store = FAISS.from_documents(texts, embeddings)
        else:
            vector_store.add_documents(texts)
        vector_store.save_local(VECTOR_DB_PATH)
        return {"status": "success", "chunks": len(texts)}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=robust_sanitize(str(e)))

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
