import React, { useState, useRef } from 'react';
import ModalWrapper from './ModalWrapper';
import PasswordInput from './PasswordInput';
import { useStore } from '../../context/StoreContext';
import { useTheme } from '../../context/ThemeContext';
import { inputClass, labelClass } from '../../utils/formClasses';

const LoginModal = () => {
  const { darkMode } = useTheme();
  const { showLoginModal, setShowLoginModal, login, register } = useStore();

  const [mode, setMode] = useState('login'); // login o register
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('cliente');
  const [error, setError] = useState('');

  const usernameInputRef = useRef(null);
  const registerUsernameRef = useRef(null);
  const activeInitialFocusRef = mode === 'login' ? usernameInputRef : registerUsernameRef;

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(username.trim(), password, role);
      setShowLoginModal(false);
      setUsername('');
      setPassword('');
      setRole('cliente');
      setMode('login');
    } catch (err) {
      setError(err.message);
    }
  };

  // REGISTRO
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Ingrese usuario y contraseña');
      return;
    }
    if (password.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres');
      return;
    }
    try {
      await register(username.trim(), password, role);
      setShowLoginModal(false);
      setUsername('');
      setPassword('');
      setRole('cliente');
      setMode('login');
    } catch (err) {
      setError(err.message);
    }
  };

  const inputCls = inputClass(darkMode);

  return (
    <ModalWrapper
      isOpen={showLoginModal}
      onClose={() => setShowLoginModal(false)}
      title={mode === 'login' ? "Iniciar Sesión" : "Crear Cuenta"}
      maxWidth="max-w-md"
      initialFocusRef={activeInitialFocusRef}
    >
      {mode === 'login' ? (
        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md">{error}</div>
          )}

          <div>
            <label htmlFor="username" className={labelClass(darkMode)}>Usuario</label>
            <input
              ref={usernameInputRef}
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className={inputCls}
              placeholder="Ingrese su usuario"
              autoComplete="username"
            />
          </div>

          <PasswordInput
            id="password"
            label="Contraseña"
            labelClassName={labelClass(darkMode)}
            inputClassName={inputCls}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingrese su contraseña"
            autoComplete="current-password"
            darkMode={darkMode}
          />

          <div>
            <label htmlFor="role" className={labelClass(darkMode)}>Rol de Usuario</label>
            <select
              id="role"
              value={role}
              onChange={e => setRole(e.target.value)}
              className={inputCls}
            >
              <option value="cliente">Cliente</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); }}
              className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
            >
              Crear cuenta
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-5">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md">{error}</div>
          )}

          <div>
            <label htmlFor="new-username" className={labelClass(darkMode)}>Nuevo usuario</label>
            <input
              ref={registerUsernameRef}
              id="new-username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className={inputCls}
              placeholder="Crea tu usuario"
              autoComplete="username"
            />
          </div>

          <PasswordInput
            id="new-password"
            label="Nueva contraseña"
            labelClassName={labelClass(darkMode)}
            inputClassName={inputCls}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Crea tu contraseña"
            autoComplete="new-password"
            darkMode={darkMode}
          />

          <div>
            <label htmlFor="new-role" className={labelClass(darkMode)}>Rol de Usuario</label>
            <select
              id="new-role"
              value={role}
              onChange={e => setRole(e.target.value)}
              className={inputCls}
            >
              <option value="cliente">Cliente</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Crear cuenta
            </button>
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); setUsername(''); setPassword(''); }}
              className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
            >
              Volver a iniciar sesión
            </button>
          </div>
        </form>
      )}
    </ModalWrapper>
  );
};

export default LoginModal;
