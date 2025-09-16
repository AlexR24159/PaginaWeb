import React, { forwardRef, useState } from 'react';

const PasswordInput = forwardRef(
  (
    {
      id,
      label,
      labelClassName = '',
      wrapperClassName = '',
      inputClassName = '',
      value,
      onChange,
      placeholder = '',
      autoComplete = 'current-password',
      darkMode: _darkMode = false,
      ...inputProps
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(false);
    void _darkMode;

    const toggleVisibility = () => {
      setIsVisible((prev) => !prev);
    };

    return (
      <div className={wrapperClassName}>
        {label ? (
          <label htmlFor={id} className={labelClassName}>
            {label}
          </label>
        ) : null}

        <div className="relative">
          <input
            id={id}
            ref={ref}
            type={isVisible ? 'text' : 'password'}
            value={value}
            onChange={onChange}
            className={`${inputClassName} pr-16`}
            placeholder={placeholder}
            autoComplete={autoComplete}
            {...inputProps}
          />
          <button
            type="button"
            aria-label={isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            onClick={toggleVisibility}
            onMouseDown={(event) => {
              event.preventDefault();
            }}
            className="absolute inset-y-0 right-4 z-10 flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none"
          >
            {isVisible ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
