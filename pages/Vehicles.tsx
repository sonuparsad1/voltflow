import React, { useState } from 'react';
import { Vehicle, VehicleStatus } from '../types';
import { Search, Filter, MoreVertical, Plus, Battery, Zap, Trash2, Edit } from 'lucide-react';

interface VehiclesProps {
  vehicles: Vehicle[];
  onAddVehicle: (v: Vehicle) => void;
  onUpdateVehicle: (v: Vehicle) => void;
  onDeleteVehicle: (id: string) => void;
}

const Vehicles: React.FC<VehiclesProps> = ({ vehicles, onAddVehicle, onDeleteVehicle }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Vehicle Form State
  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({
    ownerName: '',
    model: '',
    licensePlate: '',
    batteryCapacity: 60,
    currentBatteryLevel: 50,
    chargingType: 'Normal',
    status: VehicleStatus.Idle
  });

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || v.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: VehicleStatus) => {
    switch (status) {
      case VehicleStatus.Charging: return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case VehicleStatus.Completed: return 'bg-green-500/10 text-green-400 border-green-500/20';
      case VehicleStatus.Idle: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case VehicleStatus.Offline: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v: Vehicle = {
        id: Math.random().toString(36).substr(2, 9),
        ownerName: newVehicle.ownerName || 'Unknown',
        model: newVehicle.model || 'Generic EV',
        licensePlate: newVehicle.licensePlate || 'NEW-001',
        batteryCapacity: newVehicle.batteryCapacity || 60,
        currentBatteryLevel: newVehicle.currentBatteryLevel || 0,
        status: newVehicle.status || VehicleStatus.Idle,
        joinedDate: new Date().toISOString().split('T')[0],
        chargingType: newVehicle.chargingType as 'Fast' | 'Normal' || 'Normal'
    };
    onAddVehicle(v);
    setIsModalOpen(false);
    setNewVehicle({}); // Reset
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex gap-2 bg-slate-800/50 p-1 rounded-xl border border-white/10 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search vehicles..." 
              className="w-full bg-transparent text-sm pl-10 pr-4 py-2 text-white outline-none placeholder:text-slate-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <select 
            className="bg-slate-800/50 text-slate-300 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value={VehicleStatus.Charging}>Charging</option>
            <option value={VehicleStatus.Idle}>Idle</option>
            <option value={VehicleStatus.Completed}>Completed</option>
          </select>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" /> Add Vehicle
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-800/50 uppercase font-medium text-xs tracking-wider text-slate-300">
              <tr>
                <th className="px-6 py-4">Vehicle Info</th>
                <th className="px-6 py-4">Owner</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Battery</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-white">{vehicle.licensePlate}</div>
                      <div className="text-xs">{vehicle.model}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center text-[10px] text-white font-bold">
                        {vehicle.ownerName.charAt(0)}
                      </div>
                      {vehicle.ownerName}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(vehicle.status)}`}>
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <Battery className={`w-4 h-4 ${vehicle.currentBatteryLevel < 20 ? 'text-red-400' : 'text-green-400'}`} />
                       <span className="font-mono">{vehicle.currentBatteryLevel.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {vehicle.chargingType === 'Fast' ? (
                        <span className="text-purple-400 flex items-center gap-1 text-xs">
                            <Zap className="w-3 h-3 fill-purple-400" /> Fast
                        </span>
                    ) : (
                        <span className="text-slate-400 text-xs">Normal</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
                            <Edit className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => onDeleteVehicle(vehicle.id)}
                            className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredVehicles.length === 0 && (
            <div className="p-12 text-center text-slate-500">
                No vehicles found matching your criteria.
            </div>
        )}
      </div>

      {/* Simple Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="glass-panel w-full max-w-md rounded-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
                <h2 className="text-xl font-bold text-white mb-4">Register New Vehicle</h2>
                <form onSubmit={handleAddSubmit} className="space-y-4">
                    <input 
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
                        placeholder="Owner Name"
                        required
                        value={newVehicle.ownerName}
                        onChange={e => setNewVehicle({...newVehicle, ownerName: e.target.value})}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <input 
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
                            placeholder="Model"
                            required
                            value={newVehicle.model}
                            onChange={e => setNewVehicle({...newVehicle, model: e.target.value})}
                        />
                        <input 
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
                            placeholder="License Plate"
                            required
                            value={newVehicle.licensePlate}
                            onChange={e => setNewVehicle({...newVehicle, licensePlate: e.target.value})}
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                         <select 
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-300 outline-none focus:border-blue-500 transition-colors"
                            value={newVehicle.chargingType}
                            onChange={e => setNewVehicle({...newVehicle, chargingType: e.target.value as 'Fast' | 'Normal'})}
                         >
                            <option value="Normal">Normal Charging</option>
                            <option value="Fast">Fast Charging</option>
                         </select>
                         <input 
                            type="number"
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
                            placeholder="Capacity (kWh)"
                            value={newVehicle.batteryCapacity}
                            onChange={e => setNewVehicle({...newVehicle, batteryCapacity: Number(e.target.value)})}
                        />
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button 
                            type="button" 
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20"
                        >
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default Vehicles;
