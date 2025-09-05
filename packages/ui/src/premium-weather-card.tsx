import React from "react";
import { motion } from "framer-motion";
import { Thermometer, Wind, Droplets, Eye, MapPin, Clock } from "lucide-react";
import type { CurrentWeatherResponse, AirPollutionResponse } from "@repo/types";
import type { PlanningDisruptionAlert, AirQualityAlert } from "@repo/types";
import { calculateLocalTime } from "./utils/time";

interface PremiumWeatherCardProps {
  weather: CurrentWeatherResponse;
  airQuality: AirPollutionResponse;
  alerts?: (PlanningDisruptionAlert | AirQualityAlert)[];
  isLoading?: boolean;
  className?: string;
  locationName?: string;
}

const getAQIInfo = (aqi: number) => {
  const levels = {
    1: {
      label: "Good",
      color: "emerald",
      bgColor: "from-emerald-400/20 to-emerald-600/20",
    },
    2: {
      label: "Fair",
      color: "yellow",
      bgColor: "from-yellow-400/20 to-yellow-600/20",
    },
    3: {
      label: "Moderate",
      color: "orange",
      bgColor: "from-orange-400/20 to-orange-600/20",
    },
    4: {
      label: "Poor",
      color: "red",
      bgColor: "from-red-400/20 to-red-600/20",
    },
    5: {
      label: "Very Poor",
      color: "purple",
      bgColor: "from-purple-400/20 to-purple-600/20",
    },
  };
  return levels[aqi as keyof typeof levels] || levels[1];
};

const getWeatherIcon = (condition: string, isDay: boolean = true) => {
  const iconSize = "w-8 h-8";
  const iconColor = isDay ? "text-amber-400" : "text-slate-300";

  switch (condition.toLowerCase()) {
    case "clear":
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
    case "clouds":
      return (
        <div className={`${iconSize} text-slate-400`}>
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
          </svg>
        </div>
      );
    case "rain":
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

const WeatherSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg"></div>
    <div className="space-y-3">
      <div className="h-20 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg"></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="h-16 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg"></div>
        <div className="h-16 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg"></div>
      </div>
    </div>
  </div>
);

export const PremiumWeatherCard: React.FC<PremiumWeatherCardProps> = ({
  weather,
  airQuality,
  alerts = [],
  isLoading = false,
  className = "",
  locationName = "",
}) => {
  const currentAQI = airQuality?.list?.[0]?.main?.aqi || 1;
  const aqiInfo = getAQIInfo(currentAQI);
  const temp = weather?.main?.temp ? Math.round(weather.main.temp) : 0;
  const feelsLike = weather?.main?.feels_like ? Math.round(weather.main.feels_like) : 0;
  const isDay = weather?.weather?.[0]?.icon?.includes("d") ?? true;

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl shadow-sky-900/10 ${className}`}
      >
        <WeatherSkeleton />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`group relative overflow-hidden backdrop-blur-xl border rounded-3xl p-8 shadow-2xl transition-all duration-700 ${className}`}
      style={{
        background: `linear-gradient(135deg, 
          rgba(255, 255, 255, 0.1) 0%, 
          rgba(255, 255, 255, 0.05) 100%
        )`,
        borderColor: "rgba(255, 255, 255, 0.2)",
        boxShadow: `
          0 25px 50px -12px rgba(59, 130, 246, 0.15),
          0 0 0 1px rgba(255, 255, 255, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `,
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-sky-400/10 to-transparent rounded-full -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-700"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-400/10 to-transparent rounded-full -ml-24 -mb-24 group-hover:scale-110 transition-transform duration-700"></div>

        {/* Floating particles */}
        <motion.div
          animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/4 w-2 h-2 bg-white/30 rounded-full blur-sm"
        />
        <motion.div
          animate={{ y: [5, -15, 5], x: [2, -8, 2] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-sky-300/40 rounded-full blur-sm"
        />
      </div>

      <div className="relative z-10 space-y-6">
        {/* Header with location and time */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">{locationName || weather?.name || "Loading..."}</span>
            </div>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Clock className="w-3 h-3" />
              <span>{calculateLocalTime(weather?.timezone)}</span>
            </div>
          </div>

          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm"
          >
            {getWeatherIcon(weather.weather?.[0]?.main || "Clear", isDay)}
          </motion.div>
        </div>

        {/* Main temperature display */}
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-6xl font-light text-white tracking-tight"
            >
              {temp}°
            </motion.div>
            <div className="text-white/70 text-lg">feels {feelsLike}°</div>
          </div>

          <div className="text-white/80 capitalize text-lg font-medium">
            {weather.weather?.[0]?.description}
          </div>
        </div>

        {/* Weather metrics grid */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <Droplets className="w-5 h-5 text-blue-300" />
              <span className="text-white/70 text-sm">Humidity</span>
            </div>
            <div className="text-white text-xl font-semibold">
              {weather?.main?.humidity ?? 0}%
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <Wind className="w-5 h-5 text-slate-300" />
              <span className="text-white/70 text-sm">Wind</span>
            </div>
            <div className="text-white text-xl font-semibold">
              {weather?.wind?.speed ? Math.round(weather.wind.speed) : 0} km/h
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <Thermometer className="w-5 h-5 text-red-300" />
              <span className="text-white/70 text-sm">Pressure</span>
            </div>
            <div className="text-white text-xl font-semibold">
              {weather?.main?.pressure ?? 0} hPa
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <Eye className="w-5 h-5 text-gray-300" />
              <span className="text-white/70 text-sm">Visibility</span>
            </div>
            <div className="text-white text-xl font-semibold">
              {weather?.visibility
                ? `${(weather.visibility / 1000).toFixed(1)} km`
                : "N/A"}
            </div>
          </motion.div>
        </div>

        {/* Air Quality Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`bg-gradient-to-r ${aqiInfo.bgColor} backdrop-blur-sm rounded-2xl p-4 border border-white/10`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/90 font-medium">Air Quality</span>
            <span
              className={`px-3 py-1 bg-${aqiInfo.color}-500/20 text-${aqiInfo.color}-300 text-xs font-medium rounded-full border border-${aqiInfo.color}-400/20`}
            >
              {aqiInfo.label}
            </span>
          </div>
          <div className="text-white text-2xl font-semibold">
            AQI {currentAQI}
          </div>
        </motion.div>

        {/* Alerts section */}
        {alerts && alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-2"
          >
            {alerts.slice(0, 2).map((alert, index) => (
              <div
                key={index}
                className="bg-amber-500/10 border border-amber-400/20 rounded-2xl p-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-amber-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-amber-400 text-xs">⚠</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm leading-relaxed">
                      {alert.message}
                    </p>
                    {"affectedActivities" in alert &&
                      alert.affectedActivities && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {alert.affectedActivities
                            .slice(0, 3)
                            .map((activity) => (
                              <span
                                key={activity}
                                className="px-2 py-1 bg-amber-400/10 text-amber-300 text-xs rounded-lg border border-amber-400/20"
                              >
                                {activity}
                              </span>
                            ))}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-sky-400/5 via-blue-500/5 to-indigo-600/5"></div>
      </div>
    </motion.div>
  );
};

