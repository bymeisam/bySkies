"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  PremiumForecastCard,
  PremiumWeatherCard,
  PremiumActivityCard,
  SolarUVCard,
  SmartActivityCard,
  PremiumWeatherMap,
} from "@repo/ui";
import {
  getForecastAction,
  getCurrentWeatherAction,
  getExtendedForecastAction,
  getAirQualityAction,
  getSolarForecastAction,
  getAgriculturalForecastAction,
  getSmartActivitySuggestionsAction
} from "@/lib/actions/weather-actions";
import type { ForecastResponse, CurrentWeatherResponse, AirPollutionResponse } from "@repo/types";
import type { SolarForecast, AgriculturalForecast } from "@/lib/api/weather/open-meteo/types";
import type { EnhancedSuggestionResult } from "@/lib/suggestions";
import { WeatherTabs } from "@/components/ui/weather-tabs";
import { styles, motionVariants } from "./weather-cards-wrapper.styles";

interface WeatherCardsWrapperProps {
  lat: number;
  lon: number;
  locationName?: string;
  units?: 'metric' | 'imperial' | 'kelvin';
}

interface WeatherData {
  currentWeather: CurrentWeatherResponse | null;
  forecast: ForecastResponse | null;
  extendedForecast: ForecastResponse | null;
  airQuality: AirPollutionResponse | null;
  solarForecast: SolarForecast | null;
  agriculturalForecast: AgriculturalForecast | null;
  smartSuggestions: EnhancedSuggestionResult | null;
  error: string | null;
  loading: boolean;
}

function WeatherCardsLoading() {
  return (
    <div className={styles.loadingContainer}>
      {[...Array(5)].map((_, i) => (
        <div key={i} className={styles.loadingItem}>
          <div className={styles.loadingContent}></div>
        </div>
      ))}
    </div>
  );
}

export function WeatherCardsWrapper({ lat, lon, locationName, units = 'metric' }: WeatherCardsWrapperProps) {
  const [weatherData, setWeatherData] = useState<WeatherData>({
    currentWeather: null,
    forecast: null,
    extendedForecast: null,
    airQuality: null,
    solarForecast: null,
    agriculturalForecast: null,
    smartSuggestions: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    async function fetchWeatherData() {
      if (isNaN(lat) || isNaN(lon)) {
        setWeatherData(prev => ({
          ...prev,
          error: "Invalid coordinates provided",
          loading: false,
        }));
        return;
      }

      try {
        setWeatherData(prev => ({ ...prev, loading: true, error: null }));

        const [
          currentWeatherResult,
          forecastResult,
          extendedForecastResult,
          airQualityResult,
          solarForecastResult,
          agriculturalForecastResult,
          smartSuggestionsResult
        ] = await Promise.all([
          getCurrentWeatherAction(lat, lon, units),
          getForecastAction(lat, lon, units),
          getExtendedForecastAction(lat, lon, `${lat.toFixed(2)}, ${lon.toFixed(2)}`),
          getAirQualityAction(lat, lon),
          getSolarForecastAction(lat, lon),
          getAgriculturalForecastAction(lat, lon),
          getSmartActivitySuggestionsAction(lat, lon, `${lat.toFixed(2)}, ${lon.toFixed(2)}`)
        ]);

        const errors = [];
        if (!currentWeatherResult.success && currentWeatherResult.error) {
          errors.push(`Current Weather: ${currentWeatherResult.error}`);
        }
        if (!forecastResult.success && forecastResult.error) {
          errors.push(`Forecast: ${forecastResult.error}`);
        }
        if (!extendedForecastResult.success && extendedForecastResult.error) {
          errors.push(`Extended Forecast: ${extendedForecastResult.error}`);
        }

        setWeatherData({
          currentWeather: currentWeatherResult.success ? (currentWeatherResult.data || null) : null,
          forecast: forecastResult.success ? (forecastResult.data || null) : null,
          extendedForecast: extendedForecastResult.success ? (extendedForecastResult.data || null) : null,
          airQuality: airQualityResult.success ? (airQualityResult.data || null) : null,
          solarForecast: solarForecastResult.success ? (solarForecastResult.data || null) : null,
          agriculturalForecast: agriculturalForecastResult.success ? (agriculturalForecastResult.data || null) : null,
          smartSuggestions: smartSuggestionsResult.success ? (smartSuggestionsResult.data || null) : null,
          error: errors.length > 0 ? errors.join(', ') : null,
          loading: false,
        });
      } catch (error) {
        setWeatherData(prev => ({
          ...prev,
          error: `Failed to fetch weather data: ${error instanceof Error ? error.message : 'Unknown error'}`,
          loading: false,
        }));
      }
    }

    fetchWeatherData();
  }, [lat, lon, units]);

  if (weatherData.loading) {
    return <WeatherCardsLoading />;
  }

  if (weatherData.error) {
    return (
      <motion.div variants={motionVariants.item} className={styles.errorContainer}>
        <h3 className={styles.errorHeading}>Error Loading Weather Data</h3>
        <p className={styles.errorMessage}>{weatherData.error}</p>
      </motion.div>
    );
  }

  if (!weatherData.currentWeather && !weatherData.forecast) {
    return (
      <motion.div variants={motionVariants.item} className={styles.emptyContainer}>
        <h3 className={styles.emptyHeading}>No Weather Data</h3>
        <p className={styles.emptyMessage}>Please check your location settings</p>
      </motion.div>
    );
  }

  const displayLocationName = locationName || weatherData.currentWeather?.name || weatherData.forecast?.city.name || 'Unknown Location';

  const tabs = [
    {
      id: 'current',
      label: 'Current Weather',
      icon: '🌤️',
      content: weatherData.currentWeather ? (
        <PremiumWeatherCard
          weather={weatherData.currentWeather}
          airQuality={weatherData.airQuality || undefined}
          alerts={[]}
          isLoading={false}
          error={null}
        />
      ) : (
        <div className={styles.tabEmptyState}>
          <p>Current weather data not available</p>
        </div>
      )
    },
    {
      id: 'forecast',
      label: 'Forecast',
      icon: '📊',
      content: weatherData.forecast ? (
        <PremiumForecastCard
          forecast={weatherData.forecast}
          extendedForecast={weatherData.extendedForecast}
          isLoading={false}
          onExtendedToggle={(enabled) => {
            console.log(`Extended forecast ${enabled ? 'enabled' : 'disabled'}`);
          }}
        />
      ) : (
        <div className={styles.tabEmptyState}>
          <p>Forecast data not available</p>
        </div>
      )
    },
    {
      id: 'map',
      label: 'Weather Map',
      icon: '🗺️',
      content: (
        <PremiumWeatherMap
          name={displayLocationName}
          lat={lat}
          lon={lon}
        />
      )
    },
    {
      id: 'activities',
      label: 'Activities',
      icon: '🎯',
      content: (
        <PremiumActivityCard
          suggestions={weatherData.smartSuggestions?.suggestions || []}
          isLoading={false}
          locationName={displayLocationName}
          timezone={weatherData.currentWeather?.timezone}
        />
      )
    },
    {
      id: 'solar',
      label: 'Solar & UV',
      icon: '☀️',
      content: (
        <SolarUVCard
          solarForecast={weatherData.solarForecast || null}
          isLoading={false}
        />
      )
    },
    {
      id: 'agriculture',
      label: 'Agriculture',
      icon: '🌱',
      content: (
        <SmartActivityCard
          suggestions={weatherData.smartSuggestions?.smart_suggestions || []}
          isLoading={false}
          locationName={displayLocationName}
          timezone={weatherData.currentWeather?.timezone}
          optimalGardeningDays={
            weatherData.agriculturalForecast?.weekly_summary?.best_gardening_days?.length || 0
          }
        />
      )
    }
  ];

  return (
    <motion.div variants={motionVariants.item}>
      <WeatherTabs tabs={tabs} defaultTab="current" />
    </motion.div>
  );
}