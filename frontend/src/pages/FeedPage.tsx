import React, { useState, useEffect, useCallback } from 'react';
import { 
  Rss, 
  Search, 
  RefreshCw, 
  MessageSquare, 
  Newspaper, 
  Database,
  Copy, 
  Check, 
  X 
} from 'lucide-react';
import { RiskSignal } from '../types';
import { api } from '../services/api';
import { Button } from '../components/ui/Button';
import { SentimentBadge, ImpactBadge, SourceBadge } from '../components/ui/Badges';
import { SearchInput } from '../components/ui/Inputs';
import { formatTimestamp } from '../utils/formatters';

interface FeedPageProps {
  signals: RiskSignal[];
  loading: boolean;
  onRefreshNews: () => void;
  onRefreshSocial: () => void;
  onSelectSignal: (sig: RiskSignal) => void;
}

export const FeedPage: React.FC<FeedPageProps> = ({
  signals: initialSignals,
  loading: parentLoading,
  onRefreshNews,
  onRefreshSocial,
  onSelectSignal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'financial_news' | 'social_media'>('all');
  const [selectedTicker, setSelectedTicker] = useState('ALL');
  const [selectedSentiment, setSelectedSentiment] = useState('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [feedSignals, setFeedSignals] = useState<RiskSignal[]>(initialSignals || []);
  const [feedLoading, setFeedLoading] = useState(false);
  const [refreshingSocial, setRefreshingSocial] = useState(false);
  const [refreshingNews, setRefreshingNews] = useState(false);
  const [totalCount, setTotalCount] = useState(initialSignals?.length || 0);

  const tickers = ['ALL', 'AAPL', 'MSFT', 'NVDA', 'JPM', 'BAC', 'XOM', 'CVX', 'JNJ', 'PFE', 'AMZN', 'WMT', 'CAT', 'LMT', 'NEE'];
  const sentiments = ['ALL', 'Negative', 'Positive', 'Neutral', 'Mixed'];

  const fetchFeed = useCallback(async () => {
    setFeedLoading(true);
    try {
      const res = await api.getSignals({
        page: 1,
        pageSize: 50,
        sourceType: sourceFilter !== 'all' ? sourceFilter : undefined,
        ticker: selectedTicker !== 'ALL' ? selectedTicker : undefined,
        sentimentLabel: selectedSentiment !== 'ALL' ? selectedSentiment : undefined,
        search: searchTerm.trim() || undefined
      });
      setFeedSignals(res.items);
      setTotalCount(res.total);
    } catch (err) {
      console.error('Failed to fetch feed:', err);
      // Fallback to client filtering of initial signals if offline
      setFeedSignals(
        initialSignals.filter((s) => {
          if (sourceFilter !== 'all' && s.source_type !== sourceFilter) return false;
          if (selectedTicker !== 'ALL' && s.primary_ticker !== selectedTicker) return false;
          if (selectedSentiment !== 'ALL' && s.sentiment_label !== selectedSentiment) return false;
          return true;
        })
      );
    } finally {
      setFeedLoading(false);
    }
  }, [sourceFilter, selectedTicker, selectedSentiment, searchTerm, initialSignals]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const [ingestionNotice, setIngestionNotice] = useState<{
    type: 'success' | 'warning' | 'error' | 'rate_limited';
    title: string;
    message: string;
    details?: {
      source: string;
      fetched: number;
      inserted: number;
      duplicates: number;
      timestamp: string;
    };
  } | null>(null);

  const handleFetchSocialClick = async () => {
    setRefreshingSocial(true);
    setIngestionNotice(null);
    try {
      const res = await api.refreshSocial(15);
      if (res.status === 'rate_limited') {
        setIngestionNotice({
          type: 'rate_limited',
          title: 'Provider Rate Limit Active',
          message: res.message || 'Social feed provider rate limit active.'
        });
      } else if (res.inserted_count > 0) {
        setIngestionNotice({
          type: 'success',
          title: 'Social Discourse Ingested',
          message: `${res.inserted_count} new simulated posts ingested and processed into risk signals.`,
          details: {
            source: res.source,
            fetched: res.fetched_count,
            inserted: res.inserted_count,
            duplicates: res.duplicate_count,
            timestamp: formatTimestamp(res.last_fetch_at)
          }
        });
      } else {
        setIngestionNotice({
          type: 'warning',
          title: 'No New Social Records Inserted',
          message: `All ${res.fetched_count} retrieved posts were skipped as existing duplicates.`,
          details: {
            source: res.source,
            fetched: res.fetched_count,
            inserted: 0,
            duplicates: res.duplicate_count,
            timestamp: formatTimestamp(res.last_fetch_at)
          }
        });
      }
      onRefreshSocial();
      await fetchFeed();
    } catch (err: any) {
      setIngestionNotice({
        type: 'error',
        title: 'Social Ingestion Failed',
        message: err.message || 'An error occurred during social ingestion.'
      });
    } finally {
      setRefreshingSocial(false);
    }
  };

  const handleFetchNewsClick = async () => {
    setRefreshingNews(true);
    setIngestionNotice(null);
    try {
      const res = await api.refreshNews(10);
      if (res.status === 'rate_limited') {
        setIngestionNotice({
          type: 'rate_limited',
          title: 'News Provider Rate Limit Active',
          message: res.message || 'Provider rate limit active. Please retry in a few moments.'
        });
      } else if (res.inserted_count > 0) {
        setIngestionNotice({
          type: 'success',
          title: 'News Ingestion Completed',
          message: `${res.inserted_count} new articles ingested and converted into structured risk signals.`,
          details: {
            source: res.source,
            fetched: res.fetched_count,
            inserted: res.inserted_count,
            duplicates: res.duplicate_count,
            timestamp: formatTimestamp(res.last_fetch_at)
          }
        });
      } else {
        setIngestionNotice({
          type: 'warning',
          title: 'Duplicate Wire Batch',
          message: `Fetched ${res.fetched_count} articles; ${res.duplicate_count} were already present in database.`,
          details: {
            source: res.source,
            fetched: res.fetched_count,
            inserted: 0,
            duplicates: res.duplicate_count,
            timestamp: formatTimestamp(res.last_fetch_at)
          }
        });
      }
      onRefreshNews();
      await fetchFeed();
    } catch (err: any) {
      setIngestionNotice({
        type: 'error',
        title: 'News Ingestion Failed',
        message: err.message || 'An error occurred during financial news ingestion.'
      });
    } finally {
      setRefreshingNews(false);
    }
  };

  const handleCopyProvenance = (sig: RiskSignal) => {
    const prov = `${sig.source_name} [${sig.source_type}] - Ref: ${sig.source_reference || sig.signal_id} (${sig.published_at || sig.processed_at})`;
    navigator.clipboard.writeText(prov);
    setCopiedId(sig.signal_id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#282828]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#1ed760] animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-[1.4px] text-[#1ed760]">
              Intelligence / Raw Feeds
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">News & social intelligence</h1>
          <p className="text-xs sm:text-sm text-[#b3b3b3] mt-1 max-w-2xl leading-relaxed">
            Surveil financial narratives entering the risk engine from verified news wires and synthesized FinTwit market discourse.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleFetchNewsClick}
            disabled={parentLoading || refreshingNews}
            icon={<Newspaper className={`w-3.5 h-3.5 ${refreshingNews ? 'animate-spin' : ''}`} />}
          >
            {refreshingNews ? 'Fetching News...' : 'Fetch News'}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleFetchSocialClick}
            disabled={parentLoading || refreshingSocial}
            icon={<MessageSquare className={`w-3.5 h-3.5 ${refreshingSocial ? 'animate-spin' : ''}`} />}
          >
            {refreshingSocial ? 'Ingesting Social...' : 'Fetch Social'}
          </Button>
        </div>
      </div>

      {/* Ingestion Feedback Alert Banner */}
      {ingestionNotice && (
        <div
          className={`p-4 rounded-[8px] border flex items-start justify-between gap-3 text-xs animate-in fade-in select-none shadow-[0_4px_16px_rgba(0,0,0,0.5)] ${
            ingestionNotice.type === 'success'
              ? 'bg-[#1ed760]/10 border-[#1ed760]/30 text-white'
              : ingestionNotice.type === 'rate_limited' || ingestionNotice.type === 'warning'
              ? 'bg-[#ffa42b]/10 border-[#ffa42b]/30 text-white'
              : 'bg-[#f3727f]/10 border-[#f3727f]/30 text-white'
          }`}
        >
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`font-mono font-bold uppercase tracking-[1.4px] px-2.5 py-0.5 rounded-full text-[10px] ${
                ingestionNotice.type === 'success'
                  ? 'bg-[#1ed760] text-black'
                  : ingestionNotice.type === 'rate_limited' || ingestionNotice.type === 'warning'
                  ? 'bg-[#ffa42b] text-black'
                  : 'bg-[#f3727f] text-white'
              }`}>
                {ingestionNotice.type.toUpperCase()}
              </span>
              <strong className="font-semibold text-white text-xs sm:text-sm">{ingestionNotice.title}</strong>
            </div>
            <p className="text-[#b3b3b3] text-xs leading-relaxed">{ingestionNotice.message}</p>
            {ingestionNotice.details && (
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#7c7c7c] font-mono pt-1">
                <span>Source: <strong className="text-white">{ingestionNotice.details.source}</strong></span>
                <span>•</span>
                <span>Fetched: <strong className="text-white">{ingestionNotice.details.fetched}</strong></span>
                <span>•</span>
                <span>Inserted: <strong className="text-white">{ingestionNotice.details.inserted}</strong></span>
                <span>•</span>
                <span>Duplicates: <strong className="text-white">{ingestionNotice.details.duplicates}</strong></span>
                <span>•</span>
                <span>Time: <strong>{ingestionNotice.details.timestamp}</strong></span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIngestionNotice(null)}
            className="p-1 hover:bg-[#282828] rounded-full transition-colors text-[#7c7c7c] hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Bar with Pill Shapes */}
      <div className="bg-[#181818] rounded-[8px] p-6 border border-[#282828] space-y-4 shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search headline, company text, or ticker..."
            />
          </div>

          {/* Source Filter Pills */}
          <div className="inline-flex items-center p-1 bg-[#121212] rounded-full border border-[#282828] shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setSourceFilter('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[1.4px] transition-all cursor-pointer ${
                sourceFilter === 'all' ? 'bg-[#1ed760] text-black shadow-[0_2px_8px_rgba(30,215,96,0.4)]' : 'text-[#b3b3b3] hover:text-white'
              }`}
            >
              All Sources
            </button>
            <button
              type="button"
              onClick={() => setSourceFilter('financial_news')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[1.4px] transition-all cursor-pointer ${
                sourceFilter === 'financial_news' ? 'bg-[#1ed760] text-black shadow-[0_2px_8px_rgba(30,215,96,0.4)]' : 'text-[#b3b3b3] hover:text-white'
              }`}
            >
              Financial News
            </button>
            <button
              type="button"
              onClick={() => setSourceFilter('social_media')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[1.4px] transition-all cursor-pointer ${
                sourceFilter === 'social_media' ? 'bg-[#1ed760] text-black shadow-[0_2px_8px_rgba(30,215,96,0.4)]' : 'text-[#b3b3b3] hover:text-white'
              }`}
            >
              Social Media
            </button>
          </div>
        </div>

        {/* Tickers Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-[#7c7c7c] font-bold uppercase text-[10px] tracking-[1.4px] shrink-0">Ticker:</span>
          <div className="flex items-center gap-1.5">
            {tickers.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedTicker(t)}
                className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
                  selectedTicker === t
                    ? 'bg-[#1ed760] text-black'
                    : 'bg-[#1f1f1f] text-[#b3b3b3] hover:border-[#4d4d4d] hover:text-white border border-[#282828]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Sentiment Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          <span className="text-[#7c7c7c] font-bold uppercase text-[10px] tracking-[1.4px] shrink-0">Sentiment:</span>
          <div className="flex items-center gap-1.5">
            {sentiments.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSentiment(s)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedSentiment === s
                    ? 'bg-[#1ed760] text-black'
                    : 'bg-[#1f1f1f] text-[#b3b3b3] hover:border-[#4d4d4d] hover:text-white border border-[#282828]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Signal Feed Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-[#7c7c7c] px-1">
          <span>Displaying <strong className="text-white">{feedSignals.length}</strong> {sourceFilter === 'social_media' ? 'social discourse' : sourceFilter === 'financial_news' ? 'news wire' : 'narrative intelligence'} records (Total available: {totalCount})</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#1ed760] inline-block animate-pulse"></span>
            Real-time feed sync active
          </span>
        </div>

        {feedLoading && feedSignals.length === 0 ? (
          <div className="p-16 text-center text-[#b3b3b3] bg-[#181818] rounded-[8px] border border-[#282828] shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
            <RefreshCw className="w-7 h-7 animate-spin mx-auto mb-3 text-[#1ed760]" />
            <p className="text-xs font-medium">Ingesting financial intelligence feed...</p>
          </div>
        ) : feedSignals.length === 0 ? (
          <div className="p-16 text-center text-[#b3b3b3] bg-[#181818] rounded-[8px] border border-[#282828] shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
            <h3 className="text-base font-bold text-white mb-1">No risk signals found</h3>
            <p className="text-xs text-[#b3b3b3] mb-4 max-w-sm mx-auto leading-relaxed">
              Try clearing your filters or click "Fetch Social" / "Fetch News" to ingest fresh signals into the repository.
            </p>
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTicker('ALL');
                  setSelectedSentiment('ALL');
                  setSourceFilter('all');
                }}
              >
                Clear filters
              </Button>
              {sourceFilter === 'social_media' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleFetchSocialClick}
                  icon={<MessageSquare className="w-3.5 h-3.5" />}
                >
                  Fetch Social Posts
                </Button>
              )}
            </div>
          </div>
        ) : (
          feedSignals.map((signal) => (
            <div
              key={signal.signal_id}
              className="bg-[#181818] rounded-[8px] p-6 border border-[#282828] hover:bg-[#202020] hover:border-[#383838] transition-all space-y-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
            >
              {/* Top Meta Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#282828] text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <SourceBadge sourceType={signal.source_type} isSynthetic={signal.is_synthetic} />
                  <span className="font-semibold text-white">{signal.source_name}</span>
                  <span className="text-[#4d4d4d]">•</span>
                  <span className="text-[#7c7c7c] tabular-nums font-mono text-[11px]">
                    {formatTimestamp(signal.published_at || signal.processed_at)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <SentimentBadge score={signal.sentiment_score} label={signal.sentiment_label} />
                  <ImpactBadge score={signal.impact_score} level={signal.impact_level} />
                </div>
              </div>

              {/* Headline & Body Context */}
              <div>
                <h3 className="text-base font-bold tracking-tight text-white leading-snug">
                  {signal.headline}
                </h3>
                <p className="text-xs text-[#b3b3b3] leading-relaxed mt-2.5 p-3.5 bg-[#1f1f1f] rounded-[6px] border border-[#282828] font-normal">
                  {signal.text}
                </p>
              </div>

              {/* Bottom Entity & Action Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-xs bg-[#1f1f1f] px-2.5 py-0.5 rounded-full text-[#1ed760] border border-[#282828]">
                    {signal.primary_ticker || 'MACRO'}
                  </span>
                  <span className="text-[#b3b3b3] font-medium truncate max-w-xs">
                    {signal.primary_company || 'Cross-Market Stance'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#1f1f1f] text-[#cbcbcb] border border-[#282828]">
                    {signal.event_type}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopyProvenance(signal)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-[1.4px] text-white bg-[#1f1f1f] hover:border-[#1ed760] hover:text-[#1ed760] border border-[#282828] transition-colors cursor-pointer"
                    title="Copy Source Provenance"
                  >
                    {copiedId === signal.signal_id ? <Check className="w-3.5 h-3.5 text-[#1ed760]" /> : <Copy className="w-3.5 h-3.5 text-[#7c7c7c]" />}
                    <span>{copiedId === signal.signal_id ? 'Copied' : 'Provenance'}</span>
                  </button>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onSelectSignal(signal)}
                  >
                    View analysis
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
