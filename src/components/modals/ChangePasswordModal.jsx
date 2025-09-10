import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';

const ChangePasswordModal = ({ isOpen, onClose, user }) => {
  const { updatePassword } = useStore();
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!oldPass || !newPass || !confirmPass) {
      setError('Completa todos los campos.');
      return;
    }
    if (newPass.length < 4) {
      setError('La nueva contraseña debe tener al menos 4 caracteres.');
      return;
    }
    if (newPass !== confirmPass) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    updatePassword(user.name, user.role, oldPass, newPass)
      .then(() => {
        setSuccess('¡Contraseña cambiada exitosamente!');
        setOldPass('');
        setNewPass('');
        setConfirmPass('');
        setTimeout(onClose, 1500);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-xl w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4">Cambiar Contraseña</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-1 rounded">{error}</div>}
          {success && <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-1 rounded">{success}</div>}
          <div>
            <label className="block text-sm mb-1">Contraseña actual</label>
            <input
              type="password"
              className="w-full rounded border p-2 dark:bg-gray-700"
              value={oldPass}
              onChange={e => setOldPass(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Nueva contraseña</label>
            <input
              type="password"
              className="w-full rounded border p-2 dark:bg-gray-700"
              value={newPass}
              onChange={e => setNewPass(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Repite la nueva contraseña</label>
            <input
              type="password"
              className="w-full rounded border p-2 dark:bg-gray-700"
              value={confirmPass}
              onChange={e => setConfirmPass(e.target.value)}
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white rounded px-3 py-2 hover:bg-blue-700"
            >Guardar</button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded px-3 py-2 hover:bg-gray-400"
            >Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
