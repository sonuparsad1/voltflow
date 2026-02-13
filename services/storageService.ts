import { Vehicle, VehicleStatus, SystemSettings, ChargingSession, User } from '../types';

const KEYS = {
  VEHICLES: 'voltflow_vehicles',
  SESSIONS: 'voltflow_sessions',
  SETTINGS: 'voltflow_settings',
  USERS: 'voltflow_users',
  CURRENT_USER: 'voltflow_current_user'
};

const SEED_VEHICLES: Vehicle[] = [
  { id: '1', ownerName: 'Alice Johnson', model: 'Tesla Model 3', licensePlate: 'EV-8821', batteryCapacity: 75, currentBatteryLevel: 45, status: VehicleStatus.Charging, joinedDate: '2023-11-01', chargingType: 'Fast' },
  { id: '2', ownerName: 'Bob Smith', model: 'Nissan Leaf', licensePlate: 'eco-992', batteryCapacity: 40, currentBatteryLevel: 90, status: VehicleStatus.Completed, joinedDate: '2023-12-15', chargingType: 'Normal' },
  { id: '3', ownerName: 'Charlie Brown', model: 'Hyundai Ioniq 5', licensePlate: 'H-ION-5', batteryCapacity: 77, currentBatteryLevel: 12, status: VehicleStatus.Idle, joinedDate: '2024-01-20', chargingType: 'Fast' },
  { id: '4', ownerName: 'Diana Prince', model: 'Porsche Taycan', licensePlate: 'WONDER-1', batteryCapacity: 93, currentBatteryLevel: 67, status: VehicleStatus.Charging, joinedDate: '2024-02-10', chargingType: 'Fast' },
  { id: '5', ownerName: 'Evan Wright', model: 'Chevy Bolt', licensePlate: 'BLT-123', batteryCapacity: 65, currentBatteryLevel: 100, status: VehicleStatus.Offline, joinedDate: '2024-03-05', chargingType: 'Normal' },
];

const generateSeedSessions = (): ChargingSession[] => {
  const sessions: ChargingSession[] = [];
  const vehicles = SEED_VEHICLES.map(v => v.id);
  const now = new Date();
  
  // Generate 50 random sessions over last 30 days
  for (let i = 0; i < 50; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    // Random hour between 6 AM and 11 PM
    date.setHours(6 + Math.floor(Math.random() * 17));
    
    const durationHours = 0.5 + Math.random() * 3.5;
    const isFast = Math.random() > 0.4;
    const power = isFast ? 50 : 7.2;
    const energy = durationHours * power; 
    
    // Simulate peak rates (5PM - 10PM)
    const hour = date.getHours();
    const isPeak = hour >= 17 && hour < 22;
    const rate = isPeak ? 18 : 12; // Matches default settings
    
    sessions.push({
      id: `sess-${Math.random().toString(36).substr(2, 9)}`,
      vehicleId: vehicles[Math.floor(Math.random() * vehicles.length)],
      startTime: date.toISOString(),
      endTime: new Date(date.getTime() + durationHours * 60 * 60 * 1000).toISOString(),
      energyConsumed: parseFloat(energy.toFixed(2)),
      cost: parseFloat((energy * rate).toFixed(2)),
      rateApplied: rate
    });
  }
  return sessions.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
};

const DEFAULT_SETTINGS: SystemSettings = {
  baseRate: 12,
  peakRate: 18,
  offPeakRate: 8,
  peakStartHour: 17, // 5 PM
  peakEndHour: 22,   // 10 PM
  totalSlots: 8,
  currency: '₹',
};

const SEED_USERS: User[] = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@voltflow.com',
    password: 'admin',
    role: 'admin'
  }
];

// --- Vehicle Methods ---
export const getVehicles = (): Vehicle[] => {
  const stored = localStorage.getItem(KEYS.VEHICLES);
  if (!stored) {
    localStorage.setItem(KEYS.VEHICLES, JSON.stringify(SEED_VEHICLES));
    return SEED_VEHICLES;
  }
  return JSON.parse(stored);
};

export const saveVehicles = (vehicles: Vehicle[]) => {
  localStorage.setItem(KEYS.VEHICLES, JSON.stringify(vehicles));
};

// --- Settings Methods ---
export const getSettings = (): SystemSettings => {
  const stored = localStorage.getItem(KEYS.SETTINGS);
  if (!stored) {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    return DEFAULT_SETTINGS;
  }
  return JSON.parse(stored);
};

export const saveSettings = (settings: SystemSettings) => {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
};

// --- Session Methods ---
export const getSessions = (): ChargingSession[] => {
  const stored = localStorage.getItem(KEYS.SESSIONS);
  if (!stored) {
    const seeds = generateSeedSessions();
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(seeds));
    return seeds;
  }
  return JSON.parse(stored);
};

export const saveSessions = (sessions: ChargingSession[]) => {
  localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
};

// --- Auth Methods ---
export const getUsers = (): User[] => {
  const stored = localStorage.getItem(KEYS.USERS);
  if (!stored) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(SEED_USERS));
    return SEED_USERS;
  }
  return JSON.parse(stored);
};

export const registerUser = (user: User): boolean => {
  const users = getUsers();
  if (users.find(u => u.email === user.email)) return false;
  users.push(user);
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  return true;
};

export const loginUser = (email: string, password: string): User | null => {
  const users = getUsers();
  // Simple check - in production use bcrypt/hashing
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    return user;
  }
  return null;
};

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(KEYS.CURRENT_USER);
  return stored ? JSON.parse(stored) : null;
};

export const logoutUser = () => {
  localStorage.removeItem(KEYS.CURRENT_USER);
};
