import { useEffect, useRef, useState } from "react";
import { View, Image, StyleSheet, Animated } from "react-native";
import { Package } from "../utils/lucideIcons";
import { colors, radii } from "../theme/colors";
import { resolveMediaUrl } from "../config/api";

export default function ProductImage({
  uri,
  style,
  iconSize = 28,
  resizeMode = "contain",
}) {
  const resolved = resolveMediaUrl(uri);
  const [failed, setFailed] = useState(!resolved);
  const [loading, setLoading] = useState(!!resolved);
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setFailed(!resolved);
    setLoading(!!resolved);
  }, [resolved]);

  useEffect(() => {
    if (!loading) return undefined;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [loading, shimmer]);

  if (failed) {
    return (
      <View style={[styles.fallback, style]}>
        <Package size={iconSize} color={colors.textMuted} strokeWidth={1.8} />
      </View>
    );
  }

  return (
    <View style={[styles.wrap, style]}>
      {loading ? (
        <Animated.View
          style={[
            styles.shimmer,
            {
              opacity: shimmer.interpolate({
                inputRange: [0, 1],
                outputRange: [0.35, 0.75],
              }),
            },
          ]}
        />
      ) : null}
      <Image
        source={{ uri: resolved }}
        style={styles.image}
        resizeMode={resizeMode}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setFailed(true);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: "hidden",
    backgroundColor: "#F5F5F5",
    borderRadius: radii.sm,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  shimmer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.surface,
    zIndex: 1,
  },
  fallback: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.sm,
  },
});
