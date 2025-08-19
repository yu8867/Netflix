from fastapi import APIRouter, Depends, HTTPException, Response, Cookie
from sqlalchemy.orm import Session
from database import SessionLocal
from datetime import datetime, timedelta, timezone

from models.user import User
from . import schemas, hashing, jwt_handler, dependencies

router = APIRouter(prefix='/auth', tags=["Authentification"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/register", response_model=schemas.Token)
# user: userの登録情報
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    exsiting = db.query(User).filter(User.email == user.email).first()
    if exsiting:
        raise HTTPException(status_code=400, detail="Username already registered")

    hashed_password = hashing.hash_password(user.password)
    new_user = User(
        username = user.username,
        email = user.email,
        hashed_password = hashed_password 
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = jwt_handler.create_access_token({"sub": new_user.email})
    return {"access_token": token, "token_type": "bearer"}


@router.post("/login", response_model=schemas.Token)
# user: userの登録情報
def login(response: Response, user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    # print(db_user)
    if not db_user or not hashing.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = jwt_handler.create_access_token({"sub": user.email})
    refresh_token = jwt_handler.create_refresh_token({"sub": str(user.email)})

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,                  # JSから参照不可
        secure=True,                    # 本番では必須（HTTPSのみ）
        samesite="None",                # クロスサイトでも利用可（SPAなどで必要）
        max_age=60 * 60 * 24 * 30,      # 30日間
    )

    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/refresh", response_model=schemas.Token)
def refresh_token(response: Response, refresh_token: str = Cookie(None)):
    if not refresh_token:
        raise HTTPException(status_code=401, detail="No refresh token found")
    
    try:
        payload = jwt_handler.decode_refresh_token(refresh_token)
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    # 新しい access_token を発行
    new_access_token = jwt_handler.create_access_token({"sub": payload["sub"]})

    # ここで refresh_token をローテーションする方がより安全（DBに保存してブラックリスト化）
    new_refresh_token = jwt_handler.create_refresh_token({"sub": payload["sub"]})
    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token,
        httponly=True,                  # JSから参照不可
        secure=True,                    # 本番では必須（HTTPSのみ）
        samesite="None",                # クロスサイトでも利用可（SPAなどで必要）
        max_age=60 * 60 * 24 * 30,      # 30日間
    )

    return {"access_token": new_access_token, "token_type": "bearer"}

@router.get("/account", response_model=schemas.UserInformation)
def read_user(response: Response, current_user: User = Depends(dependencies.get_current_user), db: Session = Depends(get_db)):
    return current_user


@router.get("/users/{user_id}", response_model=schemas.UserInformation)
def read_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(dependencies.get_current_user)):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to view this user")
    return current_user
