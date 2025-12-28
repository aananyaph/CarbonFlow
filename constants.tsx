import React from 'react';
import { 
  Sun, 
  Moon,
  BatteryCharging, 
  Zap, 
  Leaf, 
  TrendingUp, 
  IndianRupee, 
  Building2, 
  Home, 
  School,
  Settings,
  MapPin
} from 'lucide-react';

export const ICONS = {
  Sun: <Sun className="w-5 h-5" />,
  Moon: <Moon className="w-5 h-5" />,
  Battery: <BatteryCharging className="w-5 h-5" />,
  Grid: <Zap className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Leaf: <Leaf className="w-5 h-5" />,
  Trend: <TrendingUp className="w-5 h-5" />,
  Rupee: <IndianRupee className="w-5 h-5" />,
  TechPark: <Building2 className="w-4 h-4" />,
  Home: <Home className="w-4 h-4" />,
  Institution: <School className="w-4 h-4" />,
  Settings: <Settings className="w-5 h-5" />,
  Map: <MapPin className="w-5 h-5" />
};

export const THEME = {
  colors: {
    primary: '#16a34a', // emerald-600
    secondary: '#0f172a', // slate-900
    grid: '#ef4444', // red-500
    solar: '#eab308', // yellow-500
    demand: '#3b82f6', // blue-500
  }
};