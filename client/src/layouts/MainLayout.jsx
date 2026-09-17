import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { CursorGlow } from '../components/common/CursorGlow';

/**
 * Main application layout with Dark Luxe ambient orbs, Cursor tracker, Navbar, and Footer.
 */
export const MainLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      {/* Interactive Cursor Glow */}
      <CursorGlow />

      {/* Ambient Animated Mesh Spotlight Orbs */}
      <div className="ambient-glow-orb ambient-orb-1" aria-hidden="true" />
      <div className="ambient-glow-orb ambient-orb-2" aria-hidden="true" />
      <div className="ambient-glow-orb ambient-orb-3" aria-hidden="true" />

      <Navbar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
