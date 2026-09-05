import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { PROJECTS, SIDE_PROJECTS } from '../../data/content.js';
import { CURSOR_STATES } from '../../hooks/useCursor';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import PdfPreviewModal from '../shared/PdfPreviewModal';

/* ─────────────────────────────────────────
   CHEVRON ICON
───────────────────────────────────────── */
function Chevron({ open }) {
  return (
    <motion.svg
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      <polyline points="6 9 12 15 18 9" />
    </motion.svg>
  );
}

/* ─────────────────────────────────────────
   PROJECT CARD  (expandable)
───────────────────────────────────────── */
function ProjectCard({ project, index }) {
  const [open, setOpen] = useState(false);
  const rawLink = project.link && typeof project.link === 'string' ? project.link.trim() : '';
  const hasLiveLink = Boolean(rawLink);
  const formattedLink = hasLiveLink
    ? (rawLink.startsWith('http') ? rawLink : `https://${rawLink}`)
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      style={{
        borderRadius: 20,
        overflow: 'hidden',
        border: `1px solid ${open ? `${project.accentColor}44` : 'rgba(255,255,255,0.07)'}`,
        background: open ? `rgba(255,255,255,0.035)` : 'rgba(255,255,255,0.02)',
        transition: 'border-color 300ms ease, background 300ms ease',
      }}
    >
      {/* Accent top bar */}
      <div style={{
        height: 3,
        background: `linear-gradient(90deg, ${project.accentColor}, ${project.accentColor}33, transparent)`,
      }} />

      {/* Header row — always visible, clickable */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(p => !p)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(p => !p);
          }
        }}
        style={{
          width: '100%',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 'clamp(18px, 2.5vh, 28px) clamp(20px, 3vw, 36px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          textAlign: 'left',
          boxSizing: 'border-box',
        }}
      >
        {/* Left: category badge + title + year */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 'clamp(8px, 0.9vw, 10px)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: project.accentColor,
              background: `${project.accentColor}18`,
              border: `1px solid ${project.accentColor}44`,
              padding: '3px 10px',
              borderRadius: 4,
            }}>
              {project.category}
            </span>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9,
              letterSpacing: '0.14em',
              color: 'rgba(200,210,185,0.3)',
            }}>
              {project.year}
            </span>
          </div>
          <h3 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(18px, 2.5vw, 28px)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            margin: 0,
            color: open ? '#fff' : 'var(--color-text-primary)',
            transition: 'color 250ms ease',
          }}>
            {project.title}
          </h3>
        </div>

        {/* Right: live button (if link provided) + metric + chevron */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 1.8vw, 20px)', flexShrink: 0 }}>
          {hasLiveLink && (
            <motion.a
              href={formattedLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              whileHover={{ scale: 1.05, filter: 'brightness(1.15)' }}
              whileTap={{ scale: 0.95 }}
              title="Open live project in new tab"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 13px',
                borderRadius: 8,
                background: `${project.accentColor || '#C8F23E'}18`,
                border: `1px solid ${project.accentColor || '#C8F23E'}55`,
                color: project.accentColor || '#C8F23E',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textDecoration: 'none',
                cursor: 'pointer',
                boxShadow: `0 0 12px ${project.accentColor || '#C8F23E'}22`,
                transition: 'all 200ms ease',
              }}
            >
              <span style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: project.accentColor || '#C8F23E',
                boxShadow: `0 0 8px ${project.accentColor || '#C8F23E'}`,
                display: 'inline-block',
              }} />
              LIVE ↗
            </motion.a>
          )}

          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(20px, 2.5vw, 30px)',
              fontWeight: 800,
              color: project.accentColor,
              letterSpacing: '-0.03em',
              lineHeight: 1,
            }}>
              {project.metric.value}
            </div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 8,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(200,210,185,0.35)',
              marginTop: 2,
            }}>
              {project.metric.label}
            </div>
          </div>
          <div style={{ color: open ? project.accentColor : 'rgba(200,210,185,0.35)', transition: 'color 250ms ease' }}>
            <Chevron open={open} />
          </div>
        </div>
      </div>

      {/* Expandable detail */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              padding: '0 clamp(20px, 3vw, 36px) clamp(20px, 3vh, 32px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(14px, 2vh, 20px)',
            }}>
              {/* Divider */}
              <div style={{ height: 1, background: `linear-gradient(90deg, ${project.accentColor}33, transparent)` }} />

              {/* Description */}
              <p style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(13px, 1.3vw, 15px)',
                lineHeight: 1.75,
                color: 'rgba(200,210,185,0.7)',
                margin: 0,
              }}>
                {project.description}
              </p>

              {/* Tags & Live action */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {project.tags.map(tag => (
                    <span key={tag} style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 8,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'rgba(200,210,185,0.45)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      padding: '4px 10px',
                      borderRadius: 5,
                      background: 'rgba(255,255,255,0.03)',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {hasLiveLink && (
                  <motion.a
                    href={formattedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    whileHover={{ scale: 1.04, boxShadow: `0 0 20px ${project.accentColor || '#C8F23E'}55` }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      background: project.accentColor || '#C8F23E',
                      color: '#07070A',
                      borderRadius: 10,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: 'clamp(12px, 1.2vw, 13px)',
                      fontWeight: 700,
                      padding: '10px 18px',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      boxShadow: `0 4px 14px ${project.accentColor || '#C8F23E'}33`,
                    }}
                  >
                    <span style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      backgroundColor: '#07070A',
                    }} />
                    Live Project
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </motion.a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   CASE STUDY CARD  (expandable)
───────────────────────────────────────── */
function CaseStudyCard({ project, index, onProjectOpen, setCursor, resetCursor, onOpenPdfPreview }) {
  const [open, setOpen] = useState(false);
  const rawLink = project.link && typeof project.link === 'string' ? project.link.trim() : '';
  const hasLiveLink = Boolean(rawLink);
  const formattedLink = hasLiveLink
    ? (rawLink.startsWith('http') ? rawLink : `https://${rawLink}`)
    : '';
  const hasPdf = Boolean(project.pdfUrl && typeof project.pdfUrl === 'string');

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      style={{
        borderRadius: 20,
        overflow: 'hidden',
        border: `1px solid ${open ? `${project.accentColor}44` : 'rgba(255,255,255,0.07)'}`,
        background: open ? 'rgba(255,255,255,0.035)' : 'rgba(255,255,255,0.02)',
        transition: 'border-color 300ms ease, background 300ms ease',
      }}
    >
      {/* Accent top bar */}
      <div style={{
        height: 3,
        background: `linear-gradient(90deg, ${project.accentColor}, ${project.accentColor}33, transparent)`,
      }} />

      {/* Header — click to expand */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(p => !p)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(p => !p);
          }
        }}
        style={{
          width: '100%',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 'clamp(20px, 3vh, 32px) clamp(20px, 3vw, 36px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          textAlign: 'left',
          boxSizing: 'border-box',
        }}
      >
        {/* Left: index + title + badges */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
            <span style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(28px, 4vw, 52px)',
              fontWeight: 800,
              color: 'transparent',
              WebkitTextStroke: `1px ${project.accentColor}44`,
              letterSpacing: '-0.04em',
              lineHeight: 1,
              userSelect: 'none',
              flexShrink: 0,
            }}>
              {project.index}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 'clamp(8px, 0.9vw, 10px)',
                  letterSpacing: '0.16em',
                  color: project.accentColor,
                  background: `${project.accentColor}18`,
                  border: `1px solid ${project.accentColor}40`,
                  padding: '3px 10px',
                  borderRadius: 4,
                  textTransform: 'uppercase',
                }}>
                  {project.company}
                </span>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 9,
                  letterSpacing: '0.14em',
                  color: 'rgba(200,210,185,0.3)',
                }}>
                  {project.year}
                </span>
                {project.isInteractive && (
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 8,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: '#C8F23E',
                    border: '1px solid rgba(200,242,62,0.35)',
                    background: 'rgba(200,242,62,0.08)',
                    padding: '3px 8px',
                    borderRadius: 4,
                  }}>
                    ◎ INTERACTIVE
                  </span>
                )}
                {hasLiveLink && (
                  <motion.a
                    href={formattedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 8,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: project.accentColor,
                      border: `1px solid ${project.accentColor}55`,
                      background: `${project.accentColor}18`,
                      padding: '3px 8px',
                      borderRadius: 4,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontWeight: 700,
                    }}
                  >
                    <span style={{
                      width: 5,
                      height: 5,
                      borderRadius: '50%',
                      backgroundColor: project.accentColor,
                      boxShadow: `0 0 6px ${project.accentColor}`,
                      display: 'inline-block',
                    }} />
                    LIVE ↗
                  </motion.a>
                )}
                {hasPdf && (
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 8,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#FF6B6B',
                    border: '1px solid rgba(255, 107, 107, 0.4)',
                    background: 'rgba(255, 107, 107, 0.12)',
                    padding: '3px 8px',
                    borderRadius: 4,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    fontWeight: 700,
                  }}>
                    <span style={{
                      width: 5,
                      height: 5,
                      borderRadius: '50%',
                      backgroundColor: '#FF6B6B',
                      display: 'inline-block',
                    }} />
                    PDF
                  </span>
                )}
              </div>
              <h3 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(18px, 2.8vw, 36px)',
                fontWeight: 800,
                letterSpacing: '-0.025em',
                lineHeight: 1.1,
                margin: 0,
                color: open ? '#fff' : 'var(--color-text-primary)',
                transition: 'color 250ms ease',
              }}>
                {project.title}
              </h3>
              <p style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(11px, 1vw, 13px)',
                color: 'rgba(200,210,185,0.45)',
                margin: 0,
                letterSpacing: '0.01em',
              }}>
                {project.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Right: chevron */}
        <div style={{ color: open ? project.accentColor : 'rgba(200,210,185,0.3)', transition: 'color 250ms ease', flexShrink: 0 }}>
          <Chevron open={open} />
        </div>
      </div>

      {/* Expandable body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              padding: '0 clamp(20px, 3vw, 36px) clamp(24px, 4vh, 40px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(16px, 2.5vh, 24px)',
            }}>
              {/* Divider */}
              <div style={{ height: 1, background: `linear-gradient(90deg, ${project.accentColor}44, transparent)` }} />

              {/* Impact metrics */}
              <div>
                <p style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 9,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'rgba(200,210,185,0.35)',
                  margin: '0 0 12px',
                }}>
                  IMPACT METRICS
                </p>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                  gap: 12,
                }}>
                  {project.impact.map((m, i) => (
                    <div key={i} style={{
                      background: `${project.accentColor}0d`,
                      border: `1px solid ${project.accentColor}22`,
                      borderRadius: 12,
                      padding: '12px 16px',
                    }}>
                      <div style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 'clamp(18px, 2.2vw, 28px)',
                        fontWeight: 800,
                        color: project.accentColor,
                        letterSpacing: '-0.02em',
                        lineHeight: 1,
                        marginBottom: 4,
                      }}>
                        {m.value}
                      </div>
                      <div style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 8,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'rgba(200,210,185,0.5)',
                        lineHeight: 1.4,
                      }}>
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Problem & Solution */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                {[
                  { label: 'PROBLEM', text: project.problem },
                  { label: 'SOLUTION', text: project.solution },
                ].map(({ label, text }) => (
                  text && !text.includes('[CONTENT NEEDED') ? (
                    <div key={label} style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 12,
                      padding: '16px 18px',
                    }}>
                      <p style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 8,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: project.accentColor,
                        margin: '0 0 8px',
                      }}>
                        {label}
                      </p>
                      <p style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 'clamp(12px, 1.2vw, 14px)',
                        lineHeight: 1.7,
                        color: 'rgba(200,210,185,0.65)',
                        margin: 0,
                      }}>
                        {text}
                      </p>
                    </div>
                  ) : null
                ))}
              </div>

              {/* Tags + Deep Dive CTA */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {project.tags.map(tag => (
                    <span key={tag} style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 8,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'rgba(200,210,185,0.4)',
                      border: '1px solid rgba(255,255,255,0.09)',
                      padding: '4px 10px',
                      borderRadius: 5,
                      background: 'rgba(255,255,255,0.03)',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  {hasPdf && (
                    <>
                      {/* Preview PDF */}
                      <motion.button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenPdfPreview?.({
                            url: project.pdfUrl,
                            title: project.title,
                            fileName: project.pdfFileName,
                            fileSize: project.pdfFileSize,
                            accentColor: project.accentColor,
                          });
                        }}
                        whileHover={{ scale: 1.04, borderColor: 'rgba(255, 255, 255, 0.3)' }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 7,
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: 10,
                          color: '#EEEEEE',
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontSize: 'clamp(12px, 1.2vw, 13px)',
                          fontWeight: 600,
                          padding: '10px 16px',
                          cursor: 'pointer',
                          flexShrink: 0,
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        Preview PDF
                      </motion.button>

                      {/* Download PDF */}
                      <motion.a
                        href={project.pdfUrl}
                        download={project.pdfFileName || `${project.title}_Case_Study.pdf`}
                        onClick={(e) => e.stopPropagation()}
                        whileHover={{ scale: 1.04, boxShadow: '0 0 16px rgba(255, 107, 107, 0.35)' }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 7,
                          background: 'rgba(255, 107, 107, 0.12)',
                          border: '1px solid rgba(255, 107, 107, 0.35)',
                          borderRadius: 10,
                          color: '#FF6B6B',
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontSize: 'clamp(12px, 1.2vw, 14px)',
                          fontWeight: 700,
                          padding: '10px 16px',
                          textDecoration: 'none',
                          cursor: 'pointer',
                          flexShrink: 0,
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Download PDF
                      </motion.a>
                    </>
                  )}

                  {hasLiveLink && (
                    <motion.a
                      href={formattedLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      whileHover={{ scale: 1.04, boxShadow: `0 0 20px ${project.accentColor}55` }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        background: `${project.accentColor}18`,
                        border: `1px solid ${project.accentColor}60`,
                        borderRadius: 10,
                        color: project.accentColor,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 'clamp(12px, 1.2vw, 14px)',
                        fontWeight: 700,
                        padding: '10px 18px',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    >
                      <span style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        backgroundColor: project.accentColor,
                        boxShadow: `0 0 8px ${project.accentColor}`,
                      }} />
                      Live Project
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </motion.a>
                  )}

                  <motion.button
                    onClick={(e) => { e.stopPropagation(); onProjectOpen(project); }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      background: project.accentColor,
                      border: 'none',
                      borderRadius: 10,
                      color: '#0a0a0f',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: 'clamp(12px, 1.2vw, 14px)',
                      fontWeight: 700,
                      padding: '10px 20px',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    Deep Dive
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────── */
export default function Work({ onProjectOpen, setCursor, resetCursor }) {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-8%' });
  const { data } = usePortfolioData();
  const [previewPdf, setPreviewPdf] = useState(null);
  const sideProjects = Array.isArray(data?.projects) && data.projects.length > 0
    ? data.projects
    : SIDE_PROJECTS;
  const caseStudies = Array.isArray(data?.caseStudies) && data.caseStudies.length > 0
    ? data.caseStudies
    : PROJECTS;

  return (
    <section
      id="work"
      ref={sectionRef}
      data-inspect="WORK: Projects + Case Studies"
      style={{ background: 'var(--color-void)', position: 'relative' }}
    >
      {/* Top border */}
      <div style={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, var(--color-border) 20%, var(--color-border-bright) 50%, var(--color-border) 80%, transparent)',
      }} />

      {/* Ambient orb */}
      <div style={{
        position: 'absolute', top: 0, right: '20%',
        width: '50%', height: '30%',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(201,169,110,0.05) 0%, transparent 70%)',
        pointerEvents: 'none', filter: 'blur(40px)',
      }} aria-hidden="true" />

      {/* ── Section header ── */}
      <div style={{ padding: 'clamp(40px, 6vh, 80px) clamp(20px, 6vw, 96px) clamp(24px, 3.5vh, 40px)' }}>
        <motion.span
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.6 }}
          style={{ display: 'block', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(200,210,185,0.35)', marginBottom: 14 }}
        >
          03 / WORK & CASE STUDIES
        </motion.span>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(36px, 6vw, 80px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 0.95, color: 'var(--color-text-primary)', margin: 0 }}
          >
            WHAT I&apos;VE<br />
            <span style={{ color: 'transparent', WebkitTextStroke: '1px rgba(200,210,185,0.2)' }}>BUILT</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2, duration: 0.6 }}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(13px, 1.2vw, 15px)', color: 'rgba(200,210,185,0.45)', maxWidth: 360, lineHeight: 1.7, margin: 0, textAlign: 'right' }}
          >
            A mix of shipped products and deep-dive analyses into the thinking behind them.
          </motion.p>
        </div>

        {/* Quick jump pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25, duration: 0.5 }}
          style={{ display: 'flex', gap: 10, marginTop: 24, flexWrap: 'wrap' }}
        >
          <a
            href="#projects"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-text-primary)',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8,
              padding: '6px 14px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>💼</span> 03-A / Shipped Projects ({sideProjects.length})
          </a>
          <a
            href="#case-studies"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#C8F23E',
              background: 'rgba(200,242,62,0.08)',
              border: '1px solid rgba(200,242,62,0.28)',
              borderRadius: 8,
              padding: '6px 14px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontWeight: 700,
            }}
          >
            <span>📖</span> 03-B / Deep Dive Case Studies ({caseStudies.length})
          </a>
        </motion.div>
      </div>

      {/* ══ PROJECTS ══ */}
      <div id="projects" style={{ padding: '0 clamp(20px, 6vw, 96px) clamp(40px, 6vh, 64px)' }}>
        <motion.div
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.25 }}
          style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 'clamp(16px, 2.5vh, 28px)' }}
        >
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(200,210,185,0.35)' }}>
            03-A / PROJECTS
          </span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(255,255,255,0.07), transparent)' }} />
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: 'rgba(200,210,185,0.25)', fontStyle: 'italic' }}>
            {sideProjects.length} shipped
          </span>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.5vh, 14px)' }}>
          {sideProjects.map((project, index) => (
            <ProjectCard key={project.id || index} project={project} index={index} />
          ))}
        </div>
      </div>

      {/* ══ CASE STUDIES ══ */}
      <div id="case-studies" style={{ padding: '0 clamp(20px, 6vw, 96px) clamp(48px, 7vh, 80px)' }}>
        <motion.div
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.1 }}
          style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 'clamp(16px, 2.5vh, 28px)' }}
        >
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#C8F23E' }}>
            03-B / CASE STUDIES
          </span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(200,242,62,0.2), transparent)' }} />
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: 'rgba(200,242,62,0.6)', fontStyle: 'italic', fontWeight: 600 }}>
            {caseStudies.length} deep dives
          </span>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.5vh, 14px)' }}>
          {caseStudies.map((project, index) => (
            <CaseStudyCard
              key={project.id || index}
              project={project}
              index={index}
              onProjectOpen={onProjectOpen}
              setCursor={setCursor}
              resetCursor={resetCursor}
              onOpenPdfPreview={setPreviewPdf}
            />
          ))}
        </div>

        {/* Bottom hint */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 'clamp(20px, 3vh, 36px)', justifyContent: 'center' }}
        >
          <div style={{ width: 24, height: 1, background: 'var(--color-accent)', opacity: 0.3 }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(200,210,185,0.25)' }}>
            TAP ANY CARD TO EXPAND DETAILS
          </span>
          <div style={{ width: 24, height: 1, background: 'var(--color-accent)', opacity: 0.3 }} />
        </motion.div>
      </div>

      <PdfPreviewModal
        isOpen={Boolean(previewPdf)}
        onClose={() => setPreviewPdf(null)}
        pdfUrl={previewPdf?.url}
        fileName={previewPdf?.fileName}
        title={previewPdf?.title}
        fileSize={previewPdf?.fileSize}
        accentColor={previewPdf?.accentColor}
      />
    </section>
  );
}
