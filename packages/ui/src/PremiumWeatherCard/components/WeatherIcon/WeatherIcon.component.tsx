import React from 'react';
import { WeatherIconProps } from '../../PremiumWeatherCard.constants';
import { getWeatherIconColor } from '../../PremiumWeatherCard.styles';
import { ICON_SIZES, WEATHER_CONDITIONS } from '../../PremiumWeatherCard.constants';
import { Svg } from '../../../svg';

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
            <Svg name="sun" fill="currentColor" />
          </div>
        ) : (
          <div className={`${iconSize} text-slate-300`}>
            <Svg name="moon" fill="currentColor" />
          </div>
        );

      case WEATHER_CONDITIONS.CLOUDS:
        return (
          <div className={`${iconSize} text-slate-400`}>
            <Svg name="cloud" fill="currentColor" />
          </div>
        );

      case WEATHER_CONDITIONS.RAIN:
      case WEATHER_CONDITIONS.DRIZZLE:
        return (
          <div className={`${iconSize} text-blue-400`}>
            <Svg name="rain" fill="currentColor" />
          </div>
        );

      case WEATHER_CONDITIONS.SNOW:
        return (
          <div className={`${iconSize} text-blue-200`}>
            <Svg name="snow" fill="currentColor" />
          </div>
        );

      case WEATHER_CONDITIONS.THUNDERSTORM:
        return (
          <div className={`${iconSize} text-yellow-400`}>
            <Svg name="thunderstorm" fill="currentColor" />
          </div>
        );

      case WEATHER_CONDITIONS.MIST:
        return (
          <div className={`${iconSize} text-gray-400`}>
            <Svg name="mist" fill="currentColor" />
          </div>
        );

      default:
        return (
          <div className={`${iconSize} ${iconColor}`}>
            <Svg name="sun" fill="currentColor" />
          </div>
        );
    }
  };

  return renderIcon();
};

export default WeatherIcon;