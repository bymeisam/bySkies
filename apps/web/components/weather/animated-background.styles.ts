// Clean interface definitions for style functions
interface OrbStyleProps {
  size?: 'small' | 'medium' | 'large';
  position?: 'top-left' | 'bottom-right';
  variant?: 'blue' | 'purple';
}

export const styles = {
  // Main container for animated background
  container: "fixed inset-0 overflow-hidden pointer-events-none",

  // Animated orbs with size and position variants
  orb: (props: OrbStyleProps = {}) => {
    const { size = 'large', position = 'top-left', variant = 'blue' } = props;

    const base = "absolute rounded-full blur-3xl";

    const sizeStyles = {
      small: "w-64 h-64",
      medium: "w-80 h-80",
      large: "w-96 h-96"
    };

    const positionStyles = {
      'top-left': "top-1/4 left-1/4",
      'bottom-right': "bottom-1/4 right-1/4"
    };

    const variantStyles = {
      blue: "bg-gradient-to-r from-blue-400/20 to-indigo-600/20",
      purple: "bg-gradient-to-r from-purple-400/20 to-pink-600/20"
    };

    return `${base} ${sizeStyles[size]} ${positionStyles[position]} ${variantStyles[variant]}`.trim();
  },

  // Floating particles
  particle: "absolute w-3 h-3 bg-white/40 rounded-full blur-sm",
};

// Motion variants for animations
export const motionVariants = {
  primaryOrb: {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.6, 0.3],
      rotate: [0, 180, 360],
    },
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },

  secondaryOrb: {
    animate: {
      scale: [1.1, 0.9, 1.1],
      opacity: [0.2, 0.5, 0.2],
      rotate: [360, 180, 0],
    },
    transition: {
      duration: 15,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },

  particle: (index: number) => ({
    animate: {
      y: [-20, 20, -20],
      x: [-10, 10, -10],
      opacity: [0.2, 0.6, 0.2],
    },
    transition: {
      duration: 8 + index * 2,
      repeat: Infinity,
      ease: "easeInOut",
      delay: index * 1.5,
    },
  }),
};