# RiskPulse AI — Live Hackathon Demonstration Script

This script provides a reproducible step-by-step sequence for judges and presenters to demonstrate **RiskPulse AI** in approximately **5 to 10 minutes**.

---

## 5-Minute Quick Demonstration Flow

### Phase 1: Problem & System Overview (0:00 – 0:30)
1. **Open Platform:** Navigate to `http://localhost:5173`.
2. **Introduction:**
   > *"Welcome to RiskPulse AI, developed for the S&P Global & CRISIL Campus Hackathon 2026. Financial institutions face enormous volumes of unstructured news and social sentiment that lag behind traditional market risk models. RiskPulse AI transforms unstructured text into structured, explainable financial risk signals that drive both Tactical Stock Index Rebalancing (Module A) and Strategic Portfolio Stress Testing (Module B)."*
3. **Point out Top Metrics:**
   - Total signals processed, adverse signals percentage, and high-impact event count.
   - Note the **Engine Mode** badge in the header indicating zero-key offline resilience.

---

### Phase 2: Ingestion & Data Sources (0:30 – 1:15)
1. **Navigate to "Data Sources" Tab:**
   - Highlight the 3 connected adapters: Financial News Wire, FinTwit Social Sentiment Feed, and Verified Benchmark Dataset.
   - Explain the **Zero-Key Resilient Architecture**: The system works out of the box with over 240 deterministic synthetic records, with optional live NewsAPI connectivity.
2. **Click "Fetch News" or "Fetch FinTwit":**
   - Demonstrate real-time ingestion counters incrementing and new records being analyzed in the background.

---

### Phase 3: AI / NLP Risk Engine Sandbox (1:15 – 2:45)
1. **Navigate to "NLP Risk Engine" Tab:**
2. **Click a Benchmark Scenario:**
   - Select *"NVIDIA AI Revenue Beat"* or *"Apple Cyber Incident"*.
   - Point out the pre-populated headline, body content, and primary ticker.
3. **Click "Execute AI/NLP Risk Analysis":**
   - Watch the backend process the text in real-time.
4. **Explain Structured Outputs:**
   - **Sentiment Score:** Continuous rating (e.g., `-0.75` Negative or `+0.72` Positive) with confidence.
   - **Event Taxonomy:** Multi-class classification (e.g., *Cybersecurity Incident* or *Corporate Earnings*).
   - **Market Impact (1–10):** Explain that impact is independent from sentiment (evaluates event baseline, market-wide scope, and tail-risk keywords).
   - **AI Explainability Rationale:** Read the clear explanation detailing transmission channels and valuation implications.
   - **JSON Signal Schema:** Point out the standard JSON contract persisted to the relational database.

---

### Phase 4: Module A — Tactical Index Rebalancing (2:45 – 3:40)
1. **Navigate to "Tactical Rebalancing" Tab:**
2. **Review Constituent Universe:**
   - 15 core US large-cap equities (Apple, Microsoft, Nvidia, JPMorgan, ExxonMobil, Pfizer, Amazon, etc.).
   - Initial equal-weight benchmark (~$6.67\%$).
3. **Inspect Parameters:**
   - Alpha (sentiment sensitivity $= 0.45$).
   - Beta (negative risk penalty multiplier $= 0.65$).
   - Box constraints ($2.0\%$ floor, $18.0\%$ ceiling) and max turnover limit ($25\%$).
4. **Click "Execute Rebalance Run":**
   - Watch the optimizer recalculate weights:
     - Companies with negative high-impact events are de-weighted to protect capital.
     - Stocks with bullish earnings expand towards the cap.
   - Show the **Weight Delta Chart** and **Allocation Profile** confirming exact 100.0% normalization.

---

### Phase 5: Module B — Strategic Portfolio Stress Testing (3:40 – 4:35)
1. **Navigate to "Stress Testing" Tab:**
2. **Review the Wholesale Bank Book:**
   - $500,000,000 portfolio spanning corporate loans, sovereign debt, corporate bonds, equities, and derivatives.
3. **Select Scenario:**
   - Choose *"Geopolitical Escalation & Supply Conflict"* or *"Aggressive Rate Hike (+200 bps)"*.
4. **Click "Run Scenario Stress Test":**
   - **Before vs After:** Compare $500M baseline against stressed valuation.
   - **Simulated Loss:** Highlight absolute dollar impairment and percentage drop.
   - **Basel III ECL:** Show Expected Credit Loss shift on corporate loans ($PD \times LGD \times EAD$).
   - **Loss Contribution:** Point out asset class and sector loss breakdown charts.
   - **Safeguard Verification:** Point out that **Liquid Cash suffered $0 loss**, proving differentiated asset valuation.

---

### Phase 6: Historical Alpha, Audit & Conclusion (4:35 – 5:00)
1. **Navigate to "Historical Alpha" Tab:**
   - Show the 90-day backtest trajectory comparing the Tactical NLP Index against the Equal-Weight Benchmark.
   - Note the Sharpe ratio and maximum drawdown reduction achieved through early risk de-weighting.
2. **Navigate to "Methodology & Audit" Tab:**
   - Show the immutable audit trail table recording every ingestion, analysis, rebalancing, and stress-test run.
3. **Conclude:**
   - Summarize that the platform provides a complete, original, working full-stack implementation addressing the entire S&P Global hackathon problem statement.
