import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TickerDetail from './components/TickerDetail';
import { UserProfile, TickerData } from './types';
import { DEFAULT_TICKERS, generateMockTickerData, INITIAL_USER_SETTINGS } from './constants';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDark, setIsDark] = useState(true); // Default dark mode
  const [user, setUser] = useState<UserProfile>({
    name: 'Trader User',
    email: 'trader@example.com',
    settings: INITIAL_USER_SETTINGS,
    watchlist: []
  });
  
  const [tickerData, setTickerData] = useState<TickerData[]>([]);
  const [selectedTicker, setSelectedTicker] = useState<TickerData | null>(null);

  // Initialize Theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Load Mock Data on Login
  useEffect(() => {
    if (isAuthenticated) {
      const data = DEFAULT_TICKERS.map(t => generateMockTickerData(t));
      setTickerData(data);
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSelectedTicker(null);
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  if (!isAuthenticated) {
    return (
      <>
        <div className={`fixed top-4 right-4 z-50`}>
          <button 
             onClick={toggleTheme} 
             className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-lg text-gray-800 dark:text-white"
          >
             {isDark ? '☀️' : '🌙'}
          </button>
        </div>
        <Login onLogin={handleLogin} />
      </>
    );
  }

  return (
    <Layout 
      user={user} 
      toggleTheme={toggleTheme} 
      isDark={isDark} 
      onLogout={handleLogout}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {activeTab === 'dashboard' && (
        <Dashboard 
          data={tickerData} 
          onSelectTicker={setSelectedTicker} 
        />
      )}

      {activeTab === 'history' && (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-400">Trading History</h2>
          <p className="text-gray-500 mt-2">No past snapshots recorded yet.</p>
        </div>
      )}

      {activeTab === 'backtest' && (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-400">Strategy Backtester</h2>
          <p className="text-gray-500 mt-2">Simulation module coming soon.</p>
        </div>
      )}
      
      {activeTab === 'settings' && (
         <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-8 rounded-xl border border-gray-200 dark:border-slate-800">
           <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">User Settings</h2>
           <div className="space-y-4">
             <div>
               <label className="block text-sm text-gray-500 mb-1">Default Account Size (INR)</label>
               <input type="number" className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-white" defaultValue={100000} />
             </div>
             <div>
               <label className="block text-sm text-gray-500 mb-1">Risk per Trade (%)</label>
               <input type="number" className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-white" defaultValue={1} />
             </div>
              <div className="pt-4">
               <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Configuration</button>
             </div>
           </div>
         </div>
      )}

      {selectedTicker && (
        <TickerDetail 
          ticker={selectedTicker} 
          settings={user.settings}
          onClose={() => setSelectedTicker(null)} 
        />
      )}
    </Layout>
  );
};

export default App;