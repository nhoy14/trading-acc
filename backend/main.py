from fastapi import FastAPI, Body, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from .database import (
    retrieve_accounts,
    add_account,
    update_account,
    delete_account
)
from .models import AccountCreate, AccountUpdate, UserLogin, Token

app = FastAPI(title="TradeVault API")

# Enable CORS for React frontend (Vite default is 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to localhost:5173
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/login", response_model=Token)
async def login(user: UserLogin):
    # Mock authentication (admin/1234 as per original logic)
    if user.username == "admin@tradevault.com" and user.password == "1234":
        return {"access_token": "mock_jwt_token_for_tradevault", "token_type": "bearer"}
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect username or password",
    )

@app.get("/accounts")
async def get_accounts():
    accounts = await retrieve_accounts()
    return accounts

@app.post("/accounts", status_code=201)
async def create_account(account: AccountCreate = Body(...)):
    new_account = await add_account(account.dict())
    return new_account

@app.put("/accounts/{id}")
async def update_account_data(id: str, account: AccountUpdate = Body(...)):
    updated = await update_account(id, account.dict())
    if updated:
        return {"message": "Account updated successfully"}
    raise HTTPException(status_code=404, detail=f"Account {id} not found")

@app.delete("/accounts/{id}")
async def delete_account_data(id: str):
    deleted = await delete_account(id)
    if deleted:
        return {"message": "Account deleted successfully"}
    raise HTTPException(status_code=404, detail=f"Account {id} not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
