// src/context/StoreContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { sampleProducts } from '../data/products';
import useLocalStorage from '../hooks/useLocalStorage';
import { filterProducts } from '../utils/helpers';
import useAuth from '../hooks/useAuth';

const StoreContext = createContext();

export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {
  // Store configuration
  const [storeName, setStoreName] = useLocalStorage('storeName', 'Trendify');
  const [storeEmoji, setStoreEmoji] = useLocalStorage('storeEmoji', '🛍️');
  const [campaignName, setCampaignName] = useLocalStorage('campaignName', 'Ofertas de Verano');
  const [currency, setCurrency] = useLocalStorage('currency', 'PEN');
  const [currencyLocale, setCurrencyLocale] = useLocalStorage('currencyLocale', 'es-PE');
  const [yapeNumber, setYapeNumber] = useLocalStorage('yapeNumber', '999-888-777');

  // Footer settings
  const [footerLinks, setFooterLinks] = useLocalStorage('footerLinks', [
    { title: 'Sobre Nosotros', url: '#' },
    { title: 'Contacto', url: '#' },
    { title: 'Preguntas Frecuentes', url: '#' },
    { title: 'Política de Privacidad', url: '#' },
    { title: 'Términos de Servicio', url: '#' },
  ]);
  const [footerInfo, setFooterInfo] = useLocalStorage('footerInfo', {
    address: 'Av. Principal 123, Lima, Perú',
    phone: '+51 999-888-777',
    email: 'contacto@trendify.pe'
  });
  const [editingFooter, setEditingFooter] = useState(false);

  // --------- Carousel editable ---------
  const [carouselSlides, setCarouselSlides] = useLocalStorage('carouselSlides', [
    { id: 'slide-1', imageUrl: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80', title: '', link: '' },
    { id: 'slide-2', imageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80', title: '', link: '' },
    { id: 'slide-3', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80', title: '', link: '' },
    { id: 'slide-4', imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80', title: '', link: '' },
    { id: 'slide-5', imageUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80', title: '', link: '' },
  ]);

  const addCarouselSlide = (slide) => {
    setCarouselSlides([...carouselSlides, { ...slide, id: 'slide-' + Date.now() }]);
  };

  const editCarouselSlide = (id, updated) => {
    setCarouselSlides(carouselSlides.map(s => s.id === id ? { ...s, ...updated } : s));
  };

  const removeCarouselSlide = (id) => {
    setCarouselSlides(carouselSlides.filter(s => s.id !== id));
  };
  // --------- FIN Carousel editable ---------

  // Navigation state
  const [activeNavLink, setActiveNavLink] = useLocalStorage('activeNavLink', 'Novedades');
  const [activeTag, setActiveTag] = useLocalStorage('activeTag', null);

  // User state
  const { user, login, logout, register, updatePassword } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useLocalStorage('filters', {
    categories: [],
    sizes: [],
    colors: [],
    brands: [],
    priceRange: null,
  });

  // Products
  const [products, setProducts] = useLocalStorage('products', sampleProducts);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const getProductById = (id) => products.find(p => p.id === id);

// Wishlist y Cart
const [wishlist, setWishlist] = useLocalStorage('wishlist', []);
const [cart, setCart] = useLocalStorage('cart', []);

// Modales de Wishlist y Cart
const [showWishlistModal, setShowWishlistModal] = useState(false);
const [showCartModal, setShowCartModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useLocalStorage('paymentMethod', 'yape');

  // Product edit/delete states
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  // --- NUEVO: Popup producto ---
  const [popupProduct, setPopupProduct] = useState(null);

  // Abrir popup con un producto
  const openProductPopup = (product) => {
    setPopupProduct(product);
  };

  // Cerrar popup
  const closeProductPopup = () => {
    setPopupProduct(null);
  };

  // Editar mensaje de agradecimiento desde el modal
  const updateThanksMessage = (productId, thanksMessage) => {
    setProducts(
      products.map(p =>
        p.id === productId
          ? { ...p, thanksMessage }
          : p
      )
    );
    // Refresca popup para mostrar el nuevo mensaje actualizado
    if (popupProduct && popupProduct.id === productId) {
      setPopupProduct({ ...popupProduct, thanksMessage });
    }
  };
  // --- FIN POPUP NUEVO ---

  // --------- FILTRO DE PRODUCTOS CON LA BARRA SUPERIOR --------------
  useEffect(() => {
    const filtered = filterProducts(products, {
      searchQuery,
      categoryTag: activeTag,
      navTarget: activeNavLink,
      filters,
    });
    setFilteredProducts(filtered);
  }, [products, searchQuery, activeTag, activeNavLink, filters]);

  // User authentication functions
  // Products management functions
  const addProduct = (product) => {
    setProducts([...products, product]);
  };

  const updateProduct = (updatedProduct) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = (productId) => {
    setProducts(products.filter(p => p.id !== productId));
    if (wishlist.includes(productId)) {
      removeFromWishlist(productId);
    }
    if (cart.find(item => item.id === productId)) {
      removeFromCart(productId);
    }
  };

  // Wishlist functions...
  const addToWishlist = (productId) => {
    setWishlist([...wishlist, productId]);
  };

  const removeFromWishlist = (productId) => {
    setWishlist(wishlist.filter(id => id !== productId));
  };

  const isInWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  // Cart functions...
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      setCart(
        cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { id: product.id, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const increaseQuantity = (productId) => {
    setCart(
      cart.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (productId) => {
    const item = cart.find(item => item.id === productId);

    if (item.quantity === 1) {
      removeFromCart(productId);
    } else {
      setCart(
        cart.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, cartItem) => {
      const product = products.find(p => p.id === cartItem.id);
      if (product) {
        const discountedPrice = product.price * (1 - product.discount);
        return total + (discountedPrice * cartItem.quantity);
      }
      return total;
    }, 0);
  };

  // Footer editing functions...
  const addFooterLink = (link) => {
    setFooterLinks([...footerLinks, link]);
  };

  const updateFooterLink = (index, updatedLink) => {
    setFooterLinks(footerLinks.map((link, i) => i === index ? updatedLink : link));
  };

  const removeFooterLink = (index) => {
    setFooterLinks(footerLinks.filter((_, i) => i !== index));
  };

  const updateFooterInfo = (info) => {
    setFooterInfo({ ...footerInfo, ...info });
  };

  // Provide all state and functions to children
  return (
    <StoreContext.Provider
      value={{
        // Store configuration
        storeName,
        setStoreName,
        storeEmoji,
        setStoreEmoji,
        campaignName,
        setCampaignName,
        currency,
        setCurrency,
        currencyLocale,
        setCurrencyLocale,
        yapeNumber,
        setYapeNumber,

        // Footer configuration
        footerLinks,
        setFooterLinks,
        addFooterLink,
        updateFooterLink,
        removeFooterLink,
        footerInfo,
        updateFooterInfo,
        editingFooter,
        setEditingFooter,

        // Navigation
        activeNavLink,
        setActiveNavLink,
        activeTag,
        setActiveTag,

        // User
        user,
        login,
        logout,
        register,
        updatePassword,
        showLoginModal,
        setShowLoginModal,

        // Search and filters
        searchQuery,
        setSearchQuery,
        filters,
        setFilters,

        // Products
        products,
        setProducts,
        filteredProducts,
        getProductById,
        addProduct,
        updateProduct,
        deleteProduct,

        // Product editing
        showAddEditModal,
        setShowAddEditModal,
        editingProduct,
        setEditingProduct,
        showDeleteModal,
        setShowDeleteModal,
        deletingProduct,
        setDeletingProduct,

        // Wishlist
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        showWishlistModal,
        setShowWishlistModal,

        // Cart
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        getCartTotal,
        showCartModal,
        setShowCartModal,
        paymentMethod,
        setPaymentMethod,

        // --- Carousel editable ---
        carouselSlides,
        addCarouselSlide,
        editCarouselSlide,
        removeCarouselSlide,

        // --- NUEVO: Popup producto ---
        popupProduct,
        openProductPopup,
        closeProductPopup,
        updateThanksMessage,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
