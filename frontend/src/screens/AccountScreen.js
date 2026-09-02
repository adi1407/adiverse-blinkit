import { SafeAreaView, View, Text, StyleSheet, StatusBar, Platform, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenHeader from "../components/ScreenHeader";
import { colors, spacing, radii } from "../theme/colors";

const MENU = [
  { id: "orders", label: "Your orders", icon: "receipt-outline" },
  { id: "address", label: "Saved addresses", icon: "location-outline" },
  { id: "support", label: "Support", icon: "chatbubble-ellipses-outline" },
  { id: "about", label: "About Blinkit Clone", icon: "information-circle-outline" },
];

export default function AccountScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        showBack
        title="Account"
        subtitle="Profile & settings (UI only)"
      />
      <View style={styles.body}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>A</Text>
          </View>
          <View style={styles.profileText}>
            <Text style={styles.name}>Guest User</Text>
            <Text style={styles.phone}>Login coming in a later chunk</Text>
          </View>
        </View>

        {MENU.map((item) => (
          <Pressable key={item.id} style={styles.menuRow}>
            <Ionicons name={item.icon} size={22} color={colors.text} />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  body: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
  },
  profileText: {
    marginLeft: spacing.md,
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
  },
  phone: {
    marginTop: 2,
    fontSize: 13,
    color: colors.textSecondary,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: colors.text,
  },
});
