import React from "react";
import { motion } from "framer-motion";
import {
  Clock,
  CheckCircle,
  Star,
  Zap,
  Calendar,
  TrendingUp,
  Activity,
} from "lucide-react";
import type { ActivitySuggestion } from "@repo/types";

interface PremiumActivityCardProps {
  suggestions: ActivitySuggestion[];
  isLoading?: boolean;
  className?: string;
}

const getActivityIcon = (activity: string) => {
  const iconClass = "w-6 h-6 text-white";

  switch (activity.toLowerCase()) {
    case "running":
      return <div className={iconClass}>🏃‍♂️</div>;
    case "outdoor dining":
      return <div className={iconClass}>🍽️</div>;
    case "photography":
      return <div className={iconClass}>📸</div>;
    case "cycling":
      return <div className={iconClass}>🚴‍♂️</div>;
    case "picnic":
      return <div className={iconClass}>🧺</div>;
    case "hiking":
      return <div className={iconClass}>🥾</div>;
    default:
      return <Activity className={iconClass} />;
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

const formatTime = (dateString?: string) => {
  if (!dateString) return "";
  try {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return dateString;
  }
};

const getTimeUntil = (dateString?: string) => {
  if (!dateString) return "";
  try {
    const targetTime = new Date(dateString);
    const now = new Date();
    const diffMs = targetTime.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours <= 0 && diffMins <= 0) return "Now";
    if (diffHours <= 0) return `in ${diffMins}m`;
    if (diffHours < 24) return `in ${diffHours}h ${diffMins}m`;
    return "Later today";
  } catch {
    return "";
  }
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

const SuggestionCard: React.FC<{
  suggestion: ActivitySuggestion;
  index: number;
}> = ({ suggestion, index }) => {
  const confidenceColors = getConfidenceColor(suggestion.confidence);
  const timeUntil = getTimeUntil(suggestion?.start);

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
      className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300"
      style={{
        boxShadow: `
          0 10px 25px -5px rgba(59, 130, 246, 0.1),
          0 0 0 1px rgba(255, 255, 255, 0.05),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `,
      }}
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-400/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="p-3 bg-gradient-to-br from-sky-400/20 to-blue-600/20 rounded-2xl border border-sky-400/30"
            >
              {getActivityIcon(suggestion.activity)}
            </motion.div>

            <div className="space-y-1">
              <h3 className="text-white font-semibold text-lg leading-tight">
                {suggestion.activity}
              </h3>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Clock className="w-4 h-4" />
                <span>{formatTime(suggestion.start)}</span>
                {timeUntil && (
                  <>
                    <span className="text-white/40">•</span>
                    <span className="text-sky-300">{timeUntil}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Confidence indicator */}
          <div
            className={`px-3 py-1 bg-gradient-to-r ${confidenceColors.bg} ${confidenceColors.text} text-xs font-medium rounded-full border ${confidenceColors.border} flex items-center gap-1`}
          >
            <Star className="w-3 h-3 fill-current" />
            {Math.round(suggestion.confidence * 100)}%
          </div>
        </div>

        {/* Description */}
        <p className="text-white/80 leading-relaxed text-sm">
          {suggestion.description}
        </p>

        {/* Reasons */}
        {suggestion.reasons && suggestion.reasons.length > 0 && (
          <div className="space-y-2">
            <div className="text-white/60 text-xs uppercase tracking-wide font-medium">
              Perfect because:
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestion.reasons.slice(0, 4).map((reason, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + idx * 0.05 }}
                  className="px-3 py-1 bg-white/10 text-white/70 text-xs rounded-lg border border-white/10 backdrop-blur-sm"
                >
                  <CheckCircle className="w-3 h-3 text-emerald-400 inline mr-1" />
                  {reason}
                </motion.span>
              ))}
            </div>
          </div>
        )}

        {/* Time range */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/10">
          <Calendar className="w-4 h-4 text-white/50" />
          <span className="text-white/60 text-sm">
            Good until {formatTime(suggestion.end)}
          </span>
        </div>
      </div>

      {/* Hover effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-sky-400/5 via-blue-500/5 to-indigo-600/5"></div>
      </div>
    </motion.div>
  );
};

export const PremiumActivityCard: React.FC<PremiumActivityCardProps> = ({
  suggestions,
  isLoading = false,
  className = "",
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
            <Activity className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-white font-semibold text-lg">
            No suggestions available
          </h3>
          <p className="text-white/60 text-sm max-w-md mx-auto">
            Weather data is still loading or conditions aren't suitable for
            outdoor activities right now.
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
      className={`relative overflow-hidden backdrop-blur-xl border rounded-3xl p-8 shadow-2xl ${className}`}
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
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-emerald-400/10 to-transparent rounded-full -mr-24 -mt-24"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-sky-400/10 to-transparent rounded-full -ml-20 -mb-20"></div>
      </div>

      <div className="relative z-10 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="p-3 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 rounded-2xl border border-emerald-400/30"
            >
              <Zap className="w-6 h-6 text-emerald-300" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Perfect Activities
              </h2>
              <p className="text-white/60 text-sm">
                Based on current sky conditions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-white/60 text-sm">
            <TrendingUp className="w-4 h-4 text-emerald-300" />
            <span>{topSuggestions.length} recommendations • Updated now</span>
          </div>
        </div>

        {/* Suggestions */}
        <div className="space-y-4">
          {topSuggestions.map((suggestion, index) => (
            <SuggestionCard
              key={`${suggestion.activity}-${suggestion.start}-${index}`}
              suggestion={suggestion}
              index={index}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10">
          <p className="text-white/50 text-xs text-center">
            Suggestions update automatically based on changing weather
            conditions
          </p>
        </div>
      </div>
    </motion.div>
  );
};

