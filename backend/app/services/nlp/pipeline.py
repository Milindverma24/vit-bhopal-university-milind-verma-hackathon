import uuid
from datetime import datetime
from typing import Optional, Dict, Any
from app.services.preprocessing.text_cleaner import TextCleaner
from app.services.entity_extraction.extractor import EntityExtractor
from app.services.nlp.sentiment import FinancialSentimentAnalyzer
from app.services.event_classification.classifier import EventClassifier
from app.services.impact_scoring.scorer import ImpactScorer
from app.schemas.schemas import RiskSignalBase

class NLPRiskEngine:
    """
    Central AI/NLP Risk Engine transforming unstructured financial text
    into structured, explainable financial risk signals.
    """
    def __init__(self):
        self.text_cleaner = TextCleaner()
        self.entity_extractor = EntityExtractor()
        self.sentiment_analyzer = FinancialSentimentAnalyzer()
        self.event_classifier = EventClassifier()
        self.impact_scorer = ImpactScorer()

    def process_text(
        self,
        text: str,
        headline: Optional[str] = None,
        source_type: str = "financial_news",
        source_name: str = "Financial Wire",
        source_reference: Optional[str] = None,
        published_at: Optional[datetime] = None,
        is_synthetic: bool = True,
        override_ticker: Optional[str] = None
    ) -> RiskSignalBase:
        # 1. Clean and normalize
        cleaned_text = self.text_cleaner.clean(text)
        cleaned_headline = self.text_cleaner.clean(headline or "")

        # 2. Extract Entities
        entities, entity_meta = self.entity_extractor.extract(cleaned_text, cleaned_headline)
        
        # Override ticker if explicitly passed by user
        primary_ticker = override_ticker or entity_meta["primary_ticker"]
        primary_company = entity_meta["primary_company"]
        if override_ticker and not primary_company:
            comp_info = self.entity_extractor.ticker_to_company.get(override_ticker.upper())
            if comp_info:
                primary_company = comp_info["name"]

        is_market_wide = (primary_ticker is None)

        # 3. Sentiment Analysis
        sentiment_score, sentiment_label, sentiment_method, sentiment_conf = self.sentiment_analyzer.analyze(
            cleaned_text, cleaned_headline
        )

        # 4. Event Classification
        event_type, event_conf, event_evidence = self.event_classifier.classify(
            cleaned_text, cleaned_headline
        )

        # 5. Impact Scoring
        impact_score, impact_level, impact_rationale, impact_method = self.impact_scorer.score(
            event_type=event_type,
            sentiment_score=sentiment_score,
            is_market_wide=is_market_wide,
            text=cleaned_text,
            headline=cleaned_headline
        )

        # 6. Risk Direction Determination
        if sentiment_score <= -0.20 or (impact_score >= 7 and sentiment_score <= 0.05):
            risk_direction = "Negative"
        elif sentiment_score >= 0.20 and impact_score <= 7:
            risk_direction = "Positive"
        elif sentiment_label == "Mixed":
            risk_direction = "Mixed"
        else:
            risk_direction = "Neutral"

        signal_id = str(uuid.uuid4())
        data_source_label = "Synthetic Demonstration Signal" if is_synthetic else "Public Market Observation"

        return RiskSignalBase(
            signal_id=signal_id,
            source_type=source_type,
            source_name=source_name,
            source_reference=source_reference,
            headline=cleaned_headline or cleaned_text[:90] + ("..." if len(cleaned_text) > 90 else ""),
            text=cleaned_text,
            published_at=published_at or datetime.utcnow(),
            processed_at=datetime.utcnow(),
            entities=entities,
            primary_ticker=primary_ticker,
            primary_company=primary_company,
            sentiment_score=sentiment_score,
            sentiment_label=sentiment_label,
            sentiment_method=sentiment_method,
            sentiment_confidence=sentiment_conf,
            event_type=event_type,
            event_confidence=event_conf,
            event_evidence=event_evidence,
            impact_score=impact_score,
            impact_level=impact_level,
            impact_rationale=impact_rationale,
            impact_method=impact_method,
            risk_direction=risk_direction,
            is_synthetic=is_synthetic,
            data_source_label=data_source_label
        )

# Global singleton engine instance
risk_engine = NLPRiskEngine()
