import React, { useState, useRef, useEffect } from "react";
import { FaWhatsapp, FaEdit } from "react-icons/fa";
import { useStore } from '../context/StoreContext'; // Agrega esto

export default function ContactPopover() {
  const { user } = useStore(); // Trae el user del contexto
  const isAdmin = user && user.role === "admin";

  // Número guardado en estado (puedes traerlo de contexto o localStorage)
  const [whatsappNumber, setWhatsappNumber] = useState("999999999");
  const [editing, setEditing] = useState(false);
  const [tempNumber, setTempNumber] = useState(whatsappNumber);

  const [open, setOpen] = useState(false);
  const btnRef = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (
        btnRef.current &&
        !btnRef.current.contains(e.target) &&
        !document.getElementById("popover-content")?.contains(e.target)
      ) {
        setOpen(false);
        setEditing(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleSave = () => {
    setWhatsappNumber(tempNumber.replace(/\D/g, ""));
    setEditing(false);
  };

  return (
    <div className="relative flex items-center">
      {/* Botón de WhatsApp */}
      <button
        ref={btnRef}
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
      >
        <FaWhatsapp className="text-white text-3xl group-hover:scale-110 transition-transform" />
      </button>
      {/* Popover */}
      {open && (
        <div
          id="popover-content"
          className="
            absolute right-0 mt-3 min-w-[260px] z-50
            bg-gray-900 border border-gray-800
            rounded-xl shadow-xl p-4 flex flex-col gap-3
          "
        >
          <div className="flex justify-between items-center mb-2">
            <div className="text-white font-semibold text-base text-center w-full">
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
