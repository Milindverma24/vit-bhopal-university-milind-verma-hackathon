from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.api.routes import router, _init_source_statuses
from app.services.index_rebalancing.rebalancer import rebalancer
from app.services.portfolio.portfolio_manager import PortfolioManager
from app.services.ingestion.synthetic_generator import SyntheticDataGenerator

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    Base.metadata.create_all(bind=engine)
    
    # Pre-seed baseline data on startup if clean database
    db = SessionLocal()
    try:
        _init_source_statuses(db)
        rebalancer.initialize_constituents(db)
        PortfolioManager.initialize_portfolio(db)
        SyntheticDataGenerator.save_synthetic_files()
    finally:
        db.close()
    
    yield

app = FastAPI(
    title="RiskPulse AI - Financial Risk Intelligence Platform",
    description="Real-Time Financial Risk Intelligence, Tactical Index Rebalancing, and Strategic Portfolio Stress Testing Engine for S&P Global & Crisil Hackathon 2026.",
    version=settings.APP_VERSION,
    lifespan=lifespan
)

# Enable CORS for frontend development and production containers
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        settings.FRONTEND_ORIGIN,
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
def root():
    return {
        "service": "RiskPulse AI Backend",
        "docs_url": "/docs",
        "health_url": "/api/health",
        "status": "operational"
    }
