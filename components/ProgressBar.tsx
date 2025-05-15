import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ProgressBarProps {
  progress: number; // 0 to 1
  width: number;
  height?: number;
  color?: string;
  unfilledColor?: string;
  borderRadius?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  width,
  height = 6,
  color = '#FF6A00',
  unfilledColor = '#F0F0F0',
  borderRadius = 3,
}) => {
  // Ensure progress is between 0 and 1
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  
  return (
    <View 
      style={[
        styles.container, 
        { 
          width, 
          height, 
          backgroundColor: unfilledColor,
          borderRadius
        }
      ]}
    >
      <View 
        style={[
          styles.progress, 
          { 
            width: `${clampedProgress * 100}%`, 
            height, 
            backgroundColor: color,
            borderRadius
          }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  progress: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});