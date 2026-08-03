import React, { useState } from 'react';
import { TrendingUp, Lock } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-3 rounded-full mb-4">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Stock Investment Advisor</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-center">
            Algorithmic insights for smarter trading.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                required
              />
              <Lock className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-200 transform hover:scale-[1.02]"
          >
            Sign In to Dashboard
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            By signing in, you acknowledge that this tool provides algorithmic suggestions and does not constitute financial advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;