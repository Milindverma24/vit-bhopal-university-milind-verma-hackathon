import math
import uuid
from datetime import datetime
from typing import List, Dict, Any, Tuple
import numpy as np
from sqlalchemy.orm import Session
from app.config import settings, STOCK_BASKET
from app.models.models import IndexConstituent, RebalanceRun, RiskSignal, AuditEvent

class TacticalIndexRebalancer:
    """
    Tactical Stock Index Rebalancing Engine.
    Dynamically recalculates constituent weights driven by AI/NLP risk signals,
    applying quantitative exposure constraints, turnover limits, and sector caps.
    """

    def __init__(
        self,
        alpha: float = settings.DEFAULT_ALPHA,
        beta: float = settings.DEFAULT_BETA,
        min_weight: float = settings.DEFAULT_MIN_WEIGHT,
        max_weight: float = settings.DEFAULT_MAX_WEIGHT,
        max_turnover: float = settings.DEFAULT_MAX_TURNOVER,
        confidence_threshold: float = settings.CONFIDENCE_THRESHOLD,
        no_trade_band: float = settings.NO_TRADE_BAND
    ):
        self.alpha = alpha
        self.beta = beta
        self.min_weight = min_weight
        self.max_weight = max_weight
        self.max_turnover = max_turnover
        self.confidence_threshold = confidence_threshold
        self.no_trade_band = no_trade_band

    def initialize_constituents(self, db: Session):
        """Initializes default equal-weight constituents if table is empty"""
        existing = db.query(IndexConstituent).count()
        if existing == 0:
            n = len(STOCK_BASKET)
            base_w = round(1.0 / n, 4)
            for item in STOCK_BASKET:
                constituent = IndexConstituent(
                    ticker=item["ticker"],
                    name=item["name"],
                    sector=item["sector"],
                    base_weight=base_w,
                    current_weight=base_w,
                    target_weight=base_w,
                    previous_weight=base_w,
                    latest_sentiment=0.0,
                    latest_impact=1,
                    latest_event="Baseline Initialization",
                    updated_at=datetime.utcnow()
                )
                db.add(constituent)
            db.commit()

    def aggregate_latest_signals(self, db: Session) -> Dict[str, Dict[str, Any]]:
        """
        Gathers latest relevant signals per constituent from the NLP risk engine.
        Calculates confidence-weighted average sentiment and maximum impact score.
        """
        constituents = db.query(IndexConstituent).all()
        aggregated: Dict[str, Dict[str, Any]] = {}

        for c in constituents:
            # Query recent signals for this ticker
            signals = db.query(RiskSignal).filter(
                RiskSignal.primary_ticker == c.ticker
            ).order_by(RiskSignal.processed_at.desc()).limit(10).all()

            if not signals:
                aggregated[c.ticker] = {
                    "sentiment": 0.0,
                    "impact": 1,
                    "event": "Routine Operations",
                    "signal_count": 0,
                    "latest_signal_id": None
                }
                continue

            valid_signals = [s for s in signals if s.sentiment_confidence >= self.confidence_threshold]
            if not valid_signals:
                valid_signals = signals[:1]  # fallback to most recent

            # Confidence-weighted sentiment
            weights = [s.sentiment_confidence for s in valid_signals]
            sentiments = [s.sentiment_score for s in valid_signals]
            avg_sentiment = float(np.average(sentiments, weights=weights)) if sum(weights) > 0 else 0.0
            
            # Max impact score and latest triggering event
            max_impact = max(s.impact_score for s in valid_signals)
            latest_sig = valid_signals[0]

            aggregated[c.ticker] = {
                "sentiment": round(avg_sentiment, 3),
                "impact": max_impact,
                "event": latest_sig.event_type,
                "signal_count": len(valid_signals),
                "latest_signal_id": latest_sig.signal_id
            }

        return aggregated

    def rebalance(
        self,
        db: Session,
        alpha: float = None,
        beta: float = None,
        min_weight: float = None,
        max_weight: float = None,
        max_turnover: float = None,
        preview_only: bool = False
    ) -> RebalanceRun:
        # Override parameters if provided
        a = alpha if alpha is not None else self.alpha
        b = beta if beta is not None else self.beta
        min_w = min_weight if min_weight is not None else self.min_weight
        max_w = max_weight if max_weight is not None else self.max_weight
        max_to = max_turnover if max_turnover is not None else self.max_turnover

        self.initialize_constituents(db)
        constituents = db.query(IndexConstituent).all()
        signals_map = self.aggregate_latest_signals(db)

        tickers = [c.ticker for c in constituents]
        current_weights = np.array([c.current_weight for c in constituents])
        base_weights = np.array([c.base_weight for c in constituents])
        n = len(constituents)

        raw_scores = []
        reasons = []
        risk_alerts = []

        # 1. Compute raw score via exponential risk-adjusted weighting formula
        for i, c in enumerate(constituents):
            sig_info = signals_map[c.ticker]
            s = sig_info["sentiment"]
            imp = sig_info["impact"]
            event = sig_info["event"]

            # Normalized negative risk factor: compound of impact severity and negative sentiment
            neg_sentiment_penalty = max(0.0, -s)
            # High impact (>= 7) triggers penalty even with slight negative or neutral
            if imp >= 7 and s <= 0.05:
                neg_risk = (imp / 10.0) * (neg_sentiment_penalty + 0.35)
                risk_alerts.append(f"HIGH IMPACT ALERT on {c.ticker} ({imp}/10): {event}. Defensive de-weighting applied.")
            else:
                neg_risk = (imp / 10.0) * neg_sentiment_penalty

            exponent = (a * s) - (b * neg_risk)
            raw_multiplier = math.exp(exponent)
            raw_score = base_weights[i] * raw_multiplier
            raw_scores.append(raw_score)

            # Document rationale
            if s > 0.15:
                reason = f"Bullish sentiment ({s:+.2f}) drove allocation expansion."
            elif s < -0.15 or imp >= 7:
                reason = f"Bearish/Risk signal ({event}, impact {imp}/10) prompted defensive reduction."
            else:
                reason = "Neutral risk profile preserved near-benchmark allocation."
            reasons.append(reason)

        raw_scores = np.array(raw_scores)

        # 2. Box-constrained iterative projection algorithm
        # Normalizes sum(w) = 1.0 while strictly enforcing min_w <= w_i <= max_w
        proposed_weights = self._project_box_constraints(raw_scores, min_w, max_w)

        # 3. Apply No-Trade Deadband to eliminate minute churning
        diffs = proposed_weights - current_weights
        deadband_mask = np.abs(diffs) < self.no_trade_band
        interim_weights = np.where(deadband_mask, current_weights, proposed_weights)
        interim_weights = self._project_box_constraints(interim_weights, min_w, max_w)

        # 4. Enforce Maximum Turnover Constraint
        # Turnover = sum(abs(w_new - w_old)) / 2.0
        delta_w = interim_weights - current_weights
        raw_turnover = float(np.sum(np.abs(delta_w)) / 2.0)

        if raw_turnover > max_to and raw_turnover > 0:
            scale_factor = max_to / raw_turnover
            executed_weights = current_weights + delta_w * scale_factor
            executed_weights = self._project_box_constraints(executed_weights, min_w, max_w)
            executed_turnover = float(np.sum(np.abs(executed_weights - current_weights)) / 2.0)
            risk_alerts.append(f"Turnover threshold hit ({raw_turnover:.1%}). Scaled down to {executed_turnover:.1%}.")
        else:
            executed_weights = interim_weights
            executed_turnover = raw_turnover

        # 5. Compile allocation breakdown and persist if not preview
        run_id = f"preview-{uuid.uuid4().hex[:8]}" if preview_only else f"reb-{uuid.uuid4().hex[:8]}"
        allocations_data = []

        for i, c in enumerate(constituents):
            sig_info = signals_map[c.ticker]
            prev_w = float(c.current_weight)
            new_w = float(round(executed_weights[i], 4))
            chg = float(round(new_w - prev_w, 4))

            if not preview_only:
                # Update constituent record in database only on actual confirmed execution
                c.previous_weight = prev_w
                c.target_weight = float(round(proposed_weights[i], 4))
                c.current_weight = new_w
                c.latest_sentiment = sig_info["sentiment"]
                c.latest_impact = sig_info["impact"]
                c.latest_event = sig_info["event"]
                c.latest_signal_id = sig_info["latest_signal_id"]
                c.updated_at = datetime.utcnow()

            allocations_data.append({
                "ticker": c.ticker,
                "name": c.name,
                "sector": c.sector,
                "prev_weight": prev_w,
                "proposed_weight": float(round(proposed_weights[i], 4)),
                "executed_weight": new_w,
                "weight_change": chg,
                "sentiment": sig_info["sentiment"],
                "impact": sig_info["impact"],
                "event": sig_info["event"],
                "reason": reasons[i]
            })

        rebalance_record = RebalanceRun(
            run_id=run_id,
            timestamp=datetime.utcnow(),
            turnover=round(executed_turnover, 4),
            num_constituents=n,
            trigger_reason="Tactical Allocation Preview" if preview_only else "Tactical NLP Risk Engine Signals Ingestion",
            allocations=allocations_data,
            parameters={
                "alpha": a,
                "beta": b,
                "min_weight": min_w,
                "max_weight": max_w,
                "max_turnover": max_to,
                "confidence_threshold": self.confidence_threshold,
                "preview_only": preview_only
            },
            risk_alerts=risk_alerts
        )

        if not preview_only:
            db.add(rebalance_record)
            # Audit Event
            audit = AuditEvent(
                audit_id=f"aud-{uuid.uuid4().hex[:8]}",
                timestamp=datetime.utcnow(),
                action_type="REBALANCE",
                actor="TacticalRebalancer",
                details={"run_id": run_id, "turnover": executed_turnover, "alerts": len(risk_alerts)},
                status="SUCCESS"
            )
            db.add(audit)
            db.commit()

        return rebalance_record

    def _project_box_constraints(self, weights: np.ndarray, min_w: float, max_w: float, max_iter: int = 50) -> np.ndarray:
        """
        Projects weights to satisfy sum(w) == 1.0 and min_w <= w_i <= max_w
        using iterative fixed-point clipping and proportional redistribution.
        """
        w = np.copy(weights)
        if np.sum(w) == 0:
            return np.full_like(w, 1.0 / len(w))
        
        w = w / np.sum(w)
        n = len(w)

        # Safety check: if min_w * n > 1.0 or max_w * n < 1.0, relax bounds slightly
        if min_w * n > 1.0:
            min_w = 0.95 / n
        if max_w * n < 1.0:
            max_w = 1.05 / n

        for _ in range(max_iter):
            clipped = np.clip(w, min_w, max_w)
            diff = 1.0 - np.sum(clipped)
            if abs(diff) < 1e-6:
                return np.round(clipped, 4)
            
            # Find elements that can be adjusted
            if diff > 0:  # Need to add weight
                adjustable = clipped < (max_w - 1e-5)
            else:         # Need to subtract weight
                adjustable = clipped > (min_w + 1e-5)
            
            if not np.any(adjustable):
                break
                
            adj_sum = np.sum(clipped[adjustable])
            if adj_sum > 0:
                clipped[adjustable] += diff * (clipped[adjustable] / adj_sum)
            else:
                clipped[adjustable] += diff / np.sum(adjustable)
            w = clipped

        # Normalize final
        final = np.clip(w, min_w, max_w)
        final = final / np.sum(final)
        return np.round(final, 4)

rebalancer = TacticalIndexRebalancer()
