import React from "react";
import { motion } from "framer-motion";
import {
  Droplets,
  Wind,
  Thermometer,
  Gauge,
  Sprout,
  Sun,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Leaf,
  Activity,
} from "lucide-react";
import { formatTimeInTimezone } from "./utils/time";

export interface SmartActivitySuggestion {
  id: string;
  activity: string;
  category: 'gardening' | 'outdoor_comfort' | 'plant_care' | 'general';
  description: string;
  confidence: number;
  reasons: string[];
  start: string;
  end: string;
  professional_insight?: string;
  agricultural_data?: {
    vpd: number;
    humidity: number;
    dew_point: number;
    et0: number;
  };
}

export interface SmartActivityCardProps {
  suggestions: SmartActivitySuggestion[];
  isLoading?: boolean;
  className?: string;
  locationName?: string;
  timezone?: number;
  optimalGardeningDays?: number;
}

const getActivityIcon = (category: string, activity: string) => {
  const iconClass = "w-6 h-6 text-white";
  
  switch (category) {
    case "gardening":
      return <Sprout className={iconClass} />;
    case "plant_care":
      return <Leaf className={iconClass} />;
    case "outdoor_comfort":
      return <Sun className={iconClass} />;
    default:
      return <Activity className={iconClass} />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "gardening":
      return {
        bg: "from-green-400/20 to-green-600/20",
        text: "text-green-300",
        border: "border-green-400/30",
        icon: "text-green-400",
      };
    case "plant_care":
      return {
        bg: "from-emerald-400/20 to-emerald-600/20",
        text: "text-emerald-300", 
        border: "border-emerald-400/30",
        icon: "text-emerald-400",
      };
    case "outdoor_comfort":
      return {
        bg: "from-sky-400/20 to-sky-600/20",
        text: "text-sky-300",
        border: "border-sky-400/30", 
        icon: "text-sky-400",
      };
    default:
      return {
        bg: "from-slate-400/20 to-slate-600/20",
        text: "text-slate-300",
        border: "border-slate-400/30",
        icon: "text-slate-400",
      };
  }
};

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 0.9)
    return {
      bg: "from-emerald-400/20 to-emerald-600/20",
      text: "text-emerald-300",
      border: "border-emerald-400/30",
    };
  if (confidence >= 0.7)
    return {
      bg: "from-blue-400/20 to-blue-600/20", 
      text: "text-blue-300",
      border: "border-blue-400/30",
    };
  if (confidence >= 0.5)
    return {
      bg: "from-amber-400/20 to-amber-600/20",
      text: "text-amber-300",
      border: "border-amber-400/30",
    };
  return {
    bg: "from-slate-400/20 to-slate-600/20",
    text: "text-slate-300",
    border: "border-slate-400/30",
  };
};

const ActivitySkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="animate-pulse bg-white/5 rounded-2xl p-6 space-y-3"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-300/20 rounded-2xl"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-300/20 rounded-lg w-3/4"></div>
            <div className="h-3 bg-slate-300/20 rounded-lg w-1/2"></div>
          </div>
          <div className="w-16 h-6 bg-slate-300/20 rounded-full"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-slate-300/20 rounded-lg w-full"></div>
          <div className="h-3 bg-slate-300/20 rounded-lg w-2/3"></div>
        </div>
      </div>
    ))}
  </div>
);

const ProfessionalDataBadge: React.FC<{
  data: SmartActivitySuggestion['agricultural_data'];
}> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/10">
      <div className="flex items-center gap-2">
        <Droplets className="w-4 h-4 text-cyan-400" />
        <div className="text-xs">
          <div className="text-white/60">VPD</div>
          <div className="text-white font-medium">{data.vpd.toFixed(1)} kPa</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Gauge className="w-4 h-4 text-blue-400" />
        <div className="text-xs">
          <div className="text-white/60">Humidity</div>
          <div className="text-white font-medium">{data.humidity.toFixed(0)}%</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Thermometer className="w-4 h-4 text-orange-400" />
        <div className="text-xs">
          <div className="text-white/60">Dew Point</div>
          <div className="text-white font-medium">{data.dew_point.toFixed(1)}°C</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Sun className="w-4 h-4 text-yellow-400" />
        <div className="text-xs">
          <div className="text-white/60">ET₀</div>
          <div className="text-white font-medium">{data.et0.toFixed(1)} mm</div>
        </div>
      </div>
    </div>
  );
};

const SmartSuggestionCard: React.FC<{
  suggestion: SmartActivitySuggestion;
  index: number;
  timezone?: number;
}> = ({ suggestion, index, timezone }) => {
  const categoryColors = getCategoryColor(suggestion.category);
  const confidenceColors = getConfidenceColor(suggestion.confidence);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-white/10"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`w-12 h-12 flex items-center justify-center bg-gradient-to-br ${categoryColors.bg} rounded-2xl border ${categoryColors.border} flex-shrink-0`}
            >
              {getActivityIcon(suggestion.category, suggestion.activity)}
            </motion.div>

            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-lg leading-tight">
                {suggestion.activity}
              </h3>
              <div className="flex items-center gap-2 text-white/60 text-sm mt-1">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>
                  {formatTimeInTimezone(suggestion.start, timezone)} - {formatTimeInTimezone(suggestion.end, timezone)}
                </span>
              </div>
            </div>
          </div>

          {/* Confidence indicator */}
          <div
            className={`px-3 py-1 bg-gradient-to-r ${confidenceColors.bg} ${confidenceColors.text} text-xs font-medium rounded-full border ${confidenceColors.border} flex items-center gap-1 flex-shrink-0`}
          >
            <TrendingUp className="w-3 h-3" />
            {Math.round(suggestion.confidence * 100)}%
          </div>
        </div>

        {/* Description */}
        <p className="text-white/80 leading-relaxed text-sm">
          {suggestion.description}
        </p>

        {/* Professional insight */}
        {suggestion.professional_insight && (
          <div className="bg-gradient-to-r from-cyan-400/10 to-blue-400/10 border border-cyan-400/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gradient-to-br from-cyan-400/20 to-cyan-600/20 rounded-lg border border-cyan-400/30 flex-shrink-0">
                <Gauge className="w-4 h-4 text-cyan-300" />
              </div>
              <div className="flex-1">
                <div className="text-cyan-300 text-xs uppercase tracking-wide font-medium mb-1">
                  Professional Insight
                </div>
                <p className="text-white/90 text-sm leading-relaxed">
                  {suggestion.professional_insight}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Reasons */}
        {suggestion.reasons && suggestion.reasons.length > 0 && (
          <div className="space-y-3">
            <div className="text-white/60 text-xs uppercase tracking-wide font-medium">
              Scientific factors:
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestion.reasons.slice(0, 4).map((reason, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + idx * 0.05 }}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-white/10 text-white/70 text-xs rounded-lg border border-white/10 backdrop-blur-sm"
                >
                  <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                  <span>{reason}</span>
                </motion.span>
              ))}
            </div>
          </div>
        )}

        {/* Professional agricultural data */}
        <ProfessionalDataBadge data={suggestion.agricultural_data} />

      </div>
    </motion.div>
  );
};

export const SmartActivityCard: React.FC<SmartActivityCardProps> = ({
  suggestions,
  isLoading = false,
  className = "",
  locationName = "",
  timezone,
  optimalGardeningDays,
}) => {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl ${className}`}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-8 bg-gradient-to-r from-slate-200/20 to-slate-300/20 rounded-lg w-2/3"></div>
            <div className="h-4 bg-gradient-to-r from-slate-200/20 to-slate-300/20 rounded-lg w-1/2"></div>
          </div>
          <ActivitySkeleton />
        </div>
      </motion.div>
    );
  }

  if (!suggestions || suggestions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl ${className}`}
      >
        <div className="text-center py-12 space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-slate-400/20 to-slate-600/20 rounded-2xl flex items-center justify-center mx-auto">
            <Leaf className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-white font-semibold text-lg">
            No smart suggestions available
          </h3>
          <p className="text-white/60 text-sm max-w-md mx-auto">
            Professional agricultural data is still loading or conditions aren't suitable for enhanced recommendations.
          </p>
        </div>
      </motion.div>
    );
  }

  // Get top suggestions (limit to 3 for better UX)  
  const topSuggestions = suggestions
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3);

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
              className="p-3 bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-2xl border border-green-400/30 flex-shrink-0"
            >
              <Sprout className="w-6 h-6 text-green-300" />
            </motion.div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">
                Smart Outdoor Intelligence{locationName ? ` for ${locationName}` : ''}
              </h2>
              <p className="text-white/60 text-sm">
                Professional agricultural data + outdoor comfort analysis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Gauge className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>
              {optimalGardeningDays && optimalGardeningDays > 0 
                ? `${optimalGardeningDays} optimal gardening days identified • ` 
                : ''}{topSuggestions.length} professional recommendations
            </span>
          </div>
        </div>

        {/* Suggestions */}
        <div className="space-y-6">
          {topSuggestions.map((suggestion, index) => (
            <SmartSuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              index={index}
              timezone={timezone}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10">
          <p className="text-white/50 text-xs text-center">
            Powered by Open-Meteo agricultural data • VPD, ET₀, and humidity intelligence
          </p>
        </div>
      </div>
    </motion.div>
  );
};