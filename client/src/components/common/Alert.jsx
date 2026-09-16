import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export const Alert = ({
  type = 'error',
  message,
  errors = [],
  children,
  dismissible = false,
  onDismiss,
  className = '',
}) => {
  if (!message && (!errors || errors.length === 0) && !children) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} />;
      case 'info':
        return <Info size={18} style={{ flexShrink: 0, marginTop: '2px' }} />;
      case 'warning':
        return <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />;
      default:
        return <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />;
    }
  };

  return (
    <div className={`alert alert-${type} ${className}`.trim()} role="alert">
      {getIcon()}
      <div style={{ flex: 1, minWidth: 0 }}>
        {message && <div>{message}</div>}
        {children}
        {errors && errors.length > 0 && (
          <ul style={{ margin: '0.35rem 0 0 1.25rem', padding: 0 }}>
            {errors.map((err, index) => (
              <li key={index} style={{ fontSize: '0.8125rem' }}>
                {err}
              </li>
            ))}
          </ul>
        )}
      </div>
      {dismissible && onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss alert"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'inherit',
            opacity: 0.7,
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
