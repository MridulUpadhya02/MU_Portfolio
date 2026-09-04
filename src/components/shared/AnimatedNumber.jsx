import { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

/* ────────────────────────────────────────────────────
   Utility: parse a value string like '196+', '20–30%', '0%'
   Returns { parts: [{num, suffix}], raw: string }
   ──────────────────────────────────────────────────── */
function parseValue(valueStr) {
  const str = String(valueStr).trim();

  // Range: "20–30%" or "20-30%"
  const rangeMatch = str.match(/^(\d+(?:\.\d+)?)[–-](\d+(?:\.\d+)?)(.*)$/);
  if (rangeMatch) {
    return {
      type: 'range',
      num1: parseFloat(rangeMatch[1]),
      num2: parseFloat(rangeMatch[2]),
      suffix: rangeMatch[3].trim() ?? '',
      raw: str,
    };
  }

  // Single: "196+", "0%", "[?]"
  const singleMatch = str.match(/^(\d+(?:\.\d+)?)(.*)$/);
  if (singleMatch) {
    return {
      type: 'single',
      num: parseFloat(singleMatch[1]),
      suffix: singleMatch[2].trim() ?? '',
      raw: str,
    };
  }

  // Non-numeric (e.g. "[?]")
  return { type: 'static', raw: str };
}

/* ────────────────────────────────────────────────────
   useCounter — counts from 0 to `target` over `duration` ms
   Returns current display number (rounded)
   ──────────────────────────────────────────────────── */
function useCounter(target, duration, active) {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    if (!active || target === 0) return;

    const start = performance.now();
    startRef.current = start;

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);

      // easeOut cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, target, duration]);

  return count;
}

/* ────────────────────────────────────────────────────
   ANIMATED NUMBER COMPONENT
   ──────────────────────────────────────────────────── */
export default function AnimatedNumber({
  value,
  label,
  description,
  accentColor,
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.4 });
  const parsed = parseValue(value);

  const DURATION = 1200;

  const count1 = useCounter(
    parsed.type === 'range' ? parsed.num1 : parsed.type === 'single' ? parsed.num : 0,
    DURATION,
    inView && (parsed.type === 'range' || (parsed.type === 'single' && parsed.num > 0))
  );

  const count2 = useCounter(
    parsed.type === 'range' ? parsed.num2 : 0,
    DURATION,
    inView && parsed.type === 'range'
  );

  /* Build display string */
  const displayValue = () => {
    if (parsed.type === 'static') return parsed.raw;
    if (parsed.type === 'range') {
      return `${count1}–${count2}${parsed.suffix}`;
    }
    // Single
    if (parsed.num === 0) return parsed.raw; // "0%" no animation needed
    return `${count1}${parsed.suffix}`;
  };

  const accent = accentColor ?? 'var(--color-accent)';

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      {/* Number */}
      <div
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 'clamp(36px, 5vw, 64px)',
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: '-0.02em',
          color: inView ? accent : 'var(--color-text-tertiary)',
          transition: 'color 400ms ease',
          willChange: 'transform',
        }}
        aria-label={`${label}: ${value}`}
      >
        {displayValue()}
      </div>

      {/* Label */}
      {label && (
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 'clamp(9px, 0.9vw, 10px)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--color-text-secondary)',
            marginTop: '4px',
          }}
        >
          {label}
        </div>
      )}

      {/* Description */}
      {description && (
        <div
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(11px, 1vw, 13px)',
            color: 'var(--color-text-tertiary)',
            lineHeight: 1.4,
            maxWidth: '200px',
          }}
        >
          {description}
        </div>
      )}
    </div>
  );
}
