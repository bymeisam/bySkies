// Clean interface definitions for style functions
interface CardStyleProps {
  className?: string;
  isLoading?: boolean;
}

interface MetricCardStyleProps {
  isHovered?: boolean;
}

interface AirQualityStyleProps {
  aqiColor: string;
  bgGradient: string;
}

interface AlertStyleProps {
  type?: 'warning' | 'info' | 'error';
}

interface BackgroundElementProps {
  position: 'top-right' | 'bottom-left';
  size: 'small' | 'medium' | 'large';
}

export const styles = {
  // Main card container
  card: (props: CardStyleProps = {}) => {
    const { className = "", isLoading = false } = props;

    const base = "group relative overflow-hidden backdrop-blur-xl border rounded-3xl p-8 shadow-2xl transition-all duration-700";
    const loadingState = isLoading ? "animate-pulse" : "";

    return `${base} ${loadingState} ${className}`.trim();
  },

  // Card background with glassmorphism
  cardBackground: {
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
  },

  // Background decorative elements
  backgroundElement: (props: BackgroundElementProps) => {
    const { position, size } = props;

    const positions = {
      'top-right': "absolute top-0 right-0 -mr-32 -mt-32",
      'bottom-left': "absolute bottom-0 left-0 -ml-24 -mb-24"
    };

    const sizes = {
      small: "w-32 h-32",
      medium: "w-48 h-48",
      large: "w-64 h-64"
    };

    const gradients = {
      'top-right': "bg-gradient-to-bl from-sky-400/10 to-transparent",
      'bottom-left': "bg-gradient-to-tr from-blue-400/10 to-transparent"
    };

    return `${positions[position]} ${sizes[size]} ${gradients[position]} rounded-full group-hover:scale-110 transition-transform duration-700`;
  },

  // Header section
  header: "flex items-start justify-between",
  locationContainer: "space-y-1",
  locationText: "flex items-center gap-2 text-white/90",
  locationName: "font-medium",
  timeText: "flex items-center gap-2 text-white/60 text-sm",

  // Weather icon container
  iconContainer: "p-3 bg-white/10 rounded-2xl backdrop-blur-sm",

  // Temperature display
  temperatureSection: "space-y-3",
  temperatureContainer: "flex items-baseline gap-2",
  mainTemperature: "text-6xl font-light text-white tracking-tight",
  feelsLike: "text-white/70 text-lg",
  description: "text-white/80 capitalize text-lg font-medium",

  // Metrics grid
  metricsGrid: "grid grid-cols-2 gap-4",

  metricCard: (props: MetricCardStyleProps = {}) => {
    const { isHovered = false } = props;

    const base = "bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 transition-colors";
    const hover = isHovered ? "border-white/20 scale-105" : "hover:border-white/20";

    return `${base} ${hover}`;
  },

  metricHeader: "flex items-center gap-3 mb-2",
  metricLabel: "text-white/70 text-sm",
  metricValue: "text-white text-xl font-semibold",

  // Air quality section
  airQuality: (props: AirQualityStyleProps) => {
    const { bgGradient } = props;

    return `bg-gradient-to-r ${bgGradient} backdrop-blur-sm rounded-2xl p-4 border border-white/10`;
  },

  airQualityHeader: "flex items-center justify-between mb-2",
  airQualityLabel: "text-white/90 font-medium",
  airQualityBadge: (color: string) =>
    `px-3 py-1 bg-${color}-500/20 text-${color}-300 text-xs font-medium rounded-full border border-${color}-400/20`,
  airQualityValue: "text-white text-2xl font-semibold",

  // Alerts section
  alertsContainer: "space-y-2",

  alert: (props: AlertStyleProps = {}) => {
    const { type = 'warning' } = props;

    const types = {
      warning: "bg-amber-500/10 border border-amber-400/20",
      info: "bg-blue-500/10 border border-blue-400/20",
      error: "bg-red-500/10 border border-red-400/20"
    };

    return `${types[type]} rounded-2xl p-3`;
  },

  alertContent: "flex items-start gap-3",
  alertIcon: (type: string = 'warning') => {
    const colors = {
      warning: "bg-amber-400/20 text-amber-400",
      info: "bg-blue-400/20 text-blue-400",
      error: "bg-red-400/20 text-red-400"
    };

    return `w-6 h-6 ${colors[type as keyof typeof colors]} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`;
  },
  alertMessage: "text-white text-sm leading-relaxed",
  alertActivities: "flex flex-wrap gap-1 mt-2",
  alertActivity: (type: string = 'warning') => {
    const colors = {
      warning: "bg-amber-400/10 text-amber-300 border-amber-400/20",
      info: "bg-blue-400/10 text-blue-300 border-blue-400/20",
      error: "bg-red-400/10 text-red-300 border-red-400/20"
    };

    return `px-2 py-1 ${colors[type as keyof typeof colors]} text-xs rounded-lg border`;
  },

  // Hover effects
  hoverGlow: "absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none",
  hoverGlowGradient: "absolute inset-0 rounded-3xl bg-gradient-to-r from-sky-400/5 via-blue-500/5 to-indigo-600/5",

  // Loading skeleton
  skeleton: {
    container: "animate-pulse space-y-6",
    header: "h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg",
    content: "space-y-3",
    mainSection: "h-20 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg",
    grid: "grid grid-cols-2 gap-3",
    gridItem: "h-16 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg"
  },

  // Floating particles
  particle: (variant: 'primary' | 'secondary') => {
    const variants = {
      primary: "absolute top-1/4 right-1/4 w-2 h-2 bg-white/30 rounded-full blur-sm",
      secondary: "absolute bottom-1/3 left-1/3 w-1 h-1 bg-sky-300/40 rounded-full blur-sm"
    };

    return variants[variant];
  }
};

// Utility functions for complex styling logic
export const getWeatherIconColor = (isDay: boolean): string => {
  return isDay ? "text-amber-400" : "text-slate-300";
};

export const getMetricIconColor = (type: 'humidity' | 'wind' | 'pressure' | 'visibility'): string => {
  const colors = {
    humidity: "text-blue-300",
    wind: "text-slate-300",
    pressure: "text-red-300",
    visibility: "text-gray-300"
  };

  return colors[type];
};

export const buildCardStyle = (): React.CSSProperties => ({
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
});