import { PRICE_RANGES } from './constants';

// Map del nav superior a los valores posibles de target:
const NAV_TARGET_MAP = {
  'Hombre': ['Hombre', 'Unisex'],
  'Mujer': ['Mujer', 'Unisex'],
  'Niños': ['Niño', 'Niña', 'Bebé', 'Unisex'],
  'Novedades': null // null: no filtra por target (muestra todo)
};

/**
 * Formatea un precio con símbolo de moneda
 * @param {number} price - Precio a formatear
 * @param {string} locale - Localización (default 'es-PE')
 * @param {string} currency - Código de moneda (default 'PEN')
 * @returns {string} Precio formateado
 */
export const formatPrice = (price, locale = 'es-PE', currency = 'PEN') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

/**
 * Filtra productos según búsqueda, etiqueta activa y filtros, y ahora también el nav superior (target)
 * @param {Array} products
 * @param {Object} options
 * @returns {Array}
 */
export const filterProducts = (products, options) => {
  const { searchQuery, categoryTag, navTarget, filters } = options;

  return (products || []).filter(product => {
    // Filtro por búsqueda
    if (
      searchQuery &&
      !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !product.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) return false;

    // Filtro barra superior (target)
    if (
      navTarget &&
      NAV_TARGET_MAP[navTarget] &&
      !NAV_TARGET_MAP[navTarget].includes(product.target)
    ) return false;

    // Filtro por categoría de los tags/chips
    if (
      categoryTag &&
      product.category !== categoryTag
    ) return false;

    // Filtros avanzados (igual que antes)
    if (
      filters.categories.length > 0 &&
      !filters.categories.includes('Todo') &&
      !filters.categories.includes(product.category)
    ) return false;

    if (
      filters.sizes.length > 0 &&
      !filters.sizes.includes('Todo') &&
      !filters.sizes.some(size => product.sizes.includes(size))
    ) return false;

    if (
      filters.colors.length > 0 &&
      !filters.colors.includes('Todo') &&
      !filters.colors.some(color => product.colors.includes(color))
    ) return false;

    if (
      filters.brands.length > 0 &&
      !filters.brands.includes('Todo') &&
      !filters.brands.includes(product.brand)
    ) return false;

    if (filters.priceRange && filters.priceRange !== 'Todo') {
      const range = PRICE_RANGES.find(r => r.id === filters.priceRange);
      if (range) {
        const min = range.min || 0;
        const max = range.max;
        const finalPrice = product.price * (1 - product.discount);
        if (min !== undefined && finalPrice < min) return false;
        if (max !== undefined && finalPrice > max) return false;
      }
    }
    return true;
  });
};

/**
 * Genera un ID único tipo UUID simple
 * @returns {string} ID único
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};
