import os
import motor.motor_asyncio
from bson import ObjectId
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME", "tradevault")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URL)
database = client[DATABASE_NAME]
accounts_collection = database.get_collection("accounts")

def account_helper(account) -> dict:
    return {
        "id": str(account.get("_id", "")),
        "name": account.get("name", ""),
        "server": account.get("server", ""),
        "accountId": account.get("accountId", ""),
        "password": account.get("password", ""),
    }

async def retrieve_accounts():
    accounts = []
    async for account in accounts_collection.find():
        accounts.append(account_helper(account))
    return accounts

async def add_account(account_data: dict) -> dict:
    # Remove 'id' if present (it should be _id in MongoDB)
    if "id" in account_data:
        del account_data["id"]
    
    account = await accounts_collection.insert_one(account_data)
    new_account = await accounts_collection.find_one({"_id": account.inserted_id})
    return account_helper(new_account)

async def update_account(id: str, data: dict):
    if len(data) < 1:
        return False
    
    # Remove 'id' from data if present to avoid updating _id
    if "id" in data:
        del data["id"]
        
    account = await accounts_collection.find_one({"_id": ObjectId(id)})
    if account:
        updated_account = await accounts_collection.update_one(
            {"_id": ObjectId(id)}, {"$set": data}
        )
        if updated_account:
            return True
        return False
    return False

async def delete_account(id: str):
    account = await accounts_collection.find_one({"_id": ObjectId(id)})
    if account:
        await accounts_collection.delete_one({"_id": ObjectId(id)})
        return True
    return False
