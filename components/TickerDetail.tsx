import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, AlertTriangle, TrendingUp, TrendingDown, Minus, 
  DollarSign, Calculator, Info, Save, Share2, AlertCircle, CheckCircle, XCircle 
} from 'lucide-react';
import { 
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine 
} from 'recharts';
import { TickerData, CandleData, UserSettings } from '../types';
import { generateCandles } from '../constants';

interface TickerDetailProps {
  ticker: TickerData;
  settings: UserSettings;
  onClose: () => void;
}

const TickerDetail: React.FC<TickerDetailProps> = ({ ticker, settings, onClose }) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [budget, setBudget] = useState(settings.accountSize);
  const [riskPct, setRiskPct] = useState(settings.riskPct);
  const [stopLossPct, setStopLossPct] = useState(settings.stopLossPct);
  const [timeframe, setTimeframe] = useState('1m');

  useEffect(() => {
    // Transform data for chart: range bars for body and wick
    const rawData = generateCandles(ticker.price);
    const formatted = rawData.map(d => ({
      ...d,
      // Wick is from low to high
      wickRange: [d.low, d.high],
      // Body is from open to close (or close to open). Recharts needs [min, max]
      bodyRange: [Math.min(d.open, d.close), Math.max(d.open, d.close)],
      // Color determiner
      isUp: d.close >= d.open
    }));
    setChartData(formatted);
  }, [ticker]);

  // Sizing Calculation Logic
  const riskAmount = budget * (riskPct / 100);
  const riskPerShare = ticker.price * (stopLossPct / 100);
  const riskBasedShares = riskPerShare > 0 ? Math.floor(riskAmount / riskPerShare) : 0;
  const budgetLimitedShares = Math.floor(budget / ticker.price);
  const recommendedShares = Math.min(riskBasedShares, budgetLimitedShares);
  const totalInvestment = recommendedShares * ticker.price;

  const getActionColor = (action: string) => {
    switch (action) {
      case 'BUY': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'SELL': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800';
      default: return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'BUY': return <CheckCircle className="w-5 h-5 mr-1" />;
      case 'SELL': return <XCircle className="w-5 h-5 mr-1" />;
      default: return <Minus className="w-5 h-5 mr-1" />;
    }
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        
        {/* Backdrop */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white dark:bg-slate-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full border border-gray-200 dark:border-slate-700">
          
          {/* Header */}
          <div className="bg-white dark:bg-slate-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-100 dark:border-slate-800">
            <div className="sm:flex sm:items-start justify-between">
              <div>
                <h3 className="text-2xl leading-6 font-bold text-gray-900 dark:text-white flex items-center" id="modal-title">
                  {ticker.ticker}
                  <span className={`ml-3 px-3 py-1 rounded-full text-xs font-bold border flex items-center ${getActionColor(ticker.action)}`}>
                    {getActionIcon(ticker.action)}
                    RECOMMENDATION: {ticker.action}
                  </span>
                </h3>
                <div className="mt-2 flex items-center space-x-3">
                  <span className="text-3xl font-mono font-medium text-gray-900 dark:text-gray-100">
                    {formatCurrency(ticker.price)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Next Close Pred: <span className="font-bold">{formatCurrency(ticker.predicted_next_close)}</span>
                  </span>
                </div>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 bg-gray-50 dark:bg-slate-950">
            
            {/* Left Column: Chart & Metrics */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Chart Card */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Intraday Price Action</h4>
                  <div className="flex space-x-1">
                    {['1m', '5m', '15m'].map(t => (
                      <button 
                        key={t}
                        onClick={() => setTimeframe(t)}
                        className={`px-2 py-1 text-xs rounded ${timeframe === t ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-500'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                      <XAxis dataKey="time" hide={true} />
                      <YAxis domain={['auto', 'auto']} orientation="right" tick={{fontSize: 10}} stroke="#9ca3af" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                        itemStyle={{ color: '#d1d5db' }}
                        labelStyle={{ color: '#9ca3af' }}
                      />
                      
                      {/* Wick (High/Low) - drawn as thin bar */}
                      <Bar dataKey="wickRange" barSize={2}>
                         {chartData.map((entry, index) => (
                           <Cell key={`wick-${index}`} fill={entry.isUp ? '#22c55e' : '#ef4444'} />
                         ))}
                      </Bar>
                      
                      {/* Body (Open/Close) - drawn as thick bar */}
                      <Bar dataKey="bodyRange" barSize={8}>
                         {chartData.map((entry, index) => (
                           <Cell key={`body-${index}`} fill={entry.isUp ? '#22c55e' : '#ef4444'} />
                         ))}
                      </Bar>

                      <Line type="step" dataKey="predicted" stroke="#f59e0b" strokeDasharray="5 5" strokeWidth={2} dot={{r:3, fill: '#f59e0b'}} name="Predicted" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                 <div className="flex justify-between items-center text-xs text-gray-500 mt-2 px-2">
                    <div className="flex space-x-3">
                       <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span> Bullish</span>
                       <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span> Bearish</span>
                    </div>
                    <span className="flex items-center"><span className="w-3 h-0.5 bg-amber-500 border-dashed border-b mr-1"></span> Prediction History</span>
                 </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-gray-200 dark:border-slate-800">
                  <p className="text-[10px] uppercase text-gray-400 font-semibold mb-1">Model R²</p>
                  <p className="text-lg font-mono font-bold dark:text-gray-200">{ticker.r2.toFixed(3)}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-gray-200 dark:border-slate-800">
                  <p className="text-[10px] uppercase text-gray-400 font-semibold mb-1">Directional Acc</p>
                  <p className={`text-lg font-mono font-bold ${ticker.dir_acc_pct > 55 ? 'text-green-500' : 'text-amber-500'}`}>
                    {ticker.dir_acc_pct.toFixed(1)}%
                  </p>
                </div>
                 <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-gray-200 dark:border-slate-800">
                  <p className="text-[10px] uppercase text-gray-400 font-semibold mb-1">RMSE</p>
                  <p className="text-lg font-mono font-bold dark:text-gray-200">₹{ticker.rmse.toFixed(2)}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-gray-200 dark:border-slate-800">
                  <p className="text-[10px] uppercase text-gray-400 font-semibold mb-1">Trend (30m)</p>
                  <div className="flex items-center">
                    {ticker.trend_label === 'Uptrend' && <TrendingUp className="w-4 h-4 text-green-500 mr-1" />}
                    {ticker.trend_label === 'Downtrend' && <TrendingDown className="w-4 h-4 text-red-500 mr-1" />}
                    {ticker.trend_label === 'Flat' && <Minus className="w-4 h-4 text-gray-400 mr-1" />}
                    <p className="text-sm font-medium dark:text-gray-200">{ticker.trend_label}</p>
                  </div>
                </div>
              </div>

              {/* Rationale */}
              <div className="bg-blue-50 dark:bg-slate-800/50 p-4 rounded-xl border border-blue-100 dark:border-slate-700">
                <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300 flex items-center mb-3">
                  <Info className="w-4 h-4 mr-2" /> 
                  Recommendation Rationale
                </h4>
                <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-blue-100 dark:border-slate-700 mb-3">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    The model suggests: <span className="font-bold uppercase text-blue-600 dark:text-blue-400">{ticker.action}</span>
                  </p>
                </div>
                <ul className="space-y-2">
                  {ticker.reasons.map((reason, idx) => (
                    <li key={idx} className="text-sm text-blue-800 dark:text-gray-300 flex items-start">
                      <span className="mr-2 mt-1 text-blue-400 text-xs">●</span> {reason}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Sizing & Actions */}
            <div className="space-y-6">
              
              {/* Calculator Widget */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800">
                <h4 className="text-md font-bold text-gray-900 dark:text-white flex items-center mb-4">
                  <Calculator className="w-5 h-5 mr-2 text-gray-400" /> Position Sizing
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Budget (INR)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      <input 
                        type="number" 
                        value={budget} 
                        onChange={(e) => setBudget(Number(e.target.value))}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between">
                       <label className="block text-xs font-medium text-gray-500 mb-1">Risk per Trade</label>
                       <span className="text-xs font-bold text-blue-600">{riskPct}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.1" 
                      max="5" 
                      step="0.1" 
                      value={riskPct} 
                      onChange={(e) => setRiskPct(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Stop Loss %</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={stopLossPct} 
                      onChange={(e) => setStopLossPct(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-700 space-y-2">
                  <div className="flex justify-between text-sm">
                     <span className="text-gray-500">Risk-based Qty:</span>
                     <span className="font-mono text-gray-700 dark:text-gray-300">{riskBasedShares}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                     <span className="text-gray-500">Budget Max Qty:</span>
                     <span className="font-mono text-gray-700 dark:text-gray-300">{budgetLimitedShares}</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-100 dark:bg-slate-800 p-3 rounded-lg mt-2">
                     <span className="font-bold text-gray-900 dark:text-white text-sm">Recommended:</span>
                     <div className="text-right">
                       <span className="block text-2xl font-bold text-blue-600 dark:text-blue-400 leading-none">{recommendedShares}</span>
                       <span className="text-[10px] text-gray-500 uppercase tracking-wide">SHARES</span>
                     </div>
                  </div>
                  <div className="text-center text-xs text-gray-400 mt-1">
                    Est. Value: {formatCurrency(totalInvestment)}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                 <button className="flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-slate-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition">
                    <Save className="w-4 h-4 mr-2" /> Watchlist
                 </button>
                 <button className="flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-slate-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition">
                    <Share2 className="w-4 h-4 mr-2" /> Share
                 </button>
                 <button className="col-span-2 flex items-center justify-center py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                    <AlertCircle className="w-4 h-4 mr-2" /> Set Alert for {ticker.predicted_next_close.toFixed(2)}
                 </button>
              </div>

            </div>

          </div>
          
          <div className="bg-gray-50 dark:bg-slate-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200 dark:border-slate-800">
            <button 
              type="button" 
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-slate-600 shadow-sm px-4 py-2 bg-white dark:bg-slate-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TickerDetail;