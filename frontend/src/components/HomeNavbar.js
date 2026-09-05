import { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Platform,
  useWindowDimensions,
} from "react-native";
import { BlurView } from "expo-blur";
import HomeHeader from "./HomeHeader";
import SearchBar from "./SearchBar";
import LifestyleChips from "./LifestyleChips";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import { colors } from "../theme/colors";

/**
 * Premium sticky home chrome — solid brand at top, real frosted glass on scroll.
 * Must sit as an overlay above scrolling content so blur has something to sample.
 */
export default function HomeNavbar({
  minutes = 8,
  hubs,
  selectedHub,
  onSelectHub,
  onSearchPress,
  onMicPress,
  scrolled = false,
  showChips = true,
  showCurve = true,
}) {
  const reduceMotion = usePrefersReducedMotion();
  const { width } = useWindowDimensions();
  const isCompactWidth = width < 380;
  const glass = useRef(new Animated.Value(scrolled ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(glass, {
      toValue: scrolled ? 1 : 0,
      duration: reduceMotion ? 0 : 260,
      useNativeDriver: true,
    }).start();
  }, [scrolled, glass, reduceMotion]);

  const topOpacity = glass.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  const glassOpacity = glass.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View
      style={[styles.root, scrolled && styles.rootScrolled]}
      accessibilityRole="header"
    >
      {/* Brand yellow — visible at rest */}
      <Animated.View
        pointerEvents="none"
        style={[styles.surfaceTop, { opacity: topOpacity }]}
      />

      {/* Frosted glass — visible once content scrolls underneath */}
      <Animated.View
        pointerEvents="none"
        style={[styles.surfaceGlass, { opacity: glassOpacity }]}
      >
        <BlurView
          intensity={Platform.OS === "ios" ? 64 : 90}
          tint="light"
          style={StyleSheet.absoluteFill}
          {...(Platform.OS === "android"
            ? { experimentalBlurMethod: "dimezisBlurView" }
            : null)}
        />
        <View style={styles.glassTint} />
        <View style={styles.glassSheen} />
        <View style={styles.glassEdge} />
      </Animated.View>

      <View style={[styles.content, scrolled && styles.contentCompact]}>
        <HomeHeader minutes={minutes} compact={scrolled || isCompactWidth} />
        <SearchBar
          onPress={onSearchPress}
          onMicPress={onMicPress}
          compact={scrolled}
          transparent
          glass={scrolled}
        />
        {showChips ? (
          <LifestyleChips
            hubs={hubs}
            selectedId={selectedHub}
            onSelect={onSelectHub}
            transparent
            compact={scrolled}
          />
        ) : null}
        {showCurve && !scrolled ? <View style={styles.curve} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    zIndex: 40,
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  rootScrolled: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.55)",
    ...Platform.select({
      ios: {
        shadowColor: "#1A1A1A",
        shadowOpacity: 0.12,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 8 },
      },
      android: {
        elevation: 12,
      },
    }),
  },
  surfaceTop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primary,
  },
  surfaceGlass: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  glassTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 252, 245, 0.38)",
  },
  glassSheen: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "42%",
    backgroundColor: "rgba(255,255,255,0.22)",
  },
  glassEdge: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: StyleSheet.hairlineWidth * 2,
    backgroundColor: "rgba(248, 203, 70, 0.35)",
  },
  content: {
    position: "relative",
    zIndex: 1,
  },
  contentCompact: {
    paddingBottom: 4,
  },
  curve: {
    height: 14,
    backgroundColor: colors.background,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    marginTop: -1,
  },
});
