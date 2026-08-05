from sqlalchemy import text

from app.db.session import engine
print("Testing PostgreSQL connection...\n")

try:
    with engine.connect() as connection:
        version = connection.execute(text("SELECT version();"))

        print("✅ Connection Successful!")
        print(version.scalar())

except Exception as e:
    print("❌ Connection Failed!")
    print(e)