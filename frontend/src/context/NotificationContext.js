import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./AuthContext";
import { fetchOrders } from "../api/ordersApi";
import { statusLabel } from "../utils/orderStatus";

const NotificationContext = createContext(null);
const STORAGE_KEY = "@blinkit_clone_notifications";
const SNAP_KEY = "@blinkit_clone_order_status_snap";
const MAX_ITEMS = 40;
const POLL_MS = 12000;
const FRESH_ORDER_MS = 5 * 60 * 1000;

function titleForStatus(status) {
  switch (status) {
    case "confirmed":
      return "Order confirmed";
    case "packing":
      return "Packing your order";
    case "out_for_delivery":
      return "Out for delivery";
    case "delivered":
      return "Order delivered";
    case "cancelled":
      return "Order cancelled";
    default:
      return statusLabel(status);
  }
}

function bodyForStatus(status, orderId) {
  const short = String(orderId || "").slice(0, 12);
  switch (status) {
    case "confirmed":
      return `${short} · We’re getting it ready`;
    case "packing":
      return `${short} · Picked from the dark store`;
    case "out_for_delivery":
      return `${short} · Partner is on the way`;
    case "delivered":
      return `${short} · Hope you love it — rate anytime`;
    case "cancelled":
      return `${short} · This order was cancelled`;
    default:
      return short;
  }
}

function sanitizeList(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((n) => {
      if (!n?.id || !n?.orderId) return null;
      return {
        id: String(n.id),
        orderId: String(n.orderId),
        status: String(n.status || "confirmed"),
        title: String(n.title || "Update"),
        body: String(n.body || ""),
        createdAt: n.createdAt || new Date().toISOString(),
        read: Boolean(n.read),
      };
    })
    .filter(Boolean)
    .slice(0, MAX_ITEMS);
}

function makeNotif(order, status) {
  return {
    id: `n-${order.id}-${status}-${Date.now()}`,
    orderId: order.id,
    status,
    title: titleForStatus(status),
    body: bodyForStatus(status, order.id),
    createdAt: new Date().toISOString(),
    read: false,
  };
}

export function NotificationProvider({ children }) {
  const { user, isLoggedIn, ready: authReady } = useAuth();
  const [items, setItems] = useState([]);
  const [statusSnap, setStatusSnap] = useState({});
  const [ready, setReady] = useState(false);
  const hydrated = useRef(false);
  const snapRef = useRef({});
  const phone = user?.phone;

  useEffect(() => {
    snapRef.current = statusSnap;
  }, [statusSnap]);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const [rawList, rawSnap] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY),
          AsyncStorage.getItem(SNAP_KEY),
        ]);
        if (!alive) return;
        if (rawList) setItems(sanitizeList(JSON.parse(rawList)));
        if (rawSnap) {
          const parsed = JSON.parse(rawSnap);
          if (parsed && typeof parsed === "object") {
            setStatusSnap(parsed);
            snapRef.current = parsed;
          }
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

  useEffect(() => {
    if (!hydrated.current) return;
    AsyncStorage.setItem(SNAP_KEY, JSON.stringify(statusSnap)).catch(() => {});
  }, [statusSnap]);

  const prependMany = useCallback((nextNotifs) => {
    if (!nextNotifs.length) return;
    setItems((prev) => sanitizeList([...nextNotifs, ...prev]));
  }, []);

  const syncOrders = useCallback(async () => {
    if (!phone) return;
    try {
      const data = await fetchOrders(phone);
      const orders = Array.isArray(data?.orders)
        ? data.orders
        : Array.isArray(data)
          ? data
          : [];

      const snap = { ...snapRef.current };
      const fresh = [];
      const now = Date.now();

      for (const order of orders) {
        if (!order?.id) continue;
        const status = order.status || "confirmed";
        const prev = snap[order.id];

        if (prev === undefined) {
          snap[order.id] = status;
          const created = new Date(order.createdAt || 0).getTime();
          const isFresh =
            Number.isFinite(created) && now - created < FRESH_ORDER_MS;
          if (isFresh) {
            fresh.push(makeNotif(order, status));
          }
        } else if (prev !== status) {
          snap[order.id] = status;
          fresh.push(makeNotif(order, status));
        }
      }

      setStatusSnap(snap);
      snapRef.current = snap;
      if (fresh.length) {
        // Newest status first within this batch
        prependMany(fresh.reverse());
      }
    } catch {
      // offline / API down — keep existing list
    }
  }, [phone, prependMany]);

  /** Immediate local alert after checkout (before next poll). */
  const notifyOrderPlaced = useCallback(
    (order) => {
      if (!order?.id) return;
      const status = order.status || "confirmed";
      setStatusSnap((prev) => {
        const next = { ...prev, [order.id]: status };
        snapRef.current = next;
        return next;
      });
      prependMany([makeNotif(order, status)]);
    },
    [prependMany]
  );

  useEffect(() => {
    if (!authReady || !ready || !isLoggedIn || !phone) return undefined;

    syncOrders();
    const timer = setInterval(syncOrders, POLL_MS);

    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") syncOrders();
    });

    return () => {
      clearInterval(timer);
      sub.remove();
    };
  }, [authReady, ready, isLoggedIn, phone, syncOrders]);

  const unreadCount = useMemo(
    () => items.reduce((n, item) => n + (item.read ? 0 : 1), 0),
    [items]
  );

  const markRead = useCallback((id) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setItems((prev) => prev.map((item) => ({ ...item, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo(
    () => ({
      ready,
      items,
      unreadCount,
      syncOrders,
      notifyOrderPlaced,
      markRead,
      markAllRead,
      clearAll,
    }),
    [
      ready,
      items,
      unreadCount,
      syncOrders,
      notifyOrderPlaced,
      markRead,
      markAllRead,
      clearAll,
    ]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications must be used inside NotificationProvider");
  }
  return ctx;
}
