export enum VehicleStatus {
  Idle = 'Idle',
  Charging = 'Charging',
  Completed = 'Completed',
  Offline = 'Offline'
}

export interface Vehicle {
  id: string;
  ownerName: string;
  model: string;
  licensePlate: string;
  batteryCapacity: number; // kWh
  currentBatteryLevel: number; // %
  status: VehicleStatus;
  lastSessionId?: string;
  joinedDate: string;
  chargingType: 'Fast' | 'Normal';
}

export interface ChargingSession {
  id: string;
  vehicleId: string;
  startTime: string;
  endTime?: string;
  energyConsumed: number; // kWh
  cost: number;
  rateApplied: number;
}

export interface SystemSettings {
  baseRate: number;
  peakRate: number;
  offPeakRate: number;
  peakStartHour: number; // 0-23
  peakEndHour: number; // 0-23
  totalSlots: number;
  currency: string;
}

export interface DashboardStats {
  totalRevenue: number;
  todayEnergy: number;
  activeSessions: number;
  availableSlots: number;
}

export type UserRole = 'admin' | 'manager' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Note: In production, never store raw passwords
  role: UserRole;
}

export type TabView = 'dashboard' | 'vehicles' | 'sessions' | 'revenue' | 'analytics' | 'settings';
