import React from 'react';
import { Vehicle, VehicleStatus } from '../types';
import { Zap, Battery, BatteryCharging, Timer, CreditCard } from 'lucide-react';

interface LiveMonitorProps {
  vehicles: Vehicle[];
  currentRate: number;
}

const LiveMonitor: React.FC<LiveMonitorProps> = ({ vehicles, currentRate }) => {
  const activeVehicles = vehicles.filter(v => v.status === VehicleStatus.Charging);

  if (activeVehicles.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-6 h-full flex flex-col items-center justify-center text-slate-500">
        <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
          <Zap className="w-8 h-8 opacity-20" />
        </div>
        <p>No active charging sessions detected.</p>
        <p className="text-xs mt-2 text-slate-600">Connect a vehicle to monitor live stats.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-6 h-full overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <ActivityIcon />
          Live Monitor
        </h3>
        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-md border border-green-500/20 animate-pulse">
          LIVE FEED
        </span>
      </div>

      <div className="space-y-4 overflow-y-auto pr-2 scrollbar-hide">
        {activeVehicles.map(vehicle => (
          <div key={vehicle.id} className="bg-slate-800/40 rounded-xl p-4 border border-white/5 relative overflow-hidden group">
            <div className="flex justify-between items-center mb-3 relative z-10">
              <div>
                <h4 className="font-bold text-white">{vehicle.licensePlate}</h4>
                <p className="text-xs text-slate-400">{vehicle.model}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 mb-1">Current Power</p>
                <p className="font-mono text-yellow-400 font-bold flex items-center gap-1 justify-end">
                  <Zap className="w-3 h-3 fill-yellow-400" />
                  {vehicle.chargingType === 'Fast' ? '50.0' : '7.2'} kW
                </p>
              </div>
            </div>

            {/* Battery Visualization */}
            <div className="relative h-12 bg-slate-900/80 rounded-lg mb-3 overflow-hidden border border-white/5">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-400 transition-all duration-1000 ease-linear"
                style={{ width: `${vehicle.currentBatteryLevel}%` }}
              >
                <div className="w-full h-full opacity-30 animate-[shimmer_2s_infinite] bg-[linear-gradient(110deg,transparent,45%,rgba(255,255,255,0.3),55%,transparent)] bg-[length:250%_100%]"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <span className="font-mono font-bold text-white drop-shadow-md">{vehicle.currentBatteryLevel.toFixed(1)}%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs relative z-10">
              <div className="bg-slate-900/50 p-2 rounded flex items-center gap-2 text-slate-300">
                <Timer className="w-3 h-3 text-blue-400" />
                <span>Est: {Math.ceil((100 - vehicle.currentBatteryLevel) * 0.5)}m</span>
              </div>
              <div className="bg-slate-900/50 p-2 rounded flex items-center gap-2 text-slate-300">
                <CreditCard className="w-3 h-3 text-green-400" />
                <span>Rate: ₹{currentRate}/kWh</span>
              </div>
            </div>

            {/* Background Glow */}
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full pointer-events-none group-hover:bg-blue-500/20 transition-colors"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ActivityIcon = () => (
  <div className="relative w-4 h-4">
    <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
    <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500/20 border-2 border-green-500"></span>
  </div>
);

export default LiveMonitor;
