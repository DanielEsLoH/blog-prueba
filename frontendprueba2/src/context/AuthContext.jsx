import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { resetConsumer } from "../cable";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  }, [navigate]);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    setUser(res.data.user);
    setToken(res.data.token);

    localStorage.setItem("user", JSON.stringify(res.data.user));
    localStorage.setItem("token", res.data.token);
    resetConsumer();
  };

  const register = async (name, email, password, password_confirmation) => {
    const res = await api.post("/auth/register", {
      user: { name, email, password, password_confirmation },
    });
    return res.data;
  };

  useEffect(() => {
    if (!token) return;

    const decodeToken = (token) => {
      try {
        return JSON.parse(atob(token.split(".")[1]));
      } catch {
        return null;
      }
    };

    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return;

    const now = Date.now() / 1000;
    const delay = (decoded.exp - now) * 1000; // ms

    if (delay <= 0) {
      logout();
      return;
    }

    const timer = setTimeout(() => logout(), delay);
    return () => clearTimeout(timer);
  }, [token, logout]);

  useEffect(() => {
    const reqInterceptor = api.interceptors.request.use(
      (config) => {
        const localToken = localStorage.getItem("token");
        if (localToken) {
          config.headers.Authorization = `Bearer ${localToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const resInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(reqInterceptor);
      api.interceptors.response.eject(resInterceptor);
    };
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
