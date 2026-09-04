import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { THINK_NODES } from '../../data/content.js';
import { CURSOR_STATES } from '../../hooks/useCursor';
import { usePortfolioData } from '../../context/PortfolioDataContext';

/* ─────────────────────────────────────────
   FRAMEWORK RAIL — left side vertical stages
───────────────────────────────────────── */
const FRAMEWORK_STAGES = [
  'DISCOVER',
  'DEFINE',
  'PRIORITIZE',
  'BUILD',
  'MEASURE',
  'ITERATE',
];

function FrameworkRail({ activeFramework }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 'clamp(20px, 3vw, 48px)',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0px',
        zIndex: 10,
      }}
    >
      {/* Vertical line */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          bottom: 0,
          width: '1px',
          background: 'var(--color-border)',
          transform: 'translateX(-50%)',
        }}
      />
      {FRAMEWORK_STAGES.map((stage) => {
        const isActive = activeFramework === stage;
        return (
          <motion.div
            key={stage}
            animate={{
              opacity: isActive ? 1 : 0.3,
            }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 0',
              position: 'relative',
            }}
          >
            {/* Stage dot */}
            <motion.div
              animate={{
                width: isActive ? 8 : 5,
                height: isActive ? 8 : 5,
                background: isActive ? 'var(--color-accent)' : 'var(--color-border)',
                boxShadow: isActive ? '0 0 12px rgba(200,242,62,0.5)' : 'none',
              }}
              transition={{ duration: 0.3 }}
              style={{
                borderRadius: '50%',
                flexShrink: 0,
                position: 'relative',
                zIndex: 1,
              }}
            />
            {/* Stage label */}
            <motion.span
              animate={{
                color: isActive ? 'var(--color-accent)' : 'var(--color-text-tertiary)',
                x: isActive ? 2 : 0,
              }}
              transition={{ duration: 0.3 }}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '9px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}
            >
              {stage}
            </motion.span>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────
   CONNECTING LINE SVG — drawn from node to center
───────────────────────────────────────── */
function ConstellationLine({ fromPos, toPos, isVisible }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.svg
          key="line"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          <motion.line
            x1={`${fromPos.x}%`}
            y1={`${fromPos.y}%`}
            x2={`${toPos.x}%`}
            y2={`${toPos.y}%`}
            stroke="var(--color-accent)"
            strokeWidth="1"
            strokeDasharray="4 4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.7 }}
            exit={{ pathLength: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
          {/* Pulse dot at node end */}
          <motion.circle
            cx={`${fromPos.x}%`}
            cy={`${fromPos.y}%`}
            r="3"
            fill="var(--color-accent)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0.8] }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
        </motion.svg>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────
   THOUGHT NODE — single interactive node
───────────────────────────────────────── */
// Radial positions as percentages of the container
const NODE_POSITIONS = [
  { x: 22, y: 22 },  // WHY? — top-left
  { x: 74, y: 16 },  // WHO? — top-right
  { x: 18, y: 52 },  // DATA? — mid-left
  { x: 78, y: 45 },  // WHAT? — mid-right
  { x: 26, y: 78 },  // TRADE-OFF? — bottom-left
  { x: 70, y: 80 },  // DECISION? — bottom-right
  { x: 50, y: 88 },  // MEASURE? — bottom-center
];

// Center problem statement position (approx)
const CENTER_POS = { x: 50, y: 48 };

function ThoughtNode({ node, position, index, isActive, onClick, setCursor, resetCursor, inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: '-50%', y: '-50%', scale: 0.7 }}
      animate={inView ? { opacity: 1, x: '-50%', y: '-50%', scale: 1 } : { opacity: 0, x: '-50%', y: '-50%', scale: 0.7 }}
      transition={{
        delay: 0.3 + index * 0.08,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        position: 'absolute',
        left: `${position.x}%`,
        top: `${position.y}%`,
        zIndex: 5,
      }}
    >
      <motion.button
        onClick={onClick}
        onMouseEnter={() => setCursor(CURSOR_STATES.HOVER)}
        onMouseLeave={resetCursor}
        animate={isActive ? {
          scale: 1.1,
          borderColor: 'var(--color-accent)',
          backgroundColor: 'rgba(200,242,62,0.08)',
        } : {
          scale: 1,
          borderColor: 'var(--color-border)',
          backgroundColor: 'transparent',
        }}
        whileHover={{
          scale: 1.08,
          borderColor: 'rgba(200,242,62,0.3)',
          backgroundColor: 'rgba(200,242,62,0.04)',
        }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        style={{
          cursor: 'pointer',
          border: '1px solid',
          borderRadius: '2px',
          padding: '8px 14px',
          background: 'transparent',
          color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 'clamp(9px, 0.9vw, 11px)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        {/* Active indicator dot */}
        <motion.span
          animate={{
            opacity: isActive ? 1 : 0,
            scale: isActive ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
          style={{
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: 'var(--color-accent)',
            display: 'inline-block',
            flexShrink: 0,
          }}
        />
        {node.label}
      </motion.button>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   EXPANDED PANEL — shows node answer
───────────────────────────────────────── */
function NodeAnswerPanel({ node }) {
  return (
    <AnimatePresence mode="wait">
      {node && (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, x: '-50%', y: 14, filter: 'blur(6px)' }}
          animate={{ opacity: 1, x: '-50%', y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, x: '-50%', y: -6, filter: 'blur(6px)' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute',
            bottom: 'clamp(20px, 4vh, 56px)',
            left: '50%',
            width: 'min(92vw, 540px)',
            maxWidth: 'calc(100% - 32px)',
            boxSizing: 'border-box',
            background: 'rgba(6, 6, 10, 0.96)',
            border: '1px solid var(--color-border-bright)',
            borderTop: '1px solid var(--color-accent)',
            padding: 'clamp(16px, 2.5vw, 28px)',
            zIndex: 20,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          {/* Question label */}
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '8px',
              letterSpacing: '0.24em',
              color: 'var(--color-accent)',
              textTransform: 'uppercase',
              marginBottom: '14px',
              opacity: 0.9,
            }}
          >
            {node.question}
          </div>

          {/* Answer */}
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(13px, 1.15vw, 15px)',
              lineHeight: 1.7,
              color: 'var(--color-text-secondary)',
              fontWeight: 300,
              margin: 0,
            }}
          >
            {node.answer}
          </p>

          {/* Stage tag */}
          <div
            style={{
              marginTop: '18px',
              paddingTop: '14px',
              borderTop: '1px solid var(--color-border)',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '8px',
              letterSpacing: '0.22em',
              color: 'var(--color-text-tertiary)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span style={{ opacity: 0.4 }}>STAGE</span>
            <span style={{ color: 'var(--color-border-bright)', opacity: 0.6 }}>→</span>
            <span style={{ color: 'var(--color-accent)', opacity: 0.75 }}>{node.framework}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────
   BACKGROUND CONSTELLATION MESH — decorative
───────────────────────────────────────── */
function ConstellationMesh() {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.06,
        zIndex: 0,
      }}
    >
      {/* faint mesh lines between all nodes */}
      {NODE_POSITIONS.map((a, i) =>
        NODE_POSITIONS.slice(i + 1).map((b, j) => (
          <line
            key={`mesh-${i}-${j}`}
            x1={`${a.x}%`}
            y1={`${a.y}%`}
            x2={`${b.x}%`}
            y2={`${b.y}%`}
            stroke="var(--color-accent)"
            strokeWidth="0.3"
          />
        ))
      )}
      {/* lines to center */}
      {NODE_POSITIONS.map((pos, i) => (
        <line
          key={`center-${i}`}
          x1={`${pos.x}%`}
          y1={`${pos.y}%`}
          x2={`${CENTER_POS.x}%`}
          y2={`${CENTER_POS.y}%`}
          stroke="var(--color-accent)"
          strokeWidth="0.2"
        />
      ))}
    </svg>
  );
}

/* ─────────────────────────────────────────
   MOBILE / TABLET INTERACTIVE VIEW
───────────────────────────────────────── */
function MobileThinkView({ activeNodeId, activeNode, onNodeClick, activeFramework, nodes = THINK_NODES, problemStatement = "Users are abandoning the workflow.", stages = FRAMEWORK_STAGES }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: '0 clamp(16px, 4vw, 24px) 36px',
      width: '100%',
      maxWidth: '680px',
      margin: '0 auto',
    }}>
      {/* Problem statement card */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderLeft: '3px solid var(--color-accent)',
        borderRadius: '12px',
        padding: '16px 18px',
        textAlign: 'left',
      }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '9px',
          letterSpacing: '0.2em',
          color: 'var(--color-accent)',
          textTransform: 'uppercase',
          marginBottom: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span style={{ fontSize: '10px' }}>◈</span> PROBLEM STATEMENT
        </div>
        <div style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '17px',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          lineHeight: 1.3,
        }}>
          &ldquo;{problemStatement}&rdquo;
        </div>
      </div>

      {/* Stage Tracker Pills */}
      <div style={{
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        paddingBottom: '4px',
        scrollbarWidth: 'none',
      }}>
        {stages.map((stage) => {
          const isActive = activeFramework === stage;
          return (
            <span
              key={stage}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '8px',
                letterSpacing: '0.14em',
                padding: '4px 8px',
                borderRadius: '4px',
                background: isActive ? 'var(--color-accent)' : 'rgba(255,255,255,0.04)',
                color: isActive ? '#060608' : 'var(--color-text-tertiary)',
                fontWeight: isActive ? 700 : 400,
                whiteSpace: 'nowrap',
                transition: 'all 200ms ease',
              }}
            >
              {stage}
            </span>
          );
        })}
      </div>

      {/* Thought Nodes Chips */}
      <div>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '9px',
          letterSpacing: '0.2em',
          color: 'var(--color-text-tertiary)',
          textTransform: 'uppercase',
          marginBottom: '10px',
        }}>
          EXPLORE PM REASONING NODES:
        </div>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
        }}>
          {nodes.map((node) => {
            const isSel = activeNodeId === node.id;
            return (
              <button
                key={node.id}
                onClick={() => onNodeClick(node.id)}
                style={{
                  background: isSel ? 'var(--color-accent)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isSel ? 'var(--color-accent)' : 'rgba(255,255,255,0.08)'}`,
                  color: isSel ? '#060608' : 'var(--color-text-secondary)',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '11px',
                  fontWeight: isSel ? 700 : 500,
                  letterSpacing: '0.1em',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 200ms ease',
                }}
              >
                <span>{node.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Answer Panel */}
      <AnimatePresence mode="wait">
        {activeNode ? (
          <motion.div
            key={activeNode.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            style={{
              background: 'rgba(10, 10, 16, 0.98)',
              border: '1px solid rgba(200, 242, 62, 0.25)',
              borderTop: '2px solid var(--color-accent)',
              borderRadius: '12px',
              padding: '18px',
            }}
          >
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '9px',
              letterSpacing: '0.2em',
              color: 'var(--color-accent)',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}>
              {activeNode.question}
            </div>
            <p style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '13px',
              lineHeight: 1.7,
              color: 'var(--color-text-secondary)',
              margin: '0 0 12px',
            }}>
              {activeNode.answer}
            </p>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '9px',
              letterSpacing: '0.15em',
              color: 'var(--color-text-tertiary)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              paddingTop: '10px',
            }}>
              <span>STAGE:</span>
              <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>{activeNode.framework}</span>
            </div>
          </motion.div>
        ) : (
          <div style={{
            padding: '18px',
            textAlign: 'center',
            border: '1px dashed rgba(255,255,255,0.08)',
            borderRadius: '12px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10px',
            color: 'var(--color-text-tertiary)',
            letterSpacing: '0.15em',
          }}>
            TAP ANY NODE ABOVE TO REVEAL PM THINKING
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────── */
export default function HowIThink({ setCursor, resetCursor }) {
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [isNarrow, setIsNarrow] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 860
  );

  useEffect(() => {
    const handleResize = () => {
      setIsNarrow(window.innerWidth < 860);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-10%' });

  const { data } = usePortfolioData();
  const think = data?.think || {};
  const thinkNodes = think.nodes || THINK_NODES;
  const problemStatement = think.problemStatement || "Users are abandoning the workflow.";
  const frameworkStages = think.frameworkStages || FRAMEWORK_STAGES;

  const activeNode = thinkNodes.find(n => n.id === activeNodeId) || null;
  const activeFramework = activeNode?.framework || null;

  const handleNodeClick = useCallback((nodeId) => {
    setActiveNodeId(prev => (prev === nodeId ? null : nodeId));
  }, []);

  return (
    <section
      id="think"
      ref={sectionRef}
      data-inspect="HOW I THINK: Interactive PM reasoning system"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'var(--color-void)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top border */}
      <div style={{ height: '1px', background: 'var(--color-border)', flexShrink: 0 }} />

      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{
          padding: 'clamp(20px, 4vh, 48px) clamp(16px, 5vw, 80px)',
          flexShrink: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--color-text-tertiary)',
          }}
        >
          02 / THINK
        </span>

        {/* Click hint */}
        <motion.span
          animate={{ opacity: activeNodeId ? 0 : [0.4, 0.8, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '9px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--color-text-tertiary)',
          }}
        >
          SELECT A NODE TO EXPLORE
        </motion.span>
      </motion.div>

      {/* Mobile/Tablet interactive flow */}
      {isNarrow ? (
        <MobileThinkView
          activeNodeId={activeNodeId}
          activeNode={activeNode}
          onNodeClick={handleNodeClick}
          activeFramework={activeFramework}
          nodes={thinkNodes}
          problemStatement={problemStatement}
          stages={frameworkStages}
        />
      ) : (
        /* Desktop Constellation arena */
        <div style={{ flex: 1, position: 'relative' }}>
          {/* Framework rail — left */}
          <FrameworkRail activeFramework={activeFramework} />


        {/* Decorative constellation mesh */}
        <ConstellationMesh />

        {/* Active connecting line */}
        {activeNode && (() => {
          const nodeIdx = thinkNodes.indexOf(activeNode);
          const pos = NODE_POSITIONS[nodeIdx >= 0 ? nodeIdx : 0];
          return (
            <ConstellationLine
              fromPos={pos}
              toPos={CENTER_POS}
              isVisible={!!activeNode}
            />
          );
        })()}

        {/* Center: problem statement */}
        <motion.div
          initial={{ opacity: 0, x: '-50%', y: '-50%', scale: 0.85 }}
          animate={inView ? { opacity: 1, x: '-50%', y: '-50%', scale: 1 } : { opacity: 0, x: '-50%', y: '-50%', scale: 0.85 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute',
            left: `${CENTER_POS.x}%`,
            top: `${CENTER_POS.y}%`,
            textAlign: 'center',
            zIndex: 4,
            maxWidth: 'min(80vw, 260px)',
            boxSizing: 'border-box',
          }}
        >
          {/* Outer ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              inset: '-28px',
              border: '1px dashed rgba(200,242,62,0.12)',
              borderRadius: '50%',
              pointerEvents: 'none',
            }}
          />
          {/* Inner ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              inset: '-14px',
              border: '1px solid rgba(200,242,62,0.06)',
              borderRadius: '50%',
              pointerEvents: 'none',
            }}
          />

          {/* Problem label */}
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '8px',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'var(--color-text-tertiary)',
              marginBottom: '8px',
            }}
          >
            PROBLEM STATEMENT
          </div>

          {/* Problem text */}
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(13px, 1.4vw, 19px)',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              lineHeight: 1.35,
              maxWidth: '100%',
              wordBreak: 'break-word',
            }}
          >
            &ldquo;{problemStatement}&rdquo;
          </div>

          {/* Active node pulsing indicator */}
          <AnimatePresence>
            {activeNode && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                style={{
                  marginTop: '10px',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '8px',
                  letterSpacing: '0.2em',
                  color: 'var(--color-accent)',
                  textTransform: 'uppercase',
                }}
              >
                ← {activeNode.label}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Thought nodes */}
        {thinkNodes.map((node, index) => (
          <ThoughtNode
            key={node.id}
            node={node}
            position={NODE_POSITIONS[index % NODE_POSITIONS.length]}
            index={index}
            isActive={activeNodeId === node.id}
            onClick={() => handleNodeClick(node.id)}
            setCursor={setCursor}
            resetCursor={resetCursor}
            inView={inView}
          />
        ))}

        {/* Expanded answer panel */}
        <NodeAnswerPanel node={activeNode} />
      </div>
      )}

      {/* Section title — architectural large text (desktop only) */}
      <motion.div
        className="hide-mobile"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.5, duration: 1 }}
        style={{
          position: 'absolute',
          top: 'clamp(28px, 4vh, 48px)',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(11px, 1.1vw, 14px)',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(200,242,62,0.1)',
          }}
        >
          HOW I THINK
        </div>
      </motion.div>

      {/* Bottom border */}
      <div style={{ height: '1px', background: 'var(--color-border)', flexShrink: 0, marginTop: 'auto' }} />
    </section>
  );
}
