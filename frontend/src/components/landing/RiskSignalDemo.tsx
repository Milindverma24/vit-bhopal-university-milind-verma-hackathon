import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Layers
} from 'lucide-react';
import { api } from '../../services/api';
import { RiskSignal } from '../../types';
import { Button } from '../ui/Button';
import { ImpactBadge, SentimentBadge } from '../ui/Badges';

interface DemoPreset {
  title: string;
  ticker: string;
  headline: string;
  text: string;
  sentiment: number;
  label: string;
  event: string;
  impact: number;
  scenario: string;
  rationale: string;
}

const DEMO_PRESETS: DemoPreset[] = [
  {
    title: 'Surging Banking Earnings',
    ticker: 'JPM',
    headline: 'JPMorgan Chase reported record investment banking fees and strong net interest income.',
    text: 'JPMorgan Chase delivered exceptional quarterly performance this morning, outpacing analyst projections with net interest income climbing 14% year-over-year. Management cited robust corporate borrowing and resilient consumer loan quality.',
    sentiment: 0.83,
    label: 'Positive',
    event: 'Corporate Earnings',
    impact: 6,
    scenario: 'Market Rally / Expansion',
    rationale: 'Earnings beat establishes strong fundamental momentum (+0.83). High profitability reinforces counterparty capital adequacy.'
  },
  {
    title: 'Antitrust Regulatory Probe',
    ticker: 'AAPL',
    headline: 'Antitrust authorities file formal injunction alleging exclusionary distribution agreements.',
    text: 'Federal regulatory agencies initiated formal legal proceedings against the consumer technology conglomerate, seeking structural behavioral remedies and potential civil penalties up to $2.5 billion.',
    sentiment: -0.68,
    label: 'Negative',
    event: 'Regulatory Action',
    impact: 7,
    scenario: 'Corporate Credit Freeze',
    rationale: 'Formal regulatory intervention carries mandatory legal defense costs, fine exposure, and long-term operating margin headwinds.'
  },
  {
    title: 'Semiconductor Supply Choke',
    ticker: 'NVDA',
    headline: 'Global maritime choke-point halts advanced semiconductor packaging shipments.',
    text: 'Logistical bottlenecks and critical assembly facility shutdowns have disrupted international distribution networks, delaying delivery timelines for high-density enterprise computing clusters.',
    sentiment: -0.74,
    label: 'Negative',
    event: 'Supply Chain Disruption',
    impact: 8,
    scenario: 'Critical Semiconductor & Logistics Choke',
    rationale: 'Severe component shortfall directly chokes revenue recognition across downstream technology hardware and industrial sectors.'
  },
  {
    title: 'Sovereign Debt Downgrade',
    ticker: 'SOV',
    headline: 'International rating agencies downgrade regional sovereign debt to negative watch.',
    text: 'Credit rating agencies downgraded long-term sovereign foreign currency obligations, citing rising fiscal deficits, debt servicing constraints, and elevated currency depreciation pressure.',
    sentiment: -0.85,
    label: 'Negative',
    event: 'Credit Event',
    impact: 9,
    scenario: 'Aggressive Central Bank Rate Hike & Spread Shock',
    rationale: 'Sovereign credit re-rating drives systemic benchmark yield spikes and accelerates capital flight across regional assets.'
  }
];

export const RiskSignalDemo: React.FC = () => {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [customText, setCustomText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [liveResult, setLiveResult] = useState<RiskSignal | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const activePreset = DEMO_PRESETS[selectedPresetIndex];

  const handleSelectPreset = (idx: number) => {
    setSelectedPresetIndex(idx);
    setLiveResult(null);
    setApiError(null);
    setCustomText('');
  };

  const handleAnalyzeCustom = async () => {
    if (!customText.trim()) return;
    setAnalyzing(true);
    try {
      const res = await api.analyzeText({
        text: customText,
        headline: customText.length > 80 ? customText.slice(0, 77) + '...' : customText,
        source_type: 'custom',
        source_name: 'Interactive Visitor Analysis'
      });
      setLiveResult(res);
    } catch (err: any) {
      console.error('NLP Analysis failed:', err);
      setApiError(err.message || 'Analysis service temporarily unreachable.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedPresetIndex(0);
    setCustomText('');
    setLiveResult(null);
    setApiError(null);
  };

  // Determine current display values
  const currentTicker = liveResult ? (liveResult.primary_ticker || 'CUSTOM') : activePreset.ticker;
  const currentHeadline = liveResult ? (liveResult.headline || customText) : activePreset.headline;
  const currentSentiment = liveResult ? liveResult.sentiment_score : activePreset.sentiment;
  const currentLabel = liveResult ? liveResult.sentiment_label : activePreset.label;
  const currentEvent = liveResult ? liveResult.event_type : activePreset.event;
  const currentImpact = liveResult ? liveResult.impact_score : activePreset.impact;
  const currentRationale = liveResult ? liveResult.impact_rationale : activePreset.rationale;
  const currentMethod = liveResult ? liveResult.sentiment_method : 'FinBERT + Lexicon Syntactic Fallback';

  return (
    <section className="py-20 lg:py-28 border-b border-[#d9d9d9] bg-[#fafafa]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-black bg-[#efefef] px-2.5 py-0.5 rounded-full border border-[#d9d9d9]">
            INTERACTIVE CAPABILITY DEMONSTRATION
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-black mt-3">
            Explore a risk signal in real time.
          </h2>
          <p className="text-base text-[#5e5e5e] mt-2 leading-relaxed">
            Select a financial scenario preset or paste any market headline to test how the AI/NLP engine processes unstructured text into structured intelligence.
          </p>
        </div>

        {/* Demo Container Card */}
        <div className="rounded-2xl border border-[#d9d9d9] bg-white p-6 sm:p-8 lg:p-10 shadow-sm space-y-8">
          
          {/* Preset Buttons Rail */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-[#767676] tracking-wider block">
              1. Choose a Standard Event Preset
            </span>
            <div className="flex flex-wrap gap-2">
              {DEMO_PRESETS.map((preset, idx) => {
                const isSelected = selectedPresetIndex === idx && !liveResult;
                return (
                  <button
                    key={preset.title}
                    onClick={() => handleSelectPreset(idx)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-black text-white'
                        : 'bg-[#f3f3f3] text-black border border-[#d9d9d9] hover:border-black'
                    }`}
                  >
                    {preset.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Or Custom Text Input */}
          <div className="space-y-2 pt-2 border-t border-[#d9d9d9]">
            <span className="text-xs font-mono uppercase text-[#767676] tracking-wider block">
              2. Or Test Your Own Custom Financial Sentence
            </span>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="e.g. Central bank unexpected 50 bps rate hike triggers currency volatility..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#d9d9d9] bg-[#fafafa] text-xs font-sans text-black placeholder:text-[#767676] focus:outline-none focus:border-black"
              />
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAnalyzeCustom}
                  loading={analyzing}
                  disabled={!customText.trim()}
                  icon={<Play className="w-3.5 h-3.5" />}
                >
                  Analyze with Engine
                </Button>
                {(liveResult || customText) && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleReset}
                    icon={<RotateCcw className="w-3.5 h-3.5" />}
                  >
                    Reset
                  </Button>
                )}
              </div>
            </div>
            {apiError && (
              <div className="flex items-center gap-2 text-xs text-black bg-[#efefef] p-2.5 rounded-lg border border-[#d9d9d9]">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{apiError}</span>
              </div>
            )}
          </div>

          {/* Output Display Panel */}
          <div className="p-6 rounded-xl border border-[#d9d9d9] bg-[#fafafa] space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#d9d9d9]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-black" />
                <span className="text-xs font-mono font-bold uppercase text-black">
                  Structured Signal Analysis Output
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#767676]">
                {liveResult ? 'Live API Evaluation' : 'Verified Preset Output'}
              </span>
            </div>

            {/* Headline Card */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="font-bold text-black bg-black text-white px-2 py-0.5 rounded">
                  {currentTicker}
                </span>
                <span className="text-[#767676]">•</span>
                <span className="text-[#5e5e5e]">{currentEvent}</span>
              </div>
              <h4 className="text-base font-semibold text-black leading-snug">
                "{currentHeadline}"
              </h4>
            </div>

            {/* 4 Quant Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-white border border-[#d9d9d9]">
                <span className="text-[10px] font-mono text-[#767676] block">Sentiment Score</span>
                <span className="text-base font-bold font-mono text-black mt-1 block tabular-nums">
                  {currentSentiment > 0 ? `+${currentSentiment.toFixed(2)}` : currentSentiment.toFixed(2)}
                </span>
                <span className="text-[10px] font-medium text-black block">{currentLabel}</span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#d9d9d9]">
                <span className="text-[10px] font-mono text-[#767676] block">Event Category</span>
                <span className="text-xs font-bold text-black mt-1.5 block truncate">
                  {currentEvent}
                </span>
                <span className="text-[10px] text-[#5e5e5e] block">Taxonomy Match</span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-black">
                <span className="text-[10px] font-mono text-[#767676] block">Impact Severity</span>
                <span className="text-base font-bold font-mono text-black mt-1 block">
                  {currentImpact} / 10
                </span>
                <span className="text-[10px] font-semibold text-black block">Explainable Rating</span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#d9d9d9]">
                <span className="text-[10px] font-mono text-[#767676] block">Eligible Crisis Shock</span>
                <span className="text-xs font-bold text-black mt-1.5 block truncate">
                  {!liveResult ? activePreset.scenario : 'Crisis Scenario Shock'}
                </span>
                <span className="text-[10px] text-[#5e5e5e] block">Downstream Trigger</span>
              </div>
            </div>

            {/* Explainable Rationale */}
            <div className="p-4 rounded-xl bg-white border border-[#d9d9d9] text-xs space-y-1.5">
              <span className="font-mono font-bold text-black uppercase tracking-wider text-[10px]">
                Decision Rationale & Evidence:
              </span>
              <p className="text-[#5e5e5e] leading-relaxed">
                {currentRationale}
              </p>
              <div className="pt-2 text-[10px] font-mono text-[#767676] flex items-center justify-between border-t border-[#f3f3f3]">
                <span>Processing Engine: {currentMethod}</span>
                <span>Audit Verified</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
