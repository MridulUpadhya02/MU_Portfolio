import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CURSOR_STATES } from '../../hooks/useCursor';

/* ── Sound Wave bars (animated equalizer) ─────────── */
function SoundWaveBars({ active }) {
  const heights = [0.4, 0.9, 0.6, 1, 0.5, 0.8, 0.35];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 16 }}>
      {heights.map((h, i) => (
        <motion.div
          key={i}
          animate={active
            ? { scaleY: [h, 1, h * 0.6, 0.95, h], opacity: 1 }
            : { scaleY: 0.15, opacity: 0.3 }
          }
          transition={active
            ? { duration: 0.7 + i * 0.08, repeat: Infinity, ease: 'easeInOut', delay: i * 0.06 }
            : { duration: 0.3 }
          }
          style={{
            width: 2.5,
            height: 16,
            borderRadius: 2,
            background: active ? 'var(--color-accent)' : 'rgba(255,255,255,0.3)',
            transformOrigin: 'center',
            transition: 'background 300ms ease',
          }}
        />
      ))}
    </div>
  );
}

/* ── Beautiful Sound Toggle ───────────────────────── */
function SoundToggle({ enabled, onToggle, setCursor, resetCursor, size = 'normal' }) {
  const [ripple, setRipple] = useState(false);
  const [justToggled, setJustToggled] = useState(false);
  const timerRef = useRef(null);

  const handleClick = () => {
    onToggle?.();
    setRipple(true);
    setJustToggled(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setRipple(false);
      setJustToggled(false);
    }, 700);
  };

  const isSmall = size === 'small';

  return (
    <motion.button
      onClick={handleClick}
      onMouseEnter={() => setCursor?.(CURSOR_STATES.HOVER)}
      onMouseLeave={() => resetCursor?.()}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.93 }}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: isSmall ? 8 : 10,
        padding: isSmall ? '6px 12px' : '8px 16px',
        background: enabled
          ? 'var(--color-accent-ghost)'
          : 'rgba(255,255,255,0.04)',
        border: `1px solid ${enabled ? 'var(--color-accent-border)' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: isSmall ? 8 : 12,
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'background 300ms ease, border-color 300ms ease',
      }}
    >
      {/* Ripple burst on toggle */}
      <AnimatePresence>
        {ripple && (
          <motion.span
            key="ripple"
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              margin: 'auto',
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: enabled ? 'var(--color-accent-glow)' : 'rgba(255,255,255,0.2)',
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>

      {/* Toggle pill track */}
      <div style={{
        position: 'relative',
        width: 36,
        height: 20,
        borderRadius: 10,
        background: enabled ? 'var(--color-accent-ghost)' : 'rgba(255,255,255,0.06)',
        border: `1px solid ${enabled ? 'var(--color-accent-border)' : 'rgba(255,255,255,0.12)'}`,
        flexShrink: 0,
        transition: 'background 300ms ease, border-color 300ms ease',
      }}>
        {/* Thumb */}
        <motion.div
          animate={{ x: enabled ? 17 : 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          style={{
            position: 'absolute',
            top: 2,
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: enabled ? 'var(--color-accent)' : 'rgba(255,255,255,0.35)',
            boxShadow: enabled ? '0 0 8px var(--color-accent-glow)' : 'none',
            transition: 'background 300ms ease, box-shadow 300ms ease',
          }}
        />
        {/* Glow track fill */}
        <motion.div
          animate={{ width: enabled ? '100%' : '0%' }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 10,
            background: 'linear-gradient(90deg, var(--color-accent-glow), transparent)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Wave bars */}
      <SoundWaveBars active={enabled} />

      {/* Label */}
      <motion.span
        animate={{ color: enabled ? 'var(--color-accent)' : 'rgba(200,210,185,0.5)' }}
        transition={{ duration: 0.3 }}
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: isSmall ? '10px' : '11px',
          fontWeight: 700,
          letterSpacing: '0.1em',
          whiteSpace: 'nowrap',
          userSelect: 'none',
        }}
      >
        {justToggled
          ? (enabled ? 'ON ✓' : 'OFF')
          : (enabled ? 'SOUND ON' : 'MUTED')}
      </motion.span>
    </motion.button>
  );
}

const NAV_SECTIONS = [
  { id: 'hero',         label: 'INTRO',        index: '01',   x: 25, y: 35 },
  { id: 'think',        label: 'THINK',        index: '02',   x: 65, y: 28 },
  { id: 'projects',     label: 'PROJECTS',     index: '03-A', x: 78, y: 48 },
  { id: 'case-studies', label: 'CASE STUDIES', index: '03-B', x: 82, y: 56 },
  { id: 'impact',       label: 'IMPACT',       index: '04',   x: 60, y: 70 },
  { id: 'about',        label: 'ABOUT',        index: '05',   x: 30, y: 72 },
  { id: 'contact',      label: 'CONTACT',      index: '06',   x: 18, y: 55 },
];

const MODES_CONFIG = [
  { id: 'focus',  label: 'Focus',  icon: '🎯', tag: 'Executive Precision', accent: '#C8F23E' },
  { id: 'system', label: 'System', icon: '⚡', tag: 'Cyber Blueprint HUD', accent: '#00D4FF' },
  { id: 'play',   label: 'Play',   icon: '🎨', tag: 'Vibrant Creative',    accent: '#FF5E7E' },
  { id: 'cinema', label: 'Cinema', icon: '🎬', tag: 'Director Cut OLED',   accent: '#E5C07B' },
];

/* ── Top navigation bar ─────────────────────────── */
function TopBar({
  activeSection,
  scrollTo,
  onToggleNav,
  isNavOpen,
  mode = 'focus',
  setMode,
  cycleMode,
  setCursor,
  resetCursor,
  sounds,
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const currentMode = MODES_CONFIG.find((m) => m.id === mode) || MODES_CONFIG[0];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 199,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(16px, 4vw, 96px)',
        height: '60px',
        background: scrolled ? 'var(--glass-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px) saturate(1.6)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(1.6)' : 'none',
        borderBottom: scrolled
          ? '1px solid var(--color-border)'
          : '1px solid transparent',
        transition: 'background 500ms ease, backdrop-filter 500ms ease, border-color 500ms ease',
      }}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <motion.button
        onClick={() => scrollTo('hero')}
        onMouseEnter={() => setCursor?.(CURSOR_STATES.HOVER)}
        onMouseLeave={() => resetCursor?.()}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: 0,
          flexShrink: 0,
        }}
        whileHover={{ opacity: 0.8 }}
        transition={{ duration: 0.2 }}
      >
        <span style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '18px',
          fontWeight: 800,
          color: 'var(--color-text-primary)',
          letterSpacing: '-0.03em',
        }}>MU</span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '10px',
          color: 'var(--color-accent)',
        }}>.</span>
      </motion.button>

      {/* Section links — hidden on tablet/mobile */}
      <div
        className="hide-tablet"
        style={{
          display: 'flex',
          gap: 'clamp(16px, 2.4vw, 36px)',
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
        }}
        role="list"
      >
        {NAV_SECTIONS.slice(0, 6).map((s) => (
          <motion.button
            key={s.id}
            role="listitem"
            onClick={() => scrollTo(s.id)}
            onMouseEnter={() => setCursor?.(CURSOR_STATES.HOVER)}
            onMouseLeave={() => resetCursor?.()}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '13px',
              fontWeight: activeSection === s.id ? 600 : 400,
              letterSpacing: '0.01em',
              textTransform: 'capitalize',
              color: activeSection === s.id
                ? 'var(--color-text-primary)'
                : 'var(--color-text-secondary)',
              transition: 'color 250ms ease',
              padding: '4px 0',
              position: 'relative',
            }}
            whileHover={{ color: 'var(--color-text-primary)' }}
          >
            {s.label.charAt(0) + s.label.slice(1).toLowerCase()}
            {activeSection === s.id && (
              <motion.div
                layoutId="nav-indicator"
                style={{
                  position: 'absolute',
                  bottom: -3,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'var(--color-accent)',
                  borderRadius: '2px',
                }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Right controls: Mode Switcher + HQ + CTA + Mobile Menu Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {/* Mode Switcher Pill */}
        <motion.button
          onClick={() => {
            if (cycleMode) {
              cycleMode();
            } else {
              const curIdx = MODES_CONFIG.findIndex((m) => m.id === mode);
              const nextMode = MODES_CONFIG[(curIdx + 1) % MODES_CONFIG.length].id;
              setMode?.(nextMode);
            }
            sounds?.click?.();
          }}
          onMouseEnter={() => setCursor?.(CURSOR_STATES.HOVER)}
          onMouseLeave={() => resetCursor?.()}
          whileHover={{ scale: 1.05, borderColor: 'var(--color-accent)' }}
          whileTap={{ scale: 0.95 }}
          title={`Active Mode: ${currentMode.label} (${currentMode.tag}). Click to switch theme mode.`}
          aria-label={`Current mode ${currentMode.label}. Click to switch theme mode.`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 11px',
            borderRadius: '10px',
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border-bright)',
            cursor: 'pointer',
            transition: 'border-color 200ms ease, background 200ms ease, box-shadow 200ms ease',
          }}
        >
          <span style={{ fontSize: '12px', lineHeight: 1 }}>{currentMode.icon}</span>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--color-accent)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}>
            {currentMode.label}
          </span>
          <span style={{
            fontSize: '9px',
            opacity: 0.5,
            color: 'var(--color-text-secondary)',
            fontFamily: 'monospace',
            marginLeft: '1px',
          }}>
            ⇄
          </span>
        </motion.button>

        {/* HQ Admin button */}
        <motion.a
          href="/admin"
          onClick={(e) => {
            e.preventDefault();
            window.history.pushState(null, '', '/admin');
            window.dispatchEvent(new PopStateEvent('popstate'));
          }}
          onMouseEnter={() => setCursor?.(CURSOR_STATES.HOVER)}
          onMouseLeave={() => resetCursor?.()}
          whileHover={{ scale: 1.08, boxShadow: '0 0 18px var(--color-accent-glow)' }}
          whileTap={{ scale: 0.95 }}
          title="Admin login"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            width: 36,
            height: 36,
            borderRadius: '10px',
            background: 'var(--color-accent-ghost)',
            border: '1px solid var(--color-accent-border)',
            color: 'var(--color-accent)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            cursor: 'pointer',
            textDecoration: 'none',
            position: 'relative',
            overflow: 'hidden',
            transition: 'border-color 200ms ease, background 200ms ease, color 200ms ease',
          }}
        >
          {/* Subtle inner glow */}
          <motion.span
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '10px',
              background: 'radial-gradient(circle at 50% 50%, var(--color-accent-glow), transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          <span style={{ position: 'relative', zIndex: 1 }}>HQ</span>
        </motion.a>

        {/* Let's Connect CTA */}
        <motion.button
          onClick={() => scrollTo('contact')}
          onMouseEnter={() => setCursor?.(CURSOR_STATES.HOVER)}
          onMouseLeave={() => resetCursor?.()}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            background: 'var(--color-accent)',
            border: 'none',
            color: '#0A0A0D',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '12px',
            fontWeight: 700,
            padding: '7px 14px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'background 200ms ease',
            whiteSpace: 'nowrap',
          }}
        >
          <span>Connect</span>
          <span style={{ fontSize: '13px' }}>→</span>
        </motion.button>

        {/* Mobile menu icon button (visible on <= 860px) */}
        <motion.button
          onClick={onToggleNav}
          aria-label="Toggle menu"
          whileTap={{ scale: 0.95 }}
          style={{
            display: 'none',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '7px 11px',
            color: 'var(--color-text-primary)',
            cursor: 'pointer',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            gap: '6px',
          }}
          className="show-mobile"
        >
          <span>{isNavOpen ? '✕' : '☰'}</span>
        </motion.button>
      </div>
    </motion.nav>
  );
}

export default function SystemNav({ mode, setMode, cycleMode, soundEnabled, onSoundToggle, setCursor, resetCursor, sounds }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const toggleNav = useCallback(() => {
    setIsOpen(prev => {
      if (prev) sounds?.close(); else sounds?.open();
      return !prev;
    });
  }, [sounds]);

  useEffect(() => {
    const observers = [];
    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.35 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape' && isOpen) setIsOpen(false); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
    sounds?.click();
  }, [sounds]);

  return (
    <>
      {/* Top bar */}
      <TopBar
        activeSection={activeSection}
        scrollTo={scrollTo}
        onToggleNav={toggleNav}
        isNavOpen={isOpen}
        mode={mode}
        setMode={setMode}
        cycleMode={cycleMode}
        setCursor={setCursor}
        resetCursor={resetCursor}
        sounds={sounds}
      />

      {/* Floating Sound Toggle — bottom right */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed',
          bottom: 'clamp(18px, 3.5vh, 40px)',
          right: 'clamp(18px, 4vw, 52px)',
          zIndex: 200,
        }}
      >
        <SoundToggle
          enabled={soundEnabled}
          onToggle={() => { onSoundToggle?.(); }}
          setCursor={setCursor}
          resetCursor={resetCursor}
          size="small"
        />
      </motion.div>

      {/* Trigger pill — bottom left */}
      <motion.button
        onClick={toggleNav}
        onMouseEnter={() => setCursor?.(CURSOR_STATES.HOVER)}
        onMouseLeave={() => resetCursor?.()}
        aria-label="Open full navigation"
        aria-expanded={isOpen}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed',
          bottom: 'clamp(18px, 3.5vh, 40px)',
          left: 'clamp(18px, 4vw, 52px)',
          zIndex: 200,
          background: 'var(--glass-bg)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text-secondary)',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '11px',
          fontWeight: 500,
          letterSpacing: '0.04em',
          padding: '10px 18px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '9px',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '100px',
          transition: 'border-color 200ms ease, color 200ms ease',
        }}
        whileHover={{
          borderColor: 'var(--color-accent-border)',
          color: 'var(--color-accent)',
        }}
      >
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.32, ease: [0.65, 0, 0.35, 1] }}
          style={{ display: 'inline-block', fontSize: '12px' }}
        >
          ◈
        </motion.span>
        MENU
      </motion.button>

      {/* Full-screen nav overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="nav-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 199,
              background: 'rgba(2, 2, 4, 0.97)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'clamp(20px, 4vh, 60px) clamp(16px, 4vw, 40px)',
              overflowY: 'auto',
            }}
            onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
          >
            {/* Desktop Spatial navigation nodes (hidden on small mobile) */}
            <div
              className="hide-mobile"
              style={{
                position: 'relative',
                width: 'min(640px, 88vw)',
                height: 'min(460px, 60vh)',
                marginBottom: '40px',
              }}
            >
              {/* Connection lines */}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                {NAV_SECTIONS.map((s, i) => {
                  const next = NAV_SECTIONS[(i + 1) % NAV_SECTIONS.length];
                  return (
                    <motion.line
                      key={s.id}
                      x1={`${s.x}%`} y1={`${s.y}%`}
                      x2={`${next.x}%`} y2={`${next.y}%`}
                      stroke="var(--color-accent-ghost)"
                      strokeWidth="1"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, delay: i * 0.06 }}
                    />
                  );
                })}
              </svg>

              {/* Nav nodes */}
              {NAV_SECTIONS.map((section, i) => (
                <motion.button
                  key={section.id}
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.4 }}
                  transition={{ duration: 0.5, delay: i * 0.05, ease: [0.34, 1.56, 0.64, 1] }}
                  onClick={() => scrollTo(section.id)}
                  onMouseEnter={() => setCursor?.(CURSOR_STATES.HOVER)}
                  onMouseLeave={() => resetCursor?.()}
                  style={{
                    position: 'absolute',
                    left: `${section.x}%`,
                    top: `${section.y}%`,
                    transform: 'translate(-50%, -50%)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '16px',
                  }}
                  whileHover={{ scale: 1.14 }}
                >
                  {/* Node dot */}
                  <motion.div
                    animate={{
                      width: activeSection === section.id ? 10 : 4,
                      height: activeSection === section.id ? 10 : 4,
                      background: activeSection === section.id ? 'var(--color-accent)' : '#1C1C22',
                      boxShadow: activeSection === section.id
                        ? '0 0 18px var(--color-accent-glow)'
                        : 'none',
                    }}
                    transition={{ duration: 0.3 }}
                    style={{
                      borderRadius: '50%',
                      border: activeSection === section.id ? 'none' : '1px solid rgba(255,255,255,0.08)',
                    }}
                  />
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '7px',
                    letterSpacing: '0.22em',
                    color: activeSection === section.id ? 'var(--color-accent)' : '#2E2E40',
                    textTransform: 'uppercase',
                    transition: 'color 300ms',
                  }}>
                    {section.index}
                  </span>
                  <span style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '9px',
                    letterSpacing: '0.14em',
                    color: activeSection === section.id ? '#F5F5F0' : '#5A5C6C',
                    textTransform: 'uppercase',
                    fontWeight: activeSection === section.id ? 700 : 400,
                    transition: 'color 300ms',
                  }}>
                    {section.label}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Mobile-optimized vertical navigation list */}
            <div
              className="show-mobile"
              style={{
                flexDirection: 'column',
                gap: '12px',
                width: '100%',
                maxWidth: '320px',
                margin: 'auto 0 28px',
              }}
            >
              {NAV_SECTIONS.map((s, i) => (
                <motion.button
                  key={s.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  onClick={() => scrollTo(s.id)}
                  style={{
                    background: activeSection === s.id ? 'var(--color-accent-ghost)' : 'transparent',
                    border: `1px solid ${activeSection === s.id ? 'var(--color-accent-border)' : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: '10px',
                    padding: '12px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '10px',
                      color: activeSection === s.id ? 'var(--color-accent)' : 'var(--color-text-tertiary)',
                      letterSpacing: '0.1em',
                    }}>
                      {s.index}
                    </span>
                    <span style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: '15px',
                      fontWeight: activeSection === s.id ? 700 : 500,
                      color: activeSection === s.id ? '#fff' : 'var(--color-text-secondary)',
                      letterSpacing: '0.04em',
                    }}>
                      {s.label}
                    </span>
                  </div>
                  {activeSection === s.id && (
                    <span style={{ color: 'var(--color-accent)', fontSize: '12px' }}>●</span>
                  )}
                </motion.button>
              ))}
            </div>


            {/* Bottom bar — modes + sound */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              style={{
                width: '100%',
                maxWidth: '680px',
                marginTop: 'auto',
                paddingTop: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                zIndex: 2,
              }}
            >
              {/* Mode switcher */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '9px',
                  letterSpacing: '0.18em',
                  color: 'var(--color-text-tertiary)',
                  textTransform: 'uppercase',
                  marginRight: '6px',
                }}>
                  THEME MODE
                </span>
                {MODES_CONFIG.map((m) => {
                  const isActive = mode === m.id;
                  return (
                    <motion.button
                      key={m.id}
                      onClick={() => { setMode(m.id); sounds?.click(); }}
                      onMouseEnter={() => setCursor?.(CURSOR_STATES.HOVER)}
                      onMouseLeave={() => resetCursor?.()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        background: isActive ? 'var(--color-accent)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${isActive ? 'var(--color-accent)' : 'rgba(255,255,255,0.08)'}`,
                        color: isActive ? '#060608' : 'var(--color-text-secondary)',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: '12px',
                        fontWeight: 700,
                        letterSpacing: '0.01em',
                        padding: '6px 14px',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: isActive ? '0 0 16px var(--color-accent-glow)' : 'none',
                        transition: 'all 200ms ease',
                      }}
                    >
                      <span style={{ fontSize: '13px' }}>{m.icon}</span>
                      <span>{m.label}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Sound toggle */}
              <SoundToggle
                enabled={soundEnabled}
                onToggle={() => { onSoundToggle?.(); sounds?.click(); }}
                setCursor={setCursor}
                resetCursor={resetCursor}
                size="small"
              />
            </motion.div>

            {/* ESC hint */}
            <div style={{
              position: 'absolute',
              top: 'clamp(28px, 4vh, 52px)',
              right: 'clamp(32px, 5vw, 104px)',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '7px',
              color: '#1E2030',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}>
              ESC TO CLOSE
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
