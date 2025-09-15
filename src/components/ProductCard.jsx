// src/components/ProductCard.jsx
import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { useTheme } from '../context/ThemeContext';
import { formatPrice } from '../utils/helpers';
import { COLORS } from '../utils/constants';
import RatingStars from './RatingStars'; // <-- Importa el componente

const ProductCard = ({ product }) => {
  const { darkMode } = useTheme();
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    setShowAddEditModal,
    setShowDeleteModal,
    setEditingProduct,
    setDeletingProduct,
    openProductPopup,
    updateProduct,
    user, // <-- AGREGA user AQUÍ
    addToCarousel,
    removeFromCarousel,
    getCarouselImages,
  } = useStore();

  const [showMenu, setShowMenu] = useState(false);
  const [toast, setToast] = useState(null);
  const menuRef = useRef(null);

  const ratings = Array.isArray(product.ratings) ? product.ratings : [];
  const promedio =
    ratings.length > 0
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : 0;

  const [tempRating, setTempRating] = useState(null);

  const handleRatingChange = (newRating) => {
    const updatedRatings = [...ratings, newRating];
    updateProduct({ ...product, ratings: updatedRatings });
    setTempRating(newRating);
    setTimeout(() => setTempRating(null), 800);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setShowMenu(false);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setEditingProduct(product);
    setShowAddEditModal(true);
    setShowMenu(false);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setDeletingProduct(product);
    setShowDeleteModal(true);
    setShowMenu(false);
  };

  const isInCarousel = getCarouselImages().some(img => img.productId === product.id);

  const handleToggleCarousel = (e) => {
    e.stopPropagation();
    const image = (product.images && product.images.length > 0)
      ? product.images[0]
      : product.imageUrl;
    if (isInCarousel) {
      removeFromCarousel(product.id);
      setToast('Producto quitado del carrusel');
    } else {
      addToCarousel(product.id, image, product.name);
      setToast('Producto añadido al carrusel');
    }
    setShowMenu(false);
    setTimeout(() => setToast(null), 2000);
  };

  React.useEffect(() => {
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);
  const inWishlist = isInWishlist(product.id);
  const discountPercentage = product.discount > 0
    ? Math.round(product.discount * 100)
    : null;

  const tagClass = `inline-block min-w-[28px] text-center mx-0.5 px-2 py-0.5 rounded-full font-mono text-xs border
    ${darkMode ? 'border-gray-600 bg-gray-700 text-blue-400' : 'border-gray-300 bg-gray-100 text-blue-600'}`;

  const getColorHex = (colorName) => {
    const colorObj = COLORS.find(c => c.name === colorName);
    return colorObj ? colorObj.hex : '#fff';
  };

  const handleCardKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openProductPopup(product);
    }
  };

  return (
    <>
    <div
      className={`relative rounded-xl overflow-hidden transition-all duration-300 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
        darkMode
          ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700 focus-visible:outline-blue-400'
          : 'bg-white hover:bg-gray-50 border border-gray-200 focus-visible:outline-blue-500'
      } hover:shadow-md`}
      onClick={() => openProductPopup(product)}
      onKeyDown={handleCardKeyDown}
      tabIndex={0}
      role="button"
      title="Ver detalles del producto"
      style={{ userSelect: 'none' }}
    >
      {/* Menu button SOLO para admin*/}
      {user && user.role === 'admin' && (
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={handleMenuToggle}
          className={`p-2 rounded-full ${
            darkMode
              ? 'hover:bg-gray-700 bg-gray-800 bg-opacity-50'
              : 'hover:bg-gray-200 bg-white bg-opacity-50'
          }`}
          aria-label="Product options"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
        {showMenu && (
          <div
            ref={menuRef}
            className={`absolute right-0 mt-1 w-36 rounded-md shadow-lg ${
              darkMode ? 'bg-gray-700' : 'bg-white'
            } ring-1 ring-black ring-opacity-5 focus:outline-none z-20`}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <div className="py-1" role="none">
              {/* SOLO para ADMIN */}
              {user && user.role === 'admin' && (
                <>
                  <button
                    onClick={handleToggleCarousel}
                    className={`flex w-full items-center px-4 py-2 text-sm ${
                      darkMode
                        ? 'text-gray-200 hover:bg-gray-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    role="menuitem"
                    aria-label={isInCarousel ? 'Quitar del carrusel' : 'Añadir al carrusel'}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isInCarousel ? 'M18 6L6 18M6 6l12 12' : 'M12 4v16m8-8H4'} />
                    </svg>
                    {isInCarousel ? 'Quitar del carrusel' : 'Añadir al carrusel'}
                  </button>
                  <button
                    onClick={handleEdit}
                    className={`flex w-full items-center px-4 py-2 text-sm ${
                      darkMode
                        ? 'text-gray-200 hover:bg-gray-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    role="menuitem"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar
                  </button>
                  <button
                    onClick={handleDelete}
                    className={`flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 ${
                      darkMode && 'hover:bg-gray-600'
                    }`}
                    role="menuitem"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Eliminar
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
)}

      {/* Discount badge */}
      {discountPercentage && (
        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-1 z-10">
          -{discountPercentage}%
        </div>
      )}

      {/* Product image + estrellas */}
      <div className="relative pt-[100%] select-none pointer-events-none">
        <img
          src={
            (product.images && product.images.length > 0)
              ? product.images[0]
              : (product.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image')
          }
          alt={product.name}
          className="absolute top-0 left-0 w-full h-full object-cover object-center"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300x300?text=Error+Loading';
          }}
          draggable={false}
        />
        <div className="absolute bottom-5 left-2 flex flex-col-reverse items-center gap-0.5 z-20">
          <RatingStars
            value={typeof tempRating === "number" ? tempRating : promedio}
            editable={true}
            size="1.4em"
            onChange={handleRatingChange}
          />
          <span className="text-xs mt-1 text-gray-400 select-none">
            {ratings.length > 0 ? promedio.toFixed(1) : "Sin calificaciones"}
          </span>
        </div>
      </div>

      {/* Product details */}
      <div className="p-4 select-none pointer-events-none">
        <h3 className={`font-semibold text-lg mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {product.name}
        </h3>

        <div className="mb-1 text-xs font-sans">
          <span className="text-gray-500 mr-1">Talla:</span>
          {(product.sizes && product.sizes.length > 0)
            ? product.sizes.map((sz, idx) => (
                <span key={sz} className={tagClass}>
                  {sz}
                </span>
              ))
            : <span className="italic text-gray-400">-</span>
          }
        </div>

        <div className="mb-2 text-xs font-sans flex items-center">
          <span className="text-gray-500 mr-1">Color:</span>
          {(product.colors && product.colors.length > 0)
            ? product.colors.slice(0, 10).map((color, idx) => (
                <span
                  key={color + idx}
                  className="w-5 h-5 rounded-full border border-gray-300 mr-1"
                  style={{ display: "inline-block", backgroundColor: getColorHex(color) }}
                  title={color}
                />
              ))
            : <span className="italic text-gray-400">-</span>
          }
        </div>

        <div className="flex items-center mb-3">
          <span className="font-semibold text-red-600 text-lg">
            {formatPrice(product.price * (1 - product.discount))}
          </span>
          {product.discount > 0 && (
            <span className={`line-through ml-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>

      {/* Botones deben estar encima y no abrir el popup */}
      <div className="flex items-center justify-between mt-3 px-4 pb-4 pt-0 bg-transparent pointer-events-auto select-auto">
        <button
          onClick={handleAddToCart}
          className="flex-grow py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
        >
          Añadir al carrito
        </button>
        <button
          onClick={handleToggleWishlist}
          className={`ml-2 p-2 rounded-lg transition-colors ${
            inWishlist
              ? 'text-red-500'
              : darkMode
                ? 'text-gray-400 hover:text-red-400'
                : 'text-gray-500 hover:text-red-400'
          }`}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill={inWishlist ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={inWishlist ? 0 : 2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
    </div>
    {toast && (
      <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
        {toast}
      </div>
    )}
    </>
  );
};

export default ProductCard;
