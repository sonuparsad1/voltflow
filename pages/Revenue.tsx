import React from 'react';
import { ChargingSession } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { DollarSign, TrendingUp, CreditCard, Wallet } from 'lucide-react';
import StatsCard from '../components/StatsCard';

interface RevenueProps {
  sessions: ChargingSession[];
}

const Revenue: React.FC<RevenueProps> = ({ sessions }) => {
  const totalRevenue = sessions.reduce((acc, s) => acc + s.cost, 0);
  const averageTicket = totalRevenue / (sessions.length || 1);
  
  // Prepare Daily Data
  const dailyDataMap = new Map<string, number>();
  sessions.forEach(s => {
    const date = new Date(s.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    dailyDataMap.set(date, (dailyDataMap.get(date) || 0) + s.cost);
  });
  
  // Sort by date (naive approach for demo, assumes data relatively sorted or small range)
  const chartData = Array.from(dailyDataMap.entries())
    .map(([name, value]) => ({ name, value }))
    .slice(-7); // Last 7 days

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Total Lifetime Revenue" 
          value={`₹${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} 
          icon={DollarSign} 
          color="green"
          trend="up"
          trendValue="15.4%"
        />
        <StatsCard 
          title="Avg. Revenue / Session" 
          value={`₹${averageTicket.toFixed(2)}`} 
          icon={CreditCard} 
          color="blue"
          trend="up"
          trendValue="2.1%"
        />
        <StatsCard 
          title="Projected Monthly" 
          value={`₹${(totalRevenue * 1.2).toLocaleString(undefined, { maximumFractionDigits: 0 })}`} 
          icon={TrendingUp} 
          color="purple"
          subValue="Based on current trend"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Revenue Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-6">Revenue Trend (Last 7 Days)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  cursor={{fill: '#334155', opacity: 0.2}}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40}>
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#34d399' : '#059669'} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transactions List */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 max-h-[300px] scrollbar-hide">
                {sessions.slice(0, 8).map(session => (
                    <div key={session.id} className="flex items-center justify-between p-3 bg-slate-800/40 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                                <Wallet className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">Payment Received</p>
                                <p className="text-[10px] text-slate-500">{new Date(session.startTime).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <span className="font-mono font-bold text-white">
                            +₹{session.cost.toFixed(2)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Revenue;
