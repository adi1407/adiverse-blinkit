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
} from "react-native";
import { ChevronLeft, Phone, UserRound } from "../utils/lucideIcons";
import { useAuth } from "../context/AuthContext";
import { colors, spacing, radii, shadows } from "../theme/colors";

export default function LoginScreen({ navigation, route }) {
  const { login, isLoggedIn } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const returnTo = route.params?.returnTo;

  function finish() {
    if (returnTo) {
      navigation.replace(returnTo);
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("Account");
    }
  }

  function onContinue() {
    setError("");
    setBusy(true);
    try {
      // Mock login — real Blinkit would send OTP next
      login({ name, phone });
      finish();
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  if (isLoggedIn) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn}>
            <ChevronLeft size={24} color={colors.text} strokeWidth={2.4} />
          </Pressable>
          <Text style={styles.headerTitle}>Already logged in</Text>
          <View style={styles.iconBtn} />
        </View>
        <View style={styles.curve} />
        <View style={styles.bodyCenter}>
          <Pressable style={styles.primaryBtn} onPress={finish}>
            <Text style={styles.primaryText}>Continue</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <ChevronLeft size={24} color={colors.text} strokeWidth={2.4} />
        </Pressable>
        <Text style={styles.headerTitle}>Login</Text>
        <View style={styles.iconBtn} />
      </View>
      <View style={styles.curve} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.hero}>India’s last minute app</Text>
          <Text style={styles.sub}>
            Enter your details to place orders. OTP is skipped in this demo.
          </Text>

          <View style={[styles.card, shadows.soft]}>
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
              />
            </View>

            <View style={styles.field}>
              <View style={styles.fieldIcon}>
                <Phone size={16} color={colors.accent} strokeWidth={2.2} />
              </View>
              <Text style={styles.prefix}>+91</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={(t) => setPhone(t.replace(/\D/g, "").slice(0, 10))}
                placeholder="10-digit mobile"
                placeholderTextColor={colors.textMuted}
                keyboardType="number-pad"
                maxLength={10}
              />
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable
              style={[styles.primaryBtn, busy && styles.primaryDisabled]}
              onPress={onContinue}
              disabled={busy}
            >
              <Text style={styles.primaryText}>
                {busy ? "Please wait…" : "Continue"}
              </Text>
            </Pressable>
          </View>

          <Text style={styles.legal}>
            By continuing, you agree to this clone’s demo terms. No SMS is sent.
          </Text>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.text,
  },
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
  hero: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.text,
    letterSpacing: -0.4,
  },
  sub: {
    marginTop: 6,
    marginBottom: spacing.xl,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    fontWeight: "500",
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
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
  fieldIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  prefix: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.text,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    paddingVertical: 0,
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
    opacity: 0.7,
  },
  primaryText: {
    color: colors.white,
    fontWeight: "900",
    fontSize: 15,
  },
  legal: {
    marginTop: spacing.lg,
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 18,
    textAlign: "center",
  },
});
