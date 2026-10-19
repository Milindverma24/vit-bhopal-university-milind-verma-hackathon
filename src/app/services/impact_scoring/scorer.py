import re
from typing import Tuple, Dict, Any, List

EVENT_BASELINES: Dict[str, int] = {
    "Default or Bankruptcy": 9,
    "Fraud or Investigation": 8,
    "Liquidity Risk": 8,
    "Cybersecurity Incident": 7,
    "Geopolitical Event": 7,
    "Credit Event": 7,
    "Monetary Policy": 7,
    "Interest Rate Change": 6,
    "Market Volatility": 6,
    "Inflation": 6,
    "Supply Chain Disruption": 6,
    "Corporate Earnings": 5,
    "Regulatory Action": 6,
    "Merger and Acquisition": 5,
    "Macroeconomic Event": 5,
    "Operational Risk": 5,
    "Natural Disaster": 5,
    "Product Launch": 4,
    "Positive Business Development": 4,
    "Other": 2
}

SEVERITY_KEYWORDS = [
    "systemic", "unprecedented", "emergency", "catastrophic", "contagion",
    "billions", "insolvency", "freeze", "trading halt", "circuit breaker",
    "existential", "massive selloff", "widespread", "global shock"
]

class ImpactScorer:
    """
    Multi-Factor Financial Risk Severity and Market Impact Scorer.
    Synthesizes event baseline, scope (market-wide vs single name), sentiment intensity,
    and high-severity indicators into an explainable 1-10 rating.
    """

    def score(
        self,
        event_type: str,
        sentiment_score: float,
        is_market_wide: bool,
        text: str,
        headline: str = ""
    ) -> Tuple[int, str, str, str]:
        """
        Returns:
            (impact_score [1-10], impact_level, rationale, method)
        """
        combined = f"{headline} {text}".lower()
        base_score = float(EVENT_BASELINES.get(event_type, 3))

        # 1. Scope adjustment: Market-wide macroeconomic events exhibit higher transmission
        scope_delta = 1.0 if is_market_wide else 0.0

        # 2. Sentiment magnitude contribution (capped at +/- 1.5)
        sentiment_delta = abs(sentiment_score) * 1.5

        # 3. Severity keyword detection
        severity_hits = []
        for kw in SEVERITY_KEYWORDS:
            if re.search(r'\b' + re.escape(kw) + r'\b', combined):
                severity_hits.append(kw)
        
        severity_delta = min(2.0, len(severity_hits) * 0.75)

        # Calculate raw composite
        raw_score = base_score + scope_delta + sentiment_delta + severity_delta
        
        # Dampen if sentiment is strictly neutral and event is low baseline
        if abs(sentiment_score) < 0.1 and base_score <= 4:
            raw_score -= 1.0

        # Final integer score bounded 1 to 10
        final_score = int(max(1, min(10, round(raw_score))))

        # Determine Impact Level
        if final_score <= 2:
            impact_level = "Minimal"
        elif final_score <= 4:
            impact_level = "Low"
        elif final_score <= 6:
            impact_level = "Moderate"
        elif final_score <= 8:
            impact_level = "High"
        else:
            impact_level = "Critical"

        # Generate Explainable Rationale
        rationale_parts = [
            f"Event category '{event_type}' establishes a baseline severity of {base_score}/10."
        ]
        if is_market_wide:
            rationale_parts.append("Broad cross-sector / market-wide scope elevates transmission risk (+1.0).")
        if abs(sentiment_score) >= 0.5:
            direction_str = "negative" if sentiment_score < 0 else "positive"
            rationale_parts.append(f"Pronounced {direction_str} sentiment ({sentiment_score:+.2f}) compounds valuation pressure (+{sentiment_delta:.1f}).")
        if severity_hits:
            rationale_parts.append(f"Identified critical stress indicators ({', '.join(severity_hits[:3])}), intensifying tail-risk exposure.")
        
        rationale_parts.append(f"Aggregate risk impact assessed at {final_score}/10 ({impact_level}).")
        impact_rationale = " ".join(rationale_parts)

        return final_score, impact_level, impact_rationale, "Multi-Factor Severity Matrix v1.0"
