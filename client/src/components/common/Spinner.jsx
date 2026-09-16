import React from 'react';

export const Spinner = ({ size = 'md', text = 'Loading...' }) => {
  return (
    <div className="page-loader" role="status" aria-live="polite">
      <div className={`spinner ${size === 'lg' ? 'spinner-lg' : ''}`} />
      {text && <p style={{ color: 'var(--slate-400)', fontSize: '0.9375rem' }}>{text}</p>}
    </div>
  );
};
