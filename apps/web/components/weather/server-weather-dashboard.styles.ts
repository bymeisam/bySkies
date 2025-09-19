export const styles = {
  // Main container
  container: "min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900",

  // Error/empty state container
  centerContainer: "min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center",

  // Error/empty state content
  centerContent: "text-center text-white",

  // Error/empty state heading
  centerHeading: "text-2xl font-bold mb-4",

  // Error message
  errorMessage: "text-red-300",

  // Empty state message
  emptyMessage: "text-slate-300",

  // Animated background container
  backgroundContainer: "fixed inset-0 overflow-hidden pointer-events-none",

  // Animated background orb
  backgroundOrb: "absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-indigo-600/10 rounded-full blur-3xl",

  // Main content container
  contentContainer: "relative z-10 container mx-auto px-4 py-8",

  // Header section
  headerSection: "text-center mb-8",

  // Main title
  title: "text-4xl font-bold text-white mb-2",

  // Subtitle
  subtitle: "text-slate-300",

  // Cards container
  cardsContainer: "max-w-6xl mx-auto space-y-6",
};

// Motion variants for animations
export const motionVariants = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  backgroundOrb: {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.1, 0.2, 0.1],
      rotate: [0, 90, 180, 270, 360],
    },
    transition: {
      duration: 60,
      repeat: Infinity,
      ease: "linear",
    },
  },
};