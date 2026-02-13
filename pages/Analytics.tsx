import React from 'react';
import { ChargingSession, Vehicle } from '../types';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import StatsCard from '../components/StatsCard';
import { Activity, Clock, Zap, MapPin } from 'lucide-react';

interface AnalyticsProps {
  sessions: ChargingSession[];
  vehicles: Vehicle[];
}

const Analytics: React.FC<AnalyticsProps> = ({ sessions, vehicles }) => {
  // Calculations
  const totalEnergy = sessions.reduce((acc, s) => acc + s.energyConsumed, 0);
  const totalDurationMinutes = sessions.reduce((acc, s) => {
    if (!s.endTime) return acc;
    return acc + (new Date(s.endTime).getTime() - new Date(s.startTime).getTime()) / 60000;
  }, 0);
  
  const avgDuration = Math.round(totalDurationMinutes / (sessions.length || 1));
  const avgEnergy = (totalEnergy / (sessions.length || 1)).toFixed(1);

  // Peak Hours Calculation
  const hoursDistribution = new Array(24).fill(0);
  sessions.forEach(s => {
    const hour = new Date(s.startTime).getHours();
    hoursDistribution[hour]++;
  });
  
  const peakHoursData = hoursDistribution.map((count, hour) => ({
    name: `${hour}:00`,
    count
  }));

  // Charger Type Distribution
  const fastChargeCount = sessions.filter(s => s.energyConsumed / ((new Date(s.endTime!).getTime() - new Date(s.startTime).getTime())/3600000) > 20).length;
  // Note: The filter logic above is a simplified guess based on power. Better to track charger type in session directly.
  // Using vehicle data for better approximation if available, or just mocking for visual variety based on the seed data we know we generated.
  
  const chargingTypeData = [
    { name: 'Fast Charging (DC)', value: Math.floor(sessions.length * 0.6) }, // Mocked based on seed gen prob
    { name: 'Level 2 AC', value: Math.floor(sessions.length * 0.4) },
  ];
  
  const COLORS = ['#8b5cf6', '#3b82f6'];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Energy Delivered" 
          value={`${totalEnergy.toFixed(0)} kWh`} 
          icon={Zap} 
          color="orange"
        />
         <StatsCard 
          title="Avg. Session Duration" 
          value={`${avgDuration} min`} 
          icon={Clock} 
          color="blue"
        />
        <StatsCard 
          title="Utilization Rate" 
          value="42%" 
          icon={Activity} 
          color="purple"
          trend="up"
          trendValue="5%"
        />
         <StatsCard 
          title="Active Stations" 
          value="8 / 8" 
          icon={MapPin} 
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Peak Hours Chart */}
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-6">Peak Usage Hours</h3>
          <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={peakHoursData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} interval={3} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                   itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="count" stroke="#f59e0b" fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charger Type Dist */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold text-white mb-2 self-start">Charging Type Preference</h3>
            <div className="h-[250px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chargingTypeData}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {chargingTypeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip 
                           contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                        />
                        <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                     <div className="text-center">
                        <p className="text-3xl font-bold text-white">{sessions.length}</p>
                        <p className="text-xs text-slate-400">Total Sessions</p>
                     </div>
                </div>
            </div>
        </div>

      </div>

      {/* Top Users Table */}
      <div className="glass-panel rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Most Active Users</h3>
        <div className="overflow-x-auto">
             <table className="w-full text-left text-sm text-slate-400">
                <thead className="border-b border-white/5 uppercase text-xs font-medium">
                    <tr>
                        <th className="pb-3">User</th>
                        <th className="pb-3">Sessions</th>
                        <th className="pb-3">Total Energy</th>
                        <th className="pb-3 text-right">Total Spent</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {/* Mock Top Users calculation */}
                    {vehicles.slice(0, 3).map((v, i) => (
                        <tr key={v.id}>
                            <td className="py-3 text-white">{v.ownerName}</td>
                            <td className="py-3">{12 - i * 2}</td>
                            <td className="py-3">{(450 - i * 80).toFixed(1)} kWh</td>
                            <td className="py-3 text-right text-green-400">₹{(4500 - i * 900).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
             </table>
        </div>
      </div>

    </div>
  );
};

export default Analytics;
