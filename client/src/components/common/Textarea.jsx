import React, { forwardRef } from 'react';

export const Textarea = forwardRef(
  (
    {
      id,
      name,
      label,
      rows = 4,
      error,
      helperText,
      required = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const textareaId = id || name;
    const errorId = textareaId ? `${textareaId}-error` : undefined;
    const helperId = textareaId ? `${textareaId}-helper` : undefined;

    return (
      <div className="form-group">
        {label && (
          <label htmlFor={textareaId} className="form-label">
            {label}
            {required && <span style={{ color: 'var(--danger-500)', marginLeft: '3px' }}>*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          name={name}
          rows={rows}
          required={required}
          className={`form-textarea ${error ? 'is-invalid' : ''} ${className}`.trim()}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          {...props}
        />
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

Textarea.displayName = 'Textarea';
