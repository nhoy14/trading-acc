from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class AccountBase(BaseModel):
    name: str
    server: str
    accountId: str
    password: str

class AccountCreate(AccountBase):
    pass

class AccountUpdate(AccountBase):
    pass

class Account(AccountBase):
    id: str = Field(alias="_id")
    created_at: datetime = Field(default_factory=datetime.now)

    class Config:
        populate_by_name = True

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
