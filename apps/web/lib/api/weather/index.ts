// Weather API - Main exports for application

// Unified service (recommended for new code)
export { 
  weatherService,
  UnifiedWeatherService,
  WeatherServiceError
} from './weather-service';

// Direct provider access (for legacy compatibility or specific needs)
export * as OpenWeatherMapAPI from './openweather';

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