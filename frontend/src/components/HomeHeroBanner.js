import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
  ScrollView,
  Animated,
} from "react-native";
import { colors, spacing, radii, shadows } from "../theme/colors";
import { fonts } from "../theme/typography";

const W = Dimensions.get("window").width;
const CARD_W = W - spacing.lg * 2;

export default function HomeHeroBanner({ banners = [], onCta }) {
  const scrollRef = useRef(null);
  const [index, setIndex] = useState(0);
  const dotAnims = useRef(
    banners.map((_, i) => new Animated.Value(i === 0 ? 1 : 0))
  ).current;

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

  useEffect(() => {
    dotAnims.forEach((anim, i) => {
      Animated.spring(anim, {
        toValue: i === index ? 1 : 0,
        friction: 7,
        useNativeDriver: false,
      }).start();
    });
  }, [index, dotAnims]);

  if (!banners.length) return null;

  return (
    <View style={styles.wrap}>
      <ScrollView
        ref={scrollRef}
        horizontal
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
          <Animated.View
            key={b.id}
            style={[
              styles.dot,
              {
                width: dotAnims[i]?.interpolate({
                  inputRange: [0, 1],
                  outputRange: [6, 16],
                }),
                backgroundColor: dotAnims[i]?.interpolate({
                  inputRange: [0, 1],
                  outputRange: [colors.borderStrong, colors.primaryDark],
                }),
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  row: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  card: {
    width: CARD_W,
    height: 210,
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
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "52%",
    backgroundColor: "rgba(0,0,0,0.42)",
  },
  copy: {
    flex: 1,
    justifyContent: "flex-end",
    padding: spacing.lg,
  },
  title: {
    color: colors.white,
    fontSize: 24,
    fontFamily: fonts.extraBold,
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 4,
    color: "rgba(255,255,255,0.92)",
    fontSize: 13,
    fontFamily: fonts.semiBold,
    lineHeight: 18,
  },
  cta: {
    alignSelf: "flex-start",
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radii.pill,
  },
  ctaText: {
    color: colors.text,
    fontFamily: fonts.extraBold,
    fontSize: 12,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 12,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});
