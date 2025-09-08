import React, { useEffect } from 'react';

// Componentes principales
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import TagBar from './components/TagBar.jsx';
import ProductGrid from './components/ProductGrid.jsx';
import Footer from './components/Footer.jsx';
import Carousel from './components/Carousel.jsx';

// Modales
import AddEditProductModal from './components/modals/AddEditProductModal.jsx';
import DeleteConfirmModal from './components/modals/DeleteConfirmModal.jsx';
import WishlistModal from './components/modals/WishlistModal.jsx';
import CartModal from './components/modals/CartModal.jsx';
import LoginModal from './components/modals/LoginModal.jsx';
import ProductPopupModal from './components/modals/ProductPopupModal.jsx';

// Contextos
import { StoreProvider } from './context/StoreContext.jsx';
import { ThemeProvider, useTheme } from './context/ThemeContext.jsx';

function MainApp() {
  const { darkMode } = useTheme();

  // EFECTO para poner o quitar la clase dark en el <body>
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen w-full flex flex-col transition-colors duration-300 overflow-x-hidden ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <Header />
      <main className="flex-grow flex flex-col md:flex-row">
        <Sidebar />
        <div className="flex-grow px-2 md:px-6 pb-8 w-full">
          {/* --- Fila: TagBar, Espaciador y Carousel --- */}
          <div className="flex flex-col md:flex-row gap-16 items-start mb-4 w-full">
            {/* TagBar */}
            <div className="w-full md:max-w-xs">
              <TagBar />
            </div>
            {/* Espaciador invisible en móvil, visible en desktop */}
            <div className="hidden md:block" style={{ width: '36px', minWidth: '36px' }} />
            {/* Carousel */}
            <div className="flex-1 w-full max-w-screen-2xl overflow-hidden">
              <Carousel />
            </div>
          </div>
          {/* Grid de productos */}
          <div className="w-full">
            <ProductGrid />
          </div>
        </div>
      </main>
      <Footer />
      {/* Modales */}
      <AddEditProductModal />
      <DeleteConfirmModal />
      <WishlistModal />
      <CartModal />
      <LoginModal />
      <ProductPopupModal />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <StoreProvider>
        <MainApp />
      </StoreProvider>
    </ThemeProvider>
  );
}

export default App;
