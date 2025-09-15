// src/hooks/useAuth.js
// Custom hook for authentication logic
import { useEffect, useState } from 'react';
import { loginUser, registerUser, changePassword } from '../utils/authApi';

const USER_STORAGE_KEY = 'trendify_active_user';

const readStoredUser = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const stored = window.localStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    return null;
  }
};

export default function useAuth() {
  const [user, setUser] = useState(() => readStoredUser());

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (user) {
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  const login = async (username, password, role) => {
    const data = await loginUser(username, password, role);
    setUser(data);
    return data;
  };

  const register = async (username, password, role) => {
    const data = await registerUser({ username, password, role });
    setUser(data);
    return data;
  };

  const logout = () => setUser(null);

  const updatePassword = async (username, role, oldPass, newPass) => {
    await changePassword(username, role, oldPass, newPass);
  };

  return { user, login, register, logout, updatePassword };
}
