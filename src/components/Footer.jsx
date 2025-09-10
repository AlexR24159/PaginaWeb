// src/components/Footer.jsx
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useStore } from '../context/StoreContext';
import FooterLinks from './FooterLinks'; // Importante

const Footer = () => {
  const { darkMode } = useTheme();
  const { storeName } = useStore();

  return (
    <footer className={`mt-auto py-8 ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h2 className="text-xl font-bold">{storeName}</h2>
            <p className="mt-2 text-sm opacity-80">
              © {new Date().getFullYear()} {storeName}. Todos los derechos reservados.
            </p>
          </div>
          {/* Bloque de links editables */}
          <FooterLinks />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
