import re
from typing import List, Dict, Any, Tuple
from app.config import STOCK_BASKET
from app.schemas.schemas import EntityInfo

COUNTRY_KEYWORDS = {
    "USA": ["united states", "u.s.", "us economy", "america", "federal reserve", "wall street", "washington"],
    "China": ["china", "chinese", "beijing", "pboc", "shanghai"],
    "UK": ["uk", "united kingdom", "britain", "bank of england", "london"],
    "Eurozone": ["europe", "european union", "ecb", "germany", "france"],
    "Japan": ["japan", "japanese", "tokyo", "bank of japan"],
    "Global": ["global", "worldwide", "international", "multinational"]
}

SECTOR_KEYWORDS = {
    "Technology": ["tech", "software", "semiconductor", "chips", "cloud", "artificial intelligence", "ai"],
    "Financial Services": ["banking", "bank", "lender", "credit", "treasury", "wall street", "brokerage"],
    "Energy": ["oil", "gas", "petroleum", "crude", "energy", "opec", "drilling", "refinery"],
    "Healthcare": ["pharmaceutical", "drug", "healthcare", "fda", "clinical", "biotech"],
    "Consumer Discretionary": ["retail", "ecommerce", "consumer spending", "automotive", "luxury"],
    "Consumer Staples": ["packaged goods", "household goods", "groceries", "supermarket"],
    "Industrials": ["manufacturing", "aerospace", "defense", "machinery", "logistics"],
    "Utilities": ["power grid", "electricity", "clean energy", "utilities"]
}

class EntityExtractor:
    def __init__(self):
        # Build fast lookup maps from STOCK_BASKET
        self.ticker_to_company = {item["ticker"]: item for item in STOCK_BASKET}
        self.aliases_map: Dict[str, str] = {}
        for item in STOCK_BASKET:
            ticker = item["ticker"]
            # Register ticker
            self.aliases_map[ticker.lower()] = ticker
            # Register aliases
            for alias in item.get("aliases", []):
                self.aliases_map[alias.lower()] = ticker

    def extract(self, text: str, headline: str = "") -> Tuple[List[EntityInfo], Dict[str, Any]]:
        full_text = f"{headline} {text}".strip()
        lower_text = full_text.lower()
        headline_lower = (headline or "").lower()

        detected_tickers: Dict[str, int] = {}

        # 1. Check for cashtags like $AAPL
        cashtags = re.findall(r'\$([A-Za-z]{1,5})\b', full_text)
        for tag in cashtags:
            t = tag.upper()
            if t in self.ticker_to_company:
                detected_tickers[t] = detected_tickers.get(t, 0) + 10  # Cashtag gives high priority

        # 2. Check for company names and aliases
        for alias, ticker in self.aliases_map.items():
            # Use word boundaries
            pattern = r'\b' + re.escape(alias) + r'\b'
            matches = len(re.findall(pattern, lower_text))
            if matches > 0:
                # Bonus if mentioned in headline
                headline_matches = len(re.findall(pattern, headline_lower))
                weight = matches + (headline_matches * 5)
                detected_tickers[ticker] = detected_tickers.get(ticker, 0) + weight

        # Sort detected tickers by frequency/weight
        sorted_tickers = sorted(detected_tickers.items(), key=lambda x: x[1], reverse=True)

        entities: List[EntityInfo] = []
        primary_ticker = None
        primary_company = None

        if sorted_tickers:
            for idx, (ticker, _) in enumerate(sorted_tickers):
                info = self.ticker_to_company[ticker]
                is_primary = (idx == 0)
                if is_primary:
                    primary_ticker = ticker
                    primary_company = info["name"]
                entities.append(EntityInfo(
                    name=info["name"],
                    ticker=ticker,
                    entity_type="company",
                    is_primary=is_primary,
                    sector=info["sector"]
                ))
        else:
            # Check if this is a market-wide or macroeconomic entity
            entities.append(EntityInfo(
                name="Market-Wide / Macro",
                ticker=None,
                entity_type="market",
                is_primary=True,
                sector="Cross-Sector Macro"
            ))

        # Detect Countries
        detected_countries = []
        for country, kws in COUNTRY_KEYWORDS.items():
            for kw in kws:
                if re.search(r'\b' + re.escape(kw) + r'\b', lower_text):
                    detected_countries.append(country)
                    break

        # Detect Sectors
        detected_sectors = []
        for sec, kws in SECTOR_KEYWORDS.items():
            for kw in kws:
                if re.search(r'\b' + re.escape(kw) + r'\b', lower_text):
                    detected_sectors.append(sec)
                    break
        if primary_ticker and self.ticker_to_company[primary_ticker]["sector"] not in detected_sectors:
            detected_sectors.append(self.ticker_to_company[primary_ticker]["sector"])

        metadata = {
            "primary_ticker": primary_ticker,
            "primary_company": primary_company,
            "countries": detected_countries or ["USA"],
            "sectors": detected_sectors or (["Cross-Sector"] if not primary_ticker else [self.ticker_to_company[primary_ticker]["sector"]])
        }

        return entities, metadata
