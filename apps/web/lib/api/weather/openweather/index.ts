// OpenWeatherMap API - Consolidated exports

export { getCurrentWeather } from './current';
export { getForecast } from './forecast';
export { getAirPollution } from './air-pollution';
export { searchLocations, getLocationName } from './geocoding';

export type {
  OpenWeatherMapConfig,
  OpenWeatherMapError,
  OpenWeatherMapResponse,
  CurrentWeatherResponse,
  ForecastResponse,
  AirPollutionResponse,
  GeocodingResponse,
} from './types';

export { openWeatherMapConfig, handleOpenWeatherMapError } from './config';