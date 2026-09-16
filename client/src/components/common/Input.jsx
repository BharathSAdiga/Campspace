import React, { forwardRef } from 'react';

export const Input = forwardRef(
  (
    {
      id,
      name,
      label,
      type = 'text',
      error,
      helperText,
      icon = null,
      required = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const inputId = id || name;
    const errorId = inputId ? `${inputId}-error` : undefined;
    const helperId = inputId ? `${inputId}-helper` : undefined;

    return (
      <div className="form-group">
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label}
            {required && <span style={{ color: 'var(--danger-500)', marginLeft: '3px' }}>*</span>}
          </label>
        )}
        <div style={{ position: 'relative', width: '100%' }}>
          {icon && (
            <span
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            required={required}
            className={`form-input ${error ? 'is-invalid' : ''} ${className}`.trim()}
            style={{ paddingLeft: icon ? '2.5rem' : '0.85rem' }}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            {...props}
          />
        </div>
        {error && (
          <span id={errorId} className="form-error" role="alert">
            {error}
          </span>
        )}
        {!error && helperText && (
          <span id={helperId} className="form-helper">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
