import React, { useState, useRef, useId } from "react";
import { FaWhatsapp, FaEdit } from "react-icons/fa";
import { useStore } from '../context/StoreContext';
import useOutsideClick from '../hooks/useOutsideClick';

export default function ContactPopover() {
  const { user } = useStore();
  const isAdmin = user && user.role === "admin";

  const [whatsappNumber, setWhatsappNumber] = useState("999999999");
  const [editing, setEditing] = useState(false);
  const [tempNumber, setTempNumber] = useState(whatsappNumber);

  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const popoverId = useId();
  const popoverTitleId = `${popoverId}-title`;
  useOutsideClick(containerRef, () => {
    setOpen(false);
    setEditing(false);
  });

  const handleSave = () => {
    setWhatsappNumber(tempNumber.replace(/\D/g, ""));
    setEditing(false);
  };

  return (
    <div ref={containerRef} className="relative flex items-center">
      {/* Botón de WhatsApp */}
      <button
        onClick={() => setOpen(o => !o)}
        className="
          flex items-center justify-center
          h-12 w-12
          rounded-full bg-green-500 hover:bg-green-600
          shadow-md
          transition-all duration-200
          group
          focus:outline-none
        "
        title="Coordinar por WhatsApp"
        aria-label="Contactar por WhatsApp"
        aria-expanded={open}
        aria-controls={open ? popoverId : undefined}
        aria-haspopup="dialog"
        type="button"
      >
        <FaWhatsapp className="text-white text-3xl group-hover:scale-110 transition-transform" />
      </button>
      {/* Popover */}
      {open && (
        <div
          id={popoverId}
          className="
            absolute right-0 mt-3 min-w-[260px] z-50
            bg-gray-900 border border-gray-800
            rounded-xl shadow-xl p-4 flex flex-col gap-3
          "
          role="dialog"
          aria-modal="false"
          aria-labelledby={popoverTitleId}
        >
          <div className="flex justify-between items-center mb-2">
            <div id={popoverTitleId} className="text-white font-semibold text-base text-center w-full">
              Pagos y entregas<br/>coordinar por WhatsApp
            </div>
            {isAdmin && !editing && (
              <button
                onClick={() => {
                  setEditing(true);
                  setTempNumber(whatsappNumber);
                }}
                className="ml-2 text-gray-300 hover:text-blue-400 transition p-1"
                title="Editar número"
              >
                <FaEdit />
              </button>
            )}
          </div>
          {/* Campo de edición solo para admin */}
          {isAdmin && editing ? (
            <div className="flex flex-col gap-2">
              <input
                type="tel"
                className="rounded px-2 py-1 text-black"
                value={tempNumber}
                onChange={e => setTempNumber(e.target.value.replace(/\D/g, ""))}
                maxLength={12}
                placeholder="Nuevo número WhatsApp"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
                  onClick={() => setEditing(false)}
                  type="button"
                >
                  Cancelar
                </button>
                <button
                  className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                  onClick={handleSave}
                  type="button"
                >
                  Guardar
                </button>
              </div>
            </div>
          ) : (
            <a
              href={`https://wa.me/51${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="
                w-full flex items-center justify-center gap-2 px-3 py-2
                rounded-lg bg-green-500 hover:bg-green-600
                text-white font-bold shadow transition
                mt-1
              "
              aria-label="Abrir conversación de WhatsApp en una nueva pestaña"
            >
              <FaWhatsapp className="text-lg" />
              Chatear por WhatsApp
            </a>
          )}
        </div>
      )}
    </div>
  );
}
