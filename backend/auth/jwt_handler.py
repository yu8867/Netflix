from datetime import datetime, timedelta
from jose import jwt, JWTError
from config import config

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + (timedelta(minutes=int(config.ACCESS_TOKEN_EXPIRE_MINUTES)))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, key=config.SECRET_KEY, algorithm=config.ALGORITHM)


def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + (timedelta(minutes=int(config.ACCESS_TOKEN_EXPIRE_MINUTES)*24*60))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, key=config.REFRESH_SECRET_KEY, algorithm=config.ALGORITHM)


def verify_access_token(token: str):
    try:
        payload = jwt.decode(token=token, key=config.SECRET_KEY, algorithms=[config.ALGORITHM])
        return payload.get("sub")
    except JWTError:
        return None
    

def decode_refresh_token(token: str):
    return jwt.decode(token, key=config.REFRESH_SECRET_KEY, algorithms=[config.ALGORITHM])