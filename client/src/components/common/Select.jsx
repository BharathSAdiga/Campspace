import React, { forwardRef } from 'react';

export const Select = forwardRef(
  (
    {
      id,
      name,
      label,
      options = [],
      children,
      error,
      helperText,
      required = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const selectId = id || name;
    const errorId = selectId ? `${selectId}-error` : undefined;
    const helperId = selectId ? `${selectId}-helper` : undefined;

    return (
      <div className="form-group">
        {label && (
          <label htmlFor={selectId} className="form-label">
            {label}
            {required && <span style={{ color: 'var(--danger-500)', marginLeft: '3px' }}>*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          name={name}
          required={required}
          className={`form-select ${error ? 'is-invalid' : ''} ${className}`.trim()}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          {...props}
        >
          {children ? (
            children
          ) : (
            options.map((opt, index) => {
              const value = typeof opt === 'object' ? opt.value : opt;
              const text = typeof opt === 'object' ? opt.label : opt;
              return (
                <option key={index} value={value}>
                  {text}
                </option>
              );
            })
          )}
        </select>
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

Select.displayName = 'Select';
