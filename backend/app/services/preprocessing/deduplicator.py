import hashlib
import re
from typing import Set

class Deduplicator:
    """
    Detects exact and near-duplicate text content using normalized fingerprint hashing.
    """
    def __init__(self):
        self._seen_hashes: Set[str] = set()

    @staticmethod
    def compute_fingerprint(text: str) -> str:
        # Lowercase, remove punctuation and extra spaces
        normalized = re.sub(r'[^\w\s]', '', text.lower())
        tokens = sorted(list(set(normalized.split())))
        condensed = " ".join(tokens)
        return hashlib.sha256(condensed.encode('utf-8')).hexdigest()

    def is_duplicate(self, text: str) -> bool:
        fingerprint = self.compute_fingerprint(text)
        if fingerprint in self._seen_hashes:
            return True
        self._seen_hashes.add(fingerprint)
        return False

    def reset(self):
        self._seen_hashes.clear()
