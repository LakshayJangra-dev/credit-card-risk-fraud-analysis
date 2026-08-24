import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  login as apiLogin,
  signup as apiSignup,
  logout as apiLogout,
  getStoredUser,
  getCurrentUser,
} from "../api/client";


const AuthContext = createContext(null);


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  /*
   * Check authentication when the application starts.
   *
   * First we look for the locally stored user.
   * If a JWT exists, /auth/me verifies that the token
   * is still valid with the backend.
   */
  useEffect(() => {
    const restoreSession = async () => {
      const storedUser = getStoredUser();

      if (!storedUser) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();

        setUser(currentUser);
      } catch (error) {
        /*
         * Token is missing, expired, invalid, or user
         * no longer exists.
         */
        apiLogout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);


  /*
   * Login
   */
  const login = async ({ email, password }) => {
    const data = await apiLogin({
      email,
      password,
    });

    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
    });

    return data;
  };


  /*
   * Signup
   */
  const signup = async ({ name, email, password }) => {
    const data = await apiSignup({
      name,
      email,
      password,
    });

    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
    });

    return data;
  };


  /*
   * Logout
   */
  const logout = () => {
    apiLogout();
    setUser(null);
  };


  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
  };


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider"
    );
  }

  return context;
}