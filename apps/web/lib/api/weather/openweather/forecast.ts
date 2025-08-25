// OpenWeatherMap Forecast API

import type { ForecastResponse } from './types';
import { openWeatherMapConfig, handleOpenWeatherMapError } from './config';

export async function getForecast(
  lat: number,
  lon: number,
  units: string = "metric",
): Promise<ForecastResponse> {
  const { apiKey, baseUrl } = openWeatherMapConfig;
  const url = `${baseUrl}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
  
  console.log("📊 API Call: getForecast", { lat, lon, units, url });
  
  const response = await fetch(url);
  handleOpenWeatherMapError(response);
  
  const data = await response.json();
  console.log("📊 API Response: getForecast", data);
  
  return data;
}