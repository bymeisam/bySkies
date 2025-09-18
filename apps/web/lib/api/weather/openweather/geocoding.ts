// OpenWeatherMap Geocoding API

import type { GeocodingResponse } from "./types";
import { openWeatherMapConfig, handleOpenWeatherMapError } from "./config";

// Search locations by name
export async function searchLocations(
  query: string,
  limit: number = 5,
  abortSignal?: AbortSignal,
): Promise<GeocodingResponse> {
  const { apiKey, geoUrl } = openWeatherMapConfig;
  const url = `${geoUrl}/direct?q=${encodeURIComponent(query)}&limit=${limit}&appid=${apiKey}`;

  console.log("🔍 API Call: searchLocations", { query, limit, url });

  const response = await fetch(url, {
    signal: abortSignal,
  });
  handleOpenWeatherMapError(response);

  const data = await response.json();
  console.log("🔍 API Response: searchLocations", data);

  return data;
}

// Reverse Geocoding: Get location name from coordinates
export async function getLocationName(
  lat: number,
  lon: number,
): Promise<GeocodingResponse> {
  const { apiKey, geoUrl } = openWeatherMapConfig;
  const url = `${geoUrl}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;

  console.log("📍 API Call: getLocationName", { lat, lon, url });

  const response = await fetch(url);
  handleOpenWeatherMapError(response);

  const data: GeocodingResponse = await response.json();
  console.log("📍 API Response: getLocationName", data);

  return data;
}

