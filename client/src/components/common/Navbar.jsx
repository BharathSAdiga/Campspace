import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, LogOut, Menu, X, LayoutDashboard, User, Shield } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'organizer':
        return 'badge-organizer';
      case 'admin':
        return 'badge-admin';
      default:
        return 'badge-student';
    }
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand" onClick={() => setMobileMenuOpen(false)}>
          <div className="brand-icon-wrapper">
            <GraduationCap size={22} />
          </div>
          <span>
            Campus<span className="brand-accent">Connect</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
            Home
          </NavLink>
          <NavLink
            to="/marketplace"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Marketplace
          </NavLink>
          {isAuthenticated && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Dashboard
            </NavLink>
          )}
        </nav>

        {/* Auth Actions / Profile */}
        <div className="nav-actions">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div className="user-profile-menu">
                <div className="user-avatar-badge">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.2 }}>
                    {user?.name}
                  </span>
                  <span className={`badge ${getRoleBadgeClass(user?.role)}`} style={{ padding: '0.1rem 0.4rem', fontSize: '0.65rem' }}>
                    {user?.role}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                title="Log Out"
                aria-label="Log Out"
              >
                <LogOut size={16} />
                <span style={{ display: 'none', '@media(min-width: 640px)': { display: 'inline' } }}>
                  Logout
                </span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 'var(--header-height)',
            left: 0,
            right: 0,
            background: 'var(--bg-card)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            zIndex: 999,
          }}
        >
          <Link
            to="/"
            className="nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/marketplace"
            className="nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Marketplace
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="btn btn-danger btn-block"
                style={{ marginTop: '0.5rem' }}
              >
                <LogOut size={16} /> Logout ({user?.name})
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Link
                to="/login"
                className="btn btn-secondary btn-block"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn btn-primary btn-block"
                onClick={() => setMobileMenuOpen(false)}
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
