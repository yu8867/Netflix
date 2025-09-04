from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal

from . import schemas, dependencies
from models.video import Video

router = APIRouter(prefix='/videos', tags=["Videos"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        

@router.post("/", response_model=schemas.VideoInformation)
def create_video(video: schemas.VideoCreate, db:Session = Depends(get_db)):
    exsiting = db.query(Video).filter(Video.title == video.title).first()
    if exsiting:
        raise HTTPException(status_code=400, detail="Video already registered")

    new_Video = Video(
        title = video.title,
        description = video.description,
        thumbnail = video.thumbnail,
        url = video.url
    )

    db.add(new_Video)
    db.commit()
    db.refresh(new_Video)

    return new_Video


@router.get("/", response_model=list[schemas.VideoInformation])
def get_videos(verify: bool = Depends(dependencies.verify_user), db:Session = Depends(get_db)):
    if verify:
        return db.query(Video).all()
    

@router.get("/{video_id}", response_model=schemas.VideoInformation)
def get_videos(video_id: int, verify: bool = Depends(dependencies.verify_user), db:Session = Depends(get_db)):
    if verify:
        video = db.query(Video).filter(Video.id == video_id).first()
        if not video:
            raise HTTPException(status_code=404, detail="Video not found")
        
        return video