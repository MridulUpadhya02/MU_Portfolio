import { useEffect, useState, useRef, useCallback } from 'react';

// Cursor state types
export const CURSOR_STATES = {
  DEFAULT: 'default',
  HOVER: 'hover',
  EXPLORE: 'explore',
  CASE: 'case',
  VIEW: 'view',
  SECRET: 'secret',
  DRAG: 'drag',
  DISABLED: 'disabled',
};

export function useCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [cursorState, setCursorState] = useState(CURSOR_STATES.DEFAULT);
  const [cursorLabel, setCursorLabel] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const rafRef = useRef(null);
  const targetPos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });

  const lerp = (start, end, factor) => start + (end - start) * factor;

  useEffect(() => {
    // Check if touch device
    if (window.matchMedia('(hover: none)').matches) return;

    const handleMouseMove = (e) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const animate = () => {
      currentPos.current = {
        x: lerp(currentPos.current.x, targetPos.current.x, 0.14),
        y: lerp(currentPos.current.y, targetPos.current.y, 0.14),
      };
      setPosition({ ...currentPos.current });
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const setCursor = useCallback((state, label = '') => {
    setCursorState(state);
    setCursorLabel(label);
  }, []);

  const resetCursor = useCallback(() => {
    setCursorState(CURSOR_STATES.DEFAULT);
    setCursorLabel('');
  }, []);

  return { position, cursorState, cursorLabel, isVisible, setCursor, resetCursor };
}
