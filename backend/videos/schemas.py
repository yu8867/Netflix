from pydantic import BaseModel
from datetime import datetime
 
class VideoCreate(BaseModel):
    title:       str
    description: str
    thumbnail_url:   str
    video_url:   str

class VideoInformation(BaseModel):
    id:          int
    title:       str
    description: str
    thumbnail_url:   str
    video_url:   str