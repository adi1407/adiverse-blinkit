import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RecentlyViewedContext = createContext(null);
const STORAGE_KEY = "@blinkit_clone_recently_viewed";
const MAX_ITEMS = 16;

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
        viewedAt: item.viewedAt || new Date().toISOString(),
      };
    })
    .filter(Boolean)
    .slice(0, MAX_ITEMS);
}

export function RecentlyViewedProvider({ children }) {
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
        // corrupt → empty
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

  const trackView = useCallback((product) => {
    if (!product?.id) return;

    setItems((prev) => {
      const next = [
        {
          id: product.id,
          name: product.name,
          unit: product.unit,
          price: product.price,
          mrp: product.mrp,
          image: product.image,
          categoryId: product.categoryId,
          viewedAt: new Date().toISOString(),
        },
        ...prev.filter((item) => item.id !== product.id),
      ];
      return next.slice(0, MAX_ITEMS);
    });
  }, []);

  const clearRecent = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo(
    () => ({
      items,
      ready,
      count: items.length,
      trackView,
      clearRecent,
    }),
    [items, ready, trackView, clearRecent]
  );

  return (
    <RecentlyViewedContext.Provider value={value}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx) {
    throw new Error("useRecentlyViewed must be used inside RecentlyViewedProvider");
  }
  return ctx;
}
