import { SafeAreaView, View, Text, StyleSheet, StatusBar, Platform, Pressable } from "react-native";
import {
  Package,
  MapPin,
  MessageCircle,
  Info,
  ChevronRight,
  UserRound,
} from "../utils/lucideIcons";
import ScreenHeader from "../components/ScreenHeader";
import { colors, spacing, radii, shadows } from "../theme/colors";

const MENU = [
  { id: "orders", label: "Your orders", hint: "Track & reorder", Icon: Package },
  { id: "address", label: "Saved addresses", hint: "Home, work & more", Icon: MapPin },
  { id: "support", label: "Support", hint: "Chat with us", Icon: MessageCircle },
  { id: "about", label: "About Blinkit Clone", hint: "App version 1.0", Icon: Info },
];

export default function AccountScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        showBack
        title="Account"
        subtitle="Profile & preferences"
      />
      <View style={styles.curve} />

      <View style={styles.body}>
        <View style={[styles.profileCard, shadows.soft]}>
          <View style={styles.avatar}>
            <UserRound size={28} color={colors.text} strokeWidth={2} />
          </View>
          <View style={styles.profileText}>
            <Text style={styles.name}>Guest User</Text>
            <Text style={styles.phone}>Login to sync orders & addresses</Text>
          </View>
          <Pressable style={styles.loginBtn}>
            <Text style={styles.loginText}>Login</Text>
          </Pressable>
        </View>

        <View style={[styles.menuCard, shadows.soft]}>
          {MENU.map((item, index) => {
            const Icon = item.Icon;
            return (
              <Pressable
                key={item.id}
                style={[
                  styles.menuRow,
                  index === MENU.length - 1 && styles.menuRowLast,
                ]}
              >
                <View style={styles.menuIcon}>
                  <Icon size={18} color={colors.accent} strokeWidth={2.2} />
                </View>
                <View style={styles.menuCopy}>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Text style={styles.menuHint}>{item.hint}</Text>
                </View>
                <ChevronRight size={18} color={colors.textMuted} />
              </Pressable>
            );
          })}
        </View>
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
  curve: {
    height: 14,
    backgroundColor: colors.background,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  body: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  profileText: {
    marginLeft: spacing.md,
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: "900",
    color: colors.text,
  },
  phone: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  loginBtn: {
    backgroundColor: colors.accent,
    borderRadius: radii.sm,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  loginText: {
    color: colors.white,
    fontWeight: "900",
    fontSize: 12,
  },
  menuCard: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md,
  },
  menuRowLast: {
    borderBottomWidth: 0,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  menuCopy: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  menuHint: {
    marginTop: 2,
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: "500",
  },
});
