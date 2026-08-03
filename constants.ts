import { TickerData, CandleData } from './types';

export const DEFAULT_TICKERS = [
    "TCS.NS", "INFY.NS", "HDFCBANK.NS", "HDFC.NS", "RELIANCE.NS", "ICICIBANK.NS", "KOTAKBANK.NS",
    "LT.NS", "ITC.NS", "HINDUNILVR.NS", "MAHINDRA.NS", "SBIN.NS", "AXISBANK.NS", "BHARTIARTL.NS",
    "BAJAJ_AUTO.NS", "ASIANPAINT.NS", "SUNPHARMA.NS", "TITAN.NS", "ULTRACEMCO.NS", "WIPRO.NS",
    "POWERGRID.NS", "NTPC.NS", "ONGC.NS", "BPCL.NS", "ADANIENT.NS", "EICHERMOT.NS", "DIVISLAB.NS",
    "BRITANNIA.NS", "HCLTECH.NS", "DRREDDY.NS"
];

// Helper to generate realistic looking stock movement
export const generateMockTickerData = (ticker: string): TickerData => {
  const basePrice = Math.random() * 2000 + 500;
  const volatility = (Math.random() * 0.02) + 0.005; 
  
  // Simulate prediction
  const expected_return_raw = (Math.random() - 0.5) * volatility; // +/- move
  const predicted_next_close = basePrice * (1 + expected_return_raw);
  const expected_return_pct = expected_return_raw * 100;
  
  // Metrics
  const r2 = Math.random() * 0.5 + 0.1; // 0.1 to 0.6
  const dir_acc_pct = (Math.random() * 20 + 45); // 45% to 65%
  const rmse = basePrice * 0.005;
  const score = expected_return_pct * (dir_acc_pct/100) * r2;

  // Trend
  const trend_val = Math.random();
  let trend_label: 'Uptrend' | 'Downtrend' | 'Flat' = 'Flat';
  if (trend_val > 0.66) trend_label = 'Uptrend';
  else if (trend_val < 0.33) trend_label = 'Downtrend';

  // Action Logic (mirroring Python decide_action)
  let action: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
  const buy_threshold = 0.15;
  const sell_threshold = -0.15;
  
  if (expected_return_pct > buy_threshold && dir_acc_pct > 53 && r2 > 0.1) action = 'BUY';
  else if (expected_return_pct < sell_threshold && dir_acc_pct > 53 && r2 > 0.1) action = 'SELL';

  // Reasons
  const reasons = [
    `Predicted 1-minute return: ${expected_return_pct.toFixed(3)}%`,
    `Model R² = ${r2.toFixed(3)}`,
    `Directional Accuracy = ${dir_acc_pct.toFixed(2)}%`
  ];

  if (action === 'BUY') {
    reasons.push("Strong positive signal with acceptable reliability.");
    reasons.push("Prediction exceeds buy threshold.");
  } else if (action === 'SELL') {
    reasons.push("Negative signal crosses sell threshold.");
    reasons.push("Risk of downside movement detected.");
  } else {
    reasons.push("Signal too weak or reliability insufficient.");
    reasons.push("Market direction unclear, wait for better setup.");
  }

  return {
    ticker,
    price: basePrice,
    predicted_next_close,
    expected_return_pct,
    action,
    r2,
    dir_acc_pct,
    rmse,
    score,
    suggested_shares_risk: Math.floor(Math.random() * 100), // Placeholder, recalculated in UI
    reasons,
    trend_label,
    trend_pct: (Math.random() - 0.5) * 1.5,
    trend_per_min_pct: (Math.random() - 0.5) * 0.05,
    trend_lookback_minutes: 30
  };
};

export const generateCandles = (basePrice: number, count: number = 60): CandleData[] => {
  const candles: CandleData[] = [];
  let currentPrice = basePrice * 0.98; // Start slightly lower to show movement to current

  for (let i = 0; i < count; i++) {
    const volatility = basePrice * 0.002;
    const change = (Math.random() - 0.5) * volatility * 2;
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + Math.random() * volatility;
    const low = Math.min(open, close) - Math.random() * volatility;
    
    // Add a synthetic prediction line for the last 10 bars
    const predicted = i > count - 15 ? close * (1 + (Math.random() - 0.5)*0.001) : undefined;

    candles.push({
      time: new Date(Date.now() - (count - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      open,
      high,
      low,
      close,
      predicted
    });
    currentPrice = close;
  }
  return candles;
};

export const INITIAL_USER_SETTINGS = {
  accountSize: 100000,
  riskPct: 1.0,
  stopLossPct: 1.5,
  buyThreshold: 0.15,
  sellThreshold: -0.15,
  theme: 'dark' as const
};