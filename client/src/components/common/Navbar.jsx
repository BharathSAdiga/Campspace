import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Heart, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useTheme } from '../../context/ThemeContext';

const navItems = [
  { to: '/events', label: 'Events', index: '01' },
  { to: '/marketplace', label: 'Marketplace', index: '02' },
  { to: '/resources', label: 'Resources', index: '03' },
  { to: '/clubs', label: 'Clubs', index: '04' },
];

const iconButtonStyle = {
  width: '36px',
  height: '36px',
  borderRadius: 'var(--radius-xs)',
  border: '1px solid var(--border-subtle)',
  background: 'var(--bg-surface)',
  color: 'var(--text-secondary)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  position: 'relative',
  transition: 'all var(--transition-fast)',
};

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const allNavItems = isAuthenticated
    ? [...navItems, { to: '/dashboard', label: 'Dashboard', index: '05' }]
    : navItems;

  return (
    <header
      className="nav-capsule"
      role="banner"
      style={{
        borderBottom: '1px solid var(--border-subtle)',
        background: scrolled ? 'var(--nav-bg)' : 'var(--nav-bg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <Link
        to="/"
        onClick={() => setMobileMenuOpen(false)}
        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}
        aria-label="Campspace Home"
      >
        <span
          style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-xs)',
            background: 'var(--text-primary)',
            color: 'var(--text-inverse)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
          }}
        >
          CS
        </span>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-heading)',
              fontSize: '1rem',
              fontWeight: 850,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              lineHeight: 1.1,
            }}
          >
            Campspace
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.06em',
            }}
          >
            OS // 2.4
          </span>
        </div>
      </Link>

      <nav
        className="desktop-nav"
        aria-label="Main Navigation"
        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
      >
        {allNavItems.map(({ to, label, index }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <span style={{ color: 'var(--text-dim)', fontSize: '0.65rem' }}>{index}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        <button
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={iconButtonStyle}
          className="focus-ring"
        >
          {isDark ? <Sun size={16} strokeWidth={2} /> : <Moon size={16} strokeWidth={2} />}
        </button>

        <Link
          to="/marketplace/wishlist"
          title="Saved Wishlist"
          aria-label="Saved Wishlist"
          style={iconButtonStyle}
          className="focus-ring"
        >
          <Heart size={16} fill={wishlistCount > 0 ? 'currentColor' : 'none'} strokeWidth={2} />
          {wishlistCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                minWidth: '16px',
                height: '16px',
                padding: '0 4px',
                borderRadius: '999px',
                background: 'var(--text-primary)',
                color: 'var(--text-inverse)',
                border: '1px solid var(--surface-0)',
                fontSize: '0.62rem',
                fontWeight: 800,
                lineHeight: '14px',
                textAlign: 'center',
              }}
            >
              {wishlistCount}
            </span>
          )}
        </Link>

        <div style={{ width: 1, height: 22, background: 'var(--border-subtle)', margin: '0 0.2rem' }} />

        {isAuthenticated ? (
          <div className="auth-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Link to="/dashboard" className="btn btn-secondary btn-sm" style={{ gap: '0.4rem', minHeight: 36 }}>
              <User size={13} />
              <span>{user?.name?.split(' ')[0] || 'Account'}</span>
            </Link>
            <button
              onClick={handleLogout}
              title="Sign Out"
              aria-label="Sign Out"
              style={iconButtonStyle}
              className="focus-ring"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <div className="auth-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Link to="/login" className="btn btn-ghost btn-sm">
              Sign In
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Join Free
            </Link>
          </div>
        )}

        <button
          className="mobile-menu-toggle focus-ring"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
          style={{ ...iconButtonStyle, display: 'none', color: 'var(--text-primary)' }}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <style>{`
        .nav-capsule button:hover,
        .nav-capsule a[title]:hover {
          color: var(--text-primary) !important;
          background: var(--bg-surface-hover) !important;
          border-color: var(--border-subtle) !important;
        }

        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-toggle { display: inline-flex !important; }
        }

        @media (max-width: 620px) {
          .auth-actions { display: none !important; }
        }
      `}</style>

      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 'var(--header-height)',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'var(--bg-base)',
            borderTop: '1px solid var(--border-subtle)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            zIndex: 999,
            overflowY: 'auto',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                letterSpacing: '0.1em',
                color: 'var(--text-muted)',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
              }}
            >
              [NAVIGATION INDEX]
            </div>

            {allNavItems.map(({ to, label, index }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  minHeight: '52px',
                  fontSize: '1.15rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  borderBottom: '1px solid var(--border-subtle)',
                  padding: '0.5rem 0',
                }}
              >
                <span>{label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {index}
                </span>
              </NavLink>
            ))}
          </div>

          <div style={{ marginTop: '2rem' }}>
            {!isAuthenticated ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                }}
              >
                <Link to="/login" className="btn btn-secondary" onClick={() => setMobileMenuOpen(false)}>
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>
                  Join Free
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div
                  style={{
                    padding: '0.75rem',
                    background: 'var(--surface-1)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-xs)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.name}</span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      textTransform: 'uppercase',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {user?.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary btn-block"
                  style={{ gap: '0.5rem' }}
                >
                  <LogOut size={16} />
                  <span>Sign Out Session</span>
                </button>
              </div>
            )}

            <div
              style={{
                marginTop: '1.5rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                color: 'var(--text-dim)',
                textAlign: 'center',
              }}
            >
              CAMPSPACE DIGITAL PLATFORM // UNIFIED CAMPUS
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
