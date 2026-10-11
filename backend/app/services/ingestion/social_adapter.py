import json
from pathlib import Path
from typing import List, Dict, Any, Optional
from datetime import datetime
from app.config import DATA_DIR
from app.services.ingestion.synthetic_generator import SyntheticDataGenerator

class SocialIngestionAdapter:
    """
    Social Media Ingestion Adapter.
    Ingests financial discourse, FinTwit cashtag trends, retail sentiment posts,
    and macroeconomic trader discussions with dynamic live simulation.
    """

    def __init__(self):
        self.last_fetch_time: Optional[datetime] = None
        self.last_provider: str = "FinTwit Sentiment Feed"

    def fetch_posts(self, count: int = 15, db_existing_ids: Optional[set] = None) -> List[Dict[str, Any]]:
        """
        Fetch social media posts.
        Generates fresh, high-fidelity simulated FinTwit/StockTwits posts
        with unique IDs and current timestamps so they immediately populate downstream feeds.
        """
        bounded_count = max(5, min(count, 25))
        self.last_fetch_time = datetime.utcnow()
        # Always generate fresh dynamic records with recent timestamps on interactive fetch
        return SyntheticDataGenerator.generate_social_records(count=bounded_count, seed=None)

social_adapter = SocialIngestionAdapter()
