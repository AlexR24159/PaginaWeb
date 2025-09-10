// src/utils/formClasses.js
// Helper classes for form inputs and labels
export const inputClass = (darkMode) =>
  `w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
  }`;

export const labelClass = (darkMode) =>
  `block mb-1 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`;
