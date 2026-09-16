import React from 'react';
import { GraduationCap, Heart } from 'lucide-react';
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
                Campus<span className="brand-accent">Connect</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, maxWidth: '320px' }}>
              The unified digital platform empowering students, event organizers, and campus administrators to collaborate effortlessly.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="footer-col">
            <h5>Platform</h5>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/login" className="footer-link">Sign In</Link></li>
              <li><Link to="/register" className="footer-link">Register</Link></li>
            </ul>
          </div>

          {/* Roles */}
          <div className="footer-col">
            <h5>Roles</h5>
            <ul className="footer-links">
              <li><span className="footer-link">Students</span></li>
              <li><span className="footer-link">Event Organizers</span></li>
              <li><span className="footer-link">Campus Administrators</span></li>
            </ul>
          </div>

          {/* Security & Access */}
          <div className="footer-col">
            <h5>Security</h5>
            <ul className="footer-links">
              <li><span className="footer-link">JWT Protected</span></li>
              <li><span className="footer-link">Role-Based Access</span></li>
              <li><span className="footer-link">Encrypted Credentials</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} CampusConnect. All rights reserved.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Built for modern digital campus communities.
          </p>
        </div>
      </div>
    </footer>
  );
};
