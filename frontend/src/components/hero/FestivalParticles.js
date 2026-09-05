import { useEffect, useMemo, useRef } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";

/**
 * Soft ambient particles — opacity/transform only, paused for reduced motion.
 */
export default function FestivalParticles({ color = "rgba(0,0,0,0.2)", count = 8 }) {
  const reduceMotion = usePrefersReducedMotion();
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: 8 + ((i * 17) % 84),
        top: 10 + ((i * 23) % 70),
        size: 3 + (i % 3),
        delay: i * 180,
        duration: 3200 + (i % 4) * 400,
      })),
    [count]
  );

  if (reduceMotion) {
    return (
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {seeds.slice(0, 4).map((p) => (
          <View
            key={p.id}
            style={[
              styles.dot,
              {
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: p.size,
                height: p.size,
                backgroundColor: color,
                opacity: 0.35,
              },
            ]}
          />
        ))}
      </View>
    );
  }

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {seeds.map((p) => (
        <Particle key={p.id} {...p} color={color} />
      ))}
    </View>
  );
}

function Particle({ left, top, size, delay, duration, color }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, {
          toValue: 1,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [anim, delay, duration]);

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          left: `${left}%`,
          top: `${top}%`,
          width: size,
          height: size,
          backgroundColor: color,
          opacity: anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.15, 0.55],
          }),
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -10],
              }),
            },
          ],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dot: {
    position: "absolute",
    borderRadius: 99,
  },
});
