import csv
import io
import os
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from sqlalchemy.orm import Session
from typing import Optional

import models
import schemas
from database import engine, get_db
from groq_service import extract_tasks_from_notes

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Mini AI Project Manager")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://ai-project-manager-8gkil4g2y-kavyapatel08s-projects.vercel.app","https://ai-project-manager-git-main-kavyapatel08s-projects.vercel.app", "http://localhost:5173", "https://ai-project-manager-six.vercel.app"],
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type"],
)

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.post("/extract-tasks", response_model=list[schemas.TaskResponse])
@limiter.limit("5/minute")  
def extract_tasks(request: Request, input: schemas.NotesInput, db: Session = Depends(get_db)):
    try:
        extracted = extract_tasks_from_notes(input.notes)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    saved_tasks = []
    for item in extracted:
        task_desc = item.get("task", "Untitled task")
        owner = item.get("owner")

        existing = db.query(models.Task).filter(
            models.Task.task == task_desc,
            models.Task.owner == owner
        ).first()

        if existing:
            existing.due_date = item.get("due_date") or existing.due_date
            existing.priority = item.get("priority", existing.priority)
            db.commit()
            db.refresh(existing)
            saved_tasks.append(existing)
        else:
            db_task = models.Task(
                task=task_desc,
                due_date=item.get("due_date"),
                owner=owner,
                priority=item.get("priority", "Medium"),
            )
            db.add(db_task)
            db.commit()
            db.refresh(db_task)
            saved_tasks.append(db_task)

    return saved_tasks

@app.get("/tasks", response_model=list[schemas.TaskResponse])
def get_tasks(
    owner: Optional[str] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(models.Task)
    if owner:
        query = query.filter(models.Task.owner == owner)
    if status:
        query = query.filter(models.Task.status == status)
    if priority:
        query = query.filter(models.Task.priority == priority)
    return query.all()

@app.put("/tasks/{task_id}", response_model=schemas.TaskResponse)
def update_task(task_id: int, update: schemas.TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    for key, value in update.dict(exclude_unset=True).items():
        setattr(task, key, value)

    db.commit()
    db.refresh(task)
    return task

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"message": "Task deleted"}

def sanitize_csv_cell(value):
    """Prefix cells starting with =, +, -, @ so spreadsheet apps
    treat them as text instead of executing them as formulas."""
    if value is None:
        return value
    text = str(value)
    if text and text[0] in ("=", "+", "-", "@"):
        return "'" + text
    return text

@app.get("/tasks/export")
def export_tasks(db: Session = Depends(get_db)):
    tasks = db.query(models.Task).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Task", "Due Date", "Owner", "Priority", "Status"])
    for t in tasks:
        writer.writerow([
            t.id,
            sanitize_csv_cell(t.task),
            sanitize_csv_cell(t.due_date),
            sanitize_csv_cell(t.owner),
            sanitize_csv_cell(t.priority),
            sanitize_csv_cell(t.status),
        ])
    output.seek(0)
    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=tasks.csv"},
    )