// Weather API - Main exports for application

// Unified service (recommended for new code)
export { 
  weatherService,
  UnifiedWeatherService,
  WeatherServiceError
} from './weather-service';

// Direct provider access (for legacy compatibility or specific needs)
export * as OpenWeatherMapAPI from './openweather';
export * as OpenMeteoAPI from './open-meteo';

// Types
export type {
  WeatherService,
  WeatherServiceConfig,
  WeatherProvider,
  CurrentWeatherResponse,
  ForecastResponse,
  AirPollutionResponse,
  GeocodingResponse,
} from './types';

// Legacy compatibility exports - for gradual migration
export {
  getCurrentWeather,
  getForecast,
  getAirPollution,
  searchLocations,
  getLocationName,
} from './openweather';

// Extended forecast function
export const getExtendedForecast = async (
  lat: number, 
  lon: number, 
  locationName?: string
) => {
  const { weatherService } = await import('./weather-service');
  return weatherService.getExtendedForecast(lat, lon, locationName);
};