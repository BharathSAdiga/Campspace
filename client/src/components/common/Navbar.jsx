import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { GraduationCap, Menu, X, User, LogOut, Heart, ArrowUpRight, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useTheme } from '../../context/ThemeContext';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="nav-capsule" role="banner">
      {/* Brand Logo */}
      <Link
        to="/"
        onClick={() => setMobileMenuOpen(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          textDecoration: 'none',
          color: 'var(--text-primary)',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--bg-noir)',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.3s',
          }}
        >
          <GraduationCap size={20} strokeWidth={2.2} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.03em' }}>
              Camp<span style={{ color: 'var(--text-muted)' }}>space</span>
            </span>
            <span style={{ fontSize: '0.62rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '4px', backgroundColor: 'var(--border-subtle)', border: '1px solid var(--border-hover)', letterSpacing: '0.08em', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              OS
            </span>
          </div>
        </div>
      </Link>

      {/* Live Campus Radar Beacon */}
      <div
        style={{
          display: 'none',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.28rem 0.85rem',
          borderRadius: 'var(--radius-full)',
          background: 'var(--border-subtle)',
          border: '1px solid var(--border-hover)',
          fontSize: '0.74rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
        className="desktop-beacon"
      >
        <span className="beacon-dot" />
        <span>ORBIT ACTIVE</span>
      </div>

      {/* Desktop Navigation Links */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          background: 'var(--border-subtle)',
          padding: '0.25rem 0.5rem',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-subtle)',
        }}
        className="desktop-nav"
        aria-label="Main Navigation"
      >
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

      {/* Auth Actions / Theme Switcher Area */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        {/* Dark / Light Mode Switcher */}
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun size={17} strokeWidth={2.2} /> : <Moon size={17} strokeWidth={2.2} />}
        </button>

        {/* Wishlist Link */}
        <Link
          to="/marketplace/wishlist"
          title="Saved Wishlist"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--border-subtle)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            position: 'relative',
            transition: 'all var(--transition-fast)',
          }}
        >
          <Heart size={16} fill={wishlistCount > 0 ? 'currentColor' : 'none'} />
          {wishlistCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                backgroundColor: 'var(--text-primary)',
                color: 'var(--bg-noir)',
                borderRadius: '9999px',
                fontSize: '0.65rem',
                fontWeight: '800',
                padding: '0.05rem 0.35rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              {wishlistCount}
            </span>
          )}
        </Link>

        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Link
              to="/dashboard"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                background: 'var(--border-subtle)',
                border: '1px solid var(--border-hover)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              <User size={14} color="currentColor" />
              <span>{user?.name?.split(' ')[0] || 'Account'}</span>
            </Link>
            <button
              onClick={handleLogout}
              title="Sign Out"
              style={{
                background: 'var(--border-subtle)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Link
              to="/login"
              style={{
                fontSize: '0.88rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                padding: '0.45rem 0.85rem',
                transition: 'color 0.2s',
              }}
            >
              Sign In
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              <span>Join Free</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        )}

        {/* Mobile Hamburger Toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
          style={{
            background: 'var(--border-subtle)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            color: 'var(--text-primary)',
            padding: '0.4rem',
            cursor: 'pointer',
            display: 'none',
          }}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Inline styles for media queries */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-beacon { display: flex !important; }
        }
        @media (max-width: 860px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-toggle { display: flex !important; }
        }
      `}</style>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '76px',
            left: '1rem',
            right: '1rem',
            background: 'var(--nav-bg)',
            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '24px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            boxShadow: 'var(--shadow-xl)',
            zIndex: 999,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Appearance</span>
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn"
              style={{ width: 'auto', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', gap: '0.45rem', fontSize: '0.8rem' }}
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>

          <NavLink
            to="/"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/marketplace"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Marketplace
          </NavLink>
          <NavLink
            to="/events"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Events
          </NavLink>
          <NavLink
            to="/resources"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Resources
          </NavLink>
          <NavLink
            to="/clubs"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Clubs
          </NavLink>

          {!isAuthenticated && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
              <Link
                to="/login"
                className="btn btn-secondary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn btn-primary"
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

export default Navbar;
