// src/components/modals/ModalWrapper.jsx
import React, { useEffect, useRef, useId } from 'react';
import { useTheme } from '../../context/ThemeContext';

const FOCUSABLE_SELECTORS =
  'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const ModalWrapper = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  const { darkMode } = useTheme();
  const modalRef = useRef(null);
  const previouslyFocusedElement = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    previouslyFocusedElement.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

    const modalNode = modalRef.current;

    const getFocusableElements = () => {
      if (!modalNode) return [];
      return Array.from(modalNode.querySelectorAll(FOCUSABLE_SELECTORS)).filter(
        (el) => el instanceof HTMLElement && !el.hasAttribute('aria-hidden')
      );
    };

    const focusFirstElement = () => {
      const [firstElement] = getFocusableElements();
      if (firstElement && typeof firstElement.focus === 'function') {
        firstElement.focus();
      } else if (modalNode && typeof modalNode.focus === 'function') {
        modalNode.focus({ preventScroll: true });
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === 'Tab') {
        const focusable = getFocusableElements();
        if (focusable.length === 0) {
          event.preventDefault();
          if (modalNode) {
            modalNode.focus({ preventScroll: true });
          }
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;

        if (event.shiftKey) {
          if (active === first || !modalNode?.contains(active)) {
            event.preventDefault();
            last.focus();
          }
        } else if (active === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    const handleClickOutside = (event) => {
      if (modalNode && !modalNode.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    document.body.style.overflow = 'hidden';

    focusFirstElement();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
      if (previouslyFocusedElement.current && typeof previouslyFocusedElement.current.focus === 'function') {
        previouslyFocusedElement.current.focus({ preventScroll: true });
      }
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
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className="flex items-center justify-between border-b p-4 px-6 pb-3 pt-4">
          <h3
            id={titleId}
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