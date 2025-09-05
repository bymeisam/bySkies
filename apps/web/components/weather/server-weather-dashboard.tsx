"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  PremiumForecastCard,
  PremiumWeatherCard,
  SolarUVCard,
  SmartActivityCard,
} from "@repo/ui";
import type { ForecastResponse, CurrentWeatherResponse, AirPollutionResponse } from "@repo/types";
import type { SolarForecast, AgriculturalForecast } from "@/lib/api/weather/open-meteo/types";
import type { EnhancedSuggestionResult } from "@/lib/suggestions";

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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Error Loading Forecast</h2>
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!currentWeather && !forecast) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">No Weather Data</h2>
          <p className="text-slate-300">Please check your location settings</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"
    >
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-indigo-600/10 rounded-full blur-3xl"
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Weather Dashboard
          </h1>
          <p className="text-slate-300">
            Server-side rendered weather data for {currentWeather?.name || forecast?.city.name || 'Unknown Location'}
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto space-y-6">
          {/* Current Weather Card */}
          {currentWeather && (
            <motion.div variants={itemVariants}>
              <PremiumWeatherCard
                weather={currentWeather}
                airQuality={airQuality}
                alerts={[]}
                isLoading={false}
                error={null}
              />
            </motion.div>
          )}

          {/* Forecast Card */}
          {forecast && (
            <motion.div variants={itemVariants}>
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

          {/* Solar & UV Intelligence Card */}
          <motion.div variants={itemVariants}>
            <SolarUVCard
              solarForecast={solarForecast || null}
              isLoading={false}
            />
          </motion.div>

          {/* Smart Agricultural Activities Card */}
          <motion.div variants={itemVariants}>
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