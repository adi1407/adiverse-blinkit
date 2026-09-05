import { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Animated,
  useWindowDimensions,
  Easing,
  Platform,
} from "react-native";
import HeroContent from "./hero/HeroContent";
import HeroVisual from "./hero/HeroVisual";
import {
  ACTIVE_HERO_FESTIVAL,
  getFestivalTheme,
  mergeFestivalFromApi,
} from "./hero/festivalThemes";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import { fetchActiveFestival } from "../api/catalogApi";
import { colors, spacing } from "../theme/colors";

/**
 * Premium festival-aware homepage hero.
 * Preserves prior CTA contract: onCta(banner) using API banners when present.
 */
export default function HomeHeroBanner({
  banners = [],
  onCta,
  festivalId = ACTIVE_HERO_FESTIVAL,
}) {
  const { width } = useWindowDimensions();
  const isNarrow = width < 400;
  const reduceMotion = usePrefersReducedMotion();
  const [festivalIdLive, setFestivalIdLive] = useState(festivalId);
  const localTheme = getFestivalTheme(festivalIdLive);

  const entrance = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current;
  const themeFade = useRef(new Animated.Value(1)).current;
  const washPulse = useRef(new Animated.Value(0)).current;
  const sheen = useRef(new Animated.Value(0)).current;
  const [displayTheme, setDisplayTheme] = useState(localTheme);
  const themeIdRef = useRef(localTheme.id);
  const isFestiveScene = displayTheme.visualType === "janmashtami";

  useEffect(() => {
    let cancelled = false;
    fetchActiveFestival()
      .then((data) => {
        if (cancelled) return;
        const merged = mergeFestivalFromApi(data);
        setFestivalIdLive(merged.id);
        themeIdRef.current = merged.id;
        setDisplayTheme(merged);
      })
      .catch(() => {
        /* keep local theme fallback */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      entrance.setValue(1);
      return undefined;
    }
    entrance.setValue(0);
    const anim = Animated.timing(entrance, {
      toValue: 1,
      duration: 680,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [entrance, reduceMotion]);

  useEffect(() => {
    if (reduceMotion || !isFestiveScene) {
      washPulse.setValue(0);
      return undefined;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(washPulse, {
          toValue: 1,
          duration: 3400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(washPulse, {
          toValue: 0,
          duration: 3400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [reduceMotion, isFestiveScene, washPulse]);

  useEffect(() => {
    if (reduceMotion || !isFestiveScene) return undefined;
    const loop = Animated.loop(
      Animated.timing(sheen, {
        toValue: 1,
        duration: 4200,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      })
    );
    sheen.setValue(0);
    loop.start();
    return () => loop.stop();
  }, [reduceMotion, isFestiveScene, sheen]);

  useEffect(() => {
    // Prop-driven fallback only when API has not set a different theme id yet
    if (festivalId === themeIdRef.current) return undefined;
    if (festivalId === festivalIdLive) return undefined;

    const next = getFestivalTheme(festivalId);
    if (reduceMotion) {
      themeIdRef.current = next.id;
      setFestivalIdLive(next.id);
      setDisplayTheme(next);
      return undefined;
    }

    const out = Animated.timing(themeFade, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    });
    out.start(({ finished }) => {
      if (!finished) return;
      themeIdRef.current = next.id;
      setFestivalIdLive(next.id);
      setDisplayTheme(next);
      Animated.timing(themeFade, {
        toValue: 1,
        duration: 240,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    });
    return () => out.stop();
  }, [festivalId, festivalIdLive, themeFade, reduceMotion]);

  const primaryBanner = banners[0];
  const secondaryBanner = banners[1];

  function handlePrimary() {
    if (primaryBanner) onCta?.(primaryBanner);
    else onCta?.({ hub: "gifting", id: "hero-primary" });
  }

  function handleSecondary() {
    if (secondaryBanner) onCta?.(secondaryBanner);
    else onCta?.({ hub: "all", id: "hero-secondary" });
  }

  const palette = displayTheme.palette;

  return (
    <View style={styles.wrap}>
      <Animated.View
        style={[
          styles.card,
          isFestiveScene && styles.cardFestive,
          {
            backgroundColor: palette.bgBottom,
            opacity: themeFade,
          },
        ]}
      >
        <View
          pointerEvents="none"
          style={[styles.washTop, { backgroundColor: palette.bgTop }]}
        />
        <Animated.View
          pointerEvents="none"
          style={[
            styles.washOrb,
            {
              backgroundColor: palette.orbA,
              opacity: isFestiveScene
                ? washPulse.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.45, 0.95],
                  })
                : 1,
              transform: isFestiveScene
                ? [
                    {
                      scale: washPulse.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.1],
                      }),
                    },
                  ]
                : undefined,
            },
          ]}
        />
        {isFestiveScene ? (
          <>
            <Animated.View
              pointerEvents="none"
              style={[
                styles.washOrbB,
                {
                  backgroundColor: palette.orbB,
                  opacity: washPulse.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3, 0.7],
                  }),
                  transform: [
                    {
                      scale: washPulse.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1.04, 0.94],
                      }),
                    },
                  ],
                },
              ]}
            />
            <Animated.View
              pointerEvents="none"
              style={[
                styles.cardSheen,
                {
                  opacity: sheen.interpolate({
                    inputRange: [0, 0.4, 0.55, 1],
                    outputRange: [0, 0, 0.2, 0],
                  }),
                  transform: [
                    {
                      translateX: sheen.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-80, 220],
                      }),
                    },
                  ],
                },
              ]}
            />
          </>
        ) : null}

        <View style={styles.row}>
          <View style={[styles.copyCol, isNarrow && styles.copyColNarrow]}>
            <HeroContent
              theme={displayTheme}
              entrance={entrance}
              onPrimary={handlePrimary}
              onSecondary={handleSecondary}
            />
          </View>

          <View
            style={[styles.visualCol, isNarrow && styles.visualColNarrow]}
            pointerEvents="none"
          >
            <HeroVisual theme={displayTheme} entrance={entrance} />
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.lg,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: colors.background,
  },
  card: {
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.06)",
    paddingHorizontal: 16,
    paddingVertical: 18,
    minHeight: 208,
    ...Platform.select({
      ios: {
        shadowColor: "#2C1A4D",
        shadowOpacity: 0.08,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 3 },
    }),
  },
  cardFestive: {
    borderColor: "rgba(123, 63, 190, 0.12)",
    minHeight: 220,
  },
  cardSheen: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 48,
    backgroundColor: "rgba(255,255,255,0.55)",
    transform: [{ skewX: "-18deg" }],
  },
  washTop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "62%",
    opacity: 0.96,
  },
  washOrb: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    top: -48,
    right: -36,
  },
  washOrbB: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    bottom: -40,
    left: -28,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  copyCol: {
    flex: 1,
    zIndex: 2,
    paddingRight: 8,
  },
  copyColNarrow: {
    paddingRight: 0,
    maxWidth: "70%",
  },
  visualCol: {
    width: "44%",
    maxWidth: 228,
    minWidth: 154,
    alignItems: "center",
    justifyContent: "center",
  },
  visualColNarrow: {
    position: "absolute",
    right: -2,
    top: 0,
    width: 152,
    opacity: 1,
  },
});
