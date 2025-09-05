// OpenWeatherMap specific types and configurations

export interface OpenWeatherMapConfig {
  apiKey: string;
  baseUrl: string;
  geoUrl: string;
}

// OpenWeatherMap error handling
export class OpenWeatherMapError extends Error {
  constructor(
    message: string,
    public status?: number,
    public statusText?: string
  ) {
    super(message);
    this.name = 'OpenWeatherMapError';
  }
}

// OpenWeatherMap API response wrapper
export interface OpenWeatherMapResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

// Re-export types from shared types for convenience
export type {
  CurrentWeatherResponse,
  ForecastResponse,
  AirPollutionResponse,
  GeocodingResponse,
} from "@repo/types";