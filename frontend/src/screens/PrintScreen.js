import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  Pressable,
} from "react-native";
import { Printer, Upload, Image as ImageIcon, FileText } from "../utils/lucideIcons";
import ScreenHeader from "../components/ScreenHeader";
import { colors, spacing, radii, shadows } from "../theme/colors";

export default function PrintScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Print" subtitle="Documents & photos in minutes" />
      <View style={styles.curve} />

      <View style={styles.body}>
        <View style={[styles.hero, shadows.soft]}>
          <View style={styles.heroIcon}>
            <Printer size={32} color={colors.accent} strokeWidth={1.8} />
          </View>
          <Text style={styles.title}>Blinkit Print</Text>
          <Text style={styles.text}>
            Upload files or photos and get prints delivered to your door.
          </Text>
        </View>

        <Pressable style={[styles.action, shadows.soft]}>
          <View style={styles.actionIcon}>
            <FileText size={20} color={colors.accent} />
          </View>
          <View style={styles.actionCopy}>
            <Text style={styles.actionTitle}>Print documents</Text>
            <Text style={styles.actionHint}>PDF, DOC, up to 50 pages</Text>
          </View>
          <Upload size={18} color={colors.textMuted} />
        </Pressable>

        <Pressable style={[styles.action, shadows.soft]}>
          <View style={styles.actionIcon}>
            <ImageIcon size={20} color={colors.accent} />
          </View>
          <View style={styles.actionCopy}>
            <Text style={styles.actionTitle}>Print photos</Text>
            <Text style={styles.actionHint}>4x6, Polaroid & more</Text>
          </View>
          <Upload size={18} color={colors.textMuted} />
        </Pressable>
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
  hero: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.xxl,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroIcon: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginTop: spacing.md,
    fontSize: 20,
    fontWeight: "900",
    color: colors.text,
  },
  text: {
    marginTop: spacing.sm,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 19,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  actionCopy: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.text,
  },
  actionHint: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "500",
  },
});
