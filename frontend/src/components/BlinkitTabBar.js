import { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import {
  House,
  LayoutGrid,
  Printer,
  RotateCcw,
} from "../utils/lucideIcons";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";
import { hapticLight } from "../utils/haptics";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";

/**
 * Route → tab presentation. Override via options.tabBarLabel / tabBarBadge.
 */
const TAB_META = {
  Home: { label: "Home", Icon: House, fillWhenActive: true },
  Categories: { label: "Categories", Icon: LayoutGrid },
  OrderAgain: { label: "Reorder", Icon: RotateCcw },
  Print: { label: "Print", Icon: Printer, badge: "NEW" },
};

/** Chrome height above safe-area — FloatingCartBar sits above this. */
export const TAB_BAR_BASE_HEIGHT = 64;

function TabItem({ meta, focused, onPress, onLayout, reduceMotion }) {
  const press = useRef(new Animated.Value(1)).current;
  const focus = useRef(new Animated.Value(focused ? 1 : 0)).current;
  const Icon = meta.Icon || House;

  useEffect(() => {
    Animated.spring(focus, {
      toValue: focused ? 1 : 0,
      friction: 8,
      tension: 160,
      useNativeDriver: true,
    }).start();
  }, [focused, focus]);

  function handlePress() {
    hapticLight();
    if (!reduceMotion) {
      Animated.sequence([
        Animated.timing(press, {
          toValue: 0.9,
          duration: 70,
          useNativeDriver: true,
        }),
        Animated.spring(press, {
          toValue: 1,
          friction: 4,
          tension: 260,
          useNativeDriver: true,
        }),
      ]).start();
    }
    onPress();
  }

  const iconColor = focused ? colors.text : "#8A8A8A";

  return (
    <Pressable
      onPress={handlePress}
      onLayout={onLayout}
      style={styles.tab}
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={
        meta.badge ? `${meta.label}, ${meta.badge}` : meta.label
      }
    >
      <Animated.View style={[styles.tabInner, { transform: [{ scale: press }] }]}>
        <View style={styles.iconWrap}>
          <Animated.View
            style={[
              styles.iconPlate,
              {
                opacity: focus,
                transform: [
                  {
                    scale: focus.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.65, 1],
                    }),
                  },
                ],
              },
            ]}
          />
          <Icon
            size={focused ? 22 : 21}
            color={iconColor}
            strokeWidth={focused ? 2.5 : 2.05}
            fill={focused && meta.fillWhenActive ? iconColor : "transparent"}
          />
          {meta.badge ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{meta.badge}</Text>
            </View>
          ) : null}
        </View>

        <Text
          style={[styles.label, focused ? styles.labelActive : styles.labelIdle]}
          numberOfLines={1}
        >
          {meta.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export default function BlinkitTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const reduceMotion = usePrefersReducedMotion();
  const bottomPad = Math.max(insets.bottom, Platform.OS === "android" ? 8 : 6);

  const layouts = useRef({});
  const [measured, setMeasured] = useState(false);
  const indicatorX = useRef(new Animated.Value(0)).current;
  const indicatorW = useRef(new Animated.Value(0)).current;
  const enter = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current;

  const tabs = useMemo(
    () =>
      state.routes.map((route) => {
        const options = descriptors[route.key]?.options || {};
        const base = TAB_META[route.name] || {
          label: route.name,
          Icon: House,
        };
        return {
          ...base,
          name: route.name,
          key: route.key,
          label: options.tabBarLabel || base.label,
          badge:
            options.tabBarBadge != null
              ? String(options.tabBarBadge)
              : base.badge,
        };
      }),
    [state.routes, descriptors]
  );

  useEffect(() => {
    if (reduceMotion) {
      enter.setValue(1);
      return;
    }
    Animated.spring(enter, {
      toValue: 1,
      friction: 8,
      tension: 70,
      useNativeDriver: true,
    }).start();
  }, [enter, reduceMotion]);

  useEffect(() => {
    const layout = layouts.current[state.index];
    if (!layout) return;

    Animated.parallel([
      Animated.spring(indicatorX, {
        toValue: layout.x + layout.width * 0.16,
        friction: 9,
        tension: 140,
        useNativeDriver: false,
      }),
      Animated.spring(indicatorW, {
        toValue: layout.width * 0.68,
        friction: 9,
        tension: 140,
        useNativeDriver: false,
      }),
    ]).start();
  }, [state.index, measured, indicatorX, indicatorW]);

  function onTabLayout(index, e) {
    const { x, width } = e.nativeEvent.layout;
    layouts.current[index] = { x, width };
    if (Object.keys(layouts.current).length < state.routes.length) return;

    if (!measured) {
      setMeasured(true);
      const cur = layouts.current[state.index];
      if (cur) {
        indicatorX.setValue(cur.x + cur.width * 0.16);
        indicatorW.setValue(cur.width * 0.68);
      }
    }
  }

  return (
    <Animated.View
      style={[
        styles.root,
        {
          paddingBottom: bottomPad,
          opacity: enter,
          transform: [
            {
              translateY: enter.interpolate({
                inputRange: [0, 1],
                outputRange: [16, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.bar}>
        <BlurView
          intensity={Platform.OS === "ios" ? 70 : 100}
          tint="light"
          style={StyleSheet.absoluteFill}
          {...(Platform.OS === "android"
            ? { experimentalBlurMethod: "dimezisBlurView" }
            : null)}
        />
        <View style={styles.glassFill} />
        <View style={styles.glassTopShine} />
        <View style={styles.topHairline} />

        <View style={styles.row}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.slider,
              {
                width: indicatorW,
                transform: [{ translateX: indicatorX }],
              },
            ]}
          />

          {tabs.map((meta, index) => {
            const focused = state.index === index;
            return (
              <TabItem
                key={meta.key}
                meta={meta}
                focused={focused}
                reduceMotion={reduceMotion}
                onLayout={(e) => onTabLayout(index, e)}
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
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
  },
  bar: {
    minHeight: TAB_BAR_BASE_HEIGHT,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.78)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.9)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: -4 },
      },
      android: {
        elevation: 22,
      },
    }),
  },
  glassFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 252, 246, 0.5)",
  },
  glassTopShine: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 16,
    backgroundColor: "rgba(255,255,255,0.45)",
  },
  topHairline: {
    position: "absolute",
    left: 28,
    right: 28,
    top: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(248, 203, 70, 0.5)",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: TAB_BAR_BASE_HEIGHT,
    paddingHorizontal: 4,
    paddingTop: 4,
    position: "relative",
  },
  slider: {
    position: "absolute",
    top: 8,
    height: 38,
    borderRadius: 14,
    backgroundColor: "rgba(248, 203, 70, 0.18)",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    zIndex: 1,
  },
  tabInner: {
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    minWidth: 60,
  },
  iconWrap: {
    width: 42,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  iconPlate: {
    position: "absolute",
    width: 42,
    height: 30,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  label: {
    fontSize: 10,
    letterSpacing: 0.12,
    textAlign: "center",
  },
  labelIdle: {
    color: "#8A8A8A",
    fontFamily: fonts.semiBold,
  },
  labelActive: {
    color: colors.text,
    fontFamily: fonts.extraBold,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -12,
    backgroundColor: colors.danger,
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderWidth: 1.5,
    borderColor: "#FFF",
  },
  badgeText: {
    color: "#FFF",
    fontSize: 7,
    fontFamily: fonts.extraBold,
    letterSpacing: 0.3,
  },
});
