import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";
import { Mic, X } from "../utils/lucideIcons";
import { ensureMicPermission } from "../utils/micPermission";
import { VOICE_BRIDGE_HTML } from "../utils/voiceBridgeHtml";
import { colors, spacing, radii } from "../theme/colors";
import { fonts } from "../theme/typography";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";

const QUICK_PHRASES = ["milk", "bread", "banana", "chips", "atta", "onion", "curd", "eggs"];

/**
 * Blinkit-style voice search sheet.
 * Uses Web Speech API inside a WebView (works in many Expo Go devices).
 * Falls back to quick phrases if speech isn't available.
 */
export default function VoiceSearchOverlay({
  visible,
  onClose,
  onResult,
}) {
  const webRef = useRef(null);
  const reduceMotion = usePrefersReducedMotion();
  const pulse = useRef(new Animated.Value(0)).current;
  const bars = useMemo(
    () => [0, 1, 2, 3, 4].map(() => new Animated.Value(0.35)),
    []
  );

  const [phase, setPhase] = useState("idle"); // idle | listening | partial | fallback | error
  const [heard, setHeard] = useState("");
  const heardRef = useRef("");
  const [hint, setHint] = useState("Tap the mic and say a product");
  const [bridgeReady, setBridgeReady] = useState(false);
  const [unsupported, setUnsupported] = useState(false);
  const autoStarted = useRef(false);
  const listeningWatchdog = useRef(null);

  const setHeardSafe = useCallback((text) => {
    heardRef.current = text;
    setHeard(text);
  }, []);

  const stopWatchdog = useCallback(() => {
    if (listeningWatchdog.current) {
      clearTimeout(listeningWatchdog.current);
      listeningWatchdog.current = null;
    }
  }, []);

  const inject = useCallback((js) => {
    webRef.current?.injectJavaScript(`${js}; true;`);
  }, []);

  const stopListening = useCallback(() => {
    stopWatchdog();
    inject("window.__stopVoice && window.__stopVoice()");
  }, [inject, stopWatchdog]);

  const resetVisual = useCallback(() => {
    setHeardSafe("");
    setPhase("idle");
    setHint("Tap the mic and say a product");
  }, [setHeardSafe]);

  const startListening = useCallback(async () => {
    stopWatchdog();
    setHeardSafe("");
    setHint("Listening…");
    setPhase("listening");

    const allowed = await ensureMicPermission();
    if (!allowed) {
      setPhase("error");
      setHint("Microphone permission is needed for voice search");
      return;
    }

    if (unsupported || !bridgeReady) {
      setPhase("fallback");
      setHint("Voice isn’t available here — pick a product below");
      return;
    }

    inject("window.__startVoice && window.__startVoice()");
    listeningWatchdog.current = setTimeout(() => {
      stopListening();
      setPhase((prev) => {
        if (prev === "listening" || prev === "partial") {
          setHint("Didn’t catch that — try again or pick below");
          return "fallback";
        }
        return prev;
      });
    }, 9000);
  }, [
    bridgeReady,
    inject,
    setHeardSafe,
    stopListening,
    stopWatchdog,
    unsupported,
  ]);

  useEffect(() => {
    if (!visible) {
      autoStarted.current = false;
      stopListening();
      stopWatchdog();
      resetVisual();
      setBridgeReady(false);
      setUnsupported(false);
      return undefined;
    }
    // Wait for a mic tap — Web Speech often needs a user gesture.
    setHint("Tap the mic and say a product");
    setPhase("idle");
    return undefined;
  }, [visible, resetVisual, stopListening, stopWatchdog]);

  useEffect(() => {
    if (!visible || !bridgeReady || autoStarted.current || unsupported) return;
    // Soft auto-start once the bridge is ready (still after sheet open).
    autoStarted.current = true;
    const t = setTimeout(() => {
      startListening();
    }, 350);
    return () => clearTimeout(t);
  }, [visible, bridgeReady, unsupported, startListening]);

  useEffect(() => {
    if (!visible || reduceMotion) {
      pulse.stopAnimation();
      pulse.setValue(0);
      return undefined;
    }
    if (phase !== "listening" && phase !== "partial") {
      pulse.stopAnimation();
      pulse.setValue(0);
      return undefined;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 900,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [visible, phase, pulse, reduceMotion]);

  useEffect(() => {
    if (!visible || reduceMotion) return undefined;
    if (phase !== "listening" && phase !== "partial") {
      bars.forEach((b) => b.setValue(0.35));
      return undefined;
    }
    const anims = bars.map((bar, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(bar, {
            toValue: 0.35 + ((i % 3) + 1) * 0.22,
            duration: 280 + i * 40,
            useNativeDriver: true,
          }),
          Animated.timing(bar, {
            toValue: 0.3,
            duration: 280 + i * 40,
            useNativeDriver: true,
          }),
        ])
      )
    );
    anims.forEach((a) => a.start());
    return () => anims.forEach((a) => a.stop());
  }, [visible, phase, bars, reduceMotion]);

  function onBridgeMessage(event) {
    let msg;
    try {
      msg = JSON.parse(event.nativeEvent.data);
    } catch {
      return;
    }

    switch (msg.type) {
      case "ready":
        setBridgeReady(true);
        break;
      case "unsupported":
        setUnsupported(true);
        setBridgeReady(true);
        setPhase("fallback");
        setHint("Voice isn’t available on this device — pick below");
        break;
      case "start":
      case "requested":
        setPhase("listening");
        setHint("Listening…");
        break;
      case "partial":
        if (msg.text) {
          setHeardSafe(msg.text);
          setPhase("partial");
          setHint("Keep going…");
        }
        break;
      case "final":
        if (msg.text) {
          stopWatchdog();
          setHeardSafe(msg.text);
          setPhase("idle");
          setHint("Got it");
          stopListening();
          onResult?.(cleanTranscript(msg.text));
          onClose?.();
        }
        break;
      case "error": {
        const code = String(msg.error || "");
        if (code === "aborted" || code === "no-speech") {
          setPhase("fallback");
          setHint("Didn’t catch that — try again or pick below");
        } else if (code === "not-allowed") {
          setPhase("error");
          setHint("Microphone permission is needed for voice search");
        } else {
          setPhase("fallback");
          setHint("Voice failed — pick a product or type instead");
          setUnsupported(true);
        }
        stopWatchdog();
        break;
      }
      case "end":
        stopWatchdog();
        setPhase((prev) => {
          if (prev === "listening" && !heardRef.current) {
            setHint("Didn’t catch that — try again or pick below");
            return "fallback";
          }
          return prev;
        });
        break;
      default:
        break;
    }
  }

  function pickPhrase(term) {
    onResult?.(term);
    onClose?.();
  }

  const ringScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.28],
  });
  const ringOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.05],
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.dismissHit} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.topRow}>
            <Text style={styles.title}>Voice search</Text>
            <Pressable onPress={onClose} hitSlop={10} style={styles.closeBtn}>
              <X size={18} color={colors.textSecondary} strokeWidth={2.4} />
            </Pressable>
          </View>

          <Text style={styles.hint}>{hint}</Text>
          {heard ? (
            <Text style={styles.heard} numberOfLines={2}>
              “{heard}”
            </Text>
          ) : (
            <Text style={styles.heardGhost}>Say “milk”, “chips”, “atta”…</Text>
          )}

          <View style={styles.micStage}>
            <Animated.View
              pointerEvents="none"
              style={[
                styles.pulseRing,
                { opacity: ringOpacity, transform: [{ scale: ringScale }] },
              ]}
            />
            <Pressable
              onPress={() => {
                if (phase === "listening" || phase === "partial") {
                  stopListening();
                  setPhase("fallback");
                  setHint("Stopped — tap mic to try again");
                } else {
                  startListening();
                }
              }}
              style={({ pressed }) => [
                styles.micBtn,
                (phase === "listening" || phase === "partial") && styles.micBtnLive,
                pressed && styles.micBtnPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={
                phase === "listening" || phase === "partial"
                  ? "Stop listening"
                  : "Start voice search"
              }
            >
              <Mic
                size={32}
                color={
                  phase === "listening" || phase === "partial"
                    ? colors.white
                    : colors.accent
                }
                strokeWidth={2.2}
              />
            </Pressable>
          </View>

          <View style={styles.bars}>
            {bars.map((bar, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.bar,
                  {
                    transform: [
                      {
                        scaleY: bar,
                      },
                    ],
                  },
                ]}
              />
            ))}
          </View>

          {(phase === "fallback" || phase === "error" || unsupported) && (
            <View style={styles.quickBlock}>
              <Text style={styles.quickLabel}>Quick picks</Text>
              <View style={styles.chips}>
                {QUICK_PHRASES.map((term) => (
                  <Pressable
                    key={term}
                    style={({ pressed }) => [
                      styles.chip,
                      pressed && styles.chipPressed,
                    ]}
                    onPress={() => pickPhrase(term)}
                  >
                    <Text style={styles.chipText}>{term}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Off-screen speech bridge */}
          <View style={styles.bridgeHost} pointerEvents="none">
            {visible ? (
              <WebView
                ref={webRef}
                originWhitelist={["*"]}
                source={{ html: VOICE_BRIDGE_HTML }}
                onMessage={onBridgeMessage}
                javaScriptEnabled
                mediaPlaybackRequiresUserAction={false}
                allowsInlineMediaPlayback
                mediaCapturePermissionGrantType="grant"
                style={styles.bridge}
                {...(Platform.OS === "android"
                  ? { androidLayerType: "hardware" }
                  : {})}
              />
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
}

function cleanTranscript(raw) {
  return String(raw || "")
    .replace(/[^\w\s'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  dismissHit: {
    flex: 1,
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl + 8,
    paddingTop: spacing.sm,
    minHeight: 420,
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D8D8D8",
    marginBottom: spacing.md,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.extraBold,
    color: colors.text,
    letterSpacing: -0.3,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  hint: {
    marginTop: spacing.md,
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.textSecondary,
    textAlign: "center",
  },
  heard: {
    marginTop: spacing.sm,
    fontSize: 22,
    fontFamily: fonts.extraBold,
    color: colors.text,
    textAlign: "center",
    letterSpacing: -0.4,
  },
  heardGhost: {
    marginTop: spacing.sm,
    fontSize: 15,
    fontFamily: fonts.medium,
    color: colors.textMuted,
    textAlign: "center",
  },
  micStage: {
    marginTop: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    height: 140,
  },
  pulseRing: {
    position: "absolute",
    width: 118,
    height: 118,
    borderRadius: 59,
    backgroundColor: colors.accent,
  },
  micBtn: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.accentSoft,
    borderWidth: 2,
    borderColor: "#C8EBCF",
    alignItems: "center",
    justifyContent: "center",
  },
  micBtnLive: {
    backgroundColor: colors.accent,
    borderColor: colors.accentDark,
  },
  micBtnPressed: {
    transform: [{ scale: 0.97 }],
  },
  bars: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 6,
    height: 36,
    marginTop: spacing.md,
  },
  bar: {
    width: 5,
    height: 28,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  quickBlock: {
    marginTop: spacing.xl,
  },
  quickLabel: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipPressed: {
    backgroundColor: colors.accentSoft,
    borderColor: "#B7E4BF",
  },
  chipText: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.text,
    textTransform: "capitalize",
  },
  bridgeHost: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
    left: 0,
    top: 0,
    overflow: "hidden",
  },
  bridge: {
    width: 1,
    height: 1,
    backgroundColor: "transparent",
  },
});
