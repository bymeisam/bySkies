// OpenWeatherMap Current Weather API

import type { CurrentWeatherResponse } from './types';
import { openWeatherMapConfig, handleOpenWeatherMapError } from './config';

export async function getCurrentWeather(
  lat: number,
  lon: number,
  units: string = "metric",
): Promise<CurrentWeatherResponse> {
  const { apiKey, baseUrl } = openWeatherMapConfig;
  const url = `${baseUrl}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
  
  console.log("🌤️ API Call: getCurrentWeather", { lat, lon, units, url });
  
  const response = await fetch(url);
  handleOpenWeatherMapError(response);
  
  const data = await response.json();
  console.log("🌤️ API Response: getCurrentWeather", data);
  
  return data;
}