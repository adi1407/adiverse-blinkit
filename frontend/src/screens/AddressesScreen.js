import { useMemo, useState } from "react";
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
  ScrollView,
} from "react-native";
import {
  ChevronLeft,
  MapPin,
  House,
  Briefcase,
  Check,
  Plus,
  Trash2,
  Bike,
} from "../utils/lucideIcons";
import AddressPinMap from "../components/AddressPinMap";
import { useAddress } from "../context/AddressContext";
import {
  AREA_PRESETS,
  checkServiceability,
  normalizePincode,
} from "../utils/serviceability";
import { colors, spacing, radii, shadows } from "../theme/colors";
import { fonts } from "../theme/typography";

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
  const [pincode, setPincode] = useState(AREA_PRESETS[0].pincode);
  const [areaId, setAreaId] = useState(AREA_PRESETS[0].id);
  const [lat, setLat] = useState(AREA_PRESETS[0].lat);
  const [lng, setLng] = useState(AREA_PRESETS[0].lng);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const service = useMemo(
    () => checkServiceability(pincode),
    [pincode]
  );

  function resetForm(area = AREA_PRESETS[0]) {
    setLabel("Home");
    setLine1(area.line1);
    setLine2(`${area.city}`);
    setPincode(area.pincode);
    setAreaId(area.id);
    setLat(area.lat);
    setLng(area.lng);
    setError("");
  }

  function openModal() {
    resetForm(AREA_PRESETS[0]);
    setModalOpen(true);
  }

  function onSelectArea(area) {
    setAreaId(area.id);
    setPincode(area.pincode);
    setLat(area.lat);
    setLng(area.lng);
    if (!line1.trim() || AREA_PRESETS.some((a) => a.line1 === line1)) {
      setLine1(area.line1);
    }
    if (!line2.trim() || AREA_PRESETS.some((a) => a.city === line2)) {
      setLine2(area.city);
    }
  }

  async function onSelect(id) {
    try {
      await selectAddress(id);
      if (navigation.canGoBack()) navigation.goBack();
    } catch (err) {
      Alert.alert("Not serviceable", err.message || "Pick another address");
    }
  }

  async function onSave() {
    setError("");
    setBusy(true);
    try {
      await addAddress({
        label,
        line1,
        line2,
        pincode,
        lat,
        lng,
        areaId,
      });
      setModalOpen(false);
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
          <Text style={styles.hint}>
            Tap an address to deliver here · Bengaluru only
          </Text>
        }
        renderItem={({ item }) => {
          const Icon = labelIcon(item.label);
          const selected = item.id === selectedId;
          const unserviceable = item.serviceable === false;
          return (
            <Pressable
              style={[
                styles.card,
                selected && styles.cardSelected,
                unserviceable && styles.cardBad,
                shadows.soft,
              ]}
              onPress={() => onSelect(item.id)}
            >
              <View style={styles.cardIcon}>
                <Icon size={18} color={colors.accent} strokeWidth={2.2} />
              </View>
              <View style={styles.cardCopy}>
                <Text style={styles.cardLabel}>{item.label}</Text>
                <Text style={styles.cardLine}>{item.line1}</Text>
                <Text style={styles.cardSub}>
                  {[item.line2, item.pincode].filter(Boolean).join(" · ")}
                </Text>
                <View style={styles.metaRow}>
                  {item.serviceable !== false && item.etaMinutes ? (
                    <View style={styles.etaPill}>
                      <Bike size={11} color={colors.accentDark} strokeWidth={2.4} />
                      <Text style={styles.etaText}>{item.etaMinutes} mins</Text>
                    </View>
                  ) : (
                    <View style={styles.badPill}>
                      <Text style={styles.badText}>Not serviceable</Text>
                    </View>
                  )}
                  {item.darkStore ? (
                    <Text style={styles.storeText}>{item.darkStore}</Text>
                  ) : null}
                </View>
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
          <Pressable style={styles.addBtn} onPress={openModal}>
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

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.fieldLabel}>Drop pin on map</Text>
              <AddressPinMap
                selectedAreaId={areaId}
                onSelectArea={onSelectArea}
                serviceable={service.serviceable}
              />

              <Text style={styles.fieldLabel}>Label</Text>
              <View style={styles.chips}>
                {["Home", "Work", "Other"].map((chip) => (
                  <Pressable
                    key={chip}
                    style={[styles.chip, label === chip && styles.chipOn]}
                    onPress={() => setLabel(chip)}
                  >
                    <Text
                      style={[styles.chipText, label === chip && styles.chipTextOn]}
                    >
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

              <Text style={styles.fieldLabel}>Landmark</Text>
              <TextInput
                style={styles.input}
                value={line2}
                onChangeText={setLine2}
                placeholder="Landmark or building"
                placeholderTextColor={colors.textMuted}
              />

              <Text style={styles.fieldLabel}>Pincode</Text>
              <TextInput
                style={styles.input}
                value={pincode}
                onChangeText={(t) => setPincode(normalizePincode(t))}
                placeholder="560038"
                placeholderTextColor={colors.textMuted}
                keyboardType="number-pad"
                maxLength={6}
              />

              <View
                style={[
                  styles.serviceBanner,
                  service.serviceable ? styles.serviceOk : styles.serviceBad,
                ]}
              >
                <MapPin
                  size={14}
                  color={service.serviceable ? colors.accentDark : colors.danger}
                  strokeWidth={2.3}
                />
                <Text
                  style={[
                    styles.serviceText,
                    !service.serviceable && styles.serviceTextBad,
                  ]}
                >
                  {service.message}
                </Text>
              </View>

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <Pressable
                style={[
                  styles.saveBtn,
                  (busy || !service.serviceable) && { opacity: 0.55 },
                ]}
                onPress={onSave}
                disabled={busy || !service.serviceable}
              >
                <MapPin size={16} color={colors.white} strokeWidth={2.2} />
                <Text style={styles.saveText}>
                  {busy ? "Saving…" : "Save & deliver here"}
                </Text>
              </Pressable>
            </ScrollView>
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
    fontFamily: fonts.extraBold,
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
    fontFamily: fonts.semiBold,
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
  cardBad: {
    borderColor: "#F0B4B0",
    opacity: 0.9,
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
    fontFamily: fonts.extraBold,
    color: colors.text,
    marginBottom: 2,
  },
  cardLine: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.textSecondary,
  },
  cardSub: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: fonts.medium,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  etaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  etaText: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.accentDark,
  },
  badPill: {
    backgroundColor: "#FFF1F2",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badText: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.danger,
  },
  storeText: {
    fontSize: 11,
    fontFamily: fonts.semiBold,
    color: colors.textMuted,
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
    fontFamily: fonts.extraBold,
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
    maxHeight: "92%",
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
    fontFamily: fonts.extraBold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  fieldLabel: {
    fontSize: 12,
    fontFamily: fonts.bold,
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
    fontFamily: fonts.bold,
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
    fontFamily: fonts.semiBold,
    color: colors.text,
  },
  serviceBanner: {
    marginTop: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: radii.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  serviceOk: {
    backgroundColor: colors.accentSoft,
  },
  serviceBad: {
    backgroundColor: "#FFF1F2",
  },
  serviceText: {
    flex: 1,
    fontSize: 12,
    fontFamily: fonts.semiBold,
    color: colors.accentDark,
  },
  serviceTextBad: {
    color: colors.danger,
  },
  error: {
    marginTop: spacing.sm,
    color: colors.danger,
    fontFamily: fonts.bold,
    fontSize: 13,
  },
  saveBtn: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
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
    fontFamily: fonts.extraBold,
    fontSize: 15,
  },
});
