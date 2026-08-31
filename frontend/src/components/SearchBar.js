import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radii } from "../theme/colors";

export default function SearchBar() {
  return (
    <View style={styles.wrap}>
      <Pressable style={styles.bar}>
        <Ionicons name="search" size={20} color={colors.textMuted} />
        <Text style={styles.placeholder}>Search "milk"</Text>
        <View style={styles.micWrap}>
          <Ionicons name="mic-outline" size={20} color={colors.text} />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    height: 46,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  placeholder: {
    flex: 1,
    fontSize: 15,
    color: colors.textMuted,
  },
  micWrap: {
    paddingLeft: spacing.sm,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
});
