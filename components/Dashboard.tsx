import React, { useMemo, useState } from 'react';
import { Search, Filter, ArrowUpRight, ArrowDownRight, Activity, MinusCircle } from 'lucide-react';
import { TickerData } from '../types';

interface DashboardProps {
  data: TickerData[];
  onSelectTicker: (ticker: TickerData) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, onSelectTicker }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState<'ALL' | 'BUY' | 'SELL' | 'HOLD'>('ALL');

  const stats = useMemo(() => {
    return {
      total: data.length,
      buy: data.filter(d => d.action === 'BUY').length,
      sell: data.filter(d => d.action === 'SELL').length,
      hold: data.filter(d => d.action === 'HOLD').length,
      avgR2: data.reduce((acc, curr) => acc + curr.r2, 0) / data.length,
    };
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = item.ticker.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterAction === 'ALL' || item.action === filterAction;
      return matchesSearch && matchesFilter;
    }).sort((a, b) => b.score - a.score); // Default sort by score desc
  }, [data, searchTerm, filterAction]);

  return (
    <div className="space-y-6">
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-semibold">Total Scanned</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</h3>
            <Activity className="text-blue-500 opacity-50 w-6 h-6" />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-green-200 dark:border-green-900/30 shadow-sm flex flex-col justify-between">
           <p className="text-green-600 dark:text-green-400 text-xs uppercase font-semibold">Buy Signals</p>
           <div className="flex items-end justify-between">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.buy}</h3>
            <ArrowUpRight className="text-green-500 w-6 h-6" />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-red-200 dark:border-red-900/30 shadow-sm flex flex-col justify-between">
           <p className="text-red-600 dark:text-red-400 text-xs uppercase font-semibold">Sell Signals</p>
           <div className="flex items-end justify-between">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.sell}</h3>
            <ArrowDownRight className="text-red-500 w-6 h-6" />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-amber-200 dark:border-amber-900/30 shadow-sm flex flex-col justify-between">
           <p className="text-amber-600 dark:text-amber-400 text-xs uppercase font-semibold">Hold Signals</p>
           <div className="flex items-end justify-between">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.hold}</h3>
            <MinusCircle className="text-amber-500 w-6 h-6" />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
           <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-semibold">Universe Avg R²</p>
           <div className="flex items-end justify-between">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgR2.toFixed(3)}</h3>
            <span className="text-xs text-gray-400 mb-1">Reliability</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Search tickers (e.g. TCS.NS)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:text-white"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>
        
        <div className="flex space-x-2 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'BUY', 'SELL', 'HOLD'].map((filter) => (
             <button
               key={filter}
               onClick={() => setFilterAction(filter as any)}
               className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                 filterAction === filter 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800'
               }`}
             >
               {filter}
             </button>
          ))}
          <button className="px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-800">
            <thead className="bg-gray-50 dark:bg-slate-950">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ticker</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pred. Close</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Exp. Return</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">R²</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Dir Acc</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Trend</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-800">
              {filteredData.map((row) => (
                <tr 
                  key={row.ticker} 
                  onClick={() => onSelectTicker(row)}
                  className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">{row.ticker}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">NSE</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700 dark:text-gray-300 font-mono">
                    {row.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700 dark:text-gray-300 font-mono">
                    {row.predicted_next_close.toFixed(2)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-bold font-mono ${row.expected_return_pct >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {row.expected_return_pct > 0 ? '+' : ''}{row.expected_return_pct.toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${row.action === 'BUY' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                        row.action === 'SELL' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
                        'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'}`}>
                      {row.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell font-mono">
                    {row.r2.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell font-mono">
                    {row.dir_acc_pct.toFixed(0)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                    {row.trend_label === 'Uptrend' && <span className="text-green-500 flex items-center"><ArrowUpRight className="w-3 h-3 mr-1"/> Up</span>}
                    {row.trend_label === 'Downtrend' && <span className="text-red-500 flex items-center"><ArrowDownRight className="w-3 h-3 mr-1"/> Down</span>}
                    {row.trend_label === 'Flat' && <span className="text-gray-400">Flat</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                     <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                       Analyze
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredData.length === 0 && (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No tickers found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;