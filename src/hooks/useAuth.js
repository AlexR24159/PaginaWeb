// src/hooks/useAuth.js
// Custom hook for authentication logic
import { useState } from 'react';
import { loginUser, registerUser, changePassword } from '../utils/authApi';

export default function useAuth() {
  const [user, setUser] = useState(null);

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
