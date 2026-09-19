import React from 'react';

export const Card = ({
  children,
  title,
  subtitle,
  action,
  footer,
  interactive = false,
  variant = 'default',
  className = '',
  onClick,
  style = {},
  ...props
}) => {
  const hasHeader = title || subtitle || action;
  const variantClass = variant === 'elevated'
    ? 'surface-2'
    : variant === 'frame'
    ? 'geo-frame'
    : variant === 'glass'
    ? 'surface-1'
    : variant === 'spotlight'
    ? 'studio-spotlight'
    : '';

  return (
    <div
      className={`card ${variantClass} ${interactive ? 'card-interactive' : ''} ${className}`.trim()}
      onClick={onClick}
      style={{
        cursor: interactive || onClick ? 'pointer' : 'default',
        ...style,
      }}
      {...props}
    >
      {hasHeader && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '1rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            {title && <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>{title}</h3>}
            {subtitle && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}

      <div>{children}</div>

      {footer && (
        <div
          style={{
            marginTop: '1.25rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.85rem',
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
};
