import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';
import { RiskSignal } from '../../types';
import { Button } from '../ui/Button';

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

export const RiskSignalDemo: React.FC = () => {
  const [presets, setPresets] = useState<DemoPreset[]>([]);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [customText, setCustomText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [liveResult, setLiveResult] = useState<RiskSignal | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadPresets() {
      try {
        const res = await api.getSignals({ pageSize: 5 });
        if (mounted && res.items && res.items.length > 0) {
          const liveMapped: DemoPreset[] = res.items.map((sig) => ({
            title: `${sig.primary_ticker || 'MKT'} · ${sig.event_type.replace(/_/g, ' ')}`,
            ticker: sig.primary_ticker || sig.entities?.[0]?.ticker || 'CORP',
            headline: sig.headline,
            text: sig.text || sig.headline,
            sentiment: sig.sentiment_score,
            label: sig.sentiment_label,
            event: sig.event_type.replace(/_/g, ' '),
            impact: sig.impact_score,
            scenario: 'Crisis Scenario Shock',
            rationale: sig.impact_rationale || sig.text
          }));
          setPresets(liveMapped);
        }
      } catch (err) {
        console.error('Failed to load live presets for RiskSignalDemo:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadPresets();
    return () => {
      mounted = false;
    };
  }, []);

  const activePreset = presets[selectedPresetIndex] || null;

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
  const currentTicker = liveResult ? (liveResult.primary_ticker || 'CUSTOM') : (activePreset?.ticker || 'MKT');
  const currentHeadline = liveResult ? (liveResult.headline || customText) : (activePreset?.headline || '');
  const currentSentiment = liveResult ? liveResult.sentiment_score : (activePreset?.sentiment ?? 0);
  const currentLabel = liveResult ? liveResult.sentiment_label : (activePreset?.label || 'Neutral');
  const currentEvent = liveResult ? liveResult.event_type : (activePreset?.event || 'Market Event');
  const currentImpact = liveResult ? liveResult.impact_score : (activePreset?.impact ?? 1);
  const currentRationale = liveResult ? liveResult.impact_rationale : (activePreset?.rationale || '');
  const currentMethod = liveResult ? liveResult.sentiment_method : 'FinBERT & Quantitative Engine';

  return (
    <section className="py-16 lg:py-24 border-b border-[#282828] bg-[#121212]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="max-w-2xl mb-10">
          <span className="text-xs font-mono font-bold uppercase tracking-[1.4px] text-[#1ed760] bg-[#181818] px-3 py-1 rounded-full border border-[#282828] inline-block mb-3">
            INTERACTIVE TESTBENCH
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1">
            Test financial text in real time.
          </h2>
          <p className="text-base text-[#b3b3b3] mt-2 leading-relaxed">
            Select a live detected market event or test custom headline copy to observe entity resolution, sentiment scoring, and severity assessment.
          </p>
        </div>

        {/* Demo Container Card */}
        <div className="rounded-2xl border border-[#282828] bg-[#181818] p-6 sm:p-8 space-y-6 shadow-xl">
          
          {/* Preset Buttons Rail */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#242424]">
            <span className="text-xs font-mono uppercase text-[#7c7c7c] tracking-wider shrink-0">
              Live Market Events
            </span>
            <div className="flex flex-wrap gap-2">
              {loading ? (
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-7 w-28 bg-[#1f1f1f] rounded-full animate-pulse border border-[#282828]" />
                  ))}
                </div>
              ) : (
                presets.map((preset, idx) => {
                  const isSelected = selectedPresetIndex === idx && !liveResult;
                  return (
                    <button
                      key={preset.title}
                      type="button"
                      onClick={() => handleSelectPreset(idx)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer select-none whitespace-nowrap ${
                        isSelected
                          ? 'bg-white text-black font-bold'
                          : 'bg-[#121212] text-[#999] border border-[#282828] hover:text-white hover:bg-[#1a1a1a]'
                      }`}
                    >
                      {preset.title}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Custom Text Input Bar */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Or test a custom headline (e.g. Enterprise software firm raises annual cloud revenue forecast 15%)..."
                className="flex-1 px-4 py-2.5 min-h-[42px] rounded-full border border-[#282828] bg-[#121212] text-xs font-sans text-white placeholder:text-[#666] focus:outline-none focus:border-[#1ed760] transition-colors"
              />
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAnalyzeCustom}
                  loading={analyzing}
                  disabled={!customText.trim()}
                  icon={<Play className="w-3.5 h-3.5 fill-current shrink-0" />}
                  className="px-5 min-h-[42px] text-xs font-bold"
                >
                  Analyze
                </Button>
                {(liveResult || customText) && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleReset}
                    icon={<RotateCcw className="w-3.5 h-3.5 shrink-0" />}
                    className="px-4 min-h-[42px] text-xs"
                  >
                    Reset
                  </Button>
                )}
              </div>
            </div>

            {apiError && (
              <div className="flex items-center gap-2 text-xs text-[#f87171] bg-[#f87171]/10 p-3 rounded-lg border border-[#f87171]/20">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{apiError}</span>
              </div>
            )}
          </div>

          {/* Clean Output Display Panel */}
          {loading ? (
            <div className="rounded-xl border border-[#282828] bg-[#121212] p-6 space-y-4 animate-pulse">
              <div className="h-5 bg-[#242424] rounded w-1/4"></div>
              <div className="h-6 bg-[#202020] rounded w-3/4"></div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="h-16 bg-[#181818] rounded-lg"></div>
                <div className="h-16 bg-[#181818] rounded-lg"></div>
                <div className="h-16 bg-[#181818] rounded-lg"></div>
              </div>
            </div>
          ) : !activePreset && !liveResult ? (
            <div className="rounded-xl border border-[#282828] bg-[#121212] p-8 text-center text-xs font-mono text-[#7c7c7c]">
              No pre-computed signals in database. Enter a headline above to run interactive analysis.
            </div>
          ) : (
            <div className="rounded-xl border border-[#282828] bg-[#121212] p-5 sm:p-6 space-y-5">
              
              {/* Header / Meta Row */}
              <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#1ed760] text-black">
                    {currentTicker}
                  </span>
                  <span className="text-[#404040] text-xs font-mono">•</span>
                  <span className="text-xs text-[#999] font-medium">{currentEvent}</span>
                </div>
                <span className="text-[11px] font-mono text-[#666]">
                  {liveResult ? 'Live Model Output' : 'Pre-computed Signal'}
                </span>
              </div>

              {/* Headline Text */}
              <p className="text-base sm:text-lg font-semibold text-white leading-snug">
                "{currentHeadline}"
              </p>

              {/* 3 Clean, Balanced Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-lg bg-[#181818] border border-[#242424]">
                  <span className="text-[11px] font-mono text-[#7c7c7c] block">Sentiment</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className={`text-base font-bold font-mono tabular-nums ${
                      currentSentiment > 0 ? 'text-[#1ed760]' : currentSentiment < 0 ? 'text-[#f87171]' : 'text-white'
                    }`}>
                      {currentSentiment > 0 ? `+${currentSentiment.toFixed(2)}` : currentSentiment.toFixed(2)}
                    </span>
                    <span className="text-xs text-[#999] font-medium">{currentLabel}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-[#181818] border border-[#242424]">
                  <span className="text-[11px] font-mono text-[#7c7c7c] block">Event Classification</span>
                  <span className="text-sm font-semibold text-white mt-1 block truncate">
                    {currentEvent}
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-[#181818] border border-[#242424]">
                  <span className="text-[11px] font-mono text-[#7c7c7c] block">Impact Severity</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-base font-bold font-mono text-white">
                      {currentImpact} <span className="text-xs text-[#7c7c7c] font-normal">/ 10</span>
                    </span>
                    <span className="text-xs text-[#999] font-medium">
                      {currentImpact >= 7 ? 'High' : currentImpact >= 4 ? 'Moderate' : 'Low'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Analysis Rationale */}
              <div className="pt-3 border-t border-[#222222] text-xs text-[#a3a3a3] leading-relaxed">
                <span className="text-white font-semibold mr-1.5">Rationale:</span>
                {currentRationale}
              </div>

              {/* Engine Sub-footer */}
              <div className="text-[10px] font-mono text-[#666] flex items-center justify-between pt-1">
                <span>Engine: {currentMethod}</span>
                <span className="text-[#1ed760]">Audit Verified</span>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
};
