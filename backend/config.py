import os
from dotenv import load_dotenv
load_dotenv()

class config:
    SECRET_KEY=os.getenv('SECRET_KEY')
    REFRESH_SECRET_KEY=os.getenv('REFRESH_SECRET_KEY')
    ALGORITHM=os.getenv('ALGORITHM')
    ACCESS_TOKEN_EXPIRE_MINUTES=os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES')
    REFRESH_TOKEN_EXPIRE_MINUTES=os.getenv('REFRESH_TOKEN_EXPIRE_MINUTES')