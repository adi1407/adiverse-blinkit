/**
 * Plus Jakarta Sans — Blinkit-adjacent tight grotesque (not Okra).
 * Use via StyleSheet: { ...typography.sectionTitle }
 */
export const fonts = {
  regular: "PlusJakartaSans_400Regular",
  medium: "PlusJakartaSans_500Medium",
  semiBold: "PlusJakartaSans_600SemiBold",
  bold: "PlusJakartaSans_700Bold",
  extraBold: "PlusJakartaSans_800ExtraBold",
};

export const typography = {
  eta: {
    fontFamily: fonts.extraBold,
    fontSize: 22,
    letterSpacing: -0.6,
    color: "#1F1F1F",
  },
  sectionTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 18,
    letterSpacing: -0.35,
    color: "#1F1F1F",
  },
  cardName: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    letterSpacing: -0.15,
    lineHeight: 17,
    color: "#1F1F1F",
  },
  price: {
    fontFamily: fonts.extraBold,
    fontSize: 14,
    letterSpacing: -0.2,
    color: "#1F1F1F",
  },
  label: {
    fontFamily: fonts.bold,
    fontSize: 12,
    letterSpacing: 0.1,
    color: "#1F1F1F",
  },
  caption: {
    fontFamily: fonts.medium,
    fontSize: 11,
    letterSpacing: -0.1,
    color: "#8C8C8C",
  },
  body: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    color: "#4F4F4F",
  },
  wordmark: {
    fontFamily: fonts.extraBold,
    fontSize: 44,
    letterSpacing: -1.8,
    color: "#1F1F1F",
  },
};
