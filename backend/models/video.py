from sqlalchemy import Column, Integer, String, DateTime, Table, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Genre(Base):
    __tablename__ = "genres"

    id          = Column(Integer, primary_key=True, index=True)
    genre       = Column(String, unique=True, index=True)

    videos = relationship("Video", secondary="video_genres", back_populates="genres")

class Video(Base):
    __tablename__ = "videos"

    id          = Column(Integer, primary_key=True, index=True)
    title       = Column(String, unique=True, index=True)
    description = Column(String, unique=False, index=True)
    thumbnail_url = Column(String, unique=False, index=True)
    video_url   = Column(String, unique=False, index=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    genres = relationship("Genre", secondary="video_genres", back_populates="videos")

movie_genres = Table(
    "video_genres",
    Base.metadata,
    Column("video_id", Integer, ForeignKey("videos.id", ondelete="CASCADE"), primary_key=True),
    Column("genre_id", Integer, ForeignKey("genres.id", ondelete="CASCADE"), primary_key=True),
)