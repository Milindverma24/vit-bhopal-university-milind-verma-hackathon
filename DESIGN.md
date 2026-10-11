# RiskPulse AI — Complete Design System
## DESIGN.md

Version: 1.0
Project: RiskPulse AI
Product Type: AI-Powered Financial Risk Intelligence Platform
Design Direction: Minimalist, Monochrome, Editorial, Institutional Analytics
Theme: Light
Primary Colors: Black, White, Grayscale
Frontend: React + TypeScript + Vite
Styling: Tailwind CSS + CSS Variables
Charts: Recharts
Icons: Lucide React

---

# 1. DESIGN VISION

## 1.1 Product Overview

RiskPulse AI is an AI-powered financial risk intelligence platform that transforms unstructured financial news and social media content into structured, explainable risk signals.

The platform consists of three integrated systems:

1. AI/NLP Risk Engine
2. Tactical Index Rebalancing
3. Strategic Portfolio Stress Testing

The interface must communicate analytical precision, financial credibility, and technical sophistication.

The design should feel like a modern institutional analytics product rather than a generic admin dashboard.

The interface must be visually distinctive while maintaining simplicity.

## 1.2 Design Philosophy

The entire application follows six principles.

### Principle 1: Monochrome First

Use black, white, and grayscale as the foundation.

Black is the primary action color.

White provides the primary canvas.

Light gray distinguishes sections, inputs, and secondary surfaces.

Dark gray provides secondary text and metadata.

Avoid decorative gradients, unnecessary accent colors, colorful backgrounds, and excessive visual effects.

### Principle 2: Typography Creates Hierarchy

Use large, bold, sentence-case headings.

Avoid excessive uppercase headings.

Use font weight, size, spacing, and contrast to distinguish content.

Financial metrics must be immediately readable.

### Principle 3: Pills Define Interaction

All standard interactive controls use pill-shaped geometry.

Buttons, filters, category selectors, navigation actions, and segmented controls should consistently follow the pill system.

Cards use a separate 16px radius.

### Principle 4: Information Before Decoration

Every chart, card, and table must communicate useful information.

Do not add decorative graphs, meaningless statistics, or artificial activity indicators.

Every displayed financial metric must originate from actual backend results, a documented calculation, or explicitly labeled synthetic data.

### Principle 5: Editorial Layouts

Use generous whitespace, clear alignment, and structured content sections.

Alternate white content sections with occasional black promotional or emphasis panels.

The interface must not feel crowded.

### Principle 6: Explainable Intelligence

Model-generated financial risk signals must be understandable.

Display not only the score but also the reason behind it, the source text, the classification method, and relevant confidence information.

The design should make it easy to understand how unstructured text becomes a financial decision signal.

---

# 2. GLOBAL DESIGN TOKENS

All components must use centralized design tokens.

Do not independently invent colors, spacing, radii, or typography for individual pages.

## 2.1 Color Palette

### Primary Colors

| Token | Value | Usage |
|---|---|---|
| primary | #000000 | Primary buttons, active navigation, emphasis |
| on-primary | #FFFFFF | Text on black backgrounds |
| ink | #000000 | Headings and primary text |
| canvas | #FFFFFF | Main application background |
| canvas-soft | #EFEFEF | Secondary surfaces and input backgrounds |
| canvas-softer | #F3F3F3 | Nested surfaces and subtle sections |
| surface-pressed | #E2E2E2 | Pressed and selected states |
| black-elevated | #282828 | Hover states and elevated dark surfaces |
| body | #5E5E5E | Secondary text |
| mute | #767676 | Supporting text and metadata |
| hairline | #D9D9D9 | Table separators and subtle borders |
| hairline-mid | #4B4B4B | Stronger separators and muted dark-surface links |
| on-dark | #FFFFFF | Text on black surfaces |
| link | #0000EE | Standard informational links |

Use #767676 rather than very light gray for essential text on white backgrounds to maintain readable contrast.

Reserve #AFAFAF for decorative separators and nonessential visual details.

### Semantic Financial Indicators

The visual identity remains monochromatic.

Represent financial status primarily through text, icons, labels, shapes, and grayscale contrast.

Examples:

- Positive: `+2.4%`, upward arrow, "Positive"
- Negative: `-3.8%`, downward arrow, "Negative"
- Neutral: horizontal arrow, "Neutral"
- High risk: black-filled badge with white text
- Critical risk: black badge with an additional warning icon and explicit label
- Low risk: light-gray badge with dark text
- Unknown: outlined badge with "Unavailable"

Do not rely on color alone to communicate financial status.

Positive and negative values must always include an explicit sign or explanatory label where appropriate.

For financial analysis, monochrome presentation must not obscure the direction or severity of risk.

## 2.2 CSS Variables

Define these variables in the global stylesheet.

```css
:root {
  --color-primary: #000000;
  --color-on-primary: #ffffff;

  --color-ink: #000000;
  --color-body: #5e5e5e;
  --color-mute: #767676;

  --color-hairline: #d9d9d9;
  --color-hairline-mid: #4b4b4b;

  --color-canvas: #ffffff;
  --color-canvas-soft: #efefef;
  --color-canvas-softer: #f3f3f3;
  --color-surface-pressed: #e2e2e2;

  --color-black-elevated: #282828;
  --color-on-dark: #ffffff;

  --color-link: #0000ee;

  --radius-none: 0;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-pill: 999px;
  --radius-full: 9999px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  --container-max-width: 1440px;
  --content-max-width: 1200px;

  --shadow-card:
    0 4px 16px rgba(0, 0, 0, 0.12);

  --shadow-modal:
    0 8px 32px rgba(0, 0, 0, 0.16);

  --shadow-floating:
    0 2px 8px rgba(0, 0, 0, 0.16);

  --transition-fast: 150ms ease;
  --transition-normal: 220ms ease;

  --font-display:
    "Inter", "Geist", system-ui, -apple-system,
    BlinkMacSystemFont, "Segoe UI", sans-serif;

  --font-body:
    "Inter", system-ui, -apple-system,
    BlinkMacSystemFont, "Segoe UI", sans-serif;
}
```

If the supplied proprietary display fonts are unavailable, use Inter or Geist.

Do not download or redistribute proprietary font files without permission.

## 2.3 Typography

Use Inter as the default font family.

Use bold weights for display typography and regular or medium weights for body content.

| Token | Font Size | Weight | Line Height | Usage |
|---|---:|---:|---:|---|
| display-xxl | 52px | 700 | 1.23 | Landing-page headline |
| display-xl | 40px | 700 | 1.15 | Major section headings |
| display-lg | 32px | 700 | 1.25 | Page headings |
| display-md | 24px | 700 | 1.33 | Card headings |
| display-sm | 20px | 700 | 1.40 | Subsection headings |
| heading-sm | 18px | 600 | 1.45 | Small section titles |
| body-lg | 18px | 500 | 1.50 | Lead paragraphs |
| body-md | 16px | 400 | 1.50 | Standard text |
| body-md-strong | 16px | 500 | 1.25 | Navigation and buttons |
| body-sm | 14px | 400 | 1.43 | Supporting text |
| body-sm-strong | 14px | 500 | 1.25 | Table labels and chips |
| caption | 12px | 400 | 1.50 | Timestamps and metadata |
| metric-xl | 36px | 700 | 1.15 | Primary KPI values |
| metric-lg | 28px | 700 | 1.20 | Secondary KPI values |
| metric-md | 22px | 700 | 1.25 | Compact KPI values |
| metric-sm | 18px | 600 | 1.30 | Inline metrics |

### Typography Rules

- Use sentence-case headings.
- Do not use all-uppercase display headlines.
- Avoid decorative letter spacing.
- Use bold weights for headings.
- Use medium weights for buttons.
- Use regular weights for paragraphs.
- Use tabular numerals for financial figures where supported.
- Keep body paragraphs comfortably readable.
- Avoid excessively small text for essential risk information.

Recommended numeric styling:

```css
font-variant-numeric: tabular-nums;
```

Financial values should align vertically in tables and comparison views.

---

# 3. SHAPE SYSTEM

## 3.1 Signature Pill

The signature interactive shape is a pill with a 999px border radius.

Apply it to:

- Primary buttons.
- Secondary buttons.
- Filter chips.
- Search action buttons.
- Navigation action buttons.
- Segmented selectors.
- Source category selectors.
- Status filters.
- Pagination controls.
- Small action controls.
- Rebalance action buttons.
- Stress-test action buttons.

The pill is the primary visual signature of the interface.

## 3.2 Card Radius

Use 16px for standard cards.

Examples:

- KPI cards.
- Chart containers.
- News cards.
- Signal details.
- Portfolio summaries.
- Stress-test results.
- Modal dialogs.
- Empty-state containers.

Do not make cards pill-shaped.

## 3.3 Input Radius

Use 8px for text inputs, dropdowns, and form fields.

Inputs are the exception to the general pill-shaped interactive-control rule.

## 3.4 Circular Controls

Use 9999px for genuinely circular icon-only controls.

Examples:

- Sidebar collapse button.
- Small utility controls.
- Close buttons.

---

# 4. SPACING AND GRID

## 4.1 Spacing

Use the centralized spacing scale.

4px: Minimal icon spacing.

8px: Related text and small elements.

12px: Form controls and compact component spacing.

16px: Standard component spacing.

24px: Card padding.

32px: Section spacing.

40px: Major layout gaps.

48px: Large content separation.

64px: Major page-section spacing.

Avoid arbitrary margins and paddings.

## 4.2 Application Container

Maximum application width: 1440px.

Maximum analytical content width: 1200px.

Desktop horizontal page padding: 32px.

Tablet horizontal page padding: 24px.

Mobile horizontal page padding: 16px.

The application shell may occupy the available desktop width, while individual content sections remain aligned to the analytical content grid.

## 4.3 Grid System

Desktop:

- Four KPI cards per row where appropriate.
- Two-column analytical sections.
- Twelve-column grid for complex layouts.
- Sidebar navigation plus main content.
- Tables use available horizontal space.

Tablet:

- Two KPI cards per row.
- Two-column charts where space permits.
- Stack complex panels when readability decreases.

Mobile:

- One KPI card per row or a compact two-column KPI layout when values remain readable.
- One chart per row.
- One-column forms.
- Horizontally scrollable data tables.
- Collapsed sidebar navigation.

Do not squeeze desktop tables into unreadable mobile layouts.

---

# 5. APPLICATION ARCHITECTURE AND NAVIGATION

## 5.1 Application Shell

The main application consists of:

1. Global header.
2. Sidebar navigation.
3. Main content area.
4. Optional contextual action bar.
5. Toast notification layer.
6. Modal dialog layer.

Desktop navigation uses a left sidebar.

The header contains the product identity, global search, data-mode indicator, and user utilities.

The main content area changes according to the active route.

## 5.2 Brand Identity

Product name:

RiskPulse AI

Tagline:

"Turn financial signals into actionable intelligence."

Use a custom monochrome wordmark treatment.

Do not use another company's logo, trademark, proprietary artwork, or brand assets.

A simple geometric waveform or signal icon may accompany the wordmark.

Keep the logo black on white and white on black.

## 5.3 Primary Navigation

Organize navigation into the following sections.

### Overview

- Executive Overview

### Intelligence

- News & Social Feed
- NLP Risk Engine
- Risk Signal Explorer
- Company Risk Profiles

### Portfolio

- Index Rebalancing
- Portfolio Explorer
- Stress Testing

### System

- Data Sources
- Historical Analysis
- Methodology & Audit

Each navigation item includes:

- Lucide icon.
- Label.
- Active state.
- Keyboard focus state.
- Optional count badge when meaningful.

The active navigation item uses a black left-edge indicator and a subtle gray background.

Do not use brightly colored active states.

## 5.4 Header

The header contains:

Left:
- Product wordmark.
- Sidebar toggle when appropriate.

Center:
- Optional global search.

Right:
- Data-mode indicator.
- Refresh control.
- Help or documentation control.
- User menu if authentication exists.

The header is white with a subtle bottom border.

Keep the header height between 64px and 76px.

Use a sticky header on long analytical pages.

## 5.5 Data Mode Indicator

Show the current data mode prominently.

Examples:

"DEMO DATA"

"LIVE PUBLIC DATA"

"OFFLINE MODE"

"PARTIAL DATA"

Use neutral pill badges.

Never label synthetic data as live data.

If external sources fail, display a clear message.

Do not fabricate successful connection indicators.

---

# 6. BUTTON SYSTEM

## 6.1 Primary Button

Background: #000000.

Text: #FFFFFF.

Border radius: 999px.

Font size: 16px.

Font weight: 500.

Minimum height: 44px.

Padding: 12px 20px.

Use for the primary action in a visible workflow.

Examples:

- Analyze Text.
- Run Rebalance.
- Run Stress Test.
- Refresh Data.
- Confirm Changes.

```html
<button class="btn btn-primary">
  Analyze Text
</button>
```

## 6.2 Secondary Button

Background: #FFFFFF.

Text: #000000.

Border: 1px solid #D9D9D9.

Border radius: 999px.

Use for secondary actions.

Examples:

- View Details.
- Cancel.
- Export CSV.
- View Methodology.

## 6.3 Subtle Button

Background: #EFEFEF.

Text: #000000.

Border: none.

Border radius: 999px.

Use for tertiary actions and small utilities.

Examples:

- Clear Filters.
- Reset Parameters.
- Load Sample Data.

## 6.4 Dark-Band Secondary Button

Background: #FFFFFF.

Text: #000000.

Border radius: 999px.

Use inside black feature sections.

## 6.5 Icon Button

Use a circular or pill-shaped control.

Provide an accessible label.

Do not rely on an icon without a tooltip or accessible name when its purpose is unclear.

## 6.6 Button States

Default:
- Normal background.

Hover:
- Slightly elevated or darker background.

Pressed:
- #E2E2E2 for light controls.
- #282828 for dark controls.

Disabled:
- Reduced contrast.
- No hover animation.
- Not interactive.

Loading:
- Display a spinner and meaningful action text.
- Prevent duplicate submissions.

Examples:

"Analyzing..."

"Rebalancing..."

"Running stress test..."

Do not show loading animations after the operation has completed.

---

# 7. INPUTS AND FORMS

## 7.1 Standard Input

Background: #EFEFEF.

Text: #000000.

Border radius: 8px.

Padding: 16px.

Minimum height: 48px.

Placeholder: readable medium gray.

Avoid floating-label patterns unless required by a specific form.

## 7.2 Input Labels

Place labels above their controls.

Use 14px medium-weight text.

Provide concise helper text when necessary.

Do not rely on placeholders as the only labels.

## 7.3 Focus State

Use a clearly visible black outline or border.

Maintain a minimum 2px visible focus indicator.

Ensure focus indicators are not clipped by surrounding containers.

## 7.4 Error State

Use:
- Clear error text.
- Warning icon where appropriate.
- Visible field association.
- An accessible error description.

Do not depend on red coloring alone.

## 7.5 Search Input

Use a soft-gray background.

Include a search icon.

Support clearing the query.

Debounce requests where appropriate.

Display loading and empty states.

## 7.6 Numeric Inputs

For portfolio parameters:

- Show units.
- Validate minimum and maximum values.
- Reject invalid numbers.
- Explain parameter assumptions.
- Use sensible defaults.
- Prevent accidental invalid submissions.

Examples:

Interest-rate shock: basis points.

Equity shock: percentage.

Portfolio exposure: currency amount.

Impact threshold: integer from 1 to 10.

---

# 8. CARD SYSTEM

## 8.1 Standard Card

Background: #FFFFFF.

Border radius: 16px.

Padding: 24px.

Shadow: none by default.

Use a subtle border where separation is needed.

## 8.2 Elevated Card

Background: #FFFFFF.

Border radius: 16px.

Padding: 24px.

Shadow: 0 4px 16px rgba(0, 0, 0, 0.12).

Use sparingly.

## 8.3 Soft Card

Background: #EFEFEF.

Border radius: 16px.

Padding: 24px.

Use for secondary information, explanatory notes, and embedded controls.

## 8.4 Dark Feature Card

Background: #000000.

Text: #FFFFFF.

Border radius: 16px.

Padding: 24px or 32px.

Use for major risk alerts, selected summaries, or high-emphasis analytical callouts.

Do not make every card black.

## 8.5 Card Header

A card header contains:

- Title.
- Optional description.
- Optional time range.
- Optional action.

Use a horizontal layout on desktop.

Stack on mobile.

## 8.6 Card Footer

Use a subtle top border when separating supporting information.

Do not add unnecessary card footers.

---

# 9. PAGE 1 — EXECUTIVE OVERVIEW

Route:

/dashboard

Purpose:

Provide a concise overview of the current financial risk environment and the state of the application.

## 9.1 Page Header

Title:

"Financial risk at a glance"

Description:

"Monitor market sentiment, significant events, and simulated portfolio exposure."

Right-side controls:

- Time-range selector.
- Refresh button.
- Data-mode indicator.

## 9.2 KPI Cards

Display four primary KPI cards.

### KPI 1: Signals Processed

Display:
- Total processed signals.
- Change from a comparable previous period only when calculated from actual data.
- Supporting label.

### KPI 2: Negative Sentiment

Display:
- Negative signal count or proportion.
- Clearly defined denominator.
- Selected time period.

### KPI 3: High-Impact Events

Display:
- Count of signals meeting the configured high-impact threshold.
- Threshold definition.

### KPI 4: Average Sentiment

Display:
- Average sentiment score.
- Range from -1.0 to +1.0.
- Interpretation.

Every KPI must be calculated from backend data.

If data is unavailable, show "Unavailable" or a useful empty state.

Never fabricate KPI values.

## 9.3 Main Analytical Grid

Left column:
- Sentiment Trend.

Right column:
- Event Classification Distribution.

Second row:
- Impact Score Distribution.
- Top Risk-Exposed Companies.

Third row:
- Recent High-Impact Signals.
- Data Source Health.

## 9.4 Sentiment Trend

Use a line chart.

Horizontal axis:
- Time.

Vertical axis:
- Sentiment score.

Use a monochrome line.

Show a clearly labeled zero reference line.

Support:
- Time-range filtering.
- Tooltips.
- Empty state.
- Accessible data summary.

## 9.5 Event Distribution

Use a horizontal bar chart.

Display event categories and counts.

Sort by frequency.

Use grayscale bars.

Avoid colorful categorical palettes.

## 9.6 Recent Signals

Show a compact table containing:

- Headline.
- Company.
- Sentiment.
- Event type.
- Impact score.
- Timestamp.

Clicking a row opens the signal detail page.

## 9.7 Source Health

Show:
- Source name.
- Source category.
- Connection state.
- Last successful refresh.
- Record count.
- Data mode.

Distinguish an unavailable provider from a provider that has never been configured.

---

# 10. PAGE 2 — NEWS AND SOCIAL FEED

Route:

/intelligence/feed

Purpose:

Display incoming financial news and social media records.

## 10.1 Header

Title:

"News and social intelligence"

Description:

"Explore financial narratives entering the risk engine."

Actions:
- Refresh.
- Load demonstration records.
- Select source.

## 10.2 Filters

Include:
- Source type.
- Company.
- Ticker.
- Date range.
- Event category.
- Sentiment.
- Minimum impact score.

Filters use pill-shaped selectors.

On mobile, place filters in a collapsible filter panel.

## 10.3 Feed Layout

Use a vertically stacked feed.

Each record contains:

- Source name.
- Source type.
- Publication timestamp.
- Headline or post text.
- Extracted company.
- Ticker.
- Sentiment label.
- Event classification.
- Impact score.
- Synthetic/public data label.
- View analysis action.

## 10.4 Feed Card

Background: white.

Border radius: 16px.

Padding: 24px.

Use a subtle divider between records or a restrained card border.

Do not introduce decorative news thumbnails unless genuine relevant imagery is available.

## 10.5 Feed Interactions

Users can:
- Open a record.
- Analyze text.
- Filter by company.
- Copy a source reference.
- View source provenance.
- Open the original public source when a valid link exists.

Do not create fake source links.

Do not imply that simulated social posts originated from real accounts.

---

# 11. PAGE 3 — NLP RISK ENGINE

Route:

/intelligence/analyze

Purpose:

Allow users to submit text and inspect the actual analysis pipeline.

This is one of the most important pages in the application.

## 11.1 Header

Title:

"Analyze financial intelligence"

Description:

"Transform unstructured financial text into structured risk signals."

## 11.2 Main Layout

Desktop:

Two-column layout.

Left:
- Input form.
- Source configuration.
- Analysis controls.

Right:
- Analysis result.
- Sentiment visualization.
- Event classification.
- Impact score.

On mobile, stack the form and results vertically.

## 11.3 Input Form

Fields:

Headline:
- Optional short text field.

Article or post:
- Multiline text area.

Source type:
- Financial news.
- Social media.
- Manual input.
- Synthetic demonstration.

Company or ticker:
- Optional selector.

Analysis method:
- Automatic.
- Configured NLP model.
- Rule-based fallback when applicable.

Button:

"Analyze Text"

## 11.4 Input Validation

- Require meaningful text.
- Enforce a documented maximum input length.
- Reject empty content.
- Display validation errors.
- Show processing state.
- Prevent duplicate submissions.

## 11.5 Sentiment Result

Display a prominent score.

Example:

Sentiment Score
-0.72
Negative

Show a horizontal scale from -1.0 to +1.0.

Include:
- Score.
- Label.
- Method.
- Confidence estimate where available.

Do not invent confidence values.

## 11.6 Event Classification Result

Display:
- Event category.
- Classification confidence.
- Supporting evidence.
- Relevant entities.

Example:

Event Category
Credit Event

## 11.7 Impact Result

Display:
- Impact score from 1 to 10.
- Severity label.
- Explanation.
- Main factors.

Example:

Impact Score
8 / 10
High potential impact

This score represents a model estimate, not a guaranteed market outcome.

## 11.8 Explanation Panel

Display a concise explanation answering:

- What was detected?
- Why does it matter?
- Which entity is affected?
- Why was the impact score assigned?
- Which limitations should be considered?

The explanation must be based on actual analysis results.

## 11.9 Structured Output

Provide a JSON panel showing the actual API response.

Allow:
- Expand/collapse.
- Copy JSON.
- Download JSON.

Do not hardcode the example response.

## 11.10 Processing Information

Display:
- Selected NLP method.
- Processing timestamp.
- Source category.
- Data provenance.
- Synthetic-data status.
- Processing errors, if any.

---

# 12. PAGE 4 — RISK SIGNAL EXPLORER

Route:

/intelligence/signals

Purpose:

Provide a searchable repository of structured risk signals.

## 12.1 Header

Title:

"Risk signal explorer"

Description:

"Search, filter, and investigate generated financial risk signals."

## 12.2 Filter Bar

Include:
- Search.
- Date range.
- Ticker.
- Company.
- Sentiment.
- Event classification.
- Impact threshold.
- Source type.
- Synthetic/public status.

Provide:
- Apply filters.
- Clear filters.

## 12.3 Data Table

Columns:

1. Timestamp.
2. Headline.
3. Company.
4. Ticker.
5. Sentiment.
6. Event type.
7. Impact score.
8. Source.
9. Actions.

Use consistent column widths.

Keep numeric columns aligned.

Use horizontal scrolling on narrow screens.

## 12.4 Table Styling

Header background: #EFEFEF.

Body background: #FFFFFF.

Row separator: #D9D9D9.

Header typography: 14px, medium weight.

Body typography: 14px, regular weight.

Row hover: #F3F3F3.

## 12.5 Row Interaction

Clicking a row opens a detailed signal view.

The detail view includes:

- Full text.
- Extracted entities.
- Sentiment score.
- Event classification.
- Impact score.
- Explanation.
- Source metadata.
- Processing method.
- Timestamp.
- Provenance.

## 12.6 Pagination

Include:
- Current page.
- Total available records.
- Previous.
- Next.
- Page size selector.

Do not claim a total record count unless the backend provides it.

---

# 13. PAGE 5 — COMPANY RISK PROFILES

Route:

/intelligence/companies

Purpose:

Provide company-level financial risk intelligence.

## 13.1 Company List

Display:
- Company.
- Ticker.
- Sector.
- Latest sentiment.
- Average sentiment.
- High-impact event count.
- Latest event timestamp.

Allow search and filtering.

## 13.2 Company Detail

Route:

/intelligence/companies/:ticker

Display:

Header:
- Company name.
- Ticker.
- Sector.
- Available public-data status.

KPI cards:
- Latest sentiment.
- Average sentiment.
- High-impact signals.
- Negative-sentiment proportion.

Charts:
- Sentiment history.
- Impact history.
- Event distribution.

Tables:
- Recent news.
- Relevant social posts.
- Historical risk signals.

## 13.3 Company-Level Explanations

Explain whether the company's current signal is based on:

- A single observation.
- Several independent observations.
- A limited data sample.
- A high-impact event.

Do not imply that sentiment alone establishes a company's future stock performance.

---

# 14. PAGE 6 — TACTICAL INDEX REBALANCING

Route:

/portfolio/rebalancing

Purpose:

Visualize and execute sentiment-driven changes to a simulated stock index.

## 14.1 Header

Title:

"Tactical index rebalancing"

Description:

"Evaluate how NLP-derived sentiment and event risk influence simulated index allocations."

Show:
- Simulation status.
- Index name.
- Number of constituents.
- Last rebalance time.

## 14.2 KPI Cards

Display:

1. Number of Constituents.
2. Current Simulated Allocation.
3. Proposed Turnover.
4. Latest Rebalance Timestamp.

Where valid data exists, also display relevant portfolio metrics.

## 14.3 Constituent Table

Columns:

- Company.
- Ticker.
- Sector.
- Current Weight.
- Proposed Weight.
- Weight Change.
- Sentiment.
- Impact Score.
- Risk Status.

Use tabular numerals.

Show positive weight changes with a plus sign.

Show negative weight changes with a minus sign.

Display allocation constraints in a methodology panel.

## 14.4 Allocation Visualization

Create a current-versus-proposed comparison.

Preferred presentation:

Two horizontal bar charts.

Chart A: Current weights.
Chart B: Proposed weights.

Use grayscale bars.

Use tooltips for:
- Company.
- Ticker.
- Current allocation.
- Proposed allocation.
- Difference.

Ensure the sum of valid portfolio weights is represented correctly.

## 14.5 Weight Change Chart

Display allocation changes for each constituent.

Use a clearly labeled zero reference line.

Positive values indicate increases.

Negative values indicate decreases.

## 14.6 Rebalance Configuration

Provide controls for:

- Sentiment sensitivity.
- Risk penalty.
- Minimum weight.
- Maximum weight.
- Maximum turnover.
- Minimum signal confidence.
- No-trade threshold.
- Sector concentration limit where implemented.

Display units and constraints.

Prevent invalid configurations.

## 14.7 Rebalance Workflow

Step 1: User configures the rebalancing parameters.
Step 2: User clicks "Preview Rebalance".
Step 3: Backend calculates proposed allocations.
Step 4: Frontend displays proposed weights and turnover.
Step 5: User reviews the changes.
Step 6: User clicks "Execute Simulated Rebalance".
Step 7: Backend validates constraints and persists the resulting allocations.
Step 8: Frontend displays the new allocation and history.

Do not execute an irreversible action without appropriate confirmation.

## 14.8 Rebalance Explanation

For every constituent, show:

- Relevant sentiment.
- Relevant event.
- Risk adjustment.
- Previous weight.
- Proposed weight.
- Explanation for the change.

Do not invent an explanation unrelated to the actual allocation algorithm.

## 14.9 Historical Analysis

Display:
- Rebalance history.
- Historical allocations.
- Simulated returns where supported.
- Turnover.
- Volatility.
- Maximum drawdown.
- Benchmark comparison when valid data exists.

Mark simulated results clearly.

Never display invented investment returns.

---

# 15. PAGE 7 — PORTFOLIO EXPLORER

Route:

/portfolio/explorer

Purpose:

Explore the synthetic wholesale banking portfolio used by the stress-testing engine.

## 15.1 Header

Title:

"Portfolio explorer"

Description:

"Inspect synthetic assets, exposures, and portfolio concentration."

Show a persistent label:

"SYNTHETIC PORTFOLIO"

## 15.2 KPI Cards

Display:
- Total Portfolio Value.
- Number of Holdings.
- Number of Asset Classes.
- Largest Sector Exposure.

All values must be calculated from the stored synthetic portfolio.

## 15.3 Asset Allocation

Display a grayscale bar chart or a monochrome donut chart.

Include a table containing:
- Asset class.
- Exposure.
- Portfolio percentage.
- Holding count.

## 15.4 Holdings Table

Columns:

- Synthetic Transaction ID.
- Synthetic Customer ID.
- Asset Type.
- Sector.
- Country.
- Exposure.
- Market Value.
- Credit Rating.
- Maturity.
- Risk Information.

Do not display real personal information.

## 15.5 Filters

Include:
- Asset class.
- Sector.
- Country.
- Credit rating.
- Exposure range.
- Maturity range.

## 15.6 Detail View

Show:
- Holding information.
- Valuation assumptions.
- Credit exposure.
- Relevant risk parameters.
- Applicable scenario shocks.

Clearly distinguish source data from derived metrics.

---

# 16. PAGE 8 — STRATEGIC PORTFOLIO STRESS TESTING

Route:

/portfolio/stress-testing

Purpose:

Simulate how major events may affect the synthetic banking portfolio.

This page must be fully integrated with the NLP Risk Engine.

## 16.1 Header

Title:

"Portfolio stress testing"

Description:

"Simulate the potential financial impact of high-impact events and market shocks."

Display:
- Portfolio type.
- Synthetic-data label.
- Latest stress-test timestamp.

## 16.2 Portfolio Summary

Display:
- Baseline portfolio value.
- Number of holdings.
- Major asset classes.
- Current synthetic exposure.

## 16.3 Event Trigger Panel

Display the most recent eligible high-impact signals.

For each event:
- Headline.
- Event category.
- Impact score.
- Detected timestamp.
- Relevant entities.
- Trigger status.

Allow the user to inspect the source signal.

Example:

Event: Geopolitical Event
Impact Score: 8 / 10
Trigger: Eligible for configured stress scenario

This must be determined by actual backend logic.

## 16.4 Scenario Selector

Include:

1. Geopolitical Escalation.
2. Interest Rate Shock.
3. Inflation Shock.
4. Credit Crisis.
5. Market Crash.
6. Supply Chain Disruption.
7. Custom Scenario.

Each scenario must have a description and configurable parameters.

## 16.5 Scenario Configuration

Example parameters:

- Equity shock: Percentage.
- Interest-rate shock: Basis points.
- Credit-spread shock: Basis points.
- Probability-of-default multiplier: Multiplier.
- Loss-given-default adjustment: Percentage or defined factor.
- Country exposure shock: Percentage.
- Sector exposure shock: Percentage.

Only display controls relevant to the selected scenario.

Validate parameter ranges.

## 16.6 Stress-Test Execution

Workflow:

1. Select a scenario.
2. Configure shocks.
3. Preview assumptions.
4. Click "Run Stress Test".
5. Backend evaluates each applicable holding.
6. Backend calculates stressed valuations.
7. Backend aggregates results.
8. Backend persists the run.
9. Frontend displays results.

The calculation must happen in the backend.

Do not simulate results exclusively in the frontend.

## 16.7 Results Summary

Display:

Portfolio Value Before
Portfolio Value After
Absolute Change
Percentage Change

Use large, clearly aligned financial metrics.

Show a prominent label:

"SIMULATED SCENARIO"

## 16.8 Before-and-After Comparison

Create a comparison chart.

Show baseline value and stressed value.

Include:
- Currency.
- Percentage change.
- Absolute difference.
- Scenario name.

Use monochrome bars and clear numerical labels.

## 16.9 Loss Attribution

Display:
- Loss by asset class.
- Loss by sector.
- Loss by country.
- Major contributing exposures.

Use horizontal bar charts.

Sort by absolute contribution.

Include tooltips and numeric values.

## 16.10 Stress-Test Explanation

Show:

- Triggering event.
- Triggering signal ID.
- Impact score.
- Scenario parameters.
- Assets affected.
- Main loss contributors.
- Calculation method.
- Limitations.

## 16.11 Stress-Test History

Table columns:

- Timestamp.
- Scenario.
- Triggering Event.
- Portfolio Before.
- Portfolio After.
- Absolute Change.
- Percentage Change.
- Actions.

Allow a user to reopen previous results.

Do not rerun a scenario when the user merely opens its history record.

---

# 17. PAGE 9 — DATA SOURCES

Route:

/system/data-sources

Purpose:

Make data provenance and ingestion health transparent.

## 17.1 Header

Title:

"Data sources"

Description:

"Monitor public data providers, ingestion activity, and synthetic demonstration datasets."

## 17.2 Source Cards

Display:
- Source name.
- Source category.
- Access method.
- Connection status.
- Last successful refresh.
- Records processed.
- Error information.
- Data classification.

Possible categories:

- Financial news.
- Public news events.
- Social media datasets.
- Market prices.
- Synthetic financial news.
- Synthetic social posts.
- Synthetic banking transactions.

## 17.3 Connection States

Use explicit labels:

- Connected.
- Not Configured.
- Unavailable.
- Rate Limited.
- Offline.
- Synthetic Mode.

Do not display a green indicator or "Connected" when no successful connection has been verified.

## 17.4 Actions

Provide:
- Refresh source.
- Load sample dataset.
- Generate synthetic data.
- Inspect source details.
- View ingestion history.

## 17.5 API Key Privacy

Never display actual API keys.

Show only whether an optional configuration value appears to be configured.

Do not send secrets to the frontend.

---

# 18. PAGE 10 — HISTORICAL ANALYSIS

Route:

/analytics/history

Purpose:

Analyze how risk signals and portfolio outcomes change over time.

## 18.1 Header

Title:

"Historical risk analysis"

Description:

"Explore changes in financial sentiment, event severity, and simulated portfolio outcomes."

## 18.2 Filters

Include:
- Time range.
- Company.
- Sector.
- Event category.
- Data source.
- Signal confidence.
- Impact threshold.

## 18.3 Visualizations

Include:

1. Sentiment Over Time.
2. Event Frequency Over Time.
3. High-Impact Event Frequency.
4. Average Impact Score.
5. Rebalance History.
6. Stress-Test Outcomes.

Use consistent chart styling.

## 18.4 Data Quality

Display the number of observations included in each analysis.

Show warnings when:
- Sample sizes are small.
- Historical data is incomplete.
- Synthetic and public data are mixed.
- The selected period has no records.

Do not extrapolate beyond available data without explicitly labeling the result as a model estimate.

---

# 19. PAGE 11 — METHODOLOGY AND AUDIT

Route:

/system/methodology

Purpose:

Make the platform explainable and suitable for technical evaluation.

## 19.1 Methodology Sections

Display:

### Sentiment Analysis

Explain:
- Selected model.
- Fallback method.
- Score range.
- Score interpretation.
- Confidence limitations.

### Event Classification

Explain:
- Supported event categories.
- Classification approach.
- Evidence extraction.
- Ambiguity handling.

### Impact Scoring

Explain:
- Event severity.
- Market scope.
- Financial relevance.
- Scoring methodology.
- Confidence limitations.

### Index Rebalancing

Explain:
- Initial weights.
- Sentiment adjustments.
- Risk penalties.
- Normalization.
- Constraints.
- Turnover.
- Simulated execution.

### Portfolio Stress Testing

Explain:
- Synthetic portfolio construction.
- Baseline valuation.
- Scenario shocks.
- Credit loss calculations.
- Interest-rate sensitivity.
- Loss attribution.

## 19.2 Audit History

Display events such as:
- Ingestion completed.
- Analysis completed.
- Rebalance preview created.
- Rebalance executed.
- Stress test executed.
- Data refresh failed.

Each entry should contain:
- Timestamp.
- Action.
- Status.
- Related entity or record ID.
- Relevant configuration summary.

Do not store or display secret credentials.

## 19.3 Audit Filtering

Support:
- Date range.
- Action type.
- Status.
- Related signal.
- Rebalance run.
- Stress-test run.

---

# 20. CHART DESIGN SYSTEM

All charts must use a consistent monochrome visual language.

## 20.1 General Rules

- Use black for the primary series.
- Use grays for secondary series.
- Use white chart backgrounds.
- Avoid gradients.
- Avoid unnecessary shadows.
- Avoid 3D charts.
- Use subtle grid lines.
- Use readable labels.
- Display units.
- Include accessible tooltips.
- Provide an empty state when no data exists.

## 20.2 Line Charts

Use for:
- Sentiment history.
- Portfolio value.
- Simulated performance.
- Impact history.

Primary line: Black.
Secondary line: Medium gray.
Reference line: Light gray.
Use a clear zero line for sentiment charts.

## 20.3 Bar Charts

Use for:
- Event distributions.
- Sector exposures.
- Loss attribution.
- Index allocations.

Primary bars: Black.
Secondary bars: #767676.
Reference elements: #D9D9D9.

## 20.4 Donut Charts

Use sparingly.
Use grayscale segments with sufficient contrast.
Always accompany the chart with a legend or table.
Do not rely on segment color alone.

## 20.5 Tooltips

Tooltips must display:
- Series name.
- Exact value.
- Unit.
- Relevant timestamp.
- Relevant category.

For financial charts, format values appropriately.

Examples:
- 12.4%
- -3.8%
- ₹12.4 crore
- $24.6 million
- -0.72 sentiment

Do not mix currencies without an explicit conversion methodology.

## 20.6 Chart Accessibility

Provide:
- Text summaries.
- Labels.
- Legends.
- Sufficient contrast.
- A tabular alternative for critical data.

---

# 21. DATA TABLE DESIGN SYSTEM

## 21.1 Table Appearance

Use:
- White rows.
- Light-gray headers.
- Thin horizontal separators.
- Compact but readable spacing.
- Medium-weight headers.
- Regular-weight body text.

Avoid excessive vertical borders.

## 21.2 Row States

Default: White.
Hover: #F3F3F3.
Selected: #E2E2E2.
Disabled: Reduced contrast with a clear explanation.

## 21.3 Numeric Columns

Right-align financial amounts and percentages.
Use tabular numerals.
Display units in column headings or values.

## 21.4 Long Text

For headlines:
- Allow wrapping.
- Limit initial display height where appropriate.
- Provide a detail view for the complete text.

Do not silently truncate information needed to understand a risk signal.

## 21.5 Responsive Tables

On small screens:
- Allow horizontal scrolling.
- Keep important columns visible where practical.
- Provide an alternate compact card layout when useful.
- Avoid rendering unreadably small text.

---

# 22. MODALS, DRAWERS, AND NOTIFICATIONS

## 22.1 Modal Dialogs

Background: white.
Border radius: 16px.
Padding: 24px.
Use a subtle shadow.

Modal content should include:
- Title.
- Description.
- Main content.
- Primary action.
- Secondary action.

Use modals for:
- Confirming a simulated rebalance.
- Reviewing stress-test assumptions.
- Inspecting signal details.
- Confirming a destructive development-only reset.

Do not use a modal for every interaction.

## 22.2 Drawers

Use a right-side drawer for:
- Signal details.
- Holding details.
- Quick record inspection.

On mobile, drawers may occupy the full screen.

## 22.3 Toast Notifications

Use white surfaces with dark text.

Examples:
- "Analysis completed."
- "Rebalance executed successfully."
- "Stress test completed."
- "News provider unavailable. Synthetic mode remains active."

Include an appropriate icon and optional dismissal action.

Do not show success notifications when the backend operation fails.

## 22.4 Error Notifications

Explain:
- What failed.
- Whether the operation was saved.
- What the user can do next.

Avoid exposing stack traces or sensitive backend details.

---

# 23. EMPTY, LOADING, AND ERROR STATES

Every data-driven page must implement these states.

## 23.1 Empty State

Example:
"No risk signals found."
"Try changing your filters or load the synthetic demonstration dataset."
Provide an appropriate action.

## 23.2 Loading State

Use:
- Skeleton cards.
- Skeleton table rows.
- Small loading indicators.
- Contextual loading text.

Do not freeze the entire interface while one panel loads.

## 23.3 Error State

Example:
"Unable to retrieve public news."
"Your existing records are still available. You can retry or use demonstration data."
Provide: Retry, error details where appropriate, fallback action.

## 23.4 Partial Data State

When one source is unavailable but other sources work, keep the available data visible.
Show a warning describing the missing source.
Do not present partial results as a complete dataset.

---

# 24. RESPONSIVE DESIGN

## 24.1 Breakpoints

- Mobile: Below 600px.
- Mobile Large: 600px–767px.
- Tablet: 768px–1023px.
- Desktop: 1024px–1279px.
- Large Desktop: 1280px and above.

## 24.2 Mobile Navigation

On mobile:
- Replace the expanded sidebar with a menu button.
- Use a full-height navigation drawer or accessible navigation panel.
- Preserve all primary routes.
- Provide a clear close action.

## 24.3 Mobile KPI Cards

Use a two-column grid only when the content remains readable.
Otherwise, use a single-column layout.

## 24.4 Mobile Forms

- Use full-width fields.
- Stack controls vertically.
- Keep labels visible.
- Maintain touch-friendly buttons.

## 24.5 Mobile Charts

- Reduce unnecessary axis labels.
- Preserve tooltips.
- Allow horizontal scrolling only when genuinely necessary.

## 24.6 Touch Targets

Interactive controls should generally have a minimum touch target of 44px.

---

# 25. ACCESSIBILITY

Target WCAG 2.2 AA.

Implement:
- Semantic HTML.
- Keyboard navigation.
- Visible focus indicators.
- Proper heading hierarchy.
- Accessible form labels.
- Accessible table markup.
- ARIA attributes where appropriate.
- Descriptive icon labels.
- Sufficient text contrast.
- Reduced-motion support.
- Accessible chart summaries.
- Meaningful error messages.

Do not communicate positive or negative financial status through color alone.

---

# 26. MOTION AND MICROINTERACTIONS

Use subtle transitions only (150–220ms).
Allowed:
- Button hover.
- Navigation state changes.
- Dropdown opening.
- Drawer transitions.
- Modal appearance.
- Toast entrance.
- Table-row hover.
- Loading indicators.

Avoid:
- Excessive parallax.
- Animated backgrounds.
- Constantly moving charts.
- Decorative particle effects.

---

# 27. LANDING PAGE AND APPLICATION ENTRY

Route: `/`

The root route should open a concise product overview or redirect to the dashboard according to the implemented application flow.

---

# 28. FOOTER

Use a black footer (#000000).
Text: White.
Secondary text: Readable gray (#767676).

Include:
- RiskPulse AI.
- Product navigation.
- Methodology.
- Documentation.
- Data sources.
- Project limitations.
- Copyright information.

Explicit disclaimer:

> "RiskPulse AI is an educational financial risk analysis prototype. Its model outputs and portfolio scenarios are estimates based on the available data and documented assumptions. Simulated results do not represent actual trading performance or guaranteed outcomes. This platform does not provide financial advice."

---

# 29. COMPONENT ARCHITECTURE

Implement reusable React components:

- Layout: AppShell, AppHeader, SidebarNavigation, MobileNavigation, PageContainer, PageHeader
- Buttons: Button, IconButton, ButtonGroup, SegmentedControl, FilterChip (all signature 999px pills)
- Cards: Card, CardHeader, CardContent, MetricCard, FeatureCard, DarkFeatureCard (all 16px radius)
- Inputs: TextInput, TextArea, SearchInput, SelectInput, NumberInput (all 8px radius)
- Data Display: DataTable, Pagination, StatusBadge, SentimentBadge, ImpactBadge, SourceBadge, MetricValue, EmptyState, LoadingState, ErrorState
- Charts: SentimentTrendChart, EventDistributionChart, ImpactDistributionChart, AllocationComparisonChart, WeightChangeChart, PortfolioStressChart, LossAttributionChart
- NLP: AnalysisForm, SentimentResult, EventClassificationResult, ImpactScoreResult, EntityList, ExplanationPanel, StructuredOutputViewer
- Portfolio: IndexConstituentTable, RebalancePreview, RebalanceHistory, PortfolioSummary, PortfolioHoldingsTable, ScenarioSelector, ScenarioConfiguration, StressTestResult, StressTestHistory
- System: DataSourceCard, DataSourceStatus, AuditLogTable, MethodologySection, ToastProvider, ModalProvider

---

# 30. ROUTING

Implement routing for the following pages:

- `/dashboard` — Executive Overview
- `/intelligence/feed` — News and Social Feed
- `/intelligence/analyze` — NLP Risk Engine
- `/intelligence/signals` — Risk Signal Explorer
- `/intelligence/companies` & `/intelligence/companies/:ticker` — Company Risk Profiles
- `/portfolio/rebalancing` — Tactical Index Rebalancing
- `/portfolio/explorer` — Portfolio Explorer
- `/portfolio/stress-testing` — Strategic Portfolio Stress Testing
- `/analytics/history` — Historical Analysis
- `/system/data-sources` — Data Sources
- `/system/methodology` — Methodology and Audit

---

# 31. FRONTEND AND BACKEND INTEGRATION

The frontend must use actual backend APIs.
Create a centralized API service layer with TypeScript interfaces matching the backend schemas.
Handle:
- Loading states.
- API failures.
- Invalid responses.
- Empty data.
- Timeouts.
- Optional provider failures.

---

# 32. DATA FORMATTING

Shared formatting utilities:
- `formatCurrency(value, currency)`
- `formatPercentage(value)`
- `formatSentiment(value)`
- `formatImpactScore(value)`
- `formatTimestamp(value)`
- `formatCompactNumber(value)`
- `formatWeightChange(value)`

Use tabular numerals: `font-variant-numeric: tabular-nums`.

---

# 33. PRIVACY, SECURITY, AND DATA PROVENANCE

- Zero real confidential client data.
- Clearly label synthetic records ("SYNTHETIC PORTFOLIO", "DEMO DATA").
- Never display actual API keys.
- Safely sanitize external content.

---

# 34. PERFORMANCE REQUIREMENTS

- Responsive interface without unnecessary re-renders.
- Lazy-load and paginate large data tables.
- Server-side filtering where appropriate.
- Monochrome chart simplification without heavy animations.

---

# 35. DESIGN ANTI-PATTERNS

Prohibited:
- Excessive accent colors.
- Rainbow dashboards.
- Neon gradients.
- Glassmorphism.
- Excessive drop shadows.
- Different button shapes on every page.
- Tiny financial labels.
- Fake metrics or uncalibrated confidence bars.

---

# 36. DESIGN ACCEPTANCE CRITERIA

- Visual consistency: Monochrome first, pills for buttons/chips/nav, 16px cards, 8px inputs.
- Functional interface: All navigation tabs work, all primary actions trigger real backend APIs.
- Financial analytics: Real NLP results, real index rebalancing math, real stress testing results.
- Responsive design: Desktop sidebar, mobile hamburger/drawer, scrollable tables.
- Accessibility: High contrast, tabular numerals, explicit +/- signs and text labels for financial status.

---

# 37. FINAL ARCHITECTURAL WORKFLOW

```
UNSTRUCTURED FINANCIAL INFORMATION
        |
        v
AI/NLP RISK INTELLIGENCE
        |
        v
STRUCTURED FINANCIAL SIGNALS
        |
        +-------------------------+
        |                         |
        v                         v
TACTICAL INDEX              PORTFOLIO STRESS
REBALANCING                 TESTING
        |                         |
        +------------+------------+
                     |
                     v
          EXPLAINABLE FINANCIAL
             RISK ANALYTICS
```
