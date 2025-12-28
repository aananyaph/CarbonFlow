import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { HourlyDataPoint } from '../../types';

interface Props {
  data: HourlyDataPoint[];
  capacity: number;
  darkMode?: boolean;
}

export const BatteryChart: React.FC<Props> = ({ data, capacity, darkMode = false }) => {
  const axisColor = darkMode ? '#94a3b8' : '#64748b';
  const gridColor = darkMode ? '#334155' : '#e2e8f0';
  const tooltipBg = darkMode ? '#1e293b' : '#ffffff';
  const tooltipText = darkMode ? '#f1f5f9' : '#0f172a';

  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis 
            dataKey="hour" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            tickMargin={10} 
            stroke={axisColor} 
            interval={3} 
          />
          <YAxis 
            domain={[0, capacity]} 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            stroke={axisColor} 
            label={{ value: 'kWh', angle: -90, position: 'insideLeft', style: { fill: axisColor, fontSize: 10 } }} 
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
          <ReferenceLine y={capacity} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Max', fill: '#ef4444', fontSize: 10 }} />
          <Line 
            type="monotone" 
            dataKey="batteryLevel" 
            stroke="#2563eb" 
            strokeWidth={2} 
            dot={false}
            name="Battery Level"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};