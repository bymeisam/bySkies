import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Weather data is fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Keep data in cache for 30 minutes
      gcTime: 30 * 60 * 1000,
      // Retry failed requests up to 3 times
      retry: 3,
      // Exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Don't refetch on window focus for weather data
      refetchOnWindowFocus: false,
      // Refetch on reconnect to get fresh weather
      refetchOnReconnect: true,
      // Network mode - always try to fetch, even offline
      networkMode: 'always',
    },
    mutations: {
      // Retry mutations once
      retry: 1,
      networkMode: 'always',
    },
  },
});

// Query keys for consistent cache management
export const queryKeys = {
  weather: {
    all: ['weather'] as const,
    current: (lat: number, lon: number, units: string) => 
      ['weather', 'current', lat, lon, units] as const,
    forecast: (lat: number, lon: number, units: string) => 
      ['weather', 'forecast', lat, lon, units] as const,
    airQuality: (lat: number, lon: number) => 
      ['weather', 'air-quality', lat, lon] as const,
  },
  location: {
    all: ['location'] as const,
    geocoding: (query: string) => ['location', 'geocoding', query] as const,
    reverse: (lat: number, lon: number) => ['location', 'reverse', lat, lon] as const,
  },
  suggestions: {
    all: ['suggestions'] as const,
    activities: (lat: number, lon: number, timestamp: number) => 
      ['suggestions', 'activities', lat, lon, timestamp] as const,
  },
} as const;