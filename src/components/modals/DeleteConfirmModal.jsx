import React from 'react';
import ModalWrapper from './ModalWrapper';
import { useStore } from '../../context/StoreContext';
import { useTheme } from '../../context/ThemeContext';

const DeleteConfirmModal = () => {
  const { darkMode } = useTheme();
  const { 
    showDeleteModal, 
    setShowDeleteModal, 
    deletingProduct, 
    deleteProduct 
  } = useStore();

  const handleDelete = () => {
    if (deletingProduct) {
      deleteProduct(deletingProduct.id);
    }
    setShowDeleteModal(false);
  };

  return (
    <ModalWrapper 
      isOpen={showDeleteModal} 
      onClose={() => setShowDeleteModal(false)} 
      title="Confirmar Eliminación" 
      maxWidth="max-w-md"
    >
      <div className="py-2">
        <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          ¿Está seguro que desea eliminar este producto?
          {deletingProduct && (
            <span className="font-semibold block mt-2">
              "{deletingProduct.name}"
            </span>
          )}
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowDeleteModal(false)}
            className={`px-4 py-2 rounded-lg ${
              darkMode
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Eliminar
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default DeleteConfirmModal;