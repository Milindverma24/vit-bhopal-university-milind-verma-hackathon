import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { ImpactBadge, SentimentBadge } from '../ui/Badges';
import { api } from '../../services/api';
import { RiskSignal } from '../../types';

export const ProductPreviewSection: React.FC = () => {
  const [signals, setSignals] = useState<RiskSignal[]>([]);
  const [activeSignal, setActiveSignal] = useState<RiskSignal | null>(null);
  const [distributionData, setDistributionData] = useState<{ name: string; count: number }[]>([]);
  const [totalSignalCount, setTotalSignalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const [sigRes, sumRes] = await Promise.all([
          api.getSignals({ pageSize: 5 }),
          api.getDashboardSummary().catch(() => null)
        ]);
        if (!mounted) return;
        if (sigRes.items && sigRes.items.length > 0) {
          setSignals(sigRes.items);
          setActiveSignal(sigRes.items[0]);
          setTotalSignalCount(sigRes.total || sigRes.items.length);
        }
        if (sumRes) {
          if (sumRes.total_signals) {
            setTotalSignalCount(sumRes.total_signals);
          }
          if (sumRes.event_distribution) {
            const formatted = Object.entries(sumRes.event_distribution)
              .filter(([_, count]) => count > 0)
              .map(([k, v]) => ({
                name: k.replace(/ Event| Action| Disruption/g, '').slice(0, 10),
                count: v
              }))
              .slice(0, 5);
            setDistributionData(formatted);
          }
        }
      } catch (err) {
        console.error('Failed to load ProductPreviewSection data:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const currentSig = activeSignal || signals[0];

  return (
    <section id="product-preview" className="py-20 lg:py-28 border-b border-[#282828] bg-[#121212]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-[11px] font-mono font-bold uppercase tracking-[1.4px] text-[#1ed760] bg-[#1f1f1f] px-3.5 py-1.5 rounded-full border border-[#333333] inline-block mb-3">
            Signal Discovery
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1">
            Real-time risk signals as market headlines break.
          </h2>
          <p className="text-base text-[#b3b3b3] mt-2 leading-relaxed">
            Review automated sentiment scores, identified entities, and estimated impact across the portfolio.
          </p>
        </div>

        {/* Analytical Preview Container */}
        <div className="rounded-[8px] border border-[#282828] bg-[#181818] p-6 lg:p-8 space-y-8 shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
          
          {/* Top Panel Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#282828]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1ed760] animate-pulse" />
              <span className="text-xs font-mono uppercase font-bold text-white tracking-[1.4px]">
                Live Risk Signal Stream
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#b3b3b3] bg-[#1f1f1f] px-3 py-1 rounded-full border border-[#282828]">
              {totalSignalCount > 0 ? `${totalSignalCount} Ingested Signals` : 'Live Stream Active'}
            </span>
          </div>

          {/* Main Grid: Signal Table (Left) + Distribution / Trend (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Signal Table (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <span className="text-[11px] font-mono uppercase text-[#7c7c7c] tracking-[1.4px] block mb-1">
                Recent Detected Events
              </span>

              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-4 rounded-[8px] border border-[#282828] bg-[#1f1f1f] animate-pulse space-y-2">
                      <div className="h-4 bg-[#282828] rounded w-1/4"></div>
                      <div className="h-3 bg-[#242424] rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : signals.length === 0 ? (
                <div className="p-8 rounded-[8px] border border-[#282828] bg-[#1f1f1f] text-center text-xs font-mono text-[#7c7c7c]">
                  Connecting to live signal stream...
                </div>
              ) : (
                <div className="space-y-2">
                  {signals.map((sig) => {
                    const isSelected = currentSig?.signal_id === sig.signal_id;
                    const sigTicker = sig.primary_ticker || sig.entities?.[0]?.ticker || 'CORP';
                    const eventDisplay = sig.event_type.replace(/_/g, ' ');
                    return (
                      <div
                        key={sig.signal_id}
                        onClick={() => setActiveSignal(sig)}
                        className={`p-4 rounded-[8px] border transition-all cursor-pointer text-left ${
                          isSelected 
                            ? 'border-[#1ed760] bg-[#242424] shadow-[0_4px_16px_rgba(0,0,0,0.6)]' 
                            : 'border-[#282828] bg-[#1f1f1f] hover:bg-[#252525] hover:border-[#4d4d4d]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5 text-xs font-mono">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold ${isSelected ? 'text-[#1ed760]' : 'text-white'}`}>{sigTicker}</span>
                            <span className="text-[#4d4d4d]">•</span>
                            <span className="text-[#b3b3b3]">
                              {sig.published_at ? new Date(sig.published_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <SentimentBadge score={sig.sentiment_score} />
                            <ImpactBadge score={sig.impact_score} />
                          </div>
                        </div>
                        <p className="text-xs text-white font-medium leading-snug line-clamp-2">
                          {sig.headline}
                        </p>
                        <div className="mt-1.5 text-[11px] font-mono text-[#7c7c7c]">
                          Event: <span className="text-[#cbcbcb] font-medium">{eventDisplay}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Column: Trend Chart & Distribution (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Selected Signal Deep Inspection */}
              {currentSig && (
                <div className="p-4 rounded-[8px] border border-[#282828] bg-[#1f1f1f] space-y-3">
                  <span className="text-[11px] font-mono uppercase text-[#7c7c7c] tracking-[1.4px] block">
                    Active Signal Inspection
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-white">
                      {currentSig.primary_ticker || currentSig.entities?.[0]?.ticker || 'INDEX'}
                    </span>
                    <span className="text-xs font-mono bg-[#181818] px-2.5 py-0.5 rounded-full border border-[#282828] text-white">
                      Impact {currentSig.impact_score} / 10
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                    <div className="p-3 rounded-[6px] bg-[#181818] border border-[#282828]">
                      <span className="text-[10px] text-[#7c7c7c] block">Sentiment</span>
                      <span className={`text-base font-bold tabular-nums ${currentSig.sentiment_score >= 0 ? 'text-[#1ed760]' : 'text-[#f3727f]'}`}>
                        {currentSig.sentiment_score > 0 ? `+${currentSig.sentiment_score.toFixed(2)}` : currentSig.sentiment_score.toFixed(2)}
                      </span>
                    </div>
                    <div className="p-3 rounded-[6px] bg-[#181818] border border-[#282828]">
                      <span className="text-[10px] text-[#7c7c7c] block">Event Category</span>
                      <span className="text-xs font-semibold text-white truncate block mt-0.5">
                        {currentSig.event_type.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-[#b3b3b3] leading-relaxed pt-1 line-clamp-3">
                    {currentSig.impact_rationale || currentSig.text}
                  </p>
                </div>
              )}

              {/* Event / Sector Distribution Histogram */}
              <div className="p-4 rounded-[8px] border border-[#282828] bg-[#1f1f1f] space-y-3">
                <span className="text-[11px] font-mono uppercase text-[#7c7c7c] tracking-[1.4px] block">
                  Signals by Event Taxonomy
                </span>
                <div className="h-36 w-full">
                  {distributionData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={distributionData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#b3b3b3' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: '#7c7c7c' }} axisLine={false} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#181818', borderColor: '#282828', borderRadius: '8px', color: '#fff' }}
                          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        />
                        <Bar dataKey="count" fill="#1ed760" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs font-mono text-[#7c7c7c]">
                      Loading distribution taxonomy...
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Summary Bar */}
          <div className="pt-4 border-t border-[#282828] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#b3b3b3]">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Coverage:</span>
              <span>
                {totalSignalCount > 0 
                  ? `${totalSignalCount} live detected signals across ${distributionData.length > 0 ? distributionData.length : 'active'} event categories` 
                  : 'Live constituent coverage across all financial risk events'}
              </span>
            </div>
            <div className="font-mono text-[11px] text-[#7c7c7c]">
              Deterministic sentiment and audit trails for every signal
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
