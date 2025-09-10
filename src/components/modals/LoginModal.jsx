import React, { useState, useRef, useEffect } from 'react';
import ModalWrapper from './ModalWrapper';
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
  const [showPassword, setShowPassword] = useState(false);

  const usernameInputRef = useRef(null);

  useEffect(() => {
    if (showLoginModal && usernameInputRef.current) {
      setTimeout(() => {
        usernameInputRef.current.focus();
      }, 100);
    }
  }, [showLoginModal, mode]);

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

          <div>
            <label htmlFor="password" className={labelClass(darkMode)}>Contraseña</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={inputCls + ' pr-10'}
                placeholder="Ingrese su contraseña"
                autoComplete="current-password"
              />
              <button
                type="button"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-2 flex items-center px-1 text-gray-500 focus:outline-none"
                tabIndex={0}
              >
                {showPassword ? (
                  // Ojo abierto
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                ) : (
                  // Ojo cerrado
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.993 9.993 0 012.293-3.95m2.724-2.632A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7-.512 1.634-1.436 3.064-2.662 4.116M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

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
              id="new-username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
                className={inputCls}
              placeholder="Crea tu usuario"
              autoComplete="username"
            />
          </div>

          <div>
            <label htmlFor="new-password" className={labelClass(darkMode)}>Nueva contraseña</label>
            <input
              id="new-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
                className={inputCls}
              placeholder="Crea tu contraseña"
              autoComplete="new-password"
            />
          </div>

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
