import { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { CURSOR_STATES } from '../../hooks/useCursor';
import { usePortfolioData } from '../../context/PortfolioDataContext';

/* ── Dot-grid background ────────────── */
function DotGrid() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)',
        backgroundSize: '30px 30px',
        pointerEvents: 'none',
        opacity: 0.55,
      }}
    />
  );
}

/* ── Precision crosshair ────────────── */
function CrossHairAccent() {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 'clamp(80px, 10vh, 130px)',
        right: 'clamp(32px, 6vw, 96px)',
        width: 52,
        height: 52,
        opacity: 0.20,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 52 52" style={{ width: '100%', height: '100%' }}>
        <line x1="26" y1="0" x2="26" y2="52" stroke="#C8F23E" strokeWidth="0.6"/>
        <line x1="0" y1="26" x2="52" y2="26" stroke="#C8F23E" strokeWidth="0.6"/>
        <circle cx="26" cy="26" r="8" fill="none" stroke="#C8F23E" strokeWidth="0.6"/>
        <circle cx="26" cy="26" r="2" fill="#C8F23E"/>
      </svg>
    </div>
  );
}

/* ── Coordinate display ──────────────────────── */
function CoordDisplay({ mousePos }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.2 }}
      style={{
        position: 'absolute',
        bottom: 'clamp(80px, 10vh, 130px)',
        left: 'clamp(32px, 6vw, 96px)',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '8px',
        letterSpacing: '0.22em',
        color: 'var(--color-text-tertiary)',
        textTransform: 'uppercase',
        lineHeight: 1.9,
      }}
    >
      <div style={{ opacity: 0.55 }}>X:{mousePos.x.toString().padStart(4, '0')}</div>
      <div style={{ opacity: 0.55 }}>Y:{mousePos.y.toString().padStart(4, '0')}</div>
    </motion.div>
  );
}

/* ── Interactive word ──────────────────────── */
function InteractiveWord({ word, onClick, index }) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    onClick?.(word, index);
    setTimeout(() => setClicked(false), 600);
  };

  return (
    <motion.span
      onClick={handleClick}
      whileHover={{ color: 'var(--color-accent)', transition: { duration: 0.15 } }}
      style={{
        cursor: 'pointer',
        display: 'inline',
        transition: 'color 200ms',
        color: clicked ? 'var(--color-accent)' : 'inherit',
      }}
    >
      {word}
    </motion.span>
  );
}

/* ── Stats card ──────────────────────────── */
function StatCard({ value, label, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 + index * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: 'rgba(255,255,255,0.035)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: 'clamp(14px, 2.2vw, 24px) clamp(10px, 2vw, 24px)',
        minWidth: 0,
        textAlign: 'center',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        transition: 'border-color 250ms ease',
      }}
    >
      <div style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 'clamp(26px, 3.2vw, 42px)',
        fontWeight: 800,
        color: '#F5F5F0',
        lineHeight: 1,
        marginBottom: '7px',
        letterSpacing: '-0.02em',
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '11px',
        fontWeight: 500,
        color: 'var(--color-text-secondary)',
        letterSpacing: '0.02em',
      }}>
        {label}
      </div>
    </motion.div>
  );
}

export default function Hero({ setCursor, resetCursor, onNameClick }) {
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 22, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 22, damping: 18 });
  const [rawMouse, setRawMouse] = useState({ x: 0, y: 0 });

  const rotateX = useTransform(springY, [-1, 1], [1.5, -1.5]);
  const rotateY = useTransform(springX, [-1, 1], [-1.5, 1.5]);

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x * 2);
    mouseY.set(y * 2);
    setRawMouse({
      x: Math.floor(e.clientX - rect.left),
      y: Math.floor(e.clientY - rect.top),
    });
  }, [mouseX, mouseY]);

  const { data } = usePortfolioData();
  const hero = data?.hero || {};

  const taglineWords = (hero.tagline || 'I build products that solve real user problems, drive business growth and create meaningful impact.').split(' ').filter(Boolean);

  const STATS = hero.stats || [
    { value: '2+', label: 'Years of Experience' },
    { value: '3+', label: 'Products Launched' },
    { value: '35+', label: 'Features Delivered' },
    { value: '100K+', label: 'Users Impacted' },
  ];

  const textRevealVariants = {
    hidden: { opacity: 0, y: 44, skewY: 2 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      skewY: 0,
      transition: { delay: 0.3 + i * 0.07, duration: 0.85, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      data-inspect="USER FLOW: entry → discovery"
      style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(80px, 12vh, 160px) clamp(16px, 4.5vw, 96px) clamp(60px, 10vh, 120px)',
        background: 'var(--color-void)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {/* Dot grid background */}
      <DotGrid />

      {/* Ambient green glow top-left */}
      <div
        style={{
          position: 'absolute',
          top: '-25%',
          left: '-15%',
          width: '70%',
          height: '75%',
          background: 'radial-gradient(ellipse at center, rgba(200,242,62,0.055) 0%, transparent 65%)',
          pointerEvents: 'none',
          filter: 'blur(80px)',
        }}
        aria-hidden="true"
      />

      {/* Violet accent orb — right */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          right: '-10%',
          width: '50%',
          height: '60%',
          background: 'radial-gradient(ellipse at center, rgba(155, 127, 255, 0.04) 0%, transparent 65%)',
          pointerEvents: 'none',
          filter: 'blur(80px)',
        }}
        aria-hidden="true"
      />

      {/* ── Role tags — top right (hidden on mobile) ── */}
      <motion.div
        className="hide-mobile"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        style={{
          position: 'absolute',
          top: 'clamp(80px, 11vh, 140px)',
          right: 'clamp(20px, 5vw, 96px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          textAlign: 'right',
          zIndex: 2,
        }}
      >
        {(hero.roles || ['PRODUCT MANAGER', 'PRODUCT THINKER', 'SYSTEM BUILDER']).map((role, i) => (
          <motion.div
            key={role}
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: i === 0 ? 0.9 : 0.22, x: 0 }}
            transition={{ delay: 1.0 + i * 0.1, duration: 0.5 }}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '8px',
              letterSpacing: '0.26em',
              color: i === 0 ? 'var(--color-accent)' : 'var(--color-text-tertiary)',
              textTransform: 'uppercase',
            }}
          >
            {role}
          </motion.div>
        ))}
      </motion.div>

      {/* ── Main content + photo slot ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
        gap: 'clamp(36px, 5vw, 80px)',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* LEFT: Main content */}
        <div>
          {/* PRODUCT MINDED. IMPACT DRIVEN. */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '9px',
              letterSpacing: '0.30em',
              color: 'var(--color-text-tertiary)',
              textTransform: 'uppercase',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ color: 'var(--color-accent)', fontSize: '10px' }}
            >
              ◈
            </motion.span>
            {hero.badge || 'PRODUCT MINDED. IMPACT DRIVEN.'}
          </motion.div>

          {/* Hi, I'm Mridul */}
          <div style={{ overflow: 'hidden', marginBottom: '4px' }}>
            <motion.h1
              custom={0}
              initial="hidden"
              animate="visible"
              variants={textRevealVariants}
              onClick={onNameClick}
              onMouseEnter={() => setCursor?.(CURSOR_STATES.SECRET, '?')}
              onMouseLeave={() => resetCursor?.()}
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(38px, 5.5vw, 74px)',
                fontWeight: 700,
                lineHeight: 1.08,
                letterSpacing: '-0.025em',
                color: 'var(--color-text-primary)',
                cursor: 'pointer',
                margin: 0,
                userSelect: 'none',
              }}
            >
              {hero.greeting || "Hi, I'm"} {hero.name || 'Mridul'}
            </motion.h1>
          </div>

          {/* Product Manager — Electric accent */}
          <div style={{ overflow: 'hidden', marginBottom: '28px' }}>
            <motion.div
              custom={1}
              initial="hidden"
              animate="visible"
              variants={textRevealVariants}
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(34px, 5.0vw, 68px)',
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: '-0.03em',
                color: 'var(--color-accent)',
                userSelect: 'none',
              }}
            >
              {hero.title || 'Product Manager'}
            </motion.div>
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(14px, 1.4vw, 17px)',
              fontWeight: 400,
              lineHeight: 1.80,
              color: 'var(--color-text-secondary)',
              letterSpacing: '0.005em',
              maxWidth: '500px',
              marginBottom: '36px',
            }}
          >
            {taglineWords.map((word, i) => (
              <InteractiveWord key={i} word={word + ' '} index={i} />
            ))}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}
          >
            <motion.button
              className="btn-primary"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
              onMouseEnter={() => setCursor?.(CURSOR_STATES.HOVER)}
              onMouseLeave={() => resetCursor?.()}
              style={{ cursor: 'pointer' }}
            >
              View My Work
              <span style={{ fontSize: '15px' }}>→</span>
            </motion.button>

            <motion.a
              href={hero.resumeUrl || '/resume.pdf'}
              download={hero.resumeFileName || 'Mridul_Upadhya_Resume.pdf'}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onMouseEnter={() => setCursor?.(CURSOR_STATES.HOVER)}
              onMouseLeave={() => resetCursor?.()}
              style={{ cursor: 'pointer' }}
            >
              Download Resume
              <span style={{ fontSize: '14px' }}>↓</span>
            </motion.a>

            {/* LinkedIn icon — glass tile, same row */}
            <motion.a
              href={hero.linkedinUrl || 'https://www.linkedin.com/in/mridulupadhya02'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Connect on LinkedIn"
              title="LinkedIn"
              whileHover={{ scale: 1.08, backgroundColor: 'rgba(10,102,194,0.16)', borderColor: 'rgba(10,102,194,0.65)' }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => setCursor?.(CURSOR_STATES.HOVER)}
              onMouseLeave={() => resetCursor?.()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(10,102,194,0.07)',
                border: '1px solid rgba(10,102,194,0.25)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                transition: 'border-color 200ms ease, background 200ms ease',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" stroke="#5B9BD5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="2" y="9" width="4" height="12" stroke="#5B9BD5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="4" cy="4" r="2" stroke="#5B9BD5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.a>

            {/* Open to AI-PM Roles — static pill, sits right after LinkedIn */}
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.05, duration: 0.5 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0 16px 0 10px',
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(34,197,94,0.07)',
                border: '1px solid rgba(34,197,94,0.28)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                flexShrink: 0,
                cursor: 'default',
                userSelect: 'none',
              }}
            >
              {/* Live dot */}
              <div style={{ position: 'relative', flexShrink: 0, width: '7px', height: '7px' }}>
                <div style={{
                  width: '7px', height: '7px', borderRadius: '50%',
                  background: 'radial-gradient(circle at 35% 35%, #86efac, #22c55e)',
                  boxShadow: '0 0 6px #22c55e, 0 0 12px rgba(34,197,94,0.35)',
                  position: 'relative', zIndex: 1,
                }} />
                <div style={{
                  position: 'absolute', inset: '-4px', borderRadius: '50%',
                  border: '1px solid rgba(34,197,94,0.25)',
                  animation: 'pulseDot 2.5s ease-in-out infinite',
                }} />
              </div>

              {/* Label */}
              <span style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '12px',
                fontWeight: 400,
                letterSpacing: '0.02em',
                color: 'rgba(245,245,240,0.52)',
                whiteSpace: 'nowrap',
              }}>Open to{' '}
                <span style={{
                  fontWeight: 700,
                  background: 'linear-gradient(90deg, #86efac 0%, #d4fb74 55%, #86efac 100%)',
                  backgroundSize: '220% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'electricShimmer 4.5s linear infinite',
                }}>AI-PM</span>{' '}Roles
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* RIGHT: Profile photo — premium circular display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'relative', flexShrink: 0 }}
        >
          {/* CSS keyframe animations injected via style tag */}
          <style>{`
            @keyframes hero-spin-cw {
              from { transform: rotate(0deg); }
              to   { transform: rotate(360deg); }
            }
            @keyframes hero-spin-ccw {
              from { transform: rotate(0deg); }
              to   { transform: rotate(-360deg); }
            }
            @keyframes hero-pulse-glow {
              0%, 100% { opacity: 0.55; box-shadow: 0 0 40px rgba(200,242,62,0.18), 0 0 90px rgba(200,242,62,0.07); }
              50%       { opacity: 0.80; box-shadow: 0 0 65px rgba(200,242,62,0.30), 0 0 140px rgba(200,242,62,0.12); }
            }
            @keyframes hero-orbit-dot {
              from { transform: rotate(0deg) translateX(calc(var(--orbit-r) * 1px)) rotate(0deg); }
              to   { transform: rotate(360deg) translateX(calc(var(--orbit-r) * 1px)) rotate(-360deg); }
            }
            @keyframes hero-badge-float {
              0%, 100% { transform: translateY(0px); }
              50%       { transform: translateY(-5px); }
            }
          `}</style>

          {/* 3D tilt wrapper */}
          <motion.div style={{ perspective: 1400, transformStyle: 'preserve-3d' }}>
            <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d', position: 'relative' }}>

              {/* ── Outermost halo ring — very faint, large ── */}
              <div style={{
                position: 'absolute',
                inset: 'clamp(-28px, -4vw, -44px)',
                borderRadius: '50%',
                border: '1px solid rgba(200,242,62,0.06)',
                pointerEvents: 'none',
              }} />

              {/* ── Spinning conic-gradient border ring ── */}
              <div style={{
                position: 'absolute',
                inset: 'clamp(-10px, -1.4vw, -16px)',
                borderRadius: '50%',
                background: 'conic-gradient(from 0deg, transparent 0deg, rgba(200,242,62,0.85) 60deg, rgba(200,242,62,0.15) 120deg, transparent 180deg, rgba(200,242,62,0.4) 240deg, transparent 360deg)',
                animation: 'hero-spin-cw 4.5s linear infinite',
                pointerEvents: 'none',
                WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px))',
                mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px))',
              }} />

              {/* ── Counter-spinning accent ring ── */}
              <div style={{
                position: 'absolute',
                inset: 'clamp(-18px, -2.4vw, -28px)',
                borderRadius: '50%',
                background: 'conic-gradient(from 90deg, transparent 0deg, rgba(155,127,255,0.6) 40deg, transparent 120deg, rgba(200,242,62,0.3) 200deg, transparent 360deg)',
                animation: 'hero-spin-ccw 7s linear infinite',
                pointerEvents: 'none',
                WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 1.5px), white calc(100% - 1.5px))',
                mask: 'radial-gradient(farthest-side, transparent calc(100% - 1.5px), white calc(100% - 1.5px))',
              }} />

              {/* ── Orbiting dots ── */}
              {[
                { delay: '0s', size: 5, r: 'clamp(118, 13.5vw, 188)', color: '#C8F23E', dur: '4.5s' },
                { delay: '-2.25s', size: 3, r: 'clamp(118, 13.5vw, 188)', color: 'rgba(200,242,62,0.5)', dur: '4.5s' },
                { delay: '-3.5s', size: 4, r: 'clamp(126, 14.5vw, 200)', color: '#9B7FFF', dur: '7s' },
              ].map((dot, i) => (
                <div key={i} style={{
                  position: 'absolute',
                  top: '50%', left: '50%',
                  width: dot.size, height: dot.size,
                  marginTop: -dot.size / 2, marginLeft: -dot.size / 2,
                  borderRadius: '50%',
                  background: dot.color,
                  boxShadow: `0 0 8px 2px ${dot.color}`,
                  '--orbit-r': dot.r,
                  animation: `hero-orbit-dot ${dot.dur} linear infinite`,
                  animationDelay: dot.delay,
                  pointerEvents: 'none',
                }} />
              ))}

              {/* ── Photo circle with pulsing glow ── */}
              <div style={{
                width: 'clamp(180px, 24vw, 320px)',
                height: 'clamp(180px, 24vw, 320px)',
                borderRadius: '50%',
                border: '2px solid rgba(200,242,62,0.35)',
                background: 'radial-gradient(ellipse at 30% 30%, rgba(200,242,62,0.06) 0%, rgba(8,8,16,0.96) 70%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative',
                animation: 'hero-pulse-glow 3.2s ease-in-out infinite',
                outline: '1px solid rgba(200,242,62,0.10)',
                outlineOffset: '6px',
              }}>
                {/* Inner radial glow */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(ellipse at 35% 25%, rgba(200,242,62,0.18) 0%, transparent 55%)',
                  borderRadius: '50%',
                  pointerEvents: 'none',
                  zIndex: 2,
                }} />
                {/* Bottom vignette for image depth */}
                <div style={{
                  position: 'absolute',
                  bottom: 0, left: 0, right: 0,
                  height: '28%',
                  background: 'linear-gradient(to top, rgba(8,8,16,0.55) 0%, transparent 100%)',
                  borderRadius: '0 0 50% 50%',
                  pointerEvents: 'none',
                  zIndex: 2,
                }} />

                {/* Profile photo */}
                <img
                  src="/profile.jpg"
                  alt="Mridul Upadhya — Product Manager"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextSibling.style.display = 'flex';
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center top',
                    borderRadius: '50%',
                    position: 'relative',
                    zIndex: 1,
                  }}
                />
                {/* Placeholder fallback */}
                <div style={{
                  display: 'none',
                  position: 'absolute',
                  inset: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '14px',
                  zIndex: 3,
                }}>
                  <div style={{
                    width: '84px', height: '84px',
                    borderRadius: '50%',
                    background: 'rgba(200,242,62,0.10)',
                    border: '1px solid rgba(200,242,62,0.22)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700,
                    color: 'var(--color-accent)',
                  }}>MU</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Stats Row ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.8 }}
        style={{
          marginTop: 'clamp(36px, 5vh, 84px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))',
          gap: 'clamp(10px, 2vw, 16px)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {STATS.map((stat, i) => (
          <StatCard key={stat.label} {...stat} index={i} />
        ))}
      </motion.div>

      {/* Precision crosshair — desktop only */}
      <div className="hide-mobile">
        <CrossHairAccent />
      </div>

      {/* Coordinate display — desktop only */}
      <div className="hide-mobile">
        <CoordDisplay mousePos={rawMouse} />
      </div>
    </section>
  );
}
