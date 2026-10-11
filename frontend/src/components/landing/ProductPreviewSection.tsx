import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';
import { Card } from '../ui/Card';
import { ImpactBadge, SentimentBadge } from '../ui/Badges';

const DEMO_SIGNALS = [
  {
    id: 'SIG-101',
    time: '14:22 UTC',
    ticker: 'JPM',
    headline: 'JPMorgan Chase expands net interest income forecast following robust corporate loan demand',
    sentiment: 0.83,
    event: 'Corporate Earnings',
    impact: 6
  },
  {
    id: 'SIG-102',
    time: '12:45 UTC',
    ticker: 'AAPL',
    headline: 'Department of Justice initiates formal scrutiny over exclusive vendor ecosystem contracts',
    sentiment: -0.68,
    event: 'Regulatory Action',
    impact: 7
  },
  {
    id: 'SIG-103',
    time: '10:15 UTC',
    ticker: 'NVDA',
    headline: 'Critical semiconductor foundry halts high-density packaging line due to thermal bottleneck',
    sentiment: -0.74,
    event: 'Supply Chain Disruption',
    impact: 8
  },
  {
    id: 'SIG-104',
    time: '08:30 UTC',
    ticker: 'XOM',
    headline: 'Upstream exploration yield exceeds quarterly guidance across Permian basin assets',
    sentiment: 0.62,
    event: 'Positive Business Development',
    impact: 5
  },
  {
    id: 'SIG-105',
    time: '06:10 UTC',
    ticker: 'CVX',
    headline: 'European credit rating agency affirms negative outlook citing prolonged pipeline downtime',
    sentiment: -0.85,
    event: 'Credit Event',
    impact: 8
  }
];

const SECTOR_DISTRIBUTION = [
  { sector: 'Tech', count: 34 },
  { sector: 'Finance', count: 28 },
  { sector: 'Energy', count: 24 },
  { sector: 'Health', count: 18 },
  { sector: 'Industrial', count: 22 }
];

export const ProductPreviewSection: React.FC = () => {
  const [activeSignal, setActiveSignal] = useState(DEMO_SIGNALS[1]);

  return (
    <section id="product-preview" className="py-20 lg:py-28 border-b border-[#d9d9d9] bg-[#fafafa]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-black bg-[#efefef] px-2.5 py-0.5 rounded-full border border-[#d9d9d9]">
            ANALYTICAL PLATFORM CAPABILITIES
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-black mt-3">
            See the signal behind the story.
          </h2>
          <p className="text-base text-[#5e5e5e] mt-2 leading-relaxed">
            From unstructured information to structured risk analysis, every stage is designed to make financial signals easier to inspect.
          </p>
        </div>

        {/* Analytical Preview Container */}
        <div className="rounded-2xl border border-[#d9d9d9] bg-white p-6 lg:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.03)] space-y-8">
          
          {/* Top Panel Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#d9d9d9]">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-black"></span>
              <span className="text-xs font-mono uppercase font-bold text-black tracking-wider">
                Risk Signal Explorer Preview
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#767676] bg-[#f3f3f3] px-2.5 py-1 rounded border border-[#d9d9d9]">
              Live Ingestion Simulation · Standard Benchmark
            </span>
          </div>

          {/* Main Grid: Signal Table (Left) + Distribution / Trend (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Signal Table (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <span className="text-xs font-mono uppercase text-[#767676] tracking-wider block mb-1">
                Incoming Structured Risk Signals
              </span>

              <div className="space-y-2">
                {DEMO_SIGNALS.map((sig) => {
                  const isSelected = activeSignal.id === sig.id;
                  return (
                    <div
                      key={sig.id}
                      onClick={() => setActiveSignal(sig)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                        isSelected 
                          ? 'border-black bg-[#f3f3f3] shadow-sm' 
                          : 'border-[#d9d9d9] bg-white hover:border-black'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5 text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-black">{sig.ticker}</span>
                          <span className="text-[#767676]">•</span>
                          <span className="text-[#5e5e5e]">{sig.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <SentimentBadge score={sig.sentiment} />
                          <ImpactBadge score={sig.impact} />
                        </div>
                      </div>
                      <p className="text-xs text-black font-medium leading-snug line-clamp-2">
                        {sig.headline}
                      </p>
                      <div className="mt-1.5 text-[11px] font-mono text-[#767676]">
                        Event: <span className="text-black">{sig.event}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Trend Chart & Distribution (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Selected Signal Deep Inspection */}
              <div className="p-4 rounded-xl border border-[#d9d9d9] bg-[#f3f3f3] space-y-3">
                <span className="text-xs font-mono uppercase text-[#767676] tracking-wider block">
                  Active Signal Inspection
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-black">{activeSignal.ticker}</span>
                  <span className="text-xs font-mono bg-white px-2 py-0.5 rounded border border-[#d9d9d9] text-black">
                    Impact {activeSignal.impact} / 10
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                  <div className="p-2.5 rounded-lg bg-white border border-[#d9d9d9]">
                    <span className="text-[10px] text-[#767676] block">Sentiment</span>
                    <span className="text-base font-bold text-black tabular-nums">
                      {activeSignal.sentiment > 0 ? `+${activeSignal.sentiment}` : activeSignal.sentiment}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-[#d9d9d9]">
                    <span className="text-[10px] text-[#767676] block">Event Category</span>
                    <span className="text-xs font-semibold text-black truncate block mt-0.5">
                      {activeSignal.event}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sector Distribution Histogram */}
              <div className="p-4 rounded-xl border border-[#d9d9d9] bg-white space-y-3">
                <span className="text-xs font-mono uppercase text-[#767676] tracking-wider block">
                  Signals by Market Sector
                </span>
                <div className="h-36 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={SECTOR_DISTRIBUTION} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                      <XAxis dataKey="sector" tick={{ fontSize: 11, fill: '#767676' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#767676' }} axisLine={false} tickLine={false} />
                      <Bar dataKey="count" fill="#111111" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Summary Bar */}
          <div className="pt-4 border-t border-[#d9d9d9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#5e5e5e]">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-black">Pipeline Throughput:</span>
              <span>120+ signals processed per batch</span>
            </div>
            <div className="font-mono text-[11px] text-[#767676]">
              All signals traceable to raw financial text & evidence markers
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
