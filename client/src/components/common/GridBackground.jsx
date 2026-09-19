import React, { useEffect, useState } from 'react';

/**
 * GridBackground
 * Premium architectural grid background featuring:
 * - Ultra-clean orthogonal grid lines with radial fade mask.
 * - Subtle crosshair / dot accents at intersections.
 * - Soft top light-orange ambient bloom for the black/white + light orange theme.
 * - Interactive cursor-following grid illumination.
 */
export const GridBackground = ({ className = '', style = {} }) => {
  const [mousePos, setMousePos] = useState({ x: -2000, y: -2000 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className={className}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
        background: 'var(--surface-0)',
        ...style,
      }}
      aria-hidden="true"
    >
      {/* 1. Primary Precision Grid Pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, var(--border-subtle) 1px, transparent 1px),
            linear-gradient(to bottom, var(--border-subtle) 1px, transparent 1px)
          `,
          backgroundSize: '54px 54px',
          maskImage: 'radial-gradient(ellipse 85% 65% at 50% 18%, black 40%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(ellipse 85% 65% at 50% 18%, black 40%, transparent 95%)',
          opacity: 0.85,
        }}
      />

      {/* 2. Secondary Sub-Grid / Dot Highlights at Intersections */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(circle, var(--text-muted) 1px, transparent 1px)`,
          backgroundSize: '54px 54px',
          backgroundPosition: '0 0',
          maskImage: 'radial-gradient(ellipse 70% 50% at 50% 15%, black 30%, transparent 90%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 50% at 50% 15%, black 30%, transparent 90%)',
          opacity: 0.35,
        }}
      />

      {/* 3. Top Sunset Light-Orange Hero Aura Beam */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '900px',
          height: '520px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(255, 138, 61, 0.12) 0%, rgba(255, 165, 89, 0.04) 45%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      {/* 4. Subtle Upper Left White Ambient Starlight */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '15%',
          width: '500px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.06) 0%, transparent 65%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />

      {/* 5. Interactive Cursor-Illuminated Grid Glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 138, 61, 0.06) 0%, rgba(255, 255, 255, 0.02) 30%, transparent 60%)`,
          transition: 'background 0.05s ease',
          pointerEvents: 'none',
        }}
      />

      {/* 6. Subtle Edge Vignette Fade */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 50%, var(--surface-0) 100%)',
          opacity: 0.6,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default GridBackground;
