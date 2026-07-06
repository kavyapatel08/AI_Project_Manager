from pydantic import BaseModel
from typing import Optional

class NotesInput(BaseModel):
    notes: str

class TaskCreate(BaseModel):
    task: str
    due_date: Optional[str] = None
    owner: Optional[str] = None
    priority: Optional[str] = "Medium"

class TaskUpdate(BaseModel):
    task: Optional[str] = None
    due_date: Optional[str] = None
    owner: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None

class TaskResponse(BaseModel):
    id: int
    task: str
    due_date: Optional[str]
    owner: Optional[str]
    priority: str
    status: str

    class Config:
        from_attributes = True