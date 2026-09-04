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
import { colors, spacing, radii } from "../theme/colors";
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
          x: next * (CARD_W + 12),
          animated: true,
        });
        return next;
      });
    }, 4500);
    return () => clearInterval(id);
  }, [banners.length]);

  useEffect(() => {
    dotAnims.forEach((anim, i) => {
      Animated.spring(anim, {
        toValue: i === index ? 1 : 0,
        friction: 8,
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
        snapToInterval={CARD_W + 12}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        onMomentumScrollEnd={(e) => {
          const x = e.nativeEvent.contentOffset.x;
          setIndex(Math.round(x / (CARD_W + 12)));
        }}
      >
        {banners.map((b) => (
          <Pressable
            key={b.id}
            style={styles.card}
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
                  outputRange: [5, 14],
                }),
                opacity: dotAnims[i]?.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.35, 1],
                }),
                backgroundColor: colors.text,
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
    paddingTop: 14,
    paddingBottom: 4,
    backgroundColor: colors.background,
  },
  row: {
    paddingHorizontal: spacing.lg,
    gap: 12,
  },
  card: {
    width: CARD_W,
    height: 168,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#EEE",
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
    height: "58%",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  copy: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 16,
  },
  title: {
    color: colors.white,
    fontSize: 20,
    fontFamily: fonts.extraBold,
    letterSpacing: -0.4,
  },
  subtitle: {
    marginTop: 3,
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    fontFamily: fonts.semiBold,
    lineHeight: 16,
  },
  cta: {
    alignSelf: "flex-start",
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  ctaText: {
    color: colors.text,
    fontFamily: fonts.extraBold,
    fontSize: 11,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
    marginTop: 10,
  },
  dot: {
    height: 5,
    borderRadius: 3,
  },
});
