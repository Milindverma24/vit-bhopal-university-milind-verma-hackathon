# AGENTS.md — RiskPulse AI

Version: 1.0
Project: RiskPulse AI
Project Type: AI-Powered Financial Risk Intelligence Platform
Purpose: S&P Global & Crisil Campus Hackathon 2026
Primary Instruction: Build, test, document, and maintain a complete, original, integrated financial risk intelligence application.

---

# 1. YOUR ROLE

You are the autonomous principal engineering agent responsible for implementing RiskPulse AI.

Operate as a combination of:

- Senior Software Architect
- Full-Stack Developer
- AI/ML Engineer
- NLP Engineer
- Data Engineer
- Quantitative Developer
- Financial Risk Analyst
- UI/UX Engineer
- Database Engineer
- Test Engineer
- DevOps Engineer

Your responsibility is to deliver a working application, not merely generate code snippets, implementation plans, static interfaces, or documentation.

You must understand the existing project, implement functionality incrementally, execute available tests, fix problems, and verify the integration between components.

Take ownership of the complete development lifecycle.

## Primary Objective

Build an application that transforms unstructured financial news and social media text into structured financial risk signals and uses those signals in two downstream applications:

1. Tactical Index Rebalancing.
2. Strategic Portfolio Stress Testing.

The entire system must operate as one integrated application.

---

# 2. SOURCE OF TRUTH AND INSTRUCTION PRIORITY

Follow these project documents when available:

1. AGENTS.md — engineering behavior and coding instructions.
2. DESIGN.md — visual design system and UI/UX requirements.
3. README.md — installation, architecture overview, and developer commands.
4. docs/methodology.md — NLP scoring and financial calculation methodologies.
5. docs/data_sources.md — data sources, provenance, and usage restrictions.
6. docs/architecture.md — system architecture and data flow.
7. The official hackathon problem statement and submission guidelines.

Use the existing project implementation as the source of truth for what is currently functional.

If documentation and implementation disagree:

- Investigate the discrepancy.
- Preserve valid existing functionality.
- Correct inaccurate documentation or implementation as appropriate.
- Do not claim that unimplemented functionality exists.
- Record significant methodological or architectural changes.

If two instructions conflict, prioritize confidentiality, security, data integrity, financial correctness, and hackathon compliance.

Do not silently replace explicit requirements with simpler alternatives.

If a requirement cannot be implemented because of a genuine technical limitation, implement the best valid fallback and document it.

---

# 3. MANDATORY ORIGINALITY AND CONFIDENTIALITY

These rules are non-negotiable.

## 3.1 Original Implementation

Develop an independently implemented solution specifically for RiskPulse AI.

Do not:

- Copy another hackathon submission.
- Clone or rebrand an existing end-to-end project.
- Reuse another participant's source code.
- Copy a complete financial analytics platform.
- Copy another project's dashboard implementation.
- Submit a pre-existing project as original work.
- Reproduce proprietary application designs or source code.

You may use legitimate open-source libraries, documented APIs, publicly available research, and permitted pretrained models.

Implement the project-specific business logic, integration, risk scoring, portfolio calculations, interface composition, and application workflows independently.

Third-party dependencies must be used according to their licenses.

Do not claim that third-party models, datasets, or libraries were developed by this project.

Do not fabricate authorship, benchmark results, or training accomplishments.

## 3.2 Confidentiality

Never use real confidential client data.

Never access, request, import, store, or reproduce confidential S&P Global or Crisil client information, proprietary engagement details, internal records, or restricted datasets.

Do not use confidential information belonging to any employer, bank, customer, or other institution.

Use only:

- Synthetic data generated for the project.
- Publicly accessible market observations.
- Public financial news.
- Publicly available research datasets.
- Authorized public APIs.
- Other data whose permitted usage has been verified.

Do not bypass access controls, authentication, API limits, or website restrictions.

Do not include real personal information in synthetic banking transactions.

Use fictional customer identifiers and synthetic transaction records.

## 3.3 Secrets Management

Never hardcode:

- API keys.
- Passwords.
- Database credentials.
- Access tokens.
- Private keys.
- Session secrets.

Use environment variables.

Maintain a `.env.example` containing placeholders only.

Ensure `.env`, local credentials, and sensitive configuration files are excluded through `.gitignore`.

Never expose backend secrets to the frontend.

Do not print credentials in logs, error messages, screenshots, or documentation.

## 3.4 Honest Data Representation

Clearly distinguish:

- Public market data.
- Public financial news.
- Synthetic news.
- Simulated social media posts.
- Synthetic transactions.
- Model-generated predictions.
- Rule-based estimates.
- Simulated portfolio outcomes.

Never represent synthetic data as live external data.

Never represent a simulated financial return as actual investment performance.

Never describe a simplified stress-testing model as a regulatory banking risk system.

---

# 4. AUTONOMOUS EXECUTION RULES

Work independently and make sensible engineering decisions.

Do not repeatedly ask the user for routine implementation choices.

When requirements are clear, proceed with implementation.

When information is missing but a reasonable default exists, select the default and document it.

If an optional external service is unavailable, implement a functional fallback.

Do not stop after producing:

- A plan.
- A folder structure.
- A README.
- A landing page.
- A dashboard mockup.
- An architecture diagram.
- A set of API interfaces without implementations.

Build the actual application.

Do not leave core features as:

- TODO comments.
- Pseudocode.
- Empty functions.
- Fake API responses.
- Nonfunctional buttons.
- Hardcoded charts pretending to contain real analytics.

If the environment permits, install dependencies, start the application, run tests, and fix errors.

If execution is impossible, clearly identify what was not verified.

---

# 5. INITIAL WORKSPACE INSPECTION

Before making changes:

1. Inspect the project directory.
2. Identify the frontend and backend structure.
3. Read existing documentation.
4. Inspect dependency files.
5. Inspect environment configuration without revealing secret values.
6. Identify existing API endpoints.
7. Identify database models and migrations.
8. Identify existing tests.
9. Identify incomplete functionality.
10. Determine the smallest safe implementation path.

Do not overwrite unrelated user files.

Do not delete working functionality simply to create a preferred architecture.

If an existing implementation is broken, identify the cause before making changes.

Prefer targeted changes over unnecessary rewrites.

If the workspace contains an unrelated or pre-existing project, do not reuse its implementation as the hackathon submission. Establish a clean, independent project structure.

---

# 6. REQUIRED SYSTEM ARCHITECTURE

Maintain a modular architecture with clearly separated responsibilities.

The system must implement the following data flow:

```text
Financial News
        |
        v
News Ingestion Adapter

Social Media or Simulated Social Feed
        |
        v
Social Ingestion Adapter

        |
        v

Normalization and Validation
        |
        v
Duplicate Detection
        |
        v
Entity Extraction
        |
        v
Sentiment Analysis
        |
        v
Event Classification
        |
        v
Impact Scoring
        |
        v
Structured Risk Signals
        |
        v
Database Persistence
        |
        +-------------------------+
        |                         |
        v                         v
Index Rebalancing          Portfolio Stress Testing
        |                         |
        v                         v
Allocation Results         Stress-Test Results
        |                         |
        +-------------+-----------+
                      |
                      v
                  REST API
                      |
                      v
                React Frontend
                      |
                      v
             Dashboards and Analytics
```

The NLP engine is the central intelligence component.

Both downstream modules must consume signals produced by this engine.

Do not independently fabricate sentiment or event classifications inside the downstream modules.

---

# 7. TECHNOLOGY STACK

Use the existing compatible project stack where one has already been established.

Otherwise, use the following defaults.

## Frontend

- React.
- TypeScript.
- Vite.
- Tailwind CSS.
- React Router.
- Recharts.
- Lucide React.

## Backend

- Python.
- FastAPI.
- Pydantic.
- SQLAlchemy.
- Pandas.
- NumPy.

## Database

- SQLite for local development.
- PostgreSQL compatibility for deployment.

## NLP

- FinBERT or another appropriate financial sentiment model when available.
- Hugging Face Transformers where justified.
- A deterministic, independently implemented fallback for offline operation.
- Configurable event classification rules.
- Explainable impact scoring.

## Testing

- Pytest.
- FastAPI TestClient or HTTPX.
- Vitest where appropriate.
- React Testing Library where appropriate.

## Deployment

- Environment-based configuration.
- Docker where practical.
- Reproducible local development commands.

Do not introduce unnecessary technologies.

Do not add dependencies without a clear reason.

Use compatible, maintained versions and pin dependencies appropriately.

---

# 8. CORE NLP RISK ENGINE

Implement the NLP engine as reusable backend services.

Each analysis must produce a structured risk signal.

## 8.1 Sentiment Analysis

Required output:

- `sentiment_score`
- `sentiment_label`
- `sentiment_method`
- `sentiment_confidence`

The score must remain within -1.0 and +1.0.

Interpretation:

- Negative values indicate negative sentiment.
- Zero indicates neutral sentiment.
- Positive values indicate positive sentiment.

Support:

- Positive.
- Negative.
- Neutral.
- Mixed.

Prefer an appropriate financial NLP model when available.

Provide a deterministic fallback when model initialization or downloads fail.

The fallback must consider:

- Positive financial terminology.
- Negative financial terminology.
- Negation.
- Intensifiers.
- Financial risk language.
- Contextual phrases.

Do not claim that a rule-based fallback is a trained machine-learning model.

Do not fabricate confidence probabilities.

## 8.2 Event Classification

Support at least:

- Geopolitical Event.
- Macroeconomic Event.
- Monetary Policy.
- Interest Rate Change.
- Inflation.
- Credit Event.
- Corporate Earnings.
- Merger and Acquisition.
- Product Launch.
- Regulatory Action.
- Fraud or Investigation.
- Cybersecurity Incident.
- Supply Chain Disruption.
- Natural Disaster.
- Market Volatility.
- Liquidity Risk.
- Default or Bankruptcy.
- Operational Risk.
- Positive Business Development.
- Other.

Return:

- `event_type`
- `event_confidence`
- `event_evidence`

Use an extensible classification implementation.

Handle ambiguous events honestly.

## 8.3 Impact Scoring

Generate an impact score between 1 and 10.

Interpretation:

- 1–2: Minimal.
- 3–4: Low.
- 5–6: Moderate.
- 7–8: High.
- 9–10: Critical.

Consider:

- Event type.
- Event severity.
- Market scope.
- Financial relevance.
- Sentiment magnitude.
- Relevant entities.
- Potential exposure.
- Confidence.

Impact must not be calculated solely from absolute sentiment.

A neutral central bank announcement may have high potential market impact.

A negative minor product complaint should not automatically receive the maximum score.

Return:

- `impact_score`
- `impact_level`
- `impact_rationale`
- `impact_method`

Document the scoring rules.

## 8.4 Entity Extraction

Identify relevant companies and tickers.

Support:

- Company name.
- Ticker.
- Sector.
- Country where available.
- Primary and secondary entity distinction.

Use a maintainable entity mapping.

Avoid assuming that every mentioned company is the main subject.

## 8.5 Explainability

Every risk signal must contain a human-readable explanation.

The explanation must be derived from the actual analysis.

Display the selected method and available evidence.

Clearly distinguish heuristic confidence from calibrated model probability.

---

# 9. DATA INGESTION

Support at least two source categories.

## Source A: Financial News

Implement adapters for suitable public news sources.

Optional providers may include:

- NewsAPI.
- GDELT.
- Other permitted public financial news resources.

Also support local sample records and synthetic news.

## Source B: Social Media or Simulated Social Feed

Support:

- Permitted public datasets.
- Locally generated social posts.
- User-submitted sample text.
- Officially supported APIs where credentials are available.

Do not use unauthorized scraping.

## Ingestion Requirements

Normalize incoming records.

Handle:

- Missing content.
- Invalid dates.
- Duplicate records.
- Provider failures.
- Rate limits.
- Network timeouts.
- Invalid responses.
- Missing API keys.

Track:

- Source type.
- Source name.
- Ingestion timestamp.
- Publication timestamp.
- Data provenance.
- Synthetic status.
- Processing status.

If external ingestion fails, preserve application functionality through the local demonstration dataset.

Clearly identify the active data mode.

---

# 10. STRUCTURED SIGNAL STORAGE

Use validated Pydantic schemas and persistent database models.

Every signal should include:

- Unique signal identifier.
- Source type.
- Source name.
- Headline or text.
- Source reference where available.
- Publication timestamp.
- Processing timestamp.
- Extracted entities.
- Sentiment score.
- Sentiment label.
- Sentiment method.
- Sentiment confidence where supported.
- Event category.
- Event confidence.
- Event evidence.
- Impact score.
- Impact level.
- Impact explanation.
- Impact scoring method.
- Risk direction.
- Synthetic-data flag.
- Data provenance.

Validate inputs before storing records.

Do not persist malformed signals as valid results.

Use proper database constraints and indexes.

---

# 11. MODULE A — TACTICAL INDEX REBALANCING

Implement a functional rebalancing engine driven by stored NLP signals.

## Requirements

Maintain a configurable mock stock index containing approximately 10–20 publicly traded companies.

Store:

- Company.
- Ticker.
- Sector.
- Current weight.
- Proposed weight.
- Sentiment.
- Impact score.
- Previous weight.
- Weight change.

## Rebalancing Logic

Positive sentiment may increase a constituent's allocation.

Negative sentiment may reduce its allocation.

High-impact negative events may produce stronger risk reductions.

Neutral sentiment should produce limited or no changes according to the configured method.

Implement a documented and deterministic allocation algorithm.

## Constraints

Enforce:

- Minimum weight.
- Maximum weight.
- Total allocation normalization.
- Turnover limit.
- Maximum exposure.
- Optional sector concentration.
- Confidence threshold.
- No-trade band.

If constraints cannot be satisfied, return a clear validation error.

Do not normalize allocations and then violate maximum exposure constraints.

## Execution Workflow

1. Read current allocations.
2. Retrieve relevant NLP signals.
3. Calculate proposed allocations.
4. Validate all constraints.
5. Return a preview.
6. Execute the simulated rebalance after confirmation.
7. Persist the resulting weights.
8. Record the execution history.
9. Return the actual updated allocations.

The backend must perform the calculations.

## Performance Analysis

Where sufficient valid historical observations exist, calculate:

- Simulated cumulative return.
- Volatility.
- Maximum drawdown.
- Turnover.
- Benchmark comparison.

Avoid look-ahead bias.

Do not fabricate performance results.

Clearly label all simulated results.

---

# 12. MODULE B — PORTFOLIO STRESS TESTING

Implement a functional event-driven stress-testing engine.

Use a synthetic wholesale banking portfolio.

## Synthetic Asset Types

Include a mixture of:

- Corporate loans.
- Government bonds.
- Corporate bonds.
- Equity holdings.
- Simplified derivative exposures.
- Cash and liquid assets.

Use fictional customer identifiers and synthetic transactions.

## Portfolio Metrics

Calculate:

- Total portfolio value.
- Asset allocation.
- Sector exposure.
- Country exposure.
- Credit exposure.
- Expected credit loss where appropriate.
- Interest-rate sensitivity.
- Equity exposure.
- Simulated portfolio loss.

Document all assumptions.

Where applicable:

```text
Expected Credit Loss =
Probability of Default
× Loss Given Default
× Exposure at Default
```

Use consistent units.

## Event Triggers

Use stored NLP signals.

Example:

If event classification is Geopolitical Event and impact score exceeds the configured threshold, identify the signal as eligible for the corresponding stress scenario.

Support configurable triggers for:

- Geopolitical events.
- Interest-rate changes.
- Inflation.
- Credit events.
- Default or bankruptcy.
- Market volatility.
- Supply chain disruption.
- Regulatory action.
- Liquidity risk.

## Scenarios

Implement:

1. Geopolitical Escalation.
2. Interest Rate Shock.
3. Inflation Shock.
4. Credit Crisis.
5. Market Crash.
6. Supply Chain Disruption.
7. Custom Scenario.

Apply shocks only to eligible assets.

Do not apply an equity shock indiscriminately to cash, loans, and unrelated assets.

Avoid double-counting shocks.

## Stress-Test Results

Calculate and persist:

- Baseline portfolio value.
- Stressed portfolio value.
- Absolute change.
- Percentage change.
- Loss by asset class.
- Loss by sector.
- Loss by country.
- Triggering event.
- Impact score.
- Scenario parameters.
- Calculation timestamp.

Prevent duplicate automatic runs for the same signal and scenario unless explicitly requested.

Clearly label results as simulated.

---

# 13. BACKEND API RULES

Implement REST endpoints appropriate to the established architecture.

Expected endpoint groups include:

Health:
- GET /api/health

Dashboard:
- GET /api/dashboard/summary

Signals:
- GET /api/signals
- GET /api/signals/{signal_id}
- POST /api/analyze

Ingestion:
- GET /api/ingestion/status
- POST /api/ingestion/news/refresh
- POST /api/ingestion/social/refresh
- POST /api/ingestion/sample/load

Companies:
- GET /api/companies
- GET /api/companies/{ticker}/risk

Index:
- GET /api/index
- GET /api/index/weights
- POST /api/index/rebalance
- GET /api/index/performance

Portfolio:
- GET /api/portfolio
- GET /api/portfolio/holdings

Stress Testing:
- GET /api/stress/scenarios
- POST /api/stress/run
- GET /api/stress/history

Audit:
- GET /api/audit

Implement pagination and filtering where appropriate.

Validate request bodies.

Use appropriate HTTP status codes.

Handle exceptions consistently.

Enable CORS only for configured frontend origins.

Do not return fake success responses.

Do not expose internal credentials.

Keep API handlers thin.

Move business logic into service modules.

---

# 14. DATABASE RULES

Use SQLAlchemy.

SQLite is the default local database.

Support PostgreSQL through environment-based configuration.

Persist:

- Ingestion records.
- Risk signals.
- Company entities.
- Index constituents.
- Rebalance runs.
- Rebalance allocations.
- Synthetic holdings.
- Synthetic transactions.
- Stress-test scenarios.
- Stress-test runs.
- Stress-test results.
- Audit events.

Use:

- Primary keys.
- Foreign keys.
- Useful indexes.
- Timestamps.
- Validation constraints.

Application restarts must not erase valid historical data.

Do not reset the database automatically.

Provide an explicit development reset or reseed command where appropriate.

Use transactions for operations that update related financial records.

---

# 15. FRONTEND DESIGN RULES

The authoritative visual specification is `DESIGN.md`.

Read it before implementing or significantly changing the frontend.

Follow its color tokens, typography, spacing, component geometry, responsive behavior, and accessibility requirements.

## Visual Identity

Use:

- Black primary actions.
- White main canvas.
- Light-gray secondary surfaces.
- Consistent typography.
- Pill-shaped interactive controls.
- 16px card radii.
- 8px input radii.
- Restrained shadows.
- Clean tables.
- Monochrome charts.

Avoid:

- Excessive colors.
- Gradients.
- Glassmorphism.
- Unnecessary shadows.
- Decorative stock imagery.
- Excessive animation.
- Unrelated component styles.

## Required Pages

Implement:

1. Executive Overview.
2. News and Social Feed.
3. NLP Risk Engine.
4. Risk Signal Explorer.
5. Company Risk Profiles.
6. Tactical Index Rebalancing.
7. Portfolio Explorer.
8. Portfolio Stress Testing.
9. Historical Analysis.
10. Data Sources.
11. Methodology and Audit.

Every page must be connected to actual backend data where applicable.

## Interaction Rules

All visible primary buttons must work.

All navigation links must resolve to valid routes.

Forms must validate input.

Charts must display actual data.

Tables must support the interactions they advertise.

Loading and error states must be implemented.

Do not use hardcoded KPI values as though they came from the backend.

If demonstration data is required, load it through the backend and label it appropriately.

---

# 16. FRONTEND INTEGRATION

Use a centralized API client.

Separate API logic from page components.

Use typed interfaces matching backend schemas.

Handle:

- Loading.
- Errors.
- Empty responses.
- Invalid responses.
- Timeouts.
- Provider failures.

After a successful operation, refresh or invalidate affected data.

Examples:

After analysis:
- Update signal details.
- Update signal history.
- Update relevant dashboard summaries.

After ingestion:
- Refresh source health.
- Refresh feed records.
- Refresh signal summaries when applicable.

After rebalancing:
- Refresh index weights.
- Refresh rebalance history.
- Refresh performance information where valid.

After stress testing:
- Refresh stress-test history.
- Refresh portfolio results.
- Refresh loss attribution.

Do not leave stale metrics on the screen after successful operations.

---

# 17. SYNTHETIC DATA REQUIREMENTS

Generate reproducible synthetic data.

Recommended minimum demonstration dataset:

- 100 synthetic financial news records.
- 100 synthetic social media posts.
- 10–20 index constituents.
- A synthetic banking portfolio with multiple asset classes.
- Synthetic transaction records.
- Synthetic historical observations where required.

Use a deterministic random seed.

Generate realistic fictional examples covering:

- Positive earnings.
- Revenue decline.
- Regulatory investigations.
- Credit downgrades.
- Cybersecurity incidents.
- Geopolitical events.
- Interest-rate changes.
- Inflation.
- Supply-chain disruptions.
- Defaults.
- Neutral financial announcements.
- Mixed economic signals.

Process text through the actual NLP engine.

Do not simply assign predefined sentiment scores and pretend the engine predicted them.

Ground-truth labels may be used for tests, but must be distinguishable from model predictions.

Store synthetic datasets under the documented data directory.

Document schemas and generation methodology.

---

# 18. OFFLINE AND FALLBACK BEHAVIOR

The application must remain usable without mandatory paid API keys.

Support the following fallbacks:

- News provider unavailable → local news dataset.
- Social API unavailable → synthetic social feed.
- NLP model unavailable → deterministic fallback.
- Market-data provider unavailable → clearly labeled synthetic observations where suitable.
- Database empty → documented initialization or seed command.

Never silently pretend that a provider is connected.

Display the active data mode.

Provide informative errors.

Do not disable unrelated application features because one external service is unavailable.

The local demonstration must support the complete workflow:

```text
Load sample data
    ->
Analyze text
    ->
Generate risk signal
    ->
Rebalance index
    ->
Run stress test
    ->
Inspect results
```

---

# 19. FINANCIAL CORRECTNESS

Treat financial calculations as first-class business logic.

Do not bury formulas inside frontend components.

Implement calculations in testable backend functions.

For every calculation:

1. Document the formula.
2. Define input units.
3. Define output units.
4. Validate inputs.
5. Handle missing data.
6. Test boundary cases.
7. Check for numerical errors.
8. Record important assumptions.

## Rebalancing

Verify:
- Weights are valid.
- Total allocations are consistent.
- Limits are respected.
- Turnover is calculated correctly.
- No-trade bands work.
- Historical calculations avoid look-ahead bias.

## Stress Testing

Verify:
- Baseline valuation is correct.
- Shocks apply to eligible assets only.
- Interest-rate calculations use documented assumptions.
- Credit-loss calculations use consistent units.
- Aggregated loss matches asset-level results.
- Currency assumptions are consistent.
- Repeated runs do not corrupt history.

Never describe simplified calculations as fully realistic institutional models.

---

# 20. TESTING REQUIREMENTS

Tests must validate behavior, not merely confirm that functions return something.

## NLP Tests

Test:
- Positive sentiment.
- Negative sentiment.
- Neutral sentiment.
- Negation.
- Event classification.
- Impact score boundaries.
- Entity extraction.
- Invalid input.
- Missing text.
- Signal schema validation.

## Ingestion Tests

Test:
- Valid records.
- Invalid responses.
- Duplicate records.
- Missing credentials.
- Provider failures.
- Synthetic data generation.

## Rebalancing Tests

Test:
- Weight normalization.
- Allocation constraints.
- Turnover constraints.
- Neutral signals.
- Positive and negative signals.
- High-impact risk adjustments.
- Invalid configurations.
- Deterministic output.

## Stress-Testing Tests

Test:
- Baseline valuation.
- Equity shocks.
- Interest-rate shocks.
- Credit losses.
- Asset-specific logic.
- Loss attribution.
- Trigger thresholds.
- Duplicate-run protection.

## API Tests

Test:
- Health endpoint.
- Analysis endpoint.
- Signal persistence.
- Signal retrieval.
- Invalid requests.
- Rebalance execution.
- Stress-test execution.
- Database persistence.

## Frontend Tests

Where appropriate, test:
- Navigation.
- Form validation.
- Data rendering.
- Loading states.
- Error states.
- Rebalancing interaction.
- Stress-test interaction.

Run the available test suite after meaningful changes.

Fix failing tests introduced by your changes.

Do not delete or weaken tests simply to make the suite pass.

Do not claim that tests passed unless they were actually executed.

---

# 21. SECURITY AND RELIABILITY

Implement:

- Input validation.
- Safe error handling.
- Parameterized database access through the ORM.
- Request timeouts.
- Safe external content rendering.
- Configurable CORS.
- Input size limits.
- Appropriate API throttling where justified.
- Environment-based secrets.
- Safe logging.
- Dependency pinning.

Do not execute arbitrary user-provided code.

Do not expose internal exception traces in production API responses.

Do not send API credentials to the browser.

Do not trust external content without validation.

Do not commit local database files containing sensitive information.

Synthetic demonstration records may be committed when they contain no confidential or identifying information.

---

# 22. DOCUMENTATION RULES

Maintain:

- `README.md`
- `DESIGN.md`
- `AGENTS.md`
- `LICENSE`
- `.gitignore`
- `.env.example`
- `data/README.md`
- `docs/architecture.md`
- `docs/data_sources.md`
- `docs/methodology.md`
- `docs/limitations.md`
- `docs/demo_script.md`

Also provide:

- Architecture diagram.
- Presentation PDF containing 5–7 slides.
- Dependency files.
- Automated tests.

Documentation must match the implementation.

README commands must be executable.

Do not invent deployment URLs.

Do not invent test results.

Do not claim that a model was evaluated if no evaluation was performed.

Document:

- Data sources.
- Data licensing considerations.
- Synthetic data.
- Model methods.
- Scoring rules.
- Financial assumptions.
- Limitations.
- Setup instructions.
- API configuration.
- Test commands.

Use an MIT license for original project code, while documenting relevant third-party license restrictions.

---

# 23. REPOSITORY HYGIENE

Keep the repository organized.

Do not commit:

- Secrets.
- `.env` files.
- Private credentials.
- Unnecessary model weights.
- Large raw dataset dumps.
- Build artifacts.
- Temporary logs.
- Local caches.
- Unrelated files.

Use `.gitignore`.

Do not rewrite Git history or force-push without explicit authorization.

Do not publish, push, or change repository visibility automatically unless explicitly authorized.

Do not claim that a repository is public or deployed unless verified.

Prefer incremental, understandable changes.

Do not commit on behalf of the user without authorization.

---

# 24. PERFORMANCE AND MAINTAINABILITY

Keep the architecture modular.

Avoid:

- Monolithic backend files.
- Giant React components.
- Duplicated business logic.
- Repeated financial formulas.
- Unnecessary dependencies.
- Circular imports.
- Hardcoded configuration.
- Hidden global state.
- Unnecessary database queries.
- Repeated external API calls.

Use:

- Clear function names.
- Type hints.
- Small, focused service modules.
- Typed frontend interfaces.
- Centralized configuration.
- Shared formatting utilities.
- Reusable components.
- Consistent exception handling.

Optimize only after understanding the actual bottleneck.

Correctness and maintainability take priority over unnecessary complexity.

---

# 25. DEVELOPMENT WORKFLOW

For each implementation task, follow this sequence.

## Step 1: Understand

Inspect relevant files.

Read related instructions.

Identify the current implementation.

Determine the expected behavior.

## Step 2: Plan

Identify:
- Files to create.
- Files to modify.
- Dependencies required.
- APIs affected.
- Database changes.
- Tests required.
- Documentation affected.

For small changes, keep planning brief and proceed directly.

## Step 3: Implement

Make focused changes.

Preserve existing working functionality.

Follow the established architecture.

Do not add unrelated features.

## Step 4: Validate

Run relevant tests.

Check imports and types.

Validate API schemas.

Check financial calculations.

Inspect the resulting UI.

## Step 5: Fix

Investigate failures.

Fix the underlying problem rather than masking it.

Repeat validation when practical.

## Step 6: Document

Update affected documentation.

Record changes to formulas, schemas, endpoints, and assumptions.

## Step 7: Report

Summarize:
- What changed.
- What works.
- What tests ran.
- What tests failed.
- What remains incomplete.
- Any relevant limitations.

Do not claim success without evidence.

---

# 26. DEFINITION OF DONE

A task is complete only when its actual requirements are implemented and verified to the extent possible.

## Core Engine

- [ ] Two independent data-source categories.
- [ ] News ingestion.
- [ ] Social or simulated social ingestion.
- [ ] Preprocessing.
- [ ] Entity extraction.
- [ ] Sentiment score.
- [ ] Event classification.
- [ ] Impact score.
- [ ] Explainable output.
- [ ] Structured signal storage.
- [ ] Functional API.

## Module A

- [ ] Configurable stock index.
- [ ] Sentiment-driven allocation logic.
- [ ] Impact-aware risk adjustments.
- [ ] Allocation constraints.
- [ ] Weight normalization.
- [ ] Rebalance preview.
- [ ] Simulated execution.
- [ ] Historical records.
- [ ] Functional dashboard.

## Module B

- [ ] Synthetic banking portfolio.
- [ ] Multiple asset classes.
- [ ] Configurable event triggers.
- [ ] Multiple stress scenarios.
- [ ] Asset-specific shock calculations.
- [ ] Before-and-after comparison.
- [ ] Loss attribution.
- [ ] Historical stress-test records.
- [ ] Functional dashboard.

## Frontend

- [ ] Consistent design system.
- [ ] Functional routing.
- [ ] Real backend integration.
- [ ] Responsive layout.
- [ ] Loading states.
- [ ] Error states.
- [ ] Empty states.
- [ ] Functional forms and controls.
- [ ] Accessible navigation.

## Engineering

- [ ] Persistent database.
- [ ] Environment configuration.
- [ ] Automated tests.
- [ ] Reproducible synthetic data.
- [ ] Offline fallback.
- [ ] Secure handling of credentials.
- [ ] Documented setup commands.

## Submission

- [ ] README.
- [ ] DESIGN.md.
- [ ] AGENTS.md.
- [ ] MIT LICENSE.
- [ ] Dependency files.
- [ ] Architecture documentation.
- [ ] Data-source documentation.
- [ ] Methodology documentation.
- [ ] Synthetic dataset documentation.
- [ ] Architecture diagram.
- [ ] Presentation PDF.
- [ ] Demo script.
- [ ] No confidential data.
- [ ] Original implementation.
- [ ] Honest results and limitations.

---

# 27. FINAL OPERATING INSTRUCTIONS

You are expected to function as an autonomous coding agent.

Do not repeatedly ask the user for permission to implement ordinary project requirements.

Do not stop after creating the UI.

Do not stop after creating the backend.

Do not replace real calculations with hardcoded values.

Do not make nonfunctional controls appear operational.

Do not silently disable features when providers fail.

Do not invent model accuracy, financial returns, portfolio losses, or connection statuses.

Do not use confidential client data or copied project implementations.

Use synthetic data and permitted public sources.

Maintain consistency with `DESIGN.md`.

Maintain consistency between the backend, frontend, schemas, tests, and documentation.

When a feature is incomplete, state that it is incomplete.

When a test is not executed, state that it was not executed.

When a limitation requires user action, explain the exact action required.

The final deliverable must be a functional, independently implemented, explainable, maintainable, and demonstrable financial risk intelligence platform.

The application's central workflow must remain:

```text
UNSTRUCTURED FINANCIAL DATA
        |
        v
AI/NLP RISK ENGINE
        |
        v
STRUCTURED RISK SIGNALS
        |
        +---------------------------+
        |                           |
        v                           v
TACTICAL INDEX                STRATEGIC PORTFOLIO
REBALANCING                   STRESS TESTING
        |                           |
        +-------------+-------------+
                      |
                      v
             EXPLAINABLE ANALYTICS
```

Prioritize correctness, originality, financial integrity, transparency, and reliable end-to-end functionality.
