import type { ForecastListItem } from "./weather";

// Types for BySkies activity suggestion engine

export interface WeatherConditions {
  temp: number;
  feels_like: number;
  wind_speed: number;
  wind_gust?: number;
  precipitation?: number;
  precipitation_type?: string;
  cloud_cover: number;
  aqi: number;
  visibility: number;
  uv_icon?: string;
  time_of_day?: string;
}

export interface ActivitySuggestion {
  activity: string;
  description: string;
  confidence: number; // 0-1
  reasons: string[];
  start?: string; // ISO datetime for interval start
  end?: string; // ISO datetime for interval end
}

// Planning-focused weather alert for disruptions
export interface PlanningDisruptionAlert {
  type: "weather" | "air";
  message: string;
  severity: "soft" | "moderate" | "severe";
  affectedActivities?: string[];
  start?: string;
  end?: string;
}

// Air quality alert with trend
export interface AirQualityAlert {
  type: "air";
  aqi: number;
  message: string;
  trend: "improving" | "worsening" | "stable";
  start?: string;
  end?: string;
}

export interface SuggestionResult {
  suggestions: ActivitySuggestion[];
  alerts?: (PlanningDisruptionAlert | AirQualityAlert)[];
  conditions?: WeatherConditions;
  forecast?: ForecastListItem[]; // for reference
}
