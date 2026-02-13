import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color: 'blue' | 'purple' | 'green' | 'orange';
  animate?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  subValue, 
  icon: Icon, 
  trend, 
  trendValue, 
  color,
  animate = false
}) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 shadow-blue-500/20 text-blue-400',
    purple: 'from-purple-500 to-purple-600 shadow-purple-500/20 text-purple-400',
    green: 'from-emerald-500 to-emerald-600 shadow-emerald-500/20 text-emerald-400',
    orange: 'from-orange-500 to-orange-600 shadow-orange-500/20 text-orange-400',
  };

  const bgGradient = {
    blue: 'bg-blue-500/10 border-blue-500/20',
    purple: 'bg-purple-500/10 border-purple-500/20',
    green: 'bg-emerald-500/10 border-emerald-500/20',
    orange: 'bg-orange-500/10 border-orange-500/20',
  };

  return (
    <div className={`glass-panel p-5 rounded-2xl relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 ${bgGradient[color]}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-bold text-white font-mono tracking-tight">{value}</h3>
            {subValue && <span className="text-sm text-slate-500">{subValue}</span>}
          </div>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} bg-opacity-10 shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      
      {(trend || trendValue) && (
        <div className="flex items-center gap-2 text-xs">
          {trend === 'up' && <span className="text-green-400">↑ {trendValue}</span>}
          {trend === 'down' && <span className="text-red-400">↓ {trendValue}</span>}
          <span className="text-slate-500">vs last month</span>
        </div>
      )}

      {/* Decorative Glow */}
      <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full blur-3xl opacity-20 ${colorClasses[color].split(' ')[0]}`}></div>
      
      {animate && (
        <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse m-2 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
      )}
    </div>
  );
};

export default StatsCard;
