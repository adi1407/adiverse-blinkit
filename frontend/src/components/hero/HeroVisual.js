import { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import FestivalDecorations from "./FestivalDecorations";
import FestivalParticles from "./FestivalParticles";
import JanmashtamiScene from "./JanmashtamiScene";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";

/**
 * Layered visual with theme-driven scene + parallax floats.
 */
export default function HeroVisual({ theme, entrance }) {
  const reduceMotion = usePrefersReducedMotion();
  const floatA = useRef(new Animated.Value(0)).current;
  const floatB = useRef(new Animated.Value(0)).current;
  const floatC = useRef(new Animated.Value(0)).current;
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduceMotion) return undefined;

    const mk = (value, duration, delay = 0) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(value, {
            toValue: 1,
            duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );

    const a = mk(floatA, 4200);
    const b = mk(floatB, 3400, 120);
    const c = mk(floatC, 2800, 240);
    const s = mk(shimmer, 2200);
    a.start();
    b.start();
    c.start();
    s.start();
    return () => {
      a.stop();
      b.stop();
      c.stop();
      s.stop();
    };
  }, [reduceMotion, floatA, floatB, floatC, shimmer]);

  const layer = (anim, amp, rot = 1.2) =>
    reduceMotion
      ? {}
      : {
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -amp],
              }),
            },
            {
              rotate: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [`-${rot}deg`, `${rot}deg`],
              }),
            },
          ],
        };

  const isJanmashtami = theme.visualType === "janmashtami" && theme.assets;

  return (
    <Animated.View
      style={[
        styles.wrap,
        {
          opacity: entrance.interpolate({
            inputRange: [0, 0.3, 1],
            outputRange: [0, 0, 1],
          }),
          transform: [
            {
              scale: entrance.interpolate({
                inputRange: [0, 0.3, 1],
                outputRange: [0.92, 0.92, 1],
              }),
            },
          ],
        },
      ]}
      accessibilityLabel={theme.visualLabel}
    >
      {!isJanmashtami ? (
        <Animated.View style={[styles.bgLayer, layer(floatA, 5, 0.8)]}>
          <View
            style={[styles.orb, styles.orbA, { backgroundColor: theme.palette.orbA }]}
          />
          <View
            style={[styles.orb, styles.orbB, { backgroundColor: theme.palette.orbB }]}
          />
          {!reduceMotion ? (
            <Animated.View
              style={[
                styles.shimmerSweep,
                {
                  opacity: shimmer.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 0.18, 0],
                  }),
                  transform: [
                    {
                      translateX: shimmer.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-40, 60],
                      }),
                    },
                  ],
                },
              ]}
            />
          ) : null}
        </Animated.View>
      ) : null}

      <Animated.View
        style={[styles.midLayer, layer(floatB, isJanmashtami ? 3 : 7, 0.5)]}
      >
        {isJanmashtami ? (
          <JanmashtamiScene assets={theme.assets} palette={theme.palette} />
        ) : (
          <FestivalDecorations
            decorations={theme.decorations}
            palette={theme.palette}
            illustrationUri={theme.assets?.hero}
          />
        )}
      </Animated.View>

      <Animated.View
        style={[styles.fgLayer, layer(floatC, isJanmashtami ? 6 : 10, 1)]}
        pointerEvents="none"
      >
        <FestivalParticles
          color={theme.palette.particle}
          count={isJanmashtami ? 8 : theme.particleCount || 7}
          festive={isJanmashtami}
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    aspectRatio: 1,
    justifyContent: "center",
  },
  bgLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  midLayer: {
    flex: 1,
    justifyContent: "center",
  },
  fgLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  orb: {
    position: "absolute",
    borderRadius: 999,
  },
  orbA: {
    width: "72%",
    height: "72%",
    top: "4%",
    right: "-4%",
  },
  orbB: {
    width: "58%",
    height: "58%",
    bottom: "-2%",
    left: "2%",
  },
  shimmerSweep: {
    position: "absolute",
    top: "10%",
    bottom: "10%",
    width: 36,
    backgroundColor: "rgba(255,255,255,0.55)",
    transform: [{ skewX: "-18deg" }],
  },
});
