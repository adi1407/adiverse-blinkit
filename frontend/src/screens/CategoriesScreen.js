import { useCallback, useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  View,
  Text,
  Pressable,
  Image,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ScreenHeader from "../components/ScreenHeader";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { fetchCategories } from "../api/catalogApi";
import { colors, spacing, radii, shadows } from "../theme/colors";
import { fonts } from "../theme/typography";

const GROUPS = [
  { id: "grocery", label: "Grocery", ids: ["c1", "c2", "c3", "c4", "c5", "c6"] },
  { id: "snacks", label: "Snacks", ids: ["c7", "c8"] },
  { id: "beauty", label: "Beauty", ids: ["c9", "c11"] },
  { id: "home", label: "Household", ids: ["c10", "c12", "c13", "c14", "c15", "c16"] },
];

export default function CategoriesScreen() {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadCategories = useCallback(async ({ silent = false } = {}) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    setError("");
    try {
      const data = await fetchCategories();
      setCategories(data);
      setSelectedId((prev) => prev || data[0]?.id || null);
    } catch (err) {
      setError(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const byId = useMemo(() => {
    const map = {};
    categories.forEach((c) => {
      map[c.id] = c;
    });
    return map;
  }, [categories]);

  const selected = byId[selectedId];
  const siblingIds =
    GROUPS.find((g) => g.ids.includes(selectedId))?.ids ||
    categories.map((c) => c.id);
  const rightTiles = siblingIds.map((id) => byId[id]).filter(Boolean);

  function openCategory(cat) {
    navigation.navigate("CategoryProducts", { categoryId: cat.id });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title="Categories"
        subtitle="Browse every aisle"
        compact
      />
      <View style={styles.curve} />

      {loading && categories.length === 0 ? (
        <LoadingState message="Loading categories..." />
      ) : error && categories.length === 0 ? (
        <ErrorState message={error} onRetry={() => loadCategories()} />
      ) : (
        <View style={styles.split}>
          <ScrollView
            style={styles.rail}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.railContent}
          >
            {categories.map((cat) => {
              const active = cat.id === selectedId;
              const label = String(cat.name).replace(/\n/g, " ");
              return (
                <Pressable
                  key={cat.id}
                  style={[styles.railItem, active && styles.railItemActive]}
                  onPress={() => setSelectedId(cat.id)}
                >
                  {active ? <View style={styles.railBar} /> : null}
                  <Text
                    style={[styles.railLabel, active && styles.railLabelActive]}
                    numberOfLines={3}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <ScrollView
            style={styles.pane}
            contentContainerStyle={styles.paneContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => loadCategories({ silent: true })}
                tintColor={colors.accent}
                colors={[colors.accent]}
              />
            }
          >
            {selected ? (
              <Pressable
                style={[styles.hero, shadows.soft]}
                onPress={() => openCategory(selected)}
              >
                {selected.image ? (
                  <Image
                    source={{ uri: selected.image }}
                    style={styles.heroImage}
                  />
                ) : (
                  <View
                    style={[styles.heroImage, { backgroundColor: selected.bg }]}
                  />
                )}
                <View style={styles.heroCopy}>
                  <Text style={styles.heroTitle}>
                    {String(selected.name).replace(/\n/g, " ")}
                  </Text>
                  <Text style={styles.heroCta}>Shop aisle →</Text>
                </View>
              </Pressable>
            ) : null}

            <Text style={styles.paneTitle}>In this section</Text>
            <View style={styles.grid}>
              {rightTiles.map((cat) => (
                <Pressable
                  key={cat.id}
                  style={styles.tileWrap}
                  onPress={() => openCategory(cat)}
                >
                  <View
                    style={[styles.tile, { backgroundColor: cat.bg }, shadows.soft]}
                  >
                    {cat.image ? (
                      <Image
                        source={{ uri: cat.image }}
                        style={styles.tileImage}
                      />
                    ) : null}
                  </View>
                  <Text style={styles.tileName} numberOfLines={2}>
                    {String(cat.name).replace(/\n/g, " ")}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>
      )}
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
  split: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: colors.background,
  },
  rail: {
    width: 92,
    backgroundColor: colors.surface,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  railContent: {
    paddingBottom: 110,
  },
  railItem: {
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 72,
  },
  railItemActive: {
    backgroundColor: colors.white,
  },
  railBar: {
    position: "absolute",
    left: 0,
    top: 10,
    bottom: 10,
    width: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  railLabel: {
    fontSize: 11,
    textAlign: "center",
    color: colors.textMuted,
    fontFamily: fonts.semiBold,
    lineHeight: 14,
  },
  railLabelActive: {
    color: colors.text,
    fontFamily: fonts.extraBold,
  },
  pane: {
    flex: 1,
  },
  paneContent: {
    padding: spacing.md,
    paddingBottom: 110,
  },
  hero: {
    height: 120,
    borderRadius: radii.lg,
    overflow: "hidden",
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  heroCopy: {
    flex: 1,
    justifyContent: "flex-end",
    padding: spacing.md,
    backgroundColor: "rgba(0,0,0,0.28)",
  },
  heroTitle: {
    color: colors.white,
    fontSize: 18,
    fontFamily: fonts.extraBold,
  },
  heroCta: {
    marginTop: 4,
    color: colors.primary,
    fontFamily: fonts.extraBold,
    fontSize: 13,
  },
  paneTitle: {
    fontSize: 15,
    fontFamily: fonts.extraBold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  tileWrap: {
    width: "48%",
    marginBottom: spacing.md,
  },
  tile: {
    width: "100%",
    aspectRatio: 1.05,
    borderRadius: radii.md,
    overflow: "hidden",
    marginBottom: 6,
  },
  tileImage: {
    width: "100%",
    height: "100%",
  },
  tileName: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    color: colors.text,
    textAlign: "center",
  },
});
