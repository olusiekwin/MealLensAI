"use client"

import type React from "react"
import { View, Text } from "react-native"
import Svg, { Circle } from "react-native-svg"

interface DonutProgressProps {
  current: number
  total: number
  size?: number
  strokeWidth?: number
}

export const DonutProgress: React.FC<DonutProgressProps> = ({ current, total, size = 60, strokeWidth = 6 }) => {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (current / total) * circumference

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke="#E5E5E5" strokeWidth={strokeWidth} fill="transparent" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#FF6A00"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: "600", color: "#202026" }}>
          {current}/{total}
        </Text>
      </View>
    </View>
  )
}
