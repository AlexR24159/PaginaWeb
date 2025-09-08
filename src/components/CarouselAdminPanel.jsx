import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

const CarouselAdminPanel = ({ onClose }) => {
  const {
    carouselSlides,
    addCarouselSlide,
    removeCarouselSlide,
    products
  } = useStore();

  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');

  const handleAddSlide = () => {
    if (!imageUrl.trim()) {
      alert('La imagen es obligatoria');
      return;
    }
    addCarouselSlide({ imageUrl, title, link });
    setImageUrl('');
    setTitle('');
    setLink('');
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div
        className="carousel-admin-modal rounded-lg shadow-lg w-full max-w-2xl relative flex flex-col"
        style={{
          maxHeight: '90vh',
          overflow: 'hidden',
          background: '#1e293b', // Cambiado a azul oscuro (bg-blue-950)
        }}
      >
        {/* Header fijo con botón cerrar */}
        <div
          className="flex items-center justify-between border-b px-6 py-4 sticky top-0 z-10"
          style={{
            background: '#0f172a', // <-- Mismo azul que el resto
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12
          }}
        >
          <h2 className="text-2xl font-semibold">Editar imágenes del Carousel</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 text-2xl ml-4"
            title="Cerrar"
            style={{ lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        {/* Contenido scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4" style={{ minHeight: 0 }}>
          <style>
            {`
              .carousel-admin-modal input,
              .carousel-admin-modal select,
              .carousel-admin-modal option,
              .carousel-admin-modal textarea {
                color: #111 !important;
                background: #fff !important;
                border: 1.5px solid #e5e7eb !important;
                box-shadow: none !important;
                transition: border 0.2s;
              }
              .carousel-admin-modal input:focus,
              .carousel-admin-modal select:focus,
              .carousel-admin-modal textarea:focus {
                border: 1.5px solid #2563eb !important; /* Azul Tailwind */
                outline: none !important;
              }
              .carousel-admin-modal input::placeholder,
              .carousel-admin-modal textarea::placeholder {
                color: #888 !important;
              }
            `}
          </style>
          <div className="mb-6">
            {carouselSlides.length === 0 && <p>No hay imágenes.</p>}
            {carouselSlides.map(slide => (
              <div key={slide.id} className="flex items-center mb-3">
                <img
                  src={slide.imageUrl}
                  alt={slide.title || 'Slide'}
                  className="w-24 h-12 object-cover rounded mr-4 border"
                />
                <div className="flex-1">
                  <p className="font-semibold">{slide.title || '(Sin título)'}</p>
                  <a
                    href={slide.link || '#'}
                    className="text-blue-600 underline text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {slide.link || '(Sin link)'}
                  </a>
                </div>
                <button
                  onClick={() => removeCarouselSlide(slide.id)}
                  className="text-red-600 hover:text-red-800 ml-4"
                  title="Eliminar"
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
          <div className="border-t pt-4">
            <h3 className="mb-2 font-semibold">Agregar nueva imagen</h3>
            <input
              type="text"
              placeholder="URL de la imagen"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              className="border p-2 w-full mb-2 rounded"
            />
            {products.length > 0 && (
              <div className="mb-2">
                <label className="block mb-1 text-sm">O elige imagen de producto</label>
                <select
                  className="border p-2 w-full rounded"
                  onChange={e => {
                    const prod = products.find(p => p.id === e.target.value);
                    if (prod) setImageUrl(prod.imageUrl);
                  }}
                  defaultValue=""
                >
                  <option value="">-- Selecciona producto --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            )}
            <input
              type="text"
              placeholder="Título (opcional)"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="border p-2 w-full mb-2 rounded"
            />
            <input
              type="text"
              placeholder="Link (opcional)"
              value={link}
              onChange={e => setLink(e.target.value)}
              className="border p-2 w-full mb-4 rounded"
            />
            <button
              onClick={handleAddSlide}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
            >
              Agregar imagen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselAdminPanel;
