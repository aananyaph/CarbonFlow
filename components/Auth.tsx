import React, { useState } from 'react';
import { ICONS } from '../constants';
import { ChargerLevel } from '../types';

interface AuthProps {
  onLogin: () => void;
  onSignup: (data: { lat: number; lng: number; chargerLevel: ChargerLevel }) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, onSignup, isDarkMode, toggleTheme }) => {
  const [view, setView] = useState<'login' | 'signup'>('login');
  
  // Signup State
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    lat: '12.97',
    lng: '77.59',
    chargerLevel: ChargerLevel.LEVEL_2
  });

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignup({
      lat: parseFloat(signupData.lat) || 12.97,
      lng: parseFloat(signupData.lng) || 77.59,
      chargerLevel: signupData.chargerLevel
    });
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  const commonInputClasses = "w-full pl-10 pr-3 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-slate-100 transition-colors";

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 transition-colors duration-300
      bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50 
      dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-cyan-950`}>
      
      {/* Theme Toggle in Corner */}
      <button 
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2 rounded-lg bg-white/60 dark:bg-slate-800/60 text-teal-700 dark:text-cyan-400 hover:bg-teal-100 dark:hover:bg-slate-700 transition-colors border border-transparent hover:border-teal-200 dark:hover:border-cyan-700"
      >
        {isDarkMode ? ICONS.Sun : ICONS.Moon}
      </button>

      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        
        {/* Header Section */}
        <div className="px-8 pt-8 pb-6 text-center">
           <div className="inline-flex bg-gradient-to-br from-teal-500 to-emerald-600 p-3 rounded-xl text-white shadow-lg shadow-teal-500/20 mb-4">
              {ICONS.Leaf}
           </div>
           <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">EVQuotient</h1>
           <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-3 uppercase tracking-wide">where clean charging becomes a carbon asset</p>
           <p className="text-sm text-slate-500 dark:text-slate-400">
             {view === 'login' ? 'Sign in to access your dashboard' : 'Optimize your charging station today'}
           </p>
        </div>

        {/* Forms */}
        <div className="px-8 pb-8">
          {view === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="relative">
                <div className="absolute left-3 top-3.5 text-slate-400">{ICONS.Home}</div>
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className={commonInputClasses}
                  required
                />
              </div>
              <div className="relative">
                <div className="absolute left-3 top-3.5 text-slate-400">{ICONS.Settings}</div>
                <input 
                  type="password" 
                  placeholder="Password" 
                  className={commonInputClasses}
                  required
                />
              </div>
              
              <button className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-lg shadow-md shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5">
                Sign In
              </button>
              
              <div className="text-center mt-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Don't have an account?{' '}
                  <button type="button" onClick={() => setView('signup')} className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                    Sign up
                  </button>
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                 <div className="relative">
                  <div className="absolute left-3 top-3.5 text-slate-400">{ICONS.Home}</div>
                  <input type="text" placeholder="First Name" className={commonInputClasses} required />
                 </div>
                 <div className="relative">
                  <input type="text" placeholder="Last Name" className={commonInputClasses} />
                 </div>
              </div>

              <div className="relative">
                 <div className="absolute left-3 top-3.5 text-slate-400">{ICONS.TechPark}</div>
                 <input type="email" placeholder="Business Email" className={commonInputClasses} required />
              </div>

              {/* Lat / Long Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <div className="absolute left-3 top-3.5 text-slate-400 text-xs font-bold">Lat</div>
                  <input 
                    type="number" 
                    placeholder="Latitude" 
                    step="0.0001"
                    value={signupData.lat}
                    onChange={(e) => setSignupData({...signupData, lat: e.target.value})}
                    className={commonInputClasses}
                    required 
                  />
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-3.5 text-slate-400 text-xs font-bold">Lon</div>
                  <input 
                    type="number" 
                    placeholder="Longitude"
                    step="0.0001" 
                    value={signupData.lng}
                    onChange={(e) => setSignupData({...signupData, lng: e.target.value})}
                    className={commonInputClasses}
                    required 
                  />
                </div>
              </div>

              {/* Charger Level Selector (Requested Option) */}
              <div className="relative">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1 ml-1">Charger Configuration</label>
                <div className="absolute left-3 top-[1.9rem] text-slate-400">{ICONS.Zap}</div>
                <select
                  value={signupData.chargerLevel}
                  onChange={(e) => setSignupData({...signupData, chargerLevel: e.target.value as ChargerLevel})}
                  className={`${commonInputClasses} appearance-none cursor-pointer`}
                >
                  <option value="" disabled>-- Select charger level --</option>
                  <option value={ChargerLevel.LEVEL_1}>Level 1 — 1–2 kW (AC Slow Charger)</option>
                  <option value={ChargerLevel.LEVEL_2}>Level 2 — 3–22 kW (AC Fast Charger)</option>
                  <option value={ChargerLevel.LEVEL_3}>Level 3 — 25–150 kW (DC Fast Charger)</option>
                  <option value={ChargerLevel.LEVEL_4}>Level 4 — 150–350+ kW (DC Ultra-Fast)</option>
                </select>
                <div className="absolute right-3 top-[1.9rem] text-slate-400 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>

              <div className="relative">
                 <div className="absolute left-3 top-3.5 text-slate-400">{ICONS.Settings}</div>
                 <input type="password" placeholder="Create Password" className={commonInputClasses} required />
              </div>

              <button className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-lg shadow-md shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 mt-2">
                Create Account
              </button>

              <div className="text-center mt-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Already have an account?{' '}
                  <button type="button" onClick={() => setView('login')} className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                    Sign in
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};