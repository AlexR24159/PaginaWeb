import React, { useState, useEffect } from "react";

const RatingStars = ({
  value = 0,
  count = 5,
  editable = false,
  onChange,
  size = "1.5em",
}) => {
  const [selected, setSelected] = useState(value);
  const [hoverValue, setHoverValue] = useState(null);

  // Sincroniza con el valor externo (por ejemplo, si cambia el promedio)
  useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleClick = (i) => {
    setSelected(i);
    if (onChange) onChange(i);
  };

  const handleMouseEnter = (i) => {
    setHoverValue(i);
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {Array.from({ length: count }, (_, idx) => {
        const starValue = idx + 1;
        const filled = hoverValue !== null
          ? starValue <= hoverValue
          : starValue <= selected;
        return (
          <span
            key={starValue}
            style={{
              cursor: editable ? "pointer" : "default",
              color: filled ? "#FFD700" : "#888",
              fontSize: size,
              transition: "color 0.2s",
              userSelect: "none",
            }}
            onClick={(e) => {
              if (editable) {
                e.stopPropagation();      // <-- CLAVE para evitar abrir el modal
                handleClick(starValue);
              }
            }}
            onMouseEnter={() => editable && handleMouseEnter(starValue)}
            onMouseLeave={() => editable && handleMouseLeave()}
            tabIndex={editable ? 0 : -1}
            aria-label={editable ? `Poner ${starValue} estrellas` : undefined}
            role={editable ? "button" : "img"}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

export default RatingStars;
