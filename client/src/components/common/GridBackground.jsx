import React from 'react';

/**
 * GridBackground
 * Premium architectural grid background featuring:
 * - Ultra-clean orthogonal grid lines with radial fade mask.
 * - Subtle crosshair / dot accents at intersections.
 * - Hardware-accelerated (GPU) seamless slow drift and ambient breathing pulse.
 * - Zero performance overhead on CPU or main thread.
 */
export const GridBackground = ({ className = '', style = {} }) => {
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
      {/* 1. Masked Grid Viewport with Breathing Pulse */}
      <div
        className="grid-animated-container"
        style={{
          position: 'absolute',
          inset: 0,
          maskImage: 'radial-gradient(ellipse 85% 65% at 50% 18%, black 40%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(ellipse 85% 65% at 50% 18%, black 40%, transparent 95%)',
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {/* Hardware-Accelerated (GPU) Infinite Seamless Drift Surface */}
        <div
          className="grid-animated-surface"
          style={{
            position: 'absolute',
            top: -54,
            left: -54,
            width: 'calc(100% + 54px)',
            height: 'calc(100% + 54px)',
            pointerEvents: 'none',
          }}
        >
          {/* Primary Precision Grid Pattern Lines */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `
                linear-gradient(to right, var(--border-subtle) 1px, transparent 1px),
                linear-gradient(to bottom, var(--border-subtle) 1px, transparent 1px)
              `,
              backgroundSize: '54px 54px',
              opacity: 0.85,
            }}
          />

          {/* Secondary Sub-Grid / Intersection Dots */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `radial-gradient(circle, var(--text-muted) 1px, transparent 1px)`,
              backgroundSize: '54px 54px',
              opacity: 0.35,
            }}
          />
        </div>
      </div>

      {/* 2. Top White Ambient Starlight Aura Beam */}
      <div
        className="aura-animated-beam"
        style={{
          position: 'absolute',
          top: '-15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '950px',
          height: '520px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 50%, transparent 75%)',
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
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 65%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />

      {/* 5. Subtle Edge Vignette Fade */}
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
