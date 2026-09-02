import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  FlatList,
  Pressable,
} from "react-native";
import { ShoppingCart } from "lucide-react-native";
import ScreenHeader from "../components/ScreenHeader";
import QtyStepper from "../components/QtyStepper";
import ProductImage from "../components/ProductImage";
import { useCart } from "../context/CartContext";
import { colors, spacing, radii } from "../theme/colors";

function CartRow({ item }) {
  const { increaseQty, decreaseQty, removeItem } = useCart();

  return (
    <View style={styles.row}>
      <ProductImage uri={item.image} style={styles.thumb} iconSize={22} />

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.unit}>{item.unit}</Text>
        <Text style={styles.price}>₹{item.price * item.qty}</Text>
      </View>

      <View style={styles.actions}>
        <QtyStepper
          qty={item.qty}
          onIncrease={() => increaseQty(item.id)}
          onDecrease={() => decreaseQty(item.id)}
        />
        <Pressable onPress={() => removeItem(item.id)} hitSlop={8}>
          <Text style={styles.remove}>Remove</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function CartScreen() {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const isEmpty = items.length === 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        showBack
        title="Cart"
        subtitle={
          isEmpty
            ? "Add products from Home or Categories"
            : `${totalItems} item${totalItems === 1 ? "" : "s"} in your cart`
        }
      />

      {isEmpty ? (
        <View style={styles.body}>
          <View style={styles.emptyBox}>
            <ShoppingCart size={56} color={colors.textMuted} strokeWidth={1.6} />
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptyText}>
              Tap ADD on any product. Come back here to change quantity.
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.filled}>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => <CartRow item={item} />}
          />

          <View style={styles.footer}>
            <View>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalPrice}>₹{totalPrice}</Text>
            </View>
            <Pressable style={styles.clearBtn} onPress={clearCart}>
              <Text style={styles.clearText}>Clear</Text>
            </Pressable>
            <Pressable style={styles.checkoutBtn}>
              <Text style={styles.checkoutText}>Checkout</Text>
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
  body: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: "center",
  },
  emptyBox: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.xxl,
  },
  emptyTitle: {
    marginTop: spacing.md,
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  emptyText: {
    marginTop: spacing.sm,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
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
    width: 56,
    height: 56,
    borderRadius: radii.sm,
    overflow: "hidden",
  },
  info: {
    flex: 1,
    marginHorizontal: spacing.md,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  unit: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textMuted,
  },
  price: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  actions: {
    alignItems: "flex-end",
    gap: spacing.sm,
  },
  remove: {
    fontSize: 12,
    color: colors.danger,
    fontWeight: "600",
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
  totalLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
  clearBtn: {
    marginLeft: "auto",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  clearText: {
    color: colors.textSecondary,
    fontWeight: "600",
  },
  checkoutBtn: {
    backgroundColor: colors.accent,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  checkoutText: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 14,
  },
});
