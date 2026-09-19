import React, { useEffect, useState, useRef } from 'react';

export const CursorGlow = () => {
  const [coords, setCoords] = useState({ x: -400, y: -400 });
  const [isVisible, setIsVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const rafRef = useRef(null);
  const pendingCoords = useRef({ x: -400, y: -400 });

  useEffect(() => {
    // 1. Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // 2. Check for touch/coarse pointer device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;

    if (prefersReducedMotion || isTouchDevice || !isFinePointer) {
      setIsEnabled(false);
      return;
    }

    setIsEnabled(true);

    const handleMouseMove = (e) => {
      pendingCoords.current = { x: e.clientX, y: e.clientY };

      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          setCoords(pendingCoords.current);
          document.documentElement.style.setProperty('--mouse-x', `${pendingCoords.current.x}px`);
          document.documentElement.style.setProperty('--mouse-y', `${pendingCoords.current.y}px`);
          rafRef.current = null;
        });
      }

      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isVisible]);

  if (!isEnabled || !isVisible) return null;

  return (
    <div
      className="desktop-cursor-spotlight"
      style={{
        position: 'fixed',
        left: coords.x,
        top: coords.y,
        width: '500px',
        height: '500px',
        transform: 'translate(-50%, -50%)',
        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 45%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 9999,
        willChange: 'transform',
      }}
      aria-hidden="true"
    />
  );
};

export default CursorGlow;
