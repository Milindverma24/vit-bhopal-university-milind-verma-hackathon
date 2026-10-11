import os
from pathlib import Path
from typing import List, Dict, Any
from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data"

class Settings(BaseSettings):
    APP_NAME: str = "RiskPulse AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # Storage & Persistence
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR / 'riskpulse.db'}")
    
    # External APIs (Optional - system runs 100% locally by default)
    NEWSAPI_KEY: str = os.getenv("NEWSAPI_KEY", "")
    FINNHUB_API_KEY: str = os.getenv("FINNHUB_API_KEY", "")
    ENABLE_EXTERNAL_NEWS: bool = os.getenv("ENABLE_EXTERNAL_NEWS", "false").lower() == "true"
    ENABLE_PRETRAINED_NLP: bool = os.getenv("ENABLE_PRETRAINED_NLP", "false").lower() == "true"
    
    # CORS
    FRONTEND_ORIGIN: str = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
    
    # Quantitative Tactical Index Rebalancing Parameters
    DEFAULT_ALPHA: float = 0.45          # Sentiment sensitivity
    DEFAULT_BETA: float = 0.65           # Risk penalty multiplier
    DEFAULT_MIN_WEIGHT: float = 0.02     # Minimum single-stock weight (2%)
    DEFAULT_MAX_WEIGHT: float = 0.18     # Maximum single-stock weight (18%)
    DEFAULT_MAX_TURNOVER: float = 0.25   # Maximum single-period turnover limit (25%)
    CONFIDENCE_THRESHOLD: float = 0.50   # Signal confidence gate
    NO_TRADE_BAND: float = 0.005         # 50 bps no-trade deadband to minimize churning
    
    # Portfolio Stress Testing defaults
    BASELINE_PORTFOLIO_VALUE: float = 500_000_000.0  # $500M Synthetic Wholesale Bank Portfolio
    
    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()

# Standard Constituent Universe: 15 Core Public Companies Across 7 Sectors
STOCK_BASKET: List[Dict[str, Any]] = [
    {"ticker": "AAPL", "name": "Apple Inc.", "sector": "Technology", "country": "USA", "base_weight": 0.0667, "aliases": ["Apple", "AAPL", "iPhone maker", "Apple Inc"]},
    {"ticker": "MSFT", "name": "Microsoft Corporation", "sector": "Technology", "country": "USA", "base_weight": 0.0667, "aliases": ["Microsoft", "MSFT", "Windows maker", "Azure", "Microsoft Corp"]},
    {"ticker": "NVDA", "name": "NVIDIA Corporation", "sector": "Technology", "country": "USA", "base_weight": 0.0667, "aliases": ["Nvidia", "NVDA", "Nvidia Corp", "NVIDIA"]},
    {"ticker": "JPM", "name": "JPMorgan Chase & Co.", "sector": "Financial Services", "country": "USA", "base_weight": 0.0667, "aliases": ["JPMorgan", "JPMorgan Chase", "JPM", "JP Morgan", "Chase"]},
    {"ticker": "BAC", "name": "Bank of America Corp.", "sector": "Financial Services", "country": "USA", "base_weight": 0.0667, "aliases": ["Bank of America", "BAC", "BofA"]},
    {"ticker": "XOM", "name": "Exxon Mobil Corporation", "sector": "Energy", "country": "USA", "base_weight": 0.0667, "aliases": ["ExxonMobil", "Exxon", "XOM", "Exxon Mobil"]},
    {"ticker": "CVX", "name": "Chevron Corporation", "sector": "Energy", "country": "USA", "base_weight": 0.0667, "aliases": ["Chevron", "CVX", "Chevron Corp"]},
    {"ticker": "JNJ", "name": "Johnson & Johnson", "sector": "Healthcare", "country": "USA", "base_weight": 0.0667, "aliases": ["Johnson & Johnson", "JNJ", "J&J"]},
    {"ticker": "PFE", "name": "Pfizer Inc.", "sector": "Healthcare", "country": "USA", "base_weight": 0.0667, "aliases": ["Pfizer", "PFE", "Pfizer Inc"]},
    {"ticker": "AMZN", "name": "Amazon.com Inc.", "sector": "Consumer Discretionary", "country": "USA", "base_weight": 0.0667, "aliases": ["Amazon", "AMZN", "Amazon.com", "AWS"]},
    {"ticker": "WMT", "name": "Walmart Inc.", "sector": "Consumer Staples", "country": "USA", "base_weight": 0.0667, "aliases": ["Walmart", "WMT", "Wal-Mart"]},
    {"ticker": "PG", "name": "Procter & Gamble Co.", "sector": "Consumer Staples", "country": "USA", "base_weight": 0.0667, "aliases": ["Procter & Gamble", "PG", "P&G"]},
    {"ticker": "CAT", "name": "Caterpillar Inc.", "sector": "Industrials", "country": "USA", "base_weight": 0.0667, "aliases": ["Caterpillar", "CAT", "Caterpillar Inc"]},
    {"ticker": "LMT", "name": "Lockheed Martin Corp.", "sector": "Industrials", "country": "USA", "base_weight": 0.0667, "aliases": ["Lockheed Martin", "LMT", "Lockheed"]},
    {"ticker": "NEE", "name": "NextEra Energy Inc.", "sector": "Utilities", "country": "USA", "base_weight": 0.0662, "aliases": ["NextEra Energy", "NEE", "NextEra"]},
]

# Complete Event Taxonomies Required by Hackathon Specification
EVENT_CATEGORIES: List[str] = [
    "Geopolitical Event",
    "Macroeconomic Event",
    "Monetary Policy",
    "Interest Rate Change",
    "Inflation",
    "Credit Event",
    "Corporate Earnings",
    "Merger and Acquisition",
    "Product Launch",
    "Regulatory Action",
    "Fraud or Investigation",
    "Cybersecurity Incident",
    "Supply Chain Disruption",
    "Natural Disaster",
    "Market Volatility",
    "Liquidity Risk",
    "Default or Bankruptcy",
    "Operational Risk",
    "Positive Business Development",
    "Other"
]
