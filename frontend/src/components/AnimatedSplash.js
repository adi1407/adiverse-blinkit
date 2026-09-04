import { useCallback, useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Dimensions,
  Easing,
  Modal,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Platform,
} from "react-native";
import * as NativeSplash from "expo-splash-screen";
import { Zap } from "../utils/lucideIcons";
import { fonts } from "../theme/typography";
import { colors, radii, spacing } from "../theme/colors";

const INTRO_MIN_MS = 1600;
const EXIT_MS = 320;
const SCREEN = Dimensions.get("screen");

function LoadingDots({ tint = colors.text }) {
  const dots = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    const loops = dots.map((value, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 150),
          Animated.timing(value, {
            toValue: 1,
            duration: 340,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: 340,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.delay((dots.length - 1 - index) * 150),
        ])
      )
    );

    loops.forEach((loop) => loop.start());
    return () => loops.forEach((loop) => loop.stop());
  }, [dots]);

  return (
    <View style={styles.dotsRow}>
      {dots.map((value, index) => (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            { backgroundColor: tint },
            {
              opacity: value.interpolate({
                inputRange: [0, 1],
                outputRange: [0.28, 1],
              }),
              transform: [
                {
                  translateY: value.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -5],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
}

/**
 * Full-screen boot splash (Modal) so Home never peeks through mid-fade.
 */
export default function AnimatedSplash({ ready, children }) {
  const [mounted, setMounted] = useState(true);
  const [introDone, setIntroDone] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const logo = useRef(new Animated.Value(0)).current;
  const wordmark = useRef(new Animated.Value(0)).current;
  const pill = useRef(new Animated.Value(0)).current;
  const footer = useRef(new Animated.Value(0)).current;
  const halo = useRef(new Animated.Value(0)).current;
  const exit = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (!cancelled) setReduceMotion(enabled);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLayout = useCallback(() => {
    NativeSplash.hideAsync().catch(() => {});
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      [logo, wordmark, pill, footer].forEach((value) => value.setValue(1));
      const timer = setTimeout(() => setIntroDone(true), 500);
      return () => clearTimeout(timer);
    }

    const intro = Animated.sequence([
      Animated.spring(logo, {
        toValue: 1,
        friction: 6,
        tension: 70,
        useNativeDriver: true,
      }),
      Animated.stagger(90, [
        Animated.timing(wordmark, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(pill, {
          toValue: 1,
          duration: 360,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(footer, {
          toValue: 1,
          duration: 340,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]);

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(halo, {
          toValue: 1,
          duration: 1400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(halo, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    intro.start();
    pulse.start();
    const timer = setTimeout(() => setIntroDone(true), INTRO_MIN_MS);

    return () => {
      intro.stop();
      pulse.stop();
      clearTimeout(timer);
    };
  }, [reduceMotion, logo, wordmark, pill, footer, halo]);

  useEffect(() => {
    if (!ready || !introDone) return undefined;

    let cancelled = false;
    // Keep fully opaque for most of the exit, then snap away —
    // avoids the “half splash over Home” look from a long fade.
    const animation = Animated.sequence([
      Animated.delay(reduceMotion ? 40 : 80),
      Animated.timing(exit, {
        toValue: 1,
        duration: reduceMotion ? 120 : EXIT_MS,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    animation.start(({ finished }) => {
      if (finished && !cancelled) setMounted(false);
    });

    return () => {
      cancelled = true;
      animation.stop();
    };
  }, [ready, introDone, reduceMotion, exit]);

  return (
    <View style={styles.root}>
      <View
        style={styles.children}
        pointerEvents={mounted ? "none" : "auto"}
        collapsable={false}
      >
        {children}
      </View>

      <Modal
        visible={mounted}
        animationType="none"
        transparent
        statusBarTranslucent
        hardwareAccelerated
        onRequestClose={() => {}}
      >
        <Animated.View
          onLayout={handleLayout}
          pointerEvents="auto"
          accessible
          accessibilityLabel="blinkit. India's last minute app. Loading."
          style={[
            styles.overlay,
            {
              opacity: exit.interpolate({
                inputRange: [0, 0.55, 1],
                outputRange: [1, 1, 0],
              }),
              transform: [
                {
                  scale: exit.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.04],
                  }),
                },
              ],
            },
          ]}
        >
          {Platform.OS === "android" ? (
            <StatusBar
              backgroundColor={colors.primary}
              barStyle="dark-content"
              translucent
            />
          ) : null}

          <View pointerEvents="none" style={styles.blobTop} />
          <View pointerEvents="none" style={styles.blobBottom} />

          <View style={styles.center}>
            <View style={styles.logoWrap}>
              <Animated.View
                style={[
                  styles.halo,
                  {
                    opacity: halo.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.45, 0],
                    }),
                    transform: [
                      {
                        scale: halo.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.8, 1.7],
                        }),
                      },
                    ],
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.logoTile,
                  {
                    opacity: logo,
                    transform: [
                      {
                        scale: logo.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.55, 1],
                        }),
                      },
                      {
                        rotate: logo.interpolate({
                          inputRange: [0, 1],
                          outputRange: ["-22deg", "0deg"],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Zap
                  size={40}
                  color={colors.primary}
                  fill={colors.primary}
                  strokeWidth={2}
                />
              </Animated.View>
            </View>

            <Animated.Text
              style={[
                styles.wordmark,
                {
                  opacity: wordmark,
                  transform: [
                    {
                      translateY: wordmark.interpolate({
                        inputRange: [0, 1],
                        outputRange: [16, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              blinkit
            </Animated.Text>

            <Animated.View
              style={[
                styles.pill,
                {
                  opacity: pill,
                  transform: [
                    {
                      translateY: pill.interpolate({
                        inputRange: [0, 1],
                        outputRange: [12, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Zap
                size={13}
                color={colors.accent}
                fill={colors.accent}
                strokeWidth={2}
              />
              <Text style={styles.pillText}>delivery in 8 minutes</Text>
            </Animated.View>
          </View>

          <Animated.View style={[styles.footer, { opacity: footer }]}>
            <LoadingDots />
            <Text style={styles.tagline}>India's last minute app</Text>
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  children: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    width: SCREEN.width,
    minHeight: SCREEN.height,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  blobTop: {
    position: "absolute",
    top: -140,
    right: -110,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: colors.primarySoft,
    opacity: 0.5,
  },
  blobBottom: {
    position: "absolute",
    bottom: -170,
    left: -120,
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: colors.primaryDark,
    opacity: 0.35,
  },
  center: {
    alignItems: "center",
    marginTop: -24,
  },
  logoWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  halo: {
    position: "absolute",
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.white,
  },
  logoTile: {
    width: 92,
    height: 92,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.text,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  wordmark: {
    marginTop: spacing.xl,
    fontSize: 44,
    lineHeight: 50,
    fontFamily: fonts.extraBold,
    letterSpacing: -1.8,
    color: colors.text,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: spacing.md,
    paddingVertical: 7,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: colors.white,
  },
  pillText: {
    fontSize: 12.5,
    fontFamily: fonts.bold,
    letterSpacing: -0.2,
    color: colors.accent,
  },
  footer: {
    position: "absolute",
    bottom: Math.max(56, SCREEN.height * 0.08),
    alignItems: "center",
    gap: spacing.md,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  tagline: {
    fontSize: 12.5,
    fontFamily: fonts.bold,
    letterSpacing: 0.3,
    color: "rgba(31,31,31,0.55)",
  },
});
