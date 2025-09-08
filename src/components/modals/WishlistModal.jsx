// src/components/modals/WishlistModal.jsx
import React from 'react';
import ModalWrapper from './ModalWrapper';
import { useStore } from '../../context/StoreContext';
import { useTheme } from '../../context/ThemeContext';
import { formatPrice } from '../../utils/helpers';

const WishlistModal = () => {
  const { darkMode } = useTheme();
  const { 
    showWishlistModal, 
    setShowWishlistModal, 
    wishlist, 
    products, 
    removeFromWishlist, 
    addToCart 
  } = useStore();

  return (
    <ModalWrapper
      isOpen={showWishlistModal}
      onClose={() => setShowWishlistModal(false)}
      title="Lista de Deseos"
    >
      {wishlist.length === 0 ? (
        <div className="text-center py-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-16 w-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h3 className="text-lg font-medium mb-2">¡Tu lista está vacía!</h3>
          <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Agrega productos para guardarlos aquí.
          </p>
          <button
            onClick={() => setShowWishlistModal(false)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Seguir comprando
          </button>
        </div>
      ) : (
        <div className="flex flex-col h-full max-h-[70vh]">
          {/* SCROLL: sólo 3 productos visibles */}
          <div className="flex-1 overflow-y-auto" style={{ maxHeight: '390px' }}>
            {wishlist.map(id => {
              const product = products.find(p => p.id === id);
              if (!product) return null;
              return (
                <div key={product.id} className="flex items-center p-4 px-6 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                    <img
                      src={product.imageUrl || (product.images && product.images[0]) || 'https://via.placeholder.com/150'}
                      alt={product.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{product.name}</h3>
                    <p className={`mt-0.5 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{product.brand && `${product.brand} · `}{product.category}</p>
                    <p className="text-sm font-medium text-red-600">{formatPrice(product.price * (1 - product.discount))}</p>
                    {product.discount > 0 && (
                      <p className={`text-xs line-through ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{formatPrice(product.price)}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => addToCart(product)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs"
                    >
                      Añadir al carrito
                    </button>
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* BOTÓN FINAL FIJO */}
          <div className="px-6 py-4 bg-inherit">
            <div className="flex justify-between items-center mb-3">
              <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Productos en tu lista
              </span>
              <span className={`font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                {wishlist.length}
              </span>
            </div>
            <button
              onClick={() => setShowWishlistModal(false)}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Seguir comprando
            </button>
          </div>
        </div>
      )}
    </ModalWrapper>
  );
};

export default WishlistModal;
