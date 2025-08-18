export interface WeatherData {
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy';
  location: string;
}

export interface ActivitySuggestion {
  name: string;
  description: string;
}
