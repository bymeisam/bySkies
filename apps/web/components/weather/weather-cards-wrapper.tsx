"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  PremiumForecastCard,
  PremiumWeatherCard,
  PremiumActivityCard,
  SolarUVCard,
  SmartActivityCard,
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

interface WeatherCardsWrapperProps {
  lat: number;
  lon: number;
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
    <div className="space-y-6">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 animate-pulse">
          <div className="h-32 bg-white/5 rounded-2xl"></div>
        </div>
      ))}
    </div>
  );
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export function WeatherCardsWrapper({ lat, lon, units = 'metric' }: WeatherCardsWrapperProps) {
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
          currentWeather: currentWeatherResult.success ? currentWeatherResult.data : null,
          forecast: forecastResult.success ? forecastResult.data : null,
          extendedForecast: extendedForecastResult.success ? extendedForecastResult.data : null,
          airQuality: airQualityResult.success ? airQualityResult.data : null,
          solarForecast: solarForecastResult.success ? solarForecastResult.data : null,
          agriculturalForecast: agriculturalForecastResult.success ? agriculturalForecastResult.data : null,
          smartSuggestions: smartSuggestionsResult.success ? smartSuggestionsResult.data : null,
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
      <motion.div variants={itemVariants} className="text-center text-red-300 p-4 bg-red-900/20 rounded-lg">
        <h3 className="font-bold mb-2">Error Loading Weather Data</h3>
        <p className="text-sm">{weatherData.error}</p>
      </motion.div>
    );
  }

  if (!weatherData.currentWeather && !weatherData.forecast) {
    return (
      <motion.div variants={itemVariants} className="text-center text-slate-300 p-4">
        <h3 className="font-bold mb-2">No Weather Data</h3>
        <p className="text-sm">Please check your location settings</p>
      </motion.div>
    );
  }

  return (
    <motion.div variants={itemVariants} className="space-y-6">
      {/* Current Weather Card */}
      {weatherData.currentWeather && (
        <PremiumWeatherCard
          weather={weatherData.currentWeather}
          airQuality={weatherData.airQuality}
          alerts={[]}
          isLoading={false}
          error={null}
        />
      )}

      {/* Forecast Card */}
      {weatherData.forecast && (
        <PremiumForecastCard
          forecast={weatherData.forecast}
          extendedForecast={weatherData.extendedForecast}
          isLoading={false}
          onExtendedToggle={(enabled) => {
            console.log(`Extended forecast ${enabled ? 'enabled' : 'disabled'}`);
          }}
        />
      )}

      {/* Premium Activity Suggestions Card */}
      <PremiumActivityCard
        suggestions={weatherData.smartSuggestions?.suggestions || []}
        isLoading={false}
        locationName={weatherData.currentWeather?.name || weatherData.forecast?.city.name || 'Unknown Location'}
        timezone={weatherData.currentWeather?.timezone}
      />

      {/* Solar & UV Intelligence Card */}
      <SolarUVCard
        solarForecast={weatherData.solarForecast || null}
        isLoading={false}
      />

      {/* Smart Agricultural Activities Card */}
      <SmartActivityCard
        suggestions={weatherData.smartSuggestions?.smart_suggestions || []}
        isLoading={false}
        locationName={weatherData.currentWeather?.name || weatherData.forecast?.city.name || 'Unknown Location'}
        timezone={weatherData.currentWeather?.timezone}
        optimalGardeningDays={
          weatherData.agriculturalForecast?.weekly_summary?.best_gardening_days?.length || 0
        }
      />
    </motion.div>
  );
}