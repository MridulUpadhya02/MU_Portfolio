import { useRef, useCallback, useState } from 'react';

export function useSound() {
  const [enabled, setEnabled] = useState(false);
  const audioCtxRef = useRef(null);

  const getCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playTone = useCallback((freq, duration = 0.08, type = 'sine', gain = 0.06) => {
    if (!enabled) return;
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gainNode.gain.setValueAtTime(gain, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Silently fail
    }
  }, [enabled, getCtx]);

  const sounds = {
    click: () => playTone(440, 0.06, 'square', 0.04),
    hover: () => playTone(660, 0.04, 'sine', 0.02),
    open: () => {
      playTone(300, 0.1, 'sine', 0.05);
      setTimeout(() => playTone(500, 0.1, 'sine', 0.04), 60);
    },
    close: () => {
      playTone(500, 0.08, 'sine', 0.04);
      setTimeout(() => playTone(300, 0.1, 'sine', 0.03), 50);
    },
    success: () => {
      playTone(440, 0.08, 'sine', 0.05);
      setTimeout(() => playTone(550, 0.08, 'sine', 0.05), 80);
      setTimeout(() => playTone(660, 0.12, 'sine', 0.05), 160);
    },
    transition: () => playTone(220, 0.2, 'sine', 0.03),
    easter: () => {
      const notes = [261, 330, 392, 523, 659];
      notes.forEach((n, i) => setTimeout(() => playTone(n, 0.15, 'sine', 0.06), i * 100));
    },
  };

  const toggle = useCallback(() => {
    setEnabled(prev => !prev);
    // Resume AudioContext on user gesture
    if (!enabled) {
      try {
        getCtx();
      } catch {
        // Silently fail
      }
    }
  }, [enabled, getCtx]);

  return { enabled, toggle, sounds };
}
