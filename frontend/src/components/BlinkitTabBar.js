import { useEffect, useRef } from "react";
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
} from "../utils/lucideIcons";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";

const TABS = [
  {
    name: "Home",
    label: "Home",
    Icon: House,
    fillWhenActive: true,
  },
  {
    name: "OrderAgain",
    label: "Order Again",
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

export const TAB_BAR_BASE_HEIGHT = 64;

function TabItem({ meta, focused, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const lift = useRef(new Animated.Value(0)).current;
  const pill = useRef(new Animated.Value(focused ? 1 : 0)).current;
  const Icon = meta.Icon || House;

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
    outputRange: ["rgba(248,203,70,0)", colors.primary],
  });

  const pillScale = pill.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  const iconColor = focused ? colors.text : "#9A9A9A";

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
          <Icon
            size={focused ? 23 : 21}
            color={iconColor}
            strokeWidth={focused ? 2.45 : 2.05}
            fill={focused && meta.fillWhenActive ? iconColor : "transparent"}
          />
        </Animated.View>

        {meta.badge && !focused ? (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>{meta.badge}</Text>
          </View>
        ) : null}
      </Animated.View>

      <Text
        style={[styles.label, focused && styles.labelActive]}
        numberOfLines={1}
      >
        {meta.label}
      </Text>
    </Pressable>
  );
}

export default function BlinkitTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, Platform.OS === "android" ? 10 : 6);

  return (
    <View style={[styles.wrap, { paddingBottom: bottomPad }]}>
      <View style={styles.topLine} />
      <View style={styles.row}>
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
    fontFamily: fonts.semiBold,
    color: "#9A9A9A",
    textAlign: "center",
    letterSpacing: 0.1,
  },
  labelActive: {
    color: colors.text,
    fontFamily: fonts.extraBold,
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
    fontFamily: fonts.extraBold,
    letterSpacing: 0.3,
  },
});
