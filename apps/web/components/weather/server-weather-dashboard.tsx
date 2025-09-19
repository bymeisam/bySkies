"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  PremiumForecastCard,
  PremiumWeatherCard,
  PremiumActivityCard,
  SolarUVCard,
  SmartActivityCard,
} from "@repo/ui";
import type { ForecastResponse, CurrentWeatherResponse, AirPollutionResponse } from "@repo/types";
import type { SolarForecast, AgriculturalForecast } from "@/lib/api/weather/open-meteo/types";
import type { EnhancedSuggestionResult } from "@/lib/suggestions";
import { styles, motionVariants } from "./server-weather-dashboard.styles";

interface ServerWeatherDashboardProps {
  currentWeather: CurrentWeatherResponse | null;
  forecast: ForecastResponse | null;
  extendedForecast?: ForecastResponse | null;
  airQuality?: AirPollutionResponse | null;
  solarForecast?: SolarForecast | null;
  agriculturalForecast?: AgriculturalForecast | null;
  smartSuggestions?: EnhancedSuggestionResult | null;
  error?: string;
}

const ServerWeatherDashboard: React.FC<ServerWeatherDashboardProps> = ({
  currentWeather,
  forecast,
  extendedForecast,
  airQuality,
  solarForecast,
  agriculturalForecast,
  smartSuggestions,
  error
}) => {
  if (error) {
    return (
      <div className={styles.centerContainer}>
        <div className={styles.centerContent}>
          <h2 className={styles.centerHeading}>Error Loading Forecast</h2>
          <p className={styles.errorMessage}>{error}</p>
        </div>
      </div>
    );
  }

  if (!currentWeather && !forecast) {
    return (
      <div className={styles.centerContainer}>
        <div className={styles.centerContent}>
          <h2 className={styles.centerHeading}>No Weather Data</h2>
          <p className={styles.emptyMessage}>Please check your location settings</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={motionVariants.container}
      initial="hidden"
      animate="visible"
      className={styles.container}
    >
      {/* Animated background elements */}
      <div className={styles.backgroundContainer}>
        <motion.div
          animate={motionVariants.backgroundOrb.animate}
          transition={motionVariants.backgroundOrb.transition}
          className={styles.backgroundOrb}
        />
      </div>

      {/* Main content */}
      <div className={styles.contentContainer}>
        <motion.div variants={motionVariants.item} className={styles.headerSection}>
          <h1 className={styles.title}>
            Weather Dashboard
          </h1>
          <p className={styles.subtitle}>
            Server-side rendered weather data for {currentWeather?.name || forecast?.city.name || 'Unknown Location'}
          </p>
        </motion.div>

        <div className={styles.cardsContainer}>
          {/* Current Weather Card */}
          {currentWeather && (
            <motion.div variants={motionVariants.item}>
              <PremiumWeatherCard
                weather={currentWeather}
                airQuality={airQuality || undefined}
                alerts={[]}
                isLoading={false}
                error={null}
              />
            </motion.div>
          )}

          {/* Forecast Card */}
          {forecast && (
            <motion.div variants={motionVariants.item}>
              <PremiumForecastCard
                forecast={forecast}
                extendedForecast={extendedForecast}
                isLoading={false}
                onExtendedToggle={(enabled) => {
                  // Server-side component can't handle state changes
                  console.log(`Extended forecast ${enabled ? 'enabled' : 'disabled'}`);
                }}
              />
            </motion.div>
          )}

          {/* Premium Activity Suggestions Card */}
          <motion.div variants={motionVariants.item}>
            <PremiumActivityCard
              suggestions={smartSuggestions?.suggestions || []}
              isLoading={false}
              locationName={currentWeather?.name || forecast?.city.name || 'Unknown Location'}
              timezone={currentWeather?.timezone}
            />
          </motion.div>

          {/* Solar & UV Intelligence Card */}
          <motion.div variants={motionVariants.item}>
            <SolarUVCard
              solarForecast={solarForecast || null}
              isLoading={false}
            />
          </motion.div>

          {/* Smart Agricultural Activities Card */}
          <motion.div variants={motionVariants.item}>
            <SmartActivityCard
              suggestions={smartSuggestions?.smart_suggestions || []}
              isLoading={false}
              locationName={currentWeather?.name || forecast?.city.name || 'Unknown Location'}
              timezone={currentWeather?.timezone}
              optimalGardeningDays={
                agriculturalForecast?.weekly_summary?.best_gardening_days?.length || 0
              }
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ServerWeatherDashboard;