import { useEffect, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
} from 'framer-motion';
import { CURSOR_STATES } from '../../hooks/useCursor';
import PdfPreviewModal from '../shared/PdfPreviewModal';

/* ─────────────────────────────────────────
   ANIMATED NUMBER COUNTER
───────────────────────────────────────── */
function AnimatedNumber({ target, duration = 1.4 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-5%' });
  const prefersReduced = useReducedMotion();
  const [display, setDisplay] = useState(() => (prefersReduced || !target.match(/[\d.]+/) ? target : '0'));
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!inView || hasStarted.current) return;
    hasStarted.current = true;

    // If target is not purely numeric (e.g. "196+", "20–30%", "0%"), animate prefix
    const numericMatch = target.match(/[\d.]+/);
    if (!numericMatch || prefersReduced) {
      return;
    }

    const end = parseFloat(numericMatch[0]);
    const suffix = target.replace(numericMatch[0], '').replace(/^[\d.]+/, '');
    const prefix = target.slice(0, target.indexOf(numericMatch[0]));

    const startTime = performance.now();
    const step = (now) => {
      const elapsed = (now - startTime) / (duration * 1000);
      const progress = Math.min(elapsed, 1);
      // ease out expo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(eased * end);
      setDisplay(`${prefix}${current}${suffix}`);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration, prefersReduced]);

  return <span ref={ref}>{display}</span>;
}

/* ─────────────────────────────────────────
   CONTENT NEEDED PLACEHOLDER
───────────────────────────────────────── */
function ContentPlaceholder({ text }) {
  const isNeeded = typeof text === 'string' && text.includes('[CONTENT NEEDED');
  if (!isNeeded) return <>{text}</>;
  return (
    <span
      style={{
        display: 'inline-block',
        background: '#1A1A22',
        color: '#52545C',
        fontStyle: 'italic',
        border: '1px dashed #22222A',
        padding: '4px 10px',
        borderRadius: '2px',
        fontSize: '0.9em',
      }}
    >
      {text}
    </span>
  );
}

/* ─────────────────────────────────────────
   SECTION BLOCK — reusable case study section
───────────────────────────────────────── */
function CaseSection({ label, icon, children }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-5%' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{ marginBottom: '0' }}
    >
      {/* Section label */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '20px',
        }}
      >
        {icon && (
          <span style={{ color: 'var(--color-accent)', fontSize: '16px' }}>{icon}</span>
        )}
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '9px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--color-text-tertiary)',
          }}
        >
          {label}
        </span>
      </div>

      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   IMPACT METRIC CARD
───────────────────────────────────────── */
function ImpactMetric({ metric, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        padding: '20px 24px',
        border: '1px solid var(--color-border)',
        borderTop: '2px solid var(--color-accent)',
        background: 'rgba(255,255,255,0.02)',
        flex: '1 1 160px',
        minWidth: '160px',
      }}
    >
      {/* Value */}
      <div
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 'clamp(28px, 3.5vw, 48px)',
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          lineHeight: 1,
          marginBottom: '8px',
        }}
      >
        <AnimatedNumber target={metric.value} />
      </div>

      {/* Label */}
      <div
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '13px',
          color: 'var(--color-accent)',
          fontWeight: 500,
          marginBottom: '4px',
        }}
      >
        {metric.label}
      </div>

      {/* Description */}
      <div
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '11px',
          color: 'var(--color-text-tertiary)',
          lineHeight: 1.5,
        }}
      >
        <ContentPlaceholder text={metric.description} />
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   HORIZONTAL RULE
───────────────────────────────────────── */
function Rule() {
  return <div style={{ height: '1px', background: 'var(--color-border)', margin: '40px 0' }} />;
}

/* ─────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────── */
export default function CaseStudy({ project, onClose, onOpenSimulator, setCursor, resetCursor }) {
  const prefersReduced = useReducedMotion();
  const scrollRef = useRef(null);
  const [previewPdf, setPreviewPdf] = useState(null);

  // ESC key handler
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Trap body scroll when open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  if (!project) return null;

  const slideVariants = {
    hidden: { y: prefersReduced ? 0 : '100%', opacity: prefersReduced ? 0 : 1 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
    },
    exit: {
      y: prefersReduced ? 0 : '100%',
      opacity: prefersReduced ? 0 : 1,
      transition: { duration: 0.5, ease: [0.7, 0, 0.84, 0] },
    },
  };

  return (
    <AnimatePresence>
      <motion.div
        key="case-study-overlay"
        data-inspect="CASE STUDY: Deep product storytelling"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 300,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Backdrop blur layer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={onClose}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(6,6,8,0.6)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        />

          {/* Panel */}
          <motion.div
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: 'relative',
              zIndex: 1,
              marginTop: 'auto',
              height: '94vh',
              maxHeight: '100dvh',
              background: project.color || '#1A1A22',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
            }}
          >
            {/* ── TOP BAR ── */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px clamp(16px, 4vw, 64px)',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                flexShrink: 0,
                gap: '12px',
              }}
            >
              {/* Left: index + title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '10px',
                    letterSpacing: '0.2em',
                    color: 'rgba(200,169,110,0.6)',
                  }}
                >
                  {project.index}
                </span>
                <span
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 'clamp(14px, 1.8vw, 22px)',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {project.title}
                </span>
                {project.company && (
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '9px',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: 'var(--color-text-tertiary)',
                    }}
                  >
                    {project.company} · {project.year}
                  </span>
                )}
              </div>

              {/* Right: live button (if provided) + close button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                {project.link && typeof project.link === 'string' && project.link.trim() && (
                  <motion.a
                    href={project.link.trim().startsWith('http') ? project.link.trim() : `https://${project.link.trim()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => setCursor?.(CURSOR_STATES.EXPLORE)}
                    onMouseLeave={resetCursor}
                    whileHover={{ scale: 1.05, boxShadow: '0 0 16px rgba(200, 242, 62, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      cursor: 'pointer',
                      background: 'rgba(200, 242, 62, 0.12)',
                      border: '1px solid #C8F23E',
                      color: '#C8F23E',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      padding: '6px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      textDecoration: 'none',
                      borderRadius: '4px',
                    }}
                  >
                    <span style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: '#C8F23E',
                      boxShadow: '0 0 6px #C8F23E',
                      display: 'inline-block',
                    }} />
                    <span>LIVE PROJECT</span>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </motion.a>
                )}

                {/* PDF Quick Actions (Top Bar) */}
                {project.pdfUrl && (
                  <>
                    <motion.button
                      onClick={() => setPreviewPdf({
                        url: project.pdfUrl,
                        title: project.title,
                        name: project.pdfName || `${project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-spec.pdf`,
                        size: project.pdfSize,
                      })}
                      onMouseEnter={() => setCursor?.(CURSOR_STATES.EXPLORE)}
                      onMouseLeave={resetCursor}
                      whileHover={{ scale: 1.05, boxShadow: '0 0 14px rgba(255, 107, 107, 0.35)' }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        cursor: 'pointer',
                        background: 'rgba(255, 107, 107, 0.12)',
                        border: '1px solid #FF6B6B',
                        color: '#FF6B6B',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        padding: '6px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        borderRadius: '4px',
                      }}
                      title="Preview Case Study PDF"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <span>PREVIEW PDF</span>
                    </motion.button>

                    <motion.a
                      href={project.pdfUrl}
                      download={project.pdfName || `${project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-spec.pdf`}
                      onMouseEnter={() => setCursor?.(CURSOR_STATES.EXPLORE)}
                      onMouseLeave={resetCursor}
                      whileHover={{ scale: 1.05, background: 'rgba(255, 255, 255, 0.1)' }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        cursor: 'pointer',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-secondary)',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.12em',
                        padding: '6px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        textDecoration: 'none',
                        borderRadius: '4px',
                      }}
                      title="Download Case Study PDF"
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      <span>DOWNLOAD</span>
                    </motion.a>
                  </>
                )}

                <motion.button
                  onClick={onClose}
                  onMouseEnter={() => setCursor?.(CURSOR_STATES.HOVER)}
                  onMouseLeave={resetCursor}
                  whileHover={{ scale: 1.08, borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    cursor: 'pointer',
                    background: 'transparent',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-secondary)',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '10px',
                    letterSpacing: '0.2em',
                    padding: '6px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    flexShrink: 0,
                    borderRadius: '4px',
                  }}
                >
                  <span>ESC</span>
                  <span style={{ fontSize: '13px', lineHeight: 1 }}>✕</span>
                </motion.button>
              </div>
            </div>

            {/* ── SCROLLABLE CONTENT ── */}
            <div
              ref={scrollRef}
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: 'clamp(24px, 4vh, 64px) clamp(16px, 5vw, 120px)',
                scrollbarWidth: 'thin',
                scrollbarColor: 'var(--color-border) transparent',
              }}
            >
            {/* Attached PDF Documentation Card */}
            {project.pdfUrl && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                style={{
                  marginBottom: '32px',
                  padding: '20px 24px',
                  border: '1px solid rgba(255, 107, 107, 0.3)',
                  background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.08) 0%, rgba(20, 20, 26, 0.6) 100%)',
                  borderRadius: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '240px' }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: '8px',
                    background: 'rgba(255, 107, 107, 0.15)',
                    border: '1px solid rgba(255, 107, 107, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    flexShrink: 0
                  }}>
                    📄
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '9px',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: '#FF6B6B',
                        fontWeight: 700
                      }}>
                        ATTACHED DOCUMENTATION / SPEC
                      </span>
                      {project.pdfSize && (
                        <span style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '9px',
                          color: 'var(--color-text-tertiary)',
                          background: 'rgba(255,255,255,0.06)',
                          padding: '2px 6px',
                          borderRadius: '3px'
                        }}>
                          {project.pdfSize}
                        </span>
                      )}
                    </div>
                    <div style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: '13px',
                      color: 'var(--color-text-primary)',
                      fontWeight: 500
                    }}>
                      {project.pdfName || `${project.title} — Product Specification & Case Study`}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <motion.button
                    onClick={() => setPreviewPdf({
                      url: project.pdfUrl,
                      title: project.title,
                      name: project.pdfName || `${project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-spec.pdf`,
                      size: project.pdfSize,
                    })}
                    onMouseEnter={() => setCursor?.(CURSOR_STATES.EXPLORE)}
                    onMouseLeave={resetCursor}
                    whileHover={{ scale: 1.04, background: '#FF6B6B', color: '#000' }}
                    whileTap={{ scale: 0.96 }}
                    style={{
                      cursor: 'pointer',
                      background: 'rgba(255, 107, 107, 0.15)',
                      border: '1px solid #FF6B6B',
                      color: '#FF6B6B',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '10px',
                      letterSpacing: '0.12em',
                      padding: '10px 18px',
                      borderRadius: '5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontWeight: 700,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    <span>PREVIEW PDF</span>
                  </motion.button>
                  <motion.a
                    href={project.pdfUrl}
                    download={project.pdfName || `${project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-spec.pdf`}
                    onMouseEnter={() => setCursor?.(CURSOR_STATES.EXPLORE)}
                    onMouseLeave={resetCursor}
                    whileHover={{ scale: 1.04, background: 'rgba(255,255,255,0.1)' }}
                    whileTap={{ scale: 0.96 }}
                    style={{
                      cursor: 'pointer',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-primary)',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '10px',
                      letterSpacing: '0.12em',
                      padding: '10px 16px',
                      borderRadius: '5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      textDecoration: 'none',
                      fontWeight: 600,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span>DOWNLOAD</span>
                  </motion.a>
                </div>
              </motion.div>
            )}
            {/* Interactive simulator CTA (ARAS) */}
            {project.isInteractive && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                style={{
                  marginBottom: '40px',
                  padding: '18px 24px',
                  border: '1px solid rgba(200,169,110,0.4)',
                  background: 'rgba(200,169,110,0.06)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '9px',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: 'var(--color-accent)',
                      marginBottom: '4px',
                    }}
                  >
                    ◈ INTERACTIVE EXPERIENCE AVAILABLE
                  </div>
                  <div
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: '13px',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    Walk through the exact problem that led to ARAS being built.
                  </div>
                </div>
                <motion.button
                  onClick={onOpenSimulator}
                  onMouseEnter={() => setCursor?.(CURSOR_STATES.EXPLORE)}
                  onMouseLeave={resetCursor}
                  whileHover={{
                    backgroundColor: 'var(--color-accent)',
                    color: 'var(--color-void)',
                    scale: 1.02,
                  }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    cursor: 'pointer',
                    background: 'transparent',
                    border: '1px solid var(--color-accent)',
                    color: 'var(--color-accent)',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '10px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    padding: '12px 24px',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  EXPERIENCE THE PROBLEM →
                </motion.button>
              </motion.div>
            )}

            {/* 1. PROBLEM */}
            <CaseSection label="PROBLEM" icon="◎">
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 'clamp(20px, 2.8vw, 38px)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  lineHeight: 1.3,
                  color: 'var(--color-text-primary)',
                  letterSpacing: '-0.01em',
                  maxWidth: '820px',
                }}
              >
                <ContentPlaceholder text={project.problem} />
              </p>
            </CaseSection>

            <Rule />

            {/* 2. INSIGHT */}
            <CaseSection label="INSIGHT" icon="◈">
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 'clamp(15px, 1.5vw, 19px)',
                  lineHeight: 1.7,
                  color: 'var(--color-text-secondary)',
                  fontWeight: 300,
                  maxWidth: '700px',
                }}
              >
                <ContentPlaceholder text={project.insight} />
              </p>
            </CaseSection>

            <Rule />

            {/* 3. DECISION */}
            <CaseSection label="DECISION" icon="→">
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 'clamp(15px, 1.5vw, 19px)',
                  lineHeight: 1.7,
                  color: 'var(--color-text-secondary)',
                  fontWeight: 300,
                  maxWidth: '700px',
                }}
              >
                <ContentPlaceholder text={project.decision} />
              </p>
            </CaseSection>

            <Rule />

            {/* 4. SOLUTION */}
            <CaseSection label="SOLUTION" icon="◻">
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 'clamp(15px, 1.5vw, 19px)',
                  lineHeight: 1.7,
                  color: 'var(--color-text-secondary)',
                  fontWeight: 300,
                  maxWidth: '700px',
                }}
              >
                <ContentPlaceholder text={project.solution} />
              </p>
            </CaseSection>

            <Rule />

            {/* 5. IMPACT — animated metrics */}
            <CaseSection label="IMPACT" icon="▲">
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}
              >
                {project.impact?.map((metric, i) => (
                  <ImpactMetric key={i} metric={metric} index={i} />
                ))}
              </div>
            </CaseSection>

            <Rule />

            {/* 6. TRADE-OFFS */}
            <CaseSection label="TRADE-OFFS" icon="⇌">
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 'clamp(15px, 1.5vw, 19px)',
                  lineHeight: 1.7,
                  color: 'var(--color-text-secondary)',
                  fontWeight: 300,
                  maxWidth: '700px',
                }}
              >
                <ContentPlaceholder text={project.tradeoffs} />
              </p>
            </CaseSection>

            <Rule />

            {/* 7. RETROSPECTIVE */}
            <CaseSection label="RETROSPECTIVE — WHAT I'D DO DIFFERENTLY" icon="↺">
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 'clamp(15px, 1.5vw, 19px)',
                  lineHeight: 1.7,
                  color: 'var(--color-text-secondary)',
                  fontWeight: 300,
                  maxWidth: '700px',
                }}
              >
                <ContentPlaceholder text={project.retrospective} />
              </p>
            </CaseSection>

            {/* Bottom spacer */}
            <div style={{ height: '80px' }} />
          </div>
        </motion.div>

        {/* PDF Preview Modal */}
        <PdfPreviewModal
          isOpen={Boolean(previewPdf)}
          fileUrl={previewPdf?.url}
          fileName={previewPdf?.name}
          title={previewPdf?.title}
          fileSize={previewPdf?.size}
          onClose={() => setPreviewPdf(null)}
        />
      </motion.div>
    </AnimatePresence>
  );
}
