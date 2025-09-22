from pydantic import BaseModel
from typing import List

class Genre(BaseModel):
    id: int
    genre: str

class GenreCreate(BaseModel):
    genre: str

class VideoCreate(BaseModel):
    title:       str
    genre_ids:    List[int]
    description: str
    thumbnail_url:   str
    video_url:   str

class VideoInformation(BaseModel):
    id:          int
    title:       str
    genres:      List[Genre]
    description: str
    thumbnail_url:   str
    video_url:   str