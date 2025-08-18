import { WeatherData, ForecastData } from "@byskies/types/weather";

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

interface ApiError {
  cod: string;
  message: string;
}

async function fetcher<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(errorData.message || "Something went wrong");
  }
  return response.json();
}

export async function getCurrentWeather(city: string): Promise<WeatherData> {
  if (!API_KEY) {
    throw new Error("OpenWeatherMap API key is not set.");
  }
  const url = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`;
  return fetcher<WeatherData>(url);
}

export async function getForecast(city: string): Promise<ForecastData> {
  if (!API_KEY) {
    throw new Error("OpenWeatherMap API key is not set.");
  }
  const url = `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`;
  return fetcher<ForecastData>(url);
}
