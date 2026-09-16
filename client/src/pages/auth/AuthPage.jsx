import React from 'react';

export const AuthPage = () => {
  return (
    <div className="page-wrapper" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        <div className="card">
          <h2 style={{ marginBottom: '0.75rem' }}>Authentication</h2>
          <p style={{ color: 'var(--slate-400)', fontSize: '0.95rem' }}>
            Shared authentication module foundation.
          </p>
        </div>
      </div>
    </div>
  );
};
