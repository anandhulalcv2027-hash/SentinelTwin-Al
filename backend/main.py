from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings
from app.seeds.seed import seed


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure default roles and permissions exist in database on startup
    try:
        seed()
    except Exception as exc:
        print(f"Warning: Automatic database seeding failed: {exc}")
    yield


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    api_router,
    prefix=settings.api_v1_prefix,
)


@app.get("/")
def root():
    return {
        "message": "SentinelTwin AI Backend Running"
    }
