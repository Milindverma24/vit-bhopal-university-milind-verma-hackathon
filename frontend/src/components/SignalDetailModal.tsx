import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  Check, 
  Copy, 
  Code,
  Building2,
  FileText
} from 'lucide-react';
import { RiskSignal } from '../types';
import { SentimentBadge, ImpactBadge, SourceBadge } from './ui/Badges';
import { Button } from './ui/Button';
import { formatTimestamp } from '../utils/formatters';

interface SignalDetailModalProps {
  signal: RiskSignal | null;
  onClose: () => void;
}

export const SignalDetailModal: React.FC<SignalDetailModalProps> = ({ signal, onClose }) => {
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);

  if (!signal) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(signal, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(signal.signal_id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-[16px] border border-[#e2e2e2] shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden text-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#282828] bg-[#181818] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1ed760] text-black flex items-center justify-center font-bold text-xs">
              <ShieldAlert className="w-4 h-4 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold uppercase text-white">
                  {signal.signal_id}
                </span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="text-[#b3b3b3] hover:text-white p-0.5 rounded transition-colors"
                  title="Copy Signal ID"
                >
                  {copiedId ? <Check className="w-3 h-3 text-[#1ed760]" /> : <Copy className="w-3 h-3" />}
                </button>
                <SourceBadge sourceType={signal.source_type} isSynthetic={signal.is_synthetic} />
              </div>
              <p className="text-xs text-[#b3b3b3] font-medium mt-0.5">
                {signal.source_name} • {formatTimestamp(signal.published_at || signal.processed_at)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-[#b3b3b3] hover:text-white p-1.5 rounded-full hover:bg-[#282828] transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#242424]">
          {/* Headline & Full Text */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-snug">
              {signal.headline}
            </h2>
            <div className="mt-3 p-4 bg-[#181818] rounded-[8px] border border-[#282828] text-xs sm:text-sm text-white leading-relaxed font-normal">
              {signal.text}
            </div>
          </div>

          {/* Metric Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Sentiment */}
            <div className="p-3.5 rounded-[8px] border border-[#282828] bg-[#181818] flex flex-col justify-between">
              <span className="text-[10px] font-bold text-[#b3b3b3] uppercase tracking-[1.4px] block">
                Sentiment
              </span>
              <div className="my-1.5">
                <SentimentBadge score={signal.sentiment_score} label={signal.sentiment_label} />
              </div>
              <span className="text-[10px] text-[#7c7c7c] truncate" title={signal.sentiment_method}>
                {signal.sentiment_method}
              </span>
            </div>

            {/* Event Category */}
            <div className="p-3.5 rounded-[8px] border border-[#282828] bg-[#181818] flex flex-col justify-between">
              <span className="text-[10px] font-bold text-[#b3b3b3] uppercase tracking-[1.4px] block">
                Event Taxonomy
              </span>
              <div className="my-1.5">
                <span className="font-bold text-xs text-white block truncate" title={signal.event_type}>
                  {signal.event_type}
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#b3b3b3] tabular-nums">
                {Math.round(signal.event_confidence * 100)}% match conf
              </span>
            </div>

            {/* Impact */}
            <div className="p-3.5 rounded-[8px] border border-[#282828] bg-[#181818] flex flex-col justify-between">
              <span className="text-[10px] font-bold text-[#b3b3b3] uppercase tracking-[1.4px] block">
                Severity Score
              </span>
              <div className="my-1.5">
                <ImpactBadge score={signal.impact_score} level={signal.impact_level} />
              </div>
              <span className="text-[10px] text-[#7c7c7c] truncate">
                {signal.impact_method}
              </span>
            </div>

            {/* Primary Entity */}
            <div className="p-3.5 rounded-[8px] border border-[#282828] bg-[#181818] flex flex-col justify-between">
              <span className="text-[10px] font-bold text-[#b3b3b3] uppercase tracking-[1.4px] block">
                Primary Entity
              </span>
              <div className="my-1.5 font-bold font-mono text-sm text-white flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#1ed760]" />
                <span>{signal.primary_ticker || 'Macro / Market'}</span>
              </div>
              <span className="text-[10px] text-[#b3b3b3] truncate" title={signal.primary_company}>
                {signal.primary_company || 'Cross-Sector Impact'}
              </span>
            </div>
          </div>

          {/* Explainable Rationale */}
          <div className="bg-[#181818] rounded-[8px] p-4 border border-[#282828]">
            <h4 className="text-xs font-bold text-white uppercase tracking-[1.4px] mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#1ed760]" />
              <span>Impact Rationale & Audit Trail</span>
            </h4>
            <p className="text-xs text-[#b3b3b3] leading-relaxed">
              {signal.impact_rationale}
            </p>
          </div>

          {/* Evidence Keywords */}
          {signal.event_evidence && signal.event_evidence.length > 0 && (
            <div>
              <span className="text-xs font-bold uppercase tracking-[1.4px] text-white block mb-2">
                Extracted Syntactic Evidence Keywords
              </span>
              <div className="flex flex-wrap gap-1.5">
                {signal.event_evidence.map((ev, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-[11px] font-mono bg-[#181818] text-white border border-[#282828]"
                  >
                    {ev}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Raw JSON Inspector */}
          <div className="border border-[#282828] rounded-[8px] overflow-hidden">
            <button
              type="button"
              onClick={() => setShowRawJson(!showRawJson)}
              className="w-full flex items-center justify-between p-3.5 bg-[#181818] text-xs font-bold text-white hover:bg-[#202020] transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Code className="w-4 h-4 text-[#1ed760]" />
                <span>Structured JSON API Response</span>
              </span>
              <span className="text-[11px] font-mono text-[#b3b3b3]">
                {showRawJson ? 'Hide JSON' : 'Inspect JSON'}
              </span>
            </button>

            {showRawJson && (
              <div className="p-4 bg-[#121212] text-white overflow-x-auto text-xs font-mono">
                <div className="flex justify-end mb-2">
                  <button
                    type="button"
                    onClick={handleCopyJson}
                    className="inline-flex items-center gap-1.5 text-[11px] px-3.5 py-1 rounded-full bg-[#1f1f1f] border border-[#4d4d4d] text-white hover:border-white font-bold cursor-pointer"
                  >
                    {copiedJson ? <Check className="w-3.5 h-3.5 text-[#1ed760]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                </div>
                <pre className="text-[#b3b3b3] leading-relaxed">{JSON.stringify(signal, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#282828] bg-[#181818] flex items-center justify-end gap-2 shrink-0">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
