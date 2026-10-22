"""
ASGI application entrypoint for uvicorn app.main:app
Re-exports the FastAPI app from backend root main.py
"""
import sys
from pathlib import Path

# Ensure backend root directory is in python search path
_backend_root = Path(__file__).resolve().parent.parent
if str(_backend_root) not in sys.path:
    sys.path.insert(0, str(_backend_root))

from main import app  # noqa: E402, F401
