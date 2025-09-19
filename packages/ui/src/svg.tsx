import React from 'react';
import { styles } from './svg.styles';

export type SvgName =
  | 'sun'
  | 'moon'
  | 'cloud'
  | 'rain'
  | 'snow'
  | 'thunderstorm'
  | 'mist'
  | 'warning'
  | 'chevron-down'
  | 'star'
  | 'map-pin'
  | 'loader'
  | 'navigation'
  | 'thermometer'
  | 'wind'
  | 'droplets'
  | 'eye'
  | 'clock'
  | 'globe'
  | 'check'
  | 'search'
  | 'x'
  | 'camera'
  | 'shield'
  | 'sunrise'
  | 'sunset'
  | 'zap'
  | 'umbrella'
  | 'cloud-rain'
  | 'wind-icon'
  | 'activity'
  | 'trending-up'
  | 'alert-triangle'
  | 'info'
  | 'calendar'
  | 'map'
  | 'maximize'
  | 'minimize'
  | 'refresh';

interface SvgProps {
  name: SvgName;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

const svgPaths: Record<SvgName, React.ReactNode> = {
  sun: (
    <>
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </>
  ),
  moon: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />,
  cloud: <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />,
  rain: (
    <>
      <line x1="8" y1="19" x2="8" y2="21" />
      <line x1="8" y1="13" x2="8" y2="15" />
      <line x1="16" y1="19" x2="16" y2="21" />
      <line x1="16" y1="13" x2="16" y2="15" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="12" y1="15" x2="12" y2="17" />
      <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" />
    </>
  ),
  snow: (
    <path d="M12 2L13.09 8.26L17 7L16.74 9.74L21.5 10.5L19.24 12L21.5 13.5L16.74 14.26L17 17L13.09 15.74L12 22L10.91 15.74L7 17L7.26 14.26L2.5 13.5L4.76 12L2.5 10.5L7.26 9.74L7 7L10.91 8.26L12 2Z" />
  ),
  thunderstorm: (
    <>
      <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-9.48 9.47A3.5 3.5 0 0 0 9 23h8a5 5 0 0 0 2-6.1z" />
      <path d="M13 11l-2 3h2l-2 3" />
    </>
  ),
  mist: <path d="M3 9h18M3 15h18M3 21h18" />,
  warning: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.084 16.5c-.77.833.192 2.5 1.732 2.5z"
    />
  ),
  'chevron-down': (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  ),
  star: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
  'map-pin': (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
  ),
  loader: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  ),
  navigation: (
    <polygon points="3,11 22,2 13,21 11,13 3,11" />
  ),
  thermometer: (
    <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
  ),
  wind: (
    <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2M9.6 4.6A2 2 0 1 1 11 8H2m8.6 12a2.5 2.5 0 1 0 2.4-4H2" />
  ),
  droplets: (
    <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" />
  ),
  eye: (
    <>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12,6 12,12 16,14" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </>
  ),
  check: (
    <polyline points="20,6 9,17 4,12" />
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </>
  ),
  x: (
    <>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </>
  ),
  camera: (
    <>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </>
  ),
  shield: (
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  ),
  sunrise: (
    <>
      <path d="M17 18a5 5 0 0 0-10 0" />
      <line x1="12" y1="2" x2="12" y2="9" />
      <line x1="4.22" y1="10.22" x2="5.64" y2="11.64" />
      <line x1="1" y1="18" x2="3" y2="18" />
      <line x1="21" y1="18" x2="23" y2="18" />
      <line x1="18.36" y1="11.64" x2="19.78" y2="10.22" />
      <line x1="23" y1="22" x2="1" y2="22" />
      <polyline points="8,6 12,2 16,6" />
    </>
  ),
  sunset: (
    <>
      <path d="M17 18a5 5 0 0 0-10 0" />
      <line x1="12" y1="9" x2="12" y2="2" />
      <line x1="4.22" y1="10.22" x2="5.64" y2="11.64" />
      <line x1="1" y1="18" x2="3" y2="18" />
      <line x1="21" y1="18" x2="23" y2="18" />
      <line x1="18.36" y1="11.64" x2="19.78" y2="10.22" />
      <line x1="23" y1="22" x2="1" y2="22" />
      <polyline points="16,5 12,9 8,5" />
    </>
  ),
  zap: (
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" />
  ),
  umbrella: (
    <path d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7" />
  ),
  'cloud-rain': (
    <>
      <line x1="16" y1="13" x2="16" y2="21" />
      <line x1="8" y1="13" x2="8" y2="21" />
      <line x1="12" y1="15" x2="12" y2="23" />
      <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" />
    </>
  ),
  'wind-icon': (
    <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2M9.6 4.6A2 2 0 1 1 11 8H2m8.6 12a2.5 2.5 0 1 0 2.4-4H2" />
  ),
  activity: (
    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
  ),
  'trending-up': (
    <>
      <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
      <polyline points="17,6 23,6 23,12" />
    </>
  ),
  'alert-triangle': (
    <>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </>
  ),
  map: (
    <>
      <polygon points="1,6 1,22 8,18 16,22 23,18 23,2 16,6 8,2 1,6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </>
  ),
  maximize: (
    <>
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
    </>
  ),
  minimize: (
    <>
      <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
    </>
  ),
  refresh: (
    <>
      <path d="M21 2v6h-6" />
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M3 22v-6h6" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    </>
  ),
};

export const Svg: React.FC<SvgProps> = ({
  name,
  size = 'md',
  className = '',
  fill = 'currentColor',
  stroke = 'currentColor',
  strokeWidth = 2,
}) => {
  const svgContent = svgPaths[name];

  if (!svgContent) {
    console.warn(`SVG icon "${name}" not found`);
    return null;
  }

  return (
    <svg
      className={styles.svg({ size, className })}
      fill="none"
      viewBox="0 0 24 24"
      stroke={stroke}
      strokeWidth={strokeWidth}
    >
      {React.cloneElement(svgContent as React.ReactElement, {
        fill: fill === 'currentColor' ? 'currentColor' : fill,
        stroke: stroke === 'currentColor' ? 'currentColor' : stroke,
      })}
    </svg>
  );
};