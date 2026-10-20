import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Code, Cpu } from 'lucide-react';
import { Button } from '../ui/Button';
import { api } from '../../services/api';
import { RiskSignal } from '../../types';

interface RiskEngineSectionProps {
  onNavigateSignals: () => void;
}

const ENGINE_FEATURES = [
  'Dual-model architecture: FinBERT domain models with rule-based fallback',
  'Classification across 20 granular market event categories',
  'Automatic entity extraction and primary ticker resolution',
  'Calibrated 1 to 10 impact severity assessment',
  'Auditable rationales with sentence-level evidence extraction',
  'Structured, standardized output ready for downstream risk systems'
];

export const RiskEngineSection: React.FC<RiskEngineSectionProps> = ({
  onNavigateSignals
}) => {
  const [showJson, setShowJson] = useState(false);
  const [liveSignal, setLiveSignal] = useState<RiskSignal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadSignal() {
      try {
        const res = await api.getSignals({ pageSize: 5 });
        if (mounted && res.items && res.items.length > 0) {
          // Select the most recent high-impact or first live signal
          const selected = res.items.find((s) => s.impact_score >= 5) || res.items[0];
          setLiveSignal(selected);
        }
      } catch (err) {
        console.error('Failed to load signal in RiskEngineSection:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadSignal();
    return () => {
      mounted = false;
    };
  }, []);

  const ticker = liveSignal ? (liveSignal.primary_ticker || liveSignal.entities?.[0]?.ticker || 'MKT') : '';
  const headline = liveSignal?.headline || '';
  const sentimentScore = liveSignal?.sentiment_score ?? 0;
  const sentimentLabel = liveSignal?.sentiment_label || (sentimentScore < 0 ? 'Negative' : sentimentScore > 0 ? 'Positive' : 'Neutral');
  const eventType = liveSignal?.event_type?.replace(/_/g, ' ') || 'Market Event';
  const eventConf = Math.round((liveSignal?.event_confidence || 0.75) * 100);
  const impactScore = liveSignal?.impact_score ?? 1;
  const impactLevel = liveSignal?.impact_level || (impactScore >= 7 ? 'High' : impactScore >= 4 ? 'Moderate' : 'Low');
  const rationale = liveSignal?.impact_rationale || liveSignal?.text || '';
  const isNegative = sentimentScore < 0;

  return (
    <section id="intelligence" className="py-20 lg:py-28 border-b border-[#282828] bg-[#121212]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Heading, Description, Feature List */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[11px] font-mono font-bold uppercase tracking-[1.4px] text-[#1ed760] bg-[#1f1f1f] px-3.5 py-1.5 rounded-full border border-[#333333] inline-block">
              NLP Analysis
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Transparent scoring for financial text.
            </h2>
            <p className="text-base text-[#b3b3b3] leading-relaxed">
              Convert headlines and disclosures into explainable risk indicators with full entity attribution and severity calibration.
            </p>

            {/* 6 Features List */}
            <div className="space-y-3 pt-2">
              {ENGINE_FEATURES.map((feature) => (
                <div key={feature} className="flex items-start gap-2.5 text-xs text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#1ed760] shrink-0 mt-0.5" />
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
            <div className="rounded-[8px] border border-[#282828] bg-[#181818] p-6 sm:p-8 space-y-5 shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#282828]">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#1ed760]" />
                  <span className="text-xs font-mono font-bold uppercase text-white tracking-[1.4px]">
                    Engine Inspection Output
                  </span>
                </div>
                {liveSignal && (
                  <button
                    onClick={() => setShowJson(!showJson)}
                    className="flex items-center gap-1.5 text-xs font-mono px-3.5 py-1.5 rounded-full border border-[#333333] bg-[#1f1f1f] text-white hover:border-[#1ed760] hover:text-[#1ed760] transition-colors cursor-pointer"
                  >
                    <Code className="w-3 h-3" />
                    <span>{showJson ? 'View Interface' : 'View JSON Output'}</span>
                  </button>
                )}
              </div>

              {loading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="p-4 rounded-[8px] bg-[#1f1f1f] border border-[#282828] space-y-2">
                    <div className="h-4 bg-[#282828] rounded w-1/4"></div>
                    <div className="h-4 bg-[#242424] rounded w-full"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-16 bg-[#1f1f1f] rounded-[8px]"></div>
                    <div className="h-16 bg-[#1f1f1f] rounded-[8px]"></div>
                    <div className="h-16 bg-[#1f1f1f] rounded-[8px]"></div>
                  </div>
                </div>
              ) : !liveSignal ? (
                <div className="p-8 rounded-[8px] border border-[#282828] bg-[#1f1f1f] text-center text-xs font-mono text-[#7c7c7c]">
                  Connecting to live NLP engine...
                </div>
              ) : showJson ? (
                <div className="p-4 rounded-[6px] bg-[#121212] text-gray-200 font-mono text-[11px] leading-relaxed overflow-x-auto border border-[#282828] shadow-inner max-h-[340px]">
                  <pre>{JSON.stringify(liveSignal, null, 2)}</pre>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Headline & Entity */}
                  <div className="p-4 rounded-[8px] bg-[#1f1f1f] border border-[#282828] space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-[#1ed760] bg-[#181818] px-2.5 py-0.5 rounded-full border border-[#282828]">{ticker}</span>
                      <span className="text-[#7c7c7c]">
                        {liveSignal.published_at ? new Date(liveSignal.published_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live Feed'}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-white leading-snug">
                      {headline}
                    </h4>
                  </div>

                  {/* 3 Core Output Pills */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-3 rounded-[8px] bg-[#1f1f1f] border border-[#282828]">
                      <span className="text-[10px] font-mono text-[#7c7c7c] block">Sentiment</span>
                      <span className={`text-sm font-bold font-mono mt-0.5 block ${isNegative ? 'text-[#f3727f]' : sentimentScore > 0 ? 'text-[#1ed760]' : 'text-white'}`}>
                        {sentimentScore > 0 ? `+${sentimentScore.toFixed(2)}` : sentimentScore.toFixed(2)}
                      </span>
                      <span className={`text-[10px] font-medium block ${isNegative ? 'text-[#f3727f]' : sentimentScore > 0 ? 'text-[#1ed760]' : 'text-[#b3b3b3]'}`}>
                        {sentimentLabel}
                      </span>
                    </div>
                    <div className="p-3 rounded-[8px] bg-[#1f1f1f] border border-[#282828]">
                      <span className="text-[10px] font-mono text-[#7c7c7c] block">Event Type</span>
                      <span className="text-xs font-bold text-white mt-0.5 truncate block">{eventType}</span>
                      <span className="text-[10px] text-[#7c7c7c] block">{eventConf}% Conf</span>
                    </div>
                    <div className="p-3 rounded-[8px] border border-[#f3727f]/30 bg-[#f3727f]/10">
                      <span className="text-[10px] font-mono text-[#7c7c7c] block">Impact Severity</span>
                      <span className="text-sm font-bold font-mono text-[#f3727f] mt-0.5 block">{impactScore} / 10</span>
                      <span className="text-[10px] text-[#f3727f] font-semibold block">{impactLevel}</span>
                    </div>
                  </div>

                  {/* Explainable Rationale Box */}
                  <div className="p-4 rounded-[8px] bg-[#1f1f1f] border border-[#282828] text-xs space-y-1">
                    <span className="font-mono font-bold text-[#1ed760] uppercase tracking-[1.4px] text-[10px]">
                      Explainable Decision Rationale:
                    </span>
                    <p className="text-[#b3b3b3] leading-relaxed">
                      {rationale}
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
