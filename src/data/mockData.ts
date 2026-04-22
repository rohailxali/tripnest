import { User, Trip, Place } from '../types';

// â”€â”€â”€ Mock User â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const mockUser: User = {
  id: 'u1',
  name: 'Zohair',
  email: 'zohair@example.com',
  avatar: 'https://api.dicebear.com/7.x/micah/svg?seed=David',
  bio: 'Adventure seeker | 23 countries visited | Travel photographer',
  location: 'New York, USA',
  tripsCount: 0,
  joinedAt: new Date().toISOString().split('T')[0],
  preferences: {
    currency: 'USD',
    language: 'en',
    emailNotifications: true,
    travelStyle: [],
    darkMode: false,
  },
};

// â”€â”€â”€ Mock Places â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const mockPlaces: Place[] = [
  {
    id: 'p1',
    name: 'Eiffel Tower',
    description: 'Iconic iron lattice tower on the Champ de Mars, built in 1889.',
    address: 'Champ de Mars, 5 Av. Anatole France, 75007 Paris',
    category: 'attraction',
    rating: 4.7,
    reviewCount: 240000,
    priceLevel: 2,
    imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400',
    coordinates: { lat: 48.8584, lng: 2.2945 },
    openingHours: 'Daily 9:30 AM â€“ 11:45 PM',
    tags: ['landmark', 'romantic', 'views'],
  },
  {
    id: 'p2',
    name: 'Le Jules Verne',
    description: 'Elegant restaurant inside the Eiffel Tower with panoramic views.',
    address: '2nd floor Eiffel Tower, Avenue Gustave Eiffel',
    category: 'restaurant',
    rating: 4.5,
    reviewCount: 3200,
    priceLevel: 4,
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
    coordinates: { lat: 48.8584, lng: 2.2945 },
    openingHours: 'Daily 12 PM â€“ 10 PM',
    tags: ['fine dining', 'views', 'romantic'],
  },
  {
    id: 'p3',
    name: 'Louvre Museum',
    description: 'World\'s largest art museum housing the Mona Lisa and thousands of masterpieces.',
    address: 'Rue de Rivoli, 75001 Paris',
    category: 'museum',
    rating: 4.8,
    reviewCount: 190000,
    priceLevel: 2,
    imageUrl: 'https://images.unsplash.com/photo-1565799557186-2850eb0c00f4?w=400',
    coordinates: { lat: 48.8606, lng: 2.3376 },
    openingHours: 'Mon, Thuâ€“Sun 9 AM â€“ 6 PM; Wed, Fri 9 AM â€“ 9:45 PM',
    tags: ['art', 'history', 'culture'],
  },
  {
    id: 'p4',
    name: 'Santorini Sunset Point',
    description: 'Famous viewpoint in Oia for the most spectacular sunsets in the Aegean.',
    address: 'Oia, Santorini 847 02, Greece',
    category: 'nature',
    rating: 4.9,
    reviewCount: 85000,
    priceLevel: 1,
    imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400',
    coordinates: { lat: 36.4618, lng: 25.3753 },
    tags: ['views', 'sunset', 'romantic', 'photography'],
  },
];

export const mockTrips: Trip[] = [];

// â”€â”€â”€ Quick Stats â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const mockStats = {
  totalTrips: 0,
  countriesVisited: 0,
  totalDays: 0,
  upcomingTrips: 0,
};

// â”€â”€â”€ Destination Suggestions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const popularDestinations = [
  { name: 'Paris, France', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=300', trips: '2.4M' },
  { name: 'Bali, Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=300', trips: '1.8M' },
  { name: 'Tokyo, Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300', trips: '2.1M' },
  { name: 'New York, USA', image: 'https://images.unsplash.com/photo-1508439319498-485b4fbb3b65?w=300', trips: '3.2M' },
  { name: 'Santorini, Greece', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=300', trips: '1.2M' },
  { name: 'Dubai, UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=300', trips: '1.9M' },
];

export const testimonials = [
  {
    id: 1,
    name: 'Alex Rivera',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    role: 'Solo Traveler',
    text: 'TripNest completely transformed how I plan my solo adventures. The AI itinerary was spot-on for my Japan trip!',
    rating: 5,
    trips: 8,
  },
  {
    id: 2,
    name: 'Priya Sharma',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
    role: 'Family Travel Enthusiast',
    text: 'Planning a family trip to 4 people used to be a nightmare. With TripNest, we had a perfect 2-week Europe tour!',
    rating: 5,
    trips: 5,
  },
  {
    id: 3,
    name: 'James Williams',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
    role: 'Frequent Business Traveler',
    text: 'The budget tracking is phenomenal. I always know exactly where my money is going on every trip.',
    rating: 5,
    trips: 24,
  },
];
