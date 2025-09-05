import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import type { 
  CurrentWeatherResponse, 
  ForecastResponse, 
  AirPollutionResponse,
  ActivitySuggestion,
  PlanningDisruptionAlert,
  AirQualityAlert,
  SuggestionResult
} from '@repo/types';

export interface Location {
  lat: number;
  lon: number;
  name: string;
  country?: string;
  state?: string;
}

interface WeatherState {
  // Location
  currentLocation: Location | null;
  isLocationLoading: boolean;
  locationError: string | null;

  // Current Weather
  currentWeather: CurrentWeatherResponse | null;
  isWeatherLoading: boolean;
  weatherError: string | null;
  lastWeatherUpdate: number | null;

  // Forecast
  forecast: ForecastResponse | null;
  isForecastLoading: boolean;
  forecastError: string | null;
  lastForecastUpdate: number | null;

  // Air Quality
  airQuality: AirPollutionResponse | null;
  isAirQualityLoading: boolean;
  airQualityError: string | null;
  lastAirQualityUpdate: number | null;

  // Activity Suggestions
  suggestions: ActivitySuggestion[];
  alerts: (PlanningDisruptionAlert | AirQualityAlert)[];
  isSuggestionsLoading: boolean;
  suggestionsError: string | null;

  // User Preferences
  units: 'metric' | 'imperial' | 'kelvin';
  language: string;
  
  // Actions
  setLocation: (location: Location) => void;
  setLocationLoading: (loading: boolean) => void;
  setLocationError: (error: string | null) => void;
  
  setCurrentWeather: (weather: CurrentWeatherResponse) => void;
  setWeatherLoading: (loading: boolean) => void;
  setWeatherError: (error: string | null) => void;
  
  setForecast: (forecast: ForecastResponse) => void;
  setForecastLoading: (loading: boolean) => void;
  setForecastError: (error: string | null) => void;
  
  setAirQuality: (airQuality: AirPollutionResponse) => void;
  setAirQualityLoading: (loading: boolean) => void;
  setAirQualityError: (error: string | null) => void;
  
  setSuggestions: (suggestions: SuggestionResult) => void;
  setSuggestionsLoading: (loading: boolean) => void;
  setSuggestionsError: (error: string | null) => void;
  
  setUnits: (units: 'metric' | 'imperial' | 'kelvin') => void;
  setLanguage: (language: string) => void;
  
  // Computed getters
  isAnyLoading: () => boolean;
  hasAllData: () => boolean;
  canShowSuggestions: () => boolean;
  
  // Utility actions
  reset: () => void;
  clearErrors: () => void;
}

const initialState = {
  currentLocation: null,
  isLocationLoading: false,
  locationError: null,

  currentWeather: null,
  isWeatherLoading: false,
  weatherError: null,
  lastWeatherUpdate: null,

  forecast: null,
  isForecastLoading: false,
  forecastError: null,
  lastForecastUpdate: null,

  airQuality: null,
  isAirQualityLoading: false,
  airQualityError: null,
  lastAirQualityUpdate: null,

  suggestions: [],
  alerts: [],
  isSuggestionsLoading: false,
  suggestionsError: null,

  units: 'metric' as const,
  language: 'en',
};

export const useWeatherStore = create<WeatherState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      ...initialState,

      // Location actions
      setLocation: (location) => set({ 
        currentLocation: location, 
        isLocationLoading: false, 
        locationError: null 
      }),
      setLocationLoading: (loading) => set({ isLocationLoading: loading }),
      setLocationError: (error) => set({ 
        locationError: error, 
        isLocationLoading: false 
      }),

      // Weather actions
      setCurrentWeather: (weather) => set({ 
        currentWeather: weather, 
        isWeatherLoading: false, 
        weatherError: null,
        lastWeatherUpdate: Date.now()
      }),
      setWeatherLoading: (loading) => set({ isWeatherLoading: loading }),
      setWeatherError: (error) => set({ 
        weatherError: error, 
        isWeatherLoading: false 
      }),

      // Forecast actions
      setForecast: (forecast) => set({ 
        forecast, 
        isForecastLoading: false, 
        forecastError: null,
        lastForecastUpdate: Date.now()
      }),
      setForecastLoading: (loading) => set({ isForecastLoading: loading }),
      setForecastError: (error) => set({ 
        forecastError: error, 
        isForecastLoading: false 
      }),

      // Air quality actions
      setAirQuality: (airQuality) => set({ 
        airQuality, 
        isAirQualityLoading: false, 
        airQualityError: null,
        lastAirQualityUpdate: Date.now()
      }),
      setAirQualityLoading: (loading) => set({ isAirQualityLoading: loading }),
      setAirQualityError: (error) => set({ 
        airQualityError: error, 
        isAirQualityLoading: false 
      }),

      // Suggestions actions
      setSuggestions: (suggestionResult) => set({ 
        suggestions: suggestionResult.suggestions,
        alerts: suggestionResult.alerts,
        isSuggestionsLoading: false, 
        suggestionsError: null 
      }),
      setSuggestionsLoading: (loading) => set({ isSuggestionsLoading: loading }),
      setSuggestionsError: (error) => set({ 
        suggestionsError: error, 
        isSuggestionsLoading: false 
      }),

      // Preference actions
      setUnits: (units) => set({ units }),
      setLanguage: (language) => set({ language }),

      // Computed getters
      isAnyLoading: () => {
        const state = get();
        return state.isLocationLoading || 
               state.isWeatherLoading || 
               state.isForecastLoading || 
               state.isAirQualityLoading || 
               state.isSuggestionsLoading;
      },

      hasAllData: () => {
        const state = get();
        return Boolean(
          state.currentLocation &&
          state.currentWeather &&
          state.forecast &&
          state.airQuality
        );
      },

      canShowSuggestions: () => {
        const state = get();
        return Boolean(
          state.currentWeather &&
          state.forecast &&
          state.suggestions.length > 0
        );
      },

      // Utility actions
      reset: () => set(initialState),
      clearErrors: () => set({
        locationError: null,
        weatherError: null,
        forecastError: null,
        airQualityError: null,
        suggestionsError: null,
      }),
    })),
    {
      name: 'weather-store',
    }
  )
);

// Selectors for better performance
export const useLocation = () => useWeatherStore((state) => state.currentLocation);
export const useCurrentWeather = () => useWeatherStore((state) => state.currentWeather);
export const useForecast = () => useWeatherStore((state) => state.forecast);
export const useAirQuality = () => useWeatherStore((state) => state.airQuality);
export const useSuggestions = () => useWeatherStore((state) => state.suggestions);
export const useAlerts = () => useWeatherStore((state) => state.alerts);
export const useIsLoading = () => useWeatherStore((state) => state.isAnyLoading());
export const useHasAllData = () => useWeatherStore((state) => state.hasAllData());
export const useCanShowSuggestions = () => useWeatherStore((state) => state.canShowSuggestions());

// Error selectors
export const useErrors = () => useWeatherStore((state) => ({
  location: state.locationError,
  weather: state.weatherError,
  forecast: state.forecastError,
  airQuality: state.airQualityError,
  suggestions: state.suggestionsError,
}));

// Loading selectors
export const useLoadingStates = () => useWeatherStore((state) => ({
  location: state.isLocationLoading,
  weather: state.isWeatherLoading,
  forecast: state.isForecastLoading,
  airQuality: state.isAirQualityLoading,
  suggestions: state.isSuggestionsLoading,
}));