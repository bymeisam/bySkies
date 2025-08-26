import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  Zap,
  Wind,
  Droplets,
  TrendingUp,
  Calendar,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import type { ForecastResponse } from "@repo/types";

interface PremiumForecastCardProps {
  forecast: ForecastResponse | null;
  extendedForecast?: ForecastResponse | null;
  isLoading?: boolean;
  className?: string;
  onExtendedToggle?: (enabled: boolean) => void;
}

const getWeatherIcon = (weather: string, iconCode?: string) => {
  const iconClass = "w-6 h-6";
  
  switch (weather.toLowerCase()) {
    case "clear":
      return <Sun className={`${iconClass} text-yellow-400`} />;
    case "clouds":
      return <Cloud className={`${iconClass} text-gray-300`} />;
    case "rain":
      return <CloudRain className={`${iconClass} text-blue-400`} />;
    case "drizzle":
      return <CloudRain className={`${iconClass} text-blue-300`} />;
    case "snow":
      return <CloudSnow className={`${iconClass} text-blue-100`} />;
    case "thunderstorm":
      return <Zap className={`${iconClass} text-purple-400`} />;
    default:
      return <Cloud className={`${iconClass} text-gray-300`} />;
  }
};

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return "Tomorrow";
  } else {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }
};

const ForecastSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        className="animate-pulse flex items-center justify-between p-4 bg-white/5 rounded-2xl"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-300/20 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-300/20 rounded-lg w-24"></div>
            <div className="h-3 bg-slate-300/20 rounded-lg w-16"></div>
          </div>
        </div>
        <div className="text-right space-y-2">
          <div className="h-4 bg-slate-300/20 rounded-lg w-12"></div>
          <div className="h-3 bg-slate-300/20 rounded-lg w-8"></div>
        </div>
      </div>
    ))}
  </div>
);

const DayForecast: React.FC<{
  day: string;
  weather: string;
  icon: string;
  high: number;
  low: number;
  description: string;
  humidity: number;
  windSpeed: number;
  index: number;
}> = ({ day, weather, icon, high, low, description, humidity, windSpeed, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-all duration-300 hover:bg-white/10"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-sky-400/20 to-blue-600/20 rounded-2xl border border-sky-400/30"
          >
            {getWeatherIcon(weather, icon)}
          </motion.div>
          
          <div className="space-y-1">
            <h4 className="text-white font-semibold text-lg">{day}</h4>
            <p className="text-white/60 text-sm capitalize">{description}</p>
          </div>
        </div>
        
        <div className="text-right space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-xl">{Math.round(high)}°</span>
            <span className="text-white/60 text-lg">{Math.round(low)}°</span>
          </div>
          
          <div className="flex items-center gap-3 text-xs text-white/50">
            <div className="flex items-center gap-1">
              <Droplets className="w-3 h-3" />
              <span>{humidity}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Wind className="w-3 h-3" />
              <span>{Math.round(windSpeed)}m/s</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const PremiumForecastCard: React.FC<PremiumForecastCardProps> = ({
  forecast,
  extendedForecast,
  isLoading = false,
  className = "",
  onExtendedToggle,
}) => {
  const [useExtended, setUseExtended] = useState(false);
  
  const activeForecast = useExtended && extendedForecast ? extendedForecast : forecast;
  const maxDays = useExtended ? 16 : 5;
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl ${className}`}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-8 bg-gradient-to-r from-slate-200/20 to-slate-300/20 rounded-lg w-2/3"></div>
            <div className="h-4 bg-gradient-to-r from-slate-200/20 to-slate-300/20 rounded-lg w-1/2"></div>
          </div>
          <ForecastSkeleton />
        </div>
      </motion.div>
    );
  }

  const handleToggle = (enabled: boolean) => {
    setUseExtended(enabled);
    onExtendedToggle?.(enabled);
  };

  if (!activeForecast || !activeForecast.list || activeForecast.list.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl ${className}`}
      >
        <div className="text-center py-12 space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-slate-400/20 to-slate-600/20 rounded-2xl flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-white font-semibold text-lg">
            No forecast available
          </h3>
          <p className="text-white/60 text-sm max-w-md mx-auto">
            Forecast data is still loading or not available for this location.
          </p>
        </div>
      </motion.div>
    );
  }

  // Group forecast by days (3-hour intervals -> daily summaries)
  const dailyForecasts = activeForecast.list.reduce((acc, item) => {
    const date = new Date(item.dt * 1000).toDateString();
    
    if (!acc[date]) {
      acc[date] = {
        date: item.dt,
        temps: [],
        weather: item.weather[0],
        humidity: [],
        windSpeed: [],
        items: []
      };
    }
    
    acc[date].temps.push(item.main.temp);
    acc[date].humidity.push(item.main.humidity);
    acc[date].windSpeed.push(item.wind.speed);
    acc[date].items.push(item);
    
    return acc;
  }, {} as Record<string, any>);

  // Convert to array and get days based on mode
  const dailyData = Object.values(dailyForecasts).slice(0, maxDays).map((day: any) => ({
    day: formatDate(day.date),
    weather: day.weather.main,
    icon: day.weather.icon,
    high: Math.max(...day.temps),
    low: Math.min(...day.temps),
    description: day.weather.description,
    humidity: Math.round(day.humidity.reduce((a: number, b: number) => a + b, 0) / day.humidity.length),
    windSpeed: day.windSpeed.reduce((a: number, b: number) => a + b, 0) / day.windSpeed.length,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl ${className}`}
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="p-3 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 rounded-2xl border border-emerald-400/30 flex-shrink-0"
            >
              <Calendar className="w-6 h-6 text-emerald-300" />
            </motion.div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">
                {useExtended ? '16-Day' : '5-Day'} Forecast
              </h2>
              <p className="text-white/60 text-sm">
                Weather outlook for {activeForecast.city.name}
                {useExtended && extendedForecast && <span className="ml-1 text-emerald-300">• Extended</span>}
              </p>
            </div>
            
            {/* Toggle Button */}
            {extendedForecast && (
              <motion.button
                onClick={() => handleToggle(!useExtended)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-200"
              >
                {useExtended ? (
                  <ToggleRight className="w-5 h-5 text-emerald-300" />
                ) : (
                  <ToggleLeft className="w-5 h-5 text-white/60" />
                )}
                <span className="text-white text-sm font-medium">
                  {useExtended ? '5 days' : '16 days'}
                </span>
              </motion.button>
            )}
          </div>

          <div className="flex items-center gap-2 text-white/60 text-sm">
            <TrendingUp className="w-4 h-4 text-emerald-300 flex-shrink-0" />
            <span>{dailyData.length} days • Updated now</span>
          </div>
        </div>

        {/* Forecast Days */}
        <div className="space-y-4">
          {dailyData.map((dayData, index) => (
            <DayForecast
              key={`${dayData.day}-${index}`}
              {...dayData}
              index={index}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10">
          <p className="text-white/50 text-xs text-center">
            {useExtended 
              ? 'Extended 16-day forecast powered by Open-Meteo' 
              : 'Forecast updates every 3 hours with detailed weather conditions'
            }
          </p>
        </div>
      </div>
    </motion.div>
  );
};