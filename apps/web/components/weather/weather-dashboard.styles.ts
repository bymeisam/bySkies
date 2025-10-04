// Clean interface definitions for style functions
interface ButtonStyleProps {
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

interface WelcomeStyleProps {
  isVisible?: boolean;
}

export const styles = {
  // Main container with animated background
  container: "min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900",

  // Content container with responsive padding
  contentContainer: "relative z-10 container mx-auto px-4 py-8 max-w-7xl",

  // Location selector container
  locationSelectorContainer: "max-w-md mx-auto mb-12",

  // Main content wrapper
  mainContentWrapper: "space-y-8",

  // Welcome state container
  welcomeContainer: (props: WelcomeStyleProps = {}) => {
    const { isVisible = true } = props;
    const base = "text-center py-20";
    const visibility = isVisible ? "block" : "hidden";
    return `${base} ${visibility}`.trim();
  },

  // Welcome content wrapper
  welcomeContent: "max-w-md mx-auto space-y-6",

  // Welcome icon container
  welcomeIcon: "w-24 h-24 bg-gradient-to-br from-sky-400/20 to-blue-600/20 rounded-3xl flex items-center justify-center mx-auto",

  // Welcome icon SVG
  welcomeIconSvg: "w-12 h-12 text-sky-300",

  // Welcome text container
  welcomeTextContainer: "space-y-3",

  // Welcome heading
  welcomeHeading: "text-2xl font-bold text-white",

  // Welcome description
  welcomeDescription: "text-white/70 leading-relaxed",

  // Get started button
  getStartedButton: (props: ButtonStyleProps = {}) => {
    const { disabled = false, variant = 'primary' } = props;

    const base = "px-8 py-4 font-semibold rounded-2xl shadow-lg transition-all duration-300";
    const variantStyles = variant === 'primary'
      ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/30"
      : "bg-white/10 text-white border border-white/20 hover:bg-white/20";
    const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";

    return `${base} ${variantStyles} ${disabledStyles}`.trim();
  },

  // Version indicator
  versionIndicator: "fixed bottom-4 right-4 z-50",

  // Version badge
  versionBadge: "bg-black/20 backdrop-blur-sm text-white/60 text-xs px-2 py-1 rounded-md border border-white/10",
};

// Motion variants for animations
export const motionVariants = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  },

  item: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  },

  button: {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  },
};