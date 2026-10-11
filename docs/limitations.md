# RiskPulse AI — Limitations & Ethical Disclosures

## 1. Educational Hackathon Prototype Disclaimer

**RiskPulse AI is an educational software prototype** designed and implemented independently for the **S&P Global & CRISIL Campus Hackathon 2026**. 
- It does **not** constitute professional investment advice, financial planning, portfolio management services, or credit rating evaluations.
- Simulated financial performance, backtest curves, and portfolio stress tests are hypothetical and do **not** represent actual trading results or guarantees of future market outcomes.

---

## 2. Technical & Modeling Limitations

### 2.1 Synthetic Data Scope
- All default counterparty identifiers, borrower loans, synthetic headlines, and FinTwit social media feeds are generated algorithmically for demonstration purposes.
- While realistic financial phrasing and domain terminology are incorporated, synthetic headlines do not represent actual corporate events or official issuer disclosures.

### 2.2 NLP Model Boundaries
- When running in zero-configuration offline fallback mode, the engine utilizes a deterministic domain-lexicon and syntactic grammar analyzer. While highly explainable and resilient, keyword-based sentiment and classification rules may experience edge-case ambiguity on highly nuanced corporate rhetoric (e.g., sarcasm or complex legal disclaimers).
- FinBERT deep learning models require GPU/CPU memory and internet connectivity to download initial weights; the deterministic fallback ensures zero demonstration downtime when weights are unavailable.

### 2.3 Financial & Derivative Valuation Simplifications
- **Derivative Holdings:** Swaps and FX hedges are modeled using simplified notional mark-to-market and duration approximations rather than full Monte Carlo interest-rate curve simulations or non-linear Black-Scholes volatility surface pricing.
- **Liquidity Shocks:** Bid-ask spreads and market illiquidity during systemic crises are represented via fixed transaction turnover caps rather than dynamic order-book market impact models.

### 2.4 Regulatory Capital Requirements
- The portfolio stress testing engine utilizes standard Expected Credit Loss ($ECL = PD \times LGD \times EAD$) and modified duration approximations inspired by Basel III frameworks, but is **not** a regulatory-certified capital calculation engine for commercial deposit-taking institutions.

---

## 3. Ethical Safeguards & Confidentiality Compliance

1. **Strict Client Confidentiality:** No confidential, proprietary, or non-public data from S&P Global, CRISIL, commercial banks, or corporate issuers was accessed, requested, or used.
2. **Zero Hardcoded Secrets:** All API integrations (such as NewsAPI) are strictly optional and configured via environment variables. The repository contains zero committed access tokens or passwords.
3. **Original Implementation & Code Integrity:** All application source code, API routes, quantitative rebalancing algorithms, stress test engines, and React UI components are an original, independent implementation developed specifically for this problem statement.
