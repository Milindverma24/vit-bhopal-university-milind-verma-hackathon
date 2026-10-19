import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { api } from '../../services/api';
import { RiskSignal, DashboardSummary } from '../../types';

export const HeroAnalyticsPreview: React.FC = () => {
  const [signal, setSignal] = useState<RiskSignal | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [pulseData, setPulseData] = useState<{ time: string; value: number }[]>([
    { time: '09:00', value: 0.12 },
    { time: '10:30', value: 0.05 },
    { time: '12:00', value: -0.18 },
    { time: '13:30', value: -0.04 },
    { time: '15:00', value: 0.08 },
    { time: '16:30', value: 0.01 }
  ]);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const [sigRes, sumRes] = await Promise.all([
          api.getSignals({ pageSize: 6 }),
          api.getDashboardSummary().catch(() => null)
        ]);
        if (!mounted) return;
        if (sigRes.items && sigRes.items.length > 0) {
          setSignal(sigRes.items[0]);
          const series = sigRes.items
            .slice(0, 6)
            .reverse()
            .map((s, i) => ({
              time: s.published_at 
                ? new Date(s.published_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : `T-${6 - i}`,
              value: Number(s.sentiment_score.toFixed(2))
            }));
          if (series.length >= 2) {
            setPulseData(series);
          }
        }
        if (sumRes) {
          setSummary(sumRes);
        }
      } catch (err) {
        console.error('Failed to load real pulse data:', err);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const totalSignals = summary?.total_signals ?? 36;
  const highImpact = summary?.high_impact_events_count ?? 4;
  const avgSentiment = summary?.average_market_sentiment != null 
    ? summary.average_market_sentiment 
    : 0.01;
  const ticker = signal?.primary_ticker || signal?.entities?.[0]?.ticker || 'JPM';
  const headline = signal?.headline || 'DOJ and SEC issue inquiry into wholesale trading practices';

  return (
    <div className="relative w-full rounded-[12px] border border-[#282828] bg-[#181818] p-7 shadow-[0_12px_36px_rgba(0,0,0,0.4)] text-white">
      {/* Quiet, Minimalist Header */}
      <div className="flex items-center justify-between pb-5 border-b border-[#282828]">
        <div>
          <span className="font-mono text-xs uppercase tracking-[1.4px] text-[#b3b3b3]">
            Market Risk Pulse
          </span>
          <h3 className="text-base font-bold text-white mt-0.5">
            Real-Time Telemetry
          </h3>
        </div>
        <span className="text-[11px] font-mono text-[#b3b3b3] px-3 py-1 rounded-full bg-[#121212] border border-[#282828]">
          Live Feed · S&P Basket
        </span>
      </div>

      {/* Hero Number & Big Clean Metric */}
      <div className="pt-6 pb-4">
        <span className="text-xs font-mono text-[#7c7c7c] uppercase tracking-wider block">
          Composite Sentiment Score
        </span>
        <div className="flex items-baseline gap-3 mt-1.5">
          <span className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight text-[#1ed760] tabular-nums">
            {avgSentiment > 0 ? `+${avgSentiment.toFixed(2)}` : avgSentiment.toFixed(2)}
          </span>
          <span className="text-sm font-semibold text-white">
            Neutral Baseline
          </span>
        </div>
        <p className="text-xs text-[#b3b3b3] mt-2">
          Tracking {totalSignals} incoming market events across constituent balance sheets.
        </p>
      </div>

      {/* Clean, Minimalist Waveform Chart */}
      <div className="py-4">
        <div className="h-28 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={pulseData} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="pulseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1ed760" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#1ed760" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" hide />
              <YAxis domain={[-1, 1]} hide />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#121212] text-white text-xs px-3 py-1 rounded-full font-mono border border-[#333333] shadow-lg">
                        Score: {payload[0].value}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#1ed760" 
                strokeWidth={2}
                fill="url(#pulseGradient)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3 Balanced Key Metrics with Plenty of Breathing Room */}
      <div className="grid grid-cols-3 gap-3 pt-2 pb-5 border-b border-[#282828]">
        <div className="p-3 rounded-[8px] bg-[#121212] border border-[#282828]">
          <span className="text-[10px] font-mono text-[#7c7c7c] uppercase tracking-wider block">Signals Ingested</span>
          <span className="text-lg font-bold font-mono text-white mt-1 block tabular-nums">
            {totalSignals}
          </span>
        </div>
        <div className="p-3 rounded-[8px] bg-[#121212] border border-[#282828]">
          <span className="text-[10px] font-mono text-[#7c7c7c] uppercase tracking-wider block">High Impact</span>
          <span className="text-lg font-bold font-mono text-white mt-1 block tabular-nums">
            {highImpact}
          </span>
        </div>
        <div className="p-3 rounded-[8px] bg-[#121212] border border-[#282828]">
          <span className="text-[10px] font-mono text-[#7c7c7c] uppercase tracking-wider block">Book Resilience</span>
          <span className="text-lg font-bold font-mono text-white mt-1 block tabular-nums">
            93.3%
          </span>
        </div>
      </div>

      {/* Clean, Single-Line Live Pulse Ticker */}
      <div className="pt-4 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono text-[11px] font-bold text-white bg-[#242424] px-2 py-0.5 rounded border border-[#333333] shrink-0">
            {ticker}
          </span>
          <span className="text-xs text-[#b3b3b3] truncate">
            {headline}
          </span>
        </div>
        <span className="text-[11px] font-mono text-[#7c7c7c] shrink-0">
          Live
        </span>
      </div>
    </div>
  );
};
