import { useMemo } from 'react';
import { AQI_LEVELS } from './PremiumWeatherCard.constants';
import type { CurrentWeatherResponse, AirPollutionResponse } from "@repo/types";
import { calculateLocalTime } from "../utils/time";

// Custom hook for weather card calculations and logic
export const usePremiumWeatherCard = (
  weather: CurrentWeatherResponse,
  airQuality?: AirPollutionResponse
) => {
  // Memoized calculations to avoid recalculating on every render
  const calculations = useMemo(() => {
    const currentAQI = airQuality?.list?.[0]?.main?.aqi || 1;
    const aqiInfo = AQI_LEVELS[currentAQI] || AQI_LEVELS[1];
    const temp = weather?.main?.temp ? Math.round(weather.main.temp) : 0;
    const feelsLike = weather?.main?.feels_like ? Math.round(weather.main.feels_like) : 0;
    const isDay = weather?.weather?.[0]?.icon?.includes("d") ?? true;
    const localTime = calculateLocalTime(weather?.timezone);
    const condition = weather?.weather?.[0]?.main || "Clear";
    const description = weather?.weather?.[0]?.description || "";

    // Weather metrics
    const metrics = {
      humidity: weather?.main?.humidity ?? 0,
      windSpeed: weather?.wind?.speed ? Math.round(weather.wind.speed) : 0,
      pressure: weather?.main?.pressure ?? 0,
      visibility: weather?.visibility
        ? `${(weather.visibility / 1000).toFixed(1)} km`
        : "N/A"
    };

    return {
      currentAQI,
      aqiInfo,
      temp,
      feelsLike,
      isDay,
      localTime,
      condition,
      description,
      metrics
    };
  }, [weather, airQuality]);

  return calculations;
};

// Custom hook for handling weather card animations
export const useWeatherCardAnimations = () => {
  const cardAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    whileHover: { y: -5, scale: 1.02 },
    transition: { duration: 0.3, ease: "easeOut" }
  };

  const temperatureAnimation = {
    initial: { scale: 0.5 },
    animate: { scale: 1 },
    transition: { duration: 0.5, ease: "easeOut" }
  };

  const metricAnimation = {
    whileHover: { scale: 1.05 },
    transition: { duration: 0.2 }
  };

  const iconAnimation = {
    animate: { rotate: [0, 5, -5, 0] },
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
  };

  const particleAnimations = {
    primary: {
      animate: { y: [-10, 10, -10], x: [-5, 5, -5] },
      transition: { duration: 8, repeat: Infinity, ease: "easeInOut" }
    },
    secondary: {
      animate: { y: [5, -15, 5], x: [2, -8, 2] },
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 2
      }
    }
  };

  const alertAnimation = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: "auto" },
    transition: { duration: 0.3 }
  };

  return {
    cardAnimation,
    temperatureAnimation,
    metricAnimation,
    iconAnimation,
    particleAnimations,
    alertAnimation
  };
};