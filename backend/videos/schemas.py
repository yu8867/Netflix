from pydantic import BaseModel
 
class VideoCreate(BaseModel):
    title:       str
    description: str
    thumbnail:   str
    url:         str

class VideoInformation(BaseModel):
    id:          int
    title:       str
    description: str
    thumbnail:   str
    url:         str