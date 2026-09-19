import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="page-wrapper" style={{ minHeight: 'calc(100vh - 180px)', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '4rem 1.5rem' }}>
      <div
        className="card liquid-glass-card"
        style={{
          maxWidth: '520px',
          width: '100%',
          padding: '3.5rem 2.5rem',
          background: 'var(--liquid-glass-bg)',
          backdropFilter: 'var(--liquid-glass-blur)',
          WebkitBackdropFilter: 'var(--liquid-glass-blur)',
          border: '1px solid var(--liquid-glass-border)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--liquid-glass-shadow)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            background: 'var(--accent-orange-subtle)',
            border: '1px solid var(--accent-orange-border)',
            color: 'var(--accent-orange)',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <span className="orange-dot" /> 404 Status Error
        </div>
        <h1
          style={{
            fontSize: '5rem',
            fontWeight: 900,
            color: 'var(--text-primary)',
            lineHeight: 1,
            margin: 0,
            letterSpacing: '-0.04em',
          }}
        >
          404
        </h1>
        <h2 style={{ marginTop: '1rem', marginBottom: '0.75rem', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Sector Not Found
        </h2>
        <p style={{ marginBottom: '2.25rem', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
          The requested coordinate does not exist or may have been relocated within the university system.
        </p>
        <Link to="/" className="btn btn-liquid-orange" style={{ minWidth: '180px' }}>
          <Home size={18} /> Return to Main Gateway
        </Link>
      </div>
    </div>
  );
};
