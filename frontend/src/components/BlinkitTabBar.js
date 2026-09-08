import { useEffect, useMemo, useRef } from "react";
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
import { TAB_ICONS } from "./tabIcons/TabIcons";
import { colors, radii } from "../theme/colors";
import { fonts } from "../theme/typography";
import { hapticLight } from "../utils/haptics";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";

const TAB_META = {
  Home: { label: "Home" },
  Categories: { label: "Categories" },
  OrderAgain: { label: "Reorder" },
  Print: { label: "Print", badge: "NEW" },
};

/** Chrome height above safe-area — FloatingCartBar sits above this. */
export const TAB_BAR_BASE_HEIGHT = 62;

function TabItem({ meta, focused, onPress, onLayout, reduceMotion }) {
  const press = useRef(new Animated.Value(1)).current;
  const pill = useRef(new Animated.Value(focused ? 1 : 0)).current;
  const Icon = TAB_ICONS[meta.name] || TAB_ICONS.Home;

  useEffect(() => {
    if (reduceMotion) {
      pill.setValue(focused ? 1 : 0);
      return undefined;
    }
    const anim = Animated.timing(pill, {
      toValue: focused ? 1 : 0,
      duration: focused ? 200 : 140,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [focused, pill, reduceMotion]);

  function handlePress() {
    hapticLight();
    if (!reduceMotion) {
      Animated.sequence([
        Animated.timing(press, {
          toValue: 0.88,
          duration: 70,
          useNativeDriver: true,
        }),
        Animated.spring(press, {
          toValue: 1,
          friction: 4,
          tension: 280,
          useNativeDriver: true,
        }),
      ]).start();
    }
    onPress();
  }

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
            pointerEvents="none"
            style={[
              styles.pill,
              {
                opacity: pill,
                transform: [
                  {
                    scale: pill.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.75, 1],
                    }),
                  },
                ],
              },
            ]}
          />
          <Icon focused={focused} size={24} reduceMotion={reduceMotion} />
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
  const bottomPad = Math.max(insets.bottom, Platform.OS === "android" ? 6 : 4);

  const enter = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current;

  const tabs = useMemo(
    () =>
      state.routes.map((route) => {
        const options = descriptors[route.key]?.options || {};
        const base = TAB_META[route.name] || { label: route.name };
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
      friction: 9,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, [enter, reduceMotion]);

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
                outputRange: [10, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.bar}>
        <View style={styles.row}>
          {tabs.map((meta, index) => {
            const focused = state.index === index;
            return (
              <TabItem
                key={meta.key}
                meta={meta}
                focused={focused}
                reduceMotion={reduceMotion}
                onLayout={() => {}}
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
    backgroundColor: "#FFFFFF",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E8E8E8",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: -2 },
      },
      android: {
        elevation: 12,
      },
    }),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: TAB_BAR_BASE_HEIGHT,
    paddingHorizontal: 2,
    paddingTop: 6,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 54,
  },
  tabInner: {
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    minWidth: 64,
  },
  iconWrap: {
    width: 44,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  pill: {
    position: "absolute",
    width: 42,
    height: 28,
    borderRadius: radii.pill,
    backgroundColor: colors.accentSoft,
  },
  label: {
    fontSize: 10,
    letterSpacing: 0.1,
    textAlign: "center",
  },
  labelIdle: {
    color: colors.textMuted,
    fontFamily: fonts.semiBold,
  },
  labelActive: {
    color: colors.accent,
    fontFamily: fonts.extraBold,
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -10,
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
