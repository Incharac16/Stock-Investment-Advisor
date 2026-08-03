import React, { useState } from 'react';
import { TrendingUp, User, Moon, Sun, Settings, HelpCircle, LogOut, Bell, X } from 'lucide-react';
import { UserProfile } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: UserProfile;
  toggleTheme: () => void;
  isDark: boolean;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, user, toggleTheme, isDark, onLogout, activeTab, setActiveTab 
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock Notifications
  const notifications = [
    { id: 1, title: 'Alert Triggered', message: 'TCS.NS crossed ₹3450', time: '2m ago', type: 'info' },
    { id: 2, title: 'System', message: 'Model weights updated', time: '1h ago', type: 'success' },
    { id: 3, title: 'Risk Warning', message: 'High volatility detected', time: '3h ago', type: 'warning' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      {/* Global Warning Banner */}
      <div className="bg-amber-600 text-white text-xs font-semibold text-center py-1 px-4">
        WARNING: Users are responsible for their own investment decisions. Always verify data and consult a licensed financial advisor before trading.
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <TrendingUp className="h-8 w-8 text-blue-600 mr-2" />
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">Stock Investment Advisor</span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Model-Backed Suggestions</span>
              </div>
            </div>

            {/* Navigation (Desktop) */}
            <nav className="hidden md:flex space-x-8">
              {['Dashboard', 'History', 'Backtest'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`${
                    activeTab === tab.toLowerCase()
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  } px-1 pt-1 text-sm font-medium transition-colors`}
                >
                  {tab}
                </button>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
               <div className="text-right hidden sm:block">
                  <p className="text-[10px] text-gray-400">Last Update</p>
                  <p className="text-xs font-mono text-gray-600 dark:text-gray-300">
                    {new Date().toLocaleTimeString()}
                  </p>
               </div>
               
               <button 
                onClick={toggleTheme} 
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle Theme"
               >
                 {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
               </button>

               <div className="relative">
                 <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800 relative"
                 >
                   <Bell className="h-5 w-5" />
                   <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full"></span>
                 </button>

                 {/* Notifications Dropdown */}
                 {showNotifications && (
                   <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden z-50">
                     <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
                       <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                       <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-500">
                         <X className="w-4 h-4" />
                       </button>
                     </div>
                     <div className="max-h-64 overflow-y-auto">
                       {notifications.map((n) => (
                         <div key={n.id} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 border-b border-gray-100 dark:border-slate-700/50 last:border-0">
                           <p className="text-sm font-medium text-gray-900 dark:text-white">{n.title}</p>
                           <p className="text-xs text-gray-500 dark:text-gray-300 mt-0.5">{n.message}</p>
                           <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                         </div>
                       ))}
                     </div>
                   </div>
                 )}
               </div>

               <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800 cursor-pointer group relative">
                  {user.name.charAt(0)}
                  {/* User Menu Dropdown */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 hidden group-hover:block border border-gray-200 dark:border-slate-700">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-slate-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                    </div>
                    <button onClick={() => setActiveTab('settings')} className="flex w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 items-center">
                      <Settings className="w-4 h-4 mr-2" /> Settings
                    </button>
                     <button className="flex w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 items-center">
                      <HelpCircle className="w-4 h-4 mr-2" /> Help
                    </button>
                    <button onClick={onLogout} className="flex w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-slate-700 items-center">
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {children}
      </main>
    </div>
  );
};

export default Layout;