import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SEQUENCE = [
  { text: 'INITIALIZING SYSTEM —', delay: 0 },
  { text: 'MAPPING VISITOR CONTEXT', delay: 700 },
  { text: 'LOADING DECISION FRAMEWORK', delay: 1500 },
  { text: 'SYSTEM READY', delay: 2200 },
];

const TOTAL_DURATION = 3200;

export default function IntroSequence({ onComplete }) {
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState('text');
  const [activeLines, setActiveLines] = useState([]);
  const [showSkip, setShowSkip] = useState(false);
  const [exiting, setExiting] = useState(false);
  const animFrameRef = useRef(null);
  const startTimeRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const triggerComplete = useCallback(() => {
    setExiting(true);
    sessionStorage.setItem('intro-seen', 'true');
    setTimeout(onComplete, 900);
  }, [onComplete]);

  useEffect(() => {
    if (sessionStorage.getItem('intro-seen') === 'true') {
      onComplete();
      return;
    }

    const skipTimer = setTimeout(() => setShowSkip(true), 1400);

    SEQUENCE.forEach((item) => {
      setTimeout(() => {
        setActiveLines(prev => [...prev, item.text]);
      }, item.delay);
    });

    let elapsed = 0;
    const progressInterval = setInterval(() => {
      elapsed += 50;
      setProgress(Math.min(elapsed / TOTAL_DURATION, 1));
    }, 50);

    const networkTimer = setTimeout(() => setPhase('network'), TOTAL_DURATION);
    const completeTimer = setTimeout(() => triggerComplete(), TOTAL_DURATION + 1900);

    return () => {
      clearTimeout(skipTimer);
      clearTimeout(networkTimer);
      clearTimeout(completeTimer);
      clearInterval(progressInterval);
    };
  }, [onComplete, triggerComplete]);

  useEffect(() => {
    if (phase !== 'network') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const nodeCount = 80;
    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      tx: cx + (Math.random() - 0.5) * Math.min(canvas.width * 0.45, 460),
      ty: cy + (Math.random() - 0.5) * Math.min(canvas.height * 0.38, 220),
      r: Math.random() * 1.4 + 0.3,
      opacity: Math.random() * 0.45 + 0.15,
    }));

    startTimeRef.current = performance.now();
    const duration = 1900;
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const draw = (timestamp) => {
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const alpha = (1 - dist / 100) * 0.09 * eased;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(200,242,62,${alpha})`;
            ctx.lineWidth = 0.35;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      nodes.forEach(node => {
        node.x += (node.tx - node.x) * 0.024;
        node.y += (node.ty - node.y) * 0.024;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,242,62,${node.opacity * eased})`;
        ctx.fill();
      });

      // Name reveal
      if (progress > 0.5) {
        const textAlpha = (progress - 0.5) / 0.5;
        const fontSize = Math.min(canvas.width * 0.088, 104);
        ctx.font = `700 ${fontSize}px 'Plus Jakarta Sans', sans-serif`;
        ctx.fillStyle = `rgba(242,242,242,${textAlpha * 0.92})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('MRIDUL UPADHYA', cx, cy);

        if (textAlpha > 0.55) {
          const subAlpha = (textAlpha - 0.55) / 0.45;
          const subSize = Math.max(9, Math.min(canvas.width * 0.024, 12));
          ctx.font = `400 ${subSize}px 'JetBrains Mono', monospace`;
          ctx.fillStyle = `rgba(200,242,62,${subAlpha * 0.65})`;
          ctx.fillText('PRODUCT MANAGER', cx, cy + fontSize * 0.72);
        }
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(draw);
      }
    };

    animFrameRef.current = requestAnimationFrame(draw);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [phase]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.95, ease: [0.65, 0, 0.35, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            background: '#010102',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
            padding: 'clamp(40px, 6vw, 104px)',
            overflow: 'hidden',
          }}
        >
          {/* Canvas network */}
          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: phase === 'network' ? 1 : 0,
              transition: 'opacity 800ms ease',
            }}
          />

          {/* Grain overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
              opacity: 0.018,
              pointerEvents: 'none',
            }}
            aria-hidden="true"
          />

          {/* Text sequence */}
          {phase === 'text' && (
            <div style={{ position: 'relative', zIndex: 2, paddingBottom: '40px' }}>
              {activeLines.map((line, i) => (
                <motion.div
                  key={`line-${i}`}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: i === activeLines.length - 1 ? 1 : 0.18, x: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 'clamp(8px, 1vw, 11px)',
                    letterSpacing: '0.26em',
                    color: i === activeLines.length - 1 ? '#C8F23E' : '#24243A',
                    marginBottom: '10px',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <span style={{ fontSize: '0.65em', opacity: 0.7 }}>
                    {i < activeLines.length - 1 ? '✓' : '→'}
                  </span>
                  {line}
                </motion.div>
              ))}
            </div>
          )}

          {/* Progress bar */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: '1px',
            background: 'linear-gradient(90deg, rgba(200,242,62,0.3), rgba(200,242,62,0.9))',
            width: `${(phase === 'network' ? 1 : progress) * 100}%`,
            transition: 'width 50ms linear',
            boxShadow: '0 0 10px rgba(200,242,62,0.35)',
          }} />

          {/* Skip button */}
          {showSkip && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              onClick={triggerComplete}
              aria-label="Skip introduction"
              style={{
                position: 'absolute',
                top: 'clamp(32px, 5vw, 60px)',
                right: 'clamp(32px, 5vw, 60px)',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.2)',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '8px',
                letterSpacing: '0.22em',
                padding: '9px 20px',
                cursor: 'pointer',
                textTransform: 'uppercase',
                transition: 'border-color 200ms ease, color 200ms ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(200,242,62,0.4)';
                e.currentTarget.style.color = '#C8F23E';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.2)';
              }}
            >
              SKIP →
            </motion.button>
          )}

          {/* Corner identifier */}
          <div style={{
            position: 'absolute',
            top: 'clamp(32px, 5vw, 60px)',
            left: 'clamp(32px, 5vw, 104px)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '8px',
            letterSpacing: '0.26em',
            color: 'rgba(255,255,255,0.15)',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '9px',
          }}>
            <span style={{ color: 'rgba(200,242,62,0.22)', fontSize: '9px' }}>◈</span>
            MU / SYS.01
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
