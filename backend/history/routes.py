from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal

from . import schemas, dependencies
from models.history import History
from models.user import User

router = APIRouter(prefix='/histories', tags=["Histories"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.HistoryInformation)
def create_hisotry(hisotry: schemas.HistoryCreate, db: Session = Depends(get_db), current_user: User = Depends(dependencies.get_current_user)):    
    new_history = History(
        user_id = current_user.id,
        video_id = hisotry.video_id,
        event_type = hisotry.event_type,
        timestamp = hisotry.timestamp,
    )
    db.add(new_history)
    db.commit()
    db.refresh(new_history)
    return new_history


@router.get("/last/{video_id}", response_model=schemas.HistoryInformation)
def get_last_watched_history(video_id: int, db: Session = Depends(get_db), current_user: User = Depends(dependencies.get_current_user)):
    history = (
        db.query(History)
        .filter(History.user_id == current_user.id,  History.video_id == video_id)
        .order_by(History.created_at.desc())
        .first()
    )
    if not history:
        raise HTTPException(status_code=404, detail="No History Found")
    return history