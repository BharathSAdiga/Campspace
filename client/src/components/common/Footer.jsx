import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Instagram, ShieldCheck, Zap } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Col */}
          <div className="footer-col" style={{ maxWidth: '360px' }}>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.85rem',
                marginBottom: '1.2rem',
                textDecoration: 'none',
              }}
              aria-label="Campspace Home"
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FF9966 0%, #FF5E62 100%)',
                  color: '#ffffff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.25)',
                  position: 'relative',
                  flexShrink: 0,
                }}
              >
                CS
                <span
                  style={{
                    position: 'absolute',
                    top: '-1px',
                    right: '-1px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    border: '2px solid #FF5E62',
                  }}
                />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  letterSpacing: '0.02em',
                  color: '#ffffff',
                  textTransform: 'uppercase',
                }}
              >
                Campspace
              </span>
            </Link>

            <p
              style={{
                fontSize: '0.88rem',
                lineHeight: 1.65,
                color: 'rgba(255, 255, 255, 0.72)',
                marginBottom: '1.35rem',
              }}
            >
              The unified digital campus platform. Connecting students with verified peer-to-peer commerce, campus hackathons, and student guild collaboration.
            </p>

            {/* Badges */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.65)' }}>
                <ShieldCheck size={14} color="var(--accent-orange)" />
                <span>Verified student accounts & secure sessions</span>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.65)' }}>
                <Zap size={14} color="var(--accent-orange)" />
                <span>Zero platform commission on student sales</span>
              </div>
            </div>

            {/* Social Links */}
            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="footer-social-btn"
                title="GitHub"
              >
                <Github size={15} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter / X"
                className="footer-social-btn"
                title="Twitter / X"
              >
                <Twitter size={15} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="footer-social-btn"
                title="LinkedIn"
              >
                <Linkedin size={15} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="footer-social-btn"
                title="Instagram"
              >
                <Instagram size={15} />
              </a>
            </div>
          </div>

          {/* Col 1: Campus Modules */}
          <div className="footer-col">
            <h5>
              <span style={{ color: 'var(--accent-orange)' }}>//</span> Campus Modules
            </h5>
            <ul className="footer-links">
              <li>
                <Link to="/events" className="footer-link">
                  Events & Hackathons
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="footer-link">
                  Peer Marketplace
                </Link>
              </li>
              <li>
                <Link to="/resources" className="footer-link">
                  Facility & Lab Booking
                </Link>
              </li>
              <li>
                <Link to="/clubs" className="footer-link">
                  Clubs & Student Guilds
                </Link>
              </li>
              <li>
                <Link to="/events" className="footer-link">
                  Campus Calendar
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Student Services */}
          <div className="footer-col">
            <h5>
              <span style={{ color: 'var(--accent-orange)' }}>//</span> Student Services
            </h5>
            <ul className="footer-links">
              <li>
                <Link to="/login" className="footer-link">
                  Student Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="footer-link">
                  Register Account
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="footer-link">
                  Unified Dashboard
                </Link>
              </li>
              <li>
                <Link to="/marketplace/create" className="footer-link">
                  Post Item for Sale
                </Link>
              </li>
              <li>
                <Link to="/events/create" className="footer-link">
                  Submit Campus Event
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Safety & Trust */}
          <div className="footer-col">
            <h5>
              <span style={{ color: 'var(--accent-orange)' }}>//</span> Safety & Trust
            </h5>
            <ul className="footer-links">
              <li>
                <Link to="/events" className="footer-link">
                  Verified Campus Network
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="footer-link">
                  Student Meetup Guidelines
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="footer-link">
                  Student Honor Code
                </Link>
              </li>
              <li>
                <Link to="/events" className="footer-link">
                  Campus Safety & Escrow
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="footer-link">
                  Community Rules
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="footer-bottom">
          <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.65)' }}>
            &copy; {new Date().getFullYear()} Campspace Platform. All rights reserved.
          </p>

          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#10b981',
                  display: 'inline-block',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: 'rgba(255, 255, 255, 0.85)',
                  letterSpacing: '0.04em',
                }}
              >
                SYSTEM STATUS: 100% OPERATIONAL
              </span>
            </div>

            <span style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'var(--font-mono)' }}>
              Campus Digital Platform
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
