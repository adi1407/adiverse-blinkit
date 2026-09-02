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
  FlatList,
  Alert,
  Modal,
  KeyboardAvoidingView,
} from "react-native";
import {
  ChevronLeft,
  MapPin,
  House,
  Briefcase,
  Check,
  Plus,
  Trash2,
} from "../utils/lucideIcons";
import { useAddress } from "../context/AddressContext";
import { colors, spacing, radii, shadows } from "../theme/colors";

function labelIcon(label) {
  const key = String(label || "").toLowerCase();
  if (key.includes("work") || key.includes("office")) return Briefcase;
  return House;
}

export default function AddressesScreen({ navigation }) {
  const {
    addresses,
    selectedId,
    selectAddress,
    addAddress,
    removeAddress,
  } = useAddress();

  const [modalOpen, setModalOpen] = useState(false);
  const [label, setLabel] = useState("Home");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSelect(id) {
    await selectAddress(id);
    if (navigation.canGoBack()) navigation.goBack();
  }

  async function onSave() {
    setError("");
    setBusy(true);
    try {
      await addAddress({ label, line1, line2 });
      setModalOpen(false);
      setLine1("");
      setLine2("");
      setLabel("Home");
    } catch (err) {
      setError(err.message || "Could not save address");
    } finally {
      setBusy(false);
    }
  }

  function onDelete(item) {
    Alert.alert("Remove address?", item.line1, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          try {
            await removeAddress(item.id);
          } catch (err) {
            Alert.alert("Oops", err.message);
          }
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <ChevronLeft size={24} color={colors.text} strokeWidth={2.4} />
        </Pressable>
        <Text style={styles.headerTitle}>Delivery address</Text>
        <View style={styles.iconBtn} />
      </View>
      <View style={styles.curve} />

      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={styles.hint}>Tap an address to deliver here</Text>
        }
        renderItem={({ item }) => {
          const Icon = labelIcon(item.label);
          const selected = item.id === selectedId;
          return (
            <Pressable
              style={[styles.card, selected && styles.cardSelected, shadows.soft]}
              onPress={() => onSelect(item.id)}
            >
              <View style={styles.cardIcon}>
                <Icon size={18} color={colors.accent} strokeWidth={2.2} />
              </View>
              <View style={styles.cardCopy}>
                <Text style={styles.cardLabel}>{item.label}</Text>
                <Text style={styles.cardLine}>{item.line1}</Text>
                {item.line2 ? (
                  <Text style={styles.cardSub}>{item.line2}</Text>
                ) : null}
              </View>
              {selected ? (
                <View style={styles.check}>
                  <Check size={16} color={colors.white} strokeWidth={2.6} />
                </View>
              ) : (
                <Pressable
                  onPress={() => onDelete(item)}
                  hitSlop={8}
                  style={styles.trash}
                >
                  <Trash2 size={15} color={colors.danger} strokeWidth={2.2} />
                </Pressable>
              )}
            </Pressable>
          );
        }}
        ListFooterComponent={
          <Pressable style={styles.addBtn} onPress={() => setModalOpen(true)}>
            <Plus size={18} color={colors.accent} strokeWidth={2.4} />
            <Text style={styles.addText}>Add new address</Text>
          </Pressable>
        }
      />

      <Modal visible={modalOpen} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={styles.modalRoot}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Pressable style={styles.backdrop} onPress={() => setModalOpen(false)} />
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>New address</Text>

            <Text style={styles.fieldLabel}>Label</Text>
            <View style={styles.chips}>
              {["Home", "Work", "Other"].map((chip) => (
                <Pressable
                  key={chip}
                  style={[styles.chip, label === chip && styles.chipOn]}
                  onPress={() => setLabel(chip)}
                >
                  <Text style={[styles.chipText, label === chip && styles.chipTextOn]}>
                    {chip}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Address line</Text>
            <TextInput
              style={styles.input}
              value={line1}
              onChangeText={setLine1}
              placeholder="House no., street, area"
              placeholderTextColor={colors.textMuted}
            />

            <Text style={styles.fieldLabel}>Landmark / city</Text>
            <TextInput
              style={styles.input}
              value={line2}
              onChangeText={setLine2}
              placeholder="Landmark, city, pincode"
              placeholderTextColor={colors.textMuted}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable
              style={[styles.saveBtn, busy && { opacity: 0.7 }]}
              onPress={onSave}
              disabled={busy}
            >
              <MapPin size={16} color={colors.white} strokeWidth={2.2} />
              <Text style={styles.saveText}>
                {busy ? "Saving…" : "Save & deliver here"}
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
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
  list: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    paddingBottom: 40,
  },
  hint: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: "600",
    marginBottom: spacing.md,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  cardSelected: {
    borderColor: colors.accent,
    backgroundColor: "#F3FBF4",
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  cardCopy: { flex: 1 },
  cardLabel: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 2,
  },
  cardLine: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  cardSub: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "500",
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  trash: { padding: 6 },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: colors.accent,
    borderStyle: "dashed",
    borderRadius: radii.lg,
    paddingVertical: 14,
    marginTop: spacing.sm,
  },
  addText: {
    color: colors.accent,
    fontWeight: "900",
    fontSize: 14,
  },
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  sheetHandle: {
    alignSelf: "center",
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderStrong,
    marginBottom: spacing.md,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.text,
    marginBottom: spacing.md,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.textSecondary,
    marginBottom: 6,
    marginTop: spacing.sm,
  },
  chips: {
    flexDirection: "row",
    gap: 8,
    marginBottom: spacing.sm,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipOn: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  chipTextOn: {
    color: colors.accentDark,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 46,
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  error: {
    marginTop: spacing.sm,
    color: colors.danger,
    fontWeight: "700",
    fontSize: 13,
  },
  saveBtn: {
    marginTop: spacing.lg,
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  saveText: {
    color: colors.white,
    fontWeight: "900",
    fontSize: 15,
  },
});
