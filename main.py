from fastapi import FastAPI, Body, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from database import (
    retrieve_accounts,
    add_account,
    update_account,
    delete_account
)
from models import AccountCreate, AccountUpdate, UserLogin, Token

app = FastAPI(title="TradeVault API")

# Enable CORS for React frontend (Vite default is 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.options("/{rest_of_path:path}")
async def preflight_handler(rest_of_path: str):
    return {}

@app.get("/")
async def root():
    return {"message": "TradeVault API is Live and Secure", "status": "healthy", "service": "backend"}

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
    try:
        accounts = await retrieve_accounts()
        return accounts
    except Exception as e:
        print(f"ERROR fetching accounts: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/accounts", status_code=201)
async def create_account(account: AccountCreate = Body(...)):
    try:
        new_account = await add_account(account.dict())
        return new_account
    except Exception as e:
        print(f"ERROR creating account: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/accounts/{id}")
async def update_account_data(id: str, account: AccountUpdate = Body(...)):
    try:
        updated = await update_account(id, account.dict())
        if updated:
            return {"message": "Account updated successfully"}
        raise HTTPException(status_code=404, detail=f"Account {id} not found")
    except Exception as e:
        print(f"ERROR updating account {id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/accounts/{id}")
async def delete_account_data(id: str):
    try:
        deleted = await delete_account(id)
        if deleted:
            return {"message": "Account deleted successfully"}
        raise HTTPException(status_code=404, detail=f"Account {id} not found")
    except Exception as e:
        print(f"ERROR deleting account {id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
