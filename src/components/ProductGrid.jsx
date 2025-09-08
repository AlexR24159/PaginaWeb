import React from 'react';
import ProductCard from './ProductCard';
import { useStore } from '../context/StoreContext';
import { useTheme } from '../context/ThemeContext';
import ContactInfo from './ContactInfo';

const ProductGrid = () => {
  const { darkMode } = useTheme();
  const {
    filteredProducts,
    setShowAddEditModal,
    setEditingProduct,
    user, // <-- Solo añade esto
  } = useStore();

  const handleAddNewProduct = () => {
    setEditingProduct(null);
    setShowAddEditModal(true);
  };

  return (
    <div className="pb-8 min-w-[360px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Productos {filteredProducts.length > 0 ? `(${filteredProducts.length})` : ''}
        </h2>
        <div className="flex items-center gap-4">
          <ContactInfo isAdmin={true} />
          {/* ----------- Solo Admin puede ver este botón ----------- */}
          {user && user.role === 'admin' && (
            <button
              onClick={handleAddNewProduct}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Añadir producto</span>
            </button>
          )}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className={`flex flex-col items-center justify-center py-16 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mb-4 opacity-50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="text-xl font-semibold mb-2">No hay productos</h3>
          <p className="max-w-md mb-6">
            No se encontraron productos que coincidan con los criterios de búsqueda. Prueba con otros filtros o añade un nuevo producto.
          </p>
          {/* ----------- Solo Admin puede ver este botón ----------- */}
          {user && user.role === 'admin' && (
            <button
              onClick={handleAddNewProduct}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
            >
              Añadir primer producto
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-w-[360px]">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
