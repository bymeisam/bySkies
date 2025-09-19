import React from 'react';
import { WeatherIconProps } from '../../PremiumWeatherCard.constants';
import { getWeatherIconColor } from '../../PremiumWeatherCard.styles';
import { ICON_SIZES, WEATHER_CONDITIONS } from '../../PremiumWeatherCard.constants';

const WeatherIcon: React.FC<WeatherIconProps> = ({
  condition,
  isDay = true,
  size = 'medium'
}) => {
  const iconSize = ICON_SIZES[size];
  const iconColor = getWeatherIconColor(isDay);

  const renderIcon = () => {
    switch (condition.toLowerCase()) {
      case WEATHER_CONDITIONS.CLEAR:
        return isDay ? (
          <div className={`${iconSize} ${iconColor} relative`}>
            <svg fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          </div>
        ) : (
          <div className={`${iconSize} text-slate-300`}>
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </div>
        );

      case WEATHER_CONDITIONS.CLOUDS:
        return (
          <div className={`${iconSize} text-slate-400`}>
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
            </svg>
          </div>
        );

      case WEATHER_CONDITIONS.RAIN:
      case WEATHER_CONDITIONS.DRIZZLE:
        return (
          <div className={`${iconSize} text-blue-400`}>
            <svg fill="currentColor" viewBox="0 0 24 24">
              <line x1="8" y1="19" x2="8" y2="21" />
              <line x1="8" y1="13" x2="8" y2="15" />
              <line x1="16" y1="19" x2="16" y2="21" />
              <line x1="16" y1="13" x2="16" y2="15" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="12" y1="15" x2="12" y2="17" />
              <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" />
            </svg>
          </div>
        );

      case WEATHER_CONDITIONS.SNOW:
        return (
          <div className={`${iconSize} text-blue-200`}>
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L13.09 8.26L17 7L16.74 9.74L21.5 10.5L19.24 12L21.5 13.5L16.74 14.26L17 17L13.09 15.74L12 22L10.91 15.74L7 17L7.26 14.26L2.5 13.5L4.76 12L2.5 10.5L7.26 9.74L7 7L10.91 8.26L12 2Z" />
            </svg>
          </div>
        );

      case WEATHER_CONDITIONS.THUNDERSTORM:
        return (
          <div className={`${iconSize} text-yellow-400`}>
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-9.48 9.47A3.5 3.5 0 0 0 9 23h8a5 5 0 0 0 2-6.1z" />
              <path d="M13 11l-2 3h2l-2 3" />
            </svg>
          </div>
        );

      case WEATHER_CONDITIONS.MIST:
        return (
          <div className={`${iconSize} text-gray-400`}>
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9h18M3 15h18M3 21h18" />
            </svg>
          </div>
        );

      default:
        return (
          <div className={`${iconSize} ${iconColor}`}>
            <svg fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          </div>
        );
    }
  };

  return renderIcon();
};

export default WeatherIcon;