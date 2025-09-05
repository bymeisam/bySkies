// Unified Weather Service - Provider abstraction layer

import {
  WeatherProvider,
  WeatherServiceError,
} from './types';
import type {
  WeatherService,
  WeatherServiceConfig,
  CurrentWeatherResponse,
  ForecastResponse,
  AirPollutionResponse,
  GeocodingResponse,
} from './types';

import * as OpenWeatherMapAPI from './openweather';
import * as OpenMeteoAPI from './open-meteo';

// OpenWeatherMap service implementation
class OpenWeatherMapService implements WeatherService {
  async getCurrentWeather(
    lat: number,
    lon: number,
    units: string = "metric"
  ): Promise<CurrentWeatherResponse> {
    try {
      return await OpenWeatherMapAPI.getCurrentWeather(lat, lon, units);
    } catch (error) {
      throw new WeatherServiceError(
        `Failed to get current weather: ${error instanceof Error ? error.message : 'Unknown error'}`,
        WeatherProvider.OPENWEATHER,
        error instanceof Error ? error : undefined
      );
    }
  }

  async getForecast(
    lat: number,
    lon: number,
    units: string = "metric"
  ): Promise<ForecastResponse> {
    try {
      return await OpenWeatherMapAPI.getForecast(lat, lon, units);
    } catch (error) {
      throw new WeatherServiceError(
        `Failed to get forecast: ${error instanceof Error ? error.message : 'Unknown error'}`,
        WeatherProvider.OPENWEATHER,
        error instanceof Error ? error : undefined
      );
    }
  }

  async getAirPollution(lat: number, lon: number): Promise<AirPollutionResponse> {
    try {
      return await OpenWeatherMapAPI.getAirPollution(lat, lon);
    } catch (error) {
      throw new WeatherServiceError(
        `Failed to get air pollution data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        WeatherProvider.OPENWEATHER,
        error instanceof Error ? error : undefined
      );
    }
  }

  async searchLocations(query: string, limit: number = 5): Promise<GeocodingResponse> {
    try {
      return await OpenWeatherMapAPI.searchLocations(query, limit);
    } catch (error) {
      throw new WeatherServiceError(
        `Failed to search locations: ${error instanceof Error ? error.message : 'Unknown error'}`,
        WeatherProvider.OPENWEATHER,
        error instanceof Error ? error : undefined
      );
    }
  }

  async getLocationName(lat: number, lon: number): Promise<GeocodingResponse> {
    try {
      return await OpenWeatherMapAPI.getLocationName(lat, lon);
    } catch (error) {
      throw new WeatherServiceError(
        `Failed to get location name: ${error instanceof Error ? error.message : 'Unknown error'}`,
        WeatherProvider.OPENWEATHER,
        error instanceof Error ? error : undefined
      );
    }
  }
}

// OpenMeteo service implementation (limited functionality)
class OpenMeteoService implements WeatherService {
  async getCurrentWeather(
    lat: number,
    lon: number,
    units: string = "metric"
  ): Promise<CurrentWeatherResponse> {
    throw new WeatherServiceError(
      'Current weather not available through Open-Meteo. Use OpenWeatherMap for current conditions.',
      WeatherProvider.OPENMETEO
    );
  }

  async getForecast(
    lat: number,
    lon: number,
    units: string = "metric"
  ): Promise<ForecastResponse> {
    try {
      // Get 16-day forecast from Open-Meteo
      return await OpenMeteoAPI.getOpenMeteoForecast(lat, lon, 16);
    } catch (error) {
      throw new WeatherServiceError(
        `Failed to get Open-Meteo forecast: ${error instanceof Error ? error.message : 'Unknown error'}`,
        WeatherProvider.OPENMETEO,
        error instanceof Error ? error : undefined
      );
    }
  }

  async getAirPollution(lat: number, lon: number): Promise<AirPollutionResponse> {
    throw new WeatherServiceError(
      'Air pollution data not available through Open-Meteo. Use OpenWeatherMap for air quality data.',
      WeatherProvider.OPENMETEO
    );
  }

  async searchLocations(query: string, limit: number = 5): Promise<GeocodingResponse> {
    throw new WeatherServiceError(
      'Location search not available through Open-Meteo. Use OpenWeatherMap for geocoding.',
      WeatherProvider.OPENMETEO
    );
  }

  async getLocationName(lat: number, lon: number): Promise<GeocodingResponse> {
    throw new WeatherServiceError(
      'Reverse geocoding not available through Open-Meteo. Use OpenWeatherMap for location names.',
      WeatherProvider.OPENMETEO
    );
  }
}

// Weather service factory
class WeatherServiceFactory {
  private static instances: Map<WeatherProvider, WeatherService> = new Map();

  static getService(provider: WeatherProvider): WeatherService {
    if (this.instances.has(provider)) {
      return this.instances.get(provider)!;
    }

    let service: WeatherService;
    switch (provider) {
      case WeatherProvider.OPENWEATHER:
        service = new OpenWeatherMapService();
        break;
      case WeatherProvider.OPENMETEO:
        service = new OpenMeteoService();
        break;
      default:
        throw new Error(`Unsupported weather provider: ${provider}`);
    }

    this.instances.set(provider, service);
    return service;
  }
}

// Default weather service configuration
const defaultConfig: WeatherServiceConfig = {
  provider: WeatherProvider.OPENWEATHER,
  defaultUnits: 'metric',
  retryAttempts: 3,
  timeout: 10000,
};

// Unified weather service singleton
export class UnifiedWeatherService implements WeatherService {
  private service: WeatherService;
  private config: WeatherServiceConfig;

  constructor(config: Partial<WeatherServiceConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.service = WeatherServiceFactory.getService(this.config.provider);
  }

  async getCurrentWeather(
    lat: number,
    lon: number,
    units?: string
  ): Promise<CurrentWeatherResponse> {
    return this.service.getCurrentWeather(
      lat,
      lon,
      units || this.config.defaultUnits || 'metric'
    );
  }

  async getForecast(
    lat: number,
    lon: number,
    units?: string
  ): Promise<ForecastResponse> {
    return this.service.getForecast(
      lat,
      lon,
      units || this.config.defaultUnits || 'metric'
    );
  }

  async getAirPollution(lat: number, lon: number): Promise<AirPollutionResponse> {
    return this.service.getAirPollution(lat, lon);
  }

  async searchLocations(query: string, limit?: number): Promise<GeocodingResponse> {
    return this.service.searchLocations(query, limit);
  }

  async getLocationName(lat: number, lon: number): Promise<GeocodingResponse> {
    return this.service.getLocationName(lat, lon);
  }

  // Configuration methods
  getProvider(): WeatherProvider {
    return this.config.provider;
  }

  switchProvider(provider: WeatherProvider): void {
    if (provider !== this.config.provider) {
      this.config.provider = provider;
      this.service = WeatherServiceFactory.getService(provider);
    }
  }

  // Get extended forecast from Open-Meteo while keeping current provider
  async getExtendedForecast(
    lat: number,
    lon: number,
    locationName?: string
  ): Promise<ForecastResponse | null> {
    try {
      return await OpenMeteoAPI.getOpenMeteoForecast(lat, lon, 16, locationName);
    } catch (error) {
      console.warn('Extended forecast unavailable:', error);
      return null;
    }
  }
}

// Default service instance
export const weatherService = new UnifiedWeatherService();

// Export types and utilities
export type { WeatherService, WeatherServiceConfig, WeatherProvider };
export { WeatherServiceError } from './types';