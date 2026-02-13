import React from 'react';
import { SystemSettings } from '../types';
import { Save, RefreshCw, Download } from 'lucide-react';

interface SettingsPageProps {
  settings: SystemSettings;
  onSave: (s: SystemSettings) => void;
  onReset: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ settings, onSave, onReset }) => {
  const [formData, setFormData] = React.useState<SystemSettings>(settings);

  const handleChange = (key: keyof SystemSettings, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="glass-panel rounded-2xl overflow-hidden p-8">
        <h2 className="text-2xl font-bold text-white mb-6">System Configuration</h2>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Rates Section */}
          <div>
            <h3 className="text-sm font-medium text-blue-400 uppercase tracking-wider mb-4 border-b border-white/5 pb-2">Electricity Rates</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-slate-400 text-sm">Base Rate ({formData.currency}/kWh)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={formData.baseRate}
                  onChange={e => handleChange('baseRate', parseFloat(e.target.value))}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors font-mono"
                />
              </div>
              <div className="space-y-2">
                <label className="text-slate-400 text-sm">Peak Hour Rate</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={formData.peakRate}
                  onChange={e => handleChange('peakRate', parseFloat(e.target.value))}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors font-mono border-red-500/30 focus:border-red-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-slate-400 text-sm">Off-Peak Rate</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={formData.offPeakRate}
                  onChange={e => handleChange('offPeakRate', parseFloat(e.target.value))}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors font-mono border-emerald-500/30 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Time Configuration */}
          <div>
            <h3 className="text-sm font-medium text-blue-400 uppercase tracking-wider mb-4 border-b border-white/5 pb-2">Peak Hours Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-slate-400 text-sm">Peak Start Hour (24h)</label>
                <input 
                  type="number" 
                  min="0" max="23"
                  value={formData.peakStartHour}
                  onChange={e => handleChange('peakStartHour', parseInt(e.target.value))}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-slate-400 text-sm">Peak End Hour (24h)</label>
                <input 
                  type="number" 
                  min="0" max="23"
                  value={formData.peakEndHour}
                  onChange={e => handleChange('peakEndHour', parseInt(e.target.value))}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Station Config */}
          <div>
            <h3 className="text-sm font-medium text-blue-400 uppercase tracking-wider mb-4 border-b border-white/5 pb-2">Station Infrastructure</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-slate-400 text-sm">Total Charging Slots</label>
                <input 
                  type="number" 
                  value={formData.totalSlots}
                  onChange={e => handleChange('totalSlots', parseInt(e.target.value))}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-slate-400 text-sm">Currency Symbol</label>
                <input 
                  type="text" 
                  value={formData.currency}
                  onChange={e => handleChange('currency', e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-4 border-t border-white/10">
            <button 
              type="submit" 
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-600/25"
            >
              <Save className="w-5 h-5" /> Save Changes
            </button>
            <button 
              type="button"
              className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-all"
            >
              <Download className="w-5 h-5" /> Export Data
            </button>
            <div className="flex-1"></div>
            <button 
              type="button"
              onClick={onReset}
              className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl font-medium transition-all"
            >
              <RefreshCw className="w-5 h-5" /> Reset System
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
