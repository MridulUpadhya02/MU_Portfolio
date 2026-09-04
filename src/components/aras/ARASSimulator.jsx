import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── DATA ─────────────────────────────────────────────────────────────── */
const BUGS = [
  { id: 'BUG-2847', title: 'Login flow fails on iOS 17',            priority: 'HIGH',   status: 'RFR' },
  { id: 'BUG-2851', title: 'Dashboard widget misalignment',          priority: 'MEDIUM', status: 'RFR' },
  { id: 'BUG-2855', title: 'Export CSV timeout on large datasets',   priority: 'HIGH',   status: 'RFR' },
  { id: 'BUG-2860', title: 'Search filter not persisting',           priority: 'LOW',    status: 'RFR' },
  { id: 'BUG-2863', title: 'Notification bell badge incorrect count',priority: 'MEDIUM', status: 'RFR' },
  { id: 'BUG-2871', title: 'Profile photo upload silently fails',    priority: 'HIGH',   status: 'RFR' },
];

const TESTERS = [
  { id: 't1', name: 'Priya S.',  status: 'available'  },
  { id: 't2', name: 'Rahul M.', status: 'busy'        },
  { id: 't3', name: 'Anjali K.',status: 'available'   },
  { id: 't4', name: 'Dev P.',   status: 'in-meeting'  },
  { id: 't5', name: 'Sana R.',  status: 'available'   },
];

/* ─── HELPERS ───────────────────────────────────────────────────────────── */
const PRIORITY_COLORS = {
  HIGH:   { bg: 'rgba(140,74,74,0.25)',  border: '#8C4A4A', text: '#E07070' },
  MEDIUM: { bg: 'rgba(140,122,74,0.25)', border: '#8C7A4A', text: '#D4A854' },
  LOW:    { bg: 'rgba(74,110,140,0.25)', border: '#4A6E8C', text: '#70A8D4' },
};

const STATUS_META = {
  'available':  { color: '#4A8C6A', label: 'Available'  },
  'busy':       { color: '#8C4A4A', label: 'Busy'       },
  'in-meeting': { color: '#8C7A4A', label: 'In Meeting' },
  'on-leave':   { color: '#52545C', label: 'On Leave'   },
};

function formatTime(seconds) {
  return seconds < 60 ? `${seconds}s` : `${Math.floor(seconds/60)}m ${seconds%60}s`;
}

/* ─── SUB-COMPONENTS ────────────────────────────────────────────────────── */
function BugCard({ bug, selected, assigned, assignedTo, onSelect, draggable, onDragStart }) {
  const p = PRIORITY_COLORS[bug.priority];
  const isAssigned = !!assigned;
  return (
    <motion.div
      layout
      draggable={draggable && !isAssigned}
      onDragStart={onDragStart}
      onClick={() => !isAssigned && onSelect && onSelect(bug.id)}
      whileHover={!isAssigned ? { scale: 1.02, y: -2 } : {}}
      whileTap={!isAssigned ? { scale: 0.98 } : {}}
      style={{
        background: isAssigned ? 'rgba(74,140,106,0.08)' : '#0A0D15',
        border: `1px solid ${selected ? '#C8A96E' : isAssigned ? '#4A8C6A' : '#22222A'}`,
        borderRadius: 4,
        padding: '12px 14px',
        cursor: isAssigned ? 'default' : draggable ? 'grab' : 'pointer',
        position: 'relative',
        transition: 'border-color 0.2s, opacity 0.3s',
        opacity: isAssigned ? 0.7 : 1,
        userSelect: 'none',
      }}
    >
      {/* Status flash */}
      {isAssigned && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{
            position: 'absolute', top: 8, right: 8,
            width: 20, height: 20, borderRadius: '50%',
            background: '#4A8C6A',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, color: '#fff',
          }}
        >✓</motion.div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
          color: '#52545C', letterSpacing: '0.05em',
        }}>{bug.id}</span>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
          padding: '2px 6px', borderRadius: 2,
          background: p.bg, border: `1px solid ${p.border}`,
          color: p.text, letterSpacing: '0.1em',
        }}>{bug.priority}</span>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
          padding: '2px 6px', borderRadius: 2,
          background: 'rgba(200,169,110,0.08)',
          border: '1px solid rgba(200,169,110,0.2)',
          color: '#C8A96E', letterSpacing: '0.1em', marginLeft: 'auto',
        }}>{bug.status}</span>
      </div>
      <div style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13,
        color: isAssigned ? '#8B8D96' : '#F0EFE8',
        lineHeight: 1.4,
      }}>{bug.title}</div>
      {isAssigned && assignedTo && (
        <div style={{
          marginTop: 6, fontFamily: 'JetBrains Mono, monospace',
          fontSize: 10, color: '#4A8C6A', letterSpacing: '0.05em',
        }}>→ {assignedTo}</div>
      )}
    </motion.div>
  );
}

function TesterPanel({ tester, selected, assigned, flash, onDrop, onDragOver, onClick }) {
  const sm = STATUS_META[tester.status];
  const isAvailable = tester.status === 'available';
  return (
    <motion.div
      onDragOver={e => { e.preventDefault(); onDragOver && onDragOver(); }}
      onDrop={onDrop}
      onClick={onClick}
      animate={{
        borderColor: flash === 'error'   ? '#8C4A4A'
                   : flash === 'success' ? '#4A8C6A'
                   : selected           ? '#C8A96E'
                   : '#22222A',
        background:  flash === 'error'   ? 'rgba(140,74,74,0.12)'
                   : flash === 'success' ? 'rgba(74,140,106,0.12)'
                   : '#111115',
      }}
      transition={{ duration: 0.2 }}
      style={{
        border: '1px solid',
        borderRadius: 4,
        padding: '14px',
        cursor: isAvailable ? 'pointer' : 'not-allowed',
        display: 'flex', alignItems: 'center', gap: 12,
      }}
    >
      {/* Avatar */}
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: `${sm.color}22`,
        border: `1px solid ${sm.color}55`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700,
        fontSize: 14, color: sm.color, flexShrink: 0,
      }}>
        {tester.name[0]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13,
          color: '#F0EFE8', fontWeight: 500,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{tester.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: sm.color, flexShrink: 0,
          }} />
          <span style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
            color: sm.color, letterSpacing: '0.08em',
          }}>{sm.label}</span>
        </div>
      </div>
      {assigned > 0 && (
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
          background: 'rgba(74,140,106,0.12)',
          border: '1px solid rgba(74,140,106,0.3)',
          color: '#4A8C6A', padding: '2px 6px', borderRadius: 2,
        }}>{assigned} bug{assigned > 1 ? 's' : ''}</div>
      )}
      {flash === 'error' && (
        <motion.span
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
            color: '#E07070', letterSpacing: '0.05em', whiteSpace: 'nowrap',
          }}
        >Tester unavailable!</motion.span>
      )}
    </motion.div>
  );
}

/* ─── AUTO-PHASE ASSIGNMENT ANIMATION ─────────────────────────────────── */
const delay = ms => new Promise(r => setTimeout(r, ms));

function AutoPhase({ manualTime, onRestart }) {
  const [scanIdx, setScanIdx] = useState(-1);        // which bug is being scanned
  const [assignIdx, setAssignIdx] = useState(-1);    // which bug is being assigned
  const [assignments, setAssignments] = useState({}); // bugId → testerName
  const [status, setStatus] = useState('Initialising ARAS...');
  const [done, setDone] = useState(false);
  const [autoTime, setAutoTime] = useState(0);
  const timerRef = useRef(null);
  const startRef = useRef(null);

  // Eligible testers only (available)
  const availableTesters = TESTERS.filter(t => t.status === 'available');

  useEffect(() => {
    startRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setAutoTime(Math.floor((Date.now() - startRef.current) / 1000));
    }, 200);

    const steps = async () => {
      await delay(400);
      setStatus('Scanning BOND 360 for RFR status...');
      for (let i = 0; i < BUGS.length; i++) {
        await delay(300);
        setScanIdx(i);
      }
      await delay(500);
      setStatus('Checking tester availability...');
      await delay(800);

      for (let i = 0; i < BUGS.length; i++) {
        setAssignIdx(i);
        const tester = availableTesters[i % availableTesters.length];
        setStatus(`Assigning ${BUGS[i].id} → ${tester.name}`);
        await delay(800);
        setAssignments(prev => ({ ...prev, [BUGS[i].id]: tester.name }));
        setStatus(`Assignment logged. ${tester.name} notified.`);
        await delay(400);
      }
      await delay(400);
      setStatus('All assignments complete. 0 errors.');
      setDone(true);
      clearInterval(timerRef.current);
    };
    steps();
    return () => clearInterval(timerRef.current);
  }, []); // eslint-disable-line

  const timeSaved = manualTime - autoTime;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, height: '100%' }}>
      {/* System header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 20px',
        background: 'rgba(74,140,106,0.06)',
        borderBottom: '1px solid rgba(74,140,106,0.2)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: done ? 0 : Infinity }}
            style={{
              width: 8, height: 8, borderRadius: '50%',
              background: done ? '#4A8C6A' : '#C8A96E',
            }}
          />
          <span style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
            color: done ? '#4A8C6A' : '#C8A96E', letterSpacing: '0.15em',
          }}>ARAS {done ? 'COMPLETE' : 'ACTIVE'}</span>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#52545C' }}>ARAS TIME</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, color: '#4A8C6A' }}>
              {formatTime(autoTime)}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#52545C' }}>MIS-ASSIGNMENTS</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, color: '#4A8C6A' }}>0</div>
          </div>
        </div>
      </div>

      {/* Status ticker */}
      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          style={{
            padding: '8px 20px',
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
            color: '#8B8D96', background: '#0A0D15',
            borderBottom: '1px solid #22222A',
            letterSpacing: '0.05em', flexShrink: 0,
          }}
        >▶ {status}</motion.div>
      </AnimatePresence>

      {/* Bug list */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '16px 20px',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {BUGS.map((bug, i) => {
          const isScanning = scanIdx === i && !assignments[bug.id];
          const isAssigning = assignIdx === i && !assignments[bug.id];
          const assigned = assignments[bug.id];
          const p = PRIORITY_COLORS[bug.priority];
          return (
            <motion.div
              key={bug.id}
              layout
              animate={{
                borderColor: assigned ? '#4A8C6A'
                           : isAssigning ? '#C8A96E'
                           : isScanning  ? '#8C7A4A'
                           : '#22222A',
                background: assigned ? 'rgba(74,140,106,0.08)'
                           : isAssigning ? 'rgba(200,169,110,0.05)'
                           : '#0A0D15',
              }}
              style={{
                border: '1px solid', borderRadius: 4,
                padding: '12px 14px', position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#52545C' }}>
                  {bug.id}
                </span>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
                  padding: '2px 6px', borderRadius: 2,
                  background: p.bg, border: `1px solid ${p.border}`, color: p.text,
                }}>{bug.priority}</span>

                {/* Scan pulse */}
                {isScanning && (
                  <motion.div
                    animate={{ opacity: [1,0.2,1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    style={{
                      marginLeft: 'auto',
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                      color: '#8C7A4A',
                    }}
                  >scanning...</motion.div>
                )}

                {/* Assigning pulse */}
                {isAssigning && (
                  <motion.div
                    animate={{ opacity: [1,0.2,1] }}
                    transition={{ duration: 0.4, repeat: Infinity }}
                    style={{
                      marginLeft: 'auto',
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                      color: '#C8A96E',
                    }}
                  >assigning...</motion.div>
                )}

                {/* Done checkmark */}
                {assigned && (
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    style={{
                      marginLeft: 'auto', width: 18, height: 18,
                      borderRadius: '50%', background: '#4A8C6A',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, color: '#fff',
                    }}
                  >✓</motion.div>
                )}
              </div>

              <div style={{
                marginTop: 4,
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13,
                color: assigned ? '#8B8D96' : '#F0EFE8',
              }}>{bug.title}</div>

              {assigned && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    marginTop: 6,
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                    color: '#4A8C6A', letterSpacing: '0.05em',
                  }}
                >→ {assigned} · Assignment logged. Tester notified.</motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Completion card */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              margin: '0 20px 20px',
              background: 'rgba(74,140,106,0.08)',
              border: '1px solid rgba(74,140,106,0.3)',
              borderRadius: 4, padding: '16px 20px',
              flexShrink: 0,
            }}
          >
            <div style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 18, color: '#4A8C6A', marginBottom: 8,
            }}>ARAS: Zero overhead. Zero errors.</div>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 12, marginBottom: 16,
            }}>
              <div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#52545C' }}>
                  MANUAL TIME
                </div>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 20,
                  color: '#8C4A4A',
                }}>{formatTime(manualTime)}</div>
              </div>
              <div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#52545C' }}>
                  ARAS TIME
                </div>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 20,
                  color: '#4A8C6A',
                }}>{formatTime(autoTime)}</div>
              </div>
            </div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
              color: '#C8A96E', marginBottom: 16,
            }}>
              TIME SAVED: {formatTime(Math.max(0, timeSaved))} · 0 mis-assignments · {BUGS.length} bugs processed
            </div>
            <button
              onClick={onRestart}
              style={{
                background: 'transparent',
                border: '1px solid #22222A',
                color: '#8B8D96',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 11, letterSpacing: '0.1em',
                padding: '8px 16px', borderRadius: 2,
                cursor: 'pointer',
              }}
            >↩ RESTART SIMULATOR</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── MAIN COMPONENT ────────────────────────────────────────────────────── */
export default function ARASSimulator({ onClose }) {
  const [phase, setPhase] = useState('intro');

  /* Manual-phase state */
  const [selectedBug, setSelectedBug] = useState(null);
  const [assignments, setAssignments] = useState({}); // bugId → testerId
  const [testerFlash, setTesterFlash] = useState({}); // testerId → 'error' | 'success'
  const [testerCounts, setTesterCounts] = useState({}); // testerId → number of bugs
  const [mistakes, setMistakes] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [dragBug, setDragBug] = useState(null);
  const [manualTime, setManualTime] = useState(0); // captured when transitioning
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const assignmentCount = Object.keys(assignments).length;
  const canProceedToAuto = assignmentCount >= 3;

  // Timer
  useEffect(() => {
    if (phase === 'manual') {
      startTimeRef.current = Date.now() - elapsed * 1000;
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 500);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [phase]); // eslint-disable-line

  const flashTester = useCallback((testerId, type) => {
    setTesterFlash(prev => ({ ...prev, [testerId]: type }));
    setTimeout(() => setTesterFlash(prev => ({ ...prev, [testerId]: null })), 1200);
  }, []);

  const handleAssign = useCallback((bugId, testerId) => {
    if (assignments[bugId]) return; // already assigned
    const tester = TESTERS.find(t => t.id === testerId);
    if (!tester) return;

    if (tester.status !== 'available') {
      setMistakes(m => m + 1);
      flashTester(testerId, 'error');
      return;
    }
    // Success
    setAssignments(prev => ({ ...prev, [bugId]: testerId }));
    setTesterCounts(prev => ({ ...prev, [testerId]: (prev[testerId] || 0) + 1 }));
    flashTester(testerId, 'success');
    setSelectedBug(null);
  }, [assignments, flashTester]);

  const handleTesterClick = useCallback((testerId) => {
    if (!selectedBug) return;
    handleAssign(selectedBug, testerId);
  }, [selectedBug, handleAssign]);

  const handleDrop = useCallback((testerId) => {
    if (!dragBug) return;
    handleAssign(dragBug, testerId);
    setDragBug(null);
  }, [dragBug, handleAssign]);

  const goToAuto = () => {
    setManualTime(elapsed);
    setPhase('auto');
  };

  const restart = () => {
    setPhase('intro');
    setSelectedBug(null);
    setAssignments({});
    setTesterFlash({});
    setTesterCounts({});
    setMistakes(0);
    setElapsed(0);
    setDragBug(null);
    setManualTime(0);
  };

  /* Frustration meter */
  const frustrationPct = Math.min(100, mistakes * 20 + assignmentCount * 5);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0,
        background: '#05060A',
        zIndex: 'var(--z-modal, 300)',
        display: 'flex', flexDirection: 'column',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* ── CLOSE BUTTON ── */}
      <motion.button
        whileHover={{ color: '#F0EFE8' }}
        onClick={onClose}
        style={{
          position: 'absolute', top: 'clamp(12px, 2vh, 20px)', right: 'clamp(12px, 2.5vw, 24px)',
          background: 'rgba(10, 13, 21, 0.8)',
          backdropFilter: 'blur(8px)',
          border: '1px solid #22222A',
          color: '#8B8D96',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 'clamp(10px, 1.2vw, 11px)', letterSpacing: '0.12em',
          padding: '6px 12px', borderRadius: 2,
          cursor: 'pointer', zIndex: 10,
        }}
      >EXIT ×</motion.button>

      {/* ════════════════════════════════════════
          INTRO PHASE
      ════════════════════════════════════════ */}
      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5 }}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '40px 24px', textAlign: 'center',
            }}
          >
            {/* Decorative grid */}
            <div style={{
              position: 'absolute', inset: 0, opacity: 0.04,
              backgroundImage: 'linear-gradient(#C8A96E 1px, transparent 1px), linear-gradient(90deg, #C8A96E 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              pointerEvents: 'none',
            }} />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                color: '#C8A96E', letterSpacing: '0.2em',
                marginBottom: 24, textTransform: 'uppercase',
              }}
            >ARAS INTERACTIVE SIMULATOR</motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(32px, 5vw, 60px)',
                color: '#F0EFE8', lineHeight: 1.1,
                marginBottom: 24, maxWidth: 700,
              }}
            >Experience the<br /><em style={{ color: '#C8A96E' }}>ARAS Problem</em></motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{
                fontSize: 16, color: '#8B8D96',
                maxWidth: 520, marginBottom: 16, lineHeight: 1.7,
              }}
            >Before we tell you the solution, feel the problem.</motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              style={{
                background: '#111115',
                border: '1px solid #22222A',
                borderRadius: 4, padding: '20px 28px',
                maxWidth: 480, marginBottom: 40,
                textAlign: 'left',
              }}
            >
              <div style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                color: '#52545C', letterSpacing: '0.15em', marginBottom: 10,
              }}>SCENARIO BRIEFING</div>
              <p style={{ fontSize: 14, color: '#8B8D96', lineHeight: 1.7 }}>
                You are a QA lead. Six bugs have entered <strong style={{ color: '#F0EFE8' }}>Ready for Retest</strong> status.
                Assign each bug to an available tester — without a system to help you.
              </p>
              <div style={{
                marginTop: 14, paddingTop: 14,
                borderTop: '1px solid #22222A',
                fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                color: '#52545C',
              }}>Click a bug → Click a tester to assign · Or drag-and-drop</div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.03, borderColor: '#C8A96E' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setPhase('manual')}
              style={{
                background: 'transparent',
                border: '1px solid #8B7249',
                color: '#C8A96E',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 13, letterSpacing: '0.12em',
                padding: '14px 32px', borderRadius: 2,
                cursor: 'pointer',
              }}
            >START MANUAL ASSIGNMENT →</motion.button>
          </motion.div>
        )}

        {/* ════════════════════════════════════════
            MANUAL PHASE
        ════════════════════════════════════════ */}
        {phase === 'manual' && (
          <motion.div
            key="manual"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Top bar */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: 'clamp(10px, 1.5vh, 14px) clamp(14px, 2vw, 24px)',
              background: '#0A0D15',
              borderBottom: '1px solid #22222A',
              flexShrink: 0,
              flexWrap: 'wrap', gap: 12,
            }}>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 'clamp(10px, 1.2vw, 11px)',
                color: '#C8A96E', letterSpacing: '0.15em',
              }}>MANUAL ASSIGNMENT MODE</div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 2vw, 24px)', flexWrap: 'wrap' }}>
                {/* Timer */}
                <div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#52545C', letterSpacing: '0.1em' }}>
                    TIME SPENT
                  </div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 16, color: '#F0EFE8' }}>
                    {formatTime(elapsed)}
                  </div>
                </div>

                {/* Frustration meter */}
                <div style={{ width: 'clamp(90px, 22vw, 140px)' }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', marginBottom: 4,
                  }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#52545C', letterSpacing: '0.08em' }}>
                      OVERHEAD
                    </span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#8C4A4A' }}>
                      {mistakes} err
                    </span>
                  </div>
                  <div style={{
                    height: 4, background: '#22222A', borderRadius: 2, overflow: 'hidden',
                  }}>
                    <motion.div
                      animate={{ width: `${frustrationPct}%` }}
                      style={{
                        height: '100%', borderRadius: 2,
                        background: frustrationPct > 60 ? '#8C4A4A' : frustrationPct > 30 ? '#8C7A4A' : '#C8A96E',
                      }}
                    />
                  </div>
                </div>

                {/* Assignments count */}
                <div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#52545C' }}>ASSIGNED</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 16, color: '#F0EFE8' }}>
                    {assignmentCount}/6
                  </div>
                </div>
              </div>
            </div>

            {/* Instruction bar */}
            <div style={{
              padding: '8px 24px',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
              color: selectedBug ? '#C8A96E' : '#52545C',
              background: selectedBug ? 'rgba(200,169,110,0.04)' : '#0A0D15',
              borderBottom: '1px solid #22222A',
              transition: 'background 0.2s, color 0.2s',
              flexShrink: 0,
            }}>
              {selectedBug
                ? `▶ Bug ${selectedBug} selected — click a tester to assign, or click elsewhere to deselect`
                : '▶ Click a bug card to select it, then click a tester panel — or drag bugs onto testers'}
            </div>

            {/* Main area */}
            <div style={{
              flex: 1, display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
              gap: 0, overflowY: 'auto',
            }}>
              {/* Bugs column */}
              <div style={{
                padding: 'clamp(14px, 2vw, 20px) clamp(14px, 2vw, 24px)',
                borderRight: '1px solid #22222A',
                borderBottom: '1px solid #22222A',
              }}>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                  color: '#52545C', letterSpacing: '0.15em',
                  marginBottom: 14, textTransform: 'uppercase',
                }}>Incoming Bugs — RFR Queue</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {BUGS.map(bug => (
                    <BugCard
                      key={bug.id}
                      bug={bug}
                      selected={selectedBug === bug.id}
                      assigned={!!assignments[bug.id]}
                      assignedTo={assignments[bug.id]
                        ? TESTERS.find(t => t.id === assignments[bug.id])?.name
                        : null}
                      onSelect={setSelectedBug}
                      draggable
                      onDragStart={() => {
                        setDragBug(bug.id);
                        setSelectedBug(bug.id);
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Testers column */}
              <div style={{
                padding: 'clamp(14px, 2vw, 20px) clamp(14px, 2vw, 20px)',
                display: 'flex', flexDirection: 'column',
              }}>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                  color: '#52545C', letterSpacing: '0.15em',
                  marginBottom: 14, textTransform: 'uppercase',
                }}>Available Testers</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                  {TESTERS.map(tester => (
                    <TesterPanel
                      key={tester.id}
                      tester={tester}
                      selected={false}
                      assigned={testerCounts[tester.id] || 0}
                      flash={testerFlash[tester.id]}
                      onClick={() => handleTesterClick(tester.id)}
                      onDrop={() => handleDrop(tester.id)}
                      onDragOver={() => {}}
                    />
                  ))}
                </div>

                {/* Proceed button */}
                <AnimatePresence>
                  {canProceedToAuto && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ marginTop: 20 }}
                    >
                      <div style={{
                        fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                        color: '#8B8D96', marginBottom: 10, lineHeight: 1.6,
                      }}>
                        You spent <strong style={{ color: '#F0EFE8' }}>{formatTime(elapsed)}</strong> on{' '}
                        {assignmentCount} assignments.
                        <br />In manual mode, this scales to hundreds of bugs.
                      </div>
                      <button
                        onClick={goToAuto}
                        style={{
                          width: '100%',
                          background: 'rgba(200,169,110,0.06)',
                          border: '1px solid #C8A96E',
                          color: '#C8A96E',
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: 12, letterSpacing: '0.1em',
                          padding: '12px 16px', borderRadius: 2,
                          cursor: 'pointer',
                        }}
                      >See the ARAS solution →</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}

        {/* ════════════════════════════════════════
            AUTO PHASE
        ════════════════════════════════════════ */}
        {phase === 'auto' && (
          <motion.div
            key="auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
          >
            {/* Phase header */}
            <div style={{
              padding: '14px 24px',
              background: 'rgba(74,140,106,0.04)',
              borderBottom: '1px solid rgba(74,140,106,0.15)',
              flexShrink: 0,
            }}>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                color: '#4A8C6A', letterSpacing: '0.15em',
              }}>
                THE ARAS SOLUTION — What happens when the system thinks for you.
              </div>
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <AutoPhase manualTime={manualTime} onRestart={restart} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
