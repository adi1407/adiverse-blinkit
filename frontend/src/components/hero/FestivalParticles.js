import { useEffect, useMemo, useRef } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";

/**
 * Soft ambient particles — richer for festive themes.
 */
export default function FestivalParticles({
  color = "rgba(0,0,0,0.2)",
  count = 8,
  festive = false,
}) {
  const reduceMotion = usePrefersReducedMotion();
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: 6 + ((i * 19) % 88),
        top: 6 + ((i * 27) % 78),
        size: festive ? 3 + (i % 4) : 3 + (i % 3),
        delay: i * (festive ? 140 : 180),
        duration: (festive ? 2600 : 3200) + (i % 4) * 450,
        drift: festive ? 14 + (i % 5) * 3 : 10,
        oblong: festive && i % 3 === 0,
      })),
    [count, festive]
  );

  if (reduceMotion) {
    return (
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {seeds.slice(0, 4).map((p) => (
          <View
            key={p.id}
            style={[
              styles.dot,
              p.oblong && styles.petal,
              {
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: p.size,
                height: p.oblong ? p.size * 1.6 : p.size,
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

function Particle({ left, top, size, delay, duration, color, drift, oblong }) {
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
        oblong && styles.petal,
        {
          left: `${left}%`,
          top: `${top}%`,
          width: size,
          height: oblong ? size * 1.7 : size,
          backgroundColor: color,
          opacity: anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.12, 0.6],
          }),
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -drift],
              }),
            },
            {
              translateX: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, oblong ? 6 : 2],
              }),
            },
            {
              rotate: anim.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", oblong ? "25deg" : "8deg"],
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
  petal: {
    borderRadius: 8,
  },
});
