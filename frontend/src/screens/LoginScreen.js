import { useEffect, useRef, useState } from "react";
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
import { fonts } from "../theme/typography";

const OTP_LEN = 6;

export default function LoginScreen({ navigation, route }) {
  const { requestOtp, verifyOtpAndLogin, isLoggedIn } = useAuth();
  const [step, setStep] = useState("phone"); // phone | otp
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [delivery, setDelivery] = useState("");
  const [phoneMasked, setPhoneMasked] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const otpRefs = useRef([]);
  const autoVerifyFor = useRef("");

  const returnTo = route.params?.returnTo;
  const otpDigits = Array.from({ length: OTP_LEN }, (_, i) => otp[i] || "");

  useEffect(() => {
    if (resendIn <= 0) return undefined;
    const id = setInterval(() => {
      setResendIn((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [resendIn]);

  function finish() {
    if (returnTo) {
      navigation.replace(returnTo);
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("Account");
    }
  }

  function focusOtpBox(index) {
    otpRefs.current[index]?.focus?.();
  }

  function setOtpAt(index, char) {
    const next = otpDigits.map((d, i) => (i === index ? char : d));
    const joined = next.join("").replace(/\D/g, "").slice(0, OTP_LEN);
    setOtp(joined);
    return joined;
  }

  function onOtpChange(index, text) {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 1) {
      // Paste / autofill into this box
      const joined = cleaned.slice(0, OTP_LEN);
      setOtp(joined);
      focusOtpBox(Math.min(joined.length, OTP_LEN - 1));
      return;
    }
    const digit = cleaned.slice(-1);
    const joined = setOtpAt(index, digit);
    if (digit && index < OTP_LEN - 1) {
      focusOtpBox(index + 1);
    } else if (joined.length === OTP_LEN) {
      // stay on last
    }
  }

  function onOtpKeyPress(index, key) {
    if (key === "Backspace" && !otpDigits[index] && index > 0) {
      setOtpAt(index - 1, "");
      focusOtpBox(index - 1);
    }
  }

  async function onSendOtp() {
    setError("");
    setBusy(true);
    try {
      const data = await requestOtp({ name, phone });
      setDelivery(data.delivery || "");
      setPhoneMasked(data.phoneMasked || `+91 ${phone}`);
      setStep("otp");
      setOtp("");
      autoVerifyFor.current = "";
      setResendIn(data.resendAfterSec || 30);
      setTimeout(() => focusOtpBox(0), 250);
    } catch (err) {
      setError(err.message || "Could not send OTP");
    } finally {
      setBusy(false);
    }
  }

  async function onVerify() {
    setError("");
    setBusy(true);
    try {
      await verifyOtpAndLogin({ name, phone, otp });
      finish();
    } catch (err) {
      setError(err.message || "Verification failed");
    } finally {
      setBusy(false);
    }
  }

  // Auto-verify once all 6 digits are entered (once per code)
  useEffect(() => {
    if (step !== "otp" || otp.length !== OTP_LEN || busy) return undefined;
    if (autoVerifyFor.current === otp) return undefined;
    autoVerifyFor.current = otp;
    const t = setTimeout(() => {
      onVerify();
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp, step, busy]);

  async function onResend() {
    if (resendIn > 0 || busy) return;
    setError("");
    setBusy(true);
    try {
      const data = await requestOtp({ name, phone });
      setDelivery(data.delivery || "");
      setPhoneMasked(data.phoneMasked || `+91 ${phone}`);
      setOtp("");
      autoVerifyFor.current = "";
      setResendIn(data.resendAfterSec || 30);
      setTimeout(() => focusOtpBox(0), 150);
    } catch (err) {
      setError(err.message || "Could not resend OTP");
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
      {step === "otp" ? (
        <View style={styles.brandHeader}>
          <Pressable
            onPress={() => {
              setStep("phone");
              setError("");
            }}
            style={styles.iconBtn}
          >
            <ChevronLeft size={24} color={colors.text} strokeWidth={2.4} />
          </Pressable>
          <Text style={styles.wordmark}>blinkit</Text>
          <View style={styles.iconBtn} />
        </View>
      ) : (
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn}>
            <ChevronLeft size={24} color={colors.text} strokeWidth={2.4} />
          </Pressable>
          <Text style={styles.headerTitle}>Login</Text>
          <View style={styles.iconBtn} />
        </View>
      )}
      <View style={styles.curve} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
        >
          {step === "phone" ? (
            <>
              <Text style={styles.hero}>India’s last minute app</Text>
              <Text style={styles.sub}>
                Enter your mobile number. We’ll send a 6-digit OTP from our
                server.
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
                    onChangeText={(t) =>
                      setPhone(t.replace(/\D/g, "").slice(0, 10))
                    }
                    placeholder="10-digit mobile"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="number-pad"
                    maxLength={10}
                  />
                </View>

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <Pressable
                  style={[styles.primaryBtn, busy && styles.primaryDisabled]}
                  onPress={onSendOtp}
                  disabled={busy}
                >
                  <Text style={styles.primaryText}>
                    {busy ? "Sending…" : "Send OTP"}
                  </Text>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.otpTitle}>Enter verification code</Text>
              <Text style={styles.sub}>
                Sent to {phoneMasked || `+91 ${phone}`}
              </Text>

              {delivery === "dev_console" ? (
                <View style={styles.devHint}>
                  <Text style={styles.devHintText}>
                    Local mode: open the backend terminal to read the OTP. The
                    code is never sent to this app.
                  </Text>
                </View>
              ) : null}

              <View style={[styles.card, shadows.soft]}>
                <View style={styles.otpRow}>
                  {otpDigits.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={(el) => {
                        otpRefs.current[index] = el;
                      }}
                      style={[
                        styles.otpBox,
                        digit ? styles.otpBoxFilled : null,
                      ]}
                      value={digit}
                      onChangeText={(t) => onOtpChange(index, t)}
                      onKeyPress={({ nativeEvent }) =>
                        onOtpKeyPress(index, nativeEvent.key)
                      }
                      keyboardType="number-pad"
                      maxLength={index === 0 ? OTP_LEN : 1}
                      textContentType={index === 0 ? "oneTimeCode" : undefined}
                      autoComplete={index === 0 ? "sms-otp" : "off"}
                      selectTextOnFocus
                      caretHidden={false}
                    />
                  ))}
                </View>

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <Pressable
                  style={[styles.primaryBtn, busy && styles.primaryDisabled]}
                  onPress={onVerify}
                  disabled={busy}
                >
                  <Text style={styles.primaryText}>
                    {busy ? "Verifying…" : "Verify & login"}
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.resendBtn}
                  onPress={onResend}
                  disabled={resendIn > 0 || busy}
                >
                  <Text
                    style={[
                      styles.resendText,
                      (resendIn > 0 || busy) && styles.resendDisabled,
                    ]}
                  >
                    {resendIn > 0
                      ? `Resend OTP in ${resendIn}s`
                      : "Resend OTP"}
                  </Text>
                </Pressable>
              </View>
            </>
          )}

          <Text style={styles.legal}>
            We never store your OTP in plain text. Codes expire in 5 minutes and
            allow limited attempts.
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
  brandHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
  },
  wordmark: {
    fontFamily: fonts.extraBold,
    fontSize: 36,
    letterSpacing: -1.4,
    color: colors.text,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: fonts.extraBold,
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
    fontFamily: fonts.extraBold,
    color: colors.text,
    letterSpacing: -0.4,
  },
  otpTitle: {
    fontSize: 20,
    fontFamily: fonts.extraBold,
    color: colors.text,
    letterSpacing: -0.35,
  },
  sub: {
    marginTop: 6,
    marginBottom: spacing.xl,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    fontFamily: fonts.medium,
  },
  devHint: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginTop: -spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  devHintText: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: spacing.md,
  },
  otpBox: {
    flex: 1,
    height: 52,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    textAlign: "center",
    fontSize: 20,
    fontFamily: fonts.extraBold,
    color: colors.text,
    paddingVertical: 0,
  },
  otpBoxFilled: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
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
    fontFamily: fonts.extraBold,
    color: colors.text,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: colors.text,
    paddingVertical: 0,
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    fontFamily: fonts.bold,
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
    fontFamily: fonts.extraBold,
    fontSize: 15,
  },
  resendBtn: {
    marginTop: spacing.md,
    alignItems: "center",
    paddingVertical: 8,
  },
  resendText: {
    color: colors.accent,
    fontFamily: fonts.extraBold,
    fontSize: 13,
  },
  resendDisabled: {
    color: colors.textMuted,
  },
  legal: {
    marginTop: spacing.lg,
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 18,
    textAlign: "center",
    fontFamily: fonts.medium,
  },
});
