import json
import os
import asyncio
from dotenv import load_dotenv
import motor.motor_asyncio

async def migrate_data():
    load_dotenv('./backend/.env')
    mongodb_url = os.getenv("MONGODB_URL")
    database_name = os.getenv("DATABASE_NAME", "tradevault")
    
    client = motor.motor_asyncio.AsyncIOMotorClient(mongodb_url)
    db = client[database_name]
    collection = db.get_collection("accounts")
    
    json_file = "accounts_db.json"
    if os.path.exists(json_file):
        with open(json_file, "r") as f:
            try:
                data = json.load(f)
                if not isinstance(data, list):
                    data = [data]
                
                for item in data:
                    # Check if already exists to avoid duplicates
                    existing = await collection.find_one({"accountId": item["accountId"]})
                    if not existing:
                        # Remove 'id' from JSON as MongoDB uses _id
                        if "id" in item:
                            del item["id"]
                        await collection.insert_one(item)
                        print(f"Migrated: {item.get('name', 'Unknown')}")
                    else:
                        print(f"Skipped (exists): {item.get('name', 'Unknown')}")
            except Exception as e:
                print(f"Error loading JSON: {e}")
    else:
        print("JSON file not found.")

if __name__ == "__main__":
    asyncio.run(migrate_data())
