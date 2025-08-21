// Utility functions for OpenWeatherMap APIs

import type {
  CurrentWeatherResponse,
  ForecastResponse,
  AirPollutionResponse,
  GeocodingResponse,
} from "@repo/types";

// const API_KEY = process.env.OPENWEATHER_API_KEY;
const API_KEY = "55cd1a140017e2635e0fdbc9b920ae24";

const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";

function handleError(response: Response) {
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(
        `OpenWeatherMap API key is invalid or missing. Please check your OPENWEATHER_API_KEY in .env.local`,
      );
    }
    throw new Error(
      `OpenWeatherMap error: ${response.status} ${response.statusText}`,
    );
  }
  return response;
}

// Validate API key on module load
if (!API_KEY) {
  console.error(
    "❌ OPENWEATHER_API_KEY is missing! Please add it to your .env.local file",
  );
}

export async function getCurrentWeather(
  lat: number,
  lon: number,
  units: string = "metric",
): Promise<CurrentWeatherResponse> {
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;
  console.log("🌤️ API Call: getCurrentWeather", { lat, lon, units, url });
  const res = await fetch(url);
  handleError(res);
  const data = await res.json();
  console.log("🌤️ API Response: getCurrentWeather", data);
  return data;
}

export async function getForecast(
  lat: number,
  lon: number,
  units: string = "metric",
): Promise<ForecastResponse> {
  const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;
  console.log("📊 API Call: getForecast", { lat, lon, units, url });
  const res = await fetch(url);
  handleError(res);
  const data = await res.json();
  console.log("📊 API Response: getForecast", data);
  return data;
}

export async function getAirPollution(
  lat: number,
  lon: number,
): Promise<AirPollutionResponse> {
  const url = `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  console.log("🌬️ API Call: getAirPollution", { lat, lon, url });
  const res = await fetch(url);
  handleError(res);
  const data = await res.json();
  console.log("🌬️ API Response: getAirPollution", data);
  return data;
}

// Geocoding API: Search locations by name
export async function searchLocations(
  query: string,
  limit: number = 5,
): Promise<GeocodingResponse> {
  const url = `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=${limit}&appid=${API_KEY}`;
  console.log("🔍 API Call: searchLocations", { query, limit, url });
  const res = await fetch(url);
  handleError(res);
  const data = await res.json();
  console.log("🔍 API Response: searchLocations", data);
  return data;
}

// Reverse Geocoding: Get location name from coordinates
export async function getLocationName(
  lat: number,
  lon: number,
): Promise<GeocodingResponse> {
  const url = `${GEO_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;
  console.log("📍 API Call: getLocationName", { lat, lon, url });
  const res = await fetch(url);
  handleError(res);
  const data = await res.json();
  console.log("📍 API Response: getLocationName", data);
  return data;
}
