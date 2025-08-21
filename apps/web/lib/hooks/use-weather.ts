import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useWeatherStore } from '../store/weather-store';
export { useWeatherStore };
import { queryKeys } from '../query/query-client';
import { 
  getCurrentWeather,
  getForecast,
  getAirPollution,
  searchLocations,
  getLocationName
} from '../weather/api';
import { suggestActivitiesFromForecast } from '../suggestions';
import type { Location } from '../store/weather-store';

// Current Weather Hook
export function useCurrentWeather() {
  const { 
    currentLocation, 
    units,
    setCurrentWeather,
    setWeatherLoading,
    setWeatherError 
  } = useWeatherStore();

  return useQuery({
    queryKey: currentLocation ? 
      queryKeys.weather.current(currentLocation.lat, currentLocation.lon, units) : 
      ['weather', 'current', 'disabled'] as const,
    enabled: Boolean(currentLocation),
    queryFn: async () => {
      if (!currentLocation) throw new Error('No location available');
      setWeatherLoading(true);
      try {
        const weather = await getCurrentWeather(
          currentLocation.lat, 
          currentLocation.lon, 
          units
        );
        setCurrentWeather(weather);
        return weather;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch weather';
        setWeatherError(errorMessage);
        throw error;
      } finally {
        setWeatherLoading(false);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  });
}

// Forecast Hook
export function useForecast() {
  const { 
    currentLocation, 
    units,
    setForecast,
    setForecastLoading,
    setForecastError 
  } = useWeatherStore();

  return useQuery({
    queryKey: currentLocation ? 
      queryKeys.weather.forecast(currentLocation.lat, currentLocation.lon, units) : 
      ['weather', 'forecast', 'disabled'] as const,
    queryFn: async () => {
      if (!currentLocation) throw new Error('No location available');
      setForecastLoading(true);
      try {
        const forecast = await getForecast(
          currentLocation.lat, 
          currentLocation.lon, 
          units
        );
        setForecast(forecast);
        return forecast;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch forecast';
        setForecastError(errorMessage);
        throw error;
      } finally {
        setForecastLoading(false);
      }
    },
    enabled: Boolean(currentLocation),
    staleTime: 15 * 60 * 1000, // 15 minutes - forecast changes less frequently
    refetchInterval: 30 * 60 * 1000, // 30 minutes
  });
}

// Air Quality Hook
export function useAirQuality() {
  const { 
    currentLocation,
    setAirQuality,
    setAirQualityLoading,
    setAirQualityError 
  } = useWeatherStore();

  return useQuery({
    queryKey: currentLocation ? 
      queryKeys.weather.airQuality(currentLocation.lat, currentLocation.lon) : 
      ['weather', 'air-quality', 'disabled'] as const,
    queryFn: async () => {
      if (!currentLocation) throw new Error('No location available');
      setAirQualityLoading(true);
      try {
        const airQuality = await getAirPollution(
          currentLocation.lat, 
          currentLocation.lon
        );
        setAirQuality(airQuality);
        return airQuality;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch air quality';
        setAirQualityError(errorMessage);
        throw error;
      } finally {
        setAirQualityLoading(false);
      }
    },
    enabled: Boolean(currentLocation),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 20 * 60 * 1000, // 20 minutes
  });
}

// Activity Suggestions Hook
export function useActivitySuggestions() {
  const { 
    currentLocation,
    forecast,
    airQuality,
    setSuggestions,
    setSuggestionsLoading,
    setSuggestionsError 
  } = useWeatherStore();

  const currentAqi = airQuality?.list?.[0]?.main?.aqi ?? 1;

  console.log("🎯 Activity Suggestions Hook - Dependencies:", {
    hasLocation: !!currentLocation,
    hasForecast: !!forecast,
    hasAirQuality: !!airQuality,
    enabled: Boolean(currentLocation && forecast && airQuality)
  });

  return useQuery({
    queryKey: currentLocation ? 
      queryKeys.suggestions.activities(
        currentLocation.lat, 
        currentLocation.lon, 
        Math.floor(Date.now() / (10 * 60 * 1000)) // Round to 10-minute intervals
      ) : 
      ['suggestions', 'activities', 'disabled'] as const,
    queryFn: async () => {
      console.log("🎯 Generating activity suggestions for:", currentLocation?.name);
      if (!forecast) throw new Error('No forecast data available');
      setSuggestionsLoading(true);
      try {
        const suggestions = suggestActivitiesFromForecast(
          forecast,
          currentAqi,
          [], // TODO: Add AQI history
          new Date().toISOString()
        );
        setSuggestions(suggestions);
        return suggestions;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to generate suggestions';
        setSuggestionsError(errorMessage);
        throw error;
      } finally {
        setSuggestionsLoading(false);
      }
    },
    enabled: Boolean(currentLocation && forecast && airQuality),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 15 * 60 * 1000, // 15 minutes
  });
}

// Location Search Hook
export function useLocationSearch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (query: string) => {
      const results = await searchLocations(query, 5);
      return results.map(location => ({
        lat: location.lat,
        lon: location.lon,
        name: location.name,
        country: location.country,
        state: location.state,
      }));
    },
    onSuccess: (data) => {
      // Cache the search results
      data.forEach(location => {
        queryClient.setQueryData(
          queryKeys.location.reverse(location.lat, location.lon),
          [location]
        );
      });
    },
  });
}

// Geolocation Hook
export function useGeolocation() {
  const { 
    setLocation, 
    setLocationLoading, 
    setLocationError,
    clearErrors
  } = useWeatherStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<Location> => {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported by this browser'));
          return;
        }

        setLocationLoading(true);
        clearErrors();

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              
              // Get location name using reverse geocoding
              const locationData = await getLocationName(latitude, longitude);
              const locationInfo = locationData[0];
              
              const location: Location = {
                lat: latitude,
                lon: longitude,
                name: locationInfo?.name || 'Current Location',
                country: locationInfo?.country,
                state: locationInfo?.state,
              };
              
              resolve(location);
            } catch (error) {
              reject(error);
            }
          },
          (error) => {
            let errorMessage = 'Failed to get location';
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = 'Location access denied by user';
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = 'Location information unavailable';
                break;
              case error.TIMEOUT:
                errorMessage = 'Location request timed out';
                break;
            }
            reject(new Error(errorMessage));
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 5 * 60 * 1000, // 5 minutes
          }
        );
      });
    },
    onSuccess: (location) => {
      setLocation(location);
      // Invalidate all weather queries to refetch with new location
      queryClient.invalidateQueries({ queryKey: queryKeys.weather.all });
    },
    onError: (error: Error) => {
      setLocationError(error.message);
    },
  });
}

// Composite hook to fetch all weather data
export function useWeatherData() {
  const weather = useCurrentWeather();
  const forecast = useForecast();
  const airQuality = useAirQuality();
  const suggestions = useActivitySuggestions();

  return {
    weather,
    forecast,
    airQuality,
    suggestions,
    isLoading: weather.isLoading || forecast.isLoading || airQuality.isLoading,
    isError: weather.isError || forecast.isError || airQuality.isError,
    refetchAll: () => {
      weather.refetch();
      forecast.refetch();
      airQuality.refetch();
      suggestions.refetch();
    },
  };
}