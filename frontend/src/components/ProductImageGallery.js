import { Dimensions, FlatList, Pressable, StyleSheet, View } from "react-native";
import { useRef, useState } from "react";
import ProductImage from "./ProductImage";
import { colors, spacing, radii } from "../theme/colors";

const SCREEN_W = Dimensions.get("window").width;
const HERO_H = 260;

/**
 * Swipeable product image gallery (2–3 images) with thumbnail strip.
 */
export default function ProductImageGallery({
  images = [],
  fallbackUri,
  discountPct = 0,
  badge,
}) {
  const list = (images?.length ? images : fallbackUri ? [fallbackUri] : []).filter(
    Boolean
  );
  const [index, setIndex] = useState(0);
  const listRef = useRef(null);

  if (!list.length) {
    return (
      <View style={[styles.hero, styles.heroEmpty]}>
        <ProductImage uri={null} style={styles.heroImage} iconSize={56} />
      </View>
    );
  }

  function goTo(i) {
    const next = Math.max(0, Math.min(list.length - 1, i));
    setIndex(next);
    listRef.current?.scrollToIndex({ index: next, animated: true });
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.hero}>
        {discountPct > 0 ? (
          <View style={styles.discountBadge}>
            {badge}
          </View>
        ) : null}

        <FlatList
          ref={listRef}
          data={list}
          keyExtractor={(uri, i) => `${i}-${uri.slice(-24)}`}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const i = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
            setIndex(i);
          }}
          getItemLayout={(_, i) => ({
            length: SCREEN_W,
            offset: SCREEN_W * i,
            index: i,
          })}
          renderItem={({ item }) => (
            <View style={{ width: SCREEN_W }}>
              <ProductImage uri={item} style={styles.heroImage} iconSize={56} />
            </View>
          )}
        />

        {list.length > 1 ? (
          <View style={styles.dots}>
            {list.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === index && styles.dotOn]}
              />
            ))}
          </View>
        ) : null}
      </View>

      {list.length > 1 ? (
        <View style={styles.thumbs}>
          {list.map((uri, i) => (
            <Pressable
              key={`${i}-thumb`}
              onPress={() => goTo(i)}
              style={[styles.thumb, i === index && styles.thumbOn]}
            >
              <ProductImage uri={uri} style={styles.thumbImg} iconSize={16} />
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.md,
  },
  hero: {
    height: HERO_H,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    overflow: "hidden",
    marginHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroEmpty: {
    alignItems: "center",
    justifyContent: "center",
  },
  heroImage: {
    width: "100%",
    height: HERO_H,
  },
  discountBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    zIndex: 2,
    backgroundColor: "#2563EB",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dots: {
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  dotOn: {
    backgroundColor: colors.accent,
    width: 16,
  },
  thumbs: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  thumbOn: {
    borderColor: colors.accent,
  },
  thumbImg: {
    width: "100%",
    height: "100%",
  },
});
