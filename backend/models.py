from sqlalchemy import Column, Integer, String
from database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    task = Column(String, nullable=False)
    due_date = Column(String, nullable=True)
    owner = Column(String, nullable=True)
    priority = Column(String, default="Medium")
    status = Column(String, default="Pending")