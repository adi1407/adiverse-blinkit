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
import { Heart, Trash2, ShoppingCart } from "../utils/lucideIcons";
import ScreenHeader from "../components/ScreenHeader";
import ProductImage from "../components/ProductImage";
import QtyStepper from "../components/QtyStepper";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { colors, spacing, radii, shadows } from "../theme/colors";

function WishlistRow({ item }) {
  const { removeItem } = useWishlist();
  const { getQty, addItem, increaseQty, decreaseQty } = useCart();
  const qty = getQty(item.id);

  return (
    <View style={[styles.row, shadows.soft]}>
      <ProductImage uri={item.image} style={styles.thumb} iconSize={22} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.unit}>{item.unit}</Text>
        <Text style={styles.price}>₹{item.price}</Text>
      </View>
      <View style={styles.actions}>
        {qty > 0 ? (
          <QtyStepper
            qty={qty}
            compact
            onIncrease={() => increaseQty(item.id)}
            onDecrease={() => decreaseQty(item.id)}
          />
        ) : (
          <Pressable style={styles.addBtn} onPress={() => addItem(item)}>
            <Text style={styles.addText}>ADD</Text>
          </Pressable>
        )}
        <Pressable onPress={() => removeItem(item.id)} hitSlop={8} style={styles.trash}>
          <Trash2 size={14} color={colors.danger} strokeWidth={2.2} />
        </Pressable>
      </View>
    </View>
  );
}

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
            contentContainerStyle={styles.list}
            renderItem={({ item }) => <WishlistRow item={item} />}
          />
          <View style={styles.footer}>
            <Pressable style={styles.clearBtn} onPress={onClear}>
              <Text style={styles.clearText}>Clear</Text>
            </Pressable>
            <Pressable style={styles.addAllBtn} onPress={onAddAll}>
              <ShoppingCart size={16} color={colors.white} strokeWidth={2.2} />
              <Text style={styles.addAllText}>Add all to cart</Text>
            </Pressable>
          </View>
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
    fontWeight: "900",
    color: colors.text,
  },
  emptyText: {
    marginTop: spacing.sm,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 19,
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
    fontWeight: "900",
  },
  filled: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.lg,
    paddingBottom: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: radii.sm,
    overflow: "hidden",
  },
  info: {
    flex: 1,
    marginHorizontal: spacing.md,
  },
  name: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  unit: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "600",
  },
  price: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "900",
    color: colors.text,
  },
  actions: {
    alignItems: "flex-end",
    gap: spacing.sm,
  },
  addBtn: {
    borderWidth: 1.2,
    borderColor: colors.accent,
    borderRadius: radii.sm,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.white,
    minWidth: 54,
    alignItems: "center",
  },
  addText: {
    color: colors.accent,
    fontWeight: "900",
    fontSize: 12,
  },
  trash: {
    padding: 4,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  clearBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  clearText: {
    color: colors.textSecondary,
    fontWeight: "700",
  },
  addAllBtn: {
    flex: 1,
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  addAllText: {
    color: colors.white,
    fontWeight: "900",
    fontSize: 15,
  },
});
