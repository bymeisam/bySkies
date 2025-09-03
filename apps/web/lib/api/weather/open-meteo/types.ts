// Open-Meteo API types for forecast data

export interface OpenMeteoForecastResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  daily_units: {
    time: string;
    temperature_2m_max: string;
    temperature_2m_min: string;
    weather_code: string;
    precipitation_sum: string;
    wind_speed_10m_max: string;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
    precipitation_sum: number[];
    wind_speed_10m_max: number[];
  };
}

// Weather code mappings for Open-Meteo
export const WEATHER_CODE_MAP: Record<number, { main: string; description: string; icon: string }> = {
  0: { main: 'Clear', description: 'clear sky', icon: '01d' },
  1: { main: 'Clear', description: 'mainly clear', icon: '01d' },
  2: { main: 'Clouds', description: 'partly cloudy', icon: '02d' },
  3: { main: 'Clouds', description: 'overcast', icon: '03d' },
  45: { main: 'Mist', description: 'fog', icon: '50d' },
  48: { main: 'Mist', description: 'depositing rime fog', icon: '50d' },
  51: { main: 'Drizzle', description: 'light drizzle', icon: '09d' },
  53: { main: 'Drizzle', description: 'moderate drizzle', icon: '09d' },
  55: { main: 'Drizzle', description: 'dense drizzle', icon: '09d' },
  56: { main: 'Drizzle', description: 'light freezing drizzle', icon: '09d' },
  57: { main: 'Drizzle', description: 'dense freezing drizzle', icon: '09d' },
  61: { main: 'Rain', description: 'slight rain', icon: '10d' },
  63: { main: 'Rain', description: 'moderate rain', icon: '10d' },
  65: { main: 'Rain', description: 'heavy rain', icon: '10d' },
  66: { main: 'Rain', description: 'light freezing rain', icon: '13d' },
  67: { main: 'Rain', description: 'heavy freezing rain', icon: '13d' },
  71: { main: 'Snow', description: 'slight snow fall', icon: '13d' },
  73: { main: 'Snow', description: 'moderate snow fall', icon: '13d' },
  75: { main: 'Snow', description: 'heavy snow fall', icon: '13d' },
  77: { main: 'Snow', description: 'snow grains', icon: '13d' },
  80: { main: 'Rain', description: 'slight rain showers', icon: '09d' },
  81: { main: 'Rain', description: 'moderate rain showers', icon: '09d' },
  82: { main: 'Rain', description: 'violent rain showers', icon: '09d' },
  85: { main: 'Snow', description: 'slight snow showers', icon: '13d' },
  86: { main: 'Snow', description: 'heavy snow showers', icon: '13d' },
  95: { main: 'Thunderstorm', description: 'thunderstorm', icon: '11d' },
  96: { main: 'Thunderstorm', description: 'thunderstorm with slight hail', icon: '11d' },
  99: { main: 'Thunderstorm', description: 'thunderstorm with heavy hail', icon: '11d' },
};

// Open-Meteo Solar & UV response (available worldwide)
export interface OpenMeteoSolarResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  hourly_units: {
    time: string;
    shortwave_radiation: string;
    direct_radiation: string;
    diffuse_radiation: string;
    uv_index: string;
  };
  hourly: {
    time: string[];
    shortwave_radiation: number[];
    direct_radiation: number[];
    diffuse_radiation: number[];
    uv_index: number[];
  };
  daily_units: {
    time: string;
    sunrise: string;
    sunset: string;
    sunshine_duration: string;
    uv_index_max: string;
  };
  daily: {
    time: string[];
    sunrise: string[];
    sunset: string[];
    sunshine_duration: number[];
    uv_index_max: number[];
  };
}

// Processed solar data for enhanced activity planning
export interface SolarTiming {
  time: string;
  shortwave_radiation: number; // W/m²
  direct_radiation: number;    // W/m²
  diffuse_radiation: number;   // W/m²
  uv_index: number;           // 0-11+ scale
  isGoldenHour: boolean;
  isDaylight: boolean;
}

export interface DayInfo {
  date: string;
  sunrise: string;
  sunset: string;
  sunshine_duration: number; // seconds
  daylight_duration: number; // minutes
  uv_index_max: number;
  golden_hour_start: string;
  golden_hour_end: string;
}

export interface SolarForecast {
  current: SolarTiming | null;
  hourly: SolarTiming[];
  daily: DayInfo[];
  next_golden_hour?: {
    type: 'morning' | 'evening';
    start: string;
    end: string;
    minutes_until: number;
  };
  uv_warnings: {
    current_uv: number;
    peak_uv_today: number;
    protection_needed: boolean;
    protection_message: string;
  };
  photography_score: number; // 0-100
  solar_energy_score: number; // 0-100
};