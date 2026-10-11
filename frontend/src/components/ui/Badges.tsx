import React from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

interface SentimentBadgeProps {
  score?: number;
  label?: string;
  showScore?: boolean;
}

export const SentimentBadge: React.FC<SentimentBadgeProps> = ({
  score,
  label,
  showScore = true
}) => {
  const normLabel = label || (score !== undefined ? (score > 0.05 ? 'Positive' : score < -0.05 ? 'Negative' : 'Neutral') : 'Neutral');
  const isPos = normLabel === 'Positive';
  const isNeg = normLabel === 'Negative';

  let icon = <Minus className="w-3 h-3 text-[#767676]" />;
  if (isPos) icon = <TrendingUp className="w-3 h-3 text-black" />;
  if (isNeg) icon = <TrendingDown className="w-3 h-3 text-white" />;

  // Monochrome contrast styling adhering to Section 2.1
  let containerStyle = 'bg-[#efefef] text-black border border-[#d9d9d9]';
  if (isNeg) {
    containerStyle = 'bg-black text-white border border-black';
  } else if (isPos) {
    containerStyle = 'bg-[#f3f3f3] text-black border border-[#d9d9d9] font-medium';
  }

  const scoreText = score !== undefined ? (score > 0 ? `+${score.toFixed(2)}` : score.toFixed(2)) : null;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs select-none tabular-nums ${containerStyle}`}>
      {icon}
      <span>{normLabel}</span>
      {showScore && scoreText && (
        <span className="opacity-80 text-[11px] font-mono">({scoreText})</span>
      )}
    </span>
  );
};

interface ImpactBadgeProps {
  score: number;
  level?: string;
}

export const ImpactBadge: React.FC<ImpactBadgeProps> = ({ score, level }) => {
  const isCritical = score >= 9 || level === 'Critical';
  const isHigh = (score >= 7 && score < 9) || level === 'High';
  const isModerate = (score >= 5 && score < 7) || level === 'Moderate';

  if (isCritical) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-black text-white border border-black tabular-nums">
        <AlertTriangle className="w-3 h-3 text-white" />
        <span>Critical ({Math.round(score)}/10)</span>
      </span>
    );
  }

  if (isHigh) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-black text-white tabular-nums">
        <span>High ({Math.round(score)}/10)</span>
      </span>
    );
  }

  if (isModerate) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#efefef] text-black border border-[#d9d9d9] tabular-nums">
        <span>Moderate ({Math.round(score)}/10)</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#f3f3f3] text-[#5e5e5e] border border-[#d9d9d9] tabular-nums">
      <span>Low ({Math.round(score)}/10)</span>
    </span>
  );
};

interface SourceBadgeProps {
  sourceType: string;
  isSynthetic?: boolean;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({ sourceType, isSynthetic }) => {
  const isSocial = sourceType.toLowerCase().includes('social');

  return (
    <div className="inline-flex items-center gap-1">
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#efefef] text-[#5e5e5e] border border-[#d9d9d9]">
        {isSocial ? 'Social' : 'News'}
      </span>
      {isSynthetic && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-white text-[#767676] border border-[#d9d9d9]">
          SYNTHETIC
        </span>
      )}
    </div>
  );
};

export const DataModeBadge: React.FC<{ mode?: string }> = ({ mode = 'DEMO DATA' }) => {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider bg-[#efefef] text-black border border-[#d9d9d9] select-none">
      <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
      <span>{mode.toUpperCase()}</span>
    </span>
  );
};
