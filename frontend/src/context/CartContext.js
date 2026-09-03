import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Shared cart "brain" — any screen can add/remove items.
// Survives app reloads via AsyncStorage (same idea as login/addresses).

const CartContext = createContext(null);
const STORAGE_KEY = "@blinkit_clone_cart";

function sanitizeItems(raw) {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const id = item.id;
      const qty = Math.max(0, Math.floor(Number(item.qty) || 0));
      const price = Number(item.price);
      if (!id || qty < 1 || !Number.isFinite(price)) return null;

      return {
        id,
        name: String(item.name || "Product"),
        unit: String(item.unit || ""),
        price,
        mrp: Number.isFinite(Number(item.mrp)) ? Number(item.mrp) : price,
        image: item.image || null,
        categoryId: item.categoryId || undefined,
        qty,
      };
    })
    .filter(Boolean);
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (alive && raw) {
          const parsed = sanitizeItems(JSON.parse(raw));
          setItems(parsed);
        }
      } catch {
        // Corrupt storage — start with an empty cart
      } finally {
        if (alive) {
          hydrated.current = true;
          setReady(true);
        }
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  // Persist after hydration so the empty initial state never wipes the disk.
  useEffect(() => {
    if (!hydrated.current) return;

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items)).catch(() => {});
  }, [items]);

  function addItem(product) {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          unit: product.unit,
          price: product.price,
          mrp: product.mrp,
          image: product.image,
          categoryId: product.categoryId,
          qty: 1,
        },
      ];
    });
  }

  function increaseQty(productId) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, qty: item.qty + 1 } : item
      )
    );
  }

  function decreaseQty(productId) {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === productId ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  }

  function removeItem(productId) {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  function getQty(productId) {
    return items.find((item) => item.id === productId)?.qty ?? 0;
  }

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.qty, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      ready,
      addItem,
      increaseQty,
      decreaseQty,
      removeItem,
      clearCart,
      getQty,
      totalItems,
      totalPrice,
    }),
    [items, ready, totalItems, totalPrice]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return ctx;
}
