import { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
} from "react-native";
import {
  Smartphone,
  CreditCard,
  Wallet,
  CircleCheck,
  ShieldCheck,
} from "../utils/lucideIcons";
import { colors, spacing, radii } from "../theme/colors";
import { fonts } from "../theme/typography";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";

const ICONS = {
  upi: Smartphone,
  card: CreditCard,
  wallet: Wallet,
};

const UPI_APPS = ["GPay", "PhonePe", "Paytm"];

/**
 * Simulated payment sheet — looks like a real checkout handoff,
 * without charging a bank or PSP.
 */
export default function PaymentProcessingModal({
  visible,
  methodId = "upi",
  methodLabel = "UPI",
  amount = 0,
  onSuccess,
  onCancel,
}) {
  const reduceMotion = usePrefersReducedMotion();
  const spin = useRef(new Animated.Value(0)).current;
  const [phase, setPhase] = useState("ready"); // ready | processing | success
  const [upiApp, setUpiApp] = useState("GPay");
  const timerRef = useRef(null);

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  useEffect(() => {
    if (!visible) {
      setPhase("ready");
      if (timerRef.current) clearTimeout(timerRef.current);
      return undefined;
    }
    setPhase(methodId === "cod" ? "processing" : "ready");
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible, methodId]);

  useEffect(() => {
    if (!visible || phase !== "processing" || reduceMotion) {
      spin.stopAnimation();
      spin.setValue(0);
      return undefined;
    }
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [visible, phase, spin, reduceMotion]);

  function startPay() {
    setPhase("processing");
    const delay = methodId === "wallet" ? 700 : methodId === "card" ? 1400 : 1100;
    timerRef.current = setTimeout(() => {
      setPhase("success");
      timerRef.current = setTimeout(() => {
        onSuccessRef.current?.();
      }, 650);
    }, delay);
  }

  // COD: auto-confirm quickly
  useEffect(() => {
    if (!visible || methodId !== "cod") return undefined;
    timerRef.current = setTimeout(() => {
      setPhase("success");
      timerRef.current = setTimeout(() => onSuccessRef.current?.(), 500);
    }, 500);
    return undefined;
  }, [visible, methodId]);

  const Icon = ICONS[methodId] || Smartphone;
  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (phase === "processing" || phase === "success") return;
        onCancel?.();
      }}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>
            {phase === "success"
              ? "Payment successful"
              : phase === "processing"
                ? "Processing payment"
                : "Confirm payment"}
          </Text>
          <Text style={styles.amount}>₹{amount}</Text>
          <Text style={styles.method}>{methodLabel}</Text>

          {phase === "ready" && methodId === "upi" ? (
            <View style={styles.upiRow}>
              {UPI_APPS.map((app) => {
                const on = upiApp === app;
                return (
                  <Pressable
                    key={app}
                    style={[styles.upiChip, on && styles.upiChipOn]}
                    onPress={() => setUpiApp(app)}
                  >
                    <Text style={[styles.upiText, on && styles.upiTextOn]}>
                      {app}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : null}

          <View style={styles.stage}>
            {phase === "success" ? (
              <View style={styles.successWell}>
                <CircleCheck size={36} color={colors.accent} strokeWidth={2.2} />
              </View>
            ) : phase === "processing" ? (
              <Animated.View
                style={[
                  styles.spinner,
                  !reduceMotion && { transform: [{ rotate }] },
                ]}
              />
            ) : (
              <View style={styles.iconWell}>
                <Icon size={28} color={colors.accent} strokeWidth={2.2} />
              </View>
            )}
            <Text style={styles.stageHint}>
              {phase === "success"
                ? "Placing your order…"
                : phase === "processing"
                  ? methodId === "upi"
                    ? `Waiting for ${upiApp}…`
                    : methodId === "card"
                      ? "Authorizing card…"
                      : methodId === "wallet"
                        ? "Debiting wallet…"
                        : "Confirming…"
                  : methodId === "upi"
                    ? `Pay with ${upiApp}`
                    : methodId === "card"
                      ? "Card ending ···· 4242"
                      : methodId === "wallet"
                        ? "Wallet balance ₹500"
                        : "Pay on delivery"}
            </Text>
          </View>

          <View style={styles.secureRow}>
            <ShieldCheck size={14} color={colors.accent} strokeWidth={2.2} />
            <Text style={styles.secureText}>Secured checkout</Text>
          </View>

          {phase === "ready" ? (
            <View style={styles.actions}>
              <Pressable style={styles.cancelBtn} onPress={onCancel}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.payBtn} onPress={startPay}>
                <Text style={styles.payBtnText}>
                  {methodId === "upi" ? `Pay with ${upiApp}` : "Pay now"}
                </Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl + 8,
    paddingTop: spacing.sm,
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D8D8D8",
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.extraBold,
    color: colors.text,
    textAlign: "center",
    letterSpacing: -0.2,
  },
  amount: {
    marginTop: 8,
    fontSize: 32,
    fontFamily: fonts.extraBold,
    color: colors.text,
    textAlign: "center",
    letterSpacing: -0.8,
  },
  method: {
    marginTop: 2,
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.textMuted,
    textAlign: "center",
  },
  upiRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: spacing.lg,
  },
  upiChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
  },
  upiChipOn: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  upiText: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.textSecondary,
  },
  upiTextOn: {
    color: colors.accentDark,
  },
  stage: {
    alignItems: "center",
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    minHeight: 100,
    justifyContent: "center",
  },
  iconWell: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  successWell: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: colors.accentSoft,
    borderTopColor: colors.accent,
  },
  stageHint: {
    marginTop: spacing.md,
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.textSecondary,
    textAlign: "center",
  },
  secureRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginBottom: spacing.lg,
  },
  secureText: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    color: colors.accentDark,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.md,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: colors.white,
  },
  cancelText: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.textSecondary,
  },
  payBtn: {
    flex: 1.4,
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingVertical: 14,
    alignItems: "center",
  },
  payBtnText: {
    fontSize: 14,
    fontFamily: fonts.extraBold,
    color: colors.white,
  },
});
