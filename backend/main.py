import sys
import os
from pathlib import Path
from typing import Generator
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from groq import Groq

# Ensure backend directory is in sys.path for model imports
BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from models.model import ChatRequest

# Load environment variables
load_dotenv(BACKEND_DIR / ".env")
load_dotenv()  # also check root .env if present

app = FastAPI(title="Mohaneesh Portfolio AI Backend")

# Add CORS Middleware to support development servers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

my_api_key = os.getenv("GROQ_API_KEY")
if not my_api_key:
    # We will raise when handling requests if not set, or let it load from env
    print("Warning: GROQ_API_KEY environment variable is not yet set.")

model = "openai/gpt-oss-120b"

# Load Resume Markdown
RESUME_PATH = BACKEND_DIR / "Resume.md"
resume_content = ""
if RESUME_PATH.exists():
    with open(RESUME_PATH, "r", encoding="utf-8") as file:
        resume_content = file.read()
else:
    print(f"Warning: Resume file not found at {RESUME_PATH}")

system_prompt = f"""
#ROLE
You are a professional portfolio assistant for Mohaneesh Raj Pradhan.
#TASK
Your task is accurately and professionally answer questions from recruiters, engineers and site visitors about
Mohaneesh's background, work experiences, skills and projects.
#CONSTRAINTS
You must ground your answers to the information provided in the documentation below.

<documentation>
{resume_content}
</documentation>

1. Answer questions strictly based on the information provided inside the <documentation> tags.
2. Do not extrapolate, speculate, or invent any technologies, skills, experiennces, projects, dates or any
    contaxt information not explicitly present in files.
3. Mantain a polite, professional and confident tone in your answers.
4. Always refer to Mohaneesh Raj Pradhan in the third person, unless configured otherwise.
5. Only share contact information(email, phone number, linkedin, github) if explicitly asked for it and present
in the documentation.
6. If asked about sensitive information, personal topics not related to professional background, opinions, or 
propreitory details, politely decline and redirect the user to ask questions related to Mohaneesh's proffessional
background, skills, experiences and projects.

#OUTPUT FORMAT
Give the output in a string format that is suitable for direct display to the user.
Avoid extra formatting or code blocks in your response.

# FALLBACK
If the user asks questions that are not answerable based on the information provided in the documentation, politely inform the user that you are unable to answer based on the verified portfolio information.
"""

def get_groq_client() -> Groq:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY is not configured.")
    return Groq(api_key=api_key)

def build_messages(request: ChatRequest) -> list[dict]:
    conversation = [{"role": "system", "content": system_prompt}]
    
    if request.history:
        for msg in request.history:
            if msg.role in ("user", "assistant"):
                conversation.append({"role": msg.role, "content": msg.content})
                
    conversation.append({"role": "user", "content": request.question})
    return conversation

@app.get("/")
def home():
    return {"status": "ok", "message": "FastAPI AI Portfolio Backend is running!"}

@app.get("/health")
def health():
    return {"status": "healthy", "model": model, "resume_loaded": bool(resume_content)}

async def stream_generator(messages: list[dict]) -> Generator[str, None, None]:
    client = get_groq_client()
    try:
        response_stream = client.chat.completions.create(
            model=model,
            messages=messages,
            stream=True
        )
        for chunk in response_stream:
            delta = chunk.choices[0].delta.content if chunk.choices else ""
            if delta:
                yield delta
    except Exception as e:
        yield f"\n[Error generating response: {str(e)}]"

@app.post("/chat")
@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    messages = build_messages(request)
    
    if request.stream:
        return StreamingResponse(
            stream_generator(messages),
            media_type="text/plain; charset=utf-8",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no"
            }
        )
    else:
        client = get_groq_client()
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            stream=False
        )
        answer = response.choices[0].message.content or ""
        return {"answer": answer}