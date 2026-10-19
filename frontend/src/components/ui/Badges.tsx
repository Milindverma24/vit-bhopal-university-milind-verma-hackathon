import React from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Radio, Newspaper, MessageSquare } from 'lucide-react';

interface SentimentBadgeProps {
  score?: number;
  label?: string;
  showScore?: boolean;
  className?: string;
}

export const SentimentBadge: React.FC<SentimentBadgeProps> = ({
  score,
  label,
  showScore = true,
  className = ''
}) => {
  const normLabel = label || (score !== undefined ? (score > 0.05 ? 'Positive' : score < -0.05 ? 'Negative' : 'Neutral') : 'Neutral');
  const isPos = normLabel === 'Positive' || (score !== undefined && score > 0.05);
  const isNeg = normLabel === 'Negative' || (score !== undefined && score < -0.05);

  let icon = <Minus className="w-3 h-3 text-[#b3b3b3] shrink-0" />;
  let containerStyle = 'bg-[#1f1f1f] text-[#b3b3b3] border-[#333333]';

  if (isNeg) {
    icon = <TrendingDown className="w-3 h-3 text-[#f3727f] shrink-0" />;
    containerStyle = 'bg-[#f3727f]/15 text-[#f3727f] border-[#f3727f]/30';
  } else if (isPos) {
    icon = <TrendingUp className="w-3 h-3 text-[#1ed760] shrink-0" />;
    containerStyle = 'bg-[#1ed760]/15 text-[#1ed760] border-[#1ed760]/30';
  }

  const scoreText = score !== undefined ? (score > 0 ? `+${score.toFixed(2)}` : score.toFixed(2)) : null;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border select-none tabular-nums transition-colors duration-150 ${containerStyle} ${className}`}>
      {icon}
      <span>{normLabel}</span>
      {showScore && scoreText && (
        <span className="font-mono text-[11px] opacity-80">({scoreText})</span>
      )}
    </span>
  );
};

interface ImpactBadgeProps {
  score: number;
  level?: string;
  className?: string;
}

export const ImpactBadge: React.FC<ImpactBadgeProps> = ({ score, level, className = '' }) => {
  const isCritical = score >= 9 || level === 'Critical';
  const isHigh = (score >= 7 && score < 9) || level === 'High';
  const isModerate = (score >= 5 && score < 7) || level === 'Moderate';

  if (isCritical) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#f3727f] text-black border border-[#f3727f] tabular-nums select-none ${className}`}>
        <AlertTriangle className="w-3 h-3 text-black shrink-0" />
        <span>CRITICAL ({Math.round(score)}/10)</span>
      </span>
    );
  }

  if (isHigh) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#f3727f]/15 text-[#f3727f] border border-[#f3727f]/30 tabular-nums select-none ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#f3727f] shrink-0" />
        <span>High ({Math.round(score)}/10)</span>
      </span>
    );
  }

  if (isModerate) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#ffa42b]/15 text-[#ffa42b] border border-[#ffa42b]/30 tabular-nums select-none ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#ffa42b] shrink-0" />
        <span>Moderate ({Math.round(score)}/10)</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#1f1f1f] text-[#b3b3b3] border border-[#333333] tabular-nums select-none ${className}`}>
      <span>Low ({Math.round(score)}/10)</span>
    </span>
  );
};

interface SourceBadgeProps {
  sourceType: string;
  isSynthetic?: boolean;
  className?: string;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({ sourceType, isSynthetic, className = '' }) => {
  const isSocial = sourceType.toLowerCase().includes('social');

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border select-none ${
        isSocial 
          ? 'bg-[#539df5]/15 text-[#539df5] border-[#539df5]/30' 
          : 'bg-[#1f1f1f] text-[#b3b3b3] border-[#333333]'
      }`}>
        {isSocial ? (
          <MessageSquare className="w-3 h-3 text-[#539df5]" />
        ) : (
          <Newspaper className="w-3 h-3 text-[#b3b3b3]" />
        )}
        <span className="capitalize">{sourceType}</span>
      </span>

      {isSynthetic && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#1f1f1f] text-[#b3b3b3] border border-[#333333] select-none" title="Deterministic Synthetic Disclosures for Risk Modelling">
          <Radio className="w-2.5 h-2.5 text-[#1ed760] animate-pulse" />
          SYNTHETIC
        </span>
      )}
    </div>
  );
};

export const HorizonBadge: React.FC<{ horizon: string; className?: string }> = ({ horizon, className = '' }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-[#1f1f1f] text-[#b3b3b3] border border-[#333333] ${className}`}>
      {horizon}
    </span>
  );
};
