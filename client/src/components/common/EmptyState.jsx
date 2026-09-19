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
      className={`card liquid-glass-card ${className}`.trim()}
      style={{
        textAlign: 'center',
        padding: '3.5rem 2rem',
        maxWidth: '520px',
        margin: '2rem auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'var(--liquid-glass-bg)',
        backdropFilter: 'var(--liquid-glass-blur)',
        WebkitBackdropFilter: 'var(--liquid-glass-blur)',
        border: '1px solid var(--liquid-glass-border)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--liquid-glass-shadow)',
      }}
    >
      <div
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '16px',
          background: 'var(--accent-orange-subtle)',
          border: '1px solid var(--accent-orange-border)',
          color: 'var(--accent-orange)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        }}
      >
        {renderIcon()}
      </div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.45rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: action ? '1.75rem' : 0 }}>
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};
