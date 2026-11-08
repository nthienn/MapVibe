import { isTokenExpired } from "../utils/jwt";
import { createContext, useContext, useEffect, useState } from "react";
import {
  getAccessToken,
  setAccessToken,
  removeAccessToken,
} from "../utils/token";
import authService from "../services/authService";
import userService from "../services/userService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const refreshUser = async () => {
    try {
      const user = await userService.getMyInfo();
      setUser(user);

      return user;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getAccessToken();

      if (!token || isTokenExpired(token)) {
        removeAccessToken();
        setLoading(false);
        return;
      }

      try {
        await refreshUser();
      } catch (error) {
        console.log(error);
        removeAccessToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    const result = await authService.login(credentials);

    setAccessToken(result.token);

    const user = await refreshUser();

    setIsAuthModalOpen(false);

    return user;
  };

  const register = async (data) => {
    return await authService.register(data);
  };

  const logout = async () => {
    const token = getAccessToken();

    if (token) {
      try {
        await authService.logout(token);
      } catch (error) {
        console.error(error);
      }
    }

    removeAccessToken();
    setUser(null);
  };

  const updateUser = (data) => {
    setUser((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLoggedIn: !!user,

        login,
        logout,
        register,

        updateUser,
        refreshUser,

        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
