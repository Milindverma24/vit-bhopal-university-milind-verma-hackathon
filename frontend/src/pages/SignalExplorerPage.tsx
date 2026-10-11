import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw,
  Download,
  X
} from 'lucide-react';
import { api } from '../services/api';
import { RiskSignal } from '../types';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SentimentBadge, ImpactBadge, SourceBadge } from '../components/ui/Badges';
import { SearchInput, SelectInput } from '../components/ui/Inputs';
import { formatTimestamp } from '../utils/formatters';

interface SignalExplorerPageProps {
  onSelectSignal: (sig: RiskSignal) => void;
}

export const SignalExplorerPage: React.FC<SignalExplorerPageProps> = ({ onSelectSignal }) => {
  const [signals, setSignals] = useState<RiskSignal[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [ticker, setTicker] = useState('');
  const [sourceType, setSourceType] = useState('');
  const [eventType, setEventType] = useState('');
  const [sentimentLabel, setSentimentLabel] = useState('');
  const [minImpact, setMinImpact] = useState<number | undefined>(undefined);

  const fetchSignals = async () => {
    setLoading(true);
    try {
      const res = await api.getSignals({
        page,
        pageSize,
        search: search.trim() || undefined,
        ticker: ticker || undefined,
        sourceType: sourceType || undefined,
        eventType: eventType || undefined,
        sentimentLabel: sentimentLabel || undefined,
        minImpact: minImpact || undefined
      });
      setSignals(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Failed to fetch signals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignals();
  }, [page, pageSize, ticker, sourceType, eventType, sentimentLabel, minImpact]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchSignals();
  };

  const handleClearFilters = () => {
    setSearch('');
    setTicker('');
    setSourceType('');
    setEventType('');
    setSentimentLabel('');
    setMinImpact(undefined);
    setPage(1);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(signals, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `riskpulse_signals_page_${page}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const tickersList = [
    { label: 'All Tickers', value: '' },
    { label: 'AAPL - Apple Inc.', value: 'AAPL' },
    { label: 'MSFT - Microsoft Corp.', value: 'MSFT' },
    { label: 'NVDA - NVIDIA Corp.', value: 'NVDA' },
    { label: 'JPM - JPMorgan Chase', value: 'JPM' },
    { label: 'BAC - Bank of America', value: 'BAC' },
    { label: 'XOM - Exxon Mobil', value: 'XOM' },
    { label: 'CVX - Chevron Corp.', value: 'CVX' },
    { label: 'JNJ - Johnson & Johnson', value: 'JNJ' },
    { label: 'PFE - Pfizer Inc.', value: 'PFE' },
    { label: 'AMZN - Amazon.com', value: 'AMZN' },
    { label: 'WMT - Walmart Inc.', value: 'WMT' },
    { label: 'CAT - Caterpillar Inc.', value: 'CAT' },
    { label: 'LMT - Lockheed Martin', value: 'LMT' },
    { label: 'NEE - NextEra Energy', value: 'NEE' }
  ];

  const eventTypesList = [
    { label: 'All Event Categories', value: '' },
    { label: 'Corporate Earnings', value: 'Corporate Earnings' },
    { label: 'Regulatory Action', value: 'Regulatory Action' },
    { label: 'Cybersecurity Incident', value: 'Cybersecurity Incident' },
    { label: 'Credit Event', value: 'Credit Event' },
    { label: 'Interest Rate Change', value: 'Interest Rate Change' },
    { label: 'Monetary Policy', value: 'Monetary Policy' },
    { label: 'Inflation', value: 'Inflation' },
    { label: 'Geopolitical Event', value: 'Geopolitical Event' },
    { label: 'Supply Chain Disruption', value: 'Supply Chain Disruption' },
    { label: 'Default or Bankruptcy', value: 'Default or Bankruptcy' },
    { label: 'Fraud or Investigation', value: 'Fraud or Investigation' },
    { label: 'Positive Business Development', value: 'Positive Business Development' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 12.1 Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#d9d9d9]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#767676]">
              Intelligence / Repository
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Risk signal explorer</h1>
          <p className="text-sm text-[#5e5e5e] mt-1 max-w-2xl">
            Search, filter, and investigate generated financial risk signals persisted across continuous data ingestion runs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportJSON}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export JSON
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={fetchSignals}
            loading={loading}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* 12.2 Filter Bar */}
      <div className="bg-white rounded-2xl p-5 border border-[#d9d9d9] space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search headline, text context, or extracted keywords..."
            />
          </div>
          <Button type="submit" variant="primary" size="sm">
            Search
          </Button>
          <Button type="button" variant="subtle" size="sm" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-[#f3f3f3]">
          <SelectInput
            label="Ticker universe"
            value={ticker}
            onChange={(e) => {
              setTicker(e.target.value);
              setPage(1);
            }}
            options={tickersList}
          />

          <SelectInput
            label="Event classification"
            value={eventType}
            onChange={(e) => {
              setEventType(e.target.value);
              setPage(1);
            }}
            options={eventTypesList}
          />

          <SelectInput
            label="Sentiment label"
            value={sentimentLabel}
            onChange={(e) => {
              setSentimentLabel(e.target.value);
              setPage(1);
            }}
            options={[
              { label: 'All Sentiments', value: '' },
              { label: 'Negative Only', value: 'Negative' },
              { label: 'Positive Only', value: 'Positive' },
              { label: 'Neutral Only', value: 'Neutral' },
              { label: 'Mixed Only', value: 'Mixed' }
            ]}
          />

          <SelectInput
            label="Min impact threshold"
            value={minImpact !== undefined ? String(minImpact) : ''}
            onChange={(e) => {
              setMinImpact(e.target.value ? Number(e.target.value) : undefined);
              setPage(1);
            }}
            options={[
              { label: 'Any Impact (1-10)', value: '' },
              { label: 'Moderate & Above (>= 5)', value: '5' },
              { label: 'High & Above (>= 7)', value: '7' },
              { label: 'Critical Only (>= 9)', value: '9' }
            ]}
          />
        </div>
      </div>

      {/* 12.3 Data Table */}
      <Card>
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#d9d9d9]">
          <div>
            <h3 className="text-base font-bold text-black tracking-tight">Structured risk signals repository</h3>
            <p className="text-xs text-[#5e5e5e] mt-0.5">
              Showing {signals.length} of {total} verified signals
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#767676]">Page size:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="bg-[#efefef] rounded-lg px-2.5 py-1 text-xs border border-[#d9d9d9] font-medium"
            >
              <option value="15">15</option>
              <option value="30">30</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#efefef] border-b border-[#d9d9d9] text-[#5e5e5e] font-semibold">
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-4">Headline</th>
                <th className="py-3 px-3">Company</th>
                <th className="py-3 px-2">Ticker</th>
                <th className="py-3 px-3 text-center">Sentiment</th>
                <th className="py-3 px-3">Event Type</th>
                <th className="py-3 px-2 text-center">Impact</th>
                <th className="py-3 px-3">Source</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d9d9d9]">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#767676]">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-black" />
                    Querying signal repository...
                  </td>
                </tr>
              ) : signals.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#767676]">
                    No signals matching the selected criteria.
                  </td>
                </tr>
              ) : (
                signals.map((sig) => (
                  <tr
                    key={sig.signal_id}
                    onClick={() => onSelectSignal(sig)}
                    className="hover:bg-[#f3f3f3] cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3 font-mono text-[#767676] whitespace-nowrap tabular-nums">
                      {formatTimestamp(sig.published_at || sig.processed_at)}
                    </td>
                    <td className="py-3 px-4 font-medium text-black max-w-xs">
                      <p className="line-clamp-2">{sig.headline}</p>
                    </td>
                    <td className="py-3 px-3 text-[#5e5e5e] font-medium truncate max-w-[120px]">
                      {sig.primary_company || 'Macro / Market'}
                    </td>
                    <td className="py-3 px-2 font-mono font-bold text-black">
                      {sig.primary_ticker || '—'}
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <SentimentBadge score={sig.sentiment_score} label={sig.sentiment_label} />
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#efefef] text-[#5e5e5e] border border-[#d9d9d9]">
                        {sig.event_type}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center whitespace-nowrap">
                      <ImpactBadge score={sig.impact_score} level={sig.impact_level} />
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <SourceBadge sourceType={sig.source_type} isSynthetic={sig.is_synthetic} />
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => onSelectSignal(sig)}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-black text-white hover:bg-[#282828] transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 12.6 Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 mt-4 border-t border-[#d9d9d9] text-xs">
          <span className="text-[#767676]">
            Page <strong>{page}</strong> of <strong>{totalPages || 1}</strong> ({total} total records)
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              icon={<ChevronLeft className="w-3.5 h-3.5" />}
            >
              Previous
            </Button>

            <Button
              variant="secondary"
              size="sm"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              icon={<ChevronRight className="w-3.5 h-3.5" />}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
