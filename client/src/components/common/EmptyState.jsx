import React from 'react';
import { Inbox } from 'lucide-react';

export const EmptyState = ({
  title = 'No items found',
  description = 'There are currently no items to display.',
  icon = null,
  action = null,
  className = '',
}) => {
  const renderIcon = () => {
    if (!icon) return <Inbox size={28} />;
    if (React.isValidElement(icon)) return icon;
    if (typeof icon === 'function' || (typeof icon === 'object' && icon !== null)) {
      const IconComponent = icon;
      return <IconComponent size={28} />;
    }
    return icon;
  };

  return (
    <div
      className={`card ${className}`.trim()}
      style={{
        textAlign: 'center',
        padding: '3.5rem 1.5rem',
        maxWidth: '480px',
        margin: '2rem auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '54px',
          height: '54px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-surface-hover)',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
        }}
      >
        {renderIcon()}
      </div>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: action ? '1.5rem' : 0 }}>
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};
