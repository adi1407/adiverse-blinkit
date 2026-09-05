import { createContext, useContext, useMemo, useState } from "react";
import { adminApi, getToken, setToken } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken());
  const [email, setEmail] = useState(() =>
    localStorage.getItem("blinkit_admin_email") || ""
  );

  const value = useMemo(
    () => ({
      token,
      email,
      isAuthed: Boolean(token),
      async login(nextEmail, password) {
        const data = await adminApi.login(nextEmail, password);
        setToken(data.token);
        setTokenState(data.token);
        setEmail(data.email);
        localStorage.setItem("blinkit_admin_email", data.email);
        return data;
      },
      logout() {
        setToken("");
        setTokenState("");
        setEmail("");
        localStorage.removeItem("blinkit_admin_email");
      },
    }),
    [token, email]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth requires AuthProvider");
  return ctx;
}
