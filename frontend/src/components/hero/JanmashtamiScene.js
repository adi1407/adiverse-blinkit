import { useEffect, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  Animated,
  Easing,
  Platform,
} from "react-native";
import Svg, { Path, Defs, LinearGradient, Stop, G, Ellipse } from "react-native-svg";
import { BlurView } from "expo-blur";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";

function useBreath(value, { duration, delay = 0, enabled }) {
  useEffect(() => {
    if (!enabled) {
      value.setValue(0.5);
      return undefined;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(value, {
          toValue: 1,
          duration,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [value, duration, delay, enabled]);
}

/**
 * Cinematic Janmashtami portrait — one hero image, soft light, elegant motifs.
 * Avoids collage / sticker clutter; motion is intentional and sparse.
 */
export default function JanmashtamiScene({ assets, palette }) {
  const reduceMotion = usePrefersReducedMotion();
  const motion = !reduceMotion;

  const enter = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current;
  const float = useRef(new Animated.Value(0)).current;
  const aura = useRef(new Animated.Value(0)).current;
  const shimmer = useRef(new Animated.Value(0)).current;
  const flame = useRef(new Animated.Value(0)).current;
  const feather = useRef(new Animated.Value(0)).current;
  const petalDrift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduceMotion) {
      enter.setValue(1);
      return undefined;
    }
    const anim = Animated.timing(enter, {
      toValue: 1,
      duration: 780,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [enter, reduceMotion]);

  useBreath(float, { duration: 3800, enabled: motion });
  useBreath(aura, { duration: 3200, delay: 120, enabled: motion });
  useBreath(flame, { duration: 1100, enabled: motion });
  useBreath(feather, { duration: 5200, delay: 200, enabled: motion });
  useBreath(petalDrift, { duration: 6400, enabled: motion });

  useEffect(() => {
    if (!motion) return undefined;
    const loop = Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 3400,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      })
    );
    shimmer.setValue(0);
    loop.start();
    return () => loop.stop();
  }, [motion, shimmer]);

  const portrait = assets.krishna || assets.krishnaAlt;

  if (reduceMotion) {
    return (
      <View style={styles.wrap} accessibilityLabel="Janmashtami illustration">
        <View style={[styles.aura, { backgroundColor: palette.soft }]} />
        <View style={styles.portraitShell}>
          <Image source={portrait} style={styles.portrait} resizeMode="cover" />
        </View>
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.wrap,
        {
          opacity: enter,
          transform: [
            {
              translateY: enter.interpolate({
                inputRange: [0, 1],
                outputRange: [16, 0],
              }),
            },
            {
              scale: enter.interpolate({
                inputRange: [0, 1],
                outputRange: [0.94, 1],
              }),
            },
          ],
        },
      ]}
      accessibilityLabel="Janmashtami illustration of Krishna"
    >
      {/* Soft dual-tone aura */}
      <Animated.View
        style={[
          styles.aura,
          {
            backgroundColor: palette.soft,
            opacity: aura.interpolate({
              inputRange: [0, 1],
              outputRange: [0.55, 0.92],
            }),
            transform: [
              {
                scale: aura.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.94, 1.06],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.auraGold,
          {
            opacity: aura.interpolate({
              inputRange: [0, 1],
              outputRange: [0.25, 0.55],
            }),
            transform: [
              {
                scale: aura.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1.02, 0.96],
                }),
              },
            ],
          },
        ]}
      />

      {/* SVG peacock feathers — behind portrait */}
      <Animated.View
        style={[
          styles.featherLayer,
          {
            transform: [
              {
                rotate: feather.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["-4deg", "3deg"],
                }),
              },
              {
                translateY: feather.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -4],
                }),
              },
            ],
          },
        ]}
        pointerEvents="none"
      >
        <Svg width="100%" height="100%" viewBox="0 0 200 200">
          <Defs>
            <LinearGradient id="pf" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#3D1A6E" stopOpacity="0.85" />
              <Stop offset="45%" stopColor="#1B7A3D" stopOpacity="0.7" />
              <Stop offset="100%" stopColor="#E8B923" stopOpacity="0.8" />
            </LinearGradient>
          </Defs>
          <G opacity="0.88">
            <Path
              d="M38 78 C28 48 48 22 72 18 C58 42 54 62 62 88 C52 86 42 84 38 78Z"
              fill="url(#pf)"
            />
            <Ellipse cx="48" cy="42" rx="7" ry="10" fill="#F8CB46" opacity="0.9" />
            <Ellipse cx="48" cy="42" rx="3.5" ry="5" fill="#1A237E" />
          </G>
          <G opacity="0.8" transform="translate(200,0) scale(-1,1)">
            <Path
              d="M38 78 C28 48 48 22 72 18 C58 42 54 62 62 88 C52 86 42 84 38 78Z"
              fill="url(#pf)"
            />
            <Ellipse cx="48" cy="42" rx="7" ry="10" fill="#F8CB46" opacity="0.85" />
            <Ellipse cx="48" cy="42" rx="3.5" ry="5" fill="#1A237E" />
          </G>
        </Svg>
      </Animated.View>

      {/* Floating marigold motes (abstract, not photo scraps) */}
      {[0, 1, 2, 3, 4].map((i) => (
        <Animated.View
          key={`mote-${i}`}
          style={[
            styles.mote,
            motePos[i],
            {
              backgroundColor: i % 2 === 0 ? "#F8CB46" : "#E91E63",
              opacity: petalDrift.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange:
                  i % 2 === 0 ? [0.15, 0.55, 0.2] : [0.45, 0.18, 0.5],
              }),
              transform: [
                {
                  translateY: petalDrift.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, i % 2 === 0 ? 14 : -10],
                  }),
                },
                {
                  translateX: petalDrift.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, i % 3 === 0 ? 6 : -4],
                  }),
                },
              ],
            },
          ]}
        />
      ))}

      {/* Hero portrait + glass rim */}
      <Animated.View
        style={[
          styles.portraitShell,
          {
            transform: [
              {
                translateY: float.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -7],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.glassRim}>
          {Platform.OS === "ios" ? (
            <BlurView
              intensity={28}
              tint="light"
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <View style={styles.glassRimFallback} />
          )}
        </View>

        <View style={styles.portraitClip}>
          <Image source={portrait} style={styles.portrait} resizeMode="cover" />

          {/* Cinematic light sweep */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.lightSweep,
              {
                opacity: shimmer.interpolate({
                  inputRange: [0, 0.35, 0.55, 1],
                  outputRange: [0, 0, 0.35, 0],
                }),
                transform: [
                  {
                    translateX: shimmer.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-70, 110],
                    }),
                  },
                ],
              },
            ]}
          />

          {/* Bottom vignette */}
          <View style={styles.vignette} pointerEvents="none" />
        </View>

        {/* Soft flame accent */}
        <Animated.View
          style={[
            styles.flameGlow,
            {
              opacity: flame.interpolate({
                inputRange: [0, 1],
                outputRange: [0.35, 0.85],
              }),
              transform: [
                {
                  scale: flame.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.85, 1.15],
                  }),
                },
              ],
            },
          ]}
        />
        <View style={styles.flameCore} />
      </Animated.View>
    </Animated.View>
  );
}

const motePos = [
  { top: "8%", left: "12%" },
  { top: "14%", right: "10%" },
  { top: "38%", left: "4%" },
  { top: "48%", right: "6%" },
  { top: "22%", left: "42%" },
];

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    aspectRatio: 1,
    maxWidth: 236,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  aura: {
    position: "absolute",
    width: "88%",
    height: "88%",
    borderRadius: 999,
  },
  auraGold: {
    position: "absolute",
    width: "72%",
    height: "72%",
    borderRadius: 999,
    backgroundColor: "rgba(248,203,70,0.45)",
  },
  featherLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  mote: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
    zIndex: 2,
  },
  portraitShell: {
    width: "68%",
    aspectRatio: 0.82,
    zIndex: 5,
    alignItems: "center",
  },
  glassRim: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
    overflow: "hidden",
    transform: [{ scale: 1.06 }],
    opacity: 0.75,
  },
  glassRimFallback: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.28)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.55)",
    borderRadius: 28,
  },
  portraitClip: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(255,248,225,0.85)",
    backgroundColor: "#1A0F2E",
    ...Platform.select({
      ios: {
        shadowColor: "#3D1A6E",
        shadowOpacity: 0.35,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
      },
      android: { elevation: 8 },
    }),
  },
  portrait: {
    width: "100%",
    height: "100%",
  },
  lightSweep: {
    position: "absolute",
    top: -10,
    bottom: -10,
    width: 42,
    backgroundColor: "rgba(255,255,255,0.55)",
    transform: [{ skewX: "-16deg" }],
  },
  vignette: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "38%",
    backgroundColor: "rgba(26,15,46,0.35)",
  },
  flameGlow: {
    position: "absolute",
    bottom: -6,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFECB3",
    zIndex: 6,
  },
  flameCore: {
    position: "absolute",
    bottom: 2,
    width: 10,
    height: 14,
    borderRadius: 6,
    backgroundColor: "#FFB300",
    zIndex: 7,
  },
});
