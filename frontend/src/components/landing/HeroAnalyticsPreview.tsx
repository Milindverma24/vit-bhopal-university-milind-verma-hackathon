import React from 'react';
import { 
  ShieldAlert, 
  TrendingDown, 
  Activity, 
  ExternalLink,
  Layers,
  ArrowDownRight
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

const DEMO_TREND_DATA = [
  { t: 'T-5', score: -0.15 },
  { t: 'T-4', score: -0.22 },
  { t: 'T-3', score: -0.48 },
  { t: 'T-2', score: -0.65 },
  { t: 'T-1', score: -0.72 }
];

export const HeroAnalyticsPreview: React.FC = () => {
  return (
    <div className="relative w-full rounded-2xl border border-[#d9d9d9] bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-black">
      {/* Top Header of the Application Panel */}
      <div className="flex items-center justify-between pb-4 border-b border-[#d9d9d9]">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-black animate-pulse" />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-black">
            Active Risk Signal Ingestion
          </span>
        </div>
        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#efefef] border border-[#d9d9d9] text-[#5e5e5e]">
          Demonstration Sample
        </span>
      </div>

      {/* Main Signal Display */}
      <div className="mt-5 space-y-4">
        {/* Ticker & Event Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-bold px-2 py-0.5 bg-black text-white rounded">
            NYSE: CAT
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full border border-[#d9d9d9] bg-[#f3f3f3] text-black font-medium">
            Credit Risk
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full border border-black bg-black text-white font-medium">
            Impact: 8 / 10
          </span>
        </div>

        {/* Financial Headline */}
        <div>
          <h4 className="text-base font-semibold leading-snug tracking-tight text-black">
            Tier-1 Industrial Credit Under Negative Watch Amid Severe Logistics Bottlenecks & Margin Pressures
          </h4>
          <p className="text-xs text-[#5e5e5e] mt-1.5 leading-relaxed line-clamp-2">
            Multi-factor NLP analysis detected severe liquidity warnings, elevated CDS spreads (+140 bps), and operational disruptions across global distribution corridors.
          </p>
        </div>

        {/* Analytical Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-3.5 rounded-xl border border-[#d9d9d9] bg-[#f3f3f3]">
            <span className="text-[11px] font-mono text-[#767676] uppercase">NLP Sentiment Score</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-mono tracking-tight text-black tabular-nums">-0.72</span>
              <span className="text-xs font-semibold text-black uppercase tracking-wider">Bearish</span>
            </div>
            <div className="text-[10px] text-[#767676] mt-0.5">FinBERT Confidence: 94.2%</div>
          </div>

          <div className="p-3.5 rounded-xl border border-[#d9d9d9] bg-[#f3f3f3]">
            <span className="text-[11px] font-mono text-[#767676] uppercase">Wholesale Stress Fallout</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-mono tracking-tight text-black tabular-nums">-6.4%</span>
              <span className="text-xs font-mono text-[#5e5e5e]">-$32.0M</span>
            </div>
            <div className="text-[10px] text-[#767676] mt-0.5">IFRS 9 ECL Shock: +$840K</div>
          </div>
        </div>

        {/* Mini Historical Trend Visualization */}
        <div className="p-3.5 rounded-xl border border-[#d9d9d9] bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-[#767676] uppercase">5-Day Signal Velocity</span>
            <span className="text-[11px] font-mono text-black font-semibold">-0.57 Δ (Accelerating)</span>
          </div>
          <div className="h-16 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DEMO_TREND_DATA} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#000000" 
                  strokeWidth={2} 
                  dot={{ r: 3, fill: '#000000' }} 
                  isAnimationActive={false} 
                />
                <XAxis dataKey="t" hide />
                <YAxis domain={[-1, 0]} hide />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Panel Footnote */}
      <div className="mt-4 pt-3.5 border-t border-[#d9d9d9] flex items-center justify-between text-[11px] text-[#767676]">
        <span>Model: FinBERT + Syntactic Rules</span>
        <span className="font-mono">Execution Tenor: 42ms</span>
      </div>
    </div>
  );
};
