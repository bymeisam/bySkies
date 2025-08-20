// TypeScript interfaces for OpenWeatherMap Geocoding API

export interface LocalNames {
  [key: string]: string;
}

export interface GeocodingResult {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
  local_names?: LocalNames;
}

export type GeocodingResponse = GeocodingResult[];

