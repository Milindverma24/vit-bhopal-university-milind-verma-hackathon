import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Cpu, 
  Send, 
  Code,
  Copy, 
  Check, 
  Download, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { api } from '../services/api';
import { RiskSignal } from '../types';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TextInput, TextArea, SelectInput } from '../components/ui/Inputs';
import { SentimentBadge, ImpactBadge, SourceBadge } from '../components/ui/Badges';
import { formatSentiment, formatTimestamp } from '../utils/formatters';

interface NLPEnginePageProps {
  onSignalCreated: (sig: RiskSignal) => void;
}

const PRESET_EXAMPLES = [
  {
    title: 'NVIDIA AI Revenue Beat',
    ticker: 'NVDA',
    headline: 'NVIDIA Surpasses Q3 Revenue Forecasts on Surging Enterprise AI Demand',
    text: 'NVIDIA Corporation delivered robust quarterly results this morning, outpacing consensus Wall Street expectations. Diluted EPS reached record highs as revenue expanded 18% year-over-year. Management cited durable enterprise adoption and raised forward guidance by $1.5 billion.',
    source: 'financial_news'
  },
  {
    title: 'JPMorgan Regulatory Probe',
    ticker: 'JPM',
    headline: 'SEC and DOJ Launch Joint Probe into Wholesale Trading Practices',
    text: 'Federal prosecutors and the Securities and Exchange Commission issued formal subpoenas to JPMorgan Chase regarding compliance and trade surveillance. The audit committee confirmed an independent special inquiry, sparking elevated market volatility.',
    source: 'financial_news'
  },
  {
    title: 'Apple Cyber Incident',
    ticker: 'AAPL',
    headline: 'Apple Discloses Critical Security Intrusion and Unauthorized Access',
    text: 'Apple Inc. filed an 8-K disclosure acknowledging a sophisticated ransomware and security breach that compromised internal developer portals. Management halted affected service clusters and retained third-party forensic cybersecurity investigators.',
    source: 'financial_news'
  },
  {
    title: 'Central Bank Emergency Rate Hike',
    ticker: '',
    headline: 'Central Bank Unexpectedly Hikes Policy Rate by 50 Basis Points to Curb Sticky Inflation',
    text: 'In an emergency inter-meeting adjustment, monetary authorities raised the policy interest rate by 50 basis points. Yield curves steepened sharply as commercial banks recalibrated prime lending rates, increasing corporate borrowing costs across the economy.',
    source: 'financial_news'
  },
  {
    title: 'Social Churn: Credit Downgrade',
    ticker: 'BAC',
    headline: 'FinTwit Bearish Churn: Credit Downgrade Rumors at Bank of America',
    text: '$BAC is tumbling in aftermarket trading amid rumors of commercial real estate credit downgrades and elevated non-performing loan reserves. Portfolio managers are cutting exposure rapidly.',
    source: 'social_media'
  }
];

const SAMPLE_API_SCHEMA = {
  signal_id: "SIG-83c14acc-8fbe-48d3-a060-bfc360e5aef7",
  source_type: "financial_news",
  source_name: "Interactive Financial News Wire",
  headline: "NVIDIA Corporation delivered robust quarterly results this morning, outpacing consensus...",
  text: "NVIDIA Corporation delivered robust quarterly results this morning...",
  primary_ticker: "NVDA",
  primary_company: "NVIDIA Corporation",
  sentiment_score: 0.56,
  sentiment_label: "Positive",
  sentiment_method: "Financial Lexicon-Syntactic Engine",
  sentiment_confidence: 0.71,
  event_type: "Corporate Earnings",
  event_confidence: 0.81,
  event_evidence: ["quarterly results", "record highs", "revenue expanded"],
  impact_score: 6,
  impact_level: "Moderate",
  impact_rationale: "Event category 'Corporate Earnings' establishes baseline severity of 5.0/10. Positive sentiment (+0.56) compounds valuation impact.",
  impact_method: "Multi-Factor Severity Matrix v1.0",
  risk_direction: "Positive",
  is_synthetic: true,
  data_source_label: "Synthetic Demonstration Signal"
};

export const NLPEnginePage: React.FC<NLPEnginePageProps> = ({ onSignalCreated }) => {
  const [headline, setHeadline] = useState('');
  const [text, setText] = useState('');
  const [ticker, setTicker] = useState('');
  const [sourceType, setSourceType] = useState('financial_news');
  const [analysisMethod, setAnalysisMethod] = useState('automatic');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<RiskSignal | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedJson, setCopiedJson] = useState(false);
  const [activeResultTab, setActiveResultTab] = useState<'visual' | 'json'>('visual');
  const [isJsonExpanded, setIsJsonExpanded] = useState(true);

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim()) {
      setError('Please provide text content to analyze.');
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      const sig = await api.analyzeText({
        text: text.trim(),
        headline: headline.trim() || undefined,
        source_type: sourceType,
        ticker: ticker.trim() || undefined,
        source_name: sourceType === 'financial_news' ? 'Interactive Financial News Wire' : 'Interactive Social Stream'
      });
      setResult(sig);
      onSignalCreated(sig);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze text.');
    } finally {
      setAnalyzing(false);
    }
  };

  const loadPreset = (preset: typeof PRESET_EXAMPLES[0]) => {
    setHeadline(preset.headline);
    setText(preset.text);
    setTicker(preset.ticker);
    setSourceType(preset.source);
    setResult(null);
    setError(null);
  };

  const handleCopyJson = () => {
    const dataToCopy = result || SAMPLE_API_SCHEMA;
    navigator.clipboard.writeText(JSON.stringify(dataToCopy, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadJson = () => {
    const dataToDownload = result || SAMPLE_API_SCHEMA;
    const blob = new Blob([JSON.stringify(dataToDownload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `risk-signal-${result?.signal_id || 'schema'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Calculate sentiment needle position percentage (-1 to +1 -> 0% to 100%)
  const sentimentScore = result ? result.sentiment_score : 0;
  const sentimentGaugePercent = ((sentimentScore + 1) / 2) * 100;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-6 border-b border-[#282828]">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2 h-2 rounded-full bg-[#1ed760] animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-[1.4px] text-[#1ed760]">
            NLP Risk Engine / Interactive Analysis
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Analyze financial intelligence</h1>
        <p className="text-xs sm:text-sm text-[#b3b3b3] mt-1 max-w-2xl leading-relaxed">
          Transform unstructured financial text into structured risk signals via dual-tier sentiment parsing, event taxonomy matching, and calibrated impact severity scoring.
        </p>
      </div>

      {/* Preset Scenario Pills */}
      <div className="bg-[#181818] rounded-[8px] p-6 border border-[#282828] space-y-3 shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[1.4px] text-[#7c7c7c]">
          <span>Verified Scenario Benchmarks</span>
          <span className="text-[11px] font-mono font-normal lowercase text-[#7c7c7c]">single-click testing</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_EXAMPLES.map((p) => (
            <button
              key={p.title}
              type="button"
              onClick={() => loadPreset(p)}
              className="px-4 py-2 rounded-full text-xs font-bold bg-[#1f1f1f] text-[#b3b3b3] hover:bg-[#1ed760] hover:text-black border border-[#282828] transition-all select-none cursor-pointer"
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader
              title="Input text & configuration"
              description="Provide unstructured news articles, social posts, or press releases."
            />
            <form onSubmit={handleAnalyze} className="space-y-4">
              <TextInput
                label="Headline (optional)"
                placeholder="e.g. NVIDIA Announces Enterprise Blackwell Shipments"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
              />

              <TextArea
                label="Article or post content"
                placeholder="Paste financial news excerpt, earning statement, regulatory filing, or market social post..."
                rows={6}
                value={text}
                onChange={(e) => setText(e.target.value)}
                error={error || undefined}
                helperText="Enforces maximum 4,000 characters for token context window."
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <SelectInput
                  label="Source type"
                  value={sourceType}
                  onChange={(e) => setSourceType(e.target.value)}
                  options={[
                    { label: 'Financial News', value: 'financial_news' },
                    { label: 'Social Media', value: 'social_media' },
                    { label: 'Manual Input', value: 'manual_input' },
                    { label: 'Synthetic Demo', value: 'synthetic_demo' }
                  ]}
                />

                <TextInput
                  label="Target ticker"
                  placeholder="e.g. NVDA, JPM"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.toUpperCase())}
                />
              </div>

              <SelectInput
                label="Analysis method"
                value={analysisMethod}
                onChange={(e) => setAnalysisMethod(e.target.value)}
                options={[
                  { label: 'Automatic (FinBERT + Lexicon Fallback)', value: 'automatic' },
                  { label: 'Financial Lexicon-Syntactic Engine (Zero-Key)', value: 'lexicon' },
                  { label: 'FinBERT HuggingFace Pipeline', value: 'finbert' }
                ]}
                helperText="Zero-key fallback active if GPU or remote model tokens unavailable."
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full"
                  loading={analyzing}
                  icon={<Send className="w-4 h-4" />}
                >
                  {analyzing ? 'Analyzing text...' : 'Analyze Text'}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Column: Analysis Results & Explainability (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Switcher: Visual Analytics vs Structured JSON API */}
          <div className="flex items-center justify-between p-1 bg-[#121212] rounded-full border border-[#282828]">
            <button
              type="button"
              onClick={() => setActiveResultTab('visual')}
              className={`flex-1 py-2 px-4 rounded-full text-xs font-bold uppercase tracking-[1.4px] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeResultTab === 'visual'
                  ? 'bg-[#1ed760] text-black shadow-[0_2px_8px_rgba(30,215,96,0.4)]'
                  : 'text-[#b3b3b3] hover:text-white'
              }`}
            >
              <span>Visual Dossier</span>
              {result && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                  activeResultTab === 'visual' ? 'bg-black text-[#1ed760]' : 'bg-[#1f1f1f] text-white'
                }`}>
                  {result.primary_ticker || 'NVDA'}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveResultTab('json')}
              className={`flex-1 py-2 px-4 rounded-full text-xs font-bold uppercase tracking-[1.4px] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeResultTab === 'json'
                  ? 'bg-[#1ed760] text-black shadow-[0_2px_8px_rgba(30,215,96,0.4)]'
                  : 'text-[#b3b3b3] hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Structured JSON API response</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                activeResultTab === 'json'
                  ? 'bg-black text-[#1ed760]'
                  : result
                  ? 'bg-[#1ed760]/20 text-[#1ed760]'
                  : 'bg-[#1f1f1f] text-[#7c7c7c]'
              }`}>
                {result ? '200 OK' : 'API Schema'}
              </span>
            </button>
          </div>

          {analyzing ? (
            <Card className="min-h-[420px] flex items-center justify-center text-center">
              <div className="space-y-3">
                <Cpu className="w-8 h-8 text-[#1ed760] animate-spin mx-auto" />
                <h3 className="text-sm font-bold text-white">Executing NLP inference pipeline...</h3>
                <p className="text-xs text-[#b3b3b3] max-w-sm leading-relaxed">
                  Extracting entities, parsing financial polarity, matching rule-based event taxonomies, and calibrating market impact.
                </p>
              </div>
            </Card>
          ) : activeResultTab === 'json' ? (
            /* Dedicated Structured JSON API response View */
            <Card>
              <div className="flex items-center justify-between pb-4 border-b border-[#282828]">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-full bg-[#1f1f1f] text-[#1ed760]">
                    <Code className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Structured JSON Output</h4>
                    <p className="text-[11px] text-[#7c7c7c] font-mono mt-0.5">
                      {result 
                        ? `POST /api/analyze • Signal ID: ${result.signal_id}` 
                        : 'POST /api/analyze • Schema Specification'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold ${
                    result ? 'bg-[#1ed760]/15 text-[#1ed760] border border-[#1ed760]/30' : 'bg-[#1f1f1f] text-[#b3b3b3] border border-[#282828]'
                  }`}>
                    {result ? 'HTTP 200 OK' : 'Schema'}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyJson}
                    className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-[1.4px] bg-[#1f1f1f] text-white hover:border-[#1ed760] hover:text-[#1ed760] border border-[#282828] transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    {copiedJson ? <Check className="w-3 h-3 text-[#1ed760]" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedJson ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadJson}
                    className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-[1.4px] bg-[#1f1f1f] text-white hover:border-[#1ed760] hover:text-[#1ed760] border border-[#282828] transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              <div className="mt-4 p-4 bg-[#121212] text-gray-200 rounded-[8px] overflow-x-auto text-xs font-mono max-h-[580px] border border-[#282828] leading-relaxed">
                <pre>{JSON.stringify(result || SAMPLE_API_SCHEMA, null, 2)}</pre>
              </div>
              {!result && (
                <p className="text-[11px] text-[#7c7c7c] mt-2.5 italic text-center">
                  * Showing API response contract. Click "Analyze Text" on the left to populate with live inference results.
                </p>
              )}
            </Card>
          ) : result ? (
            <div className="space-y-6">
              {/* Sentiment & Impact Summary Card */}
              <Card>
                <CardHeader
                  title="Analysis results summary"
                  description={`Signal ID: ${result.signal_id} • Processed at ${formatTimestamp(result.processed_at)}`}
                  action={<SourceBadge sourceType={result.source_type} isSynthetic={result.is_synthetic} />}
                />

                {/* Sentiment Gauge & Impact Metric */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-[#1f1f1f] rounded-[8px] border border-[#282828]">
                  {/* Sentiment Metric */}
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-[1.4px] text-[#7c7c7c] block mb-1">
                      Sentiment polarity
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-3xl font-bold font-mono tracking-tight tabular-nums ${
                        result.sentiment_score >= 0 ? 'text-[#1ed760]' : 'text-[#f3727f]'
                      }`}>
                        {formatSentiment(result.sentiment_score)}
                      </span>
                      <SentimentBadge score={result.sentiment_score} label={result.sentiment_label} showScore={false} />
                    </div>
                    <div className="text-[11px] text-[#b3b3b3] mt-1">
                      Confidence: <strong>{Math.round(result.sentiment_confidence * 100)}%</strong> • Method: <strong>{result.sentiment_method}</strong>
                    </div>

                    {/* Visual Horizontal Scale Gauge (-1.0 to +1.0) */}
                    <div className="mt-3.5">
                      <div className="h-2 w-full bg-[#121212] rounded-full relative overflow-hidden">
                        <div
                          className={`absolute top-0 bottom-0 rounded-full transition-all duration-300 ${
                            result.sentiment_score > 0 ? 'bg-[#1ed760]' : result.sentiment_score < 0 ? 'bg-[#f3727f]' : 'bg-[#7c7c7c]'
                          }`}
                          style={{
                            left: `${Math.min(sentimentGaugePercent, 50)}%`,
                            width: `${Math.abs(sentimentGaugePercent - 50)}%`
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-[#7c7c7c] mt-1 font-mono">
                        <span>-1.0 (Critical Neg)</span>
                        <span>0.0 (Neutral)</span>
                        <span>+1.0 (Positive)</span>
                      </div>
                    </div>
                  </div>

                  {/* Impact Metric */}
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-[1.4px] text-[#7c7c7c] block mb-1">
                      Market impact severity
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold font-mono tracking-tight text-white tabular-nums">
                        {result.impact_score}/10
                      </span>
                      <ImpactBadge score={result.impact_score} level={result.impact_level} />
                    </div>
                    <div className="text-[11px] text-[#b3b3b3] mt-1">
                      Severity: <strong>{result.impact_level} potential impact</strong>
                    </div>
                    <p className="text-xs text-[#cbcbcb] mt-2 leading-relaxed">
                      {result.impact_rationale}
                    </p>
                  </div>
                </div>

                {/* Event Classification */}
                <div className="mt-4 p-4 border border-[#282828] rounded-[8px] bg-[#1f1f1f] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-[1.4px] text-[#7c7c7c] font-bold">
                        Event Category
                      </span>
                      <h4 className="text-base font-bold text-white mt-0.5">
                        {result.event_type}
                      </h4>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#181818] text-[#1ed760] border border-[#282828]">
                      {Math.round(result.event_confidence * 100)}% match confidence
                    </span>
                  </div>

                  {/* Evidence Keywords */}
                  {result.event_evidence && result.event_evidence.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-[#7c7c7c] block mb-1.5">
                        Supporting Syntactic Evidence:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {result.event_evidence.map((ev, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#181818] text-white border border-[#282828]"
                          >
                            {ev}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Explainable Intelligence Panel */}
              <div className="bg-[#181818] rounded-[8px] p-6 border border-[#282828] space-y-4 shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
                <h3 className="text-sm font-bold uppercase tracking-[1.4px] text-[#1ed760]">
                  Explainable Risk Intelligence Breakdown
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-[#1f1f1f] rounded-[8px] border border-[#282828]">
                    <span className="font-bold text-white block mb-1">What was detected?</span>
                    <p className="text-[#b3b3b3] leading-relaxed">
                      Identified a <strong className="text-white">{result.event_type}</strong> classification with narrative sentiment scored at <strong className="text-[#1ed760]">{formatSentiment(result.sentiment_score)}</strong>.
                    </p>
                  </div>

                  <div className="p-4 bg-[#1f1f1f] rounded-[8px] border border-[#282828]">
                    <span className="font-bold text-white block mb-1">Why does it matter?</span>
                    <p className="text-[#b3b3b3] leading-relaxed">
                      Assigned market impact severity of <strong className="text-white">{result.impact_score}/10 ({result.impact_level})</strong> which influences tactical index allocation penalties.
                    </p>
                  </div>

                  <div className="p-4 bg-[#1f1f1f] rounded-[8px] border border-[#282828]">
                    <span className="font-bold text-white block mb-1">Which entity is affected?</span>
                    <p className="text-[#b3b3b3] leading-relaxed">
                      Primary exposure mapped to <strong className="text-[#1ed760]">{result.primary_ticker || 'Macro / Market'}</strong> ({result.primary_company || 'Cross-Sector Market'}).
                    </p>
                  </div>

                  <div className="p-4 bg-[#1f1f1f] rounded-[8px] border border-[#282828]">
                    <span className="font-bold text-white block mb-1">Model limitations & caveats</span>
                    <p className="text-[#b3b3b3] leading-relaxed">
                      Calculated from headline and excerpt context. Textual sentiment estimates do not guarantee immediate stock price or dividend changes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Collapsible Structured JSON Viewer */}
              <Card>
                <div className="flex items-center justify-between pb-3 border-b border-[#282828]">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-[#1ed760]" />
                    <h4 className="text-sm font-bold text-white">Structured JSON Output</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1ed760]/15 text-[#1ed760] border border-[#1ed760]/30 font-bold">
                      HTTP 200 OK
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsJsonExpanded(!isJsonExpanded)}
                      className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-[1.4px] bg-[#1f1f1f] text-white hover:border-[#1ed760] border border-[#282828] transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      {isJsonExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      <span>{isJsonExpanded ? 'Collapse' : 'Expand'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyJson}
                      className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-[1.4px] bg-[#1f1f1f] text-white hover:border-[#1ed760] border border-[#282828] transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      {copiedJson ? <Check className="w-3 h-3 text-[#1ed760]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedJson ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadJson}
                      className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-[1.4px] bg-[#1f1f1f] text-white hover:border-[#1ed760] border border-[#282828] transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>

                {isJsonExpanded && (
                  <div className="mt-3 p-4 bg-[#121212] text-gray-200 rounded-[8px] overflow-x-auto text-xs font-mono max-h-72 border border-[#282828]">
                    <pre className="text-gray-300 leading-relaxed">{JSON.stringify(result, null, 2)}</pre>
                  </div>
                )}
              </Card>
            </div>
          ) : (
            <Card className="min-h-[420px] flex items-center justify-center text-center">
              <div className="max-w-md space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#1f1f1f] text-[#1ed760] flex items-center justify-center mx-auto border border-[#282828]">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">Ready for text analysis</h3>
                <p className="text-xs text-[#b3b3b3] leading-relaxed">
                  Submit financial news or social media text on the left, or select one of the pre-loaded scenarios above to evaluate the live risk pipeline.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
