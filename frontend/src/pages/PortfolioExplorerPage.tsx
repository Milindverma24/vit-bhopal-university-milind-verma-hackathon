import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  X
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { api } from '../services/api';
import { Holding, PortfolioSummary } from '../types';
import { Card, CardHeader, MetricCard } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SearchInput, SelectInput } from '../components/ui/Inputs';
import { formatCurrency } from '../utils/formatters';

export const PortfolioExplorerPage: React.FC = () => {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedHolding, setSelectedHolding] = useState<Holding | null>(null);

  // Filters
  const [assetType, setAssetType] = useState('');
  const [sector, setSector] = useState('');
  const [country, setCountry] = useState('');
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sum, hList] = await Promise.all([
        api.getPortfolio(),
        api.getHoldings({
          asset_type: assetType || undefined,
          sector: sector || undefined,
          country: country || undefined
        })
      ]);
      setSummary(sum);
      setHoldings(hList);
    } catch (err) {
      console.error('Failed to load portfolio:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [assetType, sector, country]);

  const filteredHoldings = holdings.filter((h) => {
    if (search) {
      const q = search.toLowerCase();
      return (
        h.asset_name.toLowerCase().includes(q) ||
        h.synthetic_customer_id.toLowerCase().includes(q) ||
        h.transaction_id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const assetAllocationData = summary
    ? Object.entries(summary.asset_allocation).map(([name, val]) => ({
        name,
        exposure: Number((val / 1e6).toFixed(1)),
        pct: summary.total_value > 0 ? ((val / summary.total_value) * 100).toFixed(1) : '0.0'
      }))
    : [];

  // Largest sector calculation
  const largestSector = summary && summary.sector_concentration
    ? Object.entries(summary.sector_concentration).sort((a, b) => b[1] - a[1])[0]
    : null;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#282828]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-[1.4px] text-[#1ed760] bg-[#1f1f1f] px-3.5 py-1.5 rounded-full border border-[#333333]">
              Synthetic Portfolio
            </span>
            <span className="text-xs text-[#7c7c7c] font-mono">Wholesale Banking Book</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Portfolio explorer</h1>
          <p className="text-sm text-[#b3b3b3] mt-1 max-w-2xl leading-relaxed">
            Inspect synthetic wholesale banking assets, counterparty exposures, and portfolio concentration under Basel III risk-weight classifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchData}
            loading={loading}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total portfolio value"
          value={summary ? formatCurrency(summary.total_value) : '$500.00M'}
          subValue="Mkt Value"
          description="Aggregated synthetic balance sheet"
        />
        <MetricCard
          title="Number of holdings"
          value={summary ? summary.total_holdings_count : holdings.length}
          subValue="assets"
          description="Diversified multi-asset positions"
        />
        <MetricCard
          title="Asset classes"
          value={summary ? Object.keys(summary.asset_allocation).length : 6}
          description="Loans, Bonds, Equities, Sovereign, Derivatives, Cash"
        />
        <MetricCard
          title="Largest sector exposure"
          value={largestSector ? largestSector[0] : 'Financial Services'}
          subValue={largestSector && summary && summary.total_value > 0 ? `${((largestSector[1] / summary.total_value) * 100).toFixed(1)}%` : '32.0%'}
          description="Concentration benchmark constraint"
        />
      </div>

      {/* Asset Allocation Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Allocation Bar Chart (7 cols) */}
        <div className="lg:col-span-7">
          <Card>
            <CardHeader
              title="Asset class exposure distribution"
              description="Notional exposure aggregated by primary asset class in millions USD."
            />
            <div className="h-64 w-full">
              {assetAllocationData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={assetAllocationData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#7c7c7c" fontSize={11} tickLine={false} />
                    <YAxis stroke="#7c7c7c" fontSize={11} unit="M" tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#181818',
                        borderColor: '#282828',
                        borderRadius: '8px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                        fontSize: '12px',
                        color: '#ffffff'
                      }}
                      formatter={(val: any) => [`$${val}M`, 'Exposure']}
                    />
                    <Bar dataKey="exposure" fill="#1ed760" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-[#7c7c7c]">
                  No asset allocation data.
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Allocation Breakdown Table (5 cols) */}
        <div className="lg:col-span-5">
          <Card>
            <CardHeader
              title="Allocation composition"
              description="Exposure breakdown and portfolio proportion."
            />
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#1f1f1f] border-b border-[#282828] text-white font-bold uppercase tracking-[1.4px] text-[11px]">
                    <th className="py-2.5 px-3">Asset Class</th>
                    <th className="py-2.5 px-3 text-right">Exposure</th>
                    <th className="py-2.5 px-3 text-right">Share (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#282828]">
                  {assetAllocationData.map((item) => (
                    <tr key={item.name} className="hover:bg-[#202020] transition-colors">
                      <td className="py-2.5 px-3 font-medium text-white">{item.name}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-[#1ed760] font-bold tabular-nums">
                        ${item.exposure}M
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-[#b3b3b3] tabular-nums">
                        {item.pct}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* Filters & Search */}
      <Card>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search synthetic asset name, customer ID, or transaction ID..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#282828]">
            <SelectInput
              label="Asset class"
              value={assetType}
              onChange={(e) => setAssetType(e.target.value)}
              options={[
                { label: 'All Asset Types', value: '' },
                { label: 'Corporate Loan', value: 'Corporate Loan' },
                { label: 'Corporate Bond', value: 'Corporate Bond' },
                { label: 'Sovereign Bond', value: 'Sovereign Bond' },
                { label: 'Equity Holding', value: 'Equity Holding' },
                { label: 'FX / Derivative', value: 'FX / Derivative' },
                { label: 'Liquid Cash', value: 'Liquid Cash' }
              ]}
            />

            <SelectInput
              label="Industry sector"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              options={[
                { label: 'All Sectors', value: '' },
                { label: 'Technology', value: 'Technology' },
                { label: 'Financial Services', value: 'Financial Services' },
                { label: 'Energy', value: 'Energy' },
                { label: 'Healthcare', value: 'Healthcare' },
                { label: 'Industrials', value: 'Industrials' },
                { label: 'Consumer Discretionary', value: 'Consumer Discretionary' },
                { label: 'Sovereign', value: 'Sovereign' }
              ]}
            />

            <SelectInput
              label="Country jurisdiction"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              options={[
                { label: 'All Jurisdictions', value: '' },
                { label: 'USA', value: 'USA' },
                { label: 'UK', value: 'UK' },
                { label: 'Eurozone', value: 'Eurozone' },
                { label: 'Japan', value: 'Japan' },
                { label: 'Global', value: 'Global' }
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Holdings Table */}
      <Card>
        <CardHeader
          title="Synthetic holdings ledger"
          description={`Displaying ${filteredHoldings.length} synthetic transactions with credit parameters and market valuation.`}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#1f1f1f] border-b border-[#282828] text-white font-bold uppercase tracking-[1.4px] text-[11px]">
                <th className="py-3 px-3 font-mono">Trans ID</th>
                <th className="py-3 px-3">Asset Name</th>
                <th className="py-3 px-2">Type</th>
                <th className="py-3 px-2">Sector</th>
                <th className="py-3 px-2">Country</th>
                <th className="py-3 px-3 text-right">Exposure</th>
                <th className="py-3 px-3 text-right">Market Val</th>
                <th className="py-3 px-2 text-center">Rating</th>
                <th className="py-3 px-2 text-right">Maturity</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#282828]">
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-[#b3b3b3]">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#1ed760]" />
                    Loading synthetic portfolio holdings...
                  </td>
                </tr>
              ) : filteredHoldings.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-[#7c7c7c]">
                    No holdings match current search filters.
                  </td>
                </tr>
              ) : (
                filteredHoldings.map((h) => (
                  <tr
                    key={h.asset_id}
                    onClick={() => setSelectedHolding(h)}
                    className="hover:bg-[#202020] cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3 font-mono text-[#7c7c7c]">{h.transaction_id}</td>
                    <td className="py-3 px-3 font-semibold text-white">
                      <div>{h.asset_name}</div>
                      <span className="text-[10px] font-mono text-[#7c7c7c]">{h.synthetic_customer_id}</span>
                    </td>
                    <td className="py-3 px-2 text-[#b3b3b3] whitespace-nowrap">{h.asset_type}</td>
                    <td className="py-3 px-2 text-[#b3b3b3]">{h.sector}</td>
                    <td className="py-3 px-2 text-[#b3b3b3]">{h.country}</td>
                    <td className="py-3 px-3 text-right font-mono font-medium text-[#b3b3b3] tabular-nums whitespace-nowrap">
                      {formatCurrency(h.notional_amount)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-white tabular-nums whitespace-nowrap">
                      {formatCurrency(h.market_value)}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#1f1f1f] text-[#1ed760] border border-[#282828]">
                        {h.credit_rating}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right font-mono text-[#7c7c7c] tabular-nums">
                      {h.duration.toFixed(1)}y
                    </td>
                    <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => setSelectedHolding(h)}
                        className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-[1.4px] bg-[#1f1f1f] text-white hover:border-[#1ed760] hover:text-[#1ed760] border border-[#282828] transition-colors"
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
      </Card>

      {/* Holding Detail Modal */}
      {selectedHolding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-[#242424] rounded-[8px] p-6 max-w-lg w-full border border-[#282828] shadow-[0_8px_24px_rgba(0,0,0,0.5)] space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#282828]">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-[1.4px] px-2.5 py-0.5 rounded-full bg-[#1f1f1f] text-[#1ed760] border border-[#282828]">
                  {selectedHolding.transaction_id}
                </span>
                <h3 className="text-lg font-bold text-white mt-1.5">{selectedHolding.asset_name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedHolding(null)}
                className="text-[#7c7c7c] hover:text-white p-1.5 rounded-full hover:bg-[#1f1f1f] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#1f1f1f] rounded-[8px] border border-[#282828]">
                <span className="text-[10px] font-mono text-[#7c7c7c] uppercase tracking-wider block mb-0.5">Notional Exposure</span>
                <span className="text-base font-bold font-mono text-white">{formatCurrency(selectedHolding.notional_amount)}</span>
              </div>
              <div className="p-3 bg-[#1f1f1f] rounded-[8px] border border-[#282828]">
                <span className="text-[10px] font-mono text-[#7c7c7c] uppercase tracking-wider block mb-0.5">Market Valuation</span>
                <span className="text-base font-bold font-mono text-[#1ed760]">{formatCurrency(selectedHolding.market_value)}</span>
              </div>
              <div className="p-3 bg-[#1f1f1f] rounded-[8px] border border-[#282828]">
                <span className="text-[10px] font-mono text-[#7c7c7c] uppercase tracking-wider block mb-0.5">Credit Rating</span>
                <span className="text-base font-bold font-mono text-white">{selectedHolding.credit_rating}</span>
              </div>
              <div className="p-3 bg-[#1f1f1f] rounded-[8px] border border-[#282828]">
                <span className="text-[10px] font-mono text-[#7c7c7c] uppercase tracking-wider block mb-0.5">Duration / Maturity</span>
                <span className="text-base font-bold font-mono text-white">{selectedHolding.duration.toFixed(1)} years</span>
              </div>
            </div>

            <div className="p-4 bg-[#1f1f1f] rounded-[8px] border border-[#282828] text-xs space-y-1.5 text-[#b3b3b3]">
              <div><strong className="text-white">Asset Type:</strong> {selectedHolding.asset_type}</div>
              <div><strong className="text-white">Sector:</strong> {selectedHolding.sector}</div>
              <div><strong className="text-white">Jurisdiction:</strong> {selectedHolding.country} ({selectedHolding.currency})</div>
              <div><strong className="text-white">Probability of Default (PD):</strong> {(selectedHolding.probability_of_default * 100).toFixed(2)}%</div>
              <div><strong className="text-white">Loss Given Default (LGD):</strong> {(selectedHolding.loss_given_default * 100).toFixed(0)}%</div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#282828]">
              <Button variant="secondary" size="sm" onClick={() => setSelectedHolding(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
