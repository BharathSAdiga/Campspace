import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState = ({
  message = 'Loading...',
  size = 28,
  className = '',
}) => {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        gap: '0.75rem',
        color: 'var(--text-muted)',
      }}
      role="status"
      aria-live="polite"
    >
      <Loader2
        size={size}
        style={{
          animation: 'spin 1s linear infinite',
          color: 'var(--primary-500)',
        }}
      />
      {message && <span style={{ fontSize: '0.875rem' }}>{message}</span>}
    </div>
  );
};
