import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';

interface LogoProps {
  width?: number;
  height?: number;
  color?: string;
}

export function Logo({ width = 120, height = 40, color = '#B19CD9' }: LogoProps) {
  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height} viewBox="0 0 120 40">
        <G>
          {/* P */}
          <Path
            d="M8 4 L8 36 M8 4 L20 4 Q28 4 28 12 Q28 20 20 20 L8 20"
            stroke={color}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* L */}
          <Path
            d="M36 4 L36 36 L48 36"
            stroke={color}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* O */}
          <Path
            d="M56 12 Q56 4 64 4 Q72 4 72 12 L72 28 Q72 36 64 36 Q56 36 56 28 Z"
            stroke={color}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* O */}
          <Path
            d="M80 12 Q80 4 88 4 Q96 4 96 12 L96 28 Q96 36 88 36 Q80 36 80 28 Z"
            stroke={color}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* M */}
          <Path
            d="M104 36 L104 4 L108 4 L112 20 L116 4 L120 4 L120 36"
            stroke={color}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});