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

const SearchHistoryContext = createContext(null);
const STORAGE_KEY = "@blinkit_clone_search_history";
const MAX_ITEMS = 10;

function sanitize(raw) {
  if (!Array.isArray(raw)) return [];
  const seen = new Set();
  const out = [];
  for (const item of raw) {
    const q = String(item || "")
      .trim()
      .toLowerCase()
      .slice(0, 40);
    if (q.length < 2 || seen.has(q)) continue;
    seen.add(q);
    out.push(q);
    if (out.length >= MAX_ITEMS) break;
  }
  return out;
}

export function SearchHistoryProvider({ children }) {
  const [recent, setRecent] = useState([]);
  const [ready, setReady] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (alive && raw) setRecent(sanitize(JSON.parse(raw)));
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
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(recent)).catch(() => {});
  }, [recent]);

  const addQuery = useCallback((raw) => {
    const q = String(raw || "")
      .trim()
      .toLowerCase()
      .slice(0, 40);
    if (q.length < 2) return;

    setRecent((prev) => sanitize([q, ...prev.filter((item) => item !== q)]));
  }, []);

  const removeQuery = useCallback((raw) => {
    const q = String(raw || "")
      .trim()
      .toLowerCase();
    setRecent((prev) => prev.filter((item) => item !== q));
  }, []);

  const clearHistory = useCallback(() => {
    setRecent([]);
  }, []);

  const value = useMemo(
    () => ({
      ready,
      recent,
      addQuery,
      removeQuery,
      clearHistory,
    }),
    [ready, recent, addQuery, removeQuery, clearHistory]
  );

  return (
    <SearchHistoryContext.Provider value={value}>
      {children}
    </SearchHistoryContext.Provider>
  );
}

export function useSearchHistory() {
  const ctx = useContext(SearchHistoryContext);
  if (!ctx) {
    throw new Error("useSearchHistory must be used inside SearchHistoryProvider");
  }
  return ctx;
}
