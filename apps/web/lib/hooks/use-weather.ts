import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useWeatherStore } from '../store/weather-store';
export { useWeatherStore };
import { queryKeys } from '../query/query-client';
import { 
  getCurrentWeather,
  getForecast,
  getAirPollution,
  searchLocations,
  getLocationName,
  getExtendedForecast
} from '../api/weather';
import { getSolarWeatherData, getAgriculturalData, processAgriculturalData } from '../api/weather/open-meteo';
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

// Extended Forecast Hook (16-day Open-Meteo)
export function useExtendedForecast() {
  const { currentLocation } = useWeatherStore();

  return useQuery({
    queryKey: currentLocation ? 
      ['weather', 'extended-forecast', currentLocation.lat, currentLocation.lon] as const : 
      ['weather', 'extended-forecast', 'disabled'] as const,
    queryFn: async () => {
      if (!currentLocation) throw new Error('No location available');
      return await getExtendedForecast(
        currentLocation.lat, 
        currentLocation.lon,
        currentLocation.name
      );
    },
    enabled: Boolean(currentLocation),
    staleTime: 30 * 60 * 1000, // 30 minutes - extended forecast changes less frequently
    refetchInterval: 60 * 60 * 1000, // 60 minutes
    retry: (failureCount, error) => {
      // Only retry network errors, not API errors
      if (failureCount >= 2) return false;
      return true;
    },
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

  // Check if forecast and air quality data match current location
  const forecastMatchesLocation = forecast && currentLocation && 
    Math.abs(forecast.city.coord.lat - currentLocation.lat) < 0.01 &&
    Math.abs(forecast.city.coord.lon - currentLocation.lon) < 0.01;
  
  const airQualityMatchesLocation = airQuality && currentLocation &&
    Math.abs(airQuality.coord.lat - currentLocation.lat) < 0.01 &&
    Math.abs(airQuality.coord.lon - currentLocation.lon) < 0.01;
  
  const allDataMatches = Boolean(currentLocation && forecastMatchesLocation && airQualityMatchesLocation);

  // Only log when dependencies change for Perfect Activities debugging
  if (currentLocation) {
    console.log("🎯 Perfect Activities - Location:", currentLocation.name, "| Forecast Match:", forecastMatchesLocation, "| Air Quality Match:", airQualityMatchesLocation, "| Enabled:", allDataMatches);
  }

  return useQuery({
    queryKey: currentLocation ? 
      queryKeys.suggestions.activities(
        currentLocation.lat, 
        currentLocation.lon, 
        Math.floor(Date.now() / (10 * 60 * 1000)) // Round to 10-minute intervals
      ) : 
      ['suggestions', 'activities', 'disabled'] as const,
    queryFn: async () => {
      console.log("🎯 GENERATING Perfect Activities for:", currentLocation?.name);
      
      if (!forecast) throw new Error('No forecast data available');
      setSuggestionsLoading(true);
      try {
        const suggestions = suggestActivitiesFromForecast(
          forecast,
          currentAqi,
          [], // TODO: Add AQI history
          new Date().toISOString()
        );
        console.log("🎯 Generated", suggestions.suggestions?.length || 0, "activities for", currentLocation?.name);
        setSuggestions(suggestions);
        return suggestions;
      } catch (error) {
        console.error("🎯 Perfect Activities generation failed:", error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to generate suggestions';
        setSuggestionsError(errorMessage);
        throw error;
      } finally {
        setSuggestionsLoading(false);
      }
    },
    enabled: allDataMatches,
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

// Solar Forecast Hook (worldwide coverage)
export function useSolarForecast() {
  const { currentLocation } = useWeatherStore();

  return useQuery({
    queryKey: currentLocation ? 
      ['weather', 'solar', currentLocation.lat, currentLocation.lon] as const : 
      ['weather', 'solar', 'disabled'] as const,
    enabled: Boolean(currentLocation),
    queryFn: async () => {
      if (!currentLocation) throw new Error('No location available');
      
      console.log("☀️ Fetching solar & UV data for", currentLocation.name);
      const solarData = await getSolarWeatherData(
        currentLocation.lat,
        currentLocation.lon
      );
      
      console.log("☀️ Solar data received:", {
        current_uv: solarData?.uv_warnings?.current_uv || 0,
        peak_uv: solarData?.uv_warnings?.peak_uv_today || 0,
        photography_score: solarData?.photography_score || 0,
        solar_energy_score: solarData?.solar_energy_score || 0,
        next_golden_hour: solarData?.next_golden_hour?.minutes_until || 'none'
      });
      
      return solarData;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - solar data changes more slowly
    refetchInterval: 30 * 60 * 1000, // 30 minutes
  });
}

// Agricultural Data Hook (professional farming intelligence)
export function useAgriculturalForecast() {
  const { currentLocation } = useWeatherStore();


  return useQuery({
    queryKey: currentLocation ? 
      ['weather', 'agricultural', currentLocation.lat, currentLocation.lon] as const : 
      ['weather', 'agricultural', 'disabled'] as const,
    enabled: Boolean(currentLocation),
    queryFn: async () => {
      if (!currentLocation) throw new Error('No location available');
      
      console.log("🌱 DEBUG: Fetching agricultural data for", currentLocation.name, "at", currentLocation.lat, currentLocation.lon);
      const agriculturalResponse = await getAgriculturalData({
        latitude: currentLocation.lat,
        longitude: currentLocation.lon,
        days: 7 // 7 days of data
      });
      
      const processedData = processAgriculturalData(agriculturalResponse);
      
      console.log("🌱 Agricultural data received:", {
        current_vpd: processedData?.current?.vapour_pressure_deficit || 0,
        current_humidity: processedData?.current?.relative_humidity || 0,
        plant_stress: processedData?.current?.plant_stress_level || 'unknown',
        watering_windows: processedData?.gardening_insights?.optimal_watering_windows?.length || 0,
        best_gardening_days: processedData?.weekly_summary?.best_gardening_days?.length || 0
      });
      
      return processedData;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes - agricultural data changes less frequently
    refetchInterval: 60 * 60 * 1000, // 60 minutes
  });
}

// Enhanced Activity Suggestions with Agricultural Intelligence
export function useSmartActivitySuggestions() {
  const { 
    currentLocation,
    forecast,
    airQuality,
    setSuggestions,
    setSuggestionsLoading,
    setSuggestionsError 
  } = useWeatherStore();

  const agriculturalData = useAgriculturalForecast();
  const currentAqi = airQuality?.list?.[0]?.main?.aqi ?? 1;

  // Check if forecast and air quality data match current location
  const forecastMatchesLocation = forecast && currentLocation && 
    Math.abs(forecast.city.coord.lat - currentLocation.lat) < 0.01 &&
    Math.abs(forecast.city.coord.lon - currentLocation.lon) < 0.01;
  
  const airQualityMatchesLocation = airQuality && currentLocation &&
    Math.abs(airQuality.coord.lat - currentLocation.lat) < 0.01 &&
    Math.abs(airQuality.coord.lon - currentLocation.lon) < 0.01;
  
  const allDataMatches = Boolean(currentLocation && forecastMatchesLocation && airQualityMatchesLocation);

  // Enable as soon as we have location and basic weather data
  const shouldEnable = Boolean(currentLocation && forecast);
  

  return useQuery({
    queryKey: currentLocation ? 
      [
        'suggestions', 
        'smart-activities', 
        currentLocation.lat, 
        currentLocation.lon, 
        Math.floor(Date.now() / (10 * 60 * 1000)), // Round to 10-minute intervals
        agriculturalData.data ? 'with-agri' : 'no-agri'
      ] as const : 
      ['suggestions', 'smart-activities', 'disabled'] as const,
    queryFn: async () => {
      console.log("🌱 DEBUG: GENERATING Smart Agricultural Activities for:", currentLocation?.name, "with agri data:", !!agriculturalData.data);
      
      if (!forecast) throw new Error('No forecast data available');
      setSuggestionsLoading(true);
      try {
        const suggestions = suggestActivitiesFromForecast(
          forecast,
          currentAqi,
          [], // TODO: Add AQI history
          new Date().toISOString(),
          agriculturalData.data || undefined,
          currentLocation?.name || undefined
        );
        console.log("🌱 Generated", suggestions.smart_suggestions?.length || 0, "smart activities for", currentLocation?.name);
        setSuggestions(suggestions);
        return suggestions;
      } catch (error) {
        console.error("🌱 Smart Agricultural Activities generation failed:", error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to generate smart suggestions';
        setSuggestionsError(errorMessage);
        throw error;
      } finally {
        setSuggestionsLoading(false);
      }
    },
    enabled: shouldEnable,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 15 * 60 * 1000, // 15 minutes
  });
}

// Composite hook to fetch all weather data
export function useWeatherData() {
  const weather = useCurrentWeather();
  const forecast = useForecast();
  const extendedForecast = useExtendedForecast();
  const airQuality = useAirQuality();
  const suggestions = useActivitySuggestions();

  return {
    weather,
    forecast,
    extendedForecast,
    airQuality,
    suggestions,
    isLoading: weather.isLoading || forecast.isLoading || airQuality.isLoading,
    isError: weather.isError || forecast.isError || airQuality.isError,
    refetchAll: () => {
      weather.refetch();
      forecast.refetch();
      extendedForecast.refetch();
      airQuality.refetch();
      suggestions.refetch();
    },
  };
}