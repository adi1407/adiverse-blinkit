import { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import FestivalDecorations from "./FestivalDecorations";
import FestivalParticles from "./FestivalParticles";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";

/**
 * Layered visual with gentle float (pseudo-parallax by speed).
 */
export default function HeroVisual({ theme, entrance }) {
  const reduceMotion = usePrefersReducedMotion();
  const floatA = useRef(new Animated.Value(0)).current;
  const floatB = useRef(new Animated.Value(0)).current;
  const floatC = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduceMotion) return undefined;

    const mk = (value, duration) =>
      Animated.loop(
        Animated.sequence([
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
    const b = mk(floatB, 3400);
    const c = mk(floatC, 2800);
    a.start();
    b.start();
    c.start();
    return () => {
      a.stop();
      b.stop();
      c.stop();
    };
  }, [reduceMotion, floatA, floatB, floatC]);

  const layer = (anim, amp) =>
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
                outputRange: ["-1.2deg", "1.2deg"],
              }),
            },
          ],
        };

  return (
    <Animated.View
      style={[
        styles.wrap,
        {
          opacity: entrance.interpolate({
            inputRange: [0, 0.45, 1],
            outputRange: [0, 0, 1],
          }),
          transform: [
            {
              scale: entrance.interpolate({
                inputRange: [0, 0.45, 1],
                outputRange: [0.94, 0.94, 1],
              }),
            },
          ],
        },
      ]}
      accessibilityLabel={theme.visualLabel}
    >
      <Animated.View style={[styles.bgLayer, layer(floatA, 4)]}>
        <View
          style={[styles.orb, styles.orbA, { backgroundColor: theme.palette.orbA }]}
        />
        <View
          style={[styles.orb, styles.orbB, { backgroundColor: theme.palette.orbB }]}
        />
      </Animated.View>

      <Animated.View style={[styles.midLayer, layer(floatB, 7)]}>
        <FestivalDecorations
          decorations={theme.decorations}
          palette={theme.palette}
        />
      </Animated.View>

      <Animated.View style={[styles.fgLayer, layer(floatC, 9)]} pointerEvents="none">
        <FestivalParticles color={theme.palette.particle} count={7} />
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
    width: "70%",
    height: "70%",
    top: "5%",
    right: "0%",
  },
  orbB: {
    width: "55%",
    height: "55%",
    bottom: "0%",
    left: "5%",
  },
});
