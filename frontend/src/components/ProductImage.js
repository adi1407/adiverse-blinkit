import { useState } from "react";
import { View, Image, StyleSheet, ActivityIndicator } from "react-native";
import { Package } from "../utils/lucideIcons";
import { colors } from "../theme/colors";

export default function ProductImage({ uri, style, iconSize = 28 }) {
  const [failed, setFailed] = useState(!uri);
  const [loading, setLoading] = useState(!!uri);

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
        <ActivityIndicator
          style={styles.loader}
          color={colors.accent}
          size="small"
        />
      ) : null}
      <Image
        source={{ uri }}
        style={styles.image}
        resizeMode="cover"
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
    backgroundColor: colors.surface,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  loader: {
    position: "absolute",
    zIndex: 1,
    alignSelf: "center",
    top: "40%",
  },
  fallback: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
  },
});
