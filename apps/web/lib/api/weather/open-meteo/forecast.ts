// Open-Meteo daily forecast API implementation

import { makeOpenMeteoRequest } from './client';
import type { OpenMeteoForecastResponse } from './types';
import { WEATHER_CODE_MAP } from './types';
import type { ForecastResponse, ForecastListItem, Weather } from '@repo/types';

export interface OpenMeteoForecastParams {
  latitude: number;
  longitude: number;
  forecast_days?: number; // 1-16 days, default 7
}

// Convert Open-Meteo forecast to OpenWeatherMap-compatible format
function convertOpenMeteoToForecast(
  openMeteoData: OpenMeteoForecastResponse,
  locationName?: string
): ForecastResponse {
  const { daily } = openMeteoData;
  
  const list: ForecastListItem[] = daily.time.map((dateStr, index) => {
    const date = new Date(dateStr);
    const weatherCode = daily.weather_code[index];
    const weatherInfo = WEATHER_CODE_MAP[weatherCode] || WEATHER_CODE_MAP[0];
    
    const tempMax = daily.temperature_2m_max[index] ?? 20;
    const tempMin = daily.temperature_2m_min[index] ?? 15;
    const windSpeed = daily.wind_speed_10m_max[index] ?? 0;
    const precipitation = daily.precipitation_sum[index] ?? 0;
    
    const weather: Weather = {
      id: weatherCode ?? 0,
      main: weatherInfo.main,
      description: weatherInfo.description,
      icon: weatherInfo.icon,
    };
    
    return {
      dt: Math.floor(date.getTime() / 1000),
      main: {
        temp: (tempMax + tempMin) / 2,
        feels_like: (tempMax + tempMin) / 2,
        humidity: 65, // Default value as Open-Meteo free tier doesn't include humidity in daily
        pressure: 1013, // Default value
      },
      weather: [weather],
      clouds: {
        all: (weatherCode ?? 0) >= 2 ? 75 : 25, // Estimate based on weather code
      },
      wind: {
        speed: windSpeed,
        deg: 0, // Not available in daily data
      },
      rain: precipitation > 0 ? { '3h': precipitation } : undefined,
      dt_txt: date.toISOString(),
    };
  });

  return {
    list,
    city: {
      name: locationName || 'Unknown Location',
      coord: {
        lat: openMeteoData.latitude,
        lon: openMeteoData.longitude,
      },
      country: 'Unknown',
      timezone: openMeteoData.utc_offset_seconds,
      sunrise: 0, // Not available in forecast
      sunset: 0, // Not available in forecast
    },
  };
}

export async function getOpenMeteoForecast(
  latitude: number,
  longitude: number,
  forecastDays: number = 7,
  locationName?: string
): Promise<ForecastResponse> {
  const params: OpenMeteoForecastParams = {
    latitude,
    longitude,
    forecast_days: Math.min(Math.max(forecastDays, 1), 16), // Clamp between 1-16 days
  };

  // Add required daily parameters
  const requestParams = {
    ...params,
    daily: [
      'temperature_2m_max',
      'temperature_2m_min', 
      'weather_code',
      'precipitation_sum',
      'wind_speed_10m_max'
    ].join(','),
    temperature_unit: 'celsius',
    timezone: 'auto',
  };

  const data = await makeOpenMeteoRequest<OpenMeteoForecastResponse>(
    '/forecast',
    requestParams
  );

  return convertOpenMeteoToForecast(data, locationName);
}