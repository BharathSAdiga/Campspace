import React from 'react';
import { GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-col">
            <div className="navbar-brand" style={{ marginBottom: '1rem' }}>
              <div className="brand-icon-wrapper">
                <GraduationCap size={20} />
              </div>
              <span>
                Camp<span className="brand-accent">space</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, maxWidth: '320px' }}>
              The unified digital platform empowering students, organizers, and campus communities.
            </p>
          </div>

          {/* Navigation */}
          <div className="footer-col">
            <h5>Navigation</h5>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/dashboard" className="footer-link">Dashboard</Link></li>
              <li><Link to="/auth" className="footer-link">Sign In</Link></li>
            </ul>
          </div>

          {/* Modules */}
          <div className="footer-col">
            <h5>Modules</h5>
            <ul className="footer-links">
              <li><Link to="/marketplace" className="footer-link">Marketplace</Link></li>
              <li><Link to="/events" className="footer-link">Events</Link></li>
              <li><Link to="/resources" className="footer-link">Resources</Link></li>
              <li><Link to="/clubs" className="footer-link">Clubs</Link></li>
            </ul>
          </div>

          {/* Architecture */}
          <div className="footer-col">
            <h5>Stack</h5>
            <ul className="footer-links">
              <li><span className="footer-link">React + Vite</span></li>
              <li><span className="footer-link">Express.js</span></li>
              <li><span className="footer-link">MongoDB / Mongoose</span></li>
              <li><span className="footer-link">Axios</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Campspace. All rights reserved.</p>
          <p>Built for modern digital campus communities.</p>
        </div>
      </div>
    </footer>
  );
};
