"use server";

import { getForecast, getCurrentWeather, getExtendedForecast, getAirPollution } from "@/lib/api/weather";
import { getSolarWeatherData, getAgriculturalData, processAgriculturalData } from "@/lib/api/weather/open-meteo";
import { suggestActivitiesFromForecast, type EnhancedSuggestionResult } from "@/lib/suggestions";
import { unstable_cache } from "next/cache";
import type { ForecastResponse, CurrentWeatherResponse, AirPollutionResponse } from "@repo/types";
import type { SolarForecast, AgriculturalForecast } from "@/lib/api/weather/open-meteo/types";

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

export interface AgriculturalForecastResult {
  success: boolean;
  data?: AgriculturalForecast;
  error?: string;
}

export interface SmartActivitySuggestionsResult {
  success: boolean;
  data?: EnhancedSuggestionResult;
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

export const getAgriculturalForecastAction = unstable_cache(
  async (lat: number, lon: number): Promise<AgriculturalForecastResult> => {
    try {
      console.log("🌱 DEBUG: Fetching agricultural data for server action at", lat, lon);
      const agriculturalResponse = await getAgriculturalData({
        latitude: lat,
        longitude: lon,
        days: 7 // 7 days of data
      });
      
      const processedData = processAgriculturalData(agriculturalResponse);
      
      console.log("🌱 Agricultural data received:", {
        current_vpd: processedData?.current?.vapour_pressure_deficit || 0,
        current_humidity: processedData?.current?.relative_humidity || 0,
        plant_stress: processedData?.current?.plant_stress_level || 'unknown',
        watering_windows: processedData?.gardening_insights?.optimal_watering_windows?.length || 0,
        best_gardening_days: processedData?.weekly_summary?.best_gardening_days?.length || 0
      });
      
      return {
        success: true,
        data: processedData
      };
    } catch (error) {
      console.error('Failed to fetch agricultural forecast:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch agricultural forecast'
      };
    }
  },
  ['weather-agricultural'],
  {
    revalidate: 15 * 60, // 15 minutes cache - agricultural data changes less frequently
    tags: ['weather', 'agricultural']
  }
);

export const getSmartActivitySuggestionsAction = unstable_cache(
  async (lat: number, lon: number, locationName?: string): Promise<SmartActivitySuggestionsResult> => {
    try {
      console.log("🌱 DEBUG: GENERATING Smart Agricultural Activities for server action at", lat, lon, "location:", locationName);
      
      // Fetch required data in parallel
      const [forecastResult, airQualityResult, agriculturalResult] = await Promise.all([
        getForecastAction(lat, lon, 'metric'),
        getAirQualityAction(lat, lon),
        getAgriculturalForecastAction(lat, lon)
      ]);
      
      if (!forecastResult.success || !forecastResult.data) {
        throw new Error('No forecast data available for smart suggestions');
      }
      
      const forecast = forecastResult.data;
      const airQuality = airQualityResult.success ? airQualityResult.data : null;
      const agriculturalData = agriculturalResult.success ? agriculturalResult.data : undefined;
      
      const currentAqi = airQuality?.list?.[0]?.main?.aqi ?? 1;
      
      const suggestions = suggestActivitiesFromForecast(
        forecast,
        currentAqi,
        [], // TODO: Add AQI history
        new Date().toISOString(),
        agriculturalData,
        locationName
      );
      
      console.log("🌱 Generated", suggestions.smart_suggestions?.length || 0, "smart activities for server action at", locationName || `${lat}, ${lon}`);
      
      return {
        success: true,
        data: suggestions
      };
    } catch (error) {
      console.error("🌱 Smart Agricultural Activities generation failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate smart suggestions'
      };
    }
  },
  ['suggestions-smart-activities'],
  {
    revalidate: 5 * 60, // 5 minutes cache - same as original hook
    tags: ['suggestions', 'smart-activities']
  }
);