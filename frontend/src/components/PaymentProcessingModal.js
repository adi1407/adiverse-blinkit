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

/**
 * Demo digital checkout sheet — places the order without charging a bank/PSP.
 * COD does not use this modal (cart places directly).
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
  const timerRef = useRef(null);

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  useEffect(() => {
    if (!visible) {
      setPhase("ready");
      if (timerRef.current) clearTimeout(timerRef.current);
      return undefined;
    }
    setPhase("ready");
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

  function startDemoCheckout() {
    setPhase("processing");
    const delay = reduceMotion ? 200 : 900;
    timerRef.current = setTimeout(() => {
      setPhase("success");
      timerRef.current = setTimeout(() => {
        onSuccessRef.current?.();
      }, reduceMotion ? 150 : 550);
    }, delay);
  }

  const Icon = ICONS[methodId] || Smartphone;
  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const title =
    phase === "success"
      ? "Demo payment recorded"
      : phase === "processing"
        ? "Placing order…"
        : "Demo checkout";

  const stageHint =
    phase === "success"
      ? "No money was charged · confirming order…"
      : phase === "processing"
        ? "Recording demo payment…"
        : "Your order will be placed — no payment is taken";

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
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.amount}>₹{amount}</Text>
          <Text style={styles.method}>{methodLabel} · demo</Text>

          <View style={styles.notice}>
            <Text style={styles.noticeText}>
              Demo checkout — no bank charge. Online payments are not connected
              yet.
            </Text>
          </View>

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
            <Text style={styles.stageHint}>{stageHint}</Text>
          </View>

          <View style={styles.secureRow}>
            <ShieldCheck size={14} color={colors.accent} strokeWidth={2.2} />
            <Text style={styles.secureText}>No PSP · demo only</Text>
          </View>

          {phase === "ready" ? (
            <View style={styles.actions}>
              <Pressable style={styles.cancelBtn} onPress={onCancel}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.payBtn} onPress={startDemoCheckout}>
                <Text style={styles.payBtnText}>Place order (demo)</Text>
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
  notice: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceWarm,
    borderWidth: 1,
    borderColor: "#F0E0A8",
  },
  noticeText: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 17,
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
    paddingHorizontal: spacing.md,
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
