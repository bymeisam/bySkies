// OpenWeatherMap API configuration

import { OpenWeatherMapConfig, OpenWeatherMapError } from './types';

// API Configuration
const API_KEY = process.env.OPENWEATHER_API_KEY || "55cd1a140017e2635e0fdbc9b920ae24";
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";

export const openWeatherMapConfig: OpenWeatherMapConfig = {
  apiKey: API_KEY,
  baseUrl: BASE_URL,
  geoUrl: GEO_URL,
};

// Validate API key on module load
if (!API_KEY) {
  console.error(
    "❌ OPENWEATHER_API_KEY is missing! Please add it to your .env.local file",
  );
}

// Common error handler for OpenWeatherMap API responses
export function handleOpenWeatherMapError(response: Response): Response {
  if (!response.ok) {
    if (response.status === 401) {
      throw new OpenWeatherMapError(
        `OpenWeatherMap API key is invalid or missing. Please check your OPENWEATHER_API_KEY in .env.local`,
        response.status,
        response.statusText
      );
    }
    throw new OpenWeatherMapError(
      `OpenWeatherMap error: ${response.status} ${response.statusText}`,
      response.status,
      response.statusText
    );
  }
  return response;
}