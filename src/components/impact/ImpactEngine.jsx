import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { usePortfolioData } from '../../context/PortfolioDataContext';

/* ─── DATA ─────────────────────────────────────────────────────────────────── */
const METRICS = [
  { value: '196+', label: 'Regression Cases',   description: 'Managed across all projects post-launch' },
  { value: '40+',  label: 'Users Interviewed',  description: 'Deep discovery sessions with QA leads, PMs & testers' },
  { value: '30%',  label: 'TAT Improvement',    description: 'Reduction in time-to-assign after RFR detection' },
  { value: '0%',   label: 'Mis-assignments',    description: 'Assignment to unavailable testers after ARAS launch' },
];

const BEFORE_BARS = [
  { label: 'Avg Assign Time', valuePct: 90, rawLabel: '45 min' },
  { label: 'Error Rate',      valuePct: 46, rawLabel: '23%' },
  { label: 'Escalations',     valuePct: 65, rawLabel: 'High' },
  { label: 'Tester Overload', valuePct: 78, rawLabel: '78%' },
];

const AFTER_BARS = [
  { label: 'Avg Assign Time', valuePct: 16, rawLabel: '8 min' },
  { label: 'Error Rate',      valuePct: 0,  rawLabel: '0%' },
  { label: 'Escalations',     valuePct: 5,  rawLabel: 'None' },
  { label: 'Tester Overload', valuePct: 12, rawLabel: '12%' },
];

/* ─── COUNTER ANIMATION ─────────────────────────────────────────────────────── */
function AnimatedCounter({ target, inView }) {
  const ref = useRef(null);
  const numStr = target.replace(/[^0-9.]/g, '');
  const suffix = target.replace(/[0-9.]/g, '');
  const num = parseFloat(numStr) || 0;

  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, num, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(v) {
        if (ref.current) {
          ref.current.textContent =
            (Number.isInteger(num) ? Math.floor(v) : v.toFixed(1)) + suffix;
        }
      },
    });
    return () => controls.stop();
  }, [inView, num, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

/* ─── BAR CHART ─────────────────────────────────────────────────────────────── */
function BarChart({ bars, color, label, sliderFraction, side }) {
  const opacity = Math.min(1, sliderFraction * 2.5);

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: '0 clamp(16px, 3.5vw, 48px)',
      opacity,
      transition: 'opacity 0.06s',
    }}>
      <div style={{
        fontFamily: 'DM Mono, monospace',
        fontSize: 9,
        color,
        letterSpacing: '0.2em',
        marginBottom: 'clamp(14px, 2vh, 28px)',
        textTransform: 'uppercase',
        paddingTop: 'clamp(14px, 2vh, 28px)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <span style={{ opacity: 0.6 }}>●</span>
        {label}
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 'clamp(12px, 1.8vh, 22px)',
      }}>
        {bars.map((bar) => (
          <div key={bar.label}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 8,
              alignItems: 'baseline',
            }}>
              <span style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(11px, 1.2vw, 12px)',
                color: 'var(--color-text-secondary)',
                letterSpacing: '0.01em',
              }}>
                {bar.label}
              </span>
              <span style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: 'clamp(10px, 1.1vw, 11px)',
                color,
                letterSpacing: '0.08em',
              }}>
                {bar.rawLabel}
              </span>
            </div>
            <div style={{
              height: 4,
              background: 'rgba(255,255,255,0.04)',
              borderRadius: 2,
              overflow: 'hidden',
            }}>
              <motion.div
                animate={{ width: `${bar.valuePct * sliderFraction}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                style={{
                  height: '100%',
                  background: `linear-gradient(90deg, ${color}88, ${color})`,
                  borderRadius: 2,
                  boxShadow: bar.valuePct > 0 ? `0 0 10px ${color}44` : 'none',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginBottom: 'clamp(14px, 2vh, 28px)',
        paddingTop: 12,
        borderTop: `1px solid ${color}22`,
      }}>
        <div style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: 8,
          color: `${color}66`,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
        }}>
          {side === 'before' ? 'BEFORE ARAS' : 'AFTER ARAS'}
        </div>
      </div>
    </div>
  );
}

/* ─── METRIC CARD ────────────────────────────────────────────────────────────── */
function MetricCard({ metric, inView, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.1 * index + 0.25, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: 'rgba(8, 8, 14, 0.9)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: 2,
        padding: 'clamp(24px, 3.5vw, 36px) clamp(20px, 3vw, 28px)',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      whileHover={{
        borderColor: 'rgba(200,242,62,0.15)',
        y: -4,
        transition: { duration: 0.28 },
      }}
    >
      {/* Top gradient accent */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(200,242,62,0.4), transparent)',
      }} />

      {/* Value */}
      <div style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 'clamp(34px, 4.2vw, 52px)',
        color: '#C8F23E',
        lineHeight: 1,
        marginBottom: 14,
        fontWeight: 800,
        letterSpacing: '-0.03em',
      }}>
        <AnimatedCounter target={metric.value} inView={inView} />
      </div>

      {/* Label */}
      <div style={{
        fontFamily: 'DM Mono, monospace',
        fontSize: 9,
        color: 'var(--color-text-primary)',
        letterSpacing: '0.14em',
        marginBottom: 10,
        textTransform: 'uppercase',
        opacity: 0.7,
      }}>
        {metric.label}
      </div>

      {/* Description */}
      <div style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 12,
        color: 'var(--color-text-tertiary)',
        lineHeight: 1.7,
        fontWeight: 300,
      }}>
        {metric.description}
      </div>
    </motion.div>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────────────────────── */
export default function ImpactEngine() {
  const sectionRef = useRef(null);
  const sliderRef = useRef(null);
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const [sliderPos, setSliderPos] = useState(50);
  const inView = useInView(sectionRef, { once: true, margin: '-10% 0px' });
  const metricsInView = useInView(sectionRef, { once: true, margin: '-30% 0px' });
  const { data } = usePortfolioData();
  const impactMetrics = data?.impactEngine?.metrics || METRICS;

  const updateSlider = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100));
    setSliderPos(pct);
  }, []);

  const handleMouseDown = (e) => {
    e.preventDefault();
    isDragging.current = true;
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging.current) return;
    updateSlider(e.clientX);
  }, [updateSlider]);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (e.touches[0]) updateSlider(e.touches[0].clientX);
  }, [updateSlider]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const beforeFraction = Math.max(0, Math.min(1, (100 - sliderPos) / 50));
  const afterFraction  = Math.max(0, Math.min(1, sliderPos / 50));

  return (
    <section
      id="impact"
      ref={sectionRef}
      data-inspect="IMPACT: Visual before/after comparison with live data"
      style={{
        background: 'var(--color-void)',
        paddingTop: 'clamp(80px, 12vh, 140px)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '20%',
        width: '60%',
        height: '50%',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(74,140,106,0.04) 0%, transparent 60%)',
        pointerEvents: 'none',
        filter: 'blur(50px)',
      }} aria-hidden="true" />

      {/* Section header */}
      <div style={{
        padding: '0 clamp(16px, 4.5vw, 96px)',
        marginBottom: 'clamp(40px, 6vh, 88px)',
      }}>
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: 9,
            color: 'var(--color-text-tertiary)',
            letterSpacing: '0.24em',
            marginBottom: 20,
            textTransform: 'uppercase',
          }}
        >
          04 / IMPACT
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(38px, 5.5vw, 72px)',
            color: 'var(--color-text-primary)',
            lineHeight: 1.0,
            marginBottom: 18,
            fontWeight: 800,
            letterSpacing: '-0.03em',
          }}
        >
          THE IMPACT
          <br />
          <span style={{ color: '#C8F23E' }}>ENGINE</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25, duration: 0.6 }}
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(13px, 1.3vw, 16px)',
            color: 'var(--color-text-secondary)',
            maxWidth: 480,
            lineHeight: 1.75,
            fontWeight: 300,
          }}
        >
          What changes when you solve the right problem.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.42 }}
          style={{
            marginTop: 22,
            fontFamily: 'DM Mono, monospace',
            fontSize: 9,
            color: 'var(--color-text-tertiary)',
            letterSpacing: '0.12em',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span>←</span>
          <span>DRAG TO COMPARE</span>
          <span>→</span>
        </motion.div>
      </div>

      {/* Before/After slider */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0.97 }}
        animate={inView ? { opacity: 1, scaleX: 1 } : {}}
        transition={{ delay: 0.38, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        ref={containerRef}
        style={{
          position: 'relative',
          height: 'clamp(300px, 44vh, 460px)',
          cursor: 'col-resize',
          userSelect: 'none',
          touchAction: 'none',
        }}
        onTouchStart={(e) => {
          if (e.touches[0]) updateSlider(e.touches[0].clientX);
        }}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        {/* BEFORE pane */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(20,8,8,0.95) 0%, rgba(14,6,6,0.98) 100%)',
          borderTop: '1px solid rgba(140,74,74,0.2)',
          borderBottom: '1px solid rgba(24,24,36,0.8)',
        }}>
          <BarChart
            bars={BEFORE_BARS}
            color="#B05555"
            label="Manual Assignment"
            sliderFraction={beforeFraction}
            side="before"
          />
        </div>

        {/* AFTER pane */}
        <div style={{
          position: 'absolute',
          inset: 0,
          clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
          background: 'linear-gradient(135deg, rgba(6,14,10,0.95) 0%, rgba(4,10,7,0.98) 100%)',
          borderTop: '1px solid rgba(74,140,106,0.2)',
          borderBottom: '1px solid rgba(24,24,36,0.8)',
        }}>
          <BarChart
            bars={AFTER_BARS}
            color="#4A8C6A"
            label="ARAS Automated"
            sliderFraction={afterFraction}
            side="after"
          />
        </div>

        {/* Divider line */}
        <div style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${sliderPos}%`,
          width: 1,
          background: 'linear-gradient(180deg, transparent 0%, rgba(200,242,62,0.5) 15%, rgba(200,242,62,0.7) 50%, rgba(200,242,62,0.5) 85%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 2,
        }} />

        {/* Handle disc */}
        <motion.div
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          style={{
            position: 'absolute',
            top: '50%',
            left: `${sliderPos}%`,
            transform: 'translate(-50%, -50%)',
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'rgba(5, 5, 10, 0.95)',
            border: '1px solid rgba(200,242,62,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'col-resize',
            zIndex: 10,
            boxShadow: '0 0 24px rgba(200,242,62,0.18), 0 4px 16px rgba(0,0,0,0.4)',
          }}
        >
          <span style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: 12,
            color: '#C8F23E',
            letterSpacing: '-3px',
            userSelect: 'none',
          }}>
            ⟨⟩
          </span>
        </motion.div>

        {/* Labels */}
        <div style={{
          position: 'absolute',
          top: 14,
          left: 18,
          fontFamily: 'DM Mono, monospace',
          fontSize: 8,
          color: '#B05555',
          letterSpacing: '0.18em',
          opacity: beforeFraction,
          transition: 'opacity 0.2s',
          pointerEvents: 'none',
          zIndex: 3,
          textTransform: 'uppercase',
        }}>
          BEFORE
        </div>
        <div style={{
          position: 'absolute',
          top: 14,
          left: `calc(${sliderPos}% + 18px)`,
          fontFamily: 'DM Mono, monospace',
          fontSize: 8,
          color: '#4A8C6A',
          letterSpacing: '0.18em',
          opacity: afterFraction > 0.1 ? 1 : 0,
          transition: 'opacity 0.2s',
          pointerEvents: 'none',
          zIndex: 3,
          textTransform: 'uppercase',
        }}>
          AFTER
        </div>
      </motion.div>

      {/* Metric cards */}
      <div style={{
        padding: 'clamp(36px, 5.5vh, 88px) clamp(16px, 4.5vw, 96px)',
      }}>
        <div style={{
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(24,24,36,0.8) 20%, rgba(24,24,36,0.8) 80%, transparent)',
          marginBottom: 'clamp(36px, 5vh, 72px)',
        }} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 210px), 1fr))',
          gap: 16,
        }}>
          {impactMetrics.map((m, i) => (
            <MetricCard
              key={m.label || i}
              metric={m}
              inView={metricsInView}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
