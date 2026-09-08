import { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  checkServiceability,
  enrichAddress,
  migrateAddress,
} from "../utils/serviceability";

const AddressContext = createContext(null);
const STORAGE_KEY = "@blinkit_clone_addresses_v2";
const LEGACY_KEY = "@blinkit_clone_addresses";

const DEFAULT_ADDRESSES = [
  enrichAddress({
    id: "addr_home",
    label: "Home",
    line1: "12th Cross, Indiranagar",
    line2: "Near metro · Bengaluru",
    pincode: "560038",
    areaId: "indir",
  }),
  enrichAddress({
    id: "addr_work",
    label: "Work",
    line1: "Manyata Tech Park, Nagavara",
    line2: "Gate 3 · Bengaluru",
    pincode: "560045",
    areaId: "nagavara",
  }),
];

export function AddressProvider({ children }) {
  const [addresses, setAddresses] = useState(DEFAULT_ADDRESSES);
  const [selectedId, setSelectedId] = useState(DEFAULT_ADDRESSES[0].id);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        let raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) {
          // One-time migrate from pre-pin storage
          const legacy = await AsyncStorage.getItem(LEGACY_KEY);
          if (legacy) {
            const parsed = JSON.parse(legacy);
            const migrated = (parsed.addresses || [])
              .map(migrateAddress)
              .filter(Boolean);
            raw = JSON.stringify({
              addresses: migrated.length ? migrated : DEFAULT_ADDRESSES,
              selectedId: parsed.selectedId || DEFAULT_ADDRESSES[0].id,
            });
            await AsyncStorage.setItem(STORAGE_KEY, raw);
          }
        }

        if (alive && raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed.addresses) && parsed.addresses.length) {
            setAddresses(parsed.addresses.map((a) => enrichAddress(a)));
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
    const target = addresses.find((a) => a.id === id);
    if (target && target.serviceable === false) {
      throw new Error("This location is outside our delivery area");
    }
    setSelectedId(id);
    await persist(addresses, id);
  }

  async function addAddress(payload) {
    const cleanLabel = String(payload.label || "").trim() || "Other";
    const cleanLine1 = String(payload.line1 || "").trim();
    const cleanLine2 = String(payload.line2 || "").trim();
    const pincode = String(payload.pincode || "").replace(/\D/g, "");

    if (cleanLine1.length < 5) {
      throw new Error("Enter a fuller street address");
    }

    const check = checkServiceability(pincode);
    if (!check.ok) {
      throw new Error(check.message || "We don’t deliver here yet");
    }

    const next = enrichAddress({
      id: `addr_${Date.now().toString(36)}`,
      label: cleanLabel,
      line1: cleanLine1,
      line2: cleanLine2,
      pincode,
      lat: payload.lat,
      lng: payload.lng,
      areaId: payload.areaId,
      city: check.city,
    });

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
      checkServiceability,
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
