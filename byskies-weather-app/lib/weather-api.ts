import type { OpenWeatherMapData, ForecastData } from '@/types/weather';

const API_KEY = process.env.OPENWEATHER_API_KEY;
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

if (!API_KEY) {
  throw new Error('Missing OpenWeatherMap API key. Make sure to set it in your .env.local file.');
}

export async function getCurrentWeather(lat: number, lon: number): Promise<OpenWeatherMapData> {
  const url = `${API_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to fetch current weather data: ${errorData.message}`);
  }

  return response.json();
}

export async function getForecast(lat: number, lon: number): Promise<ForecastData> {
  const url = `${API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to fetch forecast data: ${errorData.message}`);
  }

  return response.json();
}
