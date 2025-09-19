// Clean interface definitions for style functions
interface TabButtonStyleProps {
  isActive: boolean;
}

export const styles = {
  // Main container
  container: "space-y-6",

  // Tab navigation container
  tabNavigation: "flex flex-wrap gap-2 p-1 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl",

  // Individual tab button
  tabButton: (props: TabButtonStyleProps) => {
    const { isActive } = props;
    const base = "relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300";
    const activeStyles = isActive
      ? "text-white bg-white/10 shadow-lg"
      : "text-white/70 hover:text-white hover:bg-white/5";
    return `${base} ${activeStyles}`.trim();
  },

  // Active tab background
  activeTabBackground: "absolute inset-0 bg-gradient-to-r from-sky-500/20 to-blue-600/20 rounded-xl border border-sky-400/30",

  // Tab icon
  tabIcon: "relative text-lg",

  // Tab label
  tabLabel: "relative hidden sm:inline",

  // Tab content container
  tabContent: "min-h-[400px]",
};

// Motion variants for animations
export const motionVariants = {
  activeTabBackground: {
    transition: {
      type: "spring",
      bounce: 0.15,
      duration: 0.5
    }
  },

  tabContent: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: "easeOut" }
  },
};