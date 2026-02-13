import React from 'react';
import { Vehicle, SystemSettings, VehicleStatus, ChargingSession } from '../types';
import StatsCard from '../components/StatsCard';
import LiveMonitor from '../components/LiveMonitor';
import { 
  Car, 
  Zap, 
  DollarSign, 
  Battery, 
  Clock,
  Sun,
  Moon
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

interface DashboardProps {
  vehicles: Vehicle[];
  settings: SystemSettings;
  sessions: ChargingSession[];
  isPeakHour: boolean;
  totalRevenue: number;
  todayEnergy: number;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  vehicles, 
  settings, 
  sessions,
  isPeakHour,
  totalRevenue,
  todayEnergy
}) => {
  const activeCount = vehicles.filter(v => v.status === VehicleStatus.Charging).length;
  const availableSlots = settings.totalSlots - activeCount;
  const currentRate = isPeakHour ? settings.peakRate : settings.offPeakRate;

  // Mock data generation for graphs
  const revenueData = [
    { name: 'Mon', value: 4000 },
    { name: 'Tue', value: 3000 },
    { name: 'Wed', value: 5000 },
    { name: 'Thu', value: 2780 },
    { name: 'Fri', value: 1890 },
    { name: 'Sat', value: 6390 },
    { name: 'Sun', value: 3490 },
  ];

  const chargingTypeData = [
    { name: 'Fast', value: vehicles.filter(v => v.chargingType === 'Fast').length },
    { name: 'Normal', value: vehicles.filter(v => v.chargingType === 'Normal').length },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Vehicles" 
          value={vehicles.length} 
          icon={Car} 
          color="blue"
          trend="up"
          trendValue="12%"
        />
        <StatsCard 
          title="Active Sessions" 
          value={activeCount}
          subValue={`/ ${settings.totalSlots} Slots`}
          icon={Zap} 
          color="green"
          animate={activeCount > 0}
        />
        <StatsCard 
          title="Total Revenue" 
          value={`${settings.currency}${totalRevenue.toLocaleString()}`} 
          icon={DollarSign} 
          color="purple"
          trend="up"
          trendValue="8.2%"
        />
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50">
           <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Current Rate</p>
                <div className="flex items-center gap-2 mt-1">
                   <h3 className="text-2xl font-bold text-white font-mono">
                     {settings.currency}{currentRate}
                     <span className="text-sm text-slate-500">/kWh</span>
                   </h3>
                </div>
                <div className={`inline-flex items-center gap-1 mt-3 px-2 py-1 rounded-md text-xs font-medium border ${isPeakHour ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                  {isPeakHour ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                  {isPeakHour ? 'PEAK HOURS ACTIVE' : 'OFF-PEAK RATE'}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-700/50">
                <Clock className="w-5 h-5 text-white" />
              </div>
           </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart Section */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Revenue Analytics</h3>
            <select className="bg-slate-800 text-slate-300 text-sm border border-slate-700 rounded-lg px-3 py-1 outline-none focus:border-blue-500">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${settings.currency}${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Monitor Section */}
        <div className="lg:col-span-1">
          <LiveMonitor vehicles={vehicles} currentRate={currentRate} />
        </div>
      </div>

      {/* Secondary Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl">
           <h3 className="text-lg font-semibold text-white mb-6">Today's Energy Delivery</h3>
           <div className="flex items-center justify-between">
              <div className="space-y-1">
                 <p className="text-4xl font-mono font-bold text-white">{todayEnergy.toFixed(1)} <span className="text-lg text-slate-500">kWh</span></p>
                 <p className="text-green-400 text-sm flex items-center gap-1">
                   <Zap className="w-3 h-3" /> +14% vs yesterday
                 </p>
              </div>
              <div className="h-[100px] w-[150px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chargingTypeData}>
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {chargingTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#8b5cf6' : '#10b981'} />
                        ))}
                      </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>
           <div className="mt-4 flex gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-purple-500"></div> Fast Charging
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-emerald-500"></div> Normal
              </div>
           </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center">
             <h3 className="text-lg font-semibold text-white mb-2">Slot Availability</h3>
             <div className="space-y-6 mt-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300">Fast Chargers</span>
                    <span className="text-white font-bold">{Math.floor(availableSlots / 2)} / {Math.floor(settings.totalSlots / 2)} Available</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300">Standard Chargers</span>
                    <span className="text-white font-bold">{Math.ceil(availableSlots / 2)} / {Math.ceil(settings.totalSlots / 2)} Available</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
             </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
