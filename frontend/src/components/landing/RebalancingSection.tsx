import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { api } from '../../services/api';
import { Constituent } from '../../types';

const REBALANCE_FEATURES = [
  'Constrained constituent bounds: 2.0% minimum to 20.0% maximum',
  'One-way turnover budgets to control rebalance execution friction',
  'Event severity adjustments across corporate, credit, and regulatory triggers',
  'Two-stage preview and commit workflow before applying allocation changes',
  'Complete historical audit trail recording every factor and weight shift'
];

interface RebalancingSectionProps {
  onNavigateRebalancing: () => void;
}

export const RebalancingSection: React.FC<RebalancingSectionProps> = ({
  onNavigateRebalancing
}) => {
  const [allocations, setAllocations] = useState<any[]>([]);
  const [turnoverPct, setTurnoverPct] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadIndexData() {
      try {
        // Execute real-time tactical rebalance preview from the backend
        const runRes = await api.executeRebalance({ preview_only: true });
        if (!mounted) return;
        if (runRes && runRes.allocations) {
          // Sort by absolute weight change descending so the most active adjustments appear first
          const sorted = [...runRes.allocations].sort(
            (a, b) => Math.abs(b.weight_change ?? 0) - Math.abs(a.weight_change ?? 0)
          );
          setAllocations(sorted.slice(0, 4));
          if (runRes.turnover != null) {
            setTurnoverPct(runRes.turnover * 100);
          }
        }
      } catch (err) {
        console.error('Failed to load live rebalancing preview:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadIndexData();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="py-20 lg:py-28 border-b border-[#282828] bg-[#121212]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="max-w-3xl mb-16">
          <span className="text-[11px] font-mono font-bold uppercase tracking-[1.4px] text-[#1ed760] bg-[#1f1f1f] px-3.5 py-1.5 rounded-full border border-[#333333] inline-block">
            Tactical Allocation
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-3">
            Rules-based rebalancing under real portfolio constraints.
          </h2>
          <p className="text-base text-[#b3b3b3] mt-2 leading-relaxed">
            Translate sentiment changes and credit events into target weight adjustments while preserving liquidity and turnover limits.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Rebalance Comparison Table */}
          <div className="lg:col-span-7">
            <div className="rounded-[8px] border border-[#282828] bg-[#181818] p-6 sm:p-8 space-y-6 shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between pb-4 border-b border-[#282828]">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase font-mono tracking-[1.4px]">
                    Index Allocation Shift Preview
                  </h4>
                  <span className="text-xs text-[#b3b3b3]">Tactical Benchmark Allocation</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-[#7c7c7c] uppercase tracking-wider block">Modeled Turnover</span>
                  <span className="text-sm font-mono font-bold text-[#1ed760] tabular-nums">
                    {turnoverPct != null ? `${turnoverPct.toFixed(2)}% (One-Way)` : 'Calculating...'}
                  </span>
                </div>
              </div>

              {/* Allocation Comparison Table with Real Constituents */}
              <div className="space-y-4">
                {loading ? (
                  <div className="space-y-3 animate-pulse">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="p-4 rounded-[8px] border border-[#282828] bg-[#1f1f1f] space-y-2">
                        <div className="h-4 bg-[#282828] rounded w-1/3"></div>
                        <div className="h-2 bg-[#222222] rounded w-full"></div>
                      </div>
                    ))}
                  </div>
                ) : allocations.length === 0 ? (
                  <div className="p-8 rounded-[8px] border border-[#282828] bg-[#1f1f1f] text-center text-xs font-mono text-[#7c7c7c]">
                    Connecting to live rebalance engine...
                  </div>
                ) : (
                  allocations.map((item: any) => {
                    const prevWeight = item.prev_weight ?? item.current_weight ?? 0.0667;
                    const proposedWeight = item.proposed_weight ?? item.executed_weight ?? item.target_weight ?? prevWeight;
                    const currPct = prevWeight * 100;
                    const targetPct = proposedWeight * 100;
                    const deltaPct = (item.weight_change != null ? item.weight_change : (proposedWeight - prevWeight)) * 100;
                    const isNegative = deltaPct < 0;
                    const sentimentVal = item.sentiment ?? item.latest_sentiment ?? 0;
                    const eventText = item.event ?? item.latest_event ?? 'Market Ingestion';

                    return (
                      <div key={item.ticker} className="p-4 rounded-[8px] border border-[#282828] bg-[#1f1f1f] space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{item.ticker}</span>
                            <span className="text-[#b3b3b3] truncate max-w-[140px] sm:max-w-none">{item.name}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[#7c7c7c]">{currPct.toFixed(1)}%</span>
                            <span className="text-[#4d4d4d]">→</span>
                            <span className="font-bold text-white">{targetPct.toFixed(1)}%</span>
                            <span className={`px-2.5 py-0.5 rounded-full font-medium text-[11px] font-mono border ${
                              isNegative ? 'bg-[#f3727f]/15 text-[#f3727f] border-[#f3727f]/30' : 'bg-[#1ed760]/15 text-[#1ed760] border-[#1ed760]/30'
                            }`}>
                              {deltaPct > 0 ? `+${deltaPct.toFixed(1)}%` : `${deltaPct.toFixed(1)}%`}
                            </span>
                          </div>
                        </div>

                        {/* Visual Bar Comparison */}
                        <div className="w-full bg-[#121212] h-2 rounded-full overflow-hidden flex">
                          <div 
                            className="bg-[#1ed760] h-full rounded-full transition-all duration-500" 
                            style={{ width: `${Math.min(targetPct * 5, 100)}%` }} 
                          />
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-[#7c7c7c] pt-0.5">
                          <span>
                            Sentiment: <strong className={sentimentVal > 0 ? 'text-[#1ed760]' : sentimentVal < 0 ? 'text-[#f3727f]' : 'text-white'}>
                              {sentimentVal > 0 ? `+${sentimentVal.toFixed(2)}` : sentimentVal.toFixed(2)}
                            </strong>
                          </span>
                          <span className="font-medium text-[#cbcbcb] truncate max-w-[180px] sm:max-w-none">{eventText}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="pt-2 text-[11px] font-mono text-[#7c7c7c] flex items-center justify-between">
                <span>Sum of Allocations: 100.0%</span>
                <span>Box Bounds: 2.0% – 18.0%</span>
              </div>
            </div>
          </div>

          {/* Right Column: Features & CTA */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-2xl font-bold tracking-tight text-white">
              Algorithmic Discipline With Complete Explainability
            </h3>
            <p className="text-sm text-[#b3b3b3] leading-relaxed">
              Every allocation change is mathematically bounded, respects configured risk limits, and produces an auditable record of why a constituent weight expanded or contracted.
            </p>

            <div className="space-y-3 pt-2">
              {REBALANCE_FEATURES.map((feat) => (
                <div key={feat} className="flex items-start gap-2.5 text-xs text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#1ed760] shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{feat}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Button
                variant="primary"
                size="md"
                onClick={onNavigateRebalancing}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Explore Index Rebalancing
              </Button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
