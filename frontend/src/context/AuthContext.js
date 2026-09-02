import { createContext, useContext, useMemo, useState } from "react";

// Shared auth "brain" — mock phone login (no real OTP/server yet).

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  function login({ name, phone }) {
    const cleanPhone = String(phone || "").replace(/\D/g, "");
    const cleanName = String(name || "").trim() || "Blinkit User";

    if (cleanPhone.length !== 10) {
      throw new Error("Enter a valid 10-digit mobile number");
    }

    setUser({
      name: cleanName,
      phone: cleanPhone,
      // Demo session id — real apps get this from the server after OTP
      sessionId: `demo-${cleanPhone}`,
    });
  }

  function logout() {
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: Boolean(user),
      login,
      logout,
    }),
    [user]
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
