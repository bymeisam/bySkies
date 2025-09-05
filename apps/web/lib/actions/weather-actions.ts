"use server";

import { getForecast, getCurrentWeather } from "@/lib/api/weather";
import { unstable_cache } from "next/cache";
import type { ForecastResponse, CurrentWeatherResponse } from "@repo/types";

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