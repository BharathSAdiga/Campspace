import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

export const ErrorState = ({
  title = 'Failed to load data',
  message = 'An error occurred while fetching information from the server.',
  onRetry = null,
  className = '',
}) => {
  return (
    <div
      className={`card ${className}`.trim()}
      style={{
        textAlign: 'center',
        padding: '3rem 1.5rem',
        maxWidth: '480px',
        margin: '2rem auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      role="alert"
    >
      <div
        style={{
          width: '50px',
          height: '50px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(239, 68, 68, 0.12)',
          color: 'var(--danger-500)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
        }}
      >
        <AlertCircle size={26} />
      </div>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: onRetry ? '1.5rem' : 0 }}>
        {message}
      </p>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          icon={<RotateCcw size={14} />}
        >
          Try Again
        </Button>
      )}
    </div>
  );
};
