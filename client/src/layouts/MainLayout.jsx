import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';

/**
 * Main application layout with Navbar and Footer.
 * Used as the default wrapper for all page routes.
 */
export const MainLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      {/* Liquid Glass Ambient Mesh Orbs */}
      <div className="liquid-ambient-wrapper" aria-hidden="true">
        <div className="liquid-orb liquid-orb-1" />
        <div className="liquid-orb liquid-orb-2" />
        <div className="liquid-orb liquid-orb-3" />
      </div>

      <Navbar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
