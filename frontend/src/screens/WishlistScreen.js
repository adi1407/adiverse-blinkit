import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  FlatList,
  Pressable,
  Alert,
} from "react-native";
import { Heart, ShoppingCart } from "../utils/lucideIcons";
import ScreenHeader from "../components/ScreenHeader";
import ProductCard from "../components/ProductCard";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { colors, spacing, radii, shadows } from "../theme/colors";
import { fonts } from "../theme/typography";

export default function WishlistScreen({ navigation }) {
  const { items, count, clearWishlist } = useWishlist();
  const { addItem } = useCart();
  const isEmpty = items.length === 0;

  function onAddAll() {
    items.forEach((item) => addItem(item));
    Alert.alert("Added to cart", `${count} item${count === 1 ? "" : "s"} added.`);
  }

  function onClear() {
    Alert.alert("Clear wishlist?", "Remove all saved items?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", style: "destructive", onPress: clearWishlist },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        showBack
        title="Wishlist"
        subtitle={
          isEmpty
            ? "Save products you love"
            : `${count} saved item${count === 1 ? "" : "s"}`
        }
      />
      <View style={styles.curve} />

      {isEmpty ? (
        <View style={styles.body}>
          <View style={[styles.emptyBox, shadows.soft]}>
            <View style={styles.emptyIcon}>
              <Heart size={30} color={colors.danger} strokeWidth={1.8} />
            </View>
            <Text style={styles.emptyTitle}>Nothing saved yet</Text>
            <Text style={styles.emptyText}>
              Tap the heart on any product card to save it for later.
            </Text>
            <Pressable
              style={styles.shopBtn}
              onPress={() => navigation.navigate("MainTabs", { screen: "Home" })}
            >
              <Text style={styles.shopText}>Browse products</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.filled}>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.gridRow}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={styles.actionsBar}>
                <Pressable style={styles.clearBtn} onPress={onClear}>
                  <Text style={styles.clearText}>Clear</Text>
                </Pressable>
                <Pressable style={styles.addAllBtn} onPress={onAddAll}>
                  <ShoppingCart size={15} color={colors.white} strokeWidth={2.2} />
                  <Text style={styles.addAllText}>Add all</Text>
                </Pressable>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.cell}>
                <ProductCard product={item} variant="grid" />
              </View>
            )}
          />
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
  body: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: "center",
  },
  emptyBox: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#FDECEC",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    marginTop: spacing.md,
    fontSize: 17,
    fontFamily: fonts.extraBold,
    color: colors.text,
  },
  emptyText: {
    marginTop: spacing.sm,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 19,
    fontFamily: fonts.medium,
  },
  shopBtn: {
    marginTop: spacing.lg,
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: 12,
  },
  shopText: {
    color: colors.white,
    fontFamily: fonts.extraBold,
  },
  filled: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 40,
  },
  actionsBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  clearBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  clearText: {
    color: colors.textSecondary,
    fontFamily: fonts.bold,
    fontSize: 14,
  },
  addAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  addAllText: {
    color: colors.white,
    fontFamily: fonts.extraBold,
    fontSize: 14,
  },
  gridRow: {
    gap: spacing.md,
  },
  cell: {
    flex: 1,
  },
});
