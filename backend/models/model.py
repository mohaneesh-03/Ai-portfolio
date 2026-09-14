from typing import List, Dict, Optional
from pydantic import BaseModel

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    question: str
    history: Optional[List[ChatMessage]] = None
    stream: Optional[bool] = True