import asyncio
from backend.database import retrieve_accounts

async def debug_retrieve():
    try:
        accounts = await retrieve_accounts()
        print(f"Successfully retrieved {len(accounts)} accounts.")
        for acc in accounts:
            print(acc)
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(debug_retrieve())
