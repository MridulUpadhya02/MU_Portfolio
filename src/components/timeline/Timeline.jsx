import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { TIMELINE_STAGES } from '../../data/content.js';
import { usePortfolioData } from '../../context/PortfolioDataContext';

/* ─── STAGE ACCENT PALETTE ──────────────────────────────────────────────────── */
const STAGE_ACCENT = ['#C8F23E', '#5A8AFF', '#FF8A65', '#7AE86E', '#C8F23E'];

/* ─── MOBILE VERTICAL TIMELINE ──────────────────────────────────────────────── */
function MobileTimeline({ stages }) {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <div
      ref={sectionRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        position: 'relative',
        padding: '0 clamp(16px, 4.5vw, 40px)',
      }}
    >
      {/* Vertical connector line */}
      <div style={{
        position: 'absolute',
        left: 'clamp(42px, 9vw, 56px)',
        top: 0, bottom: 0,
        width: 1,
        background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.05) 10%, rgba(255,255,255,0.05) 90%, transparent 100%)',
      }} />

      {stages.map((stage, i) => {
        const accent = STAGE_ACCENT[i % STAGE_ACCENT.length];
        return (
          <motion.div
            key={stage.stage}
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', gap: 24, paddingBottom: 40, position: 'relative' }}
          >
            {/* Stage dot */}
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: accent, flexShrink: 0,
              marginTop: 8, position: 'relative', zIndex: 1,
              boxShadow: `0 0 10px ${accent}66`,
            }} />

            {/* Card */}
            <div style={{
              flex: 1,
              background: 'var(--color-surface)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderLeft: `2px solid ${accent}55`,
              borderRadius: 4,
              padding: '20px',
            }}>
              <div style={{
                fontFamily: 'DM Mono, monospace', fontSize: 9,
                color: accent, letterSpacing: '0.18em', marginBottom: 6,
              }}>{stage.stage} · {stage.period}</div>

              <h3 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: 22, color: 'var(--color-text-primary)',
                marginBottom: 6,
              }}>{stage.title}</h3>

              <div style={{
                fontFamily: 'DM Mono, monospace', fontSize: 10,
                color: 'var(--color-text-tertiary)', marginBottom: 14,
              }}>{stage.company} · {stage.role}</div>

              <p style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13,
                color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 14,
              }}>{stage.description}</p>

              <div style={{ borderTop: `1px solid ${accent}22`, paddingTop: 12 }}>
                <div style={{
                  fontFamily: 'DM Mono, monospace', fontSize: 9,
                  color: accent, letterSpacing: '0.18em', marginBottom: 4,
                }}>OUTCOME</div>
                <div style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12,
                  color: 'var(--color-text-primary)', lineHeight: 1.6,
                }}>{stage.outcome}</div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────────────────────── */
export default function Timeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const scrollRef = useRef(null);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.05 });
  const isScrolling = useRef(false);
  const { data } = usePortfolioData();
  const timelineStages = data?.timeline || TIMELINE_STAGES;

  /* ── Responsive check ───────────────────────────────────────────────────── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* ── IntersectionObserver for active panel ──────────────────────────────── */
  useEffect(() => {
    if (isMobile || !scrollRef.current) return;
    const panels = scrollRef.current.querySelectorAll('[data-panel]');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setActiveIndex(Number(entry.target.dataset.panel));
          }
        });
      },
      { root: scrollRef.current, threshold: 0.5 }
    );
    panels.forEach(p => io.observe(p));
    return () => io.disconnect();
  }, [isMobile]);

  /* ── Navigate to panel ──────────────────────────────────────────────────── */
  const goTo = useCallback((idx) => {
    if (!scrollRef.current || isScrolling.current) return;
    const clamped = Math.max(0, Math.min(timelineStages.length - 1, idx));
    const panel = scrollRef.current.querySelector(`[data-panel="${clamped}"]`);
    if (panel) {
      isScrolling.current = true;
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      setActiveIndex(clamped);
      setTimeout(() => { isScrolling.current = false; }, 900);
    }
  }, []);

  /* ── Keyboard navigation ────────────────────────────────────────────────── */
  const handleKeyDown = useCallback((e) => {
    if (isMobile) return;
    if (e.key === 'ArrowRight') goTo(activeIndex + 1);
    if (e.key === 'ArrowLeft')  goTo(activeIndex - 1);
  }, [activeIndex, goTo, isMobile]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <section
      id="experience"
      ref={sectionRef}
      data-inspect="TIMELINE: Career stages as product lifecycle"
      style={{
        background: 'var(--color-void)',
        paddingTop: 'clamp(80px, 12vh, 140px)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* ── Section header ─────────────────────────────────────────────────── */}
      <div style={{
        padding: '0 clamp(16px, 4.5vw, 80px)',
        marginBottom: 'clamp(40px, 6vh, 60px)',
      }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{
            fontFamily: 'DM Mono, monospace', fontSize: 11,
            color: 'var(--color-text-tertiary)', letterSpacing: '0.2em',
            marginBottom: 20, textTransform: 'uppercase',
          }}
        >05 / JOURNEY</motion.div>

        <div style={{
          display: 'flex', alignItems: 'flex-end',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: 20,
        }}>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(36px, 5vw, 68px)',
              color: 'var(--color-text-primary)', lineHeight: 1.05, margin: 0,
            }}
          >THE <span style={{ color: 'var(--color-accent)' }}>JOURNEY</span></motion.h2>

          {/* Desktop arrow controls */}
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
              style={{ display: 'flex', gap: 10, alignItems: 'center' }}
            >
              {/* Stage progress dots */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginRight: 16 }}>
                {timelineStages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Go to stage ${i + 1}`}
                    style={{
                      width: activeIndex === i ? 20 : 6,
                      height: 6, borderRadius: 3,
                      background: activeIndex === i ? 'var(--color-accent)' : 'rgba(255,255,255,0.06)',
                      border: 'none', cursor: 'pointer',
                      transition: 'all 0.3s ease', padding: 0,
                    }}
                  />
                ))}
              </div>

              <button
                onClick={() => goTo(activeIndex - 1)}
                disabled={activeIndex === 0}
                aria-label="Previous stage"
                style={{
                  width: 40, height: 40, borderRadius: 2,
                  background: 'transparent', border: '1px solid',
                  borderColor: activeIndex === 0 ? 'rgba(255,255,255,0.05)' : 'var(--color-text-tertiary)',
                  color: activeIndex === 0 ? 'rgba(255,255,255,0.15)' : 'var(--color-text-primary)',
                  cursor: activeIndex === 0 ? 'default' : 'pointer',
                  fontSize: 16, transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >←</button>

              <button
                onClick={() => goTo(activeIndex + 1)}
                disabled={activeIndex === timelineStages.length - 1}
                aria-label="Next stage"
                style={{
                  width: 40, height: 40, borderRadius: 2,
                  background: 'transparent', border: '1px solid',
                  borderColor: activeIndex === timelineStages.length - 1 ? 'rgba(255,255,255,0.05)' : 'var(--color-accent)',
                  color: activeIndex === timelineStages.length - 1 ? 'rgba(255,255,255,0.15)' : 'var(--color-accent)',
                  cursor: activeIndex === timelineStages.length - 1 ? 'default' : 'pointer',
                  fontSize: 16, transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >→</button>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── MOBILE: Vertical stack ─────────────────────────────────────────── */}
      {isMobile && (
        <MobileTimeline stages={timelineStages} />
      )}

      {/* ── DESKTOP: Horizontal scroll panels ─────────────────────────────── */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          style={{ position: 'relative' }}
        >
          {/* Full-width horizontal connector line */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 'calc(clamp(240px, 30vh, 310px))',
              left: 0, right: 0,
              height: 1,
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 5%, rgba(255,255,255,0.05) 95%, transparent 100%)',
              zIndex: 0, pointerEvents: 'none',
            }}
          />

          {/* Scroll container */}
          <div
            ref={scrollRef}
            style={{
              display: 'flex',
              overflowX: 'auto',
              overflowY: 'hidden',
              scrollSnapType: 'x mandatory',
              scrollBehavior: 'smooth',
              height: 'clamp(480px, 60vh, 640px)',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {timelineStages.map((stage, i) => {
              const accent = STAGE_ACCENT[i % STAGE_ACCENT.length];
              const isActive = activeIndex === i;

              return (
                <div
                  key={stage.stage}
                  data-panel={i}
                  style={{
                    flex: '0 0 100vw',
                    height: '100%',
                    scrollSnapAlign: 'start',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  {/* Ghost stage number behind content */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      bottom: '-8%', right: '-1%',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 800,
                      fontSize: 'clamp(200px, 30vw, 400px)',
                      lineHeight: 1,
                      color: 'transparent',
                      WebkitTextStroke: `1px ${accent}18`,
                      userSelect: 'none', pointerEvents: 'none',
                      letterSpacing: '-0.05em',
                      zIndex: 0,
                    }}
                  >{stage.stage}</div>

                  {/* Dot on connector line */}
                  <div style={{
                    position: 'absolute',
                    top: 'calc(clamp(240px, 30vh, 310px))',
                    left: '50%',
                    width: isActive ? 10 : 6,
                    height: isActive ? 10 : 6,
                    borderRadius: '50%',
                    background: isActive ? accent : 'rgba(255,255,255,0.12)',
                    transform: 'translate(-50%, -50%)',
                    transition: 'all 0.3s ease',
                    boxShadow: isActive ? `0 0 14px ${accent}88` : 'none',
                    zIndex: 1,
                  }} />

                  {/* Content card */}
                  <motion.div
                    animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.35, y: 20 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      position: 'relative', zIndex: 2,
                      width: 'min(520px, 80vw)',
                      background: 'var(--color-surface)',
                      border: `1px solid ${isActive ? accent + '44' : 'rgba(255,255,255,0.07)'}`,
                      borderLeft: `3px solid ${isActive ? accent : 'rgba(255,255,255,0.07)'}`,
                      borderRadius: 4,
                      padding: 'clamp(24px, 3.5vw, 40px)',
                      transition: 'border-color 0.4s, border-left-color 0.4s',
                    }}
                  >
                    {/* Stage badge */}
                    <div style={{
                      position: 'absolute', top: -14, right: 20,
                      background: 'var(--color-void)',
                      border: `1px solid ${accent}44`,
                      borderRadius: 2, padding: '4px 10px',
                      fontFamily: 'DM Mono, monospace',
                      fontSize: 10, color: accent, letterSpacing: '0.12em',
                    }}>{stage.stage}</div>

                    {/* Period */}
                    <div style={{
                      fontFamily: 'DM Mono, monospace', fontSize: 10,
                      color: accent, letterSpacing: '0.18em',
                      marginBottom: 12, textTransform: 'uppercase',
                    }}>{stage.period}</div>

                    {/* Stage title */}
                    <h3 style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: 'clamp(28px, 3.5vw, 46px)',
                      color: 'var(--color-text-primary)', lineHeight: 1.05,
                      marginBottom: 8,
                    }}>{stage.title}</h3>

                    {/* Company + role */}
                    <div style={{
                      display: 'flex', gap: 8, alignItems: 'center',
                      marginBottom: 18, flexWrap: 'wrap',
                    }}>
                      <span style={{
                        fontFamily: 'DM Mono, monospace', fontSize: 11,
                        color: 'var(--color-text-tertiary)', letterSpacing: '0.04em',
                      }}>{stage.company}</span>
                      {stage.role && <>
                        <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
                        <span style={{
                          fontFamily: 'DM Mono, monospace', fontSize: 11,
                          color: 'var(--color-text-tertiary)',
                        }}>{stage.role}</span>
                      </>}
                    </div>

                    {/* Description */}
                    <p style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14,
                      color: 'var(--color-text-secondary)', lineHeight: 1.75, marginBottom: 20,
                    }}>{stage.description}</p>

                    {/* Outcome */}
                    <div style={{
                      borderTop: `1px solid ${accent}22`, paddingTop: 16,
                    }}>
                      <div style={{
                        fontFamily: 'DM Mono, monospace', fontSize: 9,
                        color: accent, letterSpacing: '0.2em',
                        marginBottom: 6, textTransform: 'uppercase',
                      }}>OUTCOME</div>
                      <div style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13,
                        color: 'var(--color-text-primary)', lineHeight: 1.6,
                      }}>{stage.outcome}</div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* Bottom stage label tabs */}
          <div style={{
            display: 'flex',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}>
            {timelineStages.map((stage, i) => {
              const accent = STAGE_ACCENT[i % STAGE_ACCENT.length];
              return (
                <button
                  key={stage.stage}
                  onClick={() => goTo(i)}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    borderBottom: `2px solid ${activeIndex === i ? accent : 'transparent'}`,
                    padding: '14px 8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                >
                  <div style={{
                    fontFamily: 'DM Mono, monospace', fontSize: 9,
                    color: activeIndex === i ? accent : 'var(--color-text-tertiary)',
                    letterSpacing: '0.15em', textTransform: 'uppercase',
                    transition: 'color 0.3s',
                  }}>{stage.stage} / {stage.title}</div>
                </button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Bottom spacing */}
      <div style={{ height: 'clamp(60px, 8vh, 100px)' }} />
    </section>
  );
}
