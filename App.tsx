import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import SettingsPage from './pages/SettingsPage';
import AuthPage from './pages/AuthPage';
import ChargingSessions from './pages/ChargingSessions';
import Revenue from './pages/Revenue';
import Analytics from './pages/Analytics';
import { 
  getVehicles, 
  saveVehicles, 
  getSettings, 
  saveSettings,
  getSessions,
  saveSessions,
  getCurrentUser,
  logoutUser
} from './services/storageService';
import { TabView, Vehicle, SystemSettings, ChargingSession, VehicleStatus, User } from './types';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  // --- Auth State ---
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // --- App State ---
  const [activeTab, setActiveTab] = useState<TabView>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Data
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [settings, setSettings] = useState<SystemSettings>(getSettings());
  const [sessions, setSessions] = useState<ChargingSession[]>([]);
  
  // Derived State
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [todayEnergy, setTodayEnergy] = useState(0);
  const [isPeakHour, setIsPeakHour] = useState(false);

  // --- Initialization ---
  useEffect(() => {
    // Check for auth
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setIsLoadingAuth(false);

    // Load Data
    setVehicles(getVehicles());
    setSessions(getSessions());
    // Initial calculation of revenue
    setTotalRevenue(124500); 
    setTodayEnergy(342.5);
  }, []);

  // --- Simulation Logic (The "Heartbeat") ---
  useEffect(() => {
    // Only run simulation if logged in
    if (!currentUser) return;

    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      // Check Peak Hours
      const hour = now.getHours();
      const isPeak = hour >= settings.peakStartHour && hour < settings.peakEndHour;
      setIsPeakHour(isPeak);

      // Simulate Charging
      setVehicles(prevVehicles => {
        const updatedVehicles = prevVehicles.map(v => {
          if (v.status === VehicleStatus.Charging) {
            // Calculate charge amount for this tick (1 second)
            // Fast: 50kW, Normal: 7.2kW
            const chargePower = v.chargingType === 'Fast' ? 50 : 7.2;
            const energyAdded = chargePower / 3600; // kWh per second
            
            // Update Battery %
            const percentAdded = (energyAdded / v.batteryCapacity) * 100;
            let newLevel = v.currentBatteryLevel + percentAdded;

            if (newLevel >= 100) {
              newLevel = 100;
              return { ...v, currentBatteryLevel: 100, status: VehicleStatus.Completed };
            }

            // Update Revenue & Energy Stats
            const rate = isPeak ? settings.peakRate : settings.offPeakRate;
            const costAdded = energyAdded * rate;

            setTotalRevenue(prev => prev + costAdded);
            setTodayEnergy(prev => prev + energyAdded);

            return { ...v, currentBatteryLevel: newLevel };
          }
          return v;
        });
        
        return updatedVehicles;
      });

    }, 1000); // 1 second tick

    return () => clearInterval(timer);
  }, [settings, currentUser]);

  // Save vehicles when they change
  useEffect(() => {
    if (vehicles.length > 0) saveVehicles(vehicles);
  }, [vehicles]);

  // --- Handlers ---
  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setActiveTab('dashboard'); // Reset tab
  };

  const handleAddVehicle = (newVehicle: Vehicle) => {
    setVehicles([...vehicles, newVehicle]);
  };

  const handleDeleteVehicle = (id: string) => {
    setVehicles(vehicles.filter(v => v.id !== id));
  };

  const handleUpdateSettings = (newSettings: SystemSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleResetSystem = () => {
    // Keep user logged in but clear data
    const user = currentUser;
    localStorage.clear();
    if (user) {
        localStorage.setItem('voltflow_current_user', JSON.stringify(user));
        // Reseed user list to include current user if not default
        const users = [user]; 
        localStorage.setItem('voltflow_users', JSON.stringify(users));
    }
    window.location.reload();
  };

  // --- Render Page Content ---
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            vehicles={vehicles} 
            settings={settings} 
            sessions={sessions}
            isPeakHour={isPeakHour}
            totalRevenue={Math.floor(totalRevenue)}
            todayEnergy={todayEnergy}
          />
        );
      case 'vehicles':
        return (
          <Vehicles 
            vehicles={vehicles}
            onAddVehicle={handleAddVehicle}
            onUpdateVehicle={() => {}}
            onDeleteVehicle={handleDeleteVehicle}
          />
        );
      case 'sessions':
        return (
          <ChargingSessions 
            sessions={sessions}
            vehicles={vehicles}
          />
        );
      case 'revenue':
        return (
          <Revenue 
            sessions={sessions}
          />
        );
      case 'analytics':
        return (
          <Analytics 
             sessions={sessions}
             vehicles={vehicles}
          />
        );
      case 'settings':
        return (
          <SettingsPage 
            settings={settings}
            onSave={handleUpdateSettings}
            onReset={handleResetSystem}
          />
        );
      default:
        return (
          <div className="flex items-center justify-center h-[60vh] text-slate-500">
             <div className="text-center">
               <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
               <p>The {activeTab} module is currently under development.</p>
             </div>
          </div>
        );
    }
  };

  if (isLoadingAuth) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-blue-500">Loading...</div>;
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 font-sans selection:bg-blue-500/30 text-slate-200">
        <AuthPage onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        currentTime={currentTime}
        isOnline={true}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main 
        className={`flex-1 transition-all duration-300 ease-in-out p-6 md:p-8 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}
      >
        {/* Top Mobile Bar */}
        <div className="md:hidden flex items-center justify-between mb-6">
           <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-slate-800 rounded-lg">
             <Menu className="w-6 h-6" />
           </button>
           <span className="font-mono font-bold">VOLTFLOW</span>
        </div>

        {/* Dynamic Page Content */}
        {renderContent()}
      </main>

    </div>
  );
};

export default App;
