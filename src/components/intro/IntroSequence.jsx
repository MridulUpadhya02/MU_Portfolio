import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TOTAL_DISPLAY_MS = 1600;

export default function IntroSequence({ onComplete }) {
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const completedRef = useRef(false);

  // Automatically transition to the actual website
  const handleTransition = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setExiting(true);
    // Smooth dissolve into the actual website (total time = 1600ms + 400ms = 2.0s)
    setTimeout(() => {
      onComplete?.();
    }, 400);
  }, [onComplete]);

  // Keyboard shortcut to skip if desired
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleTransition();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTransition]);

  // Automated timer: runs for ~2.25 seconds then smoothly transitions
  useEffect(() => {
    const startTime = performance.now();
    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const p = Math.min(elapsed / TOTAL_DISPLAY_MS, 1);
      setProgress(p);

      if (p >= 1) {
        clearInterval(interval);
        handleTransition();
      }
    }, 20);

    return () => clearInterval(interval);
  }, [handleTransition]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="subtle-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -16, filter: 'blur(5px)' }}
          transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
          onClick={handleTransition}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            background: '#070709',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            cursor: 'default',
            userSelect: 'none',
          }}
        >
          {/* Subtle warm ambient glow in center */}
          <div
            style={{
              position: 'absolute',
              width: 'min(640px, 85vw)',
              height: 'min(640px, 85vw)',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(200, 242, 62, 0.04) 0%, rgba(255, 255, 255, 0.015) 35%, transparent 70%)',
              filter: 'blur(50px)',
              pointerEvents: 'none',
            }}
          />

          {/* Minimalist fine grain texture */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
              opacity: 0.018,
              pointerEvents: 'none',
            }}
            aria-hidden="true"
          />

          {/* ── TOP-RIGHT: BEAUTIFUL INTERACTIVE SKIP ICON BUTTON ── */}
          <div
            style={{
              position: 'absolute',
              top: 'clamp(20px, 3.5vw, 40px)',
              right: 'clamp(20px, 4vw, 48px)',
              zIndex: 20,
            }}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.12 }}
              whileHover={{
                scale: 1.05,
                borderColor: 'rgba(200, 242, 62, 0.6)',
                color: '#C8F23E',
                boxShadow: '0 0 20px rgba(200, 242, 62, 0.25)',
              }}
              whileTap={{ scale: 0.94 }}
              onClick={(e) => {
                e.stopPropagation();
                handleTransition();
              }}
              aria-label="Skip introduction"
              title="Skip intro (or press ESC)"
              style={{
                cursor: 'pointer',
                background: 'rgba(255, 255, 255, 0.035)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: 'rgba(255, 255, 255, 0.7)',
                padding: '6px 14px 6px 10px',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '10px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                transition: 'border-color 0.2s, color 0.2s, background 0.2s, box-shadow 0.2s',
              }}
            >
              {/* Circular progress countdown ring with fast-forward arrow */}
              <div
                style={{
                  position: 'relative',
                  width: 18,
                  height: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 20 20" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="10" cy="10" r="8" stroke="rgba(255,255,255,0.12)" strokeWidth="2" fill="none" />
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    stroke="#C8F23E"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray={2 * Math.PI * 8}
                    strokeDashoffset={2 * Math.PI * 8 * (1 - progress)}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 20ms linear' }}
                  />
                </svg>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg
                    width="7"
                    height="7"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="5 4 15 12 5 20 5 4" fill="currentColor" />
                    <line x1="19" y1="5" x2="19" y2="19" />
                  </svg>
                </div>
              </div>

              <span>SKIP</span>
            </motion.button>
          </div>

          {/* ── CENTERPIECE: SUBTLE & SOBER TYPOGRAPHY ── */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: '0 24px',
              maxWidth: '900px',
            }}
          >
            {/* Elegant eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.04, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 'clamp(9px, 1.1vw, 11px)',
                letterSpacing: '0.28em',
                color: 'rgba(255, 255, 255, 0.4)',
                textTransform: 'uppercase',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  backgroundColor: '#C8F23E',
                  boxShadow: '0 0 6px rgba(200, 242, 62, 0.8)',
                  display: 'inline-block',
                }}
              />
              <span>PORTFOLIO</span>
            </motion.div>

            {/* Main Name: Mridul Upadhya */}
            <div style={{ overflow: 'hidden', padding: '6px 0' }}>
              <motion.h1
                initial={{ y: 36, opacity: 0, filter: 'blur(5px)' }}
                animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 'clamp(40px, 6.6vw, 84px)',
                  fontWeight: 700,
                  lineHeight: 1.08,
                  letterSpacing: '-0.025em',
                  color: '#FFFFFF',
                  margin: 0,
                  textShadow: '0 0 35px rgba(255, 255, 255, 0.08)',
                }}
              >
                Mridul Upadhya
              </motion.h1>
            </div>

            {/* Subtitle & Role */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{
                marginTop: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 'clamp(11px, 1.3vw, 14px)',
                  letterSpacing: '0.24em',
                  color: '#C8F23E',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                Product Manager
              </span>
              <span style={{ color: 'rgba(255, 255, 255, 0.2)', fontSize: '11px' }}>·</span>
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 'clamp(11px, 1.2vw, 13px)',
                  letterSpacing: '0.04em',
                  color: 'rgba(255, 255, 255, 0.65)',
                  fontWeight: 400,
                }}
              >
                Products are systems of decisions
              </span>
            </motion.div>

            {/* Subtle elegant line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.55, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
              style={{
                width: '44px',
                height: '1px',
                background: 'rgba(200, 242, 62, 0.5)',
                marginTop: '22px',
                transformOrigin: 'center',
              }}
            />
          </div>

          {/* Minimal progress hairline at bottom edge */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: '2px',
              background: 'linear-gradient(90deg, transparent 0%, #C8F23E 60%, rgba(200, 242, 62, 0.8) 100%)',
              width: `${progress * 100}%`,
              transition: 'width 20ms linear',
              opacity: 0.7,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
