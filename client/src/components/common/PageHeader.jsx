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
        paddingBottom: '1.5rem',
        borderBottom: '1px solid var(--liquid-glass-border)',
      }}
    >
      <div>
        {breadcrumb && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: 'var(--accent-orange)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '0.45rem',
            }}
          >
            <span className="orange-dot" style={{ width: 5, height: 5 }} />
            <span>{breadcrumb}</span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <h1
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.35rem)',
              fontWeight: 850,
              fontFamily: 'var(--font-heading)',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              textTransform: 'uppercase',
            }}
          >
            {title}
          </h1>
          {badge && <div>{badge}</div>}
        </div>
        {description && (
          <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', marginTop: '0.4rem', maxWidth: '720px', lineHeight: 1.6 }}>
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

export default PageHeader;
