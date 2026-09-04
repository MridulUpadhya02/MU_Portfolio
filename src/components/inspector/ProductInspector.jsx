import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Legend item ───────────────────────────────────── */
const LEGEND_ITEMS = [
  { key: 'USER FLOW',   desc: 'The path from entry to conversion' },
  { key: 'FRICTION',    desc: 'Points where users hesitate' },
  { key: 'CONVERSION',  desc: 'Actions we optimize for' },
  { key: 'DECISION',    desc: 'Product decisions made' },
  { key: 'TRADE-OFF',   desc: 'What we gave up' },
];

/* ─────────────────────────────────────────────────────
   PRODUCT INSPECTOR OVERLAY
   ───────────────────────────────────────────────────── */
export default function ProductInspector({ isActive, onToggle }) {

  /* Keyboard shortcut: Ctrl/Cmd + Shift + P */
  const handleKeyDown = useCallback((e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
      e.preventDefault();
      onToggle?.();
    }
  }, [onToggle]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  /* Add / remove class on body */
  useEffect(() => {
    if (isActive) {
      document.body.classList.add('inspector-active');
    } else {
      document.body.classList.remove('inspector-active');
    }
    return () => document.body.classList.remove('inspector-active');
  }, [isActive]);

  return (
    <AnimatePresence>
      {isActive && (
        <>
          {/* ── TOOLBAR (top-center) ── */}
          <motion.div
            key="inspector-toolbar"
            data-inspect="META: You are inspecting the portfolio as a product"
            initial={{ opacity: 0, y: -32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -32, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              top: 'clamp(10px, 2vh, 20px)',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 'var(--z-modal, 300)',
              background: 'rgba(2, 8, 2, 0.94)',
              border: '1px solid rgba(80, 200, 80, 0.3)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              padding: 'clamp(8px, 1.5vh, 12px) clamp(12px, 2vw, 24px)',
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(10px, 1.8vw, 24px)',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              letterSpacing: '0.12em',
              color: '#80E080',
              maxWidth: 'calc(100vw - 24px)',
              width: 'max-content',
              boxShadow: '0 0 32px rgba(80,200,80,0.08)',
              borderRadius: '4px',
            }}
          >
            {/* Pulsing indicator dot */}
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [0.9, 1.1, 0.9],
              }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#80E080',
                flexShrink: 0,
              }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontWeight: 600, letterSpacing: '0.14em', fontSize: 'clamp(10px, 1.2vw, 11px)' }}>
                ◈ INSPECTOR MODE
              </span>
              <span className="hide-mobile" style={{ color: 'rgba(128, 224, 128, 0.55)', fontSize: '9px', letterSpacing: '0.08em' }}>
                Viewing portfolio as a product
              </span>
            </div>

            {/* Vertical separator */}
            <div style={{
              width: '1px',
              height: '24px',
              background: 'rgba(80, 200, 80, 0.2)',
              flexShrink: 0,
            }} />

            {/* Deactivate button */}
            <motion.button
              onClick={() => onToggle?.()}
              whileHover={{
                color: '#fff',
                borderColor: 'rgba(80,200,80,0.7)',
                backgroundColor: 'rgba(80,200,80,0.08)',
              }}
              style={{
                background: 'transparent',
                border: '1px solid rgba(80,200,80,0.25)',
                color: '#80E080',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 'clamp(9px, 1.1vw, 10px)',
                letterSpacing: '0.12em',
                padding: '5px 10px',
                cursor: 'pointer',
                transition: 'all 200ms ease',
                flexShrink: 0,
                borderRadius: '2px',
              }}
            >
              EXIT ×
            </motion.button>
          </motion.div>

          {/* ── LEGEND PANEL (bottom-right) ── */}
          <motion.div
            key="inspector-legend"
            className="hide-mobile"
            initial={{ opacity: 0, x: 24, y: 24 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 24, y: 24 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              zIndex: 'var(--z-modal, 300)',
              background: 'rgba(2, 8, 2, 0.94)',
              border: '1px solid rgba(80, 200, 80, 0.2)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              minWidth: '240px',
              maxWidth: 'calc(100vw - 48px)',
              boxShadow: '0 0 32px rgba(80,200,80,0.06)',
            }}
          >
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '9px',
              letterSpacing: '0.2em',
              color: 'rgba(128,224,128,0.45)',
              marginBottom: '4px',
              textTransform: 'uppercase',
            }}>
              ANNOTATION LEGEND
            </div>

            {LEGEND_ITEMS.map(({ key, desc }) => (
              <div key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ width: '1px', height: '32px', background: 'rgba(80,200,80,0.3)', flexShrink: 0, marginTop: '2px' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '9px',
                    letterSpacing: '0.16em',
                    color: '#80E080',
                    fontWeight: 600,
                  }}>
                    {key}
                  </span>
                  <span style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '11px',
                    color: 'rgba(128,224,128,0.5)',
                    lineHeight: 1.4,
                  }}>
                    {desc}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
