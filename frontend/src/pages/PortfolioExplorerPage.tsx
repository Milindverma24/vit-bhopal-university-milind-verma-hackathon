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
      {/* 15.1 Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#d9d9d9]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-black bg-[#efefef] px-2.5 py-0.5 rounded-full border border-[#d9d9d9]">
              SYNTHETIC PORTFOLIO
            </span>
            <span className="text-xs text-[#767676] font-mono">Wholesale Banking Book</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Portfolio explorer</h1>
          <p className="text-sm text-[#5e5e5e] mt-1 max-w-2xl">
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
            Refresh Portfolio
          </Button>
        </div>
      </div>

      {/* 15.2 KPI Cards Row */}
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

      {/* 15.3 Asset Allocation Section */}
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
                    <XAxis dataKey="name" stroke="#767676" fontSize={11} tickLine={false} />
                    <YAxis stroke="#767676" fontSize={11} unit="M" tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderColor: '#d9d9d9',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: '#000000'
                      }}
                      formatter={(val: any) => [`$${val}M`, 'Exposure']}
                    />
                    <Bar dataKey="exposure" fill="#000000" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-[#767676]">
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
                  <tr className="bg-[#efefef] border-b border-[#d9d9d9] text-[#5e5e5e] font-semibold">
                    <th className="py-2.5 px-3">Asset Class</th>
                    <th className="py-2.5 px-3 text-right">Exposure</th>
                    <th className="py-2.5 px-3 text-right">Share (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d9d9d9]">
                  {assetAllocationData.map((item) => (
                    <tr key={item.name} className="hover:bg-[#f3f3f3] transition-colors">
                      <td className="py-2.5 px-3 font-medium text-black">{item.name}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-black font-semibold tabular-nums">
                        ${item.exposure}M
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-[#767676] tabular-nums">
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

      {/* 15.5 Filters & Search */}
      <div className="bg-white rounded-2xl p-5 border border-[#d9d9d9] space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search synthetic asset name, customer ID, or transaction ID..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#f3f3f3]">
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

      {/* 15.4 Holdings Table */}
      <Card>
        <CardHeader
          title="Synthetic holdings ledger"
          description={`Displaying ${filteredHoldings.length} synthetic transactions with credit parameters and market valuation.`}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#efefef] border-b border-[#d9d9d9] text-[#5e5e5e] font-semibold">
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
            <tbody className="divide-y divide-[#d9d9d9]">
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-[#767676]">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-black" />
                    Loading synthetic portfolio holdings...
                  </td>
                </tr>
              ) : filteredHoldings.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-[#767676]">
                    No holdings match current search filters.
                  </td>
                </tr>
              ) : (
                filteredHoldings.map((h) => (
                  <tr
                    key={h.asset_id}
                    onClick={() => setSelectedHolding(h)}
                    className="hover:bg-[#f3f3f3] cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3 font-mono text-[#767676]">{h.transaction_id}</td>
                    <td className="py-3 px-3 font-semibold text-black">
                      <div>{h.asset_name}</div>
                      <span className="text-[10px] font-mono text-[#767676]">{h.synthetic_customer_id}</span>
                    </td>
                    <td className="py-3 px-2 text-[#5e5e5e] whitespace-nowrap">{h.asset_type}</td>
                    <td className="py-3 px-2 text-[#5e5e5e]">{h.sector}</td>
                    <td className="py-3 px-2 text-[#5e5e5e]">{h.country}</td>
                    <td className="py-3 px-3 text-right font-mono font-medium text-black tabular-nums whitespace-nowrap">
                      {formatCurrency(h.notional_amount)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-black tabular-nums whitespace-nowrap">
                      {formatCurrency(h.market_value)}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#efefef] text-black border border-[#d9d9d9]">
                        {h.credit_rating}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right font-mono text-[#767676] tabular-nums">
                      {h.duration.toFixed(1)}y
                    </td>
                    <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => setSelectedHolding(h)}
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
      </Card>

      {/* 15.6 Holding Detail Modal */}
      {selectedHolding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full border border-[#d9d9d9] shadow-[0_8px_32px_rgba(0,0,0,0.16)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#d9d9d9]">
              <div>
                <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-[#efefef] text-black border border-[#d9d9d9]">
                  {selectedHolding.transaction_id}
                </span>
                <h3 className="text-lg font-bold text-black mt-1">{selectedHolding.asset_name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedHolding(null)}
                className="text-[#767676] hover:text-black p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#f3f3f3] rounded-xl border border-[#d9d9d9]">
                <span className="text-[10px] font-mono text-[#767676] uppercase block">Notional Exposure</span>
                <span className="text-base font-bold font-mono text-black">{formatCurrency(selectedHolding.notional_amount)}</span>
              </div>
              <div className="p-3 bg-[#f3f3f3] rounded-xl border border-[#d9d9d9]">
                <span className="text-[10px] font-mono text-[#767676] uppercase block">Market Valuation</span>
                <span className="text-base font-bold font-mono text-black">{formatCurrency(selectedHolding.market_value)}</span>
              </div>
              <div className="p-3 bg-[#f3f3f3] rounded-xl border border-[#d9d9d9]">
                <span className="text-[10px] font-mono text-[#767676] uppercase block">Credit Rating</span>
                <span className="text-base font-bold font-mono text-black">{selectedHolding.credit_rating}</span>
              </div>
              <div className="p-3 bg-[#f3f3f3] rounded-xl border border-[#d9d9d9]">
                <span className="text-[10px] font-mono text-[#767676] uppercase block">Duration / Maturity</span>
                <span className="text-base font-bold font-mono text-black">{selectedHolding.duration.toFixed(1)} years</span>
              </div>
            </div>

            <div className="p-3 bg-[#efefef] rounded-xl text-xs space-y-1 text-[#5e5e5e]">
              <div><strong>Asset Type:</strong> {selectedHolding.asset_type}</div>
              <div><strong>Sector:</strong> {selectedHolding.sector}</div>
              <div><strong>Jurisdiction:</strong> {selectedHolding.country} ({selectedHolding.currency})</div>
              <div><strong>Probability of Default (PD):</strong> {(selectedHolding.probability_of_default * 100).toFixed(2)}%</div>
              <div><strong>Loss Given Default (LGD):</strong> {(selectedHolding.loss_given_default * 100).toFixed(0)}%</div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#d9d9d9]">
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
