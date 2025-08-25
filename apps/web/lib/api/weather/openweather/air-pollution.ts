// OpenWeatherMap Air Pollution API

import type { AirPollutionResponse } from './types';
import { openWeatherMapConfig, handleOpenWeatherMapError } from './config';

export async function getAirPollution(
  lat: number,
  lon: number,
): Promise<AirPollutionResponse> {
  const { apiKey, baseUrl } = openWeatherMapConfig;
  const url = `${baseUrl}/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  
  console.log("🌬️ API Call: getAirPollution", { lat, lon, url });
  
  const response = await fetch(url);
  handleOpenWeatherMapError(response);
  
  const data = await response.json();
  console.log("🌬️ API Response: getAirPollution", data);
  
  return data;
}