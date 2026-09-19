import React, { useEffect, useRef } from 'react';

/**
 * GalaxyCanvas
 * Renders a real-time 3D logarithmic spiral galaxy on HTML5 Canvas.
 * Features:
 * - 4-armed spiral disk with core bulge, stellar halo, and cosmic dust.
 * - Interactive 3D tilt tracking mouse movement with inertia.
 * - Scroll responsiveness: orbital acceleration, camera pitch shift, and depth parallax.
 * - 60 FPS requestAnimationFrame with high-DPI scaling.
 */
export const GalaxyCanvas = ({ className = '', style = {} }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Interaction states
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const scroll = { y: window.scrollY, targetY: window.scrollY, velocity: 0 };

    const handleMouseMove = (e) => {
      const normX = (e.clientX / width) * 2 - 1;
      const normY = (e.clientY / height) * 2 - 1;
      mouse.targetX = normX * 0.45;
      mouse.targetY = normY * 0.35;
    };

    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      scroll.targetY = currentScrollY;
      scroll.velocity = Math.min(Math.max(delta * 0.05, -3), 3);
      lastScrollY = currentScrollY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Generate Galaxy Particles
    const PARTICLE_COUNT = 1400;
    const ARMS = 4;
    const ARM_SPREAD = 0.55;
    const GALAXY_RADIUS = Math.min(width, height) * 0.85;

    // Color palettes
    const colors = [
      { r: 255, g: 255, b: 255 }, // Radiant core white
      { r: 200, g: 230, b: 255 }, // Celestial cyan-white
      { r: 160, g: 185, b: 255 }, // Deep space soft blue
      { r: 195, g: 155, b: 255 }, // Nebula violet
      { r: 255, g: 215, b: 180 }, // Stellar amber
    ];

    const particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const isCore = Math.random() < 0.22;
      let r, theta;

      if (isCore) {
        // Concentrated in core bulge
        r = Math.pow(Math.random(), 2.2) * (GALAXY_RADIUS * 0.25);
        theta = Math.random() * Math.PI * 2;
      } else {
        // Distributed in spiral arms with random scatter
        const armIndex = Math.floor(Math.random() * ARMS);
        const armOffset = (armIndex * 2 * Math.PI) / ARMS;
        const distNorm = Math.pow(Math.random(), 1.1);
        r = distNorm * GALAXY_RADIUS + 25;

        // Logarithmic spiral angle + spread
        const spiralAngle = Math.log(r / 20) * 1.8;
        const scatter = (Math.random() - 0.5) * ARM_SPREAD * (1 - r / (GALAXY_RADIUS * 1.2));
        theta = armOffset + spiralAngle + scatter;
      }

      // Vertical thickness decreases outward
      const zScale = isCore ? 40 : Math.max(10, 35 * (1 - r / GALAXY_RADIUS));
      const z = (Math.random() - 0.5) * zScale;

      // Color selection based on distance from core
      const colorIndex = isCore
        ? Math.random() < 0.6 ? 0 : 1
        : Math.floor(Math.random() * colors.length);

      const size = isCore
        ? Math.random() * 2.2 + 0.8
        : Math.random() * 1.8 + 0.4;

      const alpha = isCore
        ? Math.random() * 0.6 + 0.4
        : Math.random() * 0.55 + 0.25;

      const orbitalSpeed = (1 / Math.sqrt(r + 30)) * 0.35 + 0.001;

      particles.push({
        r,
        theta,
        z,
        size,
        baseAlpha: alpha,
        color: colors[colorIndex],
        orbitalSpeed,
        twinkleSpeed: Math.random() * 0.04 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }

    // Distant background starfield
    const BG_STAR_COUNT = 240;
    const bgStars = [];
    for (let i = 0; i < BG_STAR_COUNT; i++) {
      bgStars.push({
        x: (Math.random() - 0.5) * width * 1.8,
        y: (Math.random() - 0.5) * height * 1.8,
        size: Math.random() * 1.3 + 0.3,
        alpha: Math.random() * 0.6 + 0.15,
        twinkle: Math.random() * 0.02 + 0.005,
      });
    }

    let baseAngle = 0;
    const FOV = 650;
    let cameraPitch = 1.05; // Base inclination (~60 degrees)

    // Main animation loop
    const render = () => {
      // Smooth interpolation for mouse and scroll
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      scroll.y += (scroll.targetY - scroll.y) * 0.06;
      scroll.velocity *= 0.92;

      // Scroll changes:
      // 1. Orbital rotation velocity accelerates slightly during scroll
      const activeRotationSpeed = 0.0015 + Math.abs(scroll.velocity) * 0.0012;
      baseAngle += activeRotationSpeed;

      // 2. Camera pitch tilts as user scrolls down the page
      const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1000);
      const scrollProgress = Math.min(scroll.y / maxScroll, 1);
      const targetPitch = 1.05 + scrollProgress * 0.35 + mouse.y * 0.4;
      cameraPitch += (targetPitch - cameraPitch) * 0.05;

      const cameraYaw = mouse.x * 0.5;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      const centerX = width * 0.5;
      // Drift galaxy center up slightly as user scrolls
      const centerY = height * 0.44 - scrollProgress * 60;

      // 1. Draw distant background stars with parallax
      ctx.fillStyle = '#FFFFFF';
      for (let i = 0; i < bgStars.length; i++) {
        const star = bgStars[i];
        star.alpha += Math.sin(baseAngle * 10 + i) * star.twinkle;
        const currentAlpha = Math.max(0.1, Math.min(0.8, star.alpha));
        ctx.globalAlpha = currentAlpha;
        const px = centerX + star.x + mouse.x * -15;
        const py = centerY + star.y + mouse.y * -15 - scroll.y * 0.08;
        ctx.fillRect(px, py, star.size, star.size);
      }

      // 2. Core Nebular Ambient Glow
      const coreGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        GALAXY_RADIUS * 0.45
      );
      coreGlow.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
      coreGlow.addColorStop(0.2, 'rgba(180, 210, 255, 0.12)');
      coreGlow.addColorStop(0.5, 'rgba(140, 110, 240, 0.05)');
      coreGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = coreGlow;
      ctx.fillRect(0, 0, width, height);

      // 3. Render 3D Galaxy Particles
      const cosPitch = Math.cos(cameraPitch);
      const sinPitch = Math.sin(cameraPitch);
      const cosYaw = Math.cos(cameraYaw);
      const sinYaw = Math.sin(cameraYaw);

      // Sort by depth (Z) for natural depth layering
      const projectedParticles = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        // Advance particle orbit
        p.theta += p.orbitalSpeed;

        // Polar to Cartesian in galaxy plane (X-Y)
        const currentAngle = p.theta + baseAngle;
        const gx = Math.cos(currentAngle) * p.r;
        const gy = Math.sin(currentAngle) * p.r;
        const gz = p.z;

        // Apply 3D rotation: Yaw then Pitch
        // Yaw around Y
        const x1 = gx * cosYaw - gz * sinYaw;
        const z1 = gx * sinYaw + gz * cosYaw;

        // Pitch around X
        const y2 = gy * cosPitch - z1 * sinPitch;
        const z2 = gy * sinPitch + z1 * cosPitch;

        // Perspective projection
        const depth = z2 + FOV;
        if (depth <= 20) continue;

        const scale = FOV / depth;
        const screenX = centerX + x1 * scale;
        const screenY = centerY + y2 * scale;

        // Depth-adjusted size & alpha
        const depthFactor = Math.max(0.2, Math.min(1.5, scale));
        const finalSize = p.size * depthFactor;
        const twinkle = Math.sin(baseAngle * 15 + p.twinklePhase) * 0.15;
        const finalAlpha = Math.max(0.08, Math.min(1, (p.baseAlpha + twinkle) * Math.min(scale, 1.2)));

        projectedParticles.push({
          x: screenX,
          y: screenY,
          size: finalSize,
          alpha: finalAlpha,
          color: p.color,
          depth: z2,
        });
      }

      // Sort back-to-front
      projectedParticles.sort((a, b) => a.depth - b.depth);

      // Batch draw particles
      for (let i = 0; i < projectedParticles.length; i++) {
        const p = projectedParticles[i];
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = `rgb(${p.color.r}, ${p.color.g}, ${p.color.b})`;

        // Core particles get subtle circular glow
        if (p.size > 1.8) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(p.x - p.size * 0.5, p.y - p.size * 0.5, p.size, p.size);
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        ...style,
      }}
      aria-hidden="true"
    />
  );
};

export default GalaxyCanvas;
