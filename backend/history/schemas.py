from pydantic import BaseModel
from datetime import datetime

class User(BaseModel):
    id: int
    username: str
    email: str

class HistoryInformation(BaseModel):
    id: int
    user: User
    video_id: int
    event_type: str
    timestamp: float
    created_at: datetime


class HistoryCreate(BaseModel):
    video_id: int
    event_type: str
    timestamp: float