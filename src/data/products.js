// src/data/products.js
import jacketImage from '../assets/products/jacket.svg';
import sneakersImage from '../assets/products/sneakers.svg';
import handbagImage from '../assets/products/handbag.svg';
import watchImage from '../assets/products/watch.svg';
import dressImage from '../assets/products/dress.svg';
import headphonesImage from '../assets/products/headphones.svg';
import shirtImage from '../assets/products/shirt.svg';
import sandalsImage from '../assets/products/sandals.svg';
import backpackImage from '../assets/products/backpack.svg';
import necklaceImage from '../assets/products/necklace.svg';
import ringImage from '../assets/products/ring.svg';
import tabletImage from '../assets/products/tablet.svg';
import smartphoneImage from '../assets/products/smartphone.svg';
import dumbbellImage from '../assets/products/dumbbell.svg';
import yogaMatImage from '../assets/products/yoga-mat.svg';
import lampImage from '../assets/products/lamp.svg';
import coffeeMakerImage from '../assets/products/coffee-maker.svg';
import giftBoxImage from '../assets/products/gift-box.svg';
import ecoKitImage from '../assets/products/eco-kit.svg';

export const sampleProducts = [
  {
    id: '1',
    name: 'Chaqueta de Cuero Vintage',
    price: 89.99,
    discount: 0.15,
    description:
      'Chaqueta de cuero sintético con acabado vintage. Ideal para un estilo casual y moderno.',
    imageUrl: jacketImage,
    images: [jacketImage],
    category: 'Ropa',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Negro', 'Marrón'],
    brand: 'Urban Style',
    target: 'Unisex',
    ratings: [5, 4, 5, 5],
  },
  {
    id: '2',
    name: 'Zapatillas Deportivas Air Max',
    price: 129.99,
    discount: 0,
    description:
      'Zapatillas deportivas de alto rendimiento con amortiguación de aire para mayor comodidad.',
    imageUrl: sneakersImage,
    images: [sneakersImage],
    category: 'Zapatos',
    sizes: ['39', '40', '41', '42', '43'],
    colors: ['Blanco', 'Negro', 'Rojo'],
    brand: 'SportMax',
    target: 'Hombre',
    ratings: [4, 3, 5, 4],
  },
  {
    id: '3',
    name: 'Bolso Elegante de Cuero',
    price: 59.99,
    discount: 0.1,
    description:
      'Bolso de mano de cuero genuino con compartimentos interiores y diseño elegante.',
    imageUrl: handbagImage,
    images: [handbagImage],
    category: 'Bolsos',
    sizes: ['Único'],
    colors: ['Marrón', 'Negro'],
    brand: 'LuxBag',
    target: 'Mujer',
    ratings: [4, 5, 5, 5],
  },
  {
    id: '4',
    name: 'Reloj Digital Impermeable',
    price: 49.99,
    discount: 0.2,
    description:
      'Reloj digital impermeable con cronómetro, alarma y función de iluminación.',
    imageUrl: watchImage,
    images: [watchImage],
    category: 'Accesorios',
    sizes: ['Único'],
    colors: ['Negro', 'Plateado'],
    brand: 'TimeX',
    target: 'Unisex',
    ratings: [3, 4, 4],
  },
  {
    id: '5',
    name: 'Vestido de Fiesta Elegante',
    price: 79.99,
    discount: 0,
    description:
      'Vestido elegante para ocasiones especiales con detalles brillantes.',
    imageUrl: dressImage,
    images: [dressImage],
    category: 'Ropa',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Rojo', 'Negro', 'Azul'],
    brand: 'Glamour',
    target: 'Mujer',
    ratings: [5, 4, 5],
  },
  {
    id: '6',
    name: 'Auriculares Inalámbricos',
    price: 149.99,
    discount: 0.25,
    description:
      'Auriculares inalámbricos con cancelación de ruido y alta calidad de sonido.',
    imageUrl: headphonesImage,
    images: [headphonesImage],
    category: 'Accesorios',
    sizes: ['Único'],
    colors: ['Negro', 'Blanco'],
    brand: 'SoundPro',
    target: 'Unisex',
    ratings: [5, 5, 5, 5],
  },
  {
    id: '7',
    name: 'Camisa de Lino Casual',
    price: 45.99,
    discount: 0,
    description:
      'Camisa de lino fresca y cómoda para uso casual o semi-formal.',
    imageUrl: shirtImage,
    images: [shirtImage],
    category: 'Ropa',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Blanco', 'Azul', 'Beige'],
    brand: 'CasualFit',
    target: 'Hombre',
    ratings: [3, 4],
  },
  {
    id: '8',
    name: 'Sandalias de Verano',
    price: 35.99,
    discount: 0.1,
    description:
      'Sandalias cómodas y ligeras, perfectas para el verano.',
    imageUrl: sandalsImage,
    images: [sandalsImage],
    category: 'Zapatos',
    sizes: ['36', '37', '38', '39', '40'],
    colors: ['Marrón', 'Negro', 'Beige'],
    brand: 'ComfortStep',
    target: 'Mujer',
    ratings: [4, 4, 4, 4],
  },
  {
    id: '9',
    name: 'Mochila Urbana Expandible',
    price: 64.9,
    discount: 0.1,
    description:
      'Mochila resistente al agua con compartimento para laptop y bolsillos ocultos.',
    imageUrl: backpackImage,
    images: [backpackImage],
    category: 'Bolsos',
    sizes: ['Único'],
    colors: ['Negro', 'Gris', 'Azul'],
    brand: 'Urban Trek',
    target: 'Unisex',
    ratings: [4, 5, 4],
  },
  {
    id: '10',
    name: 'Collar Minimalista de Plata',
    price: 45.5,
    discount: 0.05,
    description:
      'Collar de plata 925 con dije geométrico pulido y cadena ajustable.',
    imageUrl: necklaceImage,
    images: [necklaceImage],
    category: 'Joyería',
    sizes: ['Único'],
    colors: ['Plateado'],
    brand: 'Luna Brillante',
    target: 'Mujer',
    ratings: [5, 4, 5, 4],
  },
  {
    id: '11',
    name: 'Anillo Ajustable con Zirconias',
    price: 39.99,
    discount: 0,
    description:
      'Anillo ajustable bañado en oro rosa con incrustaciones de zirconias brillantes.',
    imageUrl: ringImage,
    images: [ringImage],
    category: 'Joyería',
    sizes: ['Único'],
    colors: ['Dorado', 'Rosa'],
    brand: 'Aura Fine',
    target: 'Mujer',
    ratings: [4, 5, 5],
  },
  {
    id: '12',
    name: 'Tablet HD 10" Conectada',
    price: 299.9,
    discount: 0.12,
    description:
      'Tablet de 10 pulgadas con pantalla Full HD, 128 GB de almacenamiento y batería de larga duración.',
    imageUrl: tabletImage,
    images: [tabletImage],
    category: 'Electrónica',
    sizes: ['Único'],
    colors: ['Gris', 'Azul'],
    brand: 'NovaTech',
    target: 'Unisex',
    ratings: [5, 4, 4],
  },
  {
    id: '13',
    name: 'Smartphone Eco Lite',
    price: 549,
    discount: 0.08,
    description:
      'Smartphone con cámara dual de 50 MP, carga rápida y carcasa fabricada con materiales reciclados.',
    imageUrl: smartphoneImage,
    images: [smartphoneImage],
    category: 'Electrónica',
    sizes: ['Único'],
    colors: ['Verde', 'Negro'],
    brand: 'EcoPhone',
    target: 'Unisex',
    ratings: [5, 4, 5, 4],
  },
  {
    id: '14',
    name: 'Kit de Pesas Ajustables 20kg',
    price: 189.9,
    discount: 0.15,
    description:
      'Set de pesas ajustables con agarre antideslizante y discos recubiertos para entrenamientos en casa.',
    imageUrl: dumbbellImage,
    images: [dumbbellImage],
    category: 'Deporte',
    sizes: ['Único'],
    colors: ['Negro', 'Gris'],
    brand: 'PowerFit',
    target: 'Unisex',
    ratings: [4, 4, 5],
  },
  {
    id: '15',
    name: 'Mat de Yoga Antideslizante Pro',
    price: 69.9,
    discount: 0.1,
    description:
      'Colchoneta de yoga de 6 mm con superficie antideslizante y correa de transporte incluida.',
    imageUrl: yogaMatImage,
    images: [yogaMatImage],
    category: 'Deporte',
    sizes: ['Único'],
    colors: ['Morado', 'Verde'],
    brand: 'ZenFlex',
    target: 'Unisex',
    ratings: [5, 5, 4, 5],
  },
  {
    id: '16',
    name: 'Lámpara de Mesa Escandinava',
    price: 89,
    discount: 0.07,
    description:
      'Lámpara de mesa con pantalla de lino y base de madera clara para iluminar espacios de descanso.',
    imageUrl: lampImage,
    images: [lampImage],
    category: 'Hogar',
    sizes: ['Único'],
    colors: ['Beige', 'Marrón'],
    brand: 'Nordic Light',
    target: 'Unisex',
    ratings: [4, 5, 4],
  },
  {
    id: '17',
    name: 'Cafetera de Goteo Compacta',
    price: 129.5,
    discount: 0.18,
    description:
      'Cafetera de goteo programable con jarra térmica y filtro reutilizable para 12 tazas.',
    imageUrl: coffeeMakerImage,
    images: [coffeeMakerImage],
    category: 'Hogar',
    sizes: ['Único'],
    colors: ['Negro', 'Plateado'],
    brand: 'CaféMaster',
    target: 'Unisex',
    ratings: [5, 4, 4, 5],
  },
  {
    id: '18',
    name: 'Caja de Regalo Sorpresa',
    price: 59,
    discount: 0,
    description:
      'Caja de regalo temática con productos locales, tarjeta personalizable y envoltura premium.',
    imageUrl: giftBoxImage,
    images: [giftBoxImage],
    category: 'Otra',
    sizes: ['Único'],
    colors: ['Rojo', 'Dorado'],
    brand: 'Momentos',
    target: 'Unisex',
    ratings: [4, 5, 4, 5],
  },
  {
    id: '19',
    name: 'Kit Eco de Oficina',
    price: 74.5,
    discount: 0.05,
    description:
      'Set de oficina sostenible con botella de acero, libreta reciclada y utensilios reutilizables.',
    imageUrl: ecoKitImage,
    images: [ecoKitImage],
    category: 'Otra',
    sizes: ['Único'],
    colors: ['Verde', 'Beige'],
    brand: 'GreenDesk',
    target: 'Unisex',
    ratings: [5, 4, 4],
  },
];

// Utilidades opcionales (no obligatorias) para tu UI:
export const calcFinalPrice = (p) =>
  Number((p.price * (1 - (p.discount || 0))).toFixed(2));

export const calcAverageRating = (p) =>
  p.ratings && p.ratings.length
    ? Number(
        (p.ratings.reduce((a, b) => a + b, 0) / p.ratings.length).toFixed(1)
      )
    : 0;

export const allCategories = [
  'Ropa',
  'Zapatos',
  'Bolsos',
  'Accesorios',
  'Joyería',
  'Electrónica',
  'Deporte',
  'Hogar',
  'Otra',
];
