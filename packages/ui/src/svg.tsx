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
  const SvgComponent = svgPaths[name];

  if (!SvgComponent) {
    console.warn(`SVG icon "${name}" not found`);
    return null;
  }

  return (
    <SvgComponent
      className={styles.svg({ size, className })}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
};