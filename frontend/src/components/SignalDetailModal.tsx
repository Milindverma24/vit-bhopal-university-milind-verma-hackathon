import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  Cpu, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink,
  Code,
  FileText
} from 'lucide-react';
import { RiskSignal } from '../types';
import { SentimentBadge, ImpactBadge, SourceBadge } from './ui/Badges';
import { Button } from './ui/Button';
import { formatTimestamp, formatSentiment } from '../utils/formatters';

interface SignalDetailModalProps {
  signal: RiskSignal | null;
  onClose: () => void;
}

export const SignalDetailModal: React.FC<SignalDetailModalProps> = ({ signal, onClose }) => {
  const [copiedJson, setCopiedJson] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);

  if (!signal) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(signal, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.16)] border border-[#d9d9d9] max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#d9d9d9] bg-[#f3f3f3] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold uppercase text-black">
                  {signal.signal_id}
                </span>
                <SourceBadge sourceType={signal.source_type} isSynthetic={signal.is_synthetic} />
              </div>
              <p className="text-xs text-[#5e5e5e] font-medium mt-0.5">
                {signal.source_name} • {formatTimestamp(signal.published_at || signal.processed_at)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-[#767676] hover:text-black p-1.5 rounded-full hover:bg-[#e2e2e2] transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Headline & Full Text */}
          <div>
            <h2 className="text-xl font-bold tracking-tight text-black leading-snug">
              {signal.headline}
            </h2>
            <div className="mt-3 p-4 bg-[#efefef] rounded-lg border border-[#d9d9d9] text-xs text-black leading-relaxed">
              {signal.text}
            </div>
          </div>

          {/* Metric Badges Grid (Monochrome) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Sentiment */}
            <div className="p-3.5 rounded-xl border border-[#d9d9d9] bg-white flex flex-col justify-between">
              <span className="text-[11px] font-medium text-[#767676] uppercase tracking-wider block">
                Sentiment
              </span>
              <div className="my-1.5">
                <SentimentBadge score={signal.sentiment_score} label={signal.sentiment_label} />
              </div>
              <span className="text-[10px] text-[#767676]">
                Method: {signal.sentiment_method}
              </span>
            </div>

            {/* Event Category */}
            <div className="p-3.5 rounded-xl border border-[#d9d9d9] bg-white flex flex-col justify-between">
              <span className="text-[11px] font-medium text-[#767676] uppercase tracking-wider block">
                Event Type
              </span>
              <div className="my-1.5">
                <span className="font-bold text-xs text-black block truncate" title={signal.event_type}>
                  {signal.event_type}
                </span>
              </div>
              <span className="text-[10px] text-[#767676] tabular-nums">
                {Math.round(signal.event_confidence * 100)}% match conf
              </span>
            </div>

            {/* Impact */}
            <div className="p-3.5 rounded-xl border border-[#d9d9d9] bg-white flex flex-col justify-between">
              <span className="text-[11px] font-medium text-[#767676] uppercase tracking-wider block">
                Market Impact
              </span>
              <div className="my-1.5">
                <ImpactBadge score={signal.impact_score} level={signal.impact_level} />
              </div>
              <span className="text-[10px] text-[#767676]">
                {signal.impact_method}
              </span>
            </div>

            {/* Primary Entity */}
            <div className="p-3.5 rounded-xl border border-[#d9d9d9] bg-white flex flex-col justify-between">
              <span className="text-[11px] font-medium text-[#767676] uppercase tracking-wider block">
                Primary Entity
              </span>
              <div className="my-1.5 font-bold font-mono text-sm text-black">
                {signal.primary_ticker || 'Macro / Market'}
              </div>
              <span className="text-[10px] text-[#767676] truncate">
                {signal.primary_company || 'Cross-Sector Impact'}
              </span>
            </div>
          </div>

          {/* Explainable Rationale */}
          <div className="bg-[#f3f3f3] rounded-xl p-4 border border-[#d9d9d9]">
            <h4 className="text-xs font-bold text-black uppercase tracking-wider mb-1.5">
              Impact Rationale & Audit Trail
            </h4>
            <p className="text-xs text-[#5e5e5e] leading-relaxed">
              {signal.impact_rationale}
            </p>
          </div>

          {/* Evidence Keywords */}
          {signal.event_evidence && signal.event_evidence.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-black block mb-2">
                Syntactic Evidence Keywords Extracted
              </span>
              <div className="flex flex-wrap gap-1.5">
                {signal.event_evidence.map((ev, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-[#efefef] text-black border border-[#d9d9d9]"
                  >
                    {ev}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Raw JSON Inspector */}
          <div className="border border-[#d9d9d9] rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowRawJson(!showRawJson)}
              className="w-full flex items-center justify-between p-3 bg-[#efefef] text-xs font-semibold text-black hover:bg-[#e2e2e2] transition-colors"
            >
              <span className="flex items-center gap-2">
                <Code className="w-3.5 h-3.5" />
                <span>Structured JSON Output</span>
              </span>
              <span className="text-[11px] text-[#767676]">
                {showRawJson ? 'Hide JSON' : 'Inspect JSON'}
              </span>
            </button>

            {showRawJson && (
              <div className="p-3 bg-[#282828] text-white overflow-x-auto text-xs font-mono">
                <div className="flex justify-end mb-2">
                  <button
                    type="button"
                    onClick={handleCopyJson}
                    className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-white text-black hover:bg-[#efefef]"
                  >
                    {copiedJson ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                </div>
                <pre>{JSON.stringify(signal, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#d9d9d9] bg-[#f3f3f3] flex items-center justify-end gap-2 shrink-0">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
