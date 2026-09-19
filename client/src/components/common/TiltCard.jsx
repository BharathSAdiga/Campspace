import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * TiltCard
 * Scroll-responsive card wrapper featuring:
 * - Scroll viewport entrance animation (staggered rise & fade).
 * - 3D interactive tilt physics responding to mouse position.
 * - Dynamic specular light reflection tracking cursor across surface.
 */
export const TiltCard = ({
  children,
  className = '',
  style = {},
  tiltIntensity = 12,
  glare = true,
  delay = 0,
  onClick,
  ...props
}) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Normalized mouse coords (-0.5 to 0.5)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for rotation
  const rotateXSpring = useSpring(useTransform(mouseY, [-0.5, 0.5], [tiltIntensity, -tiltIntensity]), {
    stiffness: 350,
    damping: 24,
  });
  const rotateYSpring = useSpring(useTransform(mouseX, [-0.5, 0.5], [-tiltIntensity, tiltIntensity]), {
    stiffness: 350,
    damping: 24,
  });

  // Glare position
  const glareX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), {
    stiffness: 300,
    damping: 25,
  });
  const glareY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), {
    stiffness: 300,
    damping: 25,
  });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        perspective: 1000,
        position: 'relative',
        ...style,
      }}
      className={className}
      {...props}
    >
      <motion.div
        style={{
          rotateX: rotateXSpring,
          rotateY: rotateYSpring,
          transformStyle: 'preserve-3d',
          width: '100%',
          height: '100%',
          position: 'relative',
          borderRadius: 'inherit',
          transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
        }}
      >
        {children}

        {/* Dynamic Specular Light Glare */}
        {glare && isHovered && (
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 'inherit',
              pointerEvents: 'none',
              zIndex: 10,
              background: `radial-gradient(circle at ${glareX.get()}% ${glareY.get()}%, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.03) 40%, transparent 70%)`,
              mixBlendMode: 'overlay',
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export default TiltCard;
