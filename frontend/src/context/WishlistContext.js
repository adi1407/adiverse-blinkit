import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WishlistContext = createContext(null);
const STORAGE_KEY = "@blinkit_clone_wishlist";

function sanitizeItems(raw) {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item) => {
      if (!item || typeof item !== "object" || !item.id) return null;
      const price = Number(item.price);
      if (!Number.isFinite(price)) return null;
      return {
        id: item.id,
        name: String(item.name || "Product"),
        unit: String(item.unit || ""),
        price,
        mrp: Number.isFinite(Number(item.mrp)) ? Number(item.mrp) : price,
        image: item.image || null,
        categoryId: item.categoryId || undefined,
        savedAt: item.savedAt || new Date().toISOString(),
      };
    })
    .filter(Boolean);
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (alive && raw) {
          setItems(sanitizeItems(JSON.parse(raw)));
        }
      } catch {
        // corrupt → empty wishlist
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

  useEffect(() => {
    if (!hydrated.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items)).catch(() => {});
  }, [items]);

  function isSaved(productId) {
    return items.some((item) => item.id === productId);
  }

  function toggleItem(product) {
    if (!product?.id) return;

    setItems((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        return prev.filter((item) => item.id !== product.id);
      }

      return [
        {
          id: product.id,
          name: product.name,
          unit: product.unit,
          price: product.price,
          mrp: product.mrp,
          image: product.image,
          categoryId: product.categoryId,
          savedAt: new Date().toISOString(),
        },
        ...prev,
      ];
    });
  }

  function removeItem(productId) {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  }

  function clearWishlist() {
    setItems([]);
  }

  const value = useMemo(
    () => ({
      items,
      ready,
      count: items.length,
      isSaved,
      toggleItem,
      removeItem,
      clearWishlist,
    }),
    [items, ready]
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }
  return ctx;
}
