import { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  Animated,
  Easing,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import {
  House,
  LayoutGrid,
  Printer,
  RotateCcw,
  Zap,
} from "../utils/lucideIcons";
import { useCart } from "../context/CartContext";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";
import { hapticLight } from "../utils/haptics";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";

/** Meta keyed by route name — labels/icons/badges stay data-driven. */
const TAB_META = {
  Home: {
    label: "Home",
    Icon: House,
    fillWhenActive: true,
  },
  OrderAgain: {
    label: "Reorder",
    Icon: RotateCcw,
  },
  Categories: {
    label: "Categories",
    Icon: LayoutGrid,
  },
  Print: {
    label: "Print",
    Icon: Printer,
    badge: "NEW",
  },
};

/** Dock + ETA chip height (safe-area added separately by FloatingCartBar). */
export const TAB_BAR_BASE_HEIGHT = 92;

const DOCK_H = 64;

function TabItem({ meta, focused, onPress, onLayout, badgePulse, reduceMotion }) {
  const scale = useRef(new Animated.Value(1)).current;
  const lift = useRef(new Animated.Value(focused ? 1 : 0)).current;
  const Icon = meta.Icon || House;

  useEffect(() => {
    Animated.spring(lift, {
      toValue: focused ? 1 : 0,
      friction: 7,
      tension: 140,
      useNativeDriver: true,
    }).start();
  }, [focused, lift]);

  function handlePress() {
    hapticLight();
    if (!reduceMotion) {
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 0.88,
          duration: 70,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 4,
          tension: 240,
          useNativeDriver: true,
        }),
      ]).start();
    }
    onPress();
  }

  const iconColor = focused ? colors.text : "#7A7A7A";

  return (
    <Pressable
      onPress={handlePress}
      onLayout={onLayout}
      style={styles.item}
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={meta.label}
    >
      <Animated.View
        style={[
          styles.iconSlot,
          {
            transform: [
              { scale },
              {
                translateY: lift.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -1],
                }),
              },
            ],
          },
        ]}
      >
        <Icon
          size={focused ? 22 : 20}
          color={iconColor}
          strokeWidth={focused ? 2.55 : 2.05}
          fill={focused && meta.fillWhenActive ? iconColor : "transparent"}
        />

        {meta.badge ? (
          <Animated.View
            style={[
              styles.badge,
              {
                transform: [
                  {
                    scale: badgePulse.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.1],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.badgeText}>{meta.badge}</Text>
          </Animated.View>
        ) : null}
      </Animated.View>

      <Animated.Text
        style={[
          styles.label,
          focused && styles.labelActive,
          {
            opacity: lift.interpolate({
              inputRange: [0, 1],
              outputRange: [0.72, 1],
            }),
          },
        ]}
        numberOfLines={1}
      >
        {meta.label}
      </Animated.Text>

      <Animated.View
        style={[
          styles.activeDot,
          {
            opacity: lift,
            transform: [
              {
                scale: lift.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.4, 1],
                }),
              },
            ],
          },
        ]}
      />
    </Pressable>
  );
}

export default function BlinkitTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const reduceMotion = usePrefersReducedMotion();
  const { totalItems } = useCart();
  const bottomPad = Math.max(insets.bottom, Platform.OS === "android" ? 10 : 8);

  const layouts = useRef({});
  const [ready, setReady] = useState(false);
  const indicatorX = useRef(new Animated.Value(0)).current;
  const indicatorW = useRef(new Animated.Value(56)).current;
  const dockLift = useRef(new Animated.Value(0)).current;
  const badgePulse = useRef(new Animated.Value(0)).current;
  const etaBob = useRef(new Animated.Value(0)).current;
  const sheen = useRef(new Animated.Value(0)).current;

  const tabs = useMemo(
    () =>
      state.routes.map((route) => {
        const options = descriptors[route.key]?.options || {};
        const base = TAB_META[route.name] || {
          label: options.title || route.name,
          Icon: House,
        };
        const badge =
          options.tabBarBadge != null
            ? String(options.tabBarBadge)
            : base.badge;
        return {
          ...base,
          name: route.name,
          label: options.tabBarLabel || base.label,
          badge,
          key: route.key,
        };
      }),
    [state.routes, descriptors]
  );

  const active = tabs[state.index] || tabs[0];
  const etaMinutes = 8;
  const showEta = totalItems === 0;

  useEffect(() => {
    const layout = layouts.current[state.index];
    if (!layout) return;

    Animated.parallel([
      Animated.spring(indicatorX, {
        toValue: layout.x,
        friction: 8,
        tension: 120,
        useNativeDriver: false,
      }),
      Animated.spring(indicatorW, {
        toValue: layout.width,
        friction: 8,
        tension: 120,
        useNativeDriver: false,
      }),
    ]).start();
  }, [state.index, indicatorX, indicatorW, ready]);

  useEffect(() => {
    Animated.spring(dockLift, {
      toValue: 1,
      friction: 7,
      tension: 64,
      useNativeDriver: true,
    }).start();
  }, [dockLift]);

  useEffect(() => {
    if (reduceMotion) return undefined;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(badgePulse, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(badgePulse, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [badgePulse, reduceMotion]);

  useEffect(() => {
    if (reduceMotion || !showEta) return undefined;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(etaBob, {
          toValue: 1,
          duration: 1700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(etaBob, {
          toValue: 0,
          duration: 1700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [etaBob, reduceMotion, showEta]);

  useEffect(() => {
    if (reduceMotion) return undefined;
    const loop = Animated.loop(
      Animated.timing(sheen, {
        toValue: 1,
        duration: 4800,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      })
    );
    sheen.setValue(0);
    loop.start();
    return () => loop.stop();
  }, [sheen, reduceMotion]);

  function storeLayout(index, e) {
    const { x, width } = e.nativeEvent.layout;
    layouts.current[index] = { x, width };
    if (Object.keys(layouts.current).length >= state.routes.length) {
      setReady(true);
      if (index === state.index) {
        indicatorX.setValue(x);
        indicatorW.setValue(width);
      }
    }
  }

  return (
    <View
      style={[styles.shell, { paddingBottom: bottomPad }]}
      pointerEvents="box-none"
    >
      {showEta ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.etaChip,
            {
              opacity: etaBob.interpolate({
                inputRange: [0, 1],
                outputRange: [0.94, 1],
              }),
              transform: [
                {
                  translateY: etaBob.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -3],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.etaGlass}>
            <BlurView
              intensity={Platform.OS === "ios" ? 36 : 50}
              tint="dark"
              style={StyleSheet.absoluteFill}
              {...(Platform.OS === "android"
                ? { experimentalBlurMethod: "dimezisBlurView" }
                : null)}
            />
            <View style={styles.etaTint} />
          </View>
          <Zap size={11} color={colors.primary} fill={colors.primary} />
          <Text style={styles.etaText}>
            Delivering in {etaMinutes} mins
          </Text>
          <View style={styles.etaDot} />
          <Text style={styles.etaActive}>{active?.label || "Home"}</Text>
        </Animated.View>
      ) : null}

      <Animated.View
        style={[
          styles.dock,
          {
            transform: [
              {
                translateY: dockLift.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
              {
                scale: dockLift.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.94, 1],
                }),
              },
            ],
            opacity: dockLift,
          },
        ]}
      >
        {/* Glass layers */}
        <BlurView
          intensity={Platform.OS === "ios" ? 55 : 80}
          tint="light"
          style={StyleSheet.absoluteFill}
          {...(Platform.OS === "android"
            ? { experimentalBlurMethod: "dimezisBlurView" }
            : null)}
        />
        <View style={styles.glassTint} />
        <View style={styles.glassHighlight} />
        <View style={styles.glassEdge} />

        {!reduceMotion ? (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.dockSheen,
              {
                opacity: sheen.interpolate({
                  inputRange: [0, 0.4, 0.55, 1],
                  outputRange: [0, 0, 0.18, 0],
                }),
                transform: [
                  {
                    translateX: sheen.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-60, 280],
                    }),
                  },
                ],
              },
            ]}
          />
        ) : null}

        <View style={styles.row}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.indicator,
              {
                width: indicatorW,
                transform: [{ translateX: indicatorX }],
              },
            ]}
          >
            <View style={styles.indicatorInner} />
          </Animated.View>

          {tabs.map((meta, index) => {
            const focused = state.index === index;
            return (
              <TabItem
                key={meta.key}
                meta={meta}
                focused={focused}
                badgePulse={badgePulse}
                reduceMotion={reduceMotion}
                onLayout={(e) => storeLayout(index, e)}
                onPress={() => {
                  const event = navigation.emit({
                    type: "tabPress",
                    target: meta.key,
                    canPreventDefault: true,
                  });
                  if (!focused && !event.defaultPrevented) {
                    navigation.navigate(meta.name);
                  }
                }}
              />
            );
          })}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    paddingHorizontal: 14,
    paddingTop: 28,
    backgroundColor: "transparent",
  },
  etaChip: {
    position: "absolute",
    top: 0,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    overflow: "hidden",
    zIndex: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.18)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.22,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 5 },
      },
      android: { elevation: 8 },
    }),
  },
  etaGlass: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    borderRadius: 999,
  },
  etaTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(20,20,20,0.78)",
  },
  etaText: {
    color: colors.white,
    fontSize: 11,
    fontFamily: fonts.bold,
  },
  etaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  etaActive: {
    color: colors.primary,
    fontSize: 11,
    fontFamily: fonts.extraBold,
  },
  dock: {
    height: DOCK_H,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.65)",
    backgroundColor: "rgba(255,255,255,0.55)",
    ...Platform.select({
      ios: {
        shadowColor: "#101010",
        shadowOpacity: 0.16,
        shadowRadius: 22,
        shadowOffset: { width: 0, height: 10 },
      },
      android: {
        elevation: 18,
      },
    }),
  },
  glassTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 252, 245, 0.42)",
  },
  glassHighlight: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "45%",
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  glassEdge: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(248,203,70,0.35)",
  },
  dockSheen: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 40,
    backgroundColor: "rgba(255,255,255,0.55)",
    transform: [{ skewX: "-18deg" }],
    zIndex: 0,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
    position: "relative",
    zIndex: 1,
  },
  indicator: {
    position: "absolute",
    top: 6,
    bottom: 6,
    left: 0,
    borderRadius: 18,
    padding: 2,
  },
  indicatorInner: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: colors.primary,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.45)",
    ...Platform.select({
      ios: {
        shadowColor: "#E4B83A",
        shadowOpacity: 0.45,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      },
      android: { elevation: 2 },
    }),
  },
  item: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    zIndex: 1,
    paddingBottom: 2,
  },
  iconSlot: {
    width: 30,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 10,
    fontFamily: fonts.semiBold,
    color: "#7A7A7A",
    textAlign: "center",
    letterSpacing: 0.15,
  },
  labelActive: {
    color: colors.text,
    fontFamily: fonts.extraBold,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.text,
    marginTop: 1,
  },
  badge: {
    position: "absolute",
    top: -8,
    right: -16,
    backgroundColor: colors.danger,
    borderRadius: 7,
    paddingHorizontal: 4,
    paddingVertical: 1.5,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.95)",
  },
  badgeText: {
    color: colors.white,
    fontSize: 7.5,
    fontFamily: fonts.extraBold,
    letterSpacing: 0.25,
  },
});
