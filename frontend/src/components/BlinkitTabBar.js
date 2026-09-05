import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  House,
  LayoutGrid,
  Printer,
  RotateCcw,
  Zap,
} from "../utils/lucideIcons";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";
import { hapticLight } from "../utils/haptics";

const TABS = [
  {
    name: "Home",
    label: "Home",
    Icon: House,
    fillWhenActive: true,
  },
  {
    name: "OrderAgain",
    label: "Reorder",
    Icon: RotateCcw,
  },
  {
    name: "Categories",
    label: "Categories",
    Icon: LayoutGrid,
  },
  {
    name: "Print",
    label: "Print",
    Icon: Printer,
    badge: "NEW",
  },
];

/** Dock + ETA chip height (safe-area added separately by FloatingCartBar). */
export const TAB_BAR_BASE_HEIGHT = 88;

const DOCK_H = 62;

function TabItem({ meta, focused, onPress, onLayout, badgePulse }) {
  const scale = useRef(new Animated.Value(1)).current;
  const labelOp = useRef(new Animated.Value(focused ? 1 : 0.65)).current;
  const Icon = meta.Icon || House;

  useEffect(() => {
    Animated.timing(labelOp, {
      toValue: focused ? 1 : 0.65,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [focused, labelOp]);

  function handlePress() {
    hapticLight();
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.86,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 3,
        tension: 220,
        useNativeDriver: true,
      }),
    ]).start();
    onPress();
  }

  const iconColor = focused ? colors.text : "#8E8E8E";

  return (
    <Pressable
      onPress={handlePress}
      onLayout={onLayout}
      style={styles.item}
      accessibilityRole="button"
      accessibilityState={focused ? { selected: true } : {}}
      accessibilityLabel={meta.label}
    >
      <Animated.View style={[styles.iconSlot, { transform: [{ scale }] }]}>
        <Icon
          size={focused ? 22 : 20}
          color={iconColor}
          strokeWidth={focused ? 2.5 : 2}
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
                      outputRange: [1, 1.12],
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
          { opacity: labelOp },
        ]}
        numberOfLines={1}
      >
        {meta.label}
      </Animated.Text>
    </Pressable>
  );
}

export default function BlinkitTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, Platform.OS === "android" ? 8 : 6);

  const layouts = useRef({});
  const [ready, setReady] = useState(false);
  const indicatorX = useRef(new Animated.Value(0)).current;
  const indicatorW = useRef(new Animated.Value(56)).current;
  const dockLift = useRef(new Animated.Value(0)).current;
  const badgePulse = useRef(new Animated.Value(0)).current;
  const etaBob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const layout = layouts.current[state.index];
    if (!layout) return;

    Animated.parallel([
      Animated.spring(indicatorX, {
        toValue: layout.x,
        friction: 8,
        tension: 90,
        useNativeDriver: false,
      }),
      Animated.spring(indicatorW, {
        toValue: layout.width,
        friction: 8,
        tension: 90,
        useNativeDriver: false,
      }),
    ]).start();
  }, [state.index, indicatorX, indicatorW, ready]);

  useEffect(() => {
    Animated.spring(dockLift, {
      toValue: 1,
      friction: 7,
      tension: 60,
      useNativeDriver: true,
    }).start();
  }, [dockLift]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(badgePulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(badgePulse, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [badgePulse]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(etaBob, {
          toValue: 1,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(etaBob, {
          toValue: 0,
          duration: 1600,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [etaBob]);

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

  const activeLabel =
    TABS.find((t) => t.name === state.routes[state.index]?.name)?.label ||
    "Home";

  return (
    <View
      style={[styles.shell, { paddingBottom: bottomPad }]}
      pointerEvents="box-none"
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.etaChip,
          {
            opacity: etaBob.interpolate({
              inputRange: [0, 1],
              outputRange: [0.92, 1],
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
        <Zap size={11} color={colors.accent} fill={colors.accent} />
        <Text style={styles.etaText}>Delivering in 8 mins</Text>
        <View style={styles.etaDot} />
        <Text style={styles.etaActive}>{activeLabel}</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.dock,
          {
            transform: [
              {
                translateY: dockLift.interpolate({
                  inputRange: [0, 1],
                  outputRange: [28, 0],
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
          />

          {state.routes.map((route, index) => {
            const focused = state.index === index;
            const meta = TABS.find((t) => t.name === route.name) || {
              name: route.name,
              label: route.name,
              Icon: House,
            };

            return (
              <TabItem
                key={route.key}
                meta={meta}
                focused={focused}
                badgePulse={badgePulse}
                onLayout={(e) => storeLayout(index, e)}
                onPress={() => {
                  const event = navigation.emit({
                    type: "tabPress",
                    target: route.key,
                    canPreventDefault: true,
                  });
                  if (!focused && !event.defaultPrevented) {
                    navigation.navigate(route.name);
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
    paddingTop: 26,
    backgroundColor: "transparent",
  },
  etaChip: {
    position: "absolute",
    top: 0,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: colors.text,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    zIndex: 2,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
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
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  etaActive: {
    color: colors.primary,
    fontSize: 11,
    fontFamily: fonts.extraBold,
  },
  dock: {
    height: DOCK_H,
    borderRadius: 22,
    backgroundColor: colors.white,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.06)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.14,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 8 },
      },
      android: {
        elevation: 16,
      },
    }),
  },
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    position: "relative",
  },
  indicator: {
    position: "absolute",
    top: 7,
    bottom: 7,
    left: 0,
    borderRadius: 16,
    backgroundColor: colors.primary,
  },
  item: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    zIndex: 1,
  },
  iconSlot: {
    width: 28,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 10,
    fontFamily: fonts.semiBold,
    color: "#8E8E8E",
    textAlign: "center",
    letterSpacing: 0.1,
  },
  labelActive: {
    color: colors.text,
    fontFamily: fonts.extraBold,
  },
  badge: {
    position: "absolute",
    top: -7,
    right: -14,
    backgroundColor: colors.danger,
    borderRadius: 7,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  badgeText: {
    color: colors.white,
    fontSize: 7.5,
    fontFamily: fonts.extraBold,
    letterSpacing: 0.2,
  },
});
