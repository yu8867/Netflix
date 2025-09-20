from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
import boto3, os, uuid
from config import config
from sqlalchemy import func, case

from . import schemas, dependencies
from models.video import Video
from models.user import User
from models.history import History

router = APIRouter(prefix='/videos', tags=["Videos"])

s3 = boto3.client(
    's3',
    aws_access_key_id=config.S3_ACCESS_KEY,
    aws_secret_access_key=config.S3_SECRET_KEY,
    region_name=config.S3_REGION
)

BUCKET = config.S3_BUCKET

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# S3へのアクセス許可
@router.get("/upload-url/")
def create_presigned_url(filename: str, content_type: str, filetype:str):
    ext = filename.split(".")[-1]
    key = f"{filetype}/{uuid.uuid4()}.{ext}"

    presigned_url = s3.generate_presigned_url(
        "put_object",
        Params = {
            "Bucket" : BUCKET,
            "Key": key,
            "ContentType": content_type
        },
        ExpiresIn=3600
    )
    return {"url": presigned_url, "path": key}
        

# DBに動画情報の追加
@router.post("/", response_model=schemas.VideoInformation)
def create_video(video: schemas.VideoCreate, db:Session = Depends(get_db)):
    exsiting = db.query(Video).filter(Video.title == video.title).first()
    if exsiting:
        raise HTTPException(status_code=400, detail="Video already registered")

    new_Video = Video(
        title = video.title,
        description = video.description,
        thumbnail_url = video.thumbnail_url,
        video_url = video.video_url
    )

    db.add(new_Video)
    db.commit()
    db.refresh(new_Video)

    return new_Video


# ホーム画面でポスター画像を表示
@router.get("/", response_model=list[schemas.VideoInformation])
def get_videos(verify: bool = Depends(dependencies.verify_user), db:Session = Depends(get_db)):
    if not verify:
        return []
    
    videos = db.query(Video).order_by(Video.uploaded_at.desc()).all()
    results = []
    for v in videos:
        thumbnail_url = s3.generate_presigned_url(
            "get_object",
            Params={"Bucket": BUCKET, "Key": v.thumbnail_url}, 
            ExpiresIn=600
        )
        # video_url = s3.generate_presigned_url(
        #     "get_object",
        #     Params={"Bucket": BUCKET, "Key": v.video_url},
        #     ExpiresIn=600
        # )
        results.append({
            "id": v.id,
            "title": v.title,
            "description": v.description,
            "thumbnail_url": thumbnail_url,
            "video_url": v.video_url
        })

    return results
    
# 単体動画をGetする
@router.get("/{video_id}", response_model=schemas.VideoInformation)
def get_videos(video_id: int, verify: bool = Depends(dependencies.verify_user), db:Session = Depends(get_db)):
    if not verify:
        return []
    
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    results = []
    thumbnail_url = s3.generate_presigned_url(
        "get_object",
        Params={"Bucket": BUCKET, "Key": video.thumbnail_url},  # ← DBには key を保存
        ExpiresIn=600
    )
    video_url = s3.generate_presigned_url(
        "get_object",
        Params={"Bucket": BUCKET, "Key": video.video_url},  # ← DBには key を保存
        ExpiresIn=600
    )
    
    video = {
        "id": video.id,
        "title": video.title,
        "description": video.description,
        "thumbnail_url": thumbnail_url,
        "video_url": video_url
    }

    return video

# 視聴履歴のある動画をGetする
@router.get("/viewed/", response_model=list[schemas.VideoInformation])
def get_viewed_videos(verify: bool = Depends(dependencies.verify_user), email: str = Depends(dependencies.user_info), db:Session = Depends(get_db)):
    if not verify or not email:
        return []
    
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return []
    
    # video_ids = db.query(History.video_id).filter(History.user_id == user.id).distinct().all()
    video_ids = (
        db.query(History.video_id, func.max(History.created_at).label("latest"))
        .filter(History.user_id == user.id)
        .group_by(History.video_id)
        .order_by(func.max(History.created_at).desc())
        .all()
    )
    video_ids = [v[0] for v in video_ids]
    if len(video_ids) == 0 :
        return []
    
    # print('✅video_id', video_ids)
    # videos = db.query(Video).filter(Video.id.in_(video_ids)).all()
    ordering = case(
        {vid: idx for idx, vid in enumerate(video_ids)},
        value=Video.id
    )

    videos = (
        db.query(Video)
        .filter(Video.id.in_(video_ids))
        .order_by(ordering)
        .all()
    )

    results = []
    for v in videos:
        thumbnail_url = s3.generate_presigned_url(
            "get_object",
            Params={"Bucket": BUCKET, "Key": v.thumbnail_url},  # ← DBには key を保存
            ExpiresIn=600
        )

        results.append({
            "id": v.id,
            "title": v.title,
            "description": v.description,
            "thumbnail_url": thumbnail_url,
            "video_url": v.video_url
        })

    return results