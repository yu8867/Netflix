from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class History(Base):
    __tablename__ = "histories"

    id       = Column(Integer, primary_key=True, index=True)
    user_id  = Column(Integer, ForeignKey('users.id'))
    video_id = Column(Integer, ForeignKey('videos.id'))
    event_type = Column(String) # play/pause/ended
    timestamp  = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")
    video = relationship("Video")