import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * ScrollProgressBar
 * Renders an ultra-sleek cosmic glowing scroll progress bar at the top of the viewport.
 */
export const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 32,
    restDelta: 0.001,
  });

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        zIndex: 100,
        pointerEvents: 'none',
        background: 'rgba(255, 255, 255, 0.05)',
      }}
    >
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          scaleX,
          transformOrigin: '0%',
          background: 'linear-gradient(90deg, #FFFFFF 0%, #70A1FF 50%, #A29BFE 100%)',
          boxShadow: '0 0 14px rgba(255, 255, 255, 0.8), 0 0 24px rgba(112, 161, 255, 0.6)',
        }}
      />
    </div>
  );
};

export default ScrollProgressBar;
