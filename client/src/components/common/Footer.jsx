import React from 'react';
import { GraduationCap, ArrowUpRight, Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#000000',
                }}
              >
                <GraduationCap size={18} strokeWidth={2.2} />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.03em', color: '#FFFFFF' }}>
                Camp<span style={{ color: '#A1A1AA' }}>space</span>
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '340px', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              The high-performance monochrome digital ecosystem uniting students, campus organizers, and universities worldwide.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a
                href="#"
                aria-label="GitHub"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  transition: 'all 0.2s',
                }}
              >
                <Github size={16} />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  transition: 'all 0.2s',
                }}
              >
                <Twitter size={16} />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  transition: 'all 0.2s',
                }}
              >
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="footer-col">
            <h5>Navigation</h5>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/dashboard" className="footer-link">Dashboard</Link></li>
              <li><Link to="/marketplace" className="footer-link">Marketplace</Link></li>
              <li><Link to="/events" className="footer-link">Events & RSVP</Link></li>
              <li><Link to="/resources" className="footer-link">Facility Booking</Link></li>
              <li><Link to="/clubs" className="footer-link">Clubs & Guilds</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div className="footer-col">
            <h5>Platform</h5>
            <ul className="footer-links">
              <li><Link to="/login" className="footer-link">Student Login</Link></li>
              <li><Link to="/register" className="footer-link">Register Account</Link></li>
              <li><Link to="/marketplace/create" className="footer-link">Sell an Item</Link></li>
              <li><Link to="/events/create" className="footer-link">Host an Event</Link></li>
              <li><Link to="/resources/create" className="footer-link">List a Resource</Link></li>
              <li><Link to="/clubs/create" className="footer-link">Charter a Club</Link></li>
            </ul>
          </div>

          {/* Architecture */}
          <div className="footer-col">
            <h5>Architecture</h5>
            <ul className="footer-links">
              <li><span className="footer-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>React 18 + Vite <ArrowUpRight size={13} color="#71717A" /></span></li>
              <li><span className="footer-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>Node + Express <ArrowUpRight size={13} color="#71717A" /></span></li>
              <li><span className="footer-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>MongoDB Atlas <ArrowUpRight size={13} color="#71717A" /></span></li>
              <li><span className="footer-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>B&W Design System <ArrowUpRight size={13} color="#71717A" /></span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Campspace Platform. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              SYSTEM STATUS: 100% OPERATIONAL
            </span>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FFFFFF', display: 'inline-block' }} />
            <span>Black & White Minimal Luxury</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
