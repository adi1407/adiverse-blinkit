import { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Animated,
  useWindowDimensions,
  Easing,
} from "react-native";
import HeroContent from "./hero/HeroContent";
import HeroVisual from "./hero/HeroVisual";
import {
  ACTIVE_HERO_FESTIVAL,
  getFestivalTheme,
} from "./hero/festivalThemes";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
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
  const theme = getFestivalTheme(festivalId);

  const entrance = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current;
  const themeFade = useRef(new Animated.Value(1)).current;
  const washPulse = useRef(new Animated.Value(0)).current;
  const [displayTheme, setDisplayTheme] = useState(theme);
  const themeIdRef = useRef(theme.id);
  const isFestiveScene = displayTheme.visualType === "janmashtami";

  useEffect(() => {
    if (reduceMotion) {
      entrance.setValue(1);
      return undefined;
    }
    entrance.setValue(0);
    const anim = Animated.timing(entrance, {
      toValue: 1,
      duration: 620,
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
          duration: 2800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(washPulse, {
          toValue: 0,
          duration: 2800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [reduceMotion, isFestiveScene, washPulse]);

  useEffect(() => {
    if (theme.id === themeIdRef.current) {
      setDisplayTheme(theme);
      return undefined;
    }

    if (reduceMotion) {
      themeIdRef.current = theme.id;
      setDisplayTheme(theme);
      return undefined;
    }

    const out = Animated.timing(themeFade, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    });
    out.start(({ finished }) => {
      if (!finished) return;
      themeIdRef.current = theme.id;
      setDisplayTheme(theme);
      Animated.timing(themeFade, {
        toValue: 1,
        duration: 240,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    });
    return () => out.stop();
  }, [theme, themeFade, reduceMotion]);

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
                    outputRange: [0.55, 1],
                  })
                : 1,
              transform: isFestiveScene
                ? [
                    {
                      scale: washPulse.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.12],
                      }),
                    },
                  ]
                : undefined,
            },
          ]}
        />
        {isFestiveScene ? (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.washOrbB,
              {
                backgroundColor: palette.orbB,
                opacity: washPulse.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.35, 0.75],
                }),
                transform: [
                  {
                    scale: washPulse.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1.05, 0.92],
                    }),
                  },
                ],
              },
            ]}
          />
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
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: colors.background,
  },
  card: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.06)",
    paddingHorizontal: 16,
    paddingVertical: 18,
    minHeight: 200,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  washTop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "58%",
    opacity: 0.95,
  },
  washOrb: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    top: -40,
    right: -30,
  },
  washOrbB: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    bottom: -36,
    left: -24,
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
    maxWidth: "72%",
  },
  visualCol: {
    width: "42%",
    maxWidth: 220,
    minWidth: 150,
    alignItems: "center",
    justifyContent: "center",
  },
  visualColNarrow: {
    position: "absolute",
    right: -4,
    top: -2,
    width: 148,
    opacity: 0.98,
  },
});
