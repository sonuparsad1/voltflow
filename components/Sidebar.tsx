import React from 'react';
import { 
  LayoutDashboard, 
  Car, 
  Zap, 
  DollarSign, 
  BarChart2, 
  Settings, 
  LogOut, 
  Activity,
  User as UserIcon,
  Clock
} from 'lucide-react';
import { TabView, SystemSettings, User } from '../types';

interface SidebarProps {
  activeTab: TabView;
  setActiveTab: (tab: TabView) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentTime: Date;
  isOnline: boolean;
  currentUser: User | null;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  isOpen, 
  setIsOpen,
  currentTime,
  isOnline,
  currentUser,
  onLogout
}) => {
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'vehicles', label: 'Vehicles', icon: Car },
    { id: 'sessions', label: 'Charging Sessions', icon: Zap },
    { id: 'revenue', label: 'Revenue', icon: DollarSign },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <aside 
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out glass-panel border-r-0 border-r-white/10 ${isOpen ? 'w-64' : 'w-20'}`}
    >
      <div className="flex flex-col h-full py-6 px-4">
        
        {/* Profile / Brand */}
        <div className="flex items-center gap-3 mb-8 pl-1">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-bold text-lg overflow-hidden">
               {currentUser ? (
                  currentUser.name.charAt(0).toUpperCase()
               ) : (
                 <Zap className="w-6 h-6 text-white" />
               )}
            </div>
            <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
          </div>
          {isOpen && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300 overflow-hidden">
              <h1 className="font-bold text-white truncate max-w-[150px]">
                {currentUser ? currentUser.name : 'VOLTFLOW'}
              </h1>
              <p className="text-xs text-slate-400 truncate capitalize">
                {currentUser ? currentUser.role : 'Station OS'}
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabView)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden
                ${activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <item.icon className={`w-5 h-5 transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
              
              {isOpen && (
                <span className="font-medium whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-200">
                  {item.label}
                </span>
              )}
              
              {activeTab === item.id && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white/30 rounded-l-full blur-[1px]"></div>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto space-y-4">
          {/* Status Card */}
          {isOpen && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-mono">SYSTEM TIME</span>
                <Clock className="w-3 h-3 text-blue-400" />
              </div>
              <div className="text-xl font-mono text-white font-bold tracking-tight">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {currentTime.toLocaleDateString()}
              </div>
            </div>
          )}

          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {isOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
