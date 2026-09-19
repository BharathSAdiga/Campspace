import React from 'react';
import { GraduationCap, ArrowUpRight, Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-xs)',
                  background: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--bg-noir)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <GraduationCap size={18} strokeWidth={2.2} />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  letterSpacing: '-0.03em',
                  color: 'var(--text-primary)',
                  textTransform: 'uppercase',
                }}
              >
                CAMPSPACE<span style={{ color: 'var(--text-muted)' }}>.</span>
              </span>
            </div>
            <p
              style={{
                fontSize: '0.9rem',
                lineHeight: 1.6,
                maxWidth: '340px',
                color: 'var(--text-secondary)',
                marginBottom: '1.5rem',
              }}
            >
              The high-performance digital campus operating system uniting students, researchers, and campus guilds worldwide.
            </p>
            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <a
                href="#"
                aria-label="GitHub"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: 'var(--radius-xs)',
                  background: 'var(--surface-1)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.borderColor = 'var(--border-strong)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                }}
              >
                <Github size={15} />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: 'var(--radius-xs)',
                  background: 'var(--surface-1)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.borderColor = 'var(--border-strong)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                }}
              >
                <Twitter size={15} />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: 'var(--radius-xs)',
                  background: 'var(--surface-1)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.borderColor = 'var(--border-strong)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                }}
              >
                <Linkedin size={15} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="footer-col">
            <h5>Navigation</h5>
            <ul className="footer-links" style={{ listStyle: 'none', padding: 0, margin: '1rem 0 0 0', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
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
            <ul className="footer-links" style={{ listStyle: 'none', padding: 0, margin: '1rem 0 0 0', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
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
            <ul className="footer-links" style={{ listStyle: 'none', padding: 0, margin: '1rem 0 0 0', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li><span className="footer-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>React 18 + Vite <ArrowUpRight size={13} color="var(--text-muted)" /></span></li>
              <li><span className="footer-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>Node + Express <ArrowUpRight size={13} color="var(--text-muted)" /></span></li>
              <li><span className="footer-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>MongoDB Atlas <ArrowUpRight size={13} color="var(--text-muted)" /></span></li>
              <li><span className="footer-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>B&W Geometric System <ArrowUpRight size={13} color="var(--text-muted)" /></span></li>
            </ul>
          </div>
        </div>

        <div
          className="footer-bottom"
          style={{
            paddingTop: '2rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
          }}
        >
          <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} Campspace Platform. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              SYSTEM STATUS: 100% OPERATIONAL
            </span>
            <span style={{ width: '6px', height: '6px', borderRadius: 'var(--radius-xs)', background: 'var(--text-primary)', display: 'inline-block', boxShadow: '0 0 6px var(--text-primary)' }} />
            <span>Campus Operating System</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
