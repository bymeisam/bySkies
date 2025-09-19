// Clean interface definitions for style functions
interface TitleStyleProps {
  size?: 'default' | 'large';
}

export const styles = {
  // Main header container
  container: "text-center mb-12",

  // Main title with gradient text
  title: (props: TitleStyleProps = {}) => {
    const { size = 'default' } = props;
    const base = "font-bold mb-4";
    const sizeStyles = size === 'large'
      ? "text-6xl md:text-8xl"
      : "text-5xl md:text-7xl";
    return `${base} ${sizeStyles}`.trim();
  },

  // Gradient text for the title
  titleGradient: "bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent",

  // Subtitle text
  subtitle: "text-xl text-white/80 font-medium",
};

// Motion variants for animations
export const motionVariants = {
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
};