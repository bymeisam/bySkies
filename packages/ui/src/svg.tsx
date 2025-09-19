import React from 'react';
import { styles } from './svg.styles';
import { svgPaths } from './svg/index';

// Available SVG names - automatically derived from svgPaths
export type SvgName = keyof typeof svgPaths;

interface SvgProps {
  name: SvgName;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

export const Svg: React.FC<SvgProps> = ({
  name,
  size = 'md',
  className = '',
  fill = 'currentColor',
  stroke = 'currentColor',
  strokeWidth = 2,
}) => {
  const svgContent = svgPaths[name];

  if (!svgContent) {
    console.warn(`SVG icon "${name}" not found`);
    return null;
  }

  return (
    <svg
      className={styles.svg({ size, className })}
      fill={fill}
      viewBox="0 0 24 24"
      stroke={stroke}
      strokeWidth={strokeWidth}
    >
      {svgContent}
    </svg>
  );
};