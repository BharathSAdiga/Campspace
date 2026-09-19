import React, { useEffect, useState } from 'react';

/**
 * AmbientBackground
 * Rich, vibrant deep-space ambient background with coloured glow orbs,
 * a subtle radial noise texture, and a mouse-tracking light bloom.
 * Zero geometric grid lines.
 */
export const AmbientBackground = ({ className = '', style = {} }) => {
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
      {/* 1. Top violet hero glow — largest, brightest */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '40%',
          width: '780px',
          height: '580px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.22) 0%, rgba(109,40,217,0.1) 40%, transparent 70%)',
          filter: 'blur(100px)',
          animation: 'driftLeft 26s ease-in-out infinite alternate',
        }}
      />

      {/* 2. Cyan accent orb — top-right */}
      <div
        style={{
          position: 'absolute',
          top: '5%',
          right: '-8%',
          width: '560px',
          height: '440px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34,211,238,0.16) 0%, rgba(6,182,212,0.06) 45%, transparent 70%)',
          filter: 'blur(90px)',
          animation: 'driftRight 32s ease-in-out infinite alternate',
        }}
      />

      {/* 3. Pink/rose accent orb — mid-left */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '-6%',
          width: '480px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236,72,153,0.13) 0%, rgba(219,39,119,0.05) 45%, transparent 70%)',
          filter: 'blur(110px)',
          animation: 'driftUp 28s ease-in-out infinite alternate',
        }}
      />

      {/* 4. Deep violet orb — bottom-right */}
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '20%',
          width: '520px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.14) 0%, rgba(124,58,237,0.05) 45%, transparent 70%)',
          filter: 'blur(120px)',
          animation: 'driftLeft 34s ease-in-out infinite alternate-reverse',
        }}
      />

      {/* 5. Amber warm accent — bottom-left */}
      <div
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '15%',
          width: '360px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
          filter: 'blur(100px)',
          animation: 'driftRight 38s ease-in-out infinite alternate',
        }}
      />

      {/* 6. Subtle top vignette gradient for header separation */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: 'linear-gradient(to bottom, rgba(7,7,15,0.5) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* 7. Interactive mouse-tracking glow bloom */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(700px circle at ${mousePos.x}px ${mousePos.y}px, rgba(124,58,237,0.07) 0%, transparent 50%)`,
          transition: 'background 0.08s ease',
        }}
      />
    </div>
  );
};

export default AmbientBackground;
