export interface WeatherIconProps {
  condition: string;
  isDay?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const ICON_MAP = {
  clear: {
    day: 'sun',
    night: 'moon'
  },
  clouds: 'cloud',
  rain: 'rain',
  drizzle: 'drizzle',
  snow: 'snow',
  thunderstorm: 'thunderstorm',
  mist: 'mist'
} as const;