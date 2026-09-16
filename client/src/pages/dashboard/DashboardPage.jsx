import React from 'react';

export const DashboardPage = () => {
  return (
    <div className="page-wrapper" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
      <div className="container" style={{ maxWidth: '640px' }}>
        <div className="card">
          <h2 style={{ marginBottom: '0.75rem' }}>Campus Dashboard</h2>
          <p style={{ color: 'var(--slate-400)', fontSize: '0.95rem' }}>
            Shared dashboard module foundation for Campspace.
          </p>
        </div>
      </div>
    </div>
  );
};
