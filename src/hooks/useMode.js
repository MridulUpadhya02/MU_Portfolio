import { useEffect, useReducer, useRef, useCallback } from 'react';

const MODES = ['focus', 'system', 'play', 'cinema'];

function modeReducer(state, action) {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.mode };
    case 'CYCLE_MODE': {
      const idx = MODES.indexOf(state.mode);
      return { ...state, mode: MODES[(idx + 1) % MODES.length] };
    }
    default:
      return state;
  }
}

export function useMode() {
  const stored = typeof window !== 'undefined'
    ? localStorage.getItem('portfolio-mode') || 'focus'
    : 'focus';

  const [state, dispatch] = useReducer(modeReducer, { mode: stored });
  const prevMode = useRef(state.mode);

  const setMode = useCallback((mode) => {
    dispatch({ type: 'SET_MODE', mode });
  }, []);

  const cycleMode = useCallback(() => {
    dispatch({ type: 'CYCLE_MODE' });
  }, []);

  useEffect(() => {
    if (prevMode.current === state.mode) return;
    const html = document.documentElement;
    // Animate the transition
    html.style.transition = 'background-color 600ms cubic-bezier(0.65,0,0.35,1)';
    html.setAttribute('data-mode', state.mode);
    localStorage.setItem('portfolio-mode', state.mode);
    prevMode.current = state.mode;
  }, [state.mode]);

  // Apply on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-mode', state.mode);
  }, []);

  return { mode: state.mode, setMode, cycleMode, modes: MODES };
}
