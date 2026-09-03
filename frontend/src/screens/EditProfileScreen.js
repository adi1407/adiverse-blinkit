import { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  StatusBar,
  Platform,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from "react-native";
import { Phone, UserRound, Lock } from "../utils/lucideIcons";
import ScreenHeader from "../components/ScreenHeader";
import { useAuth } from "../context/AuthContext";
import { colors, spacing, radii, shadows } from "../theme/colors";

function formatPhone(phone) {
  if (!phone || phone.length !== 10) return phone || "";
  return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
}

export default function EditProfileScreen({ navigation }) {
  const { user, isLoggedIn, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScreenHeader showBack title="Edit profile" subtitle="Login required" />
        <View style={styles.curve} />
        <View style={styles.bodyCenter}>
          <Text style={styles.guestCopy}>
            Login first to edit your display name.
          </Text>
          <Pressable
            style={styles.primaryBtn}
            onPress={() => navigation.replace("Login", { returnTo: "EditProfile" })}
          >
            <Text style={styles.primaryText}>Login</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const unchanged = name.trim() === (user?.name || "").trim();

  async function onSave() {
    setError("");
    setBusy(true);
    try {
      await updateProfile({ name });
      Alert.alert("Saved", "Your profile was updated.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      setError(err.message || "Could not save");
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        showBack
        title="Edit profile"
        subtitle="Name shown on orders"
      />
      <View style={styles.curve} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.card, shadows.soft]}>
            <Text style={styles.label}>Display name</Text>
            <View style={styles.field}>
              <View style={styles.fieldIcon}>
                <UserRound size={16} color={colors.accent} strokeWidth={2.2} />
              </View>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="words"
                maxLength={40}
              />
            </View>

            <Text style={styles.label}>Mobile</Text>
            <View style={[styles.field, styles.fieldLocked]}>
              <View style={styles.fieldIcon}>
                <Phone size={16} color={colors.textMuted} strokeWidth={2.2} />
              </View>
              <Text style={styles.lockedValue}>{formatPhone(user.phone)}</Text>
              <Lock size={14} color={colors.textMuted} strokeWidth={2.2} />
            </View>
            <Text style={styles.hint}>
              Phone stays fixed so your order history stays linked to this
              number.
            </Text>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable
              style={[
                styles.primaryBtn,
                (busy || unchanged) && styles.primaryDisabled,
              ]}
              onPress={onSave}
              disabled={busy || unchanged}
            >
              <Text style={styles.primaryText}>
                {busy ? "Saving…" : "Save changes"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  flex: { flex: 1 },
  curve: {
    height: 14,
    backgroundColor: colors.background,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  body: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  bodyCenter: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    padding: spacing.lg,
  },
  guestCopy: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.textMuted,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 50,
    marginBottom: spacing.md,
    gap: 8,
  },
  fieldLocked: {
    backgroundColor: colors.background,
    opacity: 0.95,
  },
  fieldIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    paddingVertical: 0,
  },
  lockedValue: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  hint: {
    marginTop: -4,
    marginBottom: spacing.md,
    fontSize: 12,
    lineHeight: 17,
    color: colors.textMuted,
    fontWeight: "500",
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  primaryBtn: {
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.sm,
  },
  primaryDisabled: {
    opacity: 0.55,
  },
  primaryText: {
    color: colors.white,
    fontWeight: "900",
    fontSize: 15,
  },
});
