import { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Animated,
  Platform,
} from "react-native";
import { getLucideIcon } from "../utils/icons";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";

function formatLabel(name) {
  return String(name || "")
    .replace(/\s*&\s*/g, " &\n")
    .trim();
}

/**
 * Shared category tile — pressable, accessible, festival-aware accent.
 */
export default function CategoryCard({
  category,
  onPress,
  selected = false,
  festivalAccent = false,
  accentLabel = "Festive",
  index = 0,
  animateEnter = false,
  width = "23%",
}) {
  const reduceMotion = usePrefersReducedMotion();
  const enter = useRef(new Animated.Value(animateEnter && !reduceMotion ? 0 : 1)).current;
  const press = useRef(new Animated.Value(1)).current;
  const imgScale = useRef(new Animated.Value(1)).current;
  const Icon = getLucideIcon(category?.icon);

  useEffect(() => {
    if (!animateEnter || reduceMotion) {
      enter.setValue(1);
      return undefined;
    }
    const anim = Animated.timing(enter, {
      toValue: 1,
      duration: 280,
      delay: Math.min(index, 7) * 35,
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [animateEnter, enter, index, reduceMotion]);

  function onPressIn() {
    if (reduceMotion) return;
    Animated.parallel([
      Animated.timing(press, {
        toValue: 0.96,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(imgScale, {
        toValue: 1.04,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  }

  function onPressOut() {
    if (reduceMotion) {
      press.setValue(1);
      imgScale.setValue(1);
      return;
    }
    Animated.parallel([
      Animated.spring(press, {
        toValue: 1,
        friction: 5,
        tension: 200,
        useNativeDriver: true,
      }),
      Animated.timing(imgScale, {
        toValue: 1,
        duration: 140,
        useNativeDriver: true,
      }),
    ]).start();
  }

  const label = formatLabel(category?.name);
  const a11yName = String(category?.name || "Category").replace(/\n/g, " ");

  return (
    <Animated.View
      style={[
        styles.item,
        { width },
        {
          opacity: enter,
          transform: [
            {
              translateY: enter.interpolate({
                inputRange: [0, 1],
                outputRange: [12, 0],
              }),
            },
            { scale: press },
          ],
        },
      ]}
    >
      <Pressable
        onPress={() => onPress?.(category)}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessibilityRole="button"
        accessibilityLabel={a11yName}
        accessibilityState={{ selected }}
        accessibilityHint="Opens this category"
        style={({ pressed, hovered }) => [
          styles.hit,
          (hovered || pressed) && !reduceMotion && styles.hitLifted,
          selected && styles.hitSelected,
        ]}
      >
        <View
          style={[
            styles.tile,
            { backgroundColor: category?.bg || "#F5F5F5" },
            selected && styles.tileSelected,
            festivalAccent && styles.tileFestive,
          ]}
        >
          {category?.image ? (
            <Animated.View
              style={[styles.imageClip, { transform: [{ scale: imgScale }] }]}
            >
              <Image
                source={{ uri: category.image }}
                style={styles.tileImage}
                resizeMode="cover"
                accessibilityIgnoresInvertColors
              />
            </Animated.View>
          ) : (
            <View style={styles.iconCircle}>
              <Icon
                size={26}
                color={category?.color || colors.accent}
                strokeWidth={2.1}
              />
            </View>
          )}

          {festivalAccent ? (
            <View style={styles.festiveDot} accessibilityElementsHidden>
              <View style={styles.festiveDotInner} />
            </View>
          ) : null}

          {selected ? <View style={styles.selectedBar} /> : null}
        </View>

        <Text
          style={[styles.name, selected && styles.nameSelected]}
          numberOfLines={2}
        >
          {label}
        </Text>
        {festivalAccent ? (
          <Text style={styles.accentCaption} numberOfLines={1}>
            {accentLabel}
          </Text>
        ) : null}
      </Pressable>
    </Animated.View>
  );
}

export function CategoryCardSkeleton({ width = "23%" }) {
  const shimmer = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 0.85,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [shimmer]);

  return (
    <View style={[styles.item, { width }]}>
      <Animated.View style={[styles.skelTile, { opacity: shimmer }]} />
      <Animated.View style={[styles.skelLabel, { opacity: shimmer }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    marginBottom: 14,
    alignItems: "center",
  },
  hit: {
    width: "100%",
    alignItems: "center",
    borderRadius: 14,
    paddingBottom: 2,
  },
  hitLifted: {
    transform: [{ translateY: -3 }, { scale: 1.02 }],
  },
  hitSelected: {
    backgroundColor: "rgba(12,131,31,0.04)",
  },
  tile: {
    width: "100%",
    aspectRatio: 0.92,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.05)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  tileSelected: {
    borderWidth: 1.5,
    borderColor: colors.accent,
  },
  tileFestive: {
    borderColor: "rgba(123, 63, 190, 0.28)",
  },
  imageClip: {
    width: "100%",
    height: "100%",
  },
  tileImage: {
    width: "100%",
    height: "100%",
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.75)",
    alignItems: "center",
    justifyContent: "center",
  },
  festiveDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
  festiveDotInner: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#7B3FBE",
  },
  selectedBar: {
    position: "absolute",
    left: 0,
    top: 10,
    bottom: 10,
    width: 3,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
    backgroundColor: colors.accent,
  },
  name: {
    fontSize: 11,
    textAlign: "center",
    color: colors.text,
    lineHeight: 14,
    fontFamily: fonts.semiBold,
    minHeight: 28,
    paddingHorizontal: 2,
  },
  nameSelected: {
    fontFamily: fonts.extraBold,
    color: colors.accentDark,
  },
  accentCaption: {
    marginTop: -4,
    fontSize: 9,
    fontFamily: fonts.bold,
    color: "#7B3FBE",
    letterSpacing: 0.2,
  },
  skelTile: {
    width: "100%",
    aspectRatio: 0.92,
    borderRadius: 14,
    backgroundColor: "#E8E8E8",
    marginBottom: 6,
  },
  skelLabel: {
    width: "70%",
    height: 10,
    borderRadius: 4,
    backgroundColor: "#E8E8E8",
    marginTop: 4,
  },
});
