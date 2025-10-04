// Clean interface definitions for style functions
interface ContainerStyleProps {
  className?: string;
}

export const styles = {
  // Main container
  container: (props: ContainerStyleProps = {}) => {
    const { className = "" } = props;
    const base = "fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900";
    return `${base} ${className}`.trim();
  },

  // Content container
  content: "text-center",

  // Loader icon container
  loaderContainer: "mb-4 flex justify-center",

  // Loader icon
  loaderIcon: "w-12 h-12 text-sky-400",

  // Text container
  textContainer: "text-white",

  // Main message
  message: "text-xl font-semibold mb-2",

  // Sub message
  subMessage: "text-white/60 text-sm",
};

// Motion variants for animations
export const motionVariants = {
  container: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },

  loader: {
    animate: { rotate: 360 },
    transition: { duration: 1, repeat: Infinity, ease: "linear" }
  },

  text: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.2 }
  },

  pulse: {
    animate: { opacity: [0.5, 1, 0.5] },
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
  }
};