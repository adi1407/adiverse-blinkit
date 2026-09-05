import { useEffect, useRef, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Animated,
  Easing,
  Platform,
} from "react-native";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";

function useLoop(
  value,
  { duration, delay = 0, easing = Easing.inOut(Easing.sin), enabled = true }
) {
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
          easing,
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 0,
          duration,
          easing,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [value, duration, delay, easing, enabled]);
}

/**
 * Detailed Janmashtami visual: Krishna photos + layered festive motion.
 * Motion is transform/opacity only; respects reduced motion.
 */
export default function JanmashtamiScene({ assets, palette }) {
  const reduceMotion = usePrefersReducedMotion();
  const motion = !reduceMotion;

  const krishnaFloat = useRef(new Animated.Value(0)).current;
  const krishnaBreath = useRef(new Animated.Value(0)).current;
  const featherL = useRef(new Animated.Value(0)).current;
  const featherR = useRef(new Animated.Value(0)).current;
  const diyaGlow = useRef(new Animated.Value(0)).current;
  const potBob = useRef(new Animated.Value(0)).current;
  const fluteSway = useRef(new Animated.Value(0)).current;
  const halo = useRef(new Animated.Value(0)).current;
  const petalA = useRef(new Animated.Value(0)).current;
  const petalB = useRef(new Animated.Value(0)).current;
  const petalC = useRef(new Animated.Value(0)).current;
  const sparkle = useRef(new Animated.Value(0)).current;
  const ringSpin = useRef(new Animated.Value(0)).current;
  const crossfade = useRef(new Animated.Value(0)).current;
  const enter = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current;

  const [portrait, setPortrait] = useState(0);
  const portraits = [
    assets.krishna,
    assets.krishnaAlt || assets.krishna,
    assets.krishnaTemple || assets.krishna,
  ].filter(Boolean);

  useEffect(() => {
    if (reduceMotion) {
      enter.setValue(1);
      return undefined;
    }
    const anim = Animated.spring(enter, {
      toValue: 1,
      friction: 7,
      tension: 48,
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [enter, reduceMotion]);

  useEffect(() => {
    if (!motion || portraits.length < 2) return undefined;
    const id = setInterval(() => {
      Animated.timing(crossfade, {
        toValue: 1,
        duration: 700,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!finished) return;
        setPortrait((p) => (p + 1) % portraits.length);
        crossfade.setValue(0);
      });
    }, 5200);
    return () => clearInterval(id);
  }, [motion, portraits.length, crossfade]);

  useLoop(krishnaFloat, { duration: 3200, enabled: motion });
  useLoop(krishnaBreath, { duration: 2600, delay: 200, enabled: motion });
  useLoop(featherL, { duration: 3800, delay: 100, enabled: motion });
  useLoop(featherR, { duration: 4200, delay: 400, enabled: motion });
  useLoop(diyaGlow, { duration: 1400, enabled: motion });
  useLoop(potBob, { duration: 3000, delay: 250, enabled: motion });
  useLoop(fluteSway, { duration: 3600, delay: 150, enabled: motion });
  useLoop(halo, { duration: 2400, enabled: motion });
  useLoop(petalA, { duration: 4800, enabled: motion });
  useLoop(petalB, { duration: 5200, delay: 800, enabled: motion });
  useLoop(petalC, { duration: 5600, delay: 400, enabled: motion });
  useLoop(sparkle, { duration: 1800, delay: 100, enabled: motion });

  useEffect(() => {
    if (!motion) return undefined;
    const loop = Animated.loop(
      Animated.timing(ringSpin, {
        toValue: 1,
        duration: 16000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [motion, ringSpin]);

  const primary = portraits[portrait] || assets.krishna;
  const next = portraits[(portrait + 1) % portraits.length] || primary;

  if (reduceMotion) {
    return (
      <View style={styles.wrap} accessibilityLabel="Janmashtami illustration">
        <View style={[styles.halo, { backgroundColor: palette.soft }]} />
        <Image source={assets.krishna} style={styles.krishna} resizeMode="cover" />
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
              scale: enter.interpolate({
                inputRange: [0, 1],
                outputRange: [0.88, 1],
              }),
            },
          ],
        },
      ]}
      accessibilityLabel="Janmashtami illustration of Krishna"
    >
      {/* Soft pulsing halo */}
      <Animated.View
        style={[
          styles.halo,
          {
            backgroundColor: palette.soft,
            opacity: halo.interpolate({
              inputRange: [0, 1],
              outputRange: [0.4, 0.82],
            }),
            transform: [
              {
                scale: halo.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1.1],
                }),
              },
            ],
          },
        ]}
      />

      {/* Slow rotating gold ring */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.goldRing,
          {
            borderColor: "rgba(248,203,70,0.55)",
            transform: [
              {
                rotate: ringSpin.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "360deg"],
                }),
              },
            ],
          },
        ]}
      >
        <View style={[styles.ringDot, styles.ringDotA]} />
        <View style={[styles.ringDot, styles.ringDotB]} />
        <View style={[styles.ringDot, styles.ringDotC]} />
      </Animated.View>

      {/* Falling petals */}
      <Animated.Image
        source={assets.flowers}
        style={[
          styles.petal,
          styles.petalA,
          {
            opacity: petalA.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.12, 0.48, 0.18],
            }),
            transform: [
              {
                translateY: petalA.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-10, 32],
                }),
              },
              {
                rotate: petalA.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["-14deg", "20deg"],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.Image
        source={assets.marigold || assets.flowers}
        style={[
          styles.petal,
          styles.petalB,
          {
            opacity: petalB.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.1, 0.42, 0.16],
            }),
            transform: [
              {
                translateY: petalB.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-6, 38],
                }),
              },
              {
                rotate: petalB.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["12deg", "-18deg"],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.Image
        source={assets.flowers}
        style={[
          styles.petal,
          styles.petalC,
          {
            opacity: petalC.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.08, 0.36, 0.12],
            }),
            transform: [
              {
                translateY: petalC.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-4, 42],
                }),
              },
              {
                translateX: petalC.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 8],
                }),
              },
              {
                rotate: petalC.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["-6deg", "22deg"],
                }),
              },
            ],
          },
        ]}
      />

      {/* Peacock feathers — left / right sway */}
      <Animated.Image
        source={assets.peacock}
        style={[
          styles.feather,
          styles.featherL,
          {
            transform: [
              {
                translateY: featherL.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -8],
                }),
              },
              {
                rotate: featherL.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["-20deg", "-6deg"],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.Image
        source={assets.peacockAlt || assets.peacock}
        style={[
          styles.feather,
          styles.featherR,
          {
            transform: [
              {
                translateY: featherR.interpolate({
                  inputRange: [0, 1],
                  outputRange: [2, -7],
                }),
              },
              {
                rotate: featherR.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["14deg", "26deg"],
                }),
              },
            ],
          },
        ]}
      />

      {/* Krishna portraits — float, breath, soft crossfade */}
      <Animated.View
        style={[
          styles.krishnaWrap,
          {
            transform: [
              {
                translateY: krishnaFloat.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -9],
                }),
              },
              {
                scale: krishnaBreath.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.03],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.krishnaRing}>
          <Image source={primary} style={styles.krishna} resizeMode="cover" />
          <Animated.Image
            source={next}
            style={[
              styles.krishna,
              StyleSheet.absoluteFillObject,
              {
                opacity: crossfade,
              },
            ]}
            resizeMode="cover"
          />
        </View>
      </Animated.View>

      {/* Twinkling sparkles */}
      {[0, 1, 2, 3].map((i) => (
        <Animated.View
          key={`spark-${i}`}
          style={[
            styles.spark,
            i === 0 && styles.spark0,
            i === 1 && styles.spark1,
            i === 2 && styles.spark2,
            i === 3 && styles.spark3,
            {
              opacity: sparkle.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: i % 2 === 0 ? [0.15, 0.85, 0.2] : [0.7, 0.2, 0.75],
              }),
              transform: [
                {
                  scale: sparkle.interpolate({
                    inputRange: [0, 1],
                    outputRange: i % 2 === 0 ? [0.7, 1.25] : [1.1, 0.75],
                  }),
                },
              ],
            },
          ]}
        />
      ))}

      {/* Matki / butter pot */}
      <Animated.View
        style={[
          styles.potWrap,
          {
            transform: [
              {
                translateY: potBob.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -6],
                }),
              },
              {
                rotate: potBob.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["-4deg", "4deg"],
                }),
              },
            ],
          },
        ]}
      >
        <View style={[styles.pot, { backgroundColor: palette.accent }]}>
          <View style={styles.potLid} />
          <View style={styles.potBody} />
        </View>
      </Animated.View>

      {/* Flute */}
      <Animated.Image
        source={assets.fluteWood}
        style={[
          styles.flute,
          {
            transform: [
              {
                rotate: fluteSway.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["-24deg", "-12deg"],
                }),
              },
              {
                translateX: fluteSway.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 5],
                }),
              },
            ],
          },
        ]}
      />

      {/* Diya + glow */}
      <Animated.View
        style={[
          styles.diyaWrap,
          {
            transform: [
              {
                translateY: diyaGlow.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -4],
                }),
              },
            ],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.diyaGlow,
            {
              opacity: diyaGlow.interpolate({
                inputRange: [0, 1],
                outputRange: [0.22, 0.78],
              }),
              transform: [
                {
                  scale: diyaGlow.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1.28],
                  }),
                },
              ],
            },
          ]}
        />
        <Image source={assets.diya} style={styles.diya} resizeMode="cover" />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    aspectRatio: 1,
    maxWidth: 248,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  halo: {
    position: "absolute",
    width: "80%",
    height: "80%",
    borderRadius: 999,
    top: "10%",
  },
  goldRing: {
    position: "absolute",
    width: "74%",
    height: "74%",
    borderRadius: 999,
    borderWidth: 1.5,
    borderStyle: "dashed",
    top: "13%",
    zIndex: 1,
  },
  ringDot: {
    position: "absolute",
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#F8CB46",
  },
  ringDotA: { top: -3, left: "46%" },
  ringDotB: { bottom: 10, left: 4 },
  ringDotC: { top: "40%", right: -2 },
  krishnaWrap: {
    width: "64%",
    aspectRatio: 0.82,
    zIndex: 5,
  },
  krishnaRing: {
    flex: 1,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 2.5,
    borderColor: "rgba(248,203,70,0.9)",
    backgroundColor: "#2C1A4D",
    ...Platform.select({
      ios: {
        shadowColor: "#5B2C8A",
        shadowOpacity: 0.28,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 7 },
      },
      android: { elevation: 7 },
    }),
  },
  krishna: {
    width: "100%",
    height: "100%",
  },
  feather: {
    position: "absolute",
    width: 56,
    height: 82,
    borderRadius: 14,
    opacity: 0.9,
    zIndex: 3,
  },
  featherL: {
    left: 0,
    top: "10%",
  },
  featherR: {
    right: -2,
    top: "16%",
  },
  flute: {
    position: "absolute",
    width: 96,
    height: 24,
    borderRadius: 8,
    bottom: "27%",
    left: "4%",
    opacity: 0.92,
    zIndex: 6,
  },
  potWrap: {
    position: "absolute",
    left: 6,
    bottom: "9%",
    zIndex: 4,
  },
  pot: {
    width: 38,
    height: 42,
    borderRadius: 19,
    alignItems: "center",
    paddingTop: 4,
  },
  potLid: {
    width: 24,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFF8E1",
    marginBottom: 2,
  },
  potBody: {
    width: 28,
    height: 24,
    borderRadius: 14,
    backgroundColor: "#F9A825",
  },
  diyaWrap: {
    position: "absolute",
    right: 4,
    bottom: "7%",
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 6,
  },
  diyaGlow: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFECB3",
  },
  diya: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },
  petal: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 15,
    zIndex: 2,
  },
  petalA: {
    top: "5%",
    left: "20%",
  },
  petalB: {
    top: "3%",
    right: "16%",
  },
  petalC: {
    top: "18%",
    left: "8%",
  },
  spark: {
    position: "absolute",
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#FFF8E1",
    zIndex: 7,
  },
  spark0: { top: "22%", left: "28%" },
  spark1: { top: "30%", right: "24%" },
  spark2: { top: "48%", left: "18%" },
  spark3: { top: "42%", right: "14%" },
});
