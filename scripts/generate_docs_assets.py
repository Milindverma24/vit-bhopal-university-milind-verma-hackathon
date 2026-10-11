import os
import sys
from pathlib import Path
import matplotlib.pyplot as plt
import matplotlib.patches as patches

# ReportLab imports
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

DOCS_DIR = Path(__file__).resolve().parent.parent / "docs"
DOCS_DIR.mkdir(parents=True, exist_ok=True)

def generate_architecture_diagram():
    print("Generating high-resolution architecture diagram (docs/architecture.png)...")
    fig, ax = plt.subplots(figsize=(16, 10), dpi=300)
    ax.set_facecolor("#f8fafc")
    fig.patch.set_facecolor("#f8fafc")

    # Titles
    plt.text(8.0, 9.6, "RiskPulse AI — System Architecture & Data Flow", 
             fontsize=20, fontweight='bold', ha='center', color="#0f172a", fontfamily='sans-serif')
    plt.text(8.0, 9.3, "End-to-End Financial Risk Intelligence, Tactical Index Rebalancing & Portfolio Stress Testing", 
             fontsize=12, ha='center', color="#475569", fontfamily='sans-serif')

    def draw_box(x, y, w, h, title, subtitle, bg_color, border_color, text_color="#0f172a"):
        rect = patches.FancyBboxPatch(
            (x, y), w, h,
            boxstyle="round,pad=0.1,rounding_size=0.15",
            facecolor=bg_color,
            edgecolor=border_color,
            linewidth=1.8,
            zorder=3
        )
        ax.add_patch(rect)
        ax.text(x + w/2, y + h*0.65, title, fontsize=11, fontweight='bold', ha='center', va='center', color=text_color, zorder=4)
        ax.text(x + w/2, y + h*0.30, subtitle, fontsize=8.5, ha='center', va='center', color="#334155", zorder=4)

    def draw_arrow(x1, y1, x2, y2, label=""):
        ax.annotate(
            "", xy=(x2, y2), xytext=(x1, y1),
            arrowprops=dict(arrowstyle="->", color="#3b82f6", lw=2.0, mutation_scale=15),
            zorder=2
        )
        if label:
            mx, my = (x1 + x2)/2, (y1 + y2)/2
            ax.text(mx, my + 0.12, label, fontsize=8, ha='center', color="#1e293b", fontweight='bold',
                    bbox=dict(boxstyle="round,pad=0.2", fc="#ffffff", ec="#cbd5e1", lw=0.8), zorder=5)

    # 1. Ingestion Sources
    draw_box(0.8, 7.5, 3.2, 1.2, "Data Ingestion Sources", "NewsAPI • Synthetic News Wire\nFinTwit Social Feed • Macro Indicators", "#eff6ff", "#3b82f6")

    # 2. Preprocessing & Entity Extraction
    draw_box(4.8, 7.5, 3.2, 1.2, "Preprocessing & Entities", "HTML Stripping • Cashtag Normalization\nDedup Fingerprints • 15 Basket Aliases", "#f0fdf4", "#22c55e")
    draw_arrow(4.0, 8.1, 4.8, 8.1, "Raw Feed")

    # 3. Core NLP Risk Engine
    draw_box(8.8, 7.5, 3.6, 1.2, "AI / NLP Risk Engine", "FinBERT & Lexicon-Syntax Fallback\n20 Event Taxonomies • 1-10 Impact Matrix", "#fef3c7", "#f59e0b")
    draw_arrow(8.0, 8.1, 8.8, 8.1, "Clean Tokens")

    # 4. Storage & Persistence
    draw_box(13.2, 7.5, 2.2, 1.2, "Storage Layer", "SQLite / Postgres\nSignals, Allocations, ECL", "#f1f5f9", "#64748b")
    draw_arrow(12.4, 8.1, 13.2, 8.1, "Risk Signals")

    # Flow down to Downstream Modules
    # Downstream Module A: Tactical Rebalancing
    draw_box(1.5, 4.5, 5.8, 1.6, "Module A: Tactical Stock Rebalancing", 
             "15-Constituent US Large-Cap Basket\nw_i = w_0 * exp(alpha*Sent - beta*Risk)\nBox Bounds [2% - 18%] • Max Turnover 25%\n50 bps Deadband Churn Control", 
             "#e0e7ff", "#4f46e5")
    draw_arrow(10.0, 7.5, 4.4, 6.1, "Sentiment & Impact")

    # Downstream Module B: Strategic Stress Testing
    draw_box(8.7, 4.5, 5.8, 1.6, "Module B: Portfolio Stress Testing", 
             "$500M Synthetic Wholesale Bank Portfolio\nLoans, Sovereign/Corp Bonds, Equities, Derivatives\nBasel III ECL = PD * LGD * EAD\nDuration-Based Yield Sensitivity dP = -D*dy*P", 
             "#ecfdf5", "#059669")
    draw_arrow(11.2, 7.5, 11.6, 6.1, "Event Severity & Scope")

    # 5. REST API Layer
    draw_box(4.0, 2.3, 8.0, 1.1, "FastAPI High-Performance REST API", 
             "/api/signals • /api/analyze • /api/index/rebalance • /api/stress/run • /api/portfolio\nCORS Enabled • OpenAPI Swagger Docs • Parameter Validation", 
             "#ffffff", "#0284c7")
    draw_arrow(4.4, 4.5, 6.5, 3.4)
    draw_arrow(11.6, 4.5, 9.5, 3.4)

    # 6. Frontend Institutional Terminal
    draw_box(2.0, 0.4, 12.0, 1.1, "Institutional Financial Terminal (React + Vite + Tailwind)", 
             "Executive Overview • Live News & FinTwit • NLP Sandbox • Signal Explorer\nTactical Rebalancing Studio • Stress Simulator • Portfolio Holdings • Audit Ledger", 
             "#0f172a", "#38bdf8", text_color="#ffffff")
    draw_arrow(8.0, 2.3, 8.0, 1.5, "JSON Payloads")

    ax.set_xlim(0, 16)
    ax.set_ylim(0, 10)
    ax.axis("off")

    output_path = DOCS_DIR / "architecture.png"
    plt.tight_layout()
    plt.savefig(output_path, dpi=300, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print(f"Architecture diagram saved to {output_path}")

def generate_presentation_deck():
    print("Generating hackathon presentation deck (docs/presentation.pdf)...")
    pdf_path = DOCS_DIR / "presentation.pdf"
    doc = SimpleDocTemplate(
        str(pdf_path),
        pagesize=landscape(letter),
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=26,
        leading=32,
        textColor=colors.HexColor('#0f172a'),
        alignment=1
    )
    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor('#475569'),
        alignment=1
    )
    slide_header_style = ParagraphStyle(
        'SlideHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#1e293b')
    )
    slide_subhead_style = ParagraphStyle(
        'SlideSubhead',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=colors.HexColor('#4338ca')
    )
    body_style = ParagraphStyle(
        'SlideBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10.5,
        leading=15,
        textColor=colors.HexColor('#334155')
    )
    bullet_style = ParagraphStyle(
        'BulletStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#1e293b')
    )

    story = []

    # ==================== SLIDE 1: TITLE ====================
    story.append(Spacer(1, 1.2 * inch))
    story.append(Paragraph("RiskPulse AI", title_style))
    story.append(Spacer(1, 0.15 * inch))
    story.append(Paragraph("Real-Time Financial Risk Intelligence, Tactical Index Rebalancing & Portfolio Stress Testing", subtitle_style))
    story.append(Spacer(1, 0.4 * inch))

    meta_table = Table([
        [Paragraph("<b>Hackathon:</b> S&P Global & CRISIL Campus Hackathon 2026", body_style)],
        [Paragraph("<b>Candidate Name:</b> [REPLACE WITH YOUR FULL NAME]", body_style)],
        [Paragraph("<b>College / Campus:</b> [REPLACE WITH YOUR COLLEGE NAME]", body_style)],
        [Paragraph("<b>College Email ID:</b> [REPLACE WITH YOUR COLLEGE EMAIL]", body_style)],
        [Paragraph("<b>Value Proposition:</b> Bridging unstructured financial narrative signals to deterministic quantitative index rebalancing and Basel III portfolio stress testing.", body_style)],
    ], colWidths=[7.0 * inch])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 1.2, colors.HexColor('#cbd5e1')),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(meta_table)
    story.append(PageBreak())

    # ==================== SLIDE 2: PROBLEM AND APPROACH ====================
    story.append(Paragraph("Problem Statement & Strategic Approach", slide_header_style))
    story.append(Paragraph("Overcoming Information Asymmetry and Disconnected Risk Workflows", slide_subhead_style))
    story.append(Spacer(1, 0.2 * inch))

    p2_data = [
        [
            Paragraph("<b>Core Industry Challenges:</b><br/>"
                      "• <b>Unstructured Overload:</b> Critical signals lurk in earnings calls, SEC subpoenas, and FinTwit noise without structured quantitative quantification.<br/>"
                      "• <b>Lagging Transmission:</b> Traditional portfolio risk tools rely on trailing historical price correlations rather than forward-looking narrative signals.<br/>"
                      "• <b>Disconnected Modules:</b> Market risk and banking credit risk operate in isolated silos, lacking explainable unified risk triggers.", body_style),
            Paragraph("<b>The RiskPulse AI Solution:</b><br/>"
                      "• <b>Central AI/NLP Risk Engine:</b> Normalizes text into structured signals: Sentiment (-1 to +1), 20 Event Classes, and 1-10 Severity Impact.<br/>"
                      "• <b>Downstream Module A (Tactical Rebalancing):</b> De-weights constituents facing high-impact adverse events subject to turnover & box constraints.<br/>"
                      "• <b>Downstream Module B (Stress Testing):</b> Translates event signals into Basel III Expected Credit Loss (ECL) & duration shocks on a $500M bank portfolio.", body_style)
        ]
    ]
    t2 = Table(p2_data, colWidths=[3.7 * inch, 3.7 * inch])
    t2.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#ffffff')),
        ('BOX', (0,0), (0,0), 1, colors.HexColor('#fca5a5')),
        ('BOX', (1,0), (1,0), 1, colors.HexColor('#86efac')),
        ('PADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t2)
    story.append(PageBreak())

    # ==================== SLIDE 3: SYSTEM ARCHITECTURE ====================
    story.append(Paragraph("System Architecture & Data Flow", slide_header_style))
    story.append(Paragraph("Modular, Zero-Key Resilient Full-Stack Architecture", slide_subhead_style))
    story.append(Spacer(1, 0.2 * inch))

    p3_data = [
        [Paragraph("<b>Component</b>", bullet_style), Paragraph("<b>Technology</b>", bullet_style), Paragraph("<b>Key Responsibilities</b>", bullet_style)],
        [Paragraph("<b>Data Ingestion</b>", bullet_style), Paragraph("Python / HTTPX / Adapters", bullet_style), Paragraph("NewsAPI (optional), FinTwit simulation, 240+ deterministic synthetic records.", bullet_style)],
        [Paragraph("<b>Preprocessing & Entities</b>", bullet_style), Paragraph("Regex / Dict Mappers", bullet_style), Paragraph("Cashtag ($AAPL) resolution, 15 constituent aliases, HTML cleansing, deduplication.", bullet_style)],
        [Paragraph("<b>AI / NLP Risk Engine</b>", bullet_style), Paragraph("FinBERT + Lexicon Fallback", bullet_style), Paragraph("Continuous sentiment (-1.0 to +1.0), 20 event taxonomies, 1-10 impact scoring.", bullet_style)],
        [Paragraph("<b>Storage & DB</b>", bullet_style), Paragraph("SQLAlchemy / SQLite / Postgres", bullet_style), Paragraph("Normalized risk signals, rebalance runs, portfolio holdings, immutable audit trails.", bullet_style)],
        [Paragraph("<b>Module A: Rebalancer</b>", bullet_style), Paragraph("NumPy / Constrained Optimizer", bullet_style), Paragraph("Exponential weighting, [2%-18%] box constraints, 25% turnover limit, 50bps deadband.", bullet_style)],
        [Paragraph("<b>Module B: Stress Engine</b>", bullet_style), Paragraph("Financial Valuation Library", bullet_style), Paragraph("$500M bank portfolio, Basel III Expected Credit Loss (ECL), duration price sensitivity.", bullet_style)],
        [Paragraph("<b>Frontend UI</b>", bullet_style), Paragraph("React / Vite / Tailwind / Recharts", bullet_style), Paragraph("Institutional light-theme analytics platform with 10 dedicated operational views.", bullet_style)],
    ]
    t3 = Table(p3_data, colWidths=[1.8 * inch, 2.2 * inch, 3.4 * inch])
    t3.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e2e8f0')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t3)
    story.append(PageBreak())

    # ==================== SLIDE 4: AI/NLP RISK ENGINE ====================
    story.append(Paragraph("AI / NLP Risk Engine & Signal Explainability", slide_header_style))
    story.append(Paragraph("Transforming Unstructured Text into Actionable Structured Signals", slide_subhead_style))
    story.append(Spacer(1, 0.2 * inch))

    p4_data = [
        [
            Paragraph("<b>Core Signal Dimensions:</b><br/>"
                      "• <b>Sentiment Score:</b> Continuous -1.0 to +1.0 with Positive, Negative, Neutral, or Mixed categorical labels.<br/>"
                      "• <b>Event Taxonomy:</b> 20 specialized classes (Corporate Earnings, Regulatory Action, Cyber Incident, Bankruptcy, Interest Rate Hike, etc.).<br/>"
                      "• <b>Impact Severity (1 to 10):</b> Independent from sentiment; synthesizes event baseline, scope (market vs single-stock), and stress indicators.<br/>"
                      "• <b>Confidence & Provenance:</b> Transparent heuristic confidence score and attribution evidence tokens.", body_style),
            Paragraph("<b>Structured Signal Schema Example:</b><br/>"
                      "<font face='Courier' size='8'>"
                      "{\n"
                      "  'primary_ticker': 'NVDA',\n"
                      "  'event_type': 'Corporate Earnings',\n"
                      "  'sentiment_score': +0.72 (Positive),\n"
                      "  'impact_score': 6/10 (Moderate),\n"
                      "  'evidence': ['beat', 'record profit'],\n"
                      "  'rationale': 'Revenue expanded 18% beating Wall Street consensus, raising annual guidance.'\n"
                      "}"
                      "</font>", body_style)
        ]
    ]
    t4 = Table(p4_data, colWidths=[4.2 * inch, 3.2 * inch])
    t4.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
        ('PADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t4)
    story.append(PageBreak())

    # ==================== SLIDE 5: DOWNSTREAM APPLICATIONS ====================
    story.append(Paragraph("Downstream Risk Applications (Modules A & B)", slide_header_style))
    story.append(Paragraph("Connecting Sentiment and Event Signals to Capital Decisions", slide_subhead_style))
    story.append(Spacer(1, 0.2 * inch))

    p5_data = [
        [
            Paragraph("<b>Module A: Tactical Stock Index Rebalancing</b><br/>"
                      "• <b>Basket:</b> 15 core publicly traded US equities across 7 sectors.<br/>"
                      "• <b>Algorithm:</b> <code>w_i = w_base * exp(alpha*Sent - beta*Risk)</code>.<br/>"
                      "• <b>Downside Penalty:</b> Adverse high-impact signals trigger aggressive de-weighting.<br/>"
                      "• <b>Execution Guardrails:</b> Iterative projection algorithm enforces min (2%) & max (18%) weights while bounding turnover (≤25%) and eliminating churn with 50bps deadband.", body_style),
            Paragraph("<b>Module B: Strategic Portfolio Stress Testing</b><br/>"
                      "• <b>Portfolio:</b> $500M Wholesale Banking Book (Corporate Loans, Sovereign/Corp Bonds, Equities, Derivatives, Cash).<br/>"
                      "• <b>Basel III ECL:</b> <code>ECL = PD * LGD * EAD</code>.<br/>"
                      "• <b>Duration Sensitivity:</b> Fixed-income valuation shifts: <code>ΔP = -Duration * ΔYield * P</code>.<br/>"
                      "• <b>Asset Differentiation:</b> Equities take direct market shocks, corporate debt reflects spread widening, cash remains par.", body_style)
        ]
    ]
    t5 = Table(p5_data, colWidths=[3.7 * inch, 3.7 * inch])
    t5.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), colors.HexColor('#eff6ff')),
        ('BACKGROUND', (1,0), (1,0), colors.HexColor('#ecfdf5')),
        ('BOX', (0,0), (0,0), 1, colors.HexColor('#3b82f6')),
        ('BOX', (1,0), (1,0), 1, colors.HexColor('#059669')),
        ('PADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t5)
    story.append(PageBreak())

    # ==================== SLIDE 6: RESULTS AND DOMAIN IMPACT ====================
    story.append(Paragraph("Empirical Results & Domain Impact", slide_header_style))
    story.append(Paragraph("Validated Calculations, Backtest Trajectory & Enterprise Utility", slide_subhead_style))
    story.append(Spacer(1, 0.2 * inch))

    p6_data = [
        [
            Paragraph("<b>Automated Test Suite Results (13/13 Passed):</b><br/>"
                      "• <b>NLP Engine:</b> Accurate positive/negative detection, verified negation reversal ('failed to beat' -> adverse, 'did not decline' -> bullish).<br/>"
                      "• <b>Rebalancing Optimization:</b> Guaranteed budget normalization (sum=100.0%), strict box compliance (2% to 18%), turnover strictly bounded.<br/>"
                      "• <b>Stress Calculations:</b> Zero cash impairment, accurate ECL loan provisioning, and verified duration bond price haircuts.", body_style),
            Paragraph("<b>Domain & Business Impact:</b><br/>"
                      "• <b>Institutional Value:</b> Transforms qualitative research notes into instant risk attribution for portfolio managers and risk committees.<br/>"
                      "• <b>Proactive Hedging:</b> Rebalances indices defensively before quarterly earnings declines are fully priced into benchmark correlations.<br/>"
                      "• <b>Regulatory Auditability:</b> Every action logged with immutable audit IDs and transparent mathematical justifications.", body_style)
        ]
    ]
    t6 = Table(p6_data, colWidths=[3.7 * inch, 3.7 * inch])
    t6.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
        ('PADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t6)
    story.append(PageBreak())

    # ==================== SLIDE 7: LIMITATIONS AND NEXT STEPS ====================
    story.append(Paragraph("Limitations & Roadmap", slide_header_style))
    story.append(Paragraph("Ethical Safeguards, Current Constraints & Future Enhancements", slide_subhead_style))
    story.append(Spacer(1, 0.2 * inch))

    p7_data = [
        [
            Paragraph("<b>Current Limitations & Safeguards:</b><br/>"
                      "• <b>Synthetic Demonstration Scope:</b> Prototype utilizes synthetic customer transactions and news records to protect client confidentiality.<br/>"
                      "• <b>Simplified Derivative MtM:</b> Derivatives are modeled through simplified delta/duration exposure approximations rather than full Monte Carlo option surfaces.<br/>"
                      "• <b>No Financial Advice:</b> Platform is an educational risk intelligence prototype, not financial advice or credit rating guarantees.", body_style),
            Paragraph("<b>Roadmap & Future Enhancements:</b><br/>"
                      "• <b>Multi-Lingual NLP:</b> Expansion to European and Asian financial news languages via multi-lingual transformer models.<br/>"
                      "• <b>Non-Linear Derivatives:</b> Integration of Black-Scholes and Heston volatility surface modeling for structured derivative books.<br/>"
                      "• <b>Automated Order Routing:</b> FIX protocol adapter integration for automated paper-trading execution with institutional brokers.", body_style)
        ]
    ]
    t7 = Table(p7_data, colWidths=[3.7 * inch, 3.7 * inch])
    t7.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#ffffff')),
        ('BOX', (0,0), (0,0), 1, colors.HexColor('#f59e0b')),
        ('BOX', (1,0), (1,0), 1, colors.HexColor('#6366f1')),
        ('PADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t7)

    doc.build(story)
    print(f"Presentation deck successfully created at {pdf_path}")

if __name__ == "__main__":
    generate_architecture_diagram()
    generate_presentation_deck()
