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
      darkMode = false,
      ...inputProps
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(false);

    const iconColorClass = darkMode
      ? 'text-gray-300 hover:text-white'
      : 'text-gray-500 hover:text-gray-700';

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
            className={`${inputClassName} pr-10`}
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
            className={`absolute inset-y-0 right-2 flex items-center px-1 focus:outline-none ${iconColorClass}`}
          >
            {isVisible ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.993 9.993 0 012.293-3.95m2.724-2.632A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7-.512 1.634-1.436 3.064-2.662 4.116M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3l18 18"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
