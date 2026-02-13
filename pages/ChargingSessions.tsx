import React, { useState } from 'react';
import { ChargingSession, Vehicle } from '../types';
import { Search, Filter, Calendar, Zap, Download } from 'lucide-react';

interface ChargingSessionsProps {
  sessions: ChargingSession[];
  vehicles: Vehicle[];
}

const ChargingSessions: React.FC<ChargingSessionsProps> = ({ sessions, vehicles }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const getVehicleName = (id: string) => {
    const v = vehicles.find(veh => veh.id === id);
    return v ? `${v.ownerName} (${v.licensePlate})` : 'Unknown Vehicle';
  };

  const filteredSessions = sessions.filter(s => {
    const vName = getVehicleName(s.vehicleId).toLowerCase();
    return vName.includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
  };

  const getDuration = (start: string, end?: string) => {
    if (!end) return 'In Progress';
    const diff = new Date(end).getTime() - new Date(start).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex gap-2 bg-slate-800/50 p-1 rounded-xl border border-white/10 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search sessions..." 
              className="w-full bg-transparent text-sm pl-10 pr-4 py-2 text-white outline-none placeholder:text-slate-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button className="bg-slate-800/50 hover:bg-slate-700 text-slate-300 border border-white/10 rounded-xl px-4 py-2 text-sm flex items-center gap-2 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="bg-slate-800/50 hover:bg-slate-700 text-slate-300 border border-white/10 rounded-xl px-4 py-2 text-sm flex items-center gap-2 transition-colors">
            <Calendar className="w-4 h-4" /> Date Range
          </button>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-blue-600/20">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-800/50 uppercase font-medium text-xs tracking-wider text-slate-300">
              <tr>
                <th className="px-6 py-4">Session ID</th>
                <th className="px-6 py-4">Vehicle / Owner</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Energy</th>
                <th className="px-6 py-4 text-right">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredSessions.map((session) => (
                <tr key={session.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">{session.id}</td>
                  <td className="px-6 py-4">
                    <div className="text-white font-medium">{getVehicleName(session.vehicleId)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col text-xs">
                      <span className="text-white">{formatDate(session.startTime)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs border border-slate-700">
                      {getDuration(session.startTime, session.endTime)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-yellow-500" />
                      <span className="text-white font-mono">{session.energyConsumed.toFixed(2)} kWh</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-mono text-green-400 font-bold">
                       ₹{session.cost.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-slate-500">
                       Rate: ₹{session.rateApplied}/kWh
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredSessions.length === 0 && (
          <div className="p-12 text-center text-slate-500">No sessions found.</div>
        )}
      </div>
    </div>
  );
};

export default ChargingSessions;
