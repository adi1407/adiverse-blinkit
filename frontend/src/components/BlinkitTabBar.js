import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

const TABS = [
  {
    name: "Home",
    label: "Home",
    icon: "home-outline",
    iconActive: "home",
    accent: true,
  },
  {
    name: "OrderAgain",
    label: "Order Again",
    icon: "bag-handle-outline",
    iconActive: "bag-handle",
  },
  {
    name: "Categories",
    label: "Categories",
    icon: "grid-outline",
    iconActive: "grid",
  },
  {
    name: "Print",
    label: "Print",
    icon: "print-outline",
    iconActive: "print",
  },
];

export const TAB_BAR_BASE_HEIGHT = 58;

export default function BlinkitTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, Platform.OS === "android" ? 8 : 4);

  return (
    <View style={[styles.wrap, { paddingBottom: bottomPad }]}>
      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const meta = TABS.find((t) => t.name === route.name) || {
            label: route.name,
            icon: "ellipse-outline",
            iconActive: "ellipse",
          };

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.item}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={meta.label}
            >
              <View
                style={[
                  styles.iconWrap,
                  focused && meta.accent && styles.iconWrapHome,
                  focused && !meta.accent && styles.iconWrapActive,
                ]}
              >
                <Ionicons
                  name={focused ? meta.iconActive : meta.icon}
                  size={22}
                  color={
                    focused
                      ? meta.accent
                        ? colors.text
                        : colors.accent
                      : colors.textMuted
                  }
                />
              </View>
              <Text
                style={[styles.label, focused && styles.labelActive]}
                numberOfLines={1}
              >
                {meta.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E5E5",
    paddingTop: 6,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: -2 },
      },
      android: {
        elevation: 12,
      },
    }),
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    minHeight: TAB_BAR_BASE_HEIGHT - 6,
    paddingHorizontal: 4,
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingVertical: 2,
  },
  iconWrap: {
    width: 42,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapHome: {
    backgroundColor: colors.primary,
  },
  iconWrapActive: {
    backgroundColor: colors.accentSoft,
  },
  label: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.textMuted,
    textAlign: "center",
  },
  labelActive: {
    color: colors.text,
    fontWeight: "700",
  },
});
