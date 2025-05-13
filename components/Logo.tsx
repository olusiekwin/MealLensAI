import React from 'react';
import { SvgXml } from 'react-native-svg';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Import the SVG content directly
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="730" height="272" viewBox="0 0 730 272" version="1.1"><path d="M 144.500 33 C 144.160 33.550, 143.078 34, 142.096 34 C 141.114 34, 139.461 34.938, 138.424 36.084 C 135.055 39.807, 136.847 49, 140.942 49 C 141.539 49, 142.980 49.563, 144.144 50.250 C 145.838 51.250, 146.352 51.250, 146.714 50.250 C 146.963 49.563, 148.186 49, 149.431 49 C 152.715 49, 155.732 42.236, 153.941 38.889 C 152.381 35.975, 151.068 34.642, 148.295 33.158 C 145.655 31.745, 145.285 31.730, 144.500 33" stroke="none" fill="#f6cdbf" fill-rule="evenodd"/></svg>`;

interface LogoProps {
  width?: number;
  height?: number;
  style?: any;
}

export const Logo: React.FC<LogoProps> = ({ 
  width: customWidth = width * 0.25, 
  height: customHeight = width * 0.25,
  style 
}) => {
  return (
    <SvgXml 
      xml={logoSvg} 
      width={customWidth} 
      height={customHeight}
      style={style}
    />
  );
};

export default Logo;
