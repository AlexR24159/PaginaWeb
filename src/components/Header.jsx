import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useTheme } from '../context/ThemeContext';
import { NAVIGATION_LINKS } from '../utils/constants';
import ChangePasswordModal from './modals/ChangePasswordModal'; // <--- Importa aquí

// Detecta imágenes por URL (no cambies)
const isImageUrl = (str) =>
  /^https?:\/\/.+\.(png|jpe?g|gif|svg|webp)(\?.*)?$/i.test(str.trim()) ||
  /^https:\/\/encrypted\-tbn\d\.gstatic\.com\/images\?/i.test(str.trim());

// Ícono lápiz para edición
const EditIcon = ({ className = "h-4 w-4 ml-1 text-blue-400 inline" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M15.232 5.232l3.536 3.536M4 17.25V21h3.75l10.606-10.606a1 1 0 00-1.414-1.414L4 17.25z" />
  </svg>
);

const Header = () => {
  const {
    storeName, setStoreName,
    storeEmoji, setStoreEmoji,
    campaignName, setCampaignName,
    activeNavLink, setActiveNavLink,
    searchQuery, setSearchQuery,
    wishlist, cart, user, logout,
    setShowLoginModal, setShowWishlistModal, setShowCartModal
  } = useStore();
  const { darkMode, toggleDarkMode } = useTheme();

  const isAdmin = user && user.role === 'admin';
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmoji, setIsEditingEmoji] = useState(false);
  const [isEditingCampaign, setIsEditingCampaign] = useState(false);
  const [emojiInput, setEmojiInput] = useState(storeEmoji);
  const nameInputRef = useRef(null);
  const emojiInputRef = useRef(null);
  const campaignInputRef = useRef(null);
  const [imageError, setImageError] = useState(false);

  // Para el menú de usuario
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showChangePassModal, setShowChangePassModal] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target)
      ) {
        setShowUserMenu(false);
      }
    }
    if (showUserMenu) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showUserMenu]);

  // ---- Métodos de edición (igual que siempre)
  const startEditingName = () => { if (!isAdmin) return; setIsEditingName(true); setTimeout(() => nameInputRef.current?.focus(), 10); };
  const startEditingEmoji = () => { if (!isAdmin) return; setEmojiInput(storeEmoji); setIsEditingEmoji(true); setImageError(false); setTimeout(() => emojiInputRef.current?.focus(), 10); };
  const startEditingCampaign = () => { if (!isAdmin) return; setIsEditingCampaign(true); setTimeout(() => campaignInputRef.current?.focus(), 10); };

  const handleNameBlur = () => setIsEditingName(false);
  const handleCampaignBlur = () => setIsEditingCampaign(false);

  const handleNameSubmit = (e) => { e.preventDefault(); setIsEditingName(false); };
  const handleEmojiAccept = (e) => { e.preventDefault(); setStoreEmoji(emojiInput.trim()); setIsEditingEmoji(false); setImageError(false); };
  const handleEmojiBlur = () => {};
  const handleCampaignSubmit = (e) => { e.preventDefault(); setIsEditingCampaign(false); };

  const renderStoreIcon = () => {
    if (isImageUrl(storeEmoji) && !imageError) {
      return (
        <img
          src={storeEmoji}
          alt="Logo"
          className="w-16 h-16 rounded-full object-cover border border-gray-300 dark:border-gray-700 bg-white"
          onError={() => setImageError(true)}
          style={{ background: "#fff" }}
        />
      );
    }
    return (
      <span className="text-2xl" role="img" aria-label="Store icon">
        {storeEmoji || '🛍️'}
      </span>
    );
  };

  return (
    <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Store Name and Branding */}
          <div className="flex items-center gap-2">
            {isEditingEmoji ? (
              <form onSubmit={handleEmojiAccept} className="flex items-center gap-2" style={{ position: "relative" }}>
                <input
                  ref={emojiInputRef}
                  type="text"
                  value={emojiInput}
                  onChange={e => { setEmojiInput(e.target.value); setImageError(false); }}
                  onBlur={handleEmojiBlur}
                  placeholder="Emoji o URL de imagen"
                  className="w-56 text-center border rounded p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ color: "#111", background: "#fff" }}
                  aria-label="Edit store icon"
                  autoFocus
                />
                <button type="submit" className="ml-2 px-3 py-1 rounded bg-blue-600 text-white text-xs hover:bg-blue-700 transition" tabIndex={0}>Aceptar</button>
              </form>
            ) : (
              <span
                onClick={isAdmin ? startEditingEmoji : undefined}
                className={`select-none flex items-center ${isAdmin ? "cursor-pointer hover:opacity-80" : ""}`}
                role={isAdmin ? "button" : undefined}
                tabIndex={isAdmin ? 0 : -1}
                aria-label="Edit store icon"
              >
                {renderStoreIcon()}
                {isAdmin && <EditIcon />}
              </span>
            )}

            {isEditingName ? (
              <form onSubmit={handleNameSubmit}>
                <input
                  ref={nameInputRef}
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  onBlur={handleNameBlur}
                  className={`text-xl font-bold ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'} border rounded p-1 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  aria-label="Edit store name"
                  autoFocus
                />
              </form>
            ) : (
              <h1
                onClick={isAdmin ? startEditingName : undefined}
                className={`text-xl font-bold ${isAdmin ? "cursor-pointer hover:opacity-80" : ""}`}
                role={isAdmin ? "button" : undefined}
                aria-label="Edit store name"
                tabIndex={isAdmin ? 0 : -1}
              >
                {storeName}
                {isAdmin && <EditIcon />}
              </h1>
            )}

            {(campaignName || isEditingCampaign) ? (
              <div className="ml-2">
                {isEditingCampaign ? (
                  <form onSubmit={handleCampaignSubmit}>
                    <input
                      ref={campaignInputRef}
                      type="text"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      onBlur={handleCampaignBlur}
                      placeholder="Nombre campaña"
                      className={`text-sm italic ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'} border rounded p-1 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      aria-label="Edit campaign name"
                      autoFocus
                    />
                  </form>
                ) : (
                  <span
                    onClick={isAdmin ? startEditingCampaign : undefined}
                    className={`text-sm italic ${isAdmin ? "cursor-pointer hover:opacity-80" : ""}`}
                    role={isAdmin ? "button" : undefined}
                    aria-label="Edit campaign name"
                    tabIndex={isAdmin ? 0 : -1}
                  >
                    {campaignName}
                    {isAdmin && <EditIcon className="h-3 w-3 ml-1 text-blue-400 inline" />}
                  </span>
                )}
              </div>
            ) : (
              isAdmin && (
                <button
                  onClick={startEditingCampaign}
                  className="ml-2 text-xs text-gray-500 hover:text-blue-500"
                  aria-label="Add campaign name"
                >
                  + Add campaign
                </button>
              )
            )}
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-6">
            {NAVIGATION_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => setActiveNavLink(link)}
                className={`transition-colors ${
                  activeNavLink === link
                    ? 'font-semibold text-blue-600'
                    : darkMode
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {link}
              </button>
            ))}
          </nav>

          {/* Search, Wishlist, Cart, Theme Toggle, User */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0 md:w-64">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 pr-4 py-2 rounded-full w-full ${
                  darkMode
                    ? 'bg-gray-700 text-white border-gray-600 focus:bg-gray-600'
                    : 'bg-gray-100 border-gray-200 focus:bg-white'
                } border focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 absolute left-3 top-2.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => setShowWishlistModal(true)}
              className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Open wishlist"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-700 dark:text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setShowCartModal(true)}
              className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Open shopping cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-700 dark:text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-yellow-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* ----------- MENÚ USUARIO ----------- */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(o => !o)}
                  className={`flex items-center gap-2 py-1 px-3 rounded-full ${
                    darkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                  aria-label="User account"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="hidden sm:inline">
                    {`Hola, ${user.name}`}
                  </span>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded shadow-lg z-50 py-2 min-w-[180px] text-sm border dark:border-gray-700">
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => { setShowChangePassModal(true); setShowUserMenu(false); }}
                    >
                      Cambiar contraseña
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600"
                      onClick={logout}
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
                <ChangePasswordModal
                  isOpen={showChangePassModal}
                  onClose={() => setShowChangePassModal(false)}
                  user={user}
                />
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className={`flex items-center gap-2 py-1 px-3 rounded-full ${
                  darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
                aria-label="Login"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7-7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden sm:inline">
                  Iniciar sesión
                </span>
              </button>
            )}
            {/* ----------- MENÚ USUARIO ----------- */}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden overflow-x-auto flex gap-6 py-3 scrollbar-hide">
          {NAVIGATION_LINKS.map((link) => (
            <button
              key={link}
              onClick={() => setActiveNavLink(link)}
              className={`transition-colors whitespace-nowrap ${
                activeNavLink === link
                  ? 'font-semibold text-blue-600'
                  : darkMode
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              {link}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
