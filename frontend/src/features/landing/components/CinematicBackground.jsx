import React, { useEffect, useRef, useState } from 'react';

export const DEFAULT_CINEMATIC_IMAGES = [
  '/hero-bg/marketer.jpg',
  '/hero-bg/boutique.jpg',
  '/hero-bg/agency.jpg',
  '/hero-bg/bakery.jpg'
];

/**
 * Full-bleed "video-like" background: crossfading photos with a slow Ken Burns
 * zoom/pan plus a subtle mouse-parallax. Place inside a `relative overflow-hidden` section.
 */
export const CinematicBackground = ({
  images = DEFAULT_CINEMATIC_IMAGES,
  interval = 5000,
  startIndex = 0,
  overlayClassName = 'bg-slate-950/70',
  children
}) => {
  const [active, setActive] = useState(startIndex % images.length);
  const [prev, setPrev] = useState(null);
  const containerRef = useRef(null);
  const parallaxRef = useRef(null);

  // Crossfade cycle
  useEffect(() => {
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || images.length < 2) return;
    const timer = setInterval(() => {
      setActive((current) => {
        setPrev(current);
        return (current + 1) % images.length;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  // Subtle mouse parallax on the image layer
  useEffect(() => {
    const section = containerRef.current?.parentElement;
    const layer = parallaxRef.current;
    if (!section || !layer) return;

    let frame = null;
    const handleMove = (e) => {
      const rect = section.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        layer.style.transform = `translate3d(${x * -18}px, ${y * -12}px, 0)`;
      });
    };
    const handleLeave = () => {
      cancelAnimationFrame(frame);
      layer.style.transform = 'translate3d(0, 0, 0)';
    };

    section.addEventListener('mousemove', handleMove);
    section.addEventListener('mouseleave', handleLeave);
    return () => {
      cancelAnimationFrame(frame);
      section.removeEventListener('mousemove', handleMove);
      section.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {/* Image stack (slightly oversized so parallax never shows edges) */}
      <div
        ref={parallaxRef}
        className="absolute -inset-6 transition-transform duration-700 ease-out will-change-transform"
      >
        {images.map((src, i) => {
          const isActive = i === active;
          const isPrev = i === prev;
          return (
            <div
              key={src}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1600ms] ease-in-out ${
                isActive ? 'opacity-100' : 'opacity-0'
              } ${isActive || isPrev ? (i % 2 === 0 ? 'cinematic-kenburns-a' : 'cinematic-kenburns-b') : ''}`}
              style={{ backgroundImage: `url(${src})`, animationDuration: `${interval + 2000}ms` }}
            />
          );
        })}
      </div>

      {/* Readability overlay(s) */}
      <div className={`absolute inset-0 ${overlayClassName}`} />

      {/* Film grain / vignette for a cinematic feel */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(2,6,23,0.65)_100%)]" />

      {children}
    </div>
  );
};

export default CinematicBackground;
