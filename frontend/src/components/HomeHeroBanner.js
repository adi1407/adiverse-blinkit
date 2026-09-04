import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import { colors, spacing, radii, shadows } from "../theme/colors";

const W = Dimensions.get("window").width;
const CARD_W = W - spacing.lg * 2;

export default function HomeHeroBanner({ banners = [], onCta }) {
  const scrollRef = useRef(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (banners.length < 2) return undefined;
    const id = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % banners.length;
        scrollRef.current?.scrollTo({
          x: next * (CARD_W + spacing.md),
          animated: true,
        });
        return next;
      });
    }, 4200);
    return () => clearInterval(id);
  }, [banners.length]);

  if (!banners.length) return null;

  return (
    <View style={styles.wrap}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled={false}
        decelerationRate="fast"
        snapToInterval={CARD_W + spacing.md}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        onMomentumScrollEnd={(e) => {
          const x = e.nativeEvent.contentOffset.x;
          setIndex(Math.round(x / (CARD_W + spacing.md)));
        }}
      >
        {banners.map((b) => (
          <Pressable
            key={b.id}
            style={[styles.card, shadows.card]}
            onPress={() => onCta?.(b)}
          >
            <Image source={{ uri: b.image }} style={styles.image} />
            <View style={styles.scrim} />
            <View style={styles.copy}>
              <Text style={styles.title}>{b.title}</Text>
              <Text style={styles.subtitle} numberOfLines={2}>
                {b.subtitle}
              </Text>
              <View
                style={[
                  styles.cta,
                  { backgroundColor: b.accent || colors.primary },
                ]}
              >
                <Text style={styles.ctaText}>{b.cta || "Shop now"}</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
      <View style={styles.dots}>
        {banners.map((b, i) => (
          <View
            key={b.id}
            style={[styles.dot, i === index && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: spacing.md,
    backgroundColor: colors.background,
  },
  row: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  card: {
    width: CARD_W,
    height: 168,
    borderRadius: radii.lg,
    overflow: "hidden",
    backgroundColor: colors.surface,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.38)",
  },
  copy: {
    flex: 1,
    justifyContent: "flex-end",
    padding: spacing.lg,
  },
  title: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.4,
  },
  subtitle: {
    marginTop: 4,
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  },
  cta: {
    alignSelf: "flex-start",
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.pill,
  },
  ctaText: {
    color: colors.text,
    fontWeight: "900",
    fontSize: 12,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.borderStrong,
  },
  dotActive: {
    width: 16,
    backgroundColor: colors.primaryDark,
  },
});
