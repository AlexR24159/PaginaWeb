import React from 'react';
import { useStore } from '../context/StoreContext';
import { useTheme } from '../context/ThemeContext';
import { TAGS } from '../utils/constants';

const TagBar = () => {
  const { darkMode } = useTheme();
  const { activeTag, setActiveTag } = useStore();

  const handleTagClick = (tag) => {
    if (activeTag === tag) {
      setActiveTag(null);
    } else {
      setActiveTag(tag);
    }
  };

  // Divide el arreglo en filas de 5 tags
  const TAGS_PER_ROW = 5;
  const tagRows = [];
  for (let i = 0; i < TAGS.length; i += TAGS_PER_ROW) {
    tagRows.push(TAGS.slice(i, i + TAGS_PER_ROW));
  }

  return (
    <div className="py-4">
      {tagRows.map((row, idx) => (
        <div key={idx} className="flex gap-2 mb-2">
          {row.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap
                ${activeTag === tag
                  ? 'bg-blue-600 text-white shadow-md'
                  : darkMode
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {tag}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TagBar;
