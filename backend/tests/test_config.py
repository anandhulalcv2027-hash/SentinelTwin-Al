print("Program started")

from app.core.config import settings

print("Settings loaded")
print(settings.app_name)
print(settings.database_url)

print("Program finished")