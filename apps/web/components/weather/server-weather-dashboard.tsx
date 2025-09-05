"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  PremiumForecastCard,
} from "@repo/ui";
import type { ForecastResponse } from "@repo/types";

interface ServerWeatherDashboardProps {
  forecast: ForecastResponse | null;
  error?: string;
}

const ServerWeatherDashboard: React.FC<ServerWeatherDashboardProps> = ({
  forecast,
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

  if (!forecast) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">No Forecast Data</h2>
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
            Weather Forecast
          </h1>
          <p className="text-slate-300">
            Server-side rendered weather data for {forecast.city.name}
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
          <PremiumForecastCard
            forecast={forecast}
            extendedForecast={null}
            isLoading={false}
            error={null}
            onToggleExtended={() => {}}
            useExtended={false}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ServerWeatherDashboard;