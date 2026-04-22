// ─── Core Domain Types ───────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  tripsCount: number;
  joinedAt: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  currency: string;
  language: string;
  emailNotifications: boolean;
  travelStyle: TravelStyle[];
  darkMode: boolean;
}

export type TravelStyle = 'adventure' | 'luxury' | 'budget' | 'cultural' | 'relaxation' | 'foodie' | 'photography' | 'solo' | 'family';

export type TripStatus = 'planning' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export type TripType = 'solo' | 'couple' | 'family' | 'group' | 'business';

export interface Trip {
  id: string;
  title: string;
  destination: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  status: TripStatus;
  type: TripType;
  travelers: number;
  budget: Budget;
  itinerary: ItineraryDay[];
  places: Place[];
  sharedAccess: SharedAccess[];
  comments: Comment[];
  activityLog: ActivityLog[];
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  tags: string[];
  isPublic: boolean;
  shareToken?: string;
  /** Preserved wizard form inputs — used by the itinerary generator */
  wizardData?: TripWizardData;
}


export interface Budget {
  total: number;
  currency: string;
  spent: number;
  categories: BudgetCategory[];
  alerts: BudgetAlert[];
}

export interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  allocated: number;
  spent: number;
  color: string;
}

export interface BudgetAlert {
  id: string;
  message: string;
  type: 'warning' | 'danger' | 'info';
  createdAt: string;
}

export interface BudgetItem {
  id: string;
  tripId: string;
  categoryId: string;
  name: string;
  amount: number;
  date: string;
  notes?: string;
  createdAt: string;
}

export interface ItineraryDay {
  id: string;
  tripId: string;
  day: number;
  date: string;
  title: string;
  morning: Activity[];
  afternoon: Activity[];
  evening: Activity[];
  notes?: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  location: string;
  duration: string;
  cost: number;
  type: ActivityType;
  placeId?: string;
  imageUrl?: string;
  coordinates?: Coordinates;
}

export type ActivityType = 'attraction' | 'food' | 'transport' | 'accommodation' | 'activity' | 'shopping' | 'custom' | 'entertainment';

export interface Place {
  id: string;
  name: string;
  description: string;
  address: string;
  category: PlaceCategory;
  rating: number;
  reviewCount: number;
  priceLevel: 1 | 2 | 3 | 4;
  imageUrl: string;
  coordinates: Coordinates;
  openingHours?: string;
  phone?: string;
  website?: string;
  tags: string[];
}

export type PlaceCategory = 'attraction' | 'restaurant' | 'hotel' | 'shopping' | 'transport' | 'entertainment' | 'nature' | 'museum';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface SharedAccess {
  id: string;
  tripId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  permission: 'view' | 'edit' | 'admin';
  invitedAt: string;
  acceptedAt?: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface Comment {
  id: string;
  tripId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  replies?: Comment[];
}

export interface ActivityLog {
  id: string;
  tripId: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  createdAt: string;
}

// ─── Wizard / Form Types ─────────────────────────────────────────────────────

export interface TripWizardData {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  tripType: TripType;
  budgetMin: number;
  budgetMax: number;
  travelStyles: TravelStyle[];
  preferences: string[];
  specialRequests: string;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

// ─── UI State Types ───────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

export interface Modal {
  isOpen: boolean;
  type?: 'share' | 'edit' | 'delete' | 'invite' | 'addPlace' | 'notificationDetail' | null;
  data?: any;
}
