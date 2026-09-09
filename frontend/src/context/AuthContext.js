import { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sendOtp as apiSendOtp, verifyOtp as apiVerifyOtp } from "../api/authApi";
import { setShopperToken } from "../api/client";

const AuthContext = createContext(null);
const STORAGE_KEY = "@blinkit_clone_user";

function normalizeStoredUser(raw) {
  if (!raw?.phone) return null;
  const phone = String(raw.phone).replace(/\D/g, "");
  if (phone.length !== 10) return null;
  const token = raw.token || null;
  // Pre-auth sessions (phone only, no Bearer) are treated as logged out so
  // the user re-verifies OTP instead of hitting 401s on every request.
  if (!token) return null;
  return {
    name: String(raw.name || "").trim() || "Blinkit User",
    phone,
    sessionId: raw.sessionId || null,
    token,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (alive && raw) {
          const next = normalizeStoredUser(JSON.parse(raw));
          if (next) {
            setShopperToken(next.token);
            setUser(next);
          } else {
            await AsyncStorage.removeItem(STORAGE_KEY);
            setShopperToken("");
          }
        }
      } catch {
        // Corrupt storage — start logged out
        setShopperToken("");
      } finally {
        if (alive) setReady(true);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  async function requestOtp({ name, phone }) {
    const cleanPhone = String(phone || "").replace(/\D/g, "");
    const cleanName = String(name || "").trim() || "Blinkit User";

    if (cleanPhone.length !== 10) {
      throw new Error("Enter a valid 10-digit mobile number");
    }

    return apiSendOtp({ phone: cleanPhone, name: cleanName });
  }

  async function verifyOtpAndLogin({ name, phone, otp }) {
    const cleanPhone = String(phone || "").replace(/\D/g, "");
    const cleanName = String(name || "").trim() || "Blinkit User";
    const code = String(otp || "").replace(/\D/g, "");

    if (cleanPhone.length !== 10) {
      throw new Error("Enter a valid 10-digit mobile number");
    }
    if (code.length !== 6) {
      throw new Error("Enter the 6-digit OTP");
    }

    const data = await apiVerifyOtp({
      phone: cleanPhone,
      otp: code,
      name: cleanName,
    });

    const token = data.token || data.user?.token;
    if (!token) {
      throw new Error("Login succeeded but no session token was returned");
    }

    const nextUser = {
      name: data.user?.name || cleanName,
      phone: data.user?.phone || cleanPhone,
      sessionId: data.user?.sessionId || null,
      token,
    };

    setShopperToken(token);
    setUser(nextUser);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    return nextUser;
  }

  /** @deprecated Prefer requestOtp + verifyOtpAndLogin */
  async function login({ name, phone, otp }) {
    if (otp) {
      return verifyOtpAndLogin({ name, phone, otp });
    }
    throw new Error("OTP required — request a code first");
  }

  async function logout() {
    setUser(null);
    setShopperToken("");
    await AsyncStorage.removeItem(STORAGE_KEY);
  }

  async function updateProfile({ name }) {
    if (!user?.phone || !user?.token) {
      throw new Error("Login required to edit profile");
    }

    const cleanName = String(name || "").trim();
    if (cleanName.length < 2) {
      throw new Error("Enter a name with at least 2 characters");
    }
    if (cleanName.length > 40) {
      throw new Error("Name is too long (max 40 characters)");
    }

    const nextUser = {
      ...user,
      name: cleanName,
    };

    setUser(nextUser);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    return nextUser;
  }

  const value = useMemo(
    () => ({
      user,
      ready,
      isLoggedIn: Boolean(user?.token),
      login,
      requestOtp,
      verifyOtpAndLogin,
      logout,
      updateProfile,
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
