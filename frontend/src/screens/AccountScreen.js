import { Alert, SafeAreaView, View, Text, StyleSheet, StatusBar, Platform, Pressable } from "react-native";
import {
  Package,
  MapPin,
  MessageCircle,
  Info,
  ChevronRight,
  UserRound,
  LogOut,
  Printer,
  Heart,
  Pencil,
  Bell,
} from "../utils/lucideIcons";
import ScreenHeader from "../components/ScreenHeader";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useNotifications } from "../context/NotificationContext";
import { colors, spacing, radii, shadows } from "../theme/colors";

const MENU = [
  { id: "profile", label: "Edit profile", hint: "Change display name", Icon: Pencil },
  { id: "notifications", label: "Notifications", hint: "Order status alerts", Icon: Bell },
  { id: "orders", label: "Your orders", hint: "Track & reorder", Icon: Package },
  { id: "wishlist", label: "Wishlist", hint: "Saved for later", Icon: Heart },
  { id: "print", label: "Print jobs", hint: "Docs & photo prints", Icon: Printer },
  { id: "address", label: "Saved addresses", hint: "Home, work & more", Icon: MapPin },
  { id: "support", label: "Help & support", hint: "FAQ & guides", Icon: MessageCircle },
  { id: "about", label: "About Blinkit Clone", hint: "v1.0 · Expo SDK 57", Icon: Info },
];

function formatPhone(phone) {
  if (!phone || phone.length !== 10) return phone || "";
  return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
}

export default function AccountScreen({ navigation }) {
  const { user, isLoggedIn, logout } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const { unreadCount } = useNotifications();

  function onLogin() {
    navigation.navigate("Login");
  }

  function onLogout() {
    Alert.alert("Log out?", "You’ll need to login again to place orders.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: () => {
          logout();
        },
      },
    ]);
  }

  function onMenuPress(id) {
    if (id === "profile") {
      if (!isLoggedIn) {
        navigation.navigate("Login", { returnTo: "EditProfile" });
        return;
      }
      navigation.navigate("EditProfile");
      return;
    }
    if (id === "notifications") {
      navigation.navigate("Notifications");
      return;
    }
    if (id === "orders") {
      navigation.navigate("Orders");
      return;
    }
    if (id === "wishlist") {
      navigation.navigate("Wishlist");
      return;
    }
    if (id === "print") {
      if (!isLoggedIn) {
        navigation.navigate("Login");
        return;
      }
      navigation.navigate("PrintJobs");
      return;
    }
    if (id === "address") {
      navigation.navigate("Addresses");
      return;
    }
    if (id === "about") {
      Alert.alert(
        "Blinkit Clone",
        "A teach-as-we-build grocery delivery demo.\n\nVersion 1.0.0 · Expo SDK 57\nCatalog · Cart · Orders · Print · Wishlist",
        [{ text: "OK" }]
      );
      return;
    }
    if (id === "support") {
      navigation.navigate("Help");
      return;
    }
    Alert.alert("Coming soon", "This section is UI-only for now.");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        showBack
        title="Account"
        subtitle="Profile & preferences"
      />
      <View style={styles.curve} />

      <View style={styles.body}>
        <Pressable
          style={[styles.profileCard, shadows.soft]}
          onPress={() => {
            if (isLoggedIn) navigation.navigate("EditProfile");
            else onLogin();
          }}
        >
          <View style={styles.avatar}>
            <UserRound size={28} color={colors.text} strokeWidth={2} />
          </View>
          <View style={styles.profileText}>
            <Text style={styles.name}>
              {isLoggedIn ? user.name : "Guest User"}
            </Text>
            <Text style={styles.phone}>
              {isLoggedIn
                ? formatPhone(user.phone)
                : "Login to sync orders & addresses"}
            </Text>
            {isLoggedIn ? (
              <Text style={styles.editHint}>Tap to edit profile</Text>
            ) : null}
          </View>
          {isLoggedIn ? (
            <Pressable
              style={styles.logoutBtn}
              onPress={(e) => {
                e?.stopPropagation?.();
                onLogout();
              }}
            >
              <LogOut size={14} color={colors.danger} strokeWidth={2.4} />
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
          ) : (
            <Pressable
              style={styles.loginBtn}
              onPress={(e) => {
                e?.stopPropagation?.();
                onLogin();
              }}
            >
              <Text style={styles.loginText}>Login</Text>
            </Pressable>
          )}
        </Pressable>

        <View style={[styles.menuCard, shadows.soft]}>
          {MENU.map((item, index) => {
            const Icon = item.Icon;
            return (
              <Pressable
                key={item.id}
                onPress={() => onMenuPress(item.id)}
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
                  <Text style={styles.menuHint}>
                    {item.id === "wishlist"
                      ? wishlistCount
                        ? `${wishlistCount} saved`
                        : "Saved for later"
                      : item.id === "notifications"
                        ? unreadCount
                          ? `${unreadCount} unread`
                          : "Order status alerts"
                        : item.hint}
                  </Text>
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
  editHint: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: "700",
    color: colors.accent,
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
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: radii.sm,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#F8C9CD",
    backgroundColor: "#FFF5F5",
  },
  logoutText: {
    color: colors.danger,
    fontWeight: "800",
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
