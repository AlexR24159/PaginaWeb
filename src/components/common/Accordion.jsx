import React from 'react';

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

export default Accordion;
