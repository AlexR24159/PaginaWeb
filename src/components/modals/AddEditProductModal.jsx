// src/components/modals/AddEditProductModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import ModalWrapper from './ModalWrapper';
import { useStore } from '../../context/StoreContext';
import { useTheme } from '../../context/ThemeContext';
import { CATEGORIES, SIZES, COLORS, BRANDS, PRODUCT_TARGETS } from '../../utils/constants';
import { inputClass, labelClass } from '../../utils/formClasses';

const AddEditProductModal = () => {
  const { darkMode } = useTheme();
  const {
    showAddEditModal,
    setShowAddEditModal,
    editingProduct,
    addProduct,
    updateProduct,
    user,
    addToCarousel,
    removeFromCarousel,
    getCarouselImages
  } = useStore();
  const isAdmin = user && user.role === 'admin';
  const isEditing = !!editingProduct;

  const inputCls = inputClass(darkMode);
  const labelCls = labelClass(darkMode);

  const [imageInput, setImageInput] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);

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
    if (!isAdmin) return;
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
      setIsFeatured(getCarouselImages().some(img => img.productId === editingProduct.id));
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
      setIsFeatured(false);
    }
    setImageInput('');
    setErrors({});
    setFormError(null);
  }, [editingProduct, showAddEditModal, isAdmin]);

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
    setFormError(null);
    setErrors(prev => {
      if (!prev[name]) return prev;
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });
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
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del producto es obligatorio.';
    }

    const priceValue = parseFloat(formData.price);
    if (!formData.price || Number.isNaN(priceValue) || priceValue <= 0) {
      newErrors.price = 'Ingresa un precio mayor que cero.';
    }

    const discountValue = formData.discount === '' ? 0 : parseFloat(formData.discount);
    if (Number.isNaN(discountValue) || discountValue < 0 || discountValue > 100) {
      newErrors.discount = 'El descuento debe estar entre 0 y 100.';
    }

    if (!formData.category) {
      newErrors.category = 'Selecciona una categoría.';
    }

    if (!imageUrls.length) {
      newErrors.images = 'Añade al menos una imagen del producto.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Agregar una imagen a la lista
  const handleAddImageUrl = () => {
    const url = imageInput.trim();
    if (url && !imageUrls.includes(url)) {
      setImageUrls([...imageUrls, url]);
      setImageInput('');
      setFormError(null);
      setErrors(prev => {
        if (!prev.images) return prev;
        const updated = { ...prev };
        delete updated.images;
        return updated;
      });
    }
  };

  // Quitar imagen por índice
  const handleRemoveImageUrl = (idx) => {
    setImageUrls(prev => {
      const updated = prev.filter((_, i) => i !== idx);
      if (updated.length === 0) {
        setErrors(err => ({ ...err, images: 'Añade al menos una imagen del producto.' }));
      }
      return updated;
    });
  };

  // Enviar el producto
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setFormError('Por favor corrige los campos marcados antes de continuar.');
      return;
    }
    setFormError(null);

    const normalizedDiscount = formData.discount === '' ? 0 : parseFloat(formData.discount);

    const productData = {
      ...formData,
      id: formData.id || Date.now().toString(),
      price: parseFloat(formData.price),
      discount: normalizedDiscount / 100,
      images: [...imageUrls],
    };

    if (isEditing) {
      updateProduct(productData);
    } else {
      addProduct(productData);
    }

    if (isFeatured) {
      const image = productData.images && productData.images.length > 0 ? productData.images[0] : productData.imageUrl;
      addToCarousel(productData.id, image, productData.name);
    } else {
      removeFromCarousel(productData.id);
    }

    setShowAddEditModal(false);
  };

  // Precio final dinámico
  const price = parseFloat(formData.price) || 0;
  const discount = parseFloat(formData.discount) || 0;
  const finalPrice = price - (price * discount / 100);

  if (!isAdmin) return null;

  return (
    <ModalWrapper
      isOpen={showAddEditModal} 
      onClose={() => setShowAddEditModal(false)} 
      title={isEditing ? 'Editar Producto' : 'Añadir Nuevo Producto'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[80vh]">
        {formError && (
          <div
            className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            role="alert"
            aria-live="assertive"
          >
            {formError}
          </div>
        )}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-2">
          <div>
            <label htmlFor="name" className={labelCls}>Nombre*</label>
            <input
              ref={nameInputRef}
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={inputCls}
              required
              aria-invalid={errors.name ? 'true' : 'false'}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <p id="name-error" className="mt-1 text-sm text-red-500" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className={labelCls}>Precio*</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                className={inputCls}
                required
                aria-invalid={errors.price ? 'true' : 'false'}
                aria-describedby={errors.price ? 'price-error' : undefined}
              />
              {errors.price && (
                <p id="price-error" className="mt-1 text-sm text-red-500" role="alert">
                  {errors.price}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="discount" className={labelCls}>Descuento (%)</label>
              <input
                type="number"
                id="discount"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                min="0"
                max="100"
                step="1"
                className={inputCls}
                aria-invalid={errors.discount ? 'true' : 'false'}
                aria-describedby={errors.discount ? 'discount-error' : undefined}
              />
              {errors.discount && (
                <p id="discount-error" className="mt-1 text-sm text-red-500" role="alert">
                  {errors.discount}
                </p>
              )}
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
            <label className={labelCls}>URL(s) de Imagen*</label>
            <div className="flex gap-2">
              <input
                type="url"
                className={inputCls + " flex-1"}
                value={imageInput}
                onChange={e => setImageInput(e.target.value)}
                placeholder="Pega la URL y haz click en +"
                aria-describedby={errors.images ? 'images-error' : undefined}
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
            {errors.images && (
              <p id="images-error" className="mt-2 text-sm text-red-500" role="alert">
                {errors.images}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="description" className={labelCls}>Descripción</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className={labelCls}>Categoría*</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={inputCls}
                required
                aria-invalid={errors.category ? 'true' : 'false'}
                aria-describedby={errors.category ? 'category-error' : undefined}
              >
                <option value="">Seleccionar categoría</option>
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p id="category-error" className="mt-1 text-sm text-red-500" role="alert">
                  {errors.category}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="brand" className={labelCls}>Marca</label>
              <select
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className={inputCls}
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
            <label htmlFor="target" className={labelCls}>Público objetivo</label>
            <select
              id="target"
              name="target"
              value={formData.target}
              onChange={handleChange}
              className={inputCls}
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
            <label className={labelCls}>Tallas disponibles</label>
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
            <label className={labelCls}>Colores disponibles</label>
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
          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="featured" className={labelCls}>Destacar en carrusel</label>
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
