import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="page-wrapper" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '4rem 1.5rem' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        <h1 style={{ fontSize: '5rem', fontWeight: 800, color: 'var(--primary-400)', lineHeight: 1 }}>404</h1>
        <h2 style={{ marginTop: '1rem', marginBottom: '0.75rem' }}>Page Not Found</h2>
        <p style={{ marginBottom: '2rem' }}>
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link to="/" className="btn btn-primary">
          <Home size={18} /> Return Home
        </Link>
      </div>
    </div>
  );
};
