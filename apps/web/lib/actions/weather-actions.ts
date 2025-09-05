"use server";

import { getForecast, getCurrentWeather, getExtendedForecast, getAirPollution } from "@/lib/api/weather";
import { getSolarWeatherData } from "@/lib/api/weather/open-meteo";
import { unstable_cache } from "next/cache";
import type { ForecastResponse, CurrentWeatherResponse, AirPollutionResponse } from "@repo/types";
import type { SolarForecast } from "@/lib/api/weather/open-meteo/types";

export interface ForecastResult {
  success: boolean;
  data?: ForecastResponse;
  error?: string;
}

export interface CurrentWeatherResult {
  success: boolean;
  data?: CurrentWeatherResponse;
  error?: string;
}

export interface ExtendedForecastResult {
  success: boolean;
  data?: ForecastResponse;
  error?: string;
}

export interface AirQualityResult {
  success: boolean;
  data?: AirPollutionResponse;
  error?: string;
}

export interface SolarForecastResult {
  success: boolean;
  data?: SolarForecast;
  error?: string;
}

export const getCurrentWeatherAction = unstable_cache(
  async (lat: number, lon: number, units: 'metric' | 'imperial' | 'kelvin' = 'metric'): Promise<CurrentWeatherResult> => {
    try {
      const weather = await getCurrentWeather(lat, lon, units);
      return {
        success: true,
        data: weather
      };
    } catch (error) {
      console.error('Failed to fetch current weather:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch current weather'
      };
    }
  },
  ['weather-current'],
  {
    revalidate: 5 * 60, // 5 minutes cache (current weather changes more frequently)
    tags: ['weather', 'current']
  }
);

export const getForecastAction = unstable_cache(
  async (lat: number, lon: number, units: 'metric' | 'imperial' | 'kelvin' = 'metric'): Promise<ForecastResult> => {
    try {
      const forecast = await getForecast(lat, lon, units);
      return {
        success: true,
        data: forecast
      };
    } catch (error) {
      console.error('Failed to fetch forecast:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch forecast'
      };
    }
  },
  ['weather-forecast'],
  {
    revalidate: 15 * 60, // 15 minutes cache
    tags: ['weather', 'forecast']
  }
);

export const getExtendedForecastAction = unstable_cache(
  async (lat: number, lon: number, locationName?: string): Promise<ExtendedForecastResult> => {
    try {
      const extendedForecast = await getExtendedForecast(lat, lon, locationName);
      return {
        success: true,
        data: extendedForecast || undefined // Convert null to undefined for cleaner API
      };
    } catch (error) {
      console.error('Failed to fetch extended forecast:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch extended forecast'
      };
    }
  },
  ['weather-extended-forecast'],
  {
    revalidate: 30 * 60, // 30 minutes cache (extended forecast changes less frequently)
    tags: ['weather', 'extended-forecast']
  }
);

export const getAirQualityAction = unstable_cache(
  async (lat: number, lon: number): Promise<AirQualityResult> => {
    try {
      const airQuality = await getAirPollution(lat, lon);
      return {
        success: true,
        data: airQuality
      };
    } catch (error) {
      console.error('Failed to fetch air quality:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch air quality'
      };
    }
  },
  ['weather-air-quality'],
  {
    revalidate: 10 * 60, // 10 minutes cache (air quality updates more frequently than forecast)
    tags: ['weather', 'air-quality']
  }
);

export const getSolarForecastAction = unstable_cache(
  async (lat: number, lon: number): Promise<SolarForecastResult> => {
    try {
      console.log("☀️ Fetching solar & UV data for server action at", lat, lon);
      const solarData = await getSolarWeatherData(lat, lon);
      
      if (solarData) {
        console.log("☀️ Solar data received:", {
          current_uv: solarData.uv_warnings.current_uv || 0,
          peak_uv: solarData.uv_warnings.peak_uv_today || 0,
          photography_score: solarData.photography_score || 0,
          solar_energy_score: solarData.solar_energy_score || 0,
          next_golden_hour: solarData.next_golden_hour?.minutes_until || 'none'
        });
      }
      
      return {
        success: true,
        data: solarData || undefined
      };
    } catch (error) {
      console.error('Failed to fetch solar forecast:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch solar forecast'
      };
    }
  },
  ['weather-solar'],
  {
    revalidate: 10 * 60, // 10 minutes cache - solar data changes more slowly
    tags: ['weather', 'solar']
  }
);