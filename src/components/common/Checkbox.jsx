import React from 'react';

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

export default Checkbox;
