import os
from dotenv import load_dotenv
load_dotenv()

class config:
    SECRET_KEY=os.getenv('SECRET_KEY')
    REFRESH_SECRET_KEY=os.getenv('REFRESH_SECRET_KEY')
    ALGORITHM=os.getenv('ALGORITHM')
    ACCESS_TOKEN_EXPIRE_MINUTES=os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES')
    REFRESH_TOKEN_EXPIRE_MINUTES=os.getenv('REFRESH_TOKEN_EXPIRE_MINUTES')
    S3_BUCKET=os.getenv('S3_BUCKET')
    S3_ACCESS_KEY=os.getenv('S3_ACCESS_KEY')
    S3_SECRET_KEY=os.getenv('S3_SECRET_KEY')
    S3_REGION=os.getenv('S3_REGION')
    TMDB_API_KEY=os.getenv('TMDB_API')
