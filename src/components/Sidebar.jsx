import React, { useState, useEffect } from 'react';
import { FiFilter, FiX } from 'react-icons/fi';
import { useStore } from '../context/StoreContext';
import { useTheme } from '../context/ThemeContext';
import {
  CATEGORIES,
  SIZES,
  COLORS,
  BRANDS,
  PRICE_RANGES,
} from '../utils/constants';

/* Helpers UI */
const Checkbox = ({ label, checked, onChange, dark }) => (
  <label
    className={`flex items-center gap-2 py-1 cursor-pointer ${
      dark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
    }`}
  >
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 text-blue-600 rounded"
    />
    {label}
  </label>
);

const Radio = ({ label, checked, onChange, dark }) => (
  <label
    className={`flex items-center gap-2 py-1 cursor-pointer ${
      dark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
    }`}
  >
    <input
      type="radio"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 text-blue-600"
    />
    {label}
  </label>
);

const ColorOption = ({ name, hex, checked, onChange }) => (
  <label className="flex items-center gap-2 py-1 cursor-pointer">
    <input type="checkbox" checked={checked} onChange={onChange} className="hidden" />
    <span
      className={`w-6 h-6 rounded-full border ${
        checked ? 'ring-2 ring-blue-500 ring-offset-1' : 'ring-1 ring-gray-300'
      }`}
      style={{ background: hex }}
    />
    <span className={`text-sm ${checked ? 'font-medium' : ''}`}>{name}</span>
  </label>
);

const Accordion = ({ title, open, toggle, children, dark }) => (
  <div className="border-b border-gray-700 last:border-none">
    <button
      onClick={toggle}
      className={`w-full flex justify-between items-center py-3 px-4 text-left ${
        dark ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-100 text-gray-900'
      } transition-colors`}
    >
      <span className="font-medium">{title}</span>
      <svg
        className={`w-5 h-5 transform transition-transform ${open ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <div className={`px-4 ${open ? 'max-h-96' : 'max-h-0'} overflow-hidden transition-all`}>
      {children}
    </div>
  </div>
);

export default function Sidebar() {
  const { darkMode } = useTheme();
  const { filters, setFilters, resetFilters } = useStore();

  const initialFilters = {
    categories: ['Todo'],
    sizes: ['Todo'],
    colors: ['Todo'],
    brands: ['Todo'],
    priceRange: 'Todo',
  };

  const [openDrawer, setOpenDrawer] = useState(false);
  const [draft, setDraft] = useState(filters);

  useEffect(() => setDraft(filters), [filters]);

  const [open, setOpen] = useState({
    category: false,
    size: false,
    color: false,
    brand: false,
    price: false,
  });
  const toggleAcc = (key) => setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  // Toggle para arrays con opción "Todo"
  const toggleArrayWithAll = (key, value) => {
    setDraft((prev) => {
      const current = prev[key];
      if (value === 'Todo') {
        return { ...prev, [key]: ['Todo'] };
      } else {
        let newArr = current.includes('Todo') ? [] : [...current];
        if (newArr.includes(value)) {
          newArr = newArr.filter((v) => v !== value);
          if (newArr.length === 0) newArr = ['Todo'];
        } else {
          newArr.push(value);
        }
        return { ...prev, [key]: newArr };
      }
    });
  };

  // Toggle para priceRange con opción "Todo"
  const setSingleWithAll = (key, value) => {
    if (value === 'Todo') {
      setDraft((prev) => ({ ...prev, [key]: 'Todo' }));
    } else {
      setDraft((prev) => ({ ...prev, [key]: value }));
    }
  };

  const apply = () => {
    setFilters(draft);
    setOpenDrawer(false);
  };

  const clear = () => {
    setFilters(initialFilters);
    setDraft(initialFilters);
  };

  const Drawer = () =>
    openDrawer && (
      <>
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-40"
          onClick={() => setOpenDrawer(false)}
        />
        <aside
          className="fixed left-0 top-40 w-60 h-1/2 bg-gray-900 text-white flex flex-col z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
            <h2 className="text-lg font-semibold">Filtros</h2>
            <button onClick={() => setOpenDrawer(false)} aria-label="Cerrar">
              <FiX size={22} />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto">
            <Accordion title="Categoría" open={open.category} toggle={() => toggleAcc('category')} dark>
              <div className="pb-2 space-y-1">
                <Checkbox
                  label="Todo"
                  checked={draft.categories.includes('Todo')}
                  onChange={() => toggleArrayWithAll('categories', 'Todo')}
                  dark
                />
                {CATEGORIES.map((cat) => (
                  <Checkbox
                    key={cat}
                    label={cat}
                    checked={draft.categories.includes(cat)}
                    onChange={() => toggleArrayWithAll('categories', cat)}
                    dark
                  />
                ))}
              </div>
            </Accordion>

            <Accordion title="Talla" open={open.size} toggle={() => toggleAcc('size')} dark>
              <div className="pb-2 max-h-40 overflow-y-auto space-y-1">
                <Checkbox
                  label="Todo"
                  checked={draft.sizes.includes('Todo')}
                  onChange={() => toggleArrayWithAll('sizes', 'Todo')}
                  dark
                />
                {SIZES.map((s) => (
                  <Checkbox
                    key={s}
                    label={s}
                    checked={draft.sizes.includes(s)}
                    onChange={() => toggleArrayWithAll('sizes', s)}
                    dark
                  />
                ))}
              </div>
            </Accordion>

            <Accordion title="Color" open={open.color} toggle={() => toggleAcc('color')} dark>
              <div className="pb-2 grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                <Checkbox
                  label="Todo"
                  checked={draft.colors.includes('Todo')}
                  onChange={() => toggleArrayWithAll('colors', 'Todo')}
                  dark
                />
                {COLORS.map(({ name, hex }) => (
                  <ColorOption
                    key={name}
                    name={name}
                    hex={hex}
                    checked={draft.colors.includes(name)}
                    onChange={() => toggleArrayWithAll('colors', name)}
                  />
                ))}
              </div>
            </Accordion>

            <Accordion title="Marca" open={open.brand} toggle={() => toggleAcc('brand')} dark>
              <div className="pb-2 max-h-40 overflow-y-auto space-y-1">
                <Checkbox
                  label="Todo"
                  checked={draft.brands.includes('Todo')}
                  onChange={() => toggleArrayWithAll('brands', 'Todo')}
                  dark
                />
                {BRANDS.map((b) => (
                  <Checkbox
                    key={b}
                    label={b}
                    checked={draft.brands.includes(b)}
                    onChange={() => toggleArrayWithAll('brands', b)}
                    dark
                  />
                ))}
              </div>
            </Accordion>

            <Accordion title="Precio" open={open.price} toggle={() => toggleAcc('price')} dark>
              <div className="pb-2 space-y-1">
                <Radio
                  label="Todo"
                  checked={draft.priceRange === 'Todo'}
                  onChange={() => setSingleWithAll('priceRange', 'Todo')}
                  dark
                />
                {PRICE_RANGES.map((r) => (
                  <Radio
                    key={r.id}
                    label={r.label}
                    checked={draft.priceRange === r.id}
                    onChange={() => setSingleWithAll('priceRange', r.id)}
                    dark
                  />
                ))}
              </div>
            </Accordion>
          </div>

          <div className="px-4 py-3 border-t border-gray-700 flex justify-between">
            <button
              onClick={clear}
              className="px-3 py-1 rounded bg-gray-600 hover:bg-gray-500 text-sm"
            >
              Limpiar
            </button>
            <button
              onClick={apply}
              className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-sm"
            >
              Aplicar
            </button>
          </div>
        </aside>
      </>
    );

  return (
    <>
      <div
        className={`fixed left-0 z-50 flex items-center gap-2 px-4 py-3 cursor-pointer rounded-tr-md rounded-br-md ${
          darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'
        } border-r border-gray-700`}
        onClick={() => setOpenDrawer(true)}
        aria-label="Abrir filtros"
        style={{ top: '250px' }}
      >
        <FiFilter size={24} />
        <span className="font-semibold hidden md:inline">Filtros</span>
      </div>

      {Drawer()}
    </>
  );
}
