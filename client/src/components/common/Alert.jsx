import React from 'react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

export const Alert = ({ type = 'error', message, errors = [] }) => {
  if (!message && (!errors || errors.length === 0)) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} />;
      case 'info':
        return <Info size={18} style={{ flexShrink: 0, marginTop: '2px' }} />;
      default:
        return <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />;
    }
  };

  return (
    <div className={`alert alert-${type}`} role="alert">
      {getIcon()}
      <div style={{ flex: 1 }}>
        {message && <div>{message}</div>}
        {errors && errors.length > 0 && (
          <ul style={{ margin: '0.25rem 0 0 1.25rem', padding: 0 }}>
            {errors.map((err, index) => (
              <li key={index} style={{ fontSize: '0.8125rem' }}>{err}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
