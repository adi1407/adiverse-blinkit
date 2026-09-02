import { useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  Animated,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../context/CartContext";
import { colors } from "../theme/colors";

const TABS = [
  {
    name: "Home",
    label: "Home",
    icon: "home-outline",
    iconActive: "home",
    tone: "yellow",
  },
  {
    name: "OrderAgain",
    label: "Order Again",
    icon: "bag-handle-outline",
    iconActive: "bag-handle",
    tone: "green",
  },
  {
    name: "Categories",
    label: "Categories",
    icon: "grid-outline",
    iconActive: "grid",
    tone: "green",
  },
  {
    name: "Print",
    label: "Print",
    icon: "print-outline",
    iconActive: "print",
    tone: "green",
    badge: "NEW",
  },
];

export const TAB_BAR_BASE_HEIGHT = 64;
const SCREEN_W = Dimensions.get("window").width;

function TabItem({ meta, focused, onPress, cartCount }) {
  const scale = useRef(new Animated.Value(1)).current;
  const lift = useRef(new Animated.Value(0)).current;
  const pill = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(pill, {
        toValue: focused ? 1 : 0,
        friction: 6,
        tension: 120,
        useNativeDriver: false,
      }),
      Animated.spring(lift, {
        toValue: focused ? 1 : 0,
        friction: 7,
        tension: 140,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused, lift, pill]);

  const bounce = () => {
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 0.88,
        useNativeDriver: true,
        speed: 50,
        bounciness: 0,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 3,
        tension: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const pillBg = pill.interpolate({
    inputRange: [0, 1],
    outputRange:
      meta.tone === "yellow"
        ? ["rgba(248,203,70,0)", colors.primary]
        : ["rgba(12,131,31,0)", colors.accentSoft],
  });

  const pillScale = pill.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  const iconColor = focused
    ? meta.tone === "yellow"
      ? colors.text
      : colors.accent
    : "#8E8E8E";

  return (
    <Pressable
      onPress={() => {
        bounce();
        onPress();
      }}
      style={styles.item}
      accessibilityRole="button"
      accessibilityState={focused ? { selected: true } : {}}
      accessibilityLabel={meta.label}
    >
      <Animated.View
        style={[
          styles.iconMotion,
          {
            transform: [
              { scale },
              {
                translateY: lift.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -2],
                }),
              },
            ],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.iconPill,
            {
              backgroundColor: pillBg,
              transform: [{ scale: pillScale }],
            },
          ]}
        >
          <Ionicons
            name={focused ? meta.iconActive : meta.icon}
            size={focused ? 23 : 22}
            color={iconColor}
          />
        </Animated.View>

        {meta.badge && !focused ? (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>{meta.badge}</Text>
          </View>
        ) : null}

        {meta.name === "OrderAgain" && cartCount > 0 ? (
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>
              {cartCount > 9 ? "9+" : cartCount}
            </Text>
          </View>
        ) : null}
      </Animated.View>

      <Text
        style={[styles.label, focused && styles.labelActive]}
        numberOfLines={1}
      >
        {meta.label}
      </Text>

      <Animated.View
        style={[
          styles.dot,
          {
            opacity: lift,
            backgroundColor:
              meta.tone === "yellow" ? colors.primaryDark : colors.accent,
            transform: [{ scale: lift }],
          },
        ]}
      />
    </Pressable>
  );
}

export default function BlinkitTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();
  const { totalItems } = useCart();
  const bottomPad = Math.max(insets.bottom, Platform.OS === "android" ? 10 : 6);
  const tabWidth = SCREEN_W / state.routes.length;

  const indicatorX = useRef(new Animated.Value(state.index * tabWidth)).current;
  const indicatorInset = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    indicatorInset.setValue(tabWidth * 0.29);
  }, [tabWidth, indicatorInset]);

  useEffect(() => {
    Animated.spring(indicatorX, {
      toValue: state.index * tabWidth,
      friction: 8,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, [state.index, tabWidth, indicatorX]);

  return (
    <View style={[styles.wrap, { paddingBottom: bottomPad }]}>
      <View style={styles.topLine} />

      <Animated.View
        pointerEvents="none"
        style={[
          styles.slider,
          {
            width: tabWidth * 0.42,
            transform: [
              {
                translateX: Animated.add(indicatorX, indicatorInset),
              },
            ],
          },
        ]}
      />

      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const meta = TABS.find((t) => t.name === route.name) || {
            name: route.name,
            label: route.name,
            icon: "ellipse-outline",
            iconActive: "ellipse",
            tone: "green",
          };

          return (
            <TabItem
              key={route.key}
              meta={meta}
              focused={focused}
              cartCount={totalItems}
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: "#FFFFFF",
    paddingTop: 8,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: -4 },
      },
      android: {
        elevation: 18,
      },
    }),
  },
  topLine: {
    position: "absolute",
    top: 0,
    left: 24,
    right: 24,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#ECECEC",
  },
  slider: {
    position: "absolute",
    top: 4,
    height: 3,
    borderRadius: 99,
    backgroundColor: colors.primary,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    minHeight: TAB_BAR_BASE_HEIGHT - 8,
    paddingHorizontal: 2,
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 2,
    paddingBottom: 2,
  },
  iconMotion: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  iconPill: {
    width: 48,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 10,
    fontWeight: "600",
    color: "#8E8E8E",
    textAlign: "center",
    letterSpacing: 0.1,
  },
  labelActive: {
    color: colors.text,
    fontWeight: "800",
  },
  dot: {
    marginTop: 3,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  newBadge: {
    position: "absolute",
    top: -4,
    right: -10,
    backgroundColor: colors.danger,
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  newBadgeText: {
    color: colors.white,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.3,
  },
  countBadge: {
    position: "absolute",
    top: -3,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  countBadgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: "800",
  },
});
