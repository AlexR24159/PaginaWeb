// src/components/modals/AddEditProductModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import ModalWrapper from './ModalWrapper';
import { useStore } from '../../context/StoreContext';
import { useTheme } from '../../context/ThemeContext';
import { CATEGORIES, SIZES, COLORS, BRANDS, PRODUCT_TARGETS } from '../../utils/constants';

const AddEditProductModal = () => {
  const { darkMode } = useTheme();
  const { 
    showAddEditModal, 
    setShowAddEditModal, 
    editingProduct, 
    addProduct, 
    updateProduct,
    user
  } = useStore();

  // --- PROTECCIÓN DE ADMIN: si no es admin, NO ve el modal ni puede editar/añadir
  if (!user || user.role !== 'admin') return null;

  const isEditing = !!editingProduct;
  const inputClass = `w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
  }`;
  const labelClass = `block mb-1 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`;

  // MULTI-IMAGENES:
  const [imageInput, setImageInput] = useState('');
  const [imageUrls, setImageUrls] = useState([]);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: '',
    discount: '0',
    description: '',
    imageUrl: '',
    category: '',
    sizes: [],
    colors: [],
    brand: '',
    target: '',
    ratings: [],
  });

  const nameInputRef = useRef(null);

  // Si está editando, inicializa campos
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        id: editingProduct.id || '',
        name: editingProduct.name || '',
        price: editingProduct.price?.toString() || '',
        discount: editingProduct.discount !== undefined ? String(Math.round(Number(editingProduct.discount) * 100)) : '0',
        description: editingProduct.description || '',
        imageUrl: editingProduct.imageUrl || '',
        category: editingProduct.category || '',
        sizes: [...(editingProduct.sizes || [])],
        colors: [...(editingProduct.colors || [])],
        brand: editingProduct.brand || '',
        target: editingProduct.target || '',
        ratings: editingProduct.ratings || [],
      });
      if (Array.isArray(editingProduct.images) && editingProduct.images.length > 0) {
        setImageUrls(editingProduct.images);
      } else if (editingProduct.imageUrl) {
        setImageUrls(
          editingProduct.imageUrl.split(',').map(url => url.trim()).filter(Boolean)
        );
      } else {
        setImageUrls([]);
      }
    } else {
      setFormData({
        id: '',
        name: '',
        price: '',
        discount: '0',
        description: '',
        imageUrl: '',
        category: '',
        sizes: [],
        colors: [],
        brand: '',
        target: '',
        ratings: [],
      });
      setImageUrls([]);
    }
    setImageInput('');
  }, [editingProduct, showAddEditModal]);

  useEffect(() => {
    if (showAddEditModal && nameInputRef.current) {
      setTimeout(() => {
        nameInputRef.current.focus();
      }, 100);
    }
  }, [showAddEditModal]);

  // -- Handlers de campos --
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSizeToggle = (size) => {
    setFormData(prev => {
      const updatedSizes = prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes: updatedSizes };
    });
  };

  const handleColorToggle = (color) => {
    setFormData(prev => {
      const updatedColors = prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color];
      return { ...prev, colors: updatedColors };
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) return false;
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) return false;
    if (isNaN(parseFloat(formData.discount)) || parseFloat(formData.discount) < 0 || parseFloat(formData.discount) > 100) return false;
    if (!formData.category) return false;
    if (!imageUrls.length) return false;
    return true;
  };

  // Agregar una imagen a la lista
  const handleAddImageUrl = () => {
    const url = imageInput.trim();
    if (url && !imageUrls.includes(url)) {
      setImageUrls([...imageUrls, url]);
      setImageInput('');
    }
  };

  // Quitar imagen por índice
  const handleRemoveImageUrl = (idx) => {
    setImageUrls(imageUrls.filter((_, i) => i !== idx));
  };

  // Enviar el producto
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert('Por favor complete todos los campos requeridos correctamente.');
      return;
    }

    const productData = {
      ...formData,
      id: formData.id || Date.now().toString(),
      price: parseFloat(formData.price),
      discount: parseFloat(formData.discount) / 100,
      images: [...imageUrls],
    };

    if (isEditing) {
      updateProduct(productData);
    } else {
      addProduct(productData);
    }

    setShowAddEditModal(false);
  };

  // Precio final dinámico
  const price = parseFloat(formData.price) || 0;
  const discount = parseFloat(formData.discount) || 0;
  const finalPrice = price - (price * discount / 100);

  return (
    <ModalWrapper 
      isOpen={showAddEditModal} 
      onClose={() => setShowAddEditModal(false)} 
      title={isEditing ? 'Editar Producto' : 'Añadir Nuevo Producto'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[80vh]">
        <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-2">
          <div>
            <label htmlFor="name" className={labelClass}>Nombre*</label>
            <input
              ref={nameInputRef}
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className={labelClass}>Precio*</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label htmlFor="discount" className={labelClass}>Descuento (%)</label>
              <input
                type="number"
                id="discount"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                min="0"
                max="100"
                step="1"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <span className="font-semibold text-gray-400 mr-2">
              Precio final:
            </span>
            <span className="font-bold text-lg text-green-500">
              S/ { isNaN(finalPrice) ? "0.00" : finalPrice.toFixed(2) }
            </span>
            {discount > 0 && (
              <span className="text-xs text-gray-400 ml-2 line-through">
                S/ { Number(price).toFixed(2) }
              </span>
            )}
          </div>

          <div>
            <label className={labelClass}>URL(s) de Imagen*</label>
            <div className="flex gap-2">
              <input
                type="url"
                className={inputClass + " flex-1"}
                value={imageInput}
                onChange={e => setImageInput(e.target.value)}
                placeholder="Pega la URL y haz click en +"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-3 rounded"
                title="Añadir imagen"
              >+</button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {imageUrls.map((url, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={url}
                    alt={`Imagen ${idx + 1}`}
                    className="w-16 h-16 object-cover rounded shadow"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImageUrl(idx)}
                    className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full px-1 text-xs"
                    title="Quitar imagen"
                  >×</button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>Descripción</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className={labelClass}>Categoría*</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="">Seleccionar categoría</option>
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="brand" className={labelClass}>Marca</label>
              <select
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Seleccionar marca</option>
                {BRANDS.map(brand => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="target" className={labelClass}>Público objetivo</label>
            <select
              id="target"
              name="target"
              value={formData.target}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Seleccionar público objetivo</option>
              {PRODUCT_TARGETS.map(target => (
                <option key={target} value={target}>
                  {target}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Tallas disponibles</label>
            <div className="flex flex-wrap gap-2">
              {SIZES.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    formData.sizes.includes(size)
                      ? 'bg-blue-600 text-white'
                      : darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>Colores disponibles</label>
            <div className="flex flex-wrap gap-3">
              {COLORS.map(({ name, hex }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => handleColorToggle(name)}
                  className={`flex items-center gap-1 p-1 rounded-full ${
                    formData.colors.includes(name) 
                      ? 'ring-2 ring-blue-500 ring-offset-1'
                      : ''
                  }`}
                >
                  <span
                    className="w-6 h-6 rounded-full border border-gray-300"
                    style={{ backgroundColor: hex }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 shrink-0 bg-inherit">
          <button
            type="button"
            onClick={() => setShowAddEditModal(false)}
            className={`px-4 py-2 rounded-lg ${
              darkMode
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            {isEditing ? 'Actualizar Producto' : 'Añadir Producto'}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default AddEditProductModal;
