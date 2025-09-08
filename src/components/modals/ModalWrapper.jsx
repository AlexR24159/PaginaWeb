// src/components/modals/ModalWrapper.jsx
import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

const ModalWrapper = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  const { darkMode } = useTheme();
  const modalRef = useRef(null);
  
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 p-4">
      <div 
        ref={modalRef}
        className={`${maxWidth} w-full rounded-lg shadow-xl transform transition-all ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between border-b p-4 px-6 pb-3 pt-4">
          <h3 
            id="modal-title"
            className="text-lg font-semibold"
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            className={`rounded-full p-1 ${
              darkMode 
              ? 'text-gray-400 hover:bg-gray-700 hover:text-white' 
              : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'
            }`}
            aria-label="Close modal"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="p-6 pt-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalWrapper;