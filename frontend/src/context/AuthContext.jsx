import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api, { setAuthToken } from "../lib/api";

const STORAGE_KEY = "smk_auth_token";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      setAuthToken(cached);
    }
    return cached;
  });
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let active = true;

    const syncSession = async () => {
      if (!token) {
        setAuthToken(null);
        localStorage.removeItem(STORAGE_KEY);
        if (active) {
          setUser(null);
          setInitializing(false);
        }
        return;
      }

      setAuthToken(token);
      localStorage.setItem(STORAGE_KEY, token);
      if (active) {
        setInitializing(true);
      }

      try {
        const { data } = await api.get("/auth/me");
        if (active) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to sync session", error);
        localStorage.removeItem(STORAGE_KEY);
        setAuthToken(null);
        if (active) {
          setUser(null);
          setToken(null);
        }
      } finally {
        if (active) {
          setInitializing(false);
        }
      }
    };

    syncSession();

    return () => {
      active = false;
    };
  }, [token]);

  const login = useCallback(async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    setUser(data.user);
    setToken(data.token);
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    setUser(data.user);
    setToken(data.token);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
    setAuthToken(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!token) return null;
    const { data } = await api.get("/auth/me");
    setUser(data.user);
    return data.user;
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticating: initializing,
      login,
      register,
      logout,
      refreshProfile,
    }),
    [initializing, login, logout, refreshProfile, register, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
