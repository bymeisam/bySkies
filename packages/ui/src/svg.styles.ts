// Clean interface definitions for style functions
interface SvgStyleProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export const styles = {
  // Base SVG styling with size variants
  svg: (props: SvgStyleProps = {}) => {
    const { size = 'md', className = '' } = props;

    const base = 'inline-block';

    const sizeStyles = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-8 h-8',
      '2xl': 'w-12 h-12'
    };

    return `${base} ${sizeStyles[size]} ${className}`.trim();
  },
};