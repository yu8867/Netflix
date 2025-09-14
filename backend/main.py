from fastapi import FastAPI, Depends
from models import user, video, history
from sqlalchemy.orm import Session
from database import engine
from auth.routes import router as auth_router
from videos.routes import router as video_router
from history.routes import router as history_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="NextlixAPI")
user.Base.metadata.create_all(bind=engine)
video.Base.metadata.create_all(bind=engine)
history.Base.metadata.create_all(bind=engine)

origins = [
    "http://localhost:3000",
    "http://192.168.1.6:3000"
    # "http://127.0.0.1:3000",
    # "http://192.168.1.6:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # 許可するオリジン
    allow_credentials=True,
    allow_methods=["*"],              # GET, POST, PUT, DELETE, OPTIONS
    allow_headers=["*"],              # Authorization ヘッダーなども許可
)

app.include_router(video_router)
app.include_router(auth_router)
app.include_router(history_router)

@app.get("/")
def root():
    return {"message": "Welcome to MyFlix API"}

# DB セッションを取得する Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root(db: Session = Depends(get_db)):
    # DB に接続できるか確認するだけ
    result = db.execute("SELECT NOW();").fetchone()
    return {"message": "Hello from FastAPI + PostgreSQL", "time": result[0]}
