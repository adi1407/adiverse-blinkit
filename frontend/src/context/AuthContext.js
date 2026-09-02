import { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Shared auth "brain" — mock phone login, persisted on device.

const AuthContext = createContext(null);
const STORAGE_KEY = "@blinkit_clone_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (alive && raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.phone) setUser(parsed);
        }
      } catch {
        // Corrupt storage — start logged out
      } finally {
        if (alive) setReady(true);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  async function login({ name, phone }) {
    const cleanPhone = String(phone || "").replace(/\D/g, "");
    const cleanName = String(name || "").trim() || "Blinkit User";

    if (cleanPhone.length !== 10) {
      throw new Error("Enter a valid 10-digit mobile number");
    }

    const nextUser = {
      name: cleanName,
      phone: cleanPhone,
      sessionId: `demo-${cleanPhone}`,
    };

    setUser(nextUser);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
  }

  async function logout() {
    setUser(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }

  const value = useMemo(
    () => ({
      user,
      ready,
      isLoggedIn: Boolean(user),
      login,
      logout,
    }),
    [user, ready]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
