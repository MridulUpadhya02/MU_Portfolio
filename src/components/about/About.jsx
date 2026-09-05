import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { usePortfolioData } from '../../context/PortfolioDataContext';

/* ──────────────────────────────────────────
   3D DOTTED WIREFRAME SPHERE COMPONENT
   Concentric latitude/longitude rings with a
   neon lime-green crescent rim along the right.
   ────────────────────────────────────────── */
function DottedOrbitalSphere() {
  return (
    <div
      style={{
        position: 'relative',
        width: 'clamp(140px, 14vw, 190px)',
        height: 'clamp(140px, 14vw, 190px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Intense lime green glow on the right edge */}
      <div
        style={{
          position: 'absolute',
          right: '-10%',
          top: '15%',
          width: '65%',
          height: '70%',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(162, 224, 36, 0.4) 0%, rgba(162, 224, 36, 0.08) 50%, transparent 75%)',
          filter: 'blur(16px)',
          pointerEvents: 'none',
        }}
      />

      <svg
        viewBox="0 0 200 200"
        style={{
          width: '100%',
          height: '100%',
          overflow: 'visible',
        }}
      >
        <defs>
          <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="crescentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-accent-soft)" stopOpacity="0.2" />
            <stop offset="60%" stopColor="var(--color-accent-soft)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Outer subtle circle boundary */}
        <circle
          cx="100"
          cy="100"
          r="86"
          fill="none"
          stroke="rgba(255, 255, 255, 0.07)"
          strokeWidth="1"
          strokeDasharray="2 4"
        />

        {/* Horizontal latitude dot rings */}
        {[
          { y: 35, rx: 56, ry: 10, dots: 16 },
          { y: 55, rx: 76, ry: 14, dots: 22 },
          { y: 78, rx: 84, ry: 17, dots: 26 },
          { y: 100, rx: 86, ry: 18, dots: 28 }, // Equator
          { y: 122, rx: 84, ry: 17, dots: 26 },
          { y: 145, rx: 76, ry: 14, dots: 22 },
          { y: 165, rx: 56, ry: 10, dots: 16 },
        ].map((ring, rIdx) => (
          <ellipse
            key={`lat-${rIdx}`}
            cx="100"
            cy={ring.y}
            rx={ring.rx}
            ry={ring.ry}
            fill="none"
            stroke="rgba(255, 255, 255, 0.16)"
            strokeWidth="1.2"
            strokeDasharray="2 6"
          />
        ))}

        {/* Vertical longitude ellipse arcs */}
        {[18, 42, 68, 86].map((rx, lIdx) => (
          <ellipse
            key={`long-${lIdx}`}
            cx="100"
            cy="100"
            rx={rx}
            ry="86"
            fill="none"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1.1"
            strokeDasharray="2 7"
          />
        ))}

        {/* Neon illuminated crescent arc on the right rim */}
        <path
          d="M 100 14 A 86 86 0 0 1 100 186"
          fill="none"
          stroke="url(#crescentGrad)"
          strokeWidth="2.8"
          strokeLinecap="round"
          filter="url(#neonGlow)"
        />

        {/* Highlight dots along the glowing crescent */}
        {[
          { cx: 161, cy: 39 },
          { cx: 178, cy: 68 },
          { cx: 186, cy: 100 },
          { cx: 178, cy: 132 },
          { cx: 161, cy: 161 },
        ].map((pt, pIdx) => (
          <g key={`glow-dot-${pIdx}`}>
            <circle
              cx={pt.cx}
              cy={pt.cy}
              r="2.8"
              fill="#D6FF48"
              filter="url(#neonGlow)"
            />
            <circle
              cx={pt.cx}
              cy={pt.cy}
              r="5"
              fill="rgba(162, 224, 36, 0.35)"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ──────────────────────────────────────────
   MAIN ABOUT & BEYOND WORK SECTION
   ────────────────────────────────────────── */
export default function About({ setCursor, resetCursor }) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const { data } = usePortfolioData();

  // Audio player interactive state
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(58); // %

  // Simulated playback timer
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setPlaybackProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <section
      id="about"
      ref={sectionRef}
      data-inspect="ABOUT: Beyond work & human identity"
      style={{
        position: 'relative',
        background: '#050608',
        padding: 'clamp(64px, 8vw, 120px) clamp(20px, 5vw, 84px)',
        overflow: 'hidden',
        color: '#F5F5F0',
      }}
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          right: '5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(162, 224, 36, 0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(80px)',
        }}
        aria-hidden="true"
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(162, 224, 36, 0.03) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(70px)',
        }}
        aria-hidden="true"
      />

      <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* ── HEADER ROW ──────────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
            gap: 'clamp(28px, 4vw, 56px)',
            alignItems: 'center',
            marginBottom: 'clamp(44px, 6vw, 72px)',
          }}
        >
          {/* Left Column: Title & Subtitle */}
          <div>
            {/* Section Tag */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#A2E024',
                }}
              >
                04
              </span>
              <span
                style={{
                  color: '#A2E024',
                  fontWeight: 800,
                  letterSpacing: '-0.05em',
                }}
              >
                ——
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: '#D8DDD2',
                }}
              >
                BEYOND WORK
              </span>
            </motion.div>

            {/* Headline with 3-line typography */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(42px, 5.8vw, 78px)',
                fontWeight: 800,
                lineHeight: 0.94,
                letterSpacing: '-0.035em',
                textTransform: 'uppercase',
                margin: '0 0 24px 0',
              }}
            >
              <span style={{ display: 'block', color: '#FFFFFF' }}>THE HUMAN</span>
              <span
                style={{
                  display: 'block',
                  color: 'transparent',
                  WebkitTextStroke: '1.5px #A2E024',
                }}
              >
                BEHIND THE
              </span>
              <span
                style={{
                  display: 'block',
                  color: 'transparent',
                  WebkitTextStroke: '1.5px #A2E024',
                }}
              >
                PRODUCT
              </span>
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(14px, 1.1vw, 16px)',
                lineHeight: 1.65,
                color: '#8E958A',
                maxWidth: '480px',
                margin: 0,
              }}
            >
              A little more than roadmaps, metrics and PRDs. Here&apos;s a glimpse into what keeps me
              curious, motivated and human.
            </motion.p>
          </div>

          {/* Right Column: Keyword list + 3D Orbital Sphere + Always Curious Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              justifyContent: 'center',
              position: 'relative',
              paddingRight: 'clamp(0px, 2vw, 32px)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(20px, 3vw, 44px)',
                position: 'relative',
              }}
            >
              {/* Vertical Stack List with leading green dash */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                }}
              >
                <span
                  style={{
                    color: '#A2E024',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    fontWeight: 700,
                    lineHeight: 1,
                    marginTop: '2px',
                  }}
                >
                  ——
                </span>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '0.18em',
                    color: '#7C8476',
                    textTransform: 'uppercase',
                  }}
                >
                  <span>PRODUCT</span>
                  <span>TECH</span>
                  <span>PEOPLE</span>
                  <span>IDEAS</span>
                  <span>LIFE</span>
                </div>
              </div>

              {/* 3D Dotted Sphere with Glowing Crescent */}
              <DottedOrbitalSphere />
            </div>

            {/* ALWAYS CURIOUS pill badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '16px',
                padding: '6px 14px',
                borderRadius: '999px',
                background: 'rgba(18, 19, 24, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#A2E024',
                  boxShadow: '0 0 8px #A2E024',
                  display: 'inline-block',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9.5px',
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#D2D7CC',
                }}
              >
                ALWAYS CURIOUS
              </span>
            </div>
          </motion.div>
        </div>

        {/* ── 2×2 FEATURED CARDS GRID ──────────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
            gap: 'clamp(20px, 2.5vw, 32px)',
            marginBottom: 'clamp(28px, 3.5vw, 44px)',
          }}
        >
          {/* ──── CARD 1: CURRENTLY LISTENING ──── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: 'linear-gradient(180deg, rgba(20, 22, 26, 0.88) 0%, rgba(12, 13, 16, 0.96) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: 'clamp(22px, 2.5vw, 28px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 12px 36px rgba(0,0,0,0.45)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Card Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '22px',
              }}
            >
              {/* Headphone SVG icon */}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A2E024" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
              </svg>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#A2E024',
                }}
              >
                CURRENTLY LISTENING
              </span>
            </div>

            {/* Song Meta Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Album Cover Artwork */}
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    flexShrink: 0,
                    boxShadow: '0 6px 16px rgba(0,0,0,0.5)',
                    background: '#0e121a',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <img
                    src="/sapphire-cover.jpg"
                    alt="Sapphire - Ed Sheeran"
                    loading="lazy"
                    decoding="async"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                    onError={(e) => {
                      // Fallback if image fails
                      e.target.style.display = 'none';
                    }}
                  />
                </div>

                {/* Title & Artist */}
                <div>
                  <h4
                    style={{
                      margin: 0,
                      fontFamily: 'var(--font-heading)',
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    Sapphire
                  </h4>
                  <p
                    style={{
                      margin: '3px 0 0 0',
                      fontFamily: 'var(--font-body)',
                      fontSize: '13px',
                      color: '#8E958A',
                    }}
                  >
                    Ed Sheeran
                  </p>
                </div>
              </div>

              {/* Interactive Heart Icon */}
              <button
                onClick={() => setIsLiked(!isLiked)}
                onMouseEnter={() => setCursor?.('BUTTON')}
                onMouseLeave={() => resetCursor?.()}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.2s ease',
                  transform: isLiked ? 'scale(1.15)' : 'scale(1)',
                }}
                aria-label="Like song"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill={isLiked ? '#A2E024' : 'none'}
                  stroke={isLiked ? '#A2E024' : '#7C8476'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </button>
            </div>

            {/* Audio Scrubber Bar & Timestamps */}
            <div style={{ marginBottom: '16px' }}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '4px',
                  background: 'rgba(255, 255, 255, 0.12)',
                  borderRadius: '999px',
                  marginBottom: '8px',
                  cursor: 'pointer',
                }}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const newPct = Math.min(100, Math.max(0, (clickX / rect.width) * 100));
                  setPlaybackProgress(newPct);
                }}
              >
                {/* Green Progress */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    width: `${playbackProgress}%`,
                    background: '#A2E024',
                    borderRadius: '999px',
                    boxShadow: '0 0 8px rgba(162, 224, 36, 0.6)',
                  }}
                />
                {/* Thumb Knob */}
                <div
                  style={{
                    position: 'absolute',
                    left: `${playbackProgress}%`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    boxShadow: '0 0 8px rgba(162, 224, 36, 0.9)',
                  }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: '#7C8476',
                }}
              >
                <span>02:17</span>
                <span>03:59</span>
              </div>
            </div>

            {/* Audio Controls Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '24px',
              }}
            >
              {/* Shuffle */}
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
                aria-label="Shuffle"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7C8476" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22" />
                  <path d="m18 2 4 4-4 4" />
                  <path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2" />
                  <path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8" />
                  <path d="m18 14 4 4-4 4" />
                </svg>
              </button>

              {/* Previous */}
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
                aria-label="Previous track"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#B0B5A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="19 20 9 12 19 4 19 20" />
                  <line x1="5" y1="19" x2="5" y2="5" />
                </svg>
              </button>

              {/* Play / Pause Toggle Button */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                onMouseEnter={() => setCursor?.('BUTTON')}
                onMouseLeave={() => resetCursor?.()}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#A2E024',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 16px rgba(162, 224, 36, 0.45)',
                  transition: 'transform 0.15s ease, background-color 0.2s ease',
                }}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  // Pause bars
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#050608">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  // Play triangle
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#050608" style={{ marginLeft: '2px' }}>
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                )}
              </button>

              {/* Next */}
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
                aria-label="Next track"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#B0B5A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 4 15 12 5 20 5 4" />
                  <line x1="19" y1="5" x2="19" y2="19" />
                </svg>
              </button>

              {/* Repeat */}
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
                aria-label="Repeat"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7C8476" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m17 2 4 4-4 4" />
                  <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
                  <path d="m7 22-4-4 4-4" />
                  <path d="M21 13v1a4 4 0 0 1-4 4H3" />
                </svg>
              </button>
            </div>
          </motion.div>

          {/* ──── CARD 2: CURRENTLY READING ──── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: 'linear-gradient(180deg, rgba(20, 22, 26, 0.88) 0%, rgba(12, 13, 16, 0.96) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: 'clamp(22px, 2.5vw, 28px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 12px 36px rgba(0,0,0,0.45)',
              position: 'relative',
            }}
          >
            {/* Card Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '20px',
              }}
            >
              {/* Book SVG icon */}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A2E024" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                <path d="M6 6h10" />
                <path d="M6 10h10" />
              </svg>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#A2E024',
                }}
              >
                CURRENTLY READING
              </span>
            </div>

            {/* Book Meta Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                marginBottom: '22px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                {/* Authentic Atomic Habits book cover thumbnail */}
                <div
                  style={{
                    width: '64px',
                    height: '84px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    flexShrink: 0,
                    boxShadow: '0 6px 18px rgba(0,0,0,0.5)',
                    background: '#F6F4EF',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <img
                    src="/atomic-habits.jpg"
                    alt="Atomic Habits - James Clear"
                    loading="lazy"
                    decoding="async"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </div>

                {/* Title, Author & Quote */}
                <div>
                  <h4
                    style={{
                      margin: 0,
                      fontFamily: 'var(--font-heading)',
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    Atomic Habits
                  </h4>
                  <p
                    style={{
                      margin: '2px 0 8px 0',
                      fontFamily: 'var(--font-body)',
                      fontSize: '13px',
                      color: '#8E958A',
                    }}
                  >
                    James Clear
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: 'var(--font-body)',
                      fontSize: '13px',
                      fontStyle: 'italic',
                      color: '#BAC0B4',
                      lineHeight: 1.4,
                    }}
                  >
                    &ldquo;Small changes. Big compounding results.&rdquo;
                  </p>
                </div>
              </div>

              {/* Chevron right */}
              <div
                style={{
                  color: '#A2E024',
                  fontSize: '18px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A2E024" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>
            </div>

            {/* Pill Tags Row */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                paddingTop: '6px',
              }}
            >
              {['Behaviour', 'Habits', 'Better Systems'].map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '999px',
                    background: 'rgba(162, 224, 36, 0.05)',
                    border: '1px solid rgba(162, 224, 36, 0.28)',
                    color: '#A2E024',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11.5px',
                    fontWeight: 500,
                    letterSpacing: '0.04em',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* ──── CARD 3: CURRENTLY THINKING ABOUT ──── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: 'linear-gradient(180deg, rgba(20, 22, 26, 0.88) 0%, rgba(12, 13, 16, 0.96) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: 'clamp(22px, 2.5vw, 28px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 12px 36px rgba(0,0,0,0.45)',
              position: 'relative',
            }}
          >
            <div>
              {/* Card Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '20px',
                }}
              >
                {/* Brain SVG icon */}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A2E024" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
                  <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
                  <path d="M12 5v14" />
                </svg>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: '#A2E024',
                  }}
                >
                  CURRENTLY THINKING ABOUT
                </span>
              </div>

              {/* Bold Question Headline */}
              <h3
                style={{
                  margin: '0 0 14px 0',
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(18px, 1.8vw, 22px)',
                  fontWeight: 700,
                  lineHeight: 1.35,
                  letterSpacing: '-0.02em',
                }}
              >
                <span style={{ color: '#FFFFFF', display: 'block' }}>How do products become</span>
                <span style={{ color: '#A2E024', display: 'block' }}>a part of everyday life?</span>
              </h3>

              {/* Body explanation */}
              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  lineHeight: 1.6,
                  color: '#8E958A',
                }}
              >
                What makes some products habitual while others are forgotten, despite solving real problems?
              </p>
            </div>

            {/* Bottom row: chevron */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                paddingTop: '20px',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A2E024" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </div>
          </motion.div>

          {/* ──── CARD 4: OUTSIDE WORK ──── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: 'linear-gradient(180deg, rgba(20, 22, 26, 0.88) 0%, rgba(12, 13, 16, 0.96) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: 'clamp(22px, 2.5vw, 28px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 12px 36px rgba(0,0,0,0.45)',
              position: 'relative',
            }}
          >
            <div>
              {/* Card Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '16px',
                }}
              >
                {/* Mountain SVG icon */}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A2E024" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
                </svg>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: '#A2E024',
                  }}
                >
                  OUTSIDE WORK
                </span>
              </div>

              {/* Panoramic Scenic Banner of Mumbai Marine Drive */}
              <div
                style={{
                  width: '100%',
                  height: '120px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  marginBottom: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
                }}
              >
                <img
                  src="/marine-drive.jpg"
                  alt="Mumbai Marine Drive Queens Necklace Skyline"
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>

              {/* Description text */}
              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-body)',
                  fontSize: '13.5px',
                  lineHeight: 1.55,
                  color: '#8E958A',
                }}
              >
                Exploring new places, capturing moments, good food, meaningful conversations and everything in between.
              </p>
            </div>

            {/* Bottom row: chevron */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                paddingTop: '16px',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A2E024" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </div>
          </motion.div>
        </div>

        {/* ── BOTTOM 5-ITEM MINI CARD ROW (1×5) ──────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
            gap: '14px',
            marginBottom: '44px',
          }}
        >
          {[
            {
              title: 'TRAVEL',
              desc: 'New cities new perspectives',
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A2E024" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
                </svg>
              ),
            },
            {
              title: 'PHOTOGRAPHY',
              desc: 'Finding stories in everyday moments',
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A2E024" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
              ),
            },
            {
              title: 'FITNESS',
              desc: 'A clearer mind builds better ideas',
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A2E024" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6.5 6.5 11 11" />
                  <path d="m21 21-1-1" />
                  <path d="m3 3 1 1" />
                  <path d="m18 22 4-4" />
                  <path d="m2 6 4-4" />
                  <path d="m3 10 7-7" />
                  <path d="m14 21 7-7" />
                </svg>
              ),
            },
            {
              title: 'GOOD COFFEE',
              desc: 'Better conversations start here',
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A2E024" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
                  <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
                  <line x1="6" y1="2" x2="6" y2="4" />
                  <line x1="10" y1="2" x2="10" y2="4" />
                  <line x1="14" y1="2" x2="14" y2="4" />
                </svg>
              ),
            },
            {
              title: 'RANDOM IDEAS',
              desc: 'A running list that never ends',
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A2E024" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                  <path d="M9 18h6" />
                  <path d="M10 22h4" />
                </svg>
              ),
            },
          ].map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: 'rgba(15, 17, 21, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '12px',
                padding: '16px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                transition: 'border-color 0.25s ease, transform 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(162, 224, 36, 0.35)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {item.icon}
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {item.title}
                </span>
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '11.5px',
                  color: '#7C8476',
                  lineHeight: 1.4,
                }}
              >
                {item.desc}
              </span>
            </motion.div>
          ))}
        </div>

        {/* ── SECTION FOOTER BAR ──────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.07)',
          }}
        >
          {/* Left: SAME CURIOSITY. DIFFERENT PLAYGROUND. */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#A2E024',
                boxShadow: '0 0 6px #A2E024',
                display: 'inline-block',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.16em',
                color: '#7C8476',
                textTransform: 'uppercase',
                fontWeight: 500,
              }}
            >
              SAME CURIOSITY. DIFFERENT PLAYGROUND.
            </span>
          </div>

          {/* Center Button: LET'S CONNECT → */}
          <a
            href="#contact"
            onMouseEnter={() => setCursor?.('BUTTON')}
            onMouseLeave={() => resetCursor?.()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 24px',
              borderRadius: '8px',
              background: 'rgba(162, 224, 36, 0.05)',
              border: '1px solid #A2E024',
              color: '#A2E024',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'all 0.25s ease',
              boxShadow: '0 0 12px rgba(162, 224, 36, 0.1)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(162, 224, 36, 0.12)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(162, 224, 36, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(162, 224, 36, 0.05)';
              e.currentTarget.style.boxShadow = '0 0 12px rgba(162, 224, 36, 0.1)';
            }}
          >
            <span>LET&apos;S CONNECT</span>
            <span style={{ fontSize: '14px', lineHeight: 1 }}>→</span>
          </a>

          {/* Right: MUMBAI, INDIA —— / AND BEYOND */}
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9.5px',
              letterSpacing: '0.16em',
              color: '#7C8476',
              textTransform: 'uppercase',
              textAlign: 'right',
              lineHeight: 1.5,
              fontWeight: 500,
            }}
          >
            <div>
              MUMBAI, INDIA <span style={{ color: '#A2E024' }}>——</span>
            </div>
            <div>AND BEYOND</div>
          </div>
        </div>
      </div>
    </section>
  );
}
