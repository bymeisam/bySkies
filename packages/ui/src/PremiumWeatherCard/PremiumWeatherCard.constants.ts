import type { CurrentWeatherResponse, AirPollutionResponse } from "@repo/types";
import type { PlanningDisruptionAlert, AirQualityAlert } from "@repo/types";

// Types
export interface PremiumWeatherCardProps {
  weather: CurrentWeatherResponse;
  airQuality?: AirPollutionResponse;
  alerts?: (PlanningDisruptionAlert | AirQualityAlert)[];
  isLoading?: boolean;
  error?: string | null;
  className?: string;
  locationName?: string;
}

export interface AQILevel {
  label: string;
  color: string;
  bgColor: string;
}

export interface WeatherIconProps {
  condition: string;
  isDay: boolean;
  size?: 'small' | 'medium' | 'large';
}

// Constants
export const AQI_LEVELS: Record<number, AQILevel> = {
  1: {
    label: "Good",
    color: "emerald",
    bgColor: "from-emerald-400/20 to-emerald-600/20",
  },
  2: {
    label: "Fair",
    color: "yellow",
    bgColor: "from-yellow-400/20 to-yellow-600/20",
  },
  3: {
    label: "Moderate",
    color: "orange",
    bgColor: "from-orange-400/20 to-orange-600/20",
  },
  4: {
    label: "Poor",
    color: "red",
    bgColor: "from-red-400/20 to-red-600/20",
  },
  5: {
    label: "Very Poor",
    color: "purple",
    bgColor: "from-purple-400/20 to-purple-600/20",
  },
};

export const ICON_SIZES = {
  small: "w-6 h-6",
  medium: "w-8 h-8",
  large: "w-12 h-12"
} as const;

export const WEATHER_CONDITIONS = {
  CLEAR: "clear",
  CLOUDS: "clouds",
  RAIN: "rain",
  SNOW: "snow",
  THUNDERSTORM: "thunderstorm",
  DRIZZLE: "drizzle",
  MIST: "mist"
} as const;

// Default props
export const DEFAULT_PROPS: Partial<PremiumWeatherCardProps> = {
  alerts: [],
  isLoading: false,
  className: "",
  locationName: ""
};

// Animation configurations
export const ANIMATION_CONFIG = {
  cardHover: {
    y: -5,
    scale: 1.02,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  metricHover: {
    scale: 1.05,
    transition: { duration: 0.2 }
  },
  floatingParticle: {
    duration: 8,
    repeat: Infinity,
    ease: "easeInOut"
  }
} as const;