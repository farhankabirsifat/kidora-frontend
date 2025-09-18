import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getToken, getUser, login as authLogin, logout as authLogout, register as authRegister, getProfile, isAdminEmail, getBasicCreds, updateProfile as apiUpdateProfile, saveUser } from '../services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try refreshing profile on mount if we have creds
    (async () => {
      try {
        const profile = await getProfile();
        setUser(profile);
      } catch {
        // leave existing user or null
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function login(email, password) {
    await authLogin({ email, password });
    try {
      const profile = await getProfile();
      setUser(profile);
    } catch {
      setUser({ email });
    }
  }

  async function signup(payload) {
    await authRegister(payload);
    // Auto-login after signup
    await login(payload.email, payload.password);
  }

  async function logout() {
    await authLogout();
    setUser(null);
  }

  async function updateProfile(updates) {
    const updated = await apiUpdateProfile(updates);
    setUser(updated);
    try { saveUser(updated); } catch {}
    return updated;
  }

  const isAuthenticated = !!(user && (getBasicCreds() || getToken()));
  const isAdmin = isAuthenticated && isAdminEmail(user?.email);

  const value = useMemo(() => ({ user, isAuthenticated, isAdmin, login, signup, logout, updateProfile, loading }), [user, isAuthenticated, isAdmin, loading]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
