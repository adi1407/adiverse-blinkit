// Blinkit-inspired design tokens

export const colors = {
  primary: "#F8CB46",
  primaryDark: "#E4B83A",
  primarySoft: "#FFE58A",
  accent: "#0C831F",
  accentDark: "#096B18",
  accentSoft: "#E8F8EA",
  background: "#FFFFFF",
  surface: "#F7F7F7",
  surfaceWarm: "#FFF9E8",
  text: "#1F1F1F",
  textSecondary: "#4F4F4F",
  textMuted: "#8C8C8C",
  border: "#EFEFEF",
  borderStrong: "#E2E2E2",
  white: "#FFFFFF",
  black: "#000000",
  danger: "#E23744",
  discount: "#256FEF",
  overlay: "rgba(0,0,0,0.04)",
  pressed: "rgba(0,0,0,0.06)",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  section: 22,
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 999,
};

export const shadows = {
  soft: {
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  card: {
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  float: {
    shadowColor: "#0C831F",
    shadowOpacity: 0.28,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  pressed: {
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
};

export { fonts, typography } from "./typography";
