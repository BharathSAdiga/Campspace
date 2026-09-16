import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { GraduationCap, Menu, X, User, LogOut, Shield, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { Badge } from './Badge';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'admin':
        return 'warning';
      case 'organizer':
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand" onClick={() => setMobileMenuOpen(false)}>
          <div className="brand-icon-wrapper">
            <GraduationCap size={20} />
          </div>
          <span>
            Camp<span className="brand-accent">space</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav-links" aria-label="Main Navigation">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
            Home
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Dashboard
          </NavLink>
          <NavLink to="/marketplace" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Marketplace
          </NavLink>
          <NavLink to="/events" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Events
          </NavLink>
          <NavLink to="/resources" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Resources
          </NavLink>
          <NavLink to="/clubs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Clubs
          </NavLink>
        </nav>

        {/* Auth Actions / User Area */}
        <div className="nav-actions">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* Wishlist Link */}
              <Link
                to="/marketplace/wishlist"
                className="btn btn-ghost btn-sm"
                title="Saved Wishlist"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  position: 'relative',
                  padding: '0.35rem 0.6rem',
                }}
              >
                <Heart
                  size={17}
                  color="#e11d48"
                  fill={wishlistCount > 0 ? '#e11d48' : 'none'}
                />
                <span className="hidden-sm" style={{ fontSize: '0.8125rem', fontWeight: '500' }}>
                  Wishlist
                </span>
                {wishlistCount > 0 && (
                  <span
                    style={{
                      backgroundColor: '#e11d48',
                      color: '#ffffff',
                      borderRadius: '9999px',
                      fontSize: '0.65rem',
                      fontWeight: '700',
                      padding: '0.1rem 0.4rem',
                      minWidth: '18px',
                      textAlign: 'center',
                    }}
                  >
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                to="/dashboard"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  textDecoration: 'none',
                  color: 'inherit',
                  padding: '0.25rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  transition: 'background-color 0.15s',
                }}
                className="user-profile-chip"
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-100)',
                    color: 'var(--primary-700)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600',
                    fontSize: '0.8125rem',
                  }}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.2 }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                    {user?.name?.split(' ')[0] || 'Account'}
                  </span>
                  <Badge variant={getRoleBadgeVariant(user?.role)} size="sm">
                    {user?.role || 'student'}
                  </Badge>
                </div>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-ghost btn-sm"
                title="Sign out"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
              >
                <LogOut size={16} />
                <span className="hidden-sm">Sign Out</span>
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 'calc(var(--header-height) + 1.25rem)',
            left: '1rem',
            right: '1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(24px) saturate(190%)',
            WebkitBackdropFilter: 'blur(24px) saturate(190%)',
            border: '1px solid rgba(216, 204, 184, 0.8)',
            borderRadius: '20px',
            boxShadow: '0 25px 50px -12px rgba(44, 36, 22, 0.15), inset 0 1px 1px rgba(255, 255, 255, 1)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            zIndex: 99,
          }}
        >
          <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>
          <Link to="/dashboard" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            Dashboard
          </Link>
          <Link to="/marketplace" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            Marketplace
          </Link>
          <Link to="/marketplace/wishlist" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            Saved Wishlist {wishlistCount > 0 ? `(${wishlistCount})` : ''}
          </Link>
          <Link to="/events" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            Events
          </Link>
          <Link to="/resources" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            Resources
          </Link>
          <Link to="/clubs" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            Clubs
          </Link>
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {isAuthenticated ? (
              <>
                <div style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: '#0F172A',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                    }}
                  >
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600' }}>{user?.name}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{user?.email}</div>
                  </div>
                </div>
                <button type="button" className="btn btn-secondary btn-block" onClick={handleLogout}>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary btn-block" onClick={() => setMobileMenuOpen(false)}>
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary btn-block" onClick={() => setMobileMenuOpen(false)}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
