import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { COLORS } from '../../utils/constants';
import RatingStars from "../RatingStars"; // ¡Importa aquí tu componente!

const defaultThanks = "¡Gracias por tu interés! Tu satisfacción nos inspira a mejorar cada día 😊.";

function getColorHex(colorName) {
  const colorObj = COLORS.find(c => c.name === colorName);
  return colorObj ? colorObj.hex : '#fff';
}

const MAX_COMMENT_WORDS = 40;

const ProductPopupModal = () => {
  const {
    popupProduct,
    closeProductPopup,
    updateThanksMessage,
    updateProduct,
    user
  } = useStore();

  const [currentImage, setCurrentImage] = useState(0);
  const [isEditingThanks, setIsEditingThanks] = useState(false);
  const [customThanks, setCustomThanks] = useState(defaultThanks);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (popupProduct) {
      setCustomThanks(popupProduct.thanksMessage || defaultThanks);
      setCurrentImage(0);
    }
  }, [popupProduct]);

  if (!popupProduct) return null;

  const images = popupProduct.images && popupProduct.images.length > 0
    ? popupProduct.images
    : popupProduct.imageUrl
      ? [popupProduct.imageUrl]
      : [];

  const {
    name,
    description,
    sizes = [],
    colors = [],
    price,
    discount = 0,
    category,
    brand,
    thanksMessage,
    ratings = [],
  } = popupProduct;

  const finalPrice = discount ? (price * (1 - discount)) : price;

  // Cálculo de promedio seguro
  const ratingsArray = Array.isArray(ratings) ? ratings : [];
  const promedio = ratingsArray.length > 0
    ? ratingsArray.reduce((a, b) => a + b, 0) / ratingsArray.length
    : 0;

  // Manejador de rating clickeable
  const handleRatingChange = (newRating) => {
    const updatedRatings = [newRating];
    updateProduct({ ...popupProduct, ratings: updatedRatings });
  };

  // Scrollable modal + sticky close
  const handleEditThanks = () => setIsEditingThanks(true);

  const handleAcceptThanks = () => {
    if (updateThanksMessage) {
      updateThanksMessage(popupProduct.id, customThanks);
    }
    setIsEditingThanks(false);
  };

  const handleCancelThanks = () => {
    setCustomThanks(thanksMessage || defaultThanks);
    setIsEditingThanks(false);
  };

  const handlePrevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const handleAddComment = () => {
    const words = comment.trim().split(/\s+/);
    if (comment.trim() && words.length <= MAX_COMMENT_WORDS) {
      setComments([...comments, comment.trim()]);
      setComment('');
    } else if (words.length > MAX_COMMENT_WORDS) {
      alert(`El comentario es muy largo. Máximo permitido: ${MAX_COMMENT_WORDS} palabras.`);
    }
  };

  // Trunca el texto a N palabras si es necesario
  const truncateWords = (text, maxWords = MAX_COMMENT_WORDS) => {
    const words = text.split(/\s+/);
    return words.length > maxWords
      ? words.slice(0, maxWords).join(' ') + '...'
      : text;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {/* Modal window */}
      <div className="relative w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-lg bg-gray-900 text-white flex flex-col">
        {/* Header sticky con botón cerrar */}
        <div className="sticky top-0 z-10 bg-gray-900 rounded-t-2xl px-6 pt-5 flex justify-end">
          <button
            className="text-3xl text-white/90 hover:text-yellow-400 transition p-2"
            onClick={closeProductPopup}
            aria-label="Cerrar"
          >×</button>
        </div>
        {/* Contenido scrollable */}
        <div className="overflow-y-auto px-6 pb-6 pt-0">
          {/* Galería */}
          <div className="flex items-center justify-center mb-4 relative">
            {/* Flecha izquierda */}
            <button
              className={`absolute left-0 p-2 rounded-full text-2xl 
                ${images.length > 1 ? 'bg-black/10 hover:bg-black/40 text-white/50 hover:text-white' : 'opacity-20 cursor-not-allowed'}
              `}
              style={{
                top: '50%',
                transform: 'translateY(-50%)',
                transition: 'background 0.2s, color 0.2s',
                zIndex: 2,
              }}
              onClick={images.length > 1 ? handlePrevImage : undefined}
              aria-label="Anterior"
              disabled={images.length <= 1}
              tabIndex={images.length > 1 ? 0 : -1}
            >&#60;</button>

            {images.length > 0 ? (
              <img
                src={images[currentImage]}
                alt={name}
                className="max-h-48 rounded-xl object-contain mx-auto"
                style={{ maxWidth: '38%', display: 'block' }}
              />
            ) : (
              <div className="max-h-48 flex items-center justify-center text-gray-400">
                Sin imagen
              </div>
            )}

            {/* Flecha derecha */}
            <button
              className={`absolute right-0 p-2 rounded-full text-2xl 
                ${images.length > 1 ? 'bg-black/10 hover:bg-black/40 text-white/50 hover:text-white' : 'opacity-20 cursor-not-allowed'}
              `}
              style={{
                top: '50%',
                transform: 'translateY(-50%)',
                transition: 'background 0.2s, color 0.2s',
                zIndex: 2,
              }}
              onClick={images.length > 1 ? handleNextImage : undefined}
              aria-label="Siguiente"
              disabled={images.length <= 1}
              tabIndex={images.length > 1 ? 0 : -1}
            >&#62;</button>
          </div>

          {/* Nombre y estrellas */}
          <div className="flex items-center mb-2">
            <h2 className="text-2xl font-bold mr-3">{name}</h2>
            <div className="flex items-center">
              <RatingStars
                value={promedio}
                editable={true}
                onChange={handleRatingChange}
                size="1.8em"
              />
              <span className="ml-2 text-sm text-gray-400">
                {ratingsArray.length > 0 ? promedio.toFixed(1) : "Sin calificaciones"}
              </span>
            </div>
          </div>
          <div className="mb-2 text-gray-300">{description}</div>

          <div className="flex flex-wrap gap-4 mb-4 items-center">
            <div>
              <span className="text-gray-400">Tallas:</span>
              <span className="ml-2 font-semibold">{sizes.join(', ') || 'Único'}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-400">Colores:</span>
              {colors.length > 0 ? (
                colors.map((c, idx) => (
                  <span
                    key={idx}
                    className="inline-block w-5 h-5 rounded-full border border-gray-400 ml-1"
                    style={{ background: getColorHex(c) }}
                    title={c}
                  />
                ))
              ) : (
                <span className="ml-2">Único</span>
              )}
            </div>
            <div>
              <span className="text-gray-400">Categoría:</span>
              <span className="ml-2 font-semibold">{category}</span>
            </div>
            <div>
              <span className="text-gray-400">Marca:</span>
              <span className="ml-2 font-semibold">{brand}</span>
            </div>
          </div>

          {/* PRECIO con descuento */}
          <div className="mb-4">
            <span className="text-lg font-bold text-green-400">S/ {finalPrice.toFixed(2)}</span>
            {discount > 0 && (
              <span className="text-sm text-gray-400 line-through ml-3">S/ {price}</span>
            )}
          </div>

          {/* Mensaje de agradecimiento */}
          <div className="mb-4">
            <div className="flex items-center mb-1">
              <span className="font-semibold mr-2">Mensaje de agradecimiento:</span>
              {!isEditingThanks && user && user.role === 'admin' && (
                <button
                  onClick={handleEditThanks}
                  className="text-blue-300 hover:text-blue-500 text-xs underline"
                >
                  Editar
                </button>
              )}
            </div>
            {isEditingThanks ? (
              <div>
                <textarea
                  value={customThanks}
                  onChange={e => setCustomThanks(e.target.value)}
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                  rows={2}
                  maxLength={120}
                />
                <div className="flex justify-end gap-2 mt-1">
                  <button
                    className="bg-blue-600 hover:bg-blue-800 rounded px-4 py-1 text-white text-sm"
                    onClick={handleAcceptThanks}
                  >
                    Aceptar
                  </button>
                  <button
                    className="bg-gray-700 hover:bg-gray-800 rounded px-4 py-1 text-gray-200 text-sm"
                    onClick={handleCancelThanks}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="italic text-gray-200">{customThanks || defaultThanks}</div>
            )}
          </div>

          {/* Comentarios */}
          <div className="mb-2">
            <label className="block font-semibold mb-1">Deja tu comentario:</label>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 rounded p-2 bg-gray-800 border border-gray-700"
                placeholder={`¿Qué te parece este producto? (máx ${MAX_COMMENT_WORDS} palabras)`}
                value={comment}
                onChange={e => setComment(e.target.value)}
                maxLength={180}
              />
              <button
                className="bg-blue-600 hover:bg-blue-800 rounded px-4 py-2 text-white font-bold"
                onClick={handleAddComment}
              >
                Enviar
              </button>
            </div>
            <div className="mt-3 space-y-1 max-h-32 overflow-auto">
              {comments.length > 0 ? (
                comments.map((c, i) => (
                  <div key={i} className="bg-gray-800/70 rounded px-3 py-1 text-sm text-gray-100 break-words">
                    {truncateWords(c)}
                  </div>
                ))
              ) : (
                <div className="text-gray-400 italic">Aún no hay comentarios, ¡sé el primero!</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPopupModal;
