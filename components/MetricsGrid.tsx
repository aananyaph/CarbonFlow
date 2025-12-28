import React from 'react';
import { FinancialSummary } from '../types';
import { ICONS } from '../constants';

interface Props {
  summary: FinancialSummary;
  daysCount: number;
}

export const MetricsGrid: React.FC<Props> = ({ summary, daysCount }) => {
  
  // Helper to scale daily values to the selected period
  const totalSavings = summary.dailySolarSavings * daysCount;
  const totalRevenue = summary.dailyCarbonRevenue * daysCount;
  const totalBenefit = summary.totalDailyBenefit * daysCount;
  const totalEnergy = summary.solarSelfConsumption * daysCount;
  const totalCO2 = summary.dailyCO2Avoided * daysCount;
  
  // Calculate total carbon credits (1 credit = 1 ton usually)
  const totalCarbonCredits = summary.dailyCarbonCredits * daysCount;

  // Format label for period
  const periodLabel = daysCount > 1 ? `/${daysCount} days` : '/day';
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      
      {/* Card 1: Bill Savings */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-emerald-100 dark:border-slate-700 shadow-sm hover:shadow-lg dark:hover:shadow-emerald-900/20 hover:border-emerald-200 dark:hover:border-emerald-800/50 transition-all duration-300 group">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-emerald-50/30 to-emerald-100/20 dark:from-slate-800 dark:via-slate-800 dark:to-emerald-900/20 transition-colors" />
        
        <div className="relative z-10 p-5 flex flex-col h-full justify-between">
          <div className="flex items-start justify-between mb-4">
             <div>
               <p className="text-emerald-600/90 dark:text-emerald-400 text-[11px] font-bold uppercase tracking-wider mb-1">Bill Savings</p>
               <h3 className="text-slate-700 dark:text-slate-200 font-semibold text-sm leading-tight">Grid Cost Avoided</h3>
             </div>
             <div className="p-2.5 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-800/40 text-emerald-700 dark:text-emerald-300 rounded-xl shadow-sm border border-emerald-200/50 dark:border-emerald-700/50">
                {ICONS.Rupee}
             </div>
          </div>
          
          <div className="mb-4">
             <div className="flex items-baseline gap-1 flex-wrap">
               <span className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight break-all">
                 ₹{totalSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
               </span>
               <span className="text-sm font-medium text-slate-400 whitespace-nowrap">{periodLabel}</span>
             </div>
          </div>

          <div className="mt-auto bg-white/60 dark:bg-slate-900/50 backdrop-blur-sm rounded-lg p-3 border border-emerald-100/50 dark:border-emerald-900/30 flex items-center gap-3 shadow-sm">
             <div className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 p-1.5 rounded-full shrink-0">
               {ICONS.Trend}
             </div>
             <div className="min-w-0 flex-1">
               <div className="text-xs font-bold text-emerald-800 dark:text-emerald-200 truncate">
                 {summary.percentSelfPowered}% Bill Reduction
               </div>
               <div className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70 truncate">
                 vs Grid-only setup
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Card 2: Carbon Credits (Displays Quantity in Tons) */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 dark:bg-slate-950 border border-slate-800 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-emerald-900/10 transition-all duration-300 group">
         <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900/40 dark:from-slate-950 dark:via-emerald-950/20 dark:to-emerald-900/30" />

        <div className="relative z-10 p-5 flex flex-col h-full justify-between">
           <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-emerald-400/90 text-[11px] font-bold uppercase tracking-wider mb-1">Carbon Credits</p>
              <h3 className="text-slate-200 font-semibold text-sm leading-tight">Accrued Asset</h3>
            </div>
             <div className="p-2.5 bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl shadow-sm">
              {ICONS.Leaf}
            </div>
          </div>

          <div className="mb-4">
             <div className="flex items-baseline gap-1 flex-wrap">
               <span className="text-3xl font-bold text-white tracking-tight break-all">
                 {totalCarbonCredits.toLocaleString(undefined, { maximumFractionDigits: 2 })}
               </span>
               <span className="text-sm font-medium text-slate-500 whitespace-nowrap"> Credits (Tons)</span>
             </div>
          </div>

          <div className="mt-auto flex items-center gap-2">
            <span className="bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1.5 rounded-md text-xs text-emerald-300 font-medium truncate w-full text-center shadow-inner shadow-emerald-900/50">
              Est. Value: ₹{totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      </div>

      {/* Card 3: Solar Energy Used */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-blue-100 dark:border-slate-700 shadow-sm hover:shadow-lg dark:hover:shadow-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800/50 transition-all duration-300 group">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-blue-100/20 dark:from-slate-800 dark:via-slate-800 dark:to-blue-900/20" />
        
        <div className="relative z-10 p-5 flex flex-col h-full justify-between">
          <div className="flex items-start justify-between mb-4">
             <div>
              <p className="text-blue-600/90 dark:text-blue-400 text-[11px] font-bold uppercase tracking-wider mb-1">Energy Saved</p>
              <h3 className="text-slate-700 dark:text-slate-200 font-semibold text-sm leading-tight">Grid Power Replaced</h3>
            </div>
            <div className="p-2.5 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 text-blue-600 dark:text-blue-300 rounded-xl shadow-sm border border-blue-200/50 dark:border-blue-700/50">
               {ICONS.Sun}
            </div>
          </div>

          <div className="mb-4">
             <div className="flex items-baseline gap-1 flex-wrap">
               <span className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight break-all">
                 {totalEnergy.toLocaleString(undefined, { maximumFractionDigits: 0 })}
               </span>
               <span className="text-lg font-semibold text-slate-400">kWh</span>
             </div>
          </div>

           <div className="mt-auto space-y-2">
             <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                <span>Solar Utility</span>
                <span>{summary.percentSelfPowered}%</span>
             </div>
             <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden border border-slate-100/50 dark:border-slate-600">
               <div 
                 className="bg-gradient-to-r from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-400 h-full rounded-full shadow-sm" 
                 style={{ width: `${Math.min(summary.percentSelfPowered, 100)}%` }}
               ></div>
             </div>
           </div>
        </div>
      </div>

      {/* Card 4: Total Value */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-teal-100 dark:border-slate-700 shadow-sm hover:shadow-lg dark:hover:shadow-teal-900/20 hover:border-teal-200 dark:hover:border-teal-800/50 transition-all duration-300 group">
         <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/30 dark:from-slate-800 dark:via-teal-900/10 dark:to-emerald-900/10" />
         
        <div className="relative z-10 p-5 flex flex-col h-full justify-between">
          <div className="flex items-start justify-between mb-4">
             <div>
              <p className="text-teal-700/90 dark:text-teal-400 text-[11px] font-bold uppercase tracking-wider mb-1">Total Value</p>
              <h3 className="text-emerald-900 dark:text-emerald-100 font-semibold text-sm leading-tight">Net Profit</h3>
            </div>
             <div className="p-2.5 bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/40 dark:to-teal-800/40 text-teal-800 dark:text-teal-300 rounded-xl shadow-sm border border-teal-200/50 dark:border-teal-700/50">
               {ICONS.Trend}
            </div>
          </div>

          <div className="mb-3">
             <span className="text-3xl font-bold text-emerald-900 dark:text-emerald-100 block tracking-tight break-all">
               ₹{totalBenefit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
             </span>
          </div>
          
           <div className="mt-auto bg-white/60 dark:bg-slate-900/50 backdrop-blur-sm p-2.5 rounded-lg border border-teal-100 dark:border-teal-900/30 shadow-sm">
             <div className="flex justify-between items-center text-xs text-emerald-900/80 dark:text-emerald-200/80 mb-1.5 border-b border-teal-100 dark:border-teal-800 pb-1.5">
                <span className="font-medium">Bill Savings</span>
                <span className="font-bold">₹{totalSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
             </div>
             <div className="flex justify-between items-center text-xs text-emerald-900/80 dark:text-emerald-200/80 pt-0.5">
                <span className="font-medium">Total Carbon Credits</span>
                <span className="font-bold">{totalCarbonCredits.toLocaleString(undefined, { maximumFractionDigits: 2 })} Credits</span>
             </div>
           </div>
        </div>
      </div>

    </div>
  );
};