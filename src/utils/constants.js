// src/utils/constants.js
// Navigation links
export const NAVIGATION_LINKS = [
  'Novedades',
  'Hombre',
  'Mujer',
  'Niños',
];

// Product categories (also used as tags)
export const CATEGORIES = [
  'Ropa',
  'Zapatos',
  'Accesorios',
  'Bolsos',
  'Joyería',
  'Electrónica',
  'Deporte',
  'Hogar',
  'Otra',
];

// Product category tags share the same values as categories
export const TAGS = CATEGORIES;

// Product sizes
export const SIZES = [
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  '36',
  '37',
  '38',
  '39',
  '40',
  '41',
  '42',
  '43',
  '44',
  'Único',
];

// Product colors with hex codes
export const COLORS = [
  { name: 'Negro', hex: '#000000' },
  { name: 'Blanco', hex: '#FFFFFF' },
  { name: 'Rojo', hex: '#FF0000' },
  { name: 'Azul', hex: '#0000FF' },
  { name: 'Verde', hex: '#008000' },
  { name: 'Amarillo', hex: '#FFFF00' },
  { name: 'Naranja', hex: '#FFA500' },
  { name: 'Morado', hex: '#800080' },
  { name: 'Rosa', hex: '#FFC0CB' },
  { name: 'Gris', hex: '#808080' },
  { name: 'Marrón', hex: '#A52A2A' },
  { name: 'Beige', hex: '#F5F5DC' },
  { name: 'Plateado', hex: '#C0C0C0' },
  { name: 'Dorado', hex: '#FFD700' },
];

// Product brands
export const BRANDS = [
  'Nike',
  'Adidas',
  'Zara',
  'H&M',
  'Calvin Klein',
  'Sin Marca',
  'Generico',
  'Otras',
];

// Product target audiences
export const PRODUCT_TARGETS = [
  'Hombre',
  'Mujer',
  'Niño',
  'Niña',
  'Unisex',
];

// Price range filters
export const PRICE_RANGES = [
  { id: 'under20', label: 'Menos de S/ 20', min: 0, max: 20 },
  { id: '20to100', label: 'De S/ 20 a S/ 100', min: 20, max: 100 },  
  { id: '100to200', label: 'De S/ 100 a S/ 200', min: 100, max: 200 },
  { id: '200to400', label: 'De S/ 200 a S/ 400', min: 200, max: 400 },
  { id: '400to800', label: 'De S/ 400 a S/ 800', min: 400, max: 800 },
  { id: 'over800', label: 'Más de S/ 800', min: 800, max: undefined },
];

