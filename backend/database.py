from urllib.parse import quote_plus
from config import config
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

###### Amazon RDS ######
# SQLALCHEMY_DATABASE_URL = "sqlite:///./myflix.db"
# SQLALCHEMY_DATABASE_URL="postgresql://postgres:kiichanQ217@database-3.cjy8ouucwvo8.ap-northeast-1.rds.amazonaws.com:5432/postgres"

# # engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
# engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=True)
# SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

###### SQLite ######
# SQLALCHEMY_DATABASE_URL = "sqlite:///./myflix.db"
# engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

###### postgreSQL ######
# # 接続 URL を組み立てる
SQLALCHEMY_DATABASE_URL = (
    f"postgresql://{config.POSTGRES_USER}:{config.POSTGRES_PASSWORD}@{config.POSTGRES_HOST}:{config.POSTGRES_PORT}/{config.POSTGRES_DB}"
    # f"postgresql://{config.POSTGRES_USER}:{config.POSTGRES_PASSWORD}@localhost:5432/{config.POSTGRES_DB}"
)

print("🔗 POSTGRES_USER:", config.POSTGRES_USER)
print("🔗 POSTGRES_HOST:", config.POSTGRES_HOST)
print("🔗 DB URL:", SQLALCHEMY_DATABASE_URL)

print(SQLALCHEMY_DATABASE_URL)

engine = create_engine(SQLALCHEMY_DATABASE_URL)


SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()