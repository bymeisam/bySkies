// Clean interface definitions for style functions
interface ContainerStyleProps {
  className?: string;
}

interface SelectorButtonStyleProps {
  isOpen: boolean;
}

interface UseCurrentLocationButtonStyleProps {
  disabled?: boolean;
}

export const styles = {
  // Main container
  container: (props: ContainerStyleProps = {}) => {
    const { className = "" } = props;
    const base = "relative";
    return `${base} ${className}`.trim();
  },

  // Selector button
  selectorButton: (props: SelectorButtonStyleProps) => {
    const { isOpen } = props;
    const base = "w-full flex items-center gap-3 bg-white/10 backdrop-blur-xl border rounded-2xl p-4 text-white transition-all duration-300 group";
    const stateStyles = isOpen
      ? "border-sky-400/50 shadow-lg shadow-sky-500/20"
      : "border-white/20 hover:border-white/30";
    return `${base} ${stateStyles}`.trim();
  },

  // Icon container
  iconContainer: "p-2 bg-sky-400/20 rounded-xl border border-sky-400/30 group-hover:bg-sky-400/30 transition-colors flex items-center justify-center flex-shrink-0",

  // Map pin icon
  mapPinIcon: "w-5 h-5 text-sky-300",

  // Content container
  contentContainer: "flex-1 text-left",

  // Location name
  locationName: "font-medium",

  // Location details
  locationDetails: "text-sm text-white/60",

  // Placeholder content
  placeholderTitle: "font-medium",
  placeholderSubtitle: "text-sm text-white/60",

  // Dropdown arrow container
  arrowContainer: "flex-shrink-0",

  // Dropdown arrow icon
  arrowIcon: "w-5 h-5 text-white/60 group-hover:text-white/80 transition-colors",

  // Dropdown container
  dropdownContainer: "absolute top-full left-0 right-0 z-[100] mt-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden",

  // Dropdown content
  dropdownContent: "p-4 space-y-4 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent",

  // Use current location button
  useCurrentLocationButton: (props: UseCurrentLocationButtonStyleProps = {}) => {
    const { disabled = false } = props;
    const base = "w-full flex items-center gap-3 p-3 bg-sky-400/10 border border-sky-400/20 rounded-xl text-white hover:bg-sky-400/20 transition-all duration-200";
    const disabledStyles = disabled ? "opacity-50 cursor-not-allowed disabled:hover:scale-100" : "";
    return `${base} ${disabledStyles}`.trim();
  },

  // Current location button icon
  currentLocationIcon: "w-5 h-5 text-sky-300",

  // Current location button icon (loading)
  currentLocationIconLoading: "w-5 h-5 text-sky-300 animate-spin",

  // Current location button text
  currentLocationText: "font-medium",
};

// Motion variants for animations
export const motionVariants = {
  button: {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 }
  },

  arrow: {
    animate: (isOpen: boolean) => ({ rotate: isOpen ? 180 : 0 }),
    transition: { duration: 0.3, ease: "easeInOut" }
  },

  dropdown: {
    initial: { opacity: 0, y: -10, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 },
    transition: { duration: 0.2, ease: "easeOut" }
  }
};