// Open-Meteo API exports

export { getOpenMeteoForecast } from './forecast';
export type { OpenMeteoForecastParams } from './forecast';
export type { OpenMeteoForecastResponse } from './types';
export { OpenMeteoAPIError } from './client';

// Solar & UV exports
export { getSolarWeatherData, getSolarForecast, processSolarForecast } from './solar';
export type {
  OpenMeteoSolarResponse,
  SolarForecast,
  SolarTiming,
  DayInfo
} from './types';