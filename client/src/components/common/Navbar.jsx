import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { GraduationCap, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand" onClick={() => setMobileMenuOpen(false)}>
          <div className="brand-icon-wrapper">
            <GraduationCap size={22} />
          </div>
          <span>
            Camp<span className="brand-accent">space</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav-links">
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

        {/* Auth Action Foundation */}
        <div className="nav-actions">
          <Link to="/auth" className="btn btn-primary btn-sm">
            Sign In
          </Link>

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
          <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>
          <Link to="/dashboard" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            Dashboard
          </Link>
          <Link to="/marketplace" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            Marketplace
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
          <Link to="/auth" className="btn btn-primary btn-block" onClick={() => setMobileMenuOpen(false)}>
            Sign In
          </Link>
        </div>
      )}
    </header>
  );
};
