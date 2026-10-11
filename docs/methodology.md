# RiskPulse AI — Financial & Quantitative Methodology

This document details the mathematical formulations, risk models, NLP pipelines, and quantitative optimization constraints implemented in **RiskPulse AI** for the **S&P Global & CRISIL Campus Hackathon 2026**.

---

## 1. AI/NLP Sentiment Analysis Methodology

### 1.1 Objective & Scale
The NLP Sentiment Analyzer evaluates the financial sentiment of incoming headlines and textual discourse on a bounded, continuous domain:
$$\text{Sentiment Score} \in [-1.0, +1.0]$$

| Score Range | Categorical Label | Interpretation |
| :--- | :--- | :--- |
| **+0.20 to +1.00** | Positive | Bullish catalyst, revenue/earnings beat, rating upgrade, expansion |
| **-0.20 to -1.00** | Negative | Bearish stress, earnings miss, default, regulatory fine, cyber breach |
| **-0.20 to +0.20** | Neutral | Balanced economic print, administrative announcement, rate hold |
| **Bimodal Variance** | Mixed | Conflicting signals (e.g., strong revenue offset by margin collapse) |

### 1.2 Dual-Mode Engine Architecture
1. **Primary Transformer Pipeline (FinBERT)**:
   - Utilizes `ProsusAI/finbert`, a BERT architecture fine-tuned on financial corpora (Financial PhraseBank, SEC 10-K/10-Q disclosures).
   - Operates when `ENABLE_PRETRAINED_NLP=true` and PyTorch/HuggingFace dependencies are available.
2. **Deterministic Domain-Specific Lexicon & Syntactic Fallback**:
   - Implemented independently to guarantee **zero-key, zero-internet offline operation**.
   - Employs Loughran-McDonald financial dictionaries supplemented by Wall Street directional verbs (`downgraded`, `plunged`, `surged`, `impairment`, `write-down`, `default`).
   - **Multi-Word Negation Window**: Analyzes a 3-token preceding window for negation tokens (`not`, `never`, `no`, `without`, `failed`) and multi-word phrases (`failed to`, `did not`, `unable to`).
     - *"Failed to beat revenue estimates"* $\to$ Negative score.
     - *"Profit margins did not decline"* $\to$ Positive / resilient score.
   - **Intensity Modifiers**: Applies calibrated scalar multipliers for intensifiers (`sharply` $\times 1.4$, `unprecedented` $\times 1.5$) and diminishers (`modestly` $\times 0.7$).

---

## 2. Event Classification Taxonomy

The system supports 20 multi-class event categories required by the hackathon specification:

1. **Default or Bankruptcy** (Baseline severity: 9/10)
2. **Fraud or Investigation** (Baseline severity: 8/10)
3. **Liquidity Risk** (Baseline severity: 8/10)
4. **Cybersecurity Incident** (Baseline severity: 7/10)
5. **Geopolitical Event** (Baseline severity: 7/10)
6. **Credit Event** (Baseline severity: 7/10)
7. **Monetary Policy** (Baseline severity: 7/10)
8. **Interest Rate Change** (Baseline severity: 6/10)
9. **Market Volatility** (Baseline severity: 6/10)
10. **Inflation** (Baseline severity: 6/10)
11. **Supply Chain Disruption** (Baseline severity: 6/10)
12. **Regulatory Action** (Baseline severity: 6/10)
13. **Corporate Earnings** (Baseline severity: 5/10)
14. **Macroeconomic Event** (Baseline severity: 5/10)
15. **Merger and Acquisition** (Baseline severity: 5/10)
16. **Operational Risk** (Baseline severity: 5/10)
17. **Natural Disaster** (Baseline severity: 5/10)
18. **Product Launch** (Baseline severity: 4/10)
19. **Positive Business Development** (Baseline severity: 4/10)
20. **Other / Routine** (Baseline severity: 2/10)

For each classification, the engine records:
- `event_type`: Categorical taxonomy label.
- `event_confidence`: Heuristic confidence ($0.50$ to $0.96$) based on evidence term frequency and headline prominence (weighted $2.5\times$).
- `event_evidence`: Explicit matched keywords and phrases for full human explainability.

---

## 3. Impact Severity Matrix

Market Impact is evaluated on an integer scale from **1 (minimal)** to **10 (critical)**. Unlike naive systems, **Impact is independent of absolute sentiment**:
$$\text{Impact Score} \ne 10 \times |\text{Sentiment}|$$

### 3.1 Impact Score Formula
$$\text{Raw Impact} = \text{BaseSeverity}(\text{Event}) + \Delta_{\text{Scope}} + \Delta_{\text{Sentiment}} + \Delta_{\text{SeverityKeywords}}$$

Where:
- $\text{BaseSeverity}(\text{Event}) \in [2, 9]$: Inherent systemic baseline for the event category.
- $\Delta_{\text{Scope}} = +1.0$ if the event is market-wide / cross-sector rather than single-company specific.
- $\Delta_{\text{Sentiment}} = |\text{Sentiment}| \times 1.5$ (capped at $1.5$): Compounds severity under extreme market emotion.
- $\Delta_{\text{SeverityKeywords}} = \min(2.0, \text{count} \times 0.75)$: Detects systemic crisis indicators (`systemic`, `unprecedented`, `emergency`, `catastrophic`, `contagion`, `trading halt`).

The raw score is rounded to an integer bounded in $[1, 10]$ and mapped to a qualitative tier:
- **1–2:** Minimal impact.
- **3–4:** Low impact.
- **5–6:** Moderate impact.
- **7–8:** High impact (triggers downstream portfolio defense).
- **9–10:** Critical impact (mandatory risk alert & stress scenario execution).

---

## 4. Module A: Tactical Stock Index Rebalancing

### 4.1 Constituent Universe
The tactical index consists of a configurable basket of **15 publicly traded US large-cap equities** across 7 primary economic sectors:
- **Technology:** Apple Inc. (`AAPL`), Microsoft Corp. (`MSFT`), NVIDIA Corp. (`NVDA`).
- **Financial Services:** JPMorgan Chase & Co. (`JPM`), Bank of America Corp. (`BAC`).
- **Energy:** Exxon Mobil Corp. (`XOM`), Chevron Corp. (`CVX`).
- **Healthcare:** Johnson & Johnson (`JNJ`), Pfizer Inc. (`PFE`).
- **Consumer Discretionary:** Amazon.com Inc. (`AMZN`).
- **Consumer Staples:** Walmart Inc. (`WMT`), Procter & Gamble Co. (`PG`).
- **Industrials:** Caterpillar Inc. (`CAT`), Lockheed Martin Corp. (`LMT`).
- **Utilities:** NextEra Energy Inc. (`NEE`).

Base benchmark weights start equal-weighted: $w_{base, i} \approx 6.67\%$.

### 4.2 Raw Multi-Factor Weight Allocation Formula
$$\text{RawScore}_i = w_{base, i} \cdot \exp\left(\alpha \cdot \bar{S}_i - \beta \cdot \text{Risk}_i\right)$$

Where:
- $\bar{S}_i$: Confidence-weighted average sentiment for constituent $i$ across trailing valid signals.
- $\text{Risk}_i$: Normalized downside penalty:
  $$\text{Risk}_i = \left(\frac{\text{Impact}_i}{10}\right) \cdot \max\left(0, -\bar{S}_i + 0.25\right)$$
  *(If $\text{Impact}_i \ge 7$ and $\bar{S}_i \le 0.05$, an additional defensive penalty of $0.35$ is enforced).*
- $\alpha$: Configurable sentiment sensitivity parameter (default: $0.45$).
- $\beta$: Configurable risk penalty parameter (default: $0.65$).

### 4.3 Quantitative Box & Turnover Constraints
The raw scores are projected onto the feasible portfolio polytope satisfying:
1. **Budget Normalization:** $\sum_{i=1}^{15} w_i = 1.000$ (100.0% fully invested).
2. **Box Constraints:** $w_{min} \le w_i \le w_{max}$, where $w_{min} = 2.0\%$ and $w_{max} = 18.0\%$.
   - Enforced via an **iterative fixed-point clipping and proportional redistribution algorithm**.
3. **No-Trade Deadband:** If $|w_{\text{proposed}, i} - w_{\text{current}, i}| < 0.005$ (50 bps), the position is retained to avoid unnecessary transaction churning.
4. **Turnover Limit:** Total portfolio turnover is bounded:
   $$\text{Turnover} = \frac{1}{2} \sum_{i=1}^{15} |w_{\text{new}, i} - w_{\text{current}, i}| \le \text{MaxTurnover} \quad (\le 25.0\%)$$
   If raw turnover exceeds $\text{MaxTurnover}$, allocation changes are scaled proportionally:
   $$w_{\text{executed}} = w_{\text{current}} + \Delta w \cdot \left(\frac{\text{MaxTurnover}}{\text{Turnover}}\right)$$

---

## 5. Module B: Strategic Portfolio Stress Testing

### 5.1 Wholesale Banking Portfolio Structure
A $500,000,000 synthetic institutional wholesale banking book spanning 22 positions across 6 asset classes:
1. **Corporate Loans ($180M, 36%):** Syndicated Term Loan B, Revolving Credit Facilities, Capex financing.
2. **Sovereign Bonds ($120M, 24%):** US Treasury 5Y/10Y notes, German Bunds, UK Gilts.
3. **Corporate Bonds ($90M, 18%):** Senior investment-grade notes across Energy, Tech, Healthcare, and Financials.
4. **Equity Holdings ($60M, 12%):** Direct large-cap equity and sector ETF positions.
5. **Derivatives / Hedging ($25M, 5%):** USD/EUR Macro FX Swaps, 5Y Fixed-Float Interest Rate Swaps.
6. **Liquid Cash ($25M, 5%):** Federal Reserve Overnight Repo, Treasury Money Market accounts.

### 5.2 Basel III Expected Credit Loss (ECL) Modeling
For corporate lending exposures:
$$\text{ECL} = \text{PD} \times \text{LGD} \times \text{EAD}$$
Where:
- $\text{PD}$: Probability of Default (annualized).
- $\text{LGD}$: Loss Given Default (typically 35% to 50% for senior secured corporate debt).
- $\text{EAD}$: Exposure at Default (notional exposure).

Under a stress scenario with PD multiplier $M_{\text{PD}}$ and LGD shift $\Delta_{\text{LGD}}$:
$$\text{PD}_{\text{stressed}} = \min(1.0, \text{PD} \times M_{\text{PD}} \times \text{VulnerabilityFactor})$$
$$\text{LGD}_{\text{stressed}} = \min(1.0, \text{LGD} + \Delta_{\text{LGD}})$$
$$\Delta \text{ECL} = \left(\text{PD}_{\text{stressed}} \cdot \text{LGD}_{\text{stressed}} - \text{PD} \cdot \text{LGD}\right) \times \text{Notional}$$
Fair value of loans is impaired by the incremental credit loss: $V_{\text{stressed}} = V_{\text{base}} - \Delta \text{ECL}$.

### 5.3 Fixed Income Duration & Rate Sensitivity
For sovereign and corporate bonds:
$$\Delta P \approx - \text{Duration} \times \Delta y_{\text{effective}} \times P$$
Where:
- For Sovereign Bonds: $\Delta y_{\text{effective}} = \Delta y_{\text{rate}}$.
- For Corporate Bonds: $\Delta y_{\text{effective}} = \Delta y_{\text{rate}} + \Delta \text{Spread}_{\text{credit}}$.
- In extreme equity market crash scenarios, high-quality sovereign debt models a **flight-to-safety appreciation** ($+2.5\%$).

### 5.4 Liquid Cash Safeguard
Cash and central bank reserve assets strictly preserve par value ($\Delta V = 0$). The engine prohibits applying arbitrary equity shocks indiscriminately across non-equity asset classes.

---

## 6. Empirical Validation & Test Results

The platform includes an automated test suite executed via `pytest`:
- **Total Test Cases:** 13
- **Passed:** 13 (100.0%)
- **Failed:** 0
- **Execution Time:** ~0.72 seconds

Key verified capabilities:
1. `test_sentiment_positive_detection`: Accurate positive detection on corporate revenue beat narratives.
2. `test_sentiment_negative_detection`: Accurate negative detection on profit warnings and lawsuits.
3. `test_sentiment_negation_handling`: Verified syntactic negation inversion (`failed to beat` $\to$ adverse score; `did not decline` $\to$ resilient score).
4. `test_event_classification_categories`: Verified categorization across Chapter 11 bankruptcy, FTC antitrust litigation, rate hikes, and geopolitical conflicts.
5. `test_rebalancing_constraints_and_normalization`: Proved 100.0% budget allocation constraint, $2.0\%$ to $18.0\%$ box constraint adherence, and turnover cap satisfaction.
6. `test_portfolio_stress_calculations`: Verified $500M baseline parity, asset-specific loss attributions, and zero cash impairment.
