import React from "react";
import { motion } from "framer-motion";
import { Sun, Camera, Shield, Sunrise, Sunset, Zap, Clock } from "lucide-react";

// Note: These types should be moved to @repo/types for proper sharing
interface SolarTiming {
  time: string;
  shortwave_radiation: number;
  direct_radiation: number;
  diffuse_radiation: number;
  uv_index: number;
  isGoldenHour: boolean;
  isDaylight: boolean;
}

interface DayInfo {
  date: string;
  sunrise: string;
  sunset: string;
  sunshine_duration: number;
  daylight_duration: number;
  uv_index_max: number;
  golden_hour_start: string;
  golden_hour_end: string;
}

interface SolarForecast {
  current: SolarTiming | null;
  hourly: SolarTiming[];
  daily: DayInfo[];
  next_golden_hour?: {
    type: 'morning' | 'evening';
    start: string;
    end: string;
    minutes_until: number;
  };
  uv_warnings: {
    current_uv: number;
    peak_uv_today: number;
    protection_needed: boolean;
    protection_message: string;
  };
  photography_score: number;
  solar_energy_score: number;
}

interface SolarUVCardProps {
  solarForecast: SolarForecast | null;
  isLoading?: boolean;
  className?: string;
}

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
};

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
};

const formatSunshineDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours === 0) return `${minutes}min`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}min`;
};

const getUVColorClasses = (uvIndex: number) => {
  if (uvIndex >= 8) return {
    bg: "bg-purple-500/10",
    border: "border-purple-400/20",
    hoverBorder: "hover:border-purple-400/30",
    text: "text-purple-400",
    intensity: "high"
  };
  if (uvIndex >= 6) return {
    bg: "bg-red-500/10",
    border: "border-red-400/20", 
    hoverBorder: "hover:border-red-400/30",
    text: "text-red-400",
    intensity: "high"
  };
  if (uvIndex >= 3) return {
    bg: "bg-orange-500/10",
    border: "border-orange-400/20",
    hoverBorder: "hover:border-orange-400/30", 
    text: "text-orange-400",
    intensity: "moderate"
  };
  return {
    bg: "bg-emerald-500/10",
    border: "border-emerald-400/20",
    hoverBorder: "hover:border-emerald-400/30",
    text: "text-emerald-400", 
    intensity: "low"
  };
};

const getScoreColorClasses = (score: number) => {
  if (score >= 80) return {
    bg: "bg-emerald-500/10",
    border: "border-emerald-400/20",
    hoverBorder: "hover:border-emerald-400/30",
    text: "text-emerald-400"
  };
  if (score >= 60) return {
    bg: "bg-yellow-500/10",
    border: "border-yellow-400/20",
    hoverBorder: "hover:border-yellow-400/30",
    text: "text-yellow-400"
  };
  if (score >= 40) return {
    bg: "bg-orange-500/10", 
    border: "border-orange-400/20",
    hoverBorder: "hover:border-orange-400/30",
    text: "text-orange-400"
  };
  return {
    bg: "bg-red-500/10",
    border: "border-red-400/20",
    hoverBorder: "hover:border-red-400/30", 
    text: "text-red-400"
  };
};

const SolarSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg"></div>
    <div className="grid grid-cols-2 gap-4">
      <div className="h-20 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg"></div>
      <div className="h-20 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg"></div>
    </div>
    <div className="space-y-3">
      <div className="h-16 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg"></div>
      <div className="h-16 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg"></div>
    </div>
  </div>
);

export const SolarUVCard: React.FC<SolarUVCardProps> = ({
  solarForecast,
  isLoading = false,
  className = "",
}) => {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl shadow-sky-900/10 ${className}`}
      >
        <SolarSkeleton />
      </motion.div>
    );
  }

  if (!solarForecast) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
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
        <div className="relative z-10 text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sun className="w-6 h-6 text-amber-400" />
            <h3 className="text-xl font-semibold text-white">Solar & UV Data</h3>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <p className="text-white/70 text-sm">
              Solar and UV data temporarily unavailable. Please try again later.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  const { current, daily, next_golden_hour, uv_warnings, photography_score, solar_energy_score } = solarForecast;
  const today = daily[0];
  const uvColorClasses = getUVColorClasses(uv_warnings.current_uv);
  const photoColorClasses = getScoreColorClasses(photography_score);
  const solarColorClasses = getScoreColorClasses(solar_energy_score);

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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm"
            >
              <Sun className="w-6 h-6 text-sky-400" />
            </motion.div>
            <div>
              <h3 className="text-xl font-semibold text-white">Solar & UV Intelligence</h3>
              <p className="text-white/60 text-sm">Worldwide coverage</p>
            </div>
          </div>
        </div>

        {/* Current UV & Solar Grid */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`${uvColorClasses.bg} backdrop-blur-sm rounded-2xl p-4 border ${uvColorClasses.border} ${uvColorClasses.hoverBorder} transition-colors`}
          >
            <div className="flex items-center gap-3 mb-2">
              <Shield className={`w-5 h-5 ${uvColorClasses.text}`} />
              <span className="text-white/70 text-sm">UV Index</span>
            </div>
            <div className="text-white text-xl font-semibold">
              {uv_warnings.current_uv}
            </div>
            <div className={`${uvColorClasses.text} text-xs`}>
              Peak: {uv_warnings.peak_uv_today}
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-5 h-5 text-sky-400" />
              <span className="text-white/70 text-sm">Solar Power</span>
            </div>
            <div className="text-white text-xl font-semibold">
              {current ? Math.round(current.shortwave_radiation) : 0} W/m²
            </div>
            <div className="text-sky-300 text-xs">
              {current?.isDaylight ? 'Active' : 'Inactive'}
            </div>
          </motion.div>
        </div>

        {/* Golden Hour & Sun Times */}
        {next_golden_hour && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-amber-500/10 backdrop-blur-sm rounded-2xl p-4 border border-amber-400/20"
          >
            <div className="flex items-center gap-3 mb-2">
              <Camera className="w-5 h-5 text-amber-400" />
              <span className="text-white/90 font-medium">
                {next_golden_hour.type === 'morning' ? 'Morning' : 'Evening'} Golden Hour
              </span>
            </div>
            <div className="text-white text-lg font-semibold">
              {next_golden_hour.minutes_until <= 0 
                ? 'Active now!' 
                : `Starts in ${formatDuration(next_golden_hour.minutes_until)}`
              }
            </div>
            <div className="text-amber-300 text-sm">
              {formatTime(next_golden_hour.start)} - {formatTime(next_golden_hour.end)}
            </div>
          </motion.div>
        )}

        {/* Sunrise/Sunset Info */}
        {today && (
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <Sunrise className="w-4 h-4 text-sky-400" />
                <span className="text-white/80 text-sm">Sunrise</span>
              </div>
              <div className="text-white font-semibold">
                {formatTime(today.sunrise)}
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <Sunset className="w-4 h-4 text-indigo-400" />
                <span className="text-white/80 text-sm">Sunset</span>
              </div>
              <div className="text-white font-semibold">
                {formatTime(today.sunset)}
              </div>
            </motion.div>
          </div>
        )}

        {/* Activity Scores */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`${photoColorClasses.bg} backdrop-blur-sm rounded-2xl p-4 border ${photoColorClasses.border} ${photoColorClasses.hoverBorder} transition-colors`}
          >
            <div className="flex items-center gap-3 mb-2">
              <Camera className={`w-4 h-4 ${photoColorClasses.text}`} />
              <span className="text-white/80 text-sm">Photography</span>
            </div>
            <div className="text-white font-semibold text-lg">
              {photography_score}%
            </div>
            <div className={`${photoColorClasses.text} text-xs`}>
              {current?.isGoldenHour ? 'Golden hour active' : 'Conditions'}
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`${solarColorClasses.bg} backdrop-blur-sm rounded-2xl p-4 border ${solarColorClasses.border} ${solarColorClasses.hoverBorder} transition-colors`}
          >
            <div className="flex items-center gap-3 mb-2">
              <Zap className={`w-4 h-4 ${solarColorClasses.text}`} />
              <span className="text-white/80 text-sm">Solar Energy</span>
            </div>
            <div className="text-white font-semibold text-lg">
              {solar_energy_score}%
            </div>
            <div className={`${solarColorClasses.text} text-xs`}>
              Peak efficiency
            </div>
          </motion.div>
        </div>

        {/* UV Protection Alert */}
        {uv_warnings.protection_needed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className={`${uvColorClasses.bg} border ${uvColorClasses.border} rounded-2xl p-3`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-6 h-6 ${uvColorClasses.bg} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <Shield className={`w-3 h-3 ${uvColorClasses.text}`} />
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm leading-relaxed">
                  {uv_warnings.protection_message}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Daylight Duration */}
        {today && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-sky-500/10 backdrop-blur-sm rounded-2xl p-3 border border-sky-400/20"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              <span className="text-sky-300 text-sm font-medium">
                {formatDuration(today.daylight_duration)} daylight • {formatSunshineDuration(today.sunshine_duration)} sunshine expected
              </span>
            </div>
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