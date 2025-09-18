from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str
    email: str

class UserLogin(BaseModel):
    password: str
    email: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserInformation(BaseModel):
    id: int
    username: str
    email: str

class UserLogout(BaseModel):
    message: str