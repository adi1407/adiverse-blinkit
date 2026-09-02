import { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddressContext = createContext(null);
const STORAGE_KEY = "@blinkit_clone_addresses";

const DEFAULT_ADDRESSES = [
  {
    id: "addr_home",
    label: "Home",
    line1: "12th Cross, Indiranagar",
    line2: "Bengaluru, Karnataka 560038",
  },
  {
    id: "addr_work",
    label: "Work",
    line1: "Manyata Tech Park, Nagavara",
    line2: "Bengaluru, Karnataka 560045",
  },
];

export function AddressProvider({ children }) {
  const [addresses, setAddresses] = useState(DEFAULT_ADDRESSES);
  const [selectedId, setSelectedId] = useState(DEFAULT_ADDRESSES[0].id);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (alive && raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed.addresses) && parsed.addresses.length) {
            setAddresses(parsed.addresses);
          }
          if (parsed.selectedId) setSelectedId(parsed.selectedId);
        }
      } catch {
        // keep defaults
      } finally {
        if (alive) setReady(true);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  async function persist(nextAddresses, nextSelectedId) {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        addresses: nextAddresses,
        selectedId: nextSelectedId,
      })
    );
  }

  async function selectAddress(id) {
    setSelectedId(id);
    await persist(addresses, id);
  }

  async function addAddress({ label, line1, line2 }) {
    const cleanLabel = String(label || "").trim() || "Other";
    const cleanLine1 = String(line1 || "").trim();
    const cleanLine2 = String(line2 || "").trim();

    if (cleanLine1.length < 5) {
      throw new Error("Enter a fuller street address");
    }

    const next = {
      id: `addr_${Date.now().toString(36)}`,
      label: cleanLabel,
      line1: cleanLine1,
      line2: cleanLine2,
    };

    const nextAddresses = [...addresses, next];
    setAddresses(nextAddresses);
    setSelectedId(next.id);
    await persist(nextAddresses, next.id);
    return next;
  }

  async function removeAddress(id) {
    if (addresses.length <= 1) {
      throw new Error("Keep at least one delivery address");
    }

    const nextAddresses = addresses.filter((a) => a.id !== id);
    const nextSelectedId =
      selectedId === id ? nextAddresses[0].id : selectedId;

    setAddresses(nextAddresses);
    setSelectedId(nextSelectedId);
    await persist(nextAddresses, nextSelectedId);
  }

  const selectedAddress =
    addresses.find((a) => a.id === selectedId) || addresses[0] || null;

  const value = useMemo(
    () => ({
      ready,
      addresses,
      selectedId,
      selectedAddress,
      selectAddress,
      addAddress,
      removeAddress,
    }),
    [ready, addresses, selectedId, selectedAddress]
  );

  return (
    <AddressContext.Provider value={value}>{children}</AddressContext.Provider>
  );
}

export function useAddress() {
  const ctx = useContext(AddressContext);
  if (!ctx) {
    throw new Error("useAddress must be used inside AddressProvider");
  }
  return ctx;
}
