import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { HourlyDataPoint } from '../../types';
import { THEME } from '../../constants';

interface Props {
  data: HourlyDataPoint[];
  darkMode?: boolean;
}

export const SavingsChart: React.FC<Props> = ({ data, darkMode = false }) => {
  const axisColor = darkMode ? '#94a3b8' : '#64748b';
  const gridColor = darkMode ? '#334155' : '#e2e8f0';
  const tooltipBg = darkMode ? '#1e293b' : '#ffffff';
  const tooltipText = darkMode ? '#f1f5f9' : '#0f172a';

  // Aggregate data into 4-hour blocks for better bar chart visualization
  const aggregatedData = [];
  for (let i = 0; i < 24; i += 4) {
    const chunk = data.slice(i, i + 4);
    aggregatedData.push({
      timeBlock: `${i}:00 - ${i+4}:00`,
      costWithoutSolar: chunk.reduce((acc, cur) => acc + cur.costWithoutSolar, 0).toFixed(1),
      costWithSolar: chunk.reduce((acc, cur) => acc + cur.costWithSolar, 0).toFixed(1),
    });
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={aggregatedData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
             <linearGradient id="gridCostGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <linearGradient id="solarCostGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis 
            dataKey="timeBlock" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            tickMargin={10} 
            stroke={axisColor} 
          />
          <YAxis 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            stroke={axisColor} 
            unit="₹" 
          />
          <Tooltip 
             cursor={{fill: darkMode ? '#334155' : '#f8fafc'}}
             contentStyle={{ 
               borderRadius: '8px', 
               border: 'none', 
               boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
               backgroundColor: tooltipBg,
               color: tooltipText
             }}
          />
          <Legend verticalAlign="top" height={36} iconType="circle" />
          <Bar name="Grid Cost (Standard)" dataKey="costWithoutSolar" fill="url(#gridCostGradient)" radius={[4, 4, 0, 0]} barSize={20} />
          <Bar name="Cost with Solar" dataKey="costWithSolar" fill="url(#solarCostGradient)" radius={[4, 4, 0, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};