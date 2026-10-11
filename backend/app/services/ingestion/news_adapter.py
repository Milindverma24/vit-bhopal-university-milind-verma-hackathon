import os
import json
import time
import uuid
import hashlib
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Any, Optional, Tuple
import httpx
from app.config import settings, DATA_DIR
from app.services.ingestion.synthetic_generator import SyntheticDataGenerator

class NewsIngestionAdapter:
    """
    Financial News Ingestion Adapter supporting NewsAPI and Finnhub with rate-limit
    protection, bounded retries, and high-fidelity dynamic synthetic financial news wires.
    """

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.NEWSAPI_KEY
        self.finnhub_key = settings.FINNHUB_API_KEY
        self.enable_external = settings.ENABLE_EXTERNAL_NEWS and bool(self.api_key or self.finnhub_key)
        self.last_fetch_time: Optional[datetime] = None
        self.cooldown_until: Optional[datetime] = None
        self.is_rate_limited: bool = False
        self.last_error: Optional[str] = None
        self.last_provider: str = "Synthetic Financial News Wire"
        self._is_fetching: bool = False

    def fetch_with_metadata(
        self,
        count: int = 10,
        db_existing_ids: Optional[set] = None
    ) -> Dict[str, Any]:
        """
        Fetch articles with comprehensive metadata and rate-limit guardrails.
        Returns a dictionary containing articles, provider info, and rate-limit status.
        """
        # Strictly limit to at most 10 news articles in one request
        bounded_count = max(1, min(count, 10))
        now = datetime.utcnow()

        # Check cooldown
        if self.cooldown_until and now < self.cooldown_until:
            wait_seconds = int((self.cooldown_until - now).total_seconds())
            return {
                "articles": [],
                "provider": self.last_provider,
                "rate_limited": True,
                "error": f"Provider rate limit active. Cooldown expires in {wait_seconds}s.",
                "status": "rate_limited"
            }

        self._is_fetching = True
        self.last_fetch_time = now
        self.is_rate_limited = False
        self.last_error = None

        articles: List[Dict[str, Any]] = []
        provider_used = "Synthetic Financial News Wire"

        try:
            # 1. Attempt external Finnhub if configured
            if self.enable_external and self.finnhub_key:
                articles, provider_used = self._fetch_finnhub(bounded_count)
                if articles:
                    self.last_provider = provider_used
                    return {
                        "articles": articles,
                        "provider": provider_used,
                        "rate_limited": False,
                        "error": None,
                        "status": "success"
                    }

            # 2. Attempt external NewsAPI if configured
            if self.enable_external and self.api_key:
                articles, provider_used = self._fetch_newsapi(bounded_count)
                if articles:
                    self.last_provider = provider_used
                    return {
                        "articles": articles,
                        "provider": provider_used,
                        "rate_limited": False,
                        "error": None,
                        "status": "success"
                    }

        except Exception as e:
            self.last_error = str(e)
            print(f"[NewsIngestionAdapter] External fetch encountered error: {e}. Falling back to dynamic generator.")

        finally:
            self._is_fetching = False

        # 3. Dynamic Local & Synthetic Generation Mode
        # Guarantees fresh articles with recent publication timestamps on every fetch
        fresh_articles = SyntheticDataGenerator.generate_news_records(count=bounded_count, seed=None)
        self.last_provider = "Synthetic Financial News Wire"

        return {
            "articles": fresh_articles,
            "provider": self.last_provider,
            "rate_limited": self.is_rate_limited,
            "error": self.last_error,
            "status": "success"
        }

    def fetch_articles(self, count: int = 10, db_existing_ids: Optional[set] = None) -> List[Dict[str, Any]]:
        """Backwards-compatible API returning raw articles list."""
        res = self.fetch_with_metadata(count=count, db_existing_ids=db_existing_ids)
        return res.get("articles", [])

    def _fetch_finnhub(self, count: int) -> Tuple[List[Dict[str, Any]], str]:
        url = f"https://finnhub.io/api/v1/news?category=general&token={self.finnhub_key}"
        for attempt in range(2):
            try:
                with httpx.Client(timeout=4.0) as client:
                    resp = client.get(url)
                    if resp.status_code == 200:
                        raw = resp.json()
                        if isinstance(raw, list) and raw:
                            normalized = [self._normalize_finnhub(a) for a in raw[:count]]
                            return normalized, "Finnhub Institutional News Wire"
                    elif resp.status_code == 429:
                        self.is_rate_limited = True
                        retry_after = int(resp.headers.get("Retry-After", 30))
                        self.cooldown_until = datetime.utcnow() + timedelta(seconds=retry_after)
                        self.last_error = f"Finnhub HTTP 429: Rate limit exceeded. Cooldown {retry_after}s applied."
                        break
            except Exception as e:
                if attempt == 0:
                    time.sleep(0.5)
                else:
                    raise e
        return [], "Finnhub Institutional News Wire"

    def _fetch_newsapi(self, count: int) -> Tuple[List[Dict[str, Any]], str]:
        url = f"https://newsapi.org/v2/top-headlines?category=business&language=en&pageSize={count}&apiKey={self.api_key}"
        for attempt in range(2):
            try:
                with httpx.Client(timeout=4.0) as client:
                    resp = client.get(url)
                    if resp.status_code == 200:
                        data = resp.json()
                        articles = data.get("articles", [])
                        if articles:
                            normalized = [self._normalize_newsapi(a) for a in articles[:count]]
                            return normalized, "NewsAPI Business Wire"
                    elif resp.status_code == 429:
                        self.is_rate_limited = True
                        retry_after = int(resp.headers.get("Retry-After", 30))
                        self.cooldown_until = datetime.utcnow() + timedelta(seconds=retry_after)
                        self.last_error = f"NewsAPI HTTP 429: Rate limit exceeded. Cooldown {retry_after}s applied."
                        break
            except Exception as e:
                if attempt == 0:
                    time.sleep(0.5)
                else:
                    raise e
        return [], "NewsAPI Business Wire"

    def _normalize_finnhub(self, raw: Dict[str, Any]) -> Dict[str, Any]:
        dt = datetime.utcfromtimestamp(raw.get("datetime", int(datetime.utcnow().timestamp())))
        art_id = f"finnhub-{raw.get('id', hashlib.sha256(raw.get('url', '').encode()).hexdigest()[:12])}"
        return {
            "article_id": art_id,
            "source_type": "financial_news",
            "source_name": raw.get("source") or "Finnhub Market Wire",
            "headline": raw.get("headline") or "Financial Market Update",
            "description": raw.get("summary") or "",
            "content": raw.get("summary") or raw.get("headline") or "",
            "url": raw.get("url"),
            "published_at": dt.isoformat(),
            "ingested_at": datetime.utcnow().isoformat(),
            "company_entities": [raw.get("related")] if raw.get("related") else [],
            "ticker_symbols": [raw.get("related")] if raw.get("related") else [],
            "country_entities": ["USA"],
            "sector_entities": [],
            "is_synthetic": False,
            "data_source_label": "Live Finnhub Financial News Stream"
        }

    def _normalize_newsapi(self, raw: Dict[str, Any]) -> Dict[str, Any]:
        url_hash = hashlib.sha256(raw.get('url', '').encode()).hexdigest()[:12]
        return {
            "article_id": f"newsapi-{url_hash}",
            "source_type": "financial_news",
            "source_name": raw.get("source", {}).get("name", "NewsAPI Public Wire"),
            "headline": raw.get("title") or "Financial News Update",
            "description": raw.get("description") or "",
            "content": raw.get("content") or raw.get("description") or raw.get("title") or "",
            "url": raw.get("url"),
            "published_at": raw.get("publishedAt") or datetime.utcnow().isoformat(),
            "ingested_at": datetime.utcnow().isoformat(),
            "company_entities": [],
            "ticker_symbols": [],
            "country_entities": ["USA"],
            "sector_entities": [],
            "is_synthetic": False,
            "data_source_label": "Live External NewsAPI Stream"
        }

news_adapter = NewsIngestionAdapter()
