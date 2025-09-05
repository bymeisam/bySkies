import React from "react";
import { type ReactNode } from "react";

// Design System Utilities and Components

// Typography Components
interface TextProps {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
}

export const DisplayText: React.FC<TextProps> = ({
  children,
  className = "",
  as: Component = "h1",
}) => (
  <Component
    className={`text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-gray-900 ${className}`}
  >
    {children}
  </Component>
);

export const HeadingText: React.FC<TextProps> = ({
  children,
  className = "",
  as: Component = "h2",
}) => (
  <Component
    className={`text-2xl md:text-3xl lg:text-4xl font-semibold leading-snug tracking-tight text-gray-800 ${className}`}
  >
    {children}
  </Component>
);

export const SubheadingText: React.FC<TextProps> = ({
  children,
  className = "",
  as: Component = "h3",
}) => (
  <Component
    className={`text-lg md:text-xl lg:text-2xl font-medium leading-normal text-gray-700 ${className}`}
  >
    {children}
  </Component>
);

export const BodyText: React.FC<TextProps> = ({
  children,
  className = "",
  as: Component = "p",
}) => (
  <Component className={`text-base leading-relaxed text-gray-600 ${className}`}>
    {children}
  </Component>
);

export const TaglineText: React.FC<TextProps> = ({
  children,
  className = "",
  as: Component = "p",
}) => (
  <Component
    className={`text-lg md:text-xl font-light leading-relaxed text-gray-500 ${className}`}
  >
    {children}
  </Component>
);

export const WeatherDataText: React.FC<TextProps> = ({
  children,
  className = "",
  as: Component = "span",
}) => (
  <Component
    className={`text-sm font-medium tracking-wide text-gray-700 ${className}`}
  >
    {children}
  </Component>
);

// Button Components
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "success" | "warning";
  size?: "sm" | "md" | "lg" | "xl";
  children: ReactNode;
  className?: string;
}

const buttonVariants = {
  primary: "bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl",
  secondary:
    "bg-amber-500 hover:bg-amber-600 text-white shadow-lg hover:shadow-xl",
  ghost:
    "bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/20",
  success: "bg-green-500 hover:bg-green-600 text-white shadow-lg",
  warning: "bg-amber-500 hover:bg-amber-600 text-white shadow-lg",
};

const buttonSizes = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-4 py-2 text-base rounded-xl",
  lg: "px-6 py-3 text-lg rounded-xl",
  xl: "px-8 py-4 text-xl rounded-2xl",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}) => (
  <button
    className={`
      font-medium transition-all duration-300 transition-colors will-change-transform motion-safe:transform-gpu
      focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
      hover:scale-105 hover:-translate-y-0.5 hover:shadow-sky/50 active:scale-95
      ${buttonVariants[variant]}
      ${buttonSizes[size]}
      ${className}
    `}
    {...props}
  >
    {children}
  </button>
);

// Card Components
interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "glass" | "elevated" | "weather";
  padding?: "sm" | "md" | "lg" | "xl";
}

const cardVariants = {
  default: "bg-white border border-gray-200 shadow-md",
  glass: "bg-white/20 backdrop-blur-md border border-white/20",
  elevated: "bg-white shadow-xl hover:shadow-2xl",
  weather:
    "bg-gradient-to-br from-blue-400 to-blue-600 shadow-2xl hover:shadow-blue-500/50",
};

const cardPadding = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
  xl: "p-10",
};

export const SkyCard: React.FC<CardProps> = ({
  children,
  className = "",
  variant = "default",
  padding = "md",
}) => (
  <div
    className={`
    rounded-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-sky/50 will-change-transform motion-safe:transform-gpu animate-fade-in-top
    ${cardVariants[variant]}
    ${cardPadding[padding]}
    ${className}
  `}
  >
    {children}
  </div>
);

// Badge Components
interface BadgeProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning" | "neutral";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const badgeVariants = {
  primary: "bg-blue-100 text-blue-800 border-blue-200",
  secondary: "bg-amber-100 text-amber-800 border-amber-200",
  success: "bg-green-100 text-green-800 border-green-200",
  warning: "bg-amber-100 text-amber-800 border-amber-200",
  neutral: "bg-gray-100 text-gray-800 border-gray-200",
};

const badgeSizes = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-1.5 text-sm",
  lg: "px-4 py-2 text-base",
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
  size = "md",
  className = "",
}) => (
  <span
    className={`
    inline-flex items-center font-medium rounded-full border
    ${badgeVariants[variant]}
    ${badgeSizes[size]}
    ${className}
  `}
  >
    {children}
  </span>
);

// Container Components
interface ContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: boolean;
}

const containerMaxWidths = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  "2xl": "max-w-8xl",
  full: "max-w-full",
};

export const Container: React.FC<ContainerProps> = ({
  children,
  className = "",
  maxWidth = "lg",
  padding = true,
}) => (
  <div
    className={`
    mx-auto w-full
    ${containerMaxWidths[maxWidth]}
    ${padding ? "px-4 sm:px-6 lg:px-8" : ""}
    ${className}
  `}
  >
    {children}
  </div>
);

// Layout Components
interface SectionProps {
  children: ReactNode;
  className?: string;
  spacing?: "sm" | "md" | "lg" | "xl";
  background?: "transparent" | "neutral" | "sky" | "gradient";
}

const sectionSpacing = {
  sm: "py-8",
  md: "py-16",
  lg: "py-24",
  xl: "py-32",
};

const sectionBackgrounds = {
  transparent: "",
  neutral: "bg-gray-50",
  sky: "bg-gradient-to-b from-sky-50 to-sky-100",
  gradient:
    "bg-gradient-to-br from-blue-500 via-blue-400 to-amber-500 parallax-gradient",
};

export const Section: React.FC<SectionProps> = ({
  children,
  className = "",
  spacing = "lg",
  background = "transparent",
}) => (
  <section
    className={`
    relative w-full
    ${sectionSpacing[spacing]}
    ${sectionBackgrounds[background]}
    ${className}
  `}
  >
    {children}
  </section>
);

// Weather-specific Components
interface WeatherIconProps {
  condition: string;
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  className?: string;
}

const iconSizes = {
  sm: "text-2xl",
  md: "text-4xl",
  lg: "text-6xl",
  xl: "text-8xl",
};

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  condition,
  size = "md",
  animated = true,
  className = "",
}) => {
  const getIcon = (condition: string) => {
    const main = condition.toLowerCase();
    if (main.includes("clear") || main.includes("sun")) return "☀️";
    if (main.includes("cloud")) return "☁️";
    if (main.includes("rain")) return "🌧️";
    if (main.includes("drizzle")) return "🌦️";
    if (main.includes("snow")) return "❄️";
    if (main.includes("thunderstorm")) return "⛈️";
    if (main.includes("mist") || main.includes("fog")) return "🌫️";
    return "🌤️";
  };

  const main = condition.toLowerCase();
  const extraAnim =
    animated && (main.includes("clear") || main.includes("sun"))
      ? "animate-glow"
      : animated && main.includes("cloud")
        ? "animate-cloud-move"
        : "";

  return (
    <span
      className={`
      inline-block bg-transparent leading-none
      ${iconSizes[size]}
      ${animated ? "animate-bounce-gentle" : ""}
      ${extraAnim}
      ${className}
    `}
      style={{ backgroundColor: "transparent" }}
    >
      {getIcon(condition)}
    </span>
  );
};

// Utility Classes Export
export const designTokens = {
  colors: {
    primary: "text-blue-500",
    secondary: "text-amber-500",
    success: "text-green-500",
    warning: "text-amber-500",
    neutral: "text-gray-500",
  },
  backgrounds: {
    primary: "bg-blue-500",
    secondary: "bg-amber-500",
    success: "bg-green-500",
    warning: "bg-amber-500",
    neutral: "bg-gray-50",
  },
  spacing: {
    xs: "space-y-1", // 4px
    sm: "space-y-2", // 8px
    md: "space-y-4", // 16px
    lg: "space-y-6", // 24px
    xl: "space-y-8", // 32px
    xxl: "space-y-12", // 48px
  },
  radius: {
    sm: "rounded-lg",
    md: "rounded-xl",
    lg: "rounded-2xl",
    full: "rounded-full",
  },
} as const;
