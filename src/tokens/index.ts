/* pixel-ui 设计 Token */

export const space = {
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "24px",
  6: "32px",
} as const;

export const shadow = {
  hard: "4px 4px 0px #000",
  hardSm: "2px 2px 0px #000",
  hardLg: "6px 6px 0px #000",
} as const;

export const colors = {
  black: "#000",
  white: "#fff",
  gray: "#999",
  grayLight: "#e0e0e0",
  grayDark: "#666",
  text: "#000",
  bg: "#fff",
  bgPage: "#f0f0f0",
  success: "#52c41a",
  warning: "#faad14",
  error: "#d93025",
  info: "#1677ff",
} as const;

export const fontSize = {
  xs: "10px",
  sm: "12px",
  md: "14px",
  lg: "16px",
  xl: "20px",
} as const;

export const fontWeight = {
  regular: 400,
  bold: 700,
} as const;

export const lineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.8,
} as const;
