import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';

/**
 * Main application layout with the shared navigation, content outlet, and footer.
 */
export const MainLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      <Navbar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
