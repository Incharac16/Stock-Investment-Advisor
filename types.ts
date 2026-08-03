export type ActionType = 'BUY' | 'SELL' | 'HOLD';
export type TrendLabel = 'Uptrend' | 'Downtrend' | 'Flat';

export interface TickerData {
  ticker: string;
  price: number;
  predicted_next_close: number;
  expected_return_pct: number;
  action: ActionType;
  r2: number;
  dir_acc_pct: number;
  rmse: number;
  score: number;
  suggested_shares_risk: number;
  reasons: string[];
  trend_label: TrendLabel;
  trend_pct: number;
  trend_per_min_pct: number;
  trend_lookback_minutes: number;
}

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  predicted?: number; // For the overlay
}

export interface UserSettings {
  accountSize: number;
  riskPct: number;
  stopLossPct: number;
  buyThreshold: number;
  sellThreshold: number;
  theme: 'light' | 'dark';
}

export interface UserProfile {
  name: string;
  email: string;
  settings: UserSettings;
  watchlist: string[];
}