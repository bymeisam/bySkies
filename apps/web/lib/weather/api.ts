// Utility functions for OpenWeatherMap APIs

import type {
  CurrentWeatherResponse,
  ForecastResponse,
  AirPollutionResponse,
  GeocodingResponse,
} from "@repo/types";

const API_KEY = process.env.OPENWEATHER_API_KEY;

const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";

function handleError(response: Response) {
  if (!response.ok) {
    throw new Error(
      `OpenWeatherMap error: ${response.status} ${response.statusText}`
    );
  }
  return response;
}

export async function getCurrentWeather(
  lat: number,
  lon: number,
  units: string = "metric"
): Promise<CurrentWeatherResponse> {
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;
  const res = await fetch(url);
  handleError(res);
  return res.json();
}

export async function getForecast(
  lat: number,
  lon: number,
  units: string = "metric"
): Promise<ForecastResponse> {
  const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;
  const res = await fetch(url);
  handleError(res);
  return res.json();
}

export async function getAirPollution(
  lat: number,
  lon: number
): Promise<AirPollutionResponse> {
  const url = `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  const res = await fetch(url);
  handleError(res);
  return res.json();
}

// Geocoding API: Search locations by name
export async function searchLocations(
  query: string,
  limit: number = 5
): Promise<GeocodingResponse> {
  const url = `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=${limit}&appid=${API_KEY}`;
  const res = await fetch(url);
  handleError(res);
  return res.json();
}

// Reverse Geocoding: Get location name from coordinates
export async function getLocationName(
  lat: number,
  lon: number
): Promise<GeocodingResponse> {
  const url = `${GEO_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;
  const res = await fetch(url);
  handleError(res);
  return res.json();
}
