// TypeScript interfaces for OpenWeatherMap Current Weather and Forecast APIs

export interface Coord {
  lon: number;
  lat: number;
}

export interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface Main {
  temp: number;
  feels_like: number;
  humidity: number;
  pressure: number;
}

export interface Wind {
  speed: number;
  deg: number;
}

export interface Clouds {
  all: number;
}

export interface Sys {
  sunrise: number;
  sunset: number;
}

export interface CurrentWeatherResponse {
  coord: Coord;
  weather: Weather[];
  main: Main;
  wind: Wind;
  clouds: Clouds;
  visibility: number;
  dt: number;
  sys: Sys;
  name: string;
}

export interface ForecastListItem {
  dt: number;
  main: Main;
  weather: Weather[];
  clouds: Clouds;
  wind: Wind;
  rain?: { "3h": number };
  dt_txt: string;
}

export interface ForecastResponse {
  list: ForecastListItem[];
  city: {
    name: string;
    coord: Coord;
    country: string;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}
