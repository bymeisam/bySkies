// Clean interface definitions for style functions

interface TextStyleProps {
  className?: string;
}

interface ButtonStyleProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

interface CardStyleProps {
  variant?: 'default' | 'glass' | 'elevated' | 'weather';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

interface BadgeStyleProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

interface ContainerStyleProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: boolean;
  className?: string;
}

interface SectionStyleProps {
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  background?: 'transparent' | 'neutral' | 'sky' | 'gradient';
  className?: string;
}

interface WeatherIconStyleProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  condition?: string;
  className?: string;
}

export const styles = {
  // Typography styles
  displayText: (props: TextStyleProps = {}) => {
    const { className = '' } = props;
    return `text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-gray-900 ${className}`.trim();
  },

  headingText: (props: TextStyleProps = {}) => {
    const { className = '' } = props;
    return `text-2xl md:text-3xl lg:text-4xl font-semibold leading-snug tracking-tight text-gray-800 ${className}`.trim();
  },

  subheadingText: (props: TextStyleProps = {}) => {
    const { className = '' } = props;
    return `text-lg md:text-xl lg:text-2xl font-medium leading-normal text-gray-700 ${className}`.trim();
  },

  bodyText: (props: TextStyleProps = {}) => {
    const { className = '' } = props;
    return `text-base leading-relaxed text-gray-600 ${className}`.trim();
  },

  taglineText: (props: TextStyleProps = {}) => {
    const { className = '' } = props;
    return `text-lg md:text-xl font-light leading-relaxed text-gray-500 ${className}`.trim();
  },

  weatherDataText: (props: TextStyleProps = {}) => {
    const { className = '' } = props;
    return `text-sm font-medium tracking-wide text-gray-700 ${className}`.trim();
  },

  // Button styles
  button: (props: ButtonStyleProps = {}) => {
    const { variant = 'primary', size = 'md', className = '' } = props;

    const base = 'font-medium transition-all duration-300 transition-colors will-change-transform motion-safe:transform-gpu focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 hover:scale-105 hover:-translate-y-0.5 hover:shadow-sky/50 active:scale-95';

    const variants = {
      primary: 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl',
      secondary: 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg hover:shadow-xl',
      ghost: 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/20',
      success: 'bg-green-500 hover:bg-green-600 text-white shadow-lg',
      warning: 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg'
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded-lg',
      md: 'px-4 py-2 text-base rounded-xl',
      lg: 'px-6 py-3 text-lg rounded-xl',
      xl: 'px-8 py-4 text-xl rounded-2xl'
    };

    return `${base} ${variants[variant]} ${sizes[size]} ${className}`.trim();
  },

  // Card styles
  card: (props: CardStyleProps = {}) => {
    const { variant = 'default', padding = 'md', className = '' } = props;

    const base = 'rounded-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-sky/50 will-change-transform motion-safe:transform-gpu animate-fade-in-top';

    const variants = {
      default: 'bg-white border border-gray-200 shadow-md',
      glass: 'bg-white/20 backdrop-blur-md border border-white/20',
      elevated: 'bg-white shadow-xl hover:shadow-2xl',
      weather: 'bg-gradient-to-br from-blue-400 to-blue-600 shadow-2xl hover:shadow-blue-500/50'
    };

    const paddings = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10'
    };

    return `${base} ${variants[variant]} ${paddings[padding]} ${className}`.trim();
  },

  // Badge styles
  badge: (props: BadgeStyleProps = {}) => {
    const { variant = 'neutral', size = 'md', className = '' } = props;

    const base = 'inline-flex items-center font-medium rounded-full border';

    const variants = {
      primary: 'bg-blue-100 text-blue-800 border-blue-200',
      secondary: 'bg-amber-100 text-amber-800 border-amber-200',
      success: 'bg-green-100 text-green-800 border-green-200',
      warning: 'bg-amber-100 text-amber-800 border-amber-200',
      neutral: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    const sizes = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
      lg: 'px-4 py-2 text-base'
    };

    return `${base} ${variants[variant]} ${sizes[size]} ${className}`.trim();
  },

  // Container styles
  container: (props: ContainerStyleProps = {}) => {
    const { maxWidth = 'lg', padding = true, className = '' } = props;

    const base = 'mx-auto w-full';

    const maxWidths = {
      sm: 'max-w-2xl',
      md: 'max-w-4xl',
      lg: 'max-w-6xl',
      xl: 'max-w-7xl',
      '2xl': 'max-w-8xl',
      full: 'max-w-full'
    };

    const paddingClass = padding ? 'px-4 sm:px-6 lg:px-8' : '';

    return `${base} ${maxWidths[maxWidth]} ${paddingClass} ${className}`.trim();
  },

  // Section styles
  section: (props: SectionStyleProps = {}) => {
    const { spacing = 'lg', background = 'transparent', className = '' } = props;

    const base = 'relative w-full';

    const spacings = {
      sm: 'py-8',
      md: 'py-16',
      lg: 'py-24',
      xl: 'py-32'
    };

    const backgrounds = {
      transparent: '',
      neutral: 'bg-gray-50',
      sky: 'bg-gradient-to-b from-sky-50 to-sky-100',
      gradient: 'bg-gradient-to-br from-blue-500 via-blue-400 to-amber-500 parallax-gradient'
    };

    return `${base} ${spacings[spacing]} ${backgrounds[background]} ${className}`.trim();
  },

  // Weather icon styles
  weatherIcon: (props: WeatherIconStyleProps = {}) => {
    const { size = 'md', animated = true, condition = '', className = '' } = props;

    const base = 'inline-block bg-transparent leading-none';

    const sizes = {
      sm: 'text-2xl',
      md: 'text-4xl',
      lg: 'text-6xl',
      xl: 'text-8xl'
    };

    const animationClass = animated ? 'animate-bounce-gentle' : '';

    const getExtraAnimation = () => {
      if (!animated) return '';
      const main = condition.toLowerCase();
      if (main.includes('clear') || main.includes('sun')) return 'animate-glow';
      if (main.includes('cloud')) return 'animate-cloud-move';
      return '';
    };

    const extraAnimation = getExtraAnimation();

    return `${base} ${sizes[size]} ${animationClass} ${extraAnimation} ${className}`.trim();
  }
};

// Design tokens for consistent usage
export const designTokens = {
  colors: {
    primary: 'text-blue-500',
    secondary: 'text-amber-500',
    success: 'text-green-500',
    warning: 'text-amber-500',
    neutral: 'text-gray-500'
  },
  backgrounds: {
    primary: 'bg-blue-500',
    secondary: 'bg-amber-500',
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    neutral: 'bg-gray-50'
  },
  spacing: {
    xs: 'space-y-1',
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6',
    xl: 'space-y-8',
    xxl: 'space-y-12'
  },
  radius: {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    full: 'rounded-full'
  }
} as const;