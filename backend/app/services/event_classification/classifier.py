import re
from typing import Tuple, List, Dict, Any

# Comprehensive Event Category Patterns & Evidence Signatures
EVENT_PATTERNS: Dict[str, Dict[str, Any]] = {
    "Default or Bankruptcy": {
        "keywords": ["bankruptcy", "chapter 11", "insolvency", "defaulted on debt", "missed coupon payment", "liquidation", "restructuring debt", "debt default"],
        "weight": 1.2
    },
    "Fraud or Investigation": {
        "keywords": ["fraud", "accounting irregularities", "sec investigation", "doj probe", "subpoena", "embezzlement", "money laundering", "indictment", "criminal charges"],
        "weight": 1.15
    },
    "Cybersecurity Incident": {
        "keywords": ["cyberattack", "data breach", "ransomware", "hacked", "security intrusion", "ddos attack", "unauthorized access", "malware compromise"],
        "weight": 1.1
    },
    "Credit Event": {
        "keywords": ["downgraded credit rating", "rating cut", "credit rating", "credit default swap", "cds spread", "junk status", "negative credit watch", "debt downgrade"],
        "weight": 1.05
    },
    "Interest Rate Change": {
        "keywords": ["interest rate hike", "rate cut", "basis points", "bps hike", "fed hikes", "central bank cuts", "benchmark rate", "overnight borrowing rate"],
        "weight": 1.1
    },
    "Monetary Policy": {
        "keywords": ["federal reserve", "fomc", "ecb policy", "quantitative easing", "quantitative tightening", "central bank balance sheet", "monetary stimulus", "policy stance"],
        "weight": 1.05
    },
    "Inflation": {
        "keywords": ["cpi", "consumer price index", "inflation surged", "sticky inflation", "core pce", "hyperinflation", "price pressures", "wage inflation"],
        "weight": 1.05
    },
    "Geopolitical Event": {
        "keywords": ["war", "military conflict", "sanctions", "trade embargo", "missile strike", "geopolitical tension", "naval blockade", "export controls", "tariff retaliation"],
        "weight": 1.1
    },
    "Supply Chain Disruption": {
        "keywords": ["supply chain bottleneck", "chip shortage", "port congestion", "factory shutdown", "raw material shortage", "shipping delay", "component constraint"],
        "weight": 1.0
    },
    "Corporate Earnings": {
        "keywords": ["quarterly earnings", "earnings surge", "q1 earnings", "q2 earnings", "q3 earnings", "q4 earnings", "q1 profit", "q2 results", "q3 revenue", "q4 net income", "eps beat", "earnings miss", "revenue guidance", "gross margin", "fiscal results", "net interest income", "earnings", "quarterly results"],
        "weight": 1.05
    },
    "Merger and Acquisition": {
        "keywords": ["acquisition", "merger", "buyout", "takeover bid", "acquired for", "merging with", "tender offer", "deal valued at"],
        "weight": 1.0
    },
    "Product Launch": {
        "keywords": ["unveiled new", "launched flagship", "next-generation release", "product rollout", "commercial debut", "introduced new model", "platform release"],
        "weight": 0.95
    },
    "Regulatory Action": {
        "keywords": ["antitrust", "regulatory fine", "ftc injunction", "compliance violation", "monopoly lawsuit", "fda rejection", "cfpb penalty", "license revocation"],
        "weight": 1.05
    },
    "Liquidity Risk": {
        "keywords": ["liquidity crunch", "bank run", "repo market stress", "deposit flight", "illiquid", "liquidity freeze", "discount window borrowing", "cash crunch"],
        "weight": 1.15
    },
    "Market Volatility": {
        "keywords": ["vix surged", "market turmoil", "circuit breaker", "flash crash", "wild swings", "extreme volatility", "selloff accelerates"],
        "weight": 1.0
    },
    "Natural Disaster": {
        "keywords": ["hurricane", "earthquake", "flood damage", "wildfire", "natural catastrophe", "facility damage disaster"],
        "weight": 1.0
    },
    "Operational Risk": {
        "keywords": ["it outage", "trading platform crash", "execution glitch", "operational failure", "system blackout", "plant explosion"],
        "weight": 1.0
    },
    "Positive Business Development": {
        "keywords": ["strategic partnership", "multi-billion contract", "license agreement", "commercial breakthrough", "awarded contract", "dividend boost", "share repurchase program"],
        "weight": 0.95
    },
    "Macroeconomic Event": {
        "keywords": ["gdp contracted", "unemployment rate", "jobs report", "nonfarm payrolls", "recession fears", "economic slowdown", "consumer sentiment index"],
        "weight": 1.0
    }
}

class EventClassifier:
    """
    Multi-class financial event classifier with evidence attribution and heuristic confidence estimation.
    """
    def classify(self, text: str, headline: str = "") -> Tuple[str, float, List[str]]:
        combined = f"{headline} {text}".lower()
        headline_lower = (headline or "").lower()

        scores: Dict[str, float] = {}
        evidence_map: Dict[str, List[str]] = {}

        for category, config in EVENT_PATTERNS.items():
            cat_score = 0.0
            found_evidence = []
            
            for kw in config["keywords"]:
                pattern = r'\b' + re.escape(kw) + r'\b'
                # Check occurrence in text
                text_matches = len(re.findall(pattern, combined))
                if text_matches > 0:
                    found_evidence.append(kw)
                    # Headline hits receive 2.5x weight multiplier
                    headline_matches = len(re.findall(pattern, headline_lower))
                    kw_score = (text_matches + headline_matches * 2.5) * config["weight"]
                    cat_score += kw_score

            if cat_score > 0:
                scores[category] = cat_score
                evidence_map[category] = found_evidence

        if not scores:
            return "Other", 0.50, ["General financial/business discourse"]

        # Find category with maximum score
        best_category = max(scores.items(), key=lambda x: x[1])[0]
        best_score = scores[best_category]
        evidence = evidence_map[best_category][:5]  # Top 5 matching phrases

        # Calculate heuristic confidence (0.50 to 0.96) based on strength
        confidence = min(0.96, round(0.55 + (best_score / (best_score + 2.5)) * 0.40, 2))

        return best_category, confidence, evidence
