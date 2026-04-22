/**
 * API Service Layer
 * ─────────────────────────────────────────────────────────────────────────────
 * All API calls go through this layer. Currently backed by mock data.
 * To connect to a real backend, update API_BASE_URL and remove mock logic.
 *
 * Docker-ready: set REACT_APP_API_URL in environment to point to your backend.
 */

import { mockTrips, mockUser } from '../data/mockData';
import { Trip, User, TripWizardData, ApiResponse } from '../types';
import { generateItinerary } from './itineraryGenerator';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';
const USE_MOCK = !API_BASE_URL;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('tripnest_token') || ''}`,
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response.json();
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authService = {
  async login(email: string, _password: string): Promise<{ user: User; token: string }> {
    if (USE_MOCK) {
      await delay(800);
      if (email === 'sarah@example.com' || email) {
        const token = 'mock_jwt_token_' + Date.now();
        localStorage.setItem('tripnest_token', token);
        return { user: { ...mockUser, email }, token };
      }
      throw new Error('Invalid credentials');
    }
    const res = await apiCall<{ user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: _password }),
    });
    return res.data;
  },

  async register(name: string, email: string, _password: string): Promise<{ user: User; token: string }> {
    if (USE_MOCK) {
      await delay(1000);
      const newUser: User = {
        ...mockUser,
        id: 'u_' + Date.now(),
        name,
        email,
        tripsCount: 0,
        joinedAt: new Date().toISOString(),
      };
      const token = 'mock_jwt_token_' + Date.now();
      localStorage.setItem('tripnest_token', token);
      return { user: newUser, token };
    }
    const res = await apiCall<{ user: User; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password: _password }),
    });
    return res.data;
  },

  logout() {
    localStorage.removeItem('tripnest_token');
    localStorage.removeItem('tripnest_user');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('tripnest_token');
  },
};

// ─── Trips ────────────────────────────────────────────────────────────────────
export const tripService = {
  async getAll(): Promise<Trip[]> {
    if (USE_MOCK) {
      await delay(600);
      return mockTrips;
    }
    const res = await apiCall<Trip[]>('/api/trips');
    return res.data;
  },

  async getById(id: string): Promise<Trip> {
    if (USE_MOCK) {
      await delay(400);
      const trip = mockTrips.find(t => t.id === id);
      if (!trip) throw new Error('Trip not found');
      return trip;
    }
    const res = await apiCall<Trip>(`/api/trips/${id}`);
    return res.data;
  },

  async create(data: Partial<Trip> & { wizardData?: TripWizardData }): Promise<Trip> {
    if (USE_MOCK) {
      await delay(800);
      const newTrip: Trip = {
        id: 't_' + Date.now(),
        title: data.title || 'New Trip',
        destination: data.destination || '',
        coverImage: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800',
        startDate: data.startDate || '',
        endDate: data.endDate || '',
        status: 'planning',
        type: data.type || 'solo',
        travelers: data.travelers || 1,
        budget: data.budget || { total: 0, currency: 'USD', spent: 0, categories: [], alerts: [] },
        itinerary: [],
        places: [],
        sharedAccess: [],
        comments: [],
        activityLog: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ownerId: 'u1',
        tags: [],
        isPublic: false,
        ...data,
        // Preserve wizard form inputs so the plan page can generate the itinerary
        wizardData: data.wizardData,
      };
      mockTrips.unshift(newTrip);
      return newTrip;
    }
    const res = await apiCall<Trip>('/api/trips', { method: 'POST', body: JSON.stringify(data) });
    return res.data;
  },

  async update(id: string, data: Partial<Trip>): Promise<Trip> {
    if (USE_MOCK) {
      await delay(500);
      const idx = mockTrips.findIndex(t => t.id === id);
      if (idx === -1) throw new Error('Trip not found');
      mockTrips[idx] = { ...mockTrips[idx], ...data, updatedAt: new Date().toISOString() };
      return mockTrips[idx];
    }
    const res = await apiCall<Trip>(`/api/trips/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    return res.data;
  },

  async delete(id: string): Promise<void> {
    if (USE_MOCK) {
      await delay(400);
      const idx = mockTrips.findIndex(t => t.id === id);
      if (idx !== -1) mockTrips.splice(idx, 1);
      return;
    }
    await apiCall<void>(`/api/trips/${id}`, { method: 'DELETE' });
  },

  async generatePlan(id: string, wizardData: TripWizardData): Promise<Trip> {
    if (USE_MOCK) {
      await delay(2000); // Simulate generation time
      const idx = mockTrips.findIndex(t => t.id === id);
      if (idx === -1) throw new Error('Trip not found');

      // Use wizardData from the call, falling back to what was stored on the trip
      const effectiveWizardData = wizardData || mockTrips[idx].wizardData;
      if (!effectiveWizardData) throw new Error('No wizard data available to generate itinerary');

      // Generate a deterministic itinerary from form inputs
      const itinerary = generateItinerary(effectiveWizardData, id);

      // Persist the generated itinerary on the trip
      mockTrips[idx] = {
        ...mockTrips[idx],
        itinerary,
        wizardData: effectiveWizardData,
        updatedAt: new Date().toISOString(),
      };

      return mockTrips[idx];
    }
    const res = await apiCall<Trip>(`/api/trips/${id}/generate-plan`, {
      method: 'POST',
      body: JSON.stringify(wizardData),
    });
    return res.data;
  },

  async shareTrip(id: string, email: string, permission: 'view' | 'edit'): Promise<void> {
    if (USE_MOCK) {
      await delay(600);
      return;
    }
    await apiCall<void>(`/api/trips/${id}/share`, {
      method: 'POST',
      body: JSON.stringify({ email, permission }),
    });
  },
};

// ─── Places ───────────────────────────────────────────────────────────────────
export const placeService = {
  async search(query: string, _category?: string): Promise<import('../types').Place[]> {
    if (USE_MOCK) {
      await delay(500);
      const { mockPlaces } = await import('../data/mockData');
      return mockPlaces.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.address.toLowerCase().includes(query.toLowerCase())
      );
    }
    const params = new URLSearchParams({ query, ..._category ? { category: _category } : {} });
    const res = await apiCall<import('../types').Place[]>(`/api/places/search?${params}`);
    return res.data;
  },
};

// ─── User ─────────────────────────────────────────────────────────────────────
export const userService = {
  async getProfile(): Promise<User> {
    if (USE_MOCK) {
      await delay(300);
      return mockUser;
    }
    const res = await apiCall<User>('/api/user/profile');
    return res.data;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    if (USE_MOCK) {
      await delay(500);
      return { ...mockUser, ...data };
    }
    const res = await apiCall<User>('/api/user/profile', { method: 'PUT', body: JSON.stringify(data) });
    return res.data;
  },

  async updatePassword(password: string): Promise<void> {
    if (USE_MOCK) {
      await delay(500);
      return;
    }
    await apiCall<void>('/api/user/password', { method: 'PUT', body: JSON.stringify({ password }) });
  },
};
