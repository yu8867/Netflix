from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from database import Base

class Video(Base):
    __tablename__ = "videos"

    id          = Column(Integer, primary_key=True, index=True)
    title       = Column(String, unique=True, index=True)
    description = Column(String, unique=False, index=True)
    thumbnail_url = Column(String, unique=False, index=True)
    video_url   = Column(String, unique=False, index=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)