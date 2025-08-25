// Shared weather service types - Provider agnostic interfaces

import type {
  CurrentWeatherResponse,
  ForecastResponse,
  AirPollutionResponse,
  GeocodingResponse,
} from "@repo/types";

// Weather service provider enumeration
export enum WeatherProvider {
  OPENWEATHER = 'openweather',
  OPENMETEO = 'openmeteo', // For future use
}

// Unified weather service interface
export interface WeatherService {
  getCurrentWeather(lat: number, lon: number, units?: string): Promise<CurrentWeatherResponse>;
  getForecast(lat: number, lon: number, units?: string): Promise<ForecastResponse>;
  getAirPollution(lat: number, lon: number): Promise<AirPollutionResponse>;
  searchLocations(query: string, limit?: number): Promise<GeocodingResponse>;
  getLocationName(lat: number, lon: number): Promise<GeocodingResponse>;
}

// Weather service configuration
export interface WeatherServiceConfig {
  provider: WeatherProvider;
  defaultUnits?: string;
  retryAttempts?: number;
  timeout?: number;
}

// Weather service error types
export class WeatherServiceError extends Error {
  constructor(
    message: string,
    public provider: WeatherProvider,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'WeatherServiceError';
  }
}

// Re-export shared types for convenience
export type {
  CurrentWeatherResponse,
  ForecastResponse,
  AirPollutionResponse,
  GeocodingResponse,
} from "@repo/types";