import { motion, AnimatePresence } from 'framer-motion';
import { CURSOR_STATES } from '../../hooks/useCursor';

// Cursor config per state
const CURSOR_CONFIG = {
  [CURSOR_STATES.DEFAULT]: {
    dotSize: 4,
    ringSize: 22,
    ringOpacity: 0.22,
    label: '',
    ringColor: 'rgba(200,169,110,0.45)',
  },
  [CURSOR_STATES.HOVER]: {
    dotSize: 3,
    ringSize: 38,
    ringOpacity: 0.5,
    label: '',
    ringColor: 'rgba(200,169,110,0.65)',
  },
  [CURSOR_STATES.EXPLORE]: {
    dotSize: 0,
    ringSize: 52,
    ringOpacity: 0.75,
    label: 'EXPLORE →',
    ringColor: 'rgba(200,169,110,0.75)',
  },
  [CURSOR_STATES.CASE]: {
    dotSize: 0,
    ringSize: 62,
    ringOpacity: 0.8,
    label: 'OPEN',
    ringColor: 'rgba(200,169,110,0.8)',
  },
  [CURSOR_STATES.VIEW]: {
    dotSize: 0,
    ringSize: 48,
    ringOpacity: 0.65,
    label: 'VIEW',
    ringColor: 'rgba(200,169,110,0.65)',
  },
  [CURSOR_STATES.SECRET]: {
    dotSize: 3,
    ringSize: 40,
    ringOpacity: 0.95,
    label: '?',
    ringColor: 'rgba(200,169,110,0.95)',
  },
  [CURSOR_STATES.DRAG]: {
    dotSize: 3,
    ringSize: 30,
    ringOpacity: 0.38,
    label: '',
    ringColor: 'rgba(200,169,110,0.45)',
  },
  [CURSOR_STATES.TEXT]: {
    dotSize: 2,
    ringSize: 18,
    ringOpacity: 0.22,
    label: '',
    ringColor: 'rgba(200,169,110,0.35)',
  },
};

export default function CustomCursor({ position, cursorState, cursorLabel, isVisible }) {
  const config = CURSOR_CONFIG[cursorState] || CURSOR_CONFIG[CURSOR_STATES.DEFAULT];
  const label = cursorLabel || config.label;
  const isLabeled = !!label;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="cursor-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            pointerEvents: 'none',
            zIndex: 9999,
            willChange: 'transform',
            transform: `translate(${position.x}px, ${position.y}px)`,
          }}
          aria-hidden="true"
        >
          {/* Center dot */}
          <motion.div
            animate={{
              width: config.dotSize,
              height: config.dotSize,
              opacity: config.dotSize > 0 ? 1 : 0,
            }}
            transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
            style={{
              position: 'absolute',
              borderRadius: '50%',
              background: '#C9A96E',
              transform: 'translate(-50%, -50%)',
              boxShadow: config.dotSize > 0 ? '0 0 8px rgba(201,169,110,0.5)' : 'none',
            }}
          />

          {/* Ring */}
          {!isLabeled && (
            <motion.div
              animate={{
                width: config.ringSize,
                height: config.ringSize,
                opacity: config.ringOpacity,
                borderColor: config.ringColor,
              }}
              transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
              style={{
                position: 'absolute',
                borderRadius: '50%',
                border: '1px solid',
                transform: 'translate(-50%, -50%)',
              }}
            />
          )}

          {/* Label cursor */}
          {isLabeled && (
            <motion.div
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.75 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                transform: 'translate(-50%, -50%)',
                background: '#C9A96E',
                color: '#020203',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '9px',
                letterSpacing: '0.14em',
                fontWeight: 600,
                padding: '6px 13px',
                whiteSpace: 'nowrap',
                borderRadius: '2px',
                textTransform: 'uppercase',
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
              }}
            >
              {label}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
