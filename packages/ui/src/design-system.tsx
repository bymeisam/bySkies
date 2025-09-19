import React from "react";
import { type ReactNode } from "react";
import { styles, designTokens } from "./design-system.styles";

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
  <Component className={styles.displayText({ className })}>
    {children}
  </Component>
);

export const HeadingText: React.FC<TextProps> = ({
  children,
  className = "",
  as: Component = "h2",
}) => (
  <Component className={styles.headingText({ className })}>
    {children}
  </Component>
);

export const SubheadingText: React.FC<TextProps> = ({
  children,
  className = "",
  as: Component = "h3",
}) => (
  <Component className={styles.subheadingText({ className })}>
    {children}
  </Component>
);

export const BodyText: React.FC<TextProps> = ({
  children,
  className = "",
  as: Component = "p",
}) => (
  <Component className={styles.bodyText({ className })}>
    {children}
  </Component>
);

export const TaglineText: React.FC<TextProps> = ({
  children,
  className = "",
  as: Component = "p",
}) => (
  <Component className={styles.taglineText({ className })}>
    {children}
  </Component>
);

export const WeatherDataText: React.FC<TextProps> = ({
  children,
  className = "",
  as: Component = "span",
}) => (
  <Component className={styles.weatherDataText({ className })}>
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

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}) => (
  <button
    className={styles.button({ variant, size, className })}
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

export const SkyCard: React.FC<CardProps> = ({
  children,
  className = "",
  variant = "default",
  padding = "md",
}) => (
  <div className={styles.card({ variant, padding, className })}>
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

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
  size = "md",
  className = "",
}) => (
  <span className={styles.badge({ variant, size, className })}>
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

export const Container: React.FC<ContainerProps> = ({
  children,
  className = "",
  maxWidth = "lg",
  padding = true,
}) => (
  <div className={styles.container({ maxWidth, padding, className })}>
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

export const Section: React.FC<SectionProps> = ({
  children,
  className = "",
  spacing = "lg",
  background = "transparent",
}) => (
  <section className={styles.section({ spacing, background, className })}>
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

  return (
    <span
      className={styles.weatherIcon({ size, animated, condition, className })}
      style={{ backgroundColor: "transparent" }}
    >
      {getIcon(condition)}
    </span>
  );
};

// Re-export design tokens from styles file
export { designTokens };
