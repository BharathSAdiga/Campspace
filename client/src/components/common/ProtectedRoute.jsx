import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Spinner } from './Spinner';
import { ShieldAlert } from 'lucide-react';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Spinner text="Verifying session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '480px', margin: '0 auto', padding: '3rem 2rem' }}>
          <ShieldAlert size={48} color="var(--accent-rose)" style={{ marginBottom: '1rem' }} />
          <h2>Access Restricted</h2>
          <p style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>
            Your account role (<strong>{user?.role}</strong>) does not have permission to view this page.
          </p>
          <a href="/dashboard" className="btn btn-primary">
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return children;
};
