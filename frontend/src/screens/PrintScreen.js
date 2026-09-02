import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenHeader from "../components/ScreenHeader";
import { colors, spacing, radii } from "../theme/colors";

export default function PrintScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Print" subtitle="Documents & photos in minutes" />
      <View style={styles.body}>
        <View style={styles.card}>
          <Ionicons name="print-outline" size={56} color={colors.accent} />
          <Text style={styles.title}>Blinkit Print</Text>
          <Text style={styles.text}>
            Upload documents or photos and get them delivered. Full print flow
            comes in a later chunk — UI placeholder for now.
          </Text>
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
  body: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: "center",
  },
  card: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.xxl,
  },
  title: {
    marginTop: spacing.md,
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
  },
  text: {
    marginTop: spacing.sm,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});
