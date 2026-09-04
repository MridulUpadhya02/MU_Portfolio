import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CURSOR_STATES } from '../../hooks/useCursor';
import { usePortfolioData } from '../../context/PortfolioDataContext';

const STEPS = [
  {
    num: '01',
    title: 'Discover',
    icon: '🔍',
    color: 'rgba(90,138,255,0.12)',
    border: 'rgba(90,138,255,0.2)',
    glow: 'rgba(90,138,255,0.15)',
    description:
      'Deep user research, stakeholder interviews, and data mining to surface the real problem — not the symptom.',
    tags: ['User Interviews', 'Data Analysis', 'Market Research'],
  },
  {
    num: '02',
    title: 'Define',
    icon: '🎯',
    color: 'rgba(200,242,62,0.08)',
    border: 'rgba(200,242,62,0.2)',
    glow: 'rgba(200,242,62,0.12)',
    description:
      'Translate messy insights into crisp problem statements, success metrics, and a ruthlessly prioritised backlog.',
    tags: ['PRD', 'OKRs', 'Prioritisation'],
  },
  {
    num: '03',
    title: 'Build',
    icon: '⚡',
    color: 'rgba(255,138,101,0.08)',
    border: 'rgba(255,138,101,0.2)',
    glow: 'rgba(255,138,101,0.12)',
    description:
      'Ship in small, validated slices. Work alongside engineering to unblock fast and keep quality bar high.',
    tags: ['Sprints', 'UAT', 'Stakeholders'],
  },
  {
    num: '04',
    title: 'Learn',
    icon: '📈',
    color: 'rgba(74,222,128,0.08)',
    border: 'rgba(74,222,128,0.2)',
    glow: 'rgba(74,222,128,0.12)',
    description:
      'Measure against the metrics that matter. Double down on what works, iterate fast on what doesn\'t.',
    tags: ['Analytics', 'A/B Tests', 'Retros'],
  },
];

function StepCard({ step, index, setCursor, resetCursor }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setCursor?.(CURSOR_STATES.HOVER)}
      onMouseLeave={() => resetCursor?.()}
      className="process-step"
      style={{
        position: 'relative',
        background: '#0F0F13',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '16px',
        padding: 'clamp(20px, 2.5vw, 36px)',
        flex: '1 1 min(100%, 240px)',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'border-color 300ms ease, box-shadow 300ms ease, transform 300ms ease',
      }}
      whileHover={{
        borderColor: step.border,
        boxShadow: `0 0 40px ${step.glow}`,
        y: -4,
      }}
    >
      {/* Gradient top bar */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '2px',
        background: `linear-gradient(90deg, transparent, ${step.border}, transparent)`,
        opacity: 0,
        transition: 'opacity 300ms',
      }} />

      {/* Number + Icon */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '11px',
          letterSpacing: '0.2em',
          color: 'var(--color-text-tertiary)',
        }}>
          {step.num}
        </span>
        <motion.div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: step.color,
            border: `1px solid ${step.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
          }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.25 }}
        >
          {step.icon}
        </motion.div>
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 'clamp(20px, 2.2vw, 26px)',
        fontWeight: 700,
        color: 'var(--color-text-primary)',
        lineHeight: 1.1,
        letterSpacing: '-0.02em',
        margin: 0,
      }}>
        {step.title}
      </h3>

      {/* Description */}
      <p style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 'clamp(12px, 1.1vw, 14px)',
        lineHeight: 1.75,
        color: 'var(--color-text-secondary)',
        margin: 0,
        flex: 1,
      }}>
        {step.description}
      </p>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: 'auto' }}>
        {step.tags.map(tag => (
          <span
            key={tag}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '9px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-text-tertiary)',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              padding: '3px 8px',
              borderRadius: '6px',
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function Approach({ setCursor, resetCursor }) {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-10%' });
  const { data } = usePortfolioData();
  const steps = data?.approach || STEPS;

  return (
    <section
      id="approach"
      ref={sectionRef}
      data-inspect="APPROACH: 4-stage PM process system"
      style={{
        background: 'var(--color-void)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: 'clamp(56px, 9vh, 140px) clamp(16px, 4.5vw, 96px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient green glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '-30%',
          right: '-10%',
          width: '50%',
          height: '80%',
          background: 'radial-gradient(ellipse at center, rgba(200,242,62,0.04) 0%, transparent 65%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <div style={{ maxWidth: '600px', marginBottom: 'clamp(48px, 7vh, 80px)' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="section-label"
          style={{ marginBottom: '16px' }}
        >
          07 / HOW I WORK
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(36px, 5vw, 68px)',
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            color: 'var(--color-text-primary)',
            margin: '0 0 20px',
          }}
        >
          My PM{' '}
          <span style={{ color: 'var(--color-accent)' }}>Approach</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(13px, 1.3vw, 16px)',
            lineHeight: 1.75,
            color: 'var(--color-text-secondary)',
            margin: 0,
          }}
        >
          Every product decision follows a structured loop — curiosity in, clarity out.
        </motion.p>
      </div>

      {/* Steps grid */}
      <div style={{
        display: 'flex',
        gap: 'clamp(12px, 1.8vw, 20px)',
        flexWrap: 'wrap',
      }}>
        {steps.map((step, i) => (
          <StepCard
            key={step.num || i}
            step={step}
            index={i}
            setCursor={setCursor}
            resetCursor={resetCursor}
          />
        ))}
      </div>

      {/* Connecting line between steps */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--color-accent-border), transparent)',
          marginTop: '32px',
          transformOrigin: 'left',
        }}
      />
    </section>
  );
}
