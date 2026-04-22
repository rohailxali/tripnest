import { create } from 'zustand';
import { User, Trip, Toast, Modal } from '../types';

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  setUser: (user: User | null) => void;
  setAuthLoading: (v: boolean) => void;

  // Trips
  trips: Trip[];
  currentTrip: Trip | null;
  tripsLoading: boolean;
  setTrips: (trips: Trip[]) => void;
  setCurrentTrip: (trip: Trip | null) => void;
  updateTrip: (id: string, data: Partial<Trip>) => void;
  addTrip: (trip: Trip) => void;
  removeTrip: (id: string) => void;
  setTripsLoading: (v: boolean) => void;

  // UI
  toasts: Toast[];
  modal: Modal;
  sidebarOpen: boolean;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  openModal: (type: Modal['type'], data?: unknown) => void;
  closeModal: () => void;
  setSidebarOpen: (v: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Auth
  user: null,
  isAuthenticated: false,
  authLoading: true,
  setUser: (user) => {
    // Persist session across page refreshes
    if (user) {
      localStorage.setItem('tripnest_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('tripnest_user');
    }
    set({ user, isAuthenticated: !!user });
  },
  setAuthLoading: (authLoading) => set({ authLoading }),

  // Trips
  trips: [],
  currentTrip: null,
  tripsLoading: false,
  setTrips: (trips) => set({ trips }),
  setCurrentTrip: (currentTrip) => set({ currentTrip }),
  updateTrip: (id, data) => set(state => ({
    trips: state.trips.map(t => t.id === id ? { ...t, ...data } : t),
    currentTrip: state.currentTrip?.id === id ? { ...state.currentTrip, ...data } : state.currentTrip,
  })),
  addTrip: (trip) => set(state => ({ trips: [trip, ...state.trips] })),
  removeTrip: (id) => set(state => ({ trips: state.trips.filter(t => t.id !== id) })),
  setTripsLoading: (tripsLoading) => set({ tripsLoading }),

  // UI
  toasts: [],
  modal: { isOpen: false, type: null, data: null },
  sidebarOpen: false,
  addToast: (toast) => {
    const id = 'toast_' + Date.now();
    set(state => ({ toasts: [...state.toasts, { ...toast, id }] }));
    setTimeout(() => get().removeToast(id), toast.duration || 4000);
  },
  removeToast: (id) => set(state => ({ toasts: state.toasts.filter(t => t.id !== id) })),
  openModal: (type, data) => set({ modal: { isOpen: true, type, data } }),
  closeModal: () => set({ modal: { isOpen: false, type: null, data: null } }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
}));
