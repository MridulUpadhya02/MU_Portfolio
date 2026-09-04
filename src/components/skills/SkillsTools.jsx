import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CURSOR_STATES } from '../../hooks/useCursor';
import { usePortfolioData } from '../../context/PortfolioDataContext';

const PM_SKILLS = [
  { label: 'Product Discovery', level: 95 },
  { label: 'Roadmap Planning', level: 90 },
  { label: 'Stakeholder Management', level: 88 },
  { label: 'User Research & UAT', level: 92 },
  { label: 'PRD & Spec Writing', level: 87 },
  { label: 'Data-Driven Decisions', level: 85 },
  { label: 'Agile / Scrum', level: 90 },
  { label: 'Prioritisation Frameworks', level: 88 },
];

const TOOLS = [
  { name: 'Jira', category: 'PM', icon: '🟦' },
  { name: 'Confluence', category: 'Docs', icon: '📄' },
  { name: 'Figma', category: 'Design', icon: '🎨' },
  { name: 'Mixpanel', category: 'Analytics', icon: '📊' },
  { name: 'Miro', category: 'Collab', icon: '🗂️' },
  { name: 'SQL', category: 'Data', icon: '🗄️' },
  { name: 'Notion', category: 'Docs', icon: '📝' },
  { name: 'Looker', category: 'Analytics', icon: '🔭' },
  { name: 'Slack', category: 'Comms', icon: '💬' },
  { name: 'Linear', category: 'PM', icon: '⚡' },
  { name: 'Hotjar', category: 'Research', icon: '🎯' },
  { name: 'Amplitude', category: 'Analytics', icon: '📈' },
];

function SkillBar({ skill, index, inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: 0.05 * index, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ marginBottom: '20px' }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
      }}>
        <span style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--color-text-primary)',
          letterSpacing: '0.01em',
        }}>
          {skill.label}
        </span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '10px',
          color: 'var(--color-accent)',
          letterSpacing: '0.1em',
        }}>
          {skill.level}%
        </span>
      </div>
      <div style={{
        height: '3px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '3px',
        overflow: 'hidden',
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.level}%` } : {}}
          transition={{ delay: 0.1 + 0.05 * index, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: '100%',
            borderRadius: '3px',
            background: 'linear-gradient(90deg, var(--color-accent-soft), var(--color-accent))',
            boxShadow: '0 0 8px rgba(200,242,62,0.3)',
          }}
        />
      </div>
    </motion.div>
  );
}

function ToolChip({ tool, index, inView, setCursor, resetCursor }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay: 0.04 * index, duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
      onMouseEnter={() => setCursor?.(CURSOR_STATES.HOVER)}
      onMouseLeave={() => resetCursor?.()}
      whileHover={{
        borderColor: 'rgba(200,242,62,0.3)',
        background: 'rgba(200,242,62,0.04)',
        y: -2,
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 16px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'border-color 200ms, background 200ms',
      }}
    >
      <span style={{ fontSize: '16px' }}>{tool.icon}</span>
      <div>
        <div style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--color-text-primary)',
        }}>
          {tool.name}
        </div>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '9px',
          letterSpacing: '0.12em',
          color: 'var(--color-text-tertiary)',
          textTransform: 'uppercase',
        }}>
          {tool.category}
        </div>
      </div>
    </motion.div>
  );
}

export default function SkillsTools({ setCursor, resetCursor }) {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-8%' });
  const { data } = usePortfolioData();
  const skills = data?.skills || PM_SKILLS;
  const tools = data?.tools || TOOLS;

  return (
    <section
      id="skills"
      ref={sectionRef}
      data-inspect="SKILLS: PM competencies + tool stack"
      style={{
        background: '#0A0A0E',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: 'clamp(56px, 9vh, 140px) clamp(16px, 4.5vw, 96px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient blue glow — top right */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-15%',
          width: '55%',
          height: '80%',
          background: 'radial-gradient(ellipse at center, rgba(90,138,255,0.05) 0%, transparent 65%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      {/* Section header */}
      <div style={{ marginBottom: 'clamp(40px, 6vh, 80px)' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="section-label"
          style={{ marginBottom: '16px' }}
        >
          08 / SKILLS & TOOLS
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
          What I{' '}
          <span className="electric-shimmer">Bring</span>
        </motion.h2>
      </div>

      {/* Two-column layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
        gap: 'clamp(32px, 5vw, 80px)',
      }}>
        {/* Left: Skill bars */}
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.1 }}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              letterSpacing: '0.2em',
              color: 'var(--color-accent)',
              textTransform: 'uppercase',
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div style={{ width: '16px', height: '1px', background: 'var(--color-accent)' }} />
            PM Competencies
          </motion.div>

          {skills.map((skill, i) => (
            <SkillBar key={skill.label} skill={skill} index={i} inView={inView} />
          ))}
        </div>

        {/* Right: Tool chips */}
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              letterSpacing: '0.2em',
              color: 'var(--color-accent)',
              textTransform: 'uppercase',
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div style={{ width: '16px', height: '1px', background: 'var(--color-accent)' }} />
            Tools I Use
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '10px',
          }}>
            {tools.map((tool, i) => (
              <ToolChip
                key={`${tool.name}-${i}`}
                tool={tool}
                index={i}
                inView={inView}
                setCursor={setCursor}
                resetCursor={resetCursor}
              />
            ))}
          </div>

          {/* Philosophy card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.6 }}
            style={{
              marginTop: '28px',
              padding: '20px 24px',
              background: 'rgba(200,242,62,0.04)',
              border: '1px solid rgba(200,242,62,0.12)',
              borderRadius: '14px',
              borderLeft: '3px solid var(--color-accent)',
            }}
          >
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '8px',
              letterSpacing: '0.22em',
              color: 'var(--color-accent)',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}>
              ◈ Philosophy
            </div>
            <p style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '13px',
              lineHeight: 1.75,
              color: 'var(--color-text-secondary)',
              margin: 0,
              fontStyle: 'italic',
            }}>
              "Tools are means, not ends. The best PMs use whatever gets clarity fastest — a napkin sketch or a 50-row spreadsheet."
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
