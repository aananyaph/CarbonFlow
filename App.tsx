import React, { useState, useMemo, useEffect } from 'react';
import { ICONS } from './constants';
import { AppState, UserSegment, ChargerLevel } from './types';
import { runSimulation } from './services/engine';
import { InputSection } from './components/InputSection';
import { MetricsGrid } from './components/MetricsGrid';
import { EnergyChart } from './components/charts/EnergyChart';
import { BatteryChart } from './components/charts/BatteryChart';
import { SavingsChart } from './components/charts/SavingsChart';
import { Auth } from './components/Auth';

// Helper for default dates
const formatDate = (date: Date) => date.toISOString().split('T')[0];
const today = new Date();
const nextMonth = new Date(today);
nextMonth.setDate(today.getDate() + 30);

// Initial default state
const DEFAULT_STATE: AppState = {
  latitude: 12.97, // Bengaluru
  longitude: 77.59,
  solarCapacityKW: 50,
  batteryCapacityKWh: 100,
  segment: UserSegment.TECH_PARK,
  chargerLevel: ChargerLevel.LEVEL_2,
  gridTariff: 10.0,
  startDate: formatDate(today),
  endDate: formatDate(nextMonth),
};

function App() {
  // State for Navigation / Auth
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputs, setInputs] = useState<AppState>(DEFAULT_STATE);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Real-time Header State
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentTemp, setCurrentTemp] = useState<number | null>(null);

  // Recalculate simulation whenever inputs change
  const simulationResults = useMemo(() => {
    return runSimulation(inputs);
  }, [inputs]);

  // Calculate duration in days
  const daysCount = useMemo(() => {
    const start = new Date(inputs.startDate);
    const end = new Date(inputs.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return Math.max(1, diffDays); // Ensure at least 1 day
  }, [inputs.startDate, inputs.endDate]);

  // Clock Effect
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Weather Fetch Effect (Open-Meteo Free API)
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${inputs.latitude}&longitude=${inputs.longitude}&current_weather=true`);
        const data = await res.json();
        if (data.current_weather) {
          setCurrentTemp(data.current_weather.temperature);
        }
      } catch (error) {
        // Fallback Simulation if API fails (Sine wave based on hour)
        const hour = new Date().getHours();
        const simulatedTemp = 25 + 5 * Math.sin((hour - 9) * Math.PI / 12);
        setCurrentTemp(parseFloat(simulatedTemp.toFixed(1)));
      }
    };

    // Debounce fetch when typing lat/long
    const timeoutId = setTimeout(fetchWeather, 800);
    return () => clearTimeout(timeoutId);
  }, [inputs.latitude, inputs.longitude]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleSignup = (data: { lat: number; lng: number; chargerLevel: ChargerLevel }) => {
    setInputs(prev => ({
      ...prev,
      latitude: data.lat,
      longitude: data.lng,
      chargerLevel: data.chargerLevel
    }));
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return (
      <div className={isDarkMode ? 'dark' : ''}>
         <Auth 
            onLogin={handleLogin} 
            onSignup={handleSignup} 
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
         />
      </div>
    );
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      {/* 
          Dashboard Background:
          Light: Fresh bluish-green gradient (Teal -> Cyan -> Emerald)
          Dark: Deep solid dark gradient with cyan/teal tint (Slate-950 -> Cyan-950). No transparency to avoid white haze.
      */}
      <div className="min-h-screen font-sans transition-colors duration-300 
                      bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50 
                      dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-cyan-950
                      text-slate-900 dark:text-slate-100">
        
        {/* 
            Navigation Bar:
            Light: Matching bluish-green gradient
            Dark: Deep slate/cyan gradient to match dark theme background
        */}
        <header className="sticky top-0 z-50 transition-colors duration-300 shadow-sm backdrop-blur-md
                           border-b border-teal-200 dark:border-cyan-900
                           bg-gradient-to-r from-teal-100/90 via-cyan-100/90 to-emerald-100/90
                           dark:bg-gradient-to-r dark:from-slate-950/95 dark:via-cyan-950/95 dark:to-slate-950/95">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative">
            
            {/* Left: Logo */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-2 rounded-lg text-white shadow-lg shadow-teal-500/20">
                {ICONS.Leaf}
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">EVQuotient</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">where clean charging becomes a carbon asset</p>
              </div>
            </div>

            {/* Center: Live Real-time Widget (Absolute Centered) */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 
                            items-center gap-4 bg-white/40 dark:bg-black/20 backdrop-blur-md 
                            px-5 py-2 rounded-full border border-teal-200/50 dark:border-slate-700/50 shadow-sm">
               
               {/* Clock */}
               <div className="flex items-center gap-2">
                 <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 tabular-nums">
                   {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                 </div>
               </div>

               {/* Divider */}
               <div className="h-4 w-px bg-slate-300 dark:bg-slate-600"></div>

               {/* Weather */}
               <div className="flex items-center gap-2">
                  <span className="text-emerald-600 dark:text-emerald-400">
                     {currentTime.getHours() > 6 && currentTime.getHours() < 18 ? ICONS.Sun : ICONS.Moon}
                  </span>
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 tabular-nums">
                    {currentTemp !== null ? `${currentTemp}°C` : '--'}
                  </div>
               </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
               {/* Grid Status Indicator */}
               <div className="hidden lg:flex items-center gap-2 bg-white/60 dark:bg-slate-800/60 px-3 py-1 rounded-full border border-teal-200 dark:border-cyan-800">
                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                 <span className="text-xs font-semibold text-teal-700 dark:text-cyan-300">Grid Connected</span>
               </div>
               
               {/* Theme Toggle */}
               <button 
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-white/60 dark:bg-slate-800/60 text-teal-700 dark:text-cyan-400 hover:bg-teal-100 dark:hover:bg-slate-700 transition-colors border border-transparent hover:border-teal-200 dark:hover:border-cyan-700"
                aria-label="Toggle Dark Mode"
               >
                 {isDarkMode ? ICONS.Sun : ICONS.Moon}
               </button>

               <button 
                 onClick={() => setIsAuthenticated(false)}
                 className="bg-white/60 dark:bg-slate-800/60 hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 border border-transparent"
               >
                 Log Out
               </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Configuration (3/12 cols) */}
            <div className="lg:col-span-3">
              <InputSection inputs={inputs} setInputs={setInputs} />
              
              {/* Contextual Tip */}
              <div className="mt-6 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/40 dark:to-blue-950/40 border border-cyan-100 dark:border-cyan-800/50 p-4 rounded-xl shadow-sm">
                <div className="flex gap-3">
                  <div className="text-cyan-600 dark:text-cyan-400 mt-1">{ICONS.Sun}</div>
                  <div>
                     <h4 className="text-sm font-bold text-cyan-900 dark:text-cyan-200 mb-1">Recommendation</h4>
                     <p className="text-xs text-cyan-800 dark:text-cyan-200/80 leading-relaxed">
                       Based on your <strong>{inputs.segment === UserSegment.TECH_PARK ? 'Daytime Peak' : 'Usage'}</strong>, consider increasing battery storage to <strong>{(inputs.solarCapacityKW * 2.5).toFixed(0)} kWh</strong> to capture more afternoon solar for evening discharge.
                     </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Dashboard (9/12 cols) */}
            <div className="lg:col-span-9 space-y-8">
              
              {/* Top Level KPIs */}
              <MetricsGrid summary={simulationResults.summary} daysCount={daysCount} />

              {/* Chart Section 1: Energy Mix */}
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/20 dark:border-slate-700/50 transition-colors duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Solar Generation vs EV Demand</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Real-time optimization of solar consumption (Typical 24h Profile)</p>
                  </div>
                  <div className="flex gap-4 text-xs font-medium">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <span className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]"></span> Solar
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span> Demand
                    </div>
                  </div>
                </div>
                <EnergyChart data={simulationResults.hourlyData} darkMode={isDarkMode} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Chart Section 2: Financials */}
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/20 dark:border-slate-700/50 transition-colors duration-300">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Cost Savings Analysis</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Grid Import costs with and without Solar</p>
                  </div>
                  <SavingsChart data={simulationResults.hourlyData} darkMode={isDarkMode} />
                </div>

                 {/* Chart Section 3: Battery */}
                 <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/20 dark:border-slate-700/50 transition-colors duration-300">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Battery State of Charge (SOC)</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Optimized charging/discharging cycle</p>
                  </div>
                  <BatteryChart data={simulationResults.hourlyData} capacity={inputs.batteryCapacityKWh} darkMode={isDarkMode} />
                </div>
              </div>

              {/* Bottom ROI Section */}
              <div className="bg-slate-900 dark:bg-black rounded-2xl p-8 text-white relative overflow-hidden border border-slate-800 dark:border-slate-800 shadow-2xl">
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                     <div>
                        <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Projected Annual ROI</h3>
                        <p className="text-slate-400 max-w-lg">
                          By combining electricity savings and carbon credit revenue, your station achieves faster breakeven.
                        </p>
                     </div>
                     <div className="text-right">
                        <div className="text-sm text-slate-400 uppercase tracking-wider mb-1">Annual Net Benefit</div>
                        <div className="text-4xl font-bold text-emerald-400 drop-shadow-sm">₹{(simulationResults.summary.totalDailyBenefit * 365).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                        <div className="text-xs text-emerald-300 bg-emerald-900/50 border border-emerald-800 px-2 py-1 rounded inline-block mt-2">
                          + {(simulationResults.summary.dailyCarbonCredits * 365).toFixed(1)} tons CO₂ Offset
                        </div>
                     </div>
                  </div>
                  {/* Decorative background element */}
                  <div className="absolute -right-20 -bottom-40 w-80 h-80 bg-emerald-500 rounded-full opacity-10 blur-3xl"></div>
                  <div className="absolute -left-20 -top-40 w-60 h-60 bg-blue-500 rounded-full opacity-5 blur-3xl"></div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;