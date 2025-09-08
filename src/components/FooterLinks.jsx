import React, { useState } from "react";
import { useStore } from '../context/StoreContext'; // <-- Importa el contexto

const initialLinks = [
  { key: "about", label: "Sobre Nosotros", desc: "Aquí va la descripción de Sobre Nosotros..." },
  { key: "contact", label: "Contacto", desc: "contacto@trendify.com" },
  { key: "faq", label: "Preguntas Frecuentes", desc: "Aquí van las preguntas frecuentes..." },
  { key: "privacy", label: "Política de Privacidad", desc: "Tu privacidad es importante para nosotros." },
  { key: "terms", label: "Términos de Servicio", desc: "Aquí van los términos de servicio..." }
];

const FooterLinks = () => {
  const { user } = useStore();                // <--- Trae el usuario del contexto
  const isAdmin = user && user.role === "admin"; // <--- Solo admin puede editar

  const [links, setLinks] = useState(initialLinks);
  const [modal, setModal] = useState({ open: false, link: null, tempDesc: "" });

  const handleOpen = (link) => {
    setModal({ open: true, link, tempDesc: link.desc });
  };

  const handleSave = () => {
    setLinks(links.map(l =>
      l.key === modal.link.key ? { ...l, desc: modal.tempDesc } : l
    ));
    setModal({ open: false, link: null, tempDesc: "" });
  };

  return (
    <>
      <nav className="flex flex-wrap justify-center gap-5">
        {links.map(link => (
          <button
            key={link.key}
            onClick={() => handleOpen(link)}
            className="text-black dark:text-gray-200 hover:underline hover:text-blue-600 dark:hover:text-white transition-colors"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "inherit"}}
          >
            {link.label}
          </button>
        ))}
      </nav>
      {modal.open && modal.link && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-xl max-w-md w-full">
            <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-gray-100">{modal.link.label}</h3>
            {isAdmin ? (
              <textarea
                className="w-full h-32 border rounded p-2 mb-4 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                value={modal.tempDesc}
                onChange={e => setModal(m => ({ ...m, tempDesc: e.target.value }))}
              />
            ) : (
              <p className="mb-4 text-gray-700 dark:text-gray-100 whitespace-pre-line">{modal.link.desc}</p>
            )}
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setModal({ open: false, link: null, tempDesc: "" })}
                className="px-3 py-1 rounded bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600"
              >
                Cerrar
              </button>
              {isAdmin && (
                <button
                  onClick={handleSave}
                  className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Guardar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FooterLinks;
