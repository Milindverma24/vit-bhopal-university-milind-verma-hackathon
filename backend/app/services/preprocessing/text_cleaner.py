import re
import html
from typing import Tuple

class TextCleaner:
    """
    Financial text preprocessor.
    Normalizes encoding and whitespace, preserves negation and directional terms,
    standardizes ticker formats, and cleans HTML artifacts.
    """

    @staticmethod
    def clean(text: str) -> str:
        if not text:
            return ""
        
        # Unescape HTML entities
        cleaned = html.unescape(text)
        
        # Remove raw HTML tags
        cleaned = re.sub(r'<[^>]+>', ' ', cleaned)
        
        # Standardize curly quotes and dashes
        cleaned = cleaned.replace("“", "\"").replace("”", "\"")
        cleaned = cleaned.replace("‘", "'").replace("’", "'")
        cleaned = cleaned.replace("—", " - ").replace("–", " - ")
        
        # Remove raw URLs but preserve context marker
        cleaned = re.sub(r'https?://\S+|www\.\S+', '[URL]', cleaned)
        
        # Normalize multiple spaces, tabs, and newlines
        cleaned = re.sub(r'\s+', ' ', cleaned).strip()
        
        return cleaned

    @staticmethod
    def extract_tickers_syntax(text: str) -> list[str]:
        """Extract explicit cashtags like $AAPL, $MSFT"""
        matches = re.findall(r'\$([A-Za-z]{1,5})\b', text)
        return [m.upper() for m in matches]
