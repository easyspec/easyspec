import type React from "react";

// Animation durations
export const ANIMATION_DURATIONS = {
  fast: 200,
  normal: 300,
  slow: 500,
  pulse: 2000,
  fadeIn: 1000,
} as const;

// Spacing constants
export const SPACING = {
  xs: 0.5,
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
  xxl: 6,
} as const;

// Icon sizes
export const ICON_SIZES = {
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48,
  xxl: 64,
} as const;

// Landing page props
export interface CheckmarkItemProps {
  text: string;
}

export interface ChipBadgeProps {
  text: string;
  icon?: React.ReactNode;
  variant?: "eco" | "new" | "feature";
}
