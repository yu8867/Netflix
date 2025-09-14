from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLALCHEMY_DATABASE_URL = "sqlite:///./myflix.db"
SQLALCHEMY_DATABASE_URL="postgresql://postgres:kiichanQ217@database-3.cjy8ouucwvo8.ap-northeast-1.rds.amazonaws.com:5432/postgres"

# engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=True)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

Base = declarative_base()