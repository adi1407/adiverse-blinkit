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
 * Premium sticky home chrome — glass on scroll, lightweight at top.
 * Pure presentation wrapper; no API / cart business logic changes.
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
      duration: reduceMotion ? 0 : 220,
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
      {/* Default: integrated Blinkit yellow surface */}
      <Animated.View
        pointerEvents="none"
        style={[styles.surfaceTop, { opacity: topOpacity }]}
      />

      {/* Scrolled: floating glass */}
      <Animated.View
        pointerEvents="none"
        style={[styles.surfaceGlass, { opacity: glassOpacity }]}
      >
        <BlurView
          intensity={Platform.OS === "ios" ? 48 : 72}
          tint="light"
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.glassTint} />
      </Animated.View>

      <View style={[styles.content, scrolled && styles.contentCompact]}>
        <HomeHeader minutes={minutes} compact={scrolled || isCompactWidth} />
        <SearchBar
          onPress={onSearchPress}
          onMicPress={onMicPress}
          compact={scrolled}
          transparent
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
    zIndex: 20,
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  rootScrolled: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.08)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 6 },
      },
      android: {
        elevation: 8,
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
    backgroundColor: "rgba(255, 252, 240, 0.62)",
  },
  content: {
    position: "relative",
    zIndex: 1,
  },
  contentCompact: {
    paddingBottom: 2,
  },
  curve: {
    height: 14,
    backgroundColor: colors.background,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    marginTop: -1,
  },
});
