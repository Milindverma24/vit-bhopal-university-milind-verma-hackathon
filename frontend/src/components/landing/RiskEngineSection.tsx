import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Code, ShieldAlert, Cpu } from 'lucide-react';
import { Button } from '../ui/Button';

interface RiskEngineSectionProps {
  onNavigateSignals: () => void;
}

const ENGINE_FEATURES = [
  'Dual-Model Sentiment Engine (FinBERT + Lexicon-Syntactic Fallback)',
  '20 Distinct Financial Event Taxonomies & Evidence Mapping',
  'Primary and Secondary Company Entity Extraction with Tickers',
  'Multi-Factor Severity and Market Impact Scoring (1 to 10 Scale)',
  'Human-Readable, Fully Auditable Decision Rationales',
  'Normalized Structured JSON Output Schema with API Support'
];

export const RiskEngineSection: React.FC<RiskEngineSectionProps> = ({
  onNavigateSignals
}) => {
  const [showJson, setShowJson] = useState(false);

  return (
    <section id="intelligence" className="py-20 lg:py-28 border-b border-[#d9d9d9] bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Heading, Description, Feature List */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-black bg-[#efefef] px-2.5 py-0.5 rounded-full border border-[#d9d9d9]">
              CORE AI/NLP RISK ENGINE
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-black leading-tight">
              Understand the story behind the score.
            </h2>
            <p className="text-base text-[#5e5e5e] leading-relaxed">
              Convert financial text into structured signals that reveal sentiment, event categories, and potential risk relevance.
            </p>

            {/* 6 Features List */}
            <div className="space-y-3 pt-2">
              {ENGINE_FEATURES.map((feature) => (
                <div key={feature} className="flex items-start gap-2.5 text-xs text-black">
                  <CheckCircle2 className="w-4 h-4 text-black shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Button
                variant="primary"
                size="md"
                onClick={onNavigateSignals}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Explore Risk Signals
              </Button>
            </div>
          </div>

          {/* Right Column: Visual Analysis Interface Preview */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-[#d9d9d9] bg-[#fafafa] p-6 sm:p-8 space-y-5 shadow-sm">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#d9d9d9]">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-black" />
                  <span className="text-xs font-mono font-bold uppercase text-black">
                    Engine Inspection Output
                  </span>
                </div>
                <button
                  onClick={() => setShowJson(!showJson)}
                  className="flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-full border border-[#d9d9d9] bg-white text-black hover:border-black transition-colors"
                >
                  <Code className="w-3 h-3" />
                  <span>{showJson ? 'View Interface' : 'View JSON Output'}</span>
                </button>
              </div>

              {showJson ? (
                <div className="p-4 rounded-xl bg-black text-[#f3f3f3] font-mono text-[11px] leading-relaxed overflow-x-auto">
                  <pre>{`{
  "signal_id": "SIG-7a8e2b91",
  "primary_ticker": "CAT",
  "primary_company": "Caterpillar Inc.",
  "sentiment_score": -0.72,
  "sentiment_label": "Negative",
  "sentiment_method": "FinBERT (Hugging Face)",
  "sentiment_confidence": 0.942,
  "event_type": "Credit Event",
  "event_confidence": 0.88,
  "impact_score": 8,
  "impact_level": "High",
  "impact_rationale": "High CDS spread escalation and negative credit watch trigger tier-1 counterparty stress.",
  "risk_direction": "Bearish",
  "is_synthetic": true
}`}</pre>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Headline & Entity */}
                  <div className="p-4 rounded-xl bg-white border border-[#d9d9d9] space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-black bg-[#efefef] px-2 py-0.5 rounded">NYSE: CAT</span>
                      <span className="text-[#767676]">Published: 14:22 UTC</span>
                    </div>
                    <h4 className="text-sm font-semibold text-black leading-snug">
                      Tier-1 industrial equipment maker debt rating placed on negative credit watch amid distribution bottlenecks.
                    </h4>
                  </div>

                  {/* 3 Core Output Pills */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-3 rounded-xl bg-white border border-[#d9d9d9]">
                      <span className="text-[10px] font-mono text-[#767676] block">Sentiment</span>
                      <span className="text-sm font-bold font-mono text-black mt-0.5 block">-0.72</span>
                      <span className="text-[10px] text-[#5e5e5e] block">Negative</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-[#d9d9d9]">
                      <span className="text-[10px] font-mono text-[#767676] block">Event Type</span>
                      <span className="text-xs font-bold text-black mt-0.5 truncate block">Credit Event</span>
                      <span className="text-[10px] text-[#5e5e5e] block">88% Conf</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-black">
                      <span className="text-[10px] font-mono text-[#767676] block">Impact Severity</span>
                      <span className="text-sm font-bold font-mono text-black mt-0.5 block">8 / 10</span>
                      <span className="text-[10px] text-black font-semibold block">High</span>
                    </div>
                  </div>

                  {/* Explainable Rationale Box */}
                  <div className="p-4 rounded-xl bg-[#f3f3f3] border border-[#d9d9d9] text-xs space-y-1">
                    <span className="font-mono font-bold text-black uppercase tracking-wider text-[10px]">
                      Explainable Decision Rationale:
                    </span>
                    <p className="text-[#5e5e5e] leading-relaxed">
                      Credit rating revision establishes a high baseline severity (7/10). Negative sentiment intensity (-0.72) and cross-sector supply chain linkage compound transmission potential (+1.0), yielding final severity score of 8/10.
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
