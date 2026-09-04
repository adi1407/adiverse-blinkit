import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Animated } from "react-native";
import { colors, spacing, radii } from "../theme/colors";
import { fonts } from "../theme/typography";

export default function LoadingState({ message, label }) {
  const text = message || label || "Loading...";
  return (
    <View style={styles.wrap}>
      <View style={styles.badge}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

export function SkeletonBox({ width = "100%", height = 16, style, radius = radii.sm }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 750, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 750, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius: radius,
          opacity: anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.4, 0.85],
          }),
        },
        style,
      ]}
    />
  );
}

export function ProductCardSkeleton({ variant = "carousel" }) {
  const isGrid = variant === "grid";
  return (
    <View style={[styles.cardSkel, isGrid && styles.cardSkelGrid]}>
      <SkeletonBox height={108} radius={radii.sm} />
      <SkeletonBox height={10} width="40%" style={{ marginTop: 10 }} />
      <SkeletonBox height={14} width="90%" style={{ marginTop: 8 }} />
      <SkeletonBox height={14} width="70%" style={{ marginTop: 6 }} />
      <View style={styles.cardSkelFooter}>
        <SkeletonBox height={16} width={48} />
        <SkeletonBox height={28} width={54} radius={radii.sm} />
      </View>
    </View>
  );
}

export function HomeFeedSkeleton() {
  return (
    <View style={styles.feed}>
      <SkeletonBox height={180} radius={radii.lg} style={{ marginHorizontal: spacing.lg }} />
      <View style={styles.railHead}>
        <SkeletonBox height={18} width="55%" />
        <SkeletonBox height={12} width="30%" style={{ marginTop: 8 }} />
      </View>
      <View style={styles.railRow}>
        <ProductCardSkeleton />
        <ProductCardSkeleton />
        <ProductCardSkeleton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  badge: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginTop: spacing.md,
    color: colors.textSecondary,
    fontSize: 14,
    fontFamily: fonts.semiBold,
  },
  skeleton: {
    backgroundColor: "#E8E8E8",
  },
  cardSkel: {
    width: 138,
    marginRight: spacing.md,
    padding: 10,
  },
  cardSkelGrid: {
    width: "100%",
    marginRight: 0,
    flex: 1,
  },
  cardSkelFooter: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  feed: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  railHead: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  railRow: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
});
