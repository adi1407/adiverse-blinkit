import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import HomeNavbar from "../components/HomeNavbar";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { fetchCategories, fetchHomeData } from "../api/catalogApi";
import useScrollGlass from "../hooks/useScrollGlass";
import { colors, spacing } from "../theme/colors";
import { fonts } from "../theme/typography";

/**
 * Blinkit Categories page:
 * same yellow chrome as Home → 4 parent sections → 8 subcats each → 4 per row.
 */
const CATEGORY_SECTIONS = [
  {
    id: "grocery",
    title: "Grocery & Kitchen",
    hub: "all",
    tiles: [
      { id: "c1", name: "Fresh\nVegetables", bg: "#E8F5E9", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80" },
      { id: "c1", name: "Fresh\nFruits", bg: "#FFF3E0", image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=400&q=80", key: "fruits" },
      { id: "c2", name: "Dairy &\nBread", bg: "#E3F2FD", image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=400&q=80" },
      { id: "c2", name: "Eggs &\nCurd", bg: "#FCE4EC", image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=400&q=80", key: "eggs" },
      { id: "c3", name: "Atta &\nRice", bg: "#FFF8E1", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80" },
      { id: "c3", name: "Dal &\nPulses", bg: "#F3E5F5", image: "https://images.unsplash.com/photo-1516684669134-de6f7c473a2a?auto=format&fit=crop&w=400&q=80", key: "dal" },
      { id: "c4", name: "Masala &\nSpices", bg: "#FFEBEE", image: "https://images.unsplash.com/photo-1596040033229-a0b3b83f63b2?auto=format&fit=crop&w=400&q=80" },
      { id: "c4", name: "Oils &\nGhee", bg: "#E0F7FA", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80", key: "oil" },
    ],
  },
  {
    id: "snacks",
    title: "Snacks & Drinks",
    hub: "all",
    tiles: [
      { id: "c8", name: "Chips &\nNamkeen", bg: "#FFFDE7", image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=400&q=80" },
      { id: "c8", name: "Biscuits &\nCookies", bg: "#F3E5F5", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80", key: "biscuit" },
      { id: "c5", name: "Bakery &\nCakes", bg: "#FCE4EC", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80" },
      { id: "c8", name: "Chocolates\n& Sweets", bg: "#EFEBE9", image: "https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=400&q=80", key: "choco" },
      { id: "c7", name: "Cold\nDrinks", bg: "#E3F2FD", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80" },
      { id: "c7", name: "Juices &\nShakes", bg: "#E8F5E9", image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=400&q=80", key: "juice" },
      { id: "c7", name: "Energy &\nSports", bg: "#FFF3E0", image: "https://images.unsplash.com/photo-1622543925917-763c34d1a486?auto=format&fit=crop&w=400&q=80", key: "energy" },
      { id: "c6", name: "Meat &\nSeafood", bg: "#FFEBEE", image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=400&q=80" },
    ],
  },
  {
    id: "beauty",
    title: "Beauty & Personal Care",
    hub: "beauty",
    tiles: [
      { id: "c9", name: "Bath &\nBody", bg: "#E0F7FA", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=400&q=80" },
      { id: "c9", name: "Hair\nCare", bg: "#F3E5F5", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80", key: "hair" },
      { id: "c9", name: "Skin\nCare", bg: "#FCE4EC", image: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&w=400&q=80", key: "skin" },
      { id: "c9", name: "Oral\nCare", bg: "#E3F2FD", image: "https://images.unsplash.com/photo-1559591937-abc3a2bc4d0d?auto=format&fit=crop&w=400&q=80", key: "oral" },
      { id: "c9", name: "Men's\nGrooming", bg: "#ECEFF1", image: "https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=400&q=80", key: "men" },
      { id: "c11", name: "Baby\nCare", bg: "#FCE4EC", image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=400&q=80" },
      { id: "c11", name: "Diapers &\nWipes", bg: "#FFF3E0", image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=400&q=80", key: "diaper" },
      { id: "c9", name: "Hygiene &\nWellness", bg: "#E8F5E9", image: "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?auto=format&fit=crop&w=400&q=80", key: "hygiene" },
    ],
  },
  {
    id: "home",
    title: "Home & Lifestyle",
    hub: "decor",
    tiles: [
      { id: "c10", name: "Cleaners &\nDetergents", bg: "#F1F8E9", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80" },
      { id: "c10", name: "Kitchen &\nDining", bg: "#FFF8E1", image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=400&q=80", key: "kitchen" },
      { id: "c12", name: "Pet\nCare", bg: "#FFF3E0", image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=400&q=80" },
      { id: "c13", name: "Stationery\n& Books", bg: "#E8EAF6", image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=400&q=80" },
      { id: "c14", name: "Batteries &\nPower", bg: "#ECEFF1", image: "https://images.unsplash.com/photo-1619643082566-b9a2c3f1f0c2?auto=format&fit=crop&w=400&q=80" },
      { id: "c15", name: "Bulbs &\nElectrical", bg: "#FFF8E1", image: "https://images.unsplash.com/photo-1565814636199-ae80925dcbd0?auto=format&fit=crop&w=400&q=80" },
      { id: "c16", name: "Festive &\nPooja", bg: "#FFF3E0", image: "https://images.unsplash.com/photo-1604608672516-f1b9b1c37076?auto=format&fit=crop&w=400&q=80" },
      { id: "c10", name: "Home\nEssentials", bg: "#E0F7FA", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80", key: "home" },
    ],
  },
];

function SubTile({ tile, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.tileItem,
        pressed && { opacity: 0.88, transform: [{ scale: 0.97 }] },
      ]}
      onPress={onPress}
    >
      <View style={[styles.tile, { backgroundColor: tile.bg }]}>
        {tile.image ? (
          <Image
            source={{ uri: tile.image }}
            style={styles.tileImage}
            resizeMode="cover"
          />
        ) : null}
      </View>
      <Text style={styles.tileName} numberOfLines={2}>
        {tile.name}
      </Text>
    </Pressable>
  );
}

function CategorySection({ section, onSelect }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.grid}>
        {section.tiles.slice(0, 8).map((tile, index) => (
          <SubTile
            key={tile.key || `${tile.id}-${tile.name}-${index}`}
            tile={tile}
            onPress={() => onSelect(tile)}
          />
        ))}
      </View>
    </View>
  );
}

export default function CategoriesScreen() {
  const navigation = useNavigation();
  const scrollRef = useRef(null);
  const sectionY = useRef({});
  const { scrolled, onScroll } = useScrollGlass({ threshold: 24 });
  const [hub, setHub] = useState("all");
  const [hubs, setHubs] = useState(null);
  const [minutes, setMinutes] = useState(8);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  const visibleSections = useMemo(() => {
    if (hub === "all") return CATEGORY_SECTIONS;
    if (hub === "beauty") return CATEGORY_SECTIONS.filter((s) => s.id === "beauty");
    if (hub === "decor" || hub === "gifting" || hub === "kids") {
      return CATEGORY_SECTIONS.filter((s) => s.id === "home" || s.id === "beauty");
    }
    if (hub === "electronics") {
      return CATEGORY_SECTIONS.filter((s) => s.id === "home");
    }
    return CATEGORY_SECTIONS;
  }, [hub]);

  const boot = useCallback(async ({ silent = false } = {}) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    setError("");
    try {
      const [cats, home] = await Promise.all([
        fetchCategories(),
        fetchHomeData("all").catch(() => null),
      ]);
      if (cats?.length) setReady(true);
      if (home?.deliveryInfo?.minutes) setMinutes(home.deliveryInfo.minutes);
      if (home?.lifestyleHubs) setHubs(home.lifestyleHubs);
    } catch (err) {
      setError(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    boot();
  }, [boot]);

  function openTile(tile) {
    navigation.navigate("CategoryProducts", { categoryId: tile.id });
  }

  function onSelectHub(id) {
    setHub(id);
    // Jump to first matching section when possible
    const match = CATEGORY_SECTIONS.find((s) => s.hub === id || s.id === id);
    if (match && sectionY.current[match.id] != null) {
      scrollRef.current?.scrollTo({
        y: Math.max(0, sectionY.current[match.id] - 8),
        animated: true,
      });
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ExpoStatusBar style="dark" />

      <HomeNavbar
        minutes={minutes}
        hubs={hubs}
        selectedHub={hub}
        onSelectHub={onSelectHub}
        scrolled={scrolled}
        onSearchPress={() => navigation.navigate("Search")}
        onMicPress={() => navigation.navigate("Search", { voice: true })}
      />

      {loading && !ready ? (
        <LoadingState message="Loading categories..." />
      ) : error && !ready ? (
        <ErrorState message={error} onRetry={() => boot()} />
      ) : (
        <ScrollView
          ref={scrollRef}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => boot({ silent: true })}
              tintColor={colors.accent}
              colors={[colors.accent]}
            />
          }
        >
          {visibleSections.map((section) => (
            <View
              key={section.id}
              onLayout={(e) => {
                sectionY.current[section.id] = e.nativeEvent.layout.y;
              }}
            >
              <CategorySection section={section} onSelect={openTile} />
            </View>
          ))}
          <View style={{ height: 110 }} />
        </ScrollView>
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
  list: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingTop: 4,
    paddingBottom: 16,
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingTop: 18,
    paddingBottom: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.extraBold,
    color: colors.text,
    letterSpacing: -0.4,
    marginBottom: 14,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  tileItem: {
    width: "23%",
    marginBottom: 14,
    alignItems: "center",
  },
  tile: {
    width: "100%",
    aspectRatio: 0.92,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  tileImage: {
    width: "100%",
    height: "100%",
  },
  tileName: {
    fontSize: 11,
    textAlign: "center",
    color: colors.text,
    lineHeight: 14,
    fontFamily: fonts.semiBold,
    minHeight: 28,
  },
});
