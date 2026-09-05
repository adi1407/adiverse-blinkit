import { useCallback, useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  StatusBar,
  Platform,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import HomeNavbar from "../components/HomeNavbar";
import HomeHeroBanner from "../components/HomeHeroBanner";
import CategoryBlock from "../components/CategoryBlock";
import DealsGrid from "../components/DealsGrid";
import ProductRow from "../components/ProductRow";
import { HomeFeedSkeleton } from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { fetchHomeData } from "../api/catalogApi";
import { useRecentlyViewed } from "../context/RecentlyViewedContext";
import useScrollGlass from "../hooks/useScrollGlass";
import { colors, spacing } from "../theme/colors";
import { fonts } from "../theme/typography";

const PAGE_SIZE = 4;

const ESSENTIAL_TINTS = {
  breakfast: "#FFF9E8",
  heatwave: "#E3F2FD",
  hosting: "#FCE4EC",
};

export default function HomeScreen() {
  const navigation = useNavigation();
  const { items: recentItems } = useRecentlyViewed();
  const { scrolled, onScroll } = useScrollGlass({
    threshold: 20,
    restoreBelow: 6,
  });
  const [expandedNavH, setExpandedNavH] = useState(168);
  const [collapsedNavH, setCollapsedNavH] = useState(72);
  const navPad = scrolled ? collapsedNavH : expandedNavH;
  const [data, setData] = useState(null);
  const [hub, setHub] = useState("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const loadHome = useCallback(async ({ silent = false } = {}) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    setError("");
    try {
      const homeData = await fetchHomeData(hub);
      setData(homeData);
      setVisibleCount(PAGE_SIZE);
    } catch (err) {
      setError(err.message || "Failed to load home data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [hub]);

  useEffect(() => {
    loadHome();
  }, [loadHome]);

  function onSelectHub(id) {
    if (id === hub) return;
    setHub(id);
  }

  function openCategory(tile) {
    navigation.navigate("CategoryProducts", { categoryId: tile.id });
  }

  const allSections = useMemo(() => {
    const apiSections = data?.sections || [];
    const feed = [];

    if (recentItems.length > 0) {
      feed.push({
        type: "product_rail",
        id: "sec-recent",
        title: "Recently viewed",
        products: recentItems,
      });
    }

    return [...apiSections.slice(0, 1), ...feed, ...apiSections.slice(1)];
  }, [data?.sections, recentItems]);

  const visibleSections = allSections.slice(0, visibleCount);
  const hasMore = visibleCount < allSections.length;

  function renderSection({ item: section }) {
    switch (section.type) {
      case "hero_banner":
        return (
          <HomeHeroBanner
            banners={section.banners}
            onCta={(banner) => {
              if (banner.hub && banner.hub !== hub) onSelectHub(banner.hub);
              else navigation.navigate("Categories");
            }}
          />
        );
      case "category_block":
        return (
          <CategoryBlock
            title={section.title}
            subtitle={section.subtitle}
            tiles={section.tiles}
            onSelect={openCategory}
            onViewAll={() => navigation.navigate("Categories")}
          />
        );
      case "deals_grid":
        return (
          <DealsGrid
            title={section.title}
            subtitle={section.subtitle}
            products={section.products}
          />
        );
      case "essentials":
        return (
          <ProductRow
            title={section.title}
            subtitle={section.subtitle}
            products={section.products}
            tint={ESSENTIAL_TINTS[section.theme]}
            onSeeAll={() => navigation.navigate("Categories")}
          />
        );
      case "product_rail":
      default:
        return (
          <ProductRow
            title={section.title}
            subtitle={section.subtitle}
            products={section.products}
            autoScroll={!!section.autoScroll}
            onSeeAll={() => navigation.navigate("Categories")}
          />
        );
    }
  }

  const navbar = (
    <HomeNavbar
      minutes={data?.deliveryInfo?.minutes || 8}
      hubs={data?.lifestyleHubs}
      selectedHub={hub}
      onSelectHub={onSelectHub}
      scrolled={scrolled}
      onSearchPress={() => navigation.navigate("Search")}
      onMicPress={() => navigation.navigate("Search", { voice: true })}
    />
  );

  if (loading && !data) {
    return (
      <SafeAreaView style={styles.safe}>
        <HomeNavbar
          minutes={8}
          selectedHub={hub}
          onSelectHub={onSelectHub}
          scrolled={false}
          onSearchPress={() => navigation.navigate("Search")}
          onMicPress={() => navigation.navigate("Search", { voice: true })}
        />
        <HomeFeedSkeleton />
      </SafeAreaView>
    );
  }

  if (error && !data) {
    return (
      <SafeAreaView style={styles.safe}>
        <ErrorState message={error} onRetry={() => loadHome()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ExpoStatusBar style="dark" />
      <View style={styles.body}>
        <FlatList
          style={styles.list}
          data={visibleSections}
          keyExtractor={(item) => item.id}
          renderItem={renderSection}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.content, { paddingTop: navPad }]}
          onScroll={onScroll}
          scrollEventThrottle={16}
          onEndReached={() => {
            if (hasMore) {
              setVisibleCount((c) =>
                Math.min(c + PAGE_SIZE, allSections.length)
              );
            }
          }}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            hasMore ? (
              <Text style={styles.loadingMore}>Loading more for you…</Text>
            ) : (
              <Text style={styles.end}>You’re all caught up</Text>
            )
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadHome({ silent: true })}
              tintColor={colors.accent}
              colors={[colors.accent]}
              progressBackgroundColor={colors.white}
              progressViewOffset={navPad}
            />
          }
        />

        {/* Overlay so feed scrolls under — enables real frosted glass */}
        <View
          style={styles.navOverlay}
          onLayout={(e) => {
            const h = Math.ceil(e.nativeEvent.layout.height);
            if (h <= 0) return;
            if (scrolled) {
              if (Math.abs(h - collapsedNavH) > 1) setCollapsedNavH(h);
            } else if (Math.abs(h - expandedNavH) > 1) {
              setExpandedNavH(h);
            }
          }}
          pointerEvents="box-none"
        >
          {navbar}
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
    position: "relative",
  },
  navOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 40,
  },
  list: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 130,
  },
  loadingMore: {
    textAlign: "center",
    paddingVertical: spacing.lg,
    color: colors.textMuted,
    fontFamily: fonts.semiBold,
    fontSize: 12,
  },
  end: {
    textAlign: "center",
    paddingVertical: spacing.xl,
    color: colors.textMuted,
    fontFamily: fonts.bold,
    fontSize: 12,
  },
});
