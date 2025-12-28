import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { HourlyDataPoint } from '../../types';
import { THEME } from '../../constants';

interface Props {
  data: HourlyDataPoint[];
  darkMode?: boolean;
}

export const EnergyChart: React.FC<Props> = ({ data, darkMode = false }) => {
  const axisColor = darkMode ? '#94a3b8' : '#64748b';
  const gridColor = darkMode ? '#334155' : '#e2e8f0';
  const tooltipBg = darkMode ? '#1e293b' : '#ffffff';
  const tooltipText = darkMode ? '#f1f5f9' : '#0f172a';

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={THEME.colors.solar} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={THEME.colors.solar} stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={THEME.colors.demand} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={THEME.colors.demand} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis 
            dataKey="hour" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickMargin={10} 
            stroke={axisColor} 
            interval={3} 
          />
          <YAxis 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            stroke={axisColor} 
            label={{ value: 'kW', angle: -90, position: 'insideLeft', style: { fill: axisColor } }} 
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '8px', 
              border: 'none', 
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              backgroundColor: tooltipBg,
              color: tooltipText
            }}
          />
          <Legend verticalAlign="top" height={36} iconType="circle" />
          <Area 
            type="monotone" 
            dataKey="solarGeneration" 
            name="Solar Generation"
            stroke={THEME.colors.solar} 
            fillOpacity={1} 
            fill="url(#colorSolar)" 
            stackId="1" 
          />
          <Area 
            type="monotone" 
            dataKey="evDemand" 
            name="EV Charging Demand"
            stroke={THEME.colors.demand} 
            fillOpacity={1} 
            fill="url(#colorDemand)" 
            stackId="2"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};