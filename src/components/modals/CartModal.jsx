import React from 'react';
import ModalWrapper from './ModalWrapper';
import { useStore } from '../../context/StoreContext';
import { useTheme } from '../../context/ThemeContext';
import { formatPrice } from '../../utils/helpers';

const CartModal = () => {
  const { darkMode } = useTheme();
  const { 
    showCartModal, 
    setShowCartModal,
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    products,
    getCartTotal
  } = useStore();

  const cartTotal = getCartTotal();
  
  const handleCheckout = () => {
    alert('Procesando compra...\n\nEsta sería la redirección al proceso de pago.');
    setShowCartModal(false);
  };

  return (
    <ModalWrapper 
      isOpen={showCartModal} 
      onClose={() => setShowCartModal(false)} 
      title="Carrito de Compras"
    >
      {cart.length === 0 ? (
        <div className="text-center py-8">
          {/* ... (contenido igual para carrito vacío) ... */}
        </div>
      ) : (
        <div className="flex flex-col h-full max-h-[80vh]">
          {/* PRODUCTOS CON SCROLL (sólo 2 visibles) */}
          <div className="flex-1 overflow-y-auto" style={{ maxHeight: '260px' }}>
            {cart.map(cartItem => {
              const product = products.find(p => p.id === cartItem.id);
              if (!product) return null;
              
              const discountedPrice = product.price * (1 - product.discount);
              const itemTotal = discountedPrice * cartItem.quantity;
              
              return (
                <div key={product.id} className="flex p-4 px-6 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                    <img
                      src={product.imageUrl || (product.images && product.images[0]) || 'https://via.placeholder.com/150'}
                      alt={product.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between">
                        <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {product.name}
                        </h3>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className={`text-sm ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-500'}`}
                        >
                          Eliminar
                        </button>
                      </div>
                      <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {product.brand && `${product.brand} · `}
                        {product.category}
                      </p>
                    </div>
                    
                    <div className="flex flex-1 items-end justify-between mt-2">
                      <div>
                        <p className="text-base font-medium text-red-600">
                          {formatPrice(discountedPrice)}
                        </p>
                        {product.discount > 0 && (
                          <p className={`text-sm line-through ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {formatPrice(product.price)}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center">
                        <p className={`mr-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                          Total: <span className="font-medium">{formatPrice(itemTotal)}</span>
                        </p>
                        
                        <div className="flex items-center border rounded-lg overflow-hidden">
                          <button
                            onClick={() => decreaseQuantity(product.id)}
                            disabled={cartItem.quantity <= 1}
                            className={`px-2 py-1 ${
                              darkMode 
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50'
                            }`}
                          >
                            -
                          </button>
                          <span className={`px-3 py-1 text-center min-w-[2rem] ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => increaseQuantity(product.id)}
                            className={`px-2 py-1 ${
                              darkMode 
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* RESUMEN Y BOTONES SIEMPRE FIJOS */}
          <div className="p-4 px-6 bg-inherit">
            <div className="flex justify-between mb-2">
              <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Subtotal
              </span>
              <span className="font-medium">{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Envío
              </span>
              <span className={`italic ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Calculado en el siguiente paso
              </span>
            </div>
            <div className="flex justify-between border-t pt-4 mb-6">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-lg font-semibold text-red-600">{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowCartModal(false)}
                className={`flex-1 px-4 py-2 rounded-lg ${
                  darkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                Seguir comprando
              </button>
              <button
                onClick={handleCheckout}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Procesar compra
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalWrapper>
  );
};

export default CartModal;
