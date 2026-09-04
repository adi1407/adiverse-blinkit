import { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
  Image,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import {
  Printer,
  Upload,
  Image as ImageIcon,
  FileText,
  MapPin,
  X,
  ChevronRight,
  PenLine,
} from "../utils/lucideIcons";
import ScreenHeader from "../components/ScreenHeader";
import { useAuth } from "../context/AuthContext";
import { useAddress } from "../context/AddressContext";
import { placePrintJob } from "../api/printApi";
import { colors, spacing, radii, shadows } from "../theme/colors";
import { fonts } from "../theme/typography";

const DOC_BW = 3;
const DOC_COLOR = 8;
const PHOTO_4X6 = 12;
const PHOTO_POLAROID = 25;
const DELIVERY = 15;

function formatBytes(n) {
  const size = Number(n) || 0;
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function PrintScreen({ navigation }) {
  const { isLoggedIn, user } = useAuth();
  const { selectedAddress } = useAddress();

  const [kind, setKind] = useState(null); // document | photo
  const [files, setFiles] = useState([]);
  const [color, setColor] = useState(false);
  const [photoSize, setPhotoSize] = useState("4x6");
  const [copies, setCopies] = useState(1);
  const [pages, setPages] = useState("1");
  const [placing, setPlacing] = useState(false);

  const quote = useMemo(() => {
    if (!files.length) {
      return { units: 0, printTotal: 0, deliveryFee: 0, grandTotal: 0, unitLabel: "" };
    }

    const copyCount = Math.max(1, Math.min(20, Number(copies) || 1));

    if (kind === "photo") {
      const unitPrice = photoSize === "polaroid" ? PHOTO_POLAROID : PHOTO_4X6;
      const units = files.length * copyCount;
      const printTotal = units * unitPrice;
      const deliveryFee = printTotal >= 99 ? 0 : DELIVERY;
      return {
        units,
        unitPrice,
        unitLabel: photoSize === "polaroid" ? "Polaroid" : "4×6",
        printTotal,
        deliveryFee,
        grandTotal: printTotal + deliveryFee,
        copies: copyCount,
      };
    }

    const pageCount = Math.max(1, Math.min(50, Number(pages) || 1));
    const unitPrice = color ? DOC_COLOR : DOC_BW;
    const units = pageCount * copyCount;
    const printTotal = units * unitPrice;
    const deliveryFee = printTotal >= 99 ? 0 : DELIVERY;
    return {
      units,
      unitPrice,
      unitLabel: color ? "color page" : "B&W page",
      printTotal,
      deliveryFee,
      grandTotal: printTotal + deliveryFee,
      copies: copyCount,
      pages: pageCount,
    };
  }, [files, kind, color, photoSize, copies, pages]);

  function resetComposer() {
    setKind(null);
    setFiles([]);
    setColor(false);
    setPhotoSize("4x6");
    setCopies(1);
    setPages("1");
  }

  async function pickDocuments() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "image/*",
        ],
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const picked = (result.assets || []).map((asset) => ({
        name: asset.name || "document",
        size: asset.size || 0,
        mimeType: asset.mimeType || "",
        uri: asset.uri,
      }));

      if (!picked.length) return;
      setKind("document");
      setFiles(picked);
      setPages(String(Math.min(50, Math.max(1, picked.length))));
    } catch (err) {
      Alert.alert("Could not open files", err.message || "Try again");
    }
  }

  async function pickPhotos() {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Permission needed",
          "Allow photo library access to print photos."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 0.85,
        selectionLimit: 12,
      });

      if (result.canceled) return;

      const picked = (result.assets || []).map((asset, index) => ({
        name: asset.fileName || `photo_${index + 1}.jpg`,
        size: asset.fileSize || 0,
        mimeType: asset.mimeType || "image/jpeg",
        uri: asset.uri,
      }));

      if (!picked.length) return;
      setKind("photo");
      setFiles(picked);
    } catch (err) {
      Alert.alert("Could not open photos", err.message || "Try again");
    }
  }

  function removeFile(uri) {
    setFiles((prev) => {
      const next = prev.filter((f) => f.uri !== uri);
      if (!next.length) resetComposer();
      return next;
    });
  }

  async function onPlaceJob() {
    if (!files.length) return;

    if (!isLoggedIn) {
      Alert.alert("Login required", "Please login to place a print order.", [
        { text: "Cancel", style: "cancel" },
        { text: "Login", onPress: () => navigation.navigate("Login") },
      ]);
      return;
    }

    if (!selectedAddress?.line1) {
      Alert.alert("Add address", "Pick a delivery address first.", [
        { text: "Add address", onPress: () => navigation.navigate("Addresses") },
      ]);
      return;
    }

    if (placing) return;
    setPlacing(true);

    try {
      const job = await placePrintJob({
        name: user.name,
        phone: user.phone,
        kind,
        color,
        copies: quote.copies,
        photoSize,
        pages: quote.pages,
        address: {
          label: selectedAddress.label,
          line1: selectedAddress.line1,
          line2: selectedAddress.line2 || "",
        },
        files: files.map((file) => ({
          name: file.name,
          size: file.size,
          mimeType: file.mimeType,
        })),
      });

      resetComposer();
      Alert.alert(
        "Print order placed!",
        `${job.id} · ₹${job.grandTotal} · arriving in minutes`,
        [
          {
            text: "View print jobs",
            onPress: () => navigation.navigate("PrintJobs"),
          },
          { text: "OK" },
        ]
      );
    } catch (err) {
      Alert.alert("Print failed", err.message || "Could not place print job");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Print" subtitle="Documents & photos in minutes" />
      <View style={styles.curve} />

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.hero, shadows.soft]}>
          <View style={styles.heroIcon}>
            <Printer size={32} color={colors.text} strokeWidth={1.8} />
          </View>
          <Text style={styles.title}>Print store</Text>
          <Text style={styles.text}>
            Documents & photos printed nearby — delivered to your door in minutes.
          </Text>
          <Pressable
            style={styles.jobsLink}
            onPress={() => {
              if (!isLoggedIn) {
                navigation.navigate("Login");
                return;
              }
              navigation.navigate("PrintJobs");
            }}
          >
            <Text style={styles.jobsLinkText}>Your print jobs</Text>
            <ChevronRight size={14} color={colors.accent} strokeWidth={2.6} />
          </Pressable>
        </View>

        <Pressable
          style={[styles.stationeryCard, shadows.soft]}
          onPress={() =>
            navigation.navigate("CategoryProducts", { categoryId: "c13" })
          }
        >
          <View style={styles.stationeryIcon}>
            <PenLine size={22} color={colors.text} strokeWidth={2.2} />
          </View>
          <View style={styles.stationeryCopy}>
            <Text style={styles.stationeryTitle}>Stationery & Pens</Text>
            <Text style={styles.stationeryHint}>
              Notebooks, pens, markers — shop the aisle
            </Text>
          </View>
          <ChevronRight size={18} color={colors.textMuted} strokeWidth={2.2} />
        </Pressable>

        {!kind ? (
          <View style={styles.serviceGrid}>
            <Pressable
              style={[styles.serviceCard, shadows.soft]}
              onPress={pickDocuments}
            >
              <View style={styles.serviceIcon}>
                <FileText size={28} color={colors.accent} strokeWidth={1.9} />
              </View>
              <Text style={styles.serviceTitle}>Documents</Text>
              <Text style={styles.serviceHint}>
                PDF, DOC · ₹{DOC_BW}/B&W · ₹{DOC_COLOR}/color
              </Text>
              <View style={styles.serviceCta}>
                <Upload size={14} color={colors.accent} strokeWidth={2.4} />
                <Text style={styles.serviceCtaText}>Upload files</Text>
              </View>
            </Pressable>

            <Pressable
              style={[styles.serviceCard, shadows.soft]}
              onPress={pickPhotos}
            >
              <View style={[styles.serviceIcon, styles.serviceIconPhoto]}>
                <ImageIcon size={28} color={colors.accent} strokeWidth={1.9} />
              </View>
              <Text style={styles.serviceTitle}>Photos</Text>
              <Text style={styles.serviceHint}>
                4×6 ₹{PHOTO_4X6} · Polaroid ₹{PHOTO_POLAROID}
              </Text>
              <View style={styles.serviceCta}>
                <Upload size={14} color={colors.accent} strokeWidth={2.4} />
                <Text style={styles.serviceCtaText}>Choose photos</Text>
              </View>
            </Pressable>
          </View>
        ) : (
          <View style={[styles.composer, shadows.soft]}>
            <View style={styles.composerHeader}>
              <Text style={styles.composerTitle}>
                {kind === "photo" ? "Photo print" : "Document print"}
              </Text>
              <Pressable onPress={resetComposer} hitSlop={8}>
                <Text style={styles.clearText}>Clear</Text>
              </Pressable>
            </View>

            {files.map((file) => (
              <View key={file.uri} style={styles.fileRow}>
                {kind === "photo" && file.uri ? (
                  <Image source={{ uri: file.uri }} style={styles.thumb} />
                ) : (
                  <View style={styles.fileIcon}>
                    <FileText size={16} color={colors.accent} />
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.fileName} numberOfLines={1}>
                    {file.name}
                  </Text>
                  <Text style={styles.fileMeta}>{formatBytes(file.size)}</Text>
                </View>
                <Pressable onPress={() => removeFile(file.uri)} hitSlop={8}>
                  <X size={16} color={colors.textMuted} />
                </Pressable>
              </View>
            ))}

            <Pressable
              style={styles.addMore}
              onPress={kind === "photo" ? pickPhotos : pickDocuments}
            >
              <Upload size={14} color={colors.accent} />
              <Text style={styles.addMoreText}>Add more</Text>
            </Pressable>

            {kind === "document" ? (
              <>
                <Text style={styles.fieldLabel}>Pages (estimate)</Text>
                <TextInput
                  value={pages}
                  onChangeText={(t) => setPages(t.replace(/[^\d]/g, "").slice(0, 2))}
                  keyboardType="number-pad"
                  style={styles.input}
                  placeholder="1–50"
                  placeholderTextColor={colors.textMuted}
                />

                <Text style={styles.fieldLabel}>Print mode</Text>
                <View style={styles.segment}>
                  <Pressable
                    style={[styles.segBtn, !color && styles.segOn]}
                    onPress={() => setColor(false)}
                  >
                    <Text style={[styles.segText, !color && styles.segTextOn]}>
                      B&W · ₹{DOC_BW}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[styles.segBtn, color && styles.segOn]}
                    onPress={() => setColor(true)}
                  >
                    <Text style={[styles.segText, color && styles.segTextOn]}>
                      Color · ₹{DOC_COLOR}
                    </Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.fieldLabel}>Photo size</Text>
                <View style={styles.segment}>
                  <Pressable
                    style={[styles.segBtn, photoSize === "4x6" && styles.segOn]}
                    onPress={() => setPhotoSize("4x6")}
                  >
                    <Text
                      style={[
                        styles.segText,
                        photoSize === "4x6" && styles.segTextOn,
                      ]}
                    >
                      4×6 · ₹{PHOTO_4X6}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.segBtn,
                      photoSize === "polaroid" && styles.segOn,
                    ]}
                    onPress={() => setPhotoSize("polaroid")}
                  >
                    <Text
                      style={[
                        styles.segText,
                        photoSize === "polaroid" && styles.segTextOn,
                      ]}
                    >
                      Polaroid · ₹{PHOTO_POLAROID}
                    </Text>
                  </Pressable>
                </View>
              </>
            )}

            <Text style={styles.fieldLabel}>Copies</Text>
            <View style={styles.copiesRow}>
              {[1, 2, 3, 5].map((n) => (
                <Pressable
                  key={n}
                  style={[styles.copyChip, copies === n && styles.copyOn]}
                  onPress={() => setCopies(n)}
                >
                  <Text style={[styles.copyText, copies === n && styles.copyTextOn]}>
                    {n}×
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              style={styles.addressRow}
              onPress={() => navigation.navigate("Addresses")}
            >
              <MapPin size={16} color={colors.accent} />
              <View style={{ flex: 1 }}>
                <Text style={styles.addressTitle}>
                  Deliver to {selectedAddress?.label || "address"}
                </Text>
                <Text style={styles.addressLine} numberOfLines={1}>
                  {selectedAddress?.line1 || "Add a delivery address"}
                </Text>
              </View>
              <Text style={styles.changeText}>Change</Text>
            </Pressable>

            <View style={styles.bill}>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>
                  {quote.units} × {quote.unitLabel}
                </Text>
                <Text style={styles.billValue}>₹{quote.printTotal}</Text>
              </View>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Delivery</Text>
                <Text
                  style={[
                    styles.billValue,
                    quote.deliveryFee === 0 && styles.free,
                  ]}
                >
                  {quote.deliveryFee === 0 ? "FREE" : `₹${quote.deliveryFee}`}
                </Text>
              </View>
              <View style={styles.billRow}>
                <Text style={styles.grandLabel}>Total</Text>
                <Text style={styles.grandValue}>₹{quote.grandTotal}</Text>
              </View>
            </View>

            <Pressable
              style={[styles.placeBtn, placing && styles.placeDisabled]}
              onPress={onPlaceJob}
              disabled={placing}
            >
              <Text style={styles.placeText}>
                {placing
                  ? "Placing…"
                  : isLoggedIn
                    ? `Place print · ₹${quote.grandTotal}`
                    : "Login to place print"}
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
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
  },
  bodyContent: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
  hero: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: radii.lg,
    padding: spacing.xxl,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  heroIcon: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginTop: spacing.md,
    fontSize: 20,
    fontFamily: fonts.extraBold,
    color: colors.text,
    letterSpacing: -0.4,
  },
  text: {
    marginTop: spacing.sm,
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 19,
  },
  jobsLink: {
    marginTop: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  jobsLinkText: {
    fontSize: 13,
    fontFamily: fonts.extraBold,
    color: colors.accent,
  },
  stationeryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  stationeryIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#E8EAF6",
    alignItems: "center",
    justifyContent: "center",
  },
  stationeryCopy: {
    flex: 1,
  },
  stationeryTitle: {
    fontSize: 15,
    fontFamily: fonts.extraBold,
    color: colors.text,
    letterSpacing: -0.2,
  },
  stationeryHint: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: fonts.medium,
  },
  serviceGrid: {
    gap: spacing.md,
  },
  serviceCard: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
    minHeight: 168,
    alignItems: "center",
    justifyContent: "center",
  },
  serviceIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  serviceIconPhoto: {
    backgroundColor: colors.surfaceWarm,
  },
  serviceTitle: {
    fontSize: 17,
    fontFamily: fonts.extraBold,
    color: colors.text,
    letterSpacing: -0.3,
  },
  serviceHint: {
    marginTop: 6,
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 17,
  },
  serviceCta: {
    marginTop: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  serviceCtaText: {
    fontSize: 13,
    fontFamily: fonts.extraBold,
    color: colors.accent,
  },
  composer: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  composerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  composerTitle: {
    fontSize: 16,
    fontFamily: fonts.extraBold,
    color: colors.text,
    letterSpacing: -0.25,
  },
  clearText: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.textMuted,
  },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  thumb: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  fileName: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
  },
  fileMeta: {
    marginTop: 2,
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: "600",
  },
  addMore: {
    marginTop: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
  },
  addMoreText: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.accent,
  },
  fieldLabel: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    fontSize: 12,
    fontWeight: "800",
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    backgroundColor: colors.surface,
  },
  segment: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  segBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.sm,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: colors.surface,
  },
  segOn: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  segText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.textSecondary,
  },
  segTextOn: {
    color: colors.accentDark,
  },
  copiesRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  copyChip: {
    minWidth: 48,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: "center",
    backgroundColor: colors.surface,
  },
  copyOn: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  copyText: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.textSecondary,
  },
  copyTextOn: {
    color: colors.accentDark,
  },
  addressRow: {
    marginTop: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  addressTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.text,
  },
  addressLine: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textSecondary,
  },
  changeText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.accent,
  },
  bill: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 6,
  },
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  billLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  billValue: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.text,
  },
  free: {
    color: colors.accent,
  },
  grandLabel: {
    fontSize: 15,
    fontFamily: fonts.extraBold,
    color: colors.text,
  },
  grandValue: {
    fontSize: 16,
    fontFamily: fonts.extraBold,
    color: colors.text,
  },
  placeBtn: {
    marginTop: spacing.lg,
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingVertical: 14,
    alignItems: "center",
  },
  placeDisabled: {
    opacity: 0.7,
  },
  placeText: {
    color: colors.white,
    fontFamily: fonts.extraBold,
    fontSize: 15,
  },
});
