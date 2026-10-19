import re
from typing import Tuple, Dict, Any
from app.config import settings

# Loughran-McDonald & Wall Street Domain Financial Lexicons
POSITIVE_TERMS: Dict[str, float] = {
    "beat": 0.7, "beats": 0.7, "outperformed": 0.8, "outperform": 0.8, "outperforming": 0.8,
    "surged": 0.8, "surge": 0.75, "surging": 0.8, "rally": 0.7, "rallied": 0.7, "jumped": 0.6,
    "growth": 0.5, "record profit": 0.9, "expansion": 0.6, "upgrade": 0.75,
    "upgraded": 0.75, "strong": 0.5, "robust": 0.6, "optimistic": 0.5,
    "breakthrough": 0.8, "bullish": 0.7, "gains": 0.5, "positive": 0.5,
    "exceeded": 0.7, "dividend hike": 0.65, "soared": 0.8, "all-time high": 0.85,
    "recovery": 0.6, "rebound": 0.6, "profitability": 0.6, "innovative": 0.5,
    "revenue beat": 0.8, "approval": 0.6, "inflow": 0.5, "liquidity surplus": 0.7
}

NEGATIVE_TERMS: Dict[str, float] = {
    "plunged": 0.85, "plunge": 0.8, "plunging": 0.85, "missed": 0.65, "miss": 0.6,
    "slumped": 0.7, "slump": 0.65, "downgrade": 0.8, "downgraded": 0.8,
    "collapse": 0.95, "default": 0.95, "defaulted": 0.95, "bankruptcy": 1.0,
    "insolvent": 0.95, "impairment": 0.8, "write-down": 0.85, "lawsuit": 0.6,
    "investigation": 0.7, "fraud": 0.95, "probe": 0.65, "scandal": 0.85,
    "deficit": 0.6, "loss": 0.6, "losses": 0.65, "bearish": 0.7,
    "selloff": 0.75, "drop": 0.5, "dropped": 0.5, "decline": 0.5,
    "declined": 0.5, "fell": 0.5, "weak": 0.5, "warning": 0.6,
    "slashed": 0.75, "cut": 0.5, "subpoena": 0.7, "breach": 0.8,
    "cyberattack": 0.85, "recession": 0.8, "stagflation": 0.85,
    "liquidity crisis": 0.9, "margin squeeze": 0.65, "turmoil": 0.75, "disruption": 0.6
}

INTENSIFIERS: Dict[str, float] = {
    "sharply": 1.4, "substantially": 1.3, "significantly": 1.3,
    "immensely": 1.5, "critically": 1.4, "severely": 1.5,
    "massively": 1.4, "unprecedented": 1.5, "dramatically": 1.4
}

DIMINISHERS: Dict[str, float] = {
    "slightly": 0.6, "modestly": 0.7, "marginally": 0.6,
    "partially": 0.8, "somewhat": 0.7
}

NEGATION_TOKENS = {"not", "never", "no", "without", "hardly", "barely", "failed", "fails", "failing", "neither", "nor"}
NEGATION_PHRASES = ["failed to", "fails to", "did not", "does not", "could not", "was not", "were not", "unable to"]

class FinancialSentimentAnalyzer:
    """
    Financial sentiment analyzer with FinBERT integration support and
    transparent, high-precision domain-lexicon & syntactic grammar fallback.
    """
    def __init__(self):
        self.use_pretrained = settings.ENABLE_PRETRAINED_NLP
        self.finbert_pipeline = None
        
        if self.use_pretrained:
            try:
                from transformers import pipeline
                # Load FinBERT pipeline if transformers and internet/cache are available
                self.finbert_pipeline = pipeline("text-classification", model="ProsusAI/finbert")
            except Exception as e:
                # Graceful fallback to deterministic engine
                self.use_pretrained = False
                self.finbert_pipeline = None

    def analyze(self, text: str, headline: str = "") -> Tuple[float, str, str, float]:
        """
        Returns:
            (sentiment_score [-1.0 to +1.0], label [Positive, Negative, Neutral, Mixed], method, confidence [0.0 to 1.0])
        """
        full_text = f"{headline}. {text}".strip()
        
        if self.finbert_pipeline:
            try:
                res = self.finbert_pipeline(full_text[:512])[0]
                label_map = {"positive": "Positive", "negative": "Negative", "neutral": "Neutral"}
                label = label_map.get(res["label"].lower(), "Neutral")
                score_val = res["score"]
                
                if label == "Positive":
                    sentiment_score = round(score_val * 0.95, 2)
                elif label == "Negative":
                    sentiment_score = round(-score_val * 0.95, 2)
                else:
                    sentiment_score = 0.0
                
                return sentiment_score, label, "FinBERT (HuggingFace)", round(score_val, 2)
            except Exception:
                pass  # Fallback seamlessly to deterministic engine

        # Deterministic Domain-Specific Lexicon-Syntactic Analysis
        return self._lexicon_syntax_analyze(full_text)

    def _lexicon_syntax_analyze(self, text: str) -> Tuple[float, str, str, float]:
        clean_text = text.lower()
        sentences = re.split(r'[.!?]+', clean_text)
        
        pos_score = 0.0
        neg_score = 0.0
        match_count = 0

        for sentence in sentences:
            words = sentence.split()
            if not words:
                continue
            
            for i, word in enumerate(words):
                # Check for 2-word phrases
                phrase_2 = f"{word} {words[i+1]}" if i + 1 < len(words) else ""
                
                # Check intensifiers / diminishers and negation in preceding window
                window_tokens = words[max(0, i-3):i]
                window_str = " ".join(window_tokens)
                modifier = 1.0
                is_negated = False
                
                if any(phrase in window_str for phrase in NEGATION_PHRASES):
                    is_negated = True
                
                for w in window_tokens:
                    if w in NEGATION_TOKENS:
                        is_negated = True
                    if w in INTENSIFIERS:
                        modifier *= INTENSIFIERS[w]
                    if w in DIMINISHERS:
                        modifier *= DIMINISHERS[w]

                # Match phrases or single words
                matched_pos = 0.0
                matched_neg = 0.0

                if phrase_2 in POSITIVE_TERMS:
                    matched_pos = POSITIVE_TERMS[phrase_2]
                elif word in POSITIVE_TERMS:
                    matched_pos = POSITIVE_TERMS[word]

                if phrase_2 in NEGATIVE_TERMS:
                    matched_neg = NEGATIVE_TERMS[phrase_2]
                elif word in NEGATIVE_TERMS:
                    matched_neg = NEGATIVE_TERMS[word]

                if matched_pos > 0:
                    match_count += 1
                    effective = matched_pos * modifier
                    if is_negated:
                        neg_score += effective * 0.8  # "did not outperform" -> negative
                    else:
                        pos_score += effective

                if matched_neg > 0:
                    match_count += 1
                    effective = matched_neg * modifier
                    if is_negated:
                        pos_score += effective * 0.7  # "did not decline" -> positive
                    else:
                        neg_score += effective

        if match_count == 0:
            return 0.0, "Neutral", "Financial Lexicon-Syntactic Engine", 0.70

        total_magnitude = pos_score + neg_score
        net_raw = (pos_score - neg_score) / (total_magnitude + 1.0)
        
        # Scale to -1.0 .. +1.0
        bounded_score = max(-1.0, min(1.0, round(net_raw * 1.5, 2)))

        # Categorize
        if pos_score > 0.6 and neg_score > 0.6 and abs(pos_score - neg_score) < 0.35:
            label = "Mixed"
        elif bounded_score >= 0.20:
            label = "Positive"
        elif bounded_score <= -0.20:
            label = "Negative"
        else:
            label = "Neutral"

        # Heuristic confidence based on evidence richness
        confidence = min(0.95, round(0.65 + min(match_count, 5) * 0.06, 2))

        return bounded_score, label, "Financial Lexicon-Syntactic Engine", confidence
