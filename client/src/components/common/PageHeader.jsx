import React from 'react';

export const PageHeader = ({
  title,
  description,
  breadcrumb = null,
  actions = null,
  badge = null,
  className = '',
}) => {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem',
        marginBottom: '2rem',
        paddingBottom: '1.25rem',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div>
        {breadcrumb && (
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
            {breadcrumb}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 600 }}>{title}</h1>
          {badge && <div>{badge}</div>}
        </div>
        {description && (
          <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', marginTop: '0.35rem', maxWidth: '680px' }}>
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {actions}
        </div>
      )}
    </div>
  );
};
