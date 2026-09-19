import React, { useEffect, useState } from 'react';

/**
 * AmbientBackground
 * Atmospheric liquid ambient background combining monochrome depth
 * with delicate, ethereal Light Orange glows and a subtle mouse-following light bloom.
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
      <style>{`
        @keyframes liquidDrift1 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 40px) scale(1.08); }
          100% { transform: translate(25px, -20px) scale(0.96); }
        }
        @keyframes liquidDrift2 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -30px) scale(1.05); }
          100% { transform: translate(-20px, 35px) scale(0.95); }
        }
        @keyframes liquidPulseSlow {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 0.85; }
        }
      `}</style>

      {/* 1. Luminous Pure White / Subtle Starlight Core (Top Center) */}
      <div
        className="ambient-glow-orb"
        style={{
          top: '-15%',
          left: '35%',
          width: '740px',
          height: '520px',
          background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 45%, transparent 70%)',
          animation: 'liquidDrift1 28s ease-in-out infinite alternate',
        }}
      />

      {/* 2. Primary Light Orange Aurora Bloom (Top Right) */}
      <div
        className="ambient-glow-orb"
        style={{
          top: '2%',
          right: '-5%',
          width: '580px',
          height: '460px',
          background: 'radial-gradient(circle, rgba(255, 138, 61, 0.11) 0%, rgba(255, 165, 89, 0.04) 50%, transparent 75%)',
          animation: 'liquidDrift2 34s ease-in-out infinite alternate',
        }}
      />

      {/* 3. Soft Amber Whisper (Mid-Left) */}
      <div
        className="ambient-glow-orb"
        style={{
          top: '42%',
          left: '-8%',
          width: '500px',
          height: '420px',
          background: 'radial-gradient(circle, rgba(255, 150, 75, 0.08) 0%, rgba(255, 138, 61, 0.02) 50%, transparent 75%)',
          animation: 'liquidDrift1 30s ease-in-out infinite alternate-reverse',
        }}
      />

      {/* 4. Deep Obsidian Shadow with Soft Warm Glow (Bottom Right) */}
      <div
        className="ambient-glow-orb"
        style={{
          bottom: '8%',
          right: '15%',
          width: '560px',
          height: '440px',
          background: 'radial-gradient(circle, rgba(255, 138, 61, 0.07) 0%, rgba(255, 255, 255, 0.02) 40%, transparent 70%)',
          animation: 'liquidDrift2 36s ease-in-out infinite alternate',
        }}
      />

      {/* 5. Minimal Bottom Left Starlight Halo */}
      <div
        className="ambient-glow-orb"
        style={{
          bottom: '2%',
          left: '10%',
          width: '380px',
          height: '320px',
          background: 'radial-gradient(circle, rgba(255, 180, 110, 0.06) 0%, transparent 70%)',
          animation: 'liquidDrift1 40s ease-in-out infinite alternate',
        }}
      />

      {/* 6. Subtle Top Vignette Gradient for Header Separation */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '35%',
          background: 'linear-gradient(to bottom, var(--surface-0) 0%, transparent 100%)',
          opacity: 0.7,
          pointerEvents: 'none',
        }}
      />

      {/* 7. Mouse-Tracking Light Bloom with delicate Light Orange tint */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 138, 61, 0.045) 0%, rgba(255, 255, 255, 0.015) 30%, transparent 60%)`,
          transition: 'background 0.06s ease',
        }}
      />
    </div>
  );
};

export default AmbientBackground;
