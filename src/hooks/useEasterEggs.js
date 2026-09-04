import { useEffect, useRef, useCallback } from 'react';

const KONAMI_SEQUENCE = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

export function useEasterEggs({ onKonami, onNameClick5, onProductType }) {
  const konamiProgress = useRef(0);
  const typedChars = useRef('');
  const nameClickCount = useRef(0);

  const handleKonami = useCallback((key) => {
    if (key === KONAMI_SEQUENCE[konamiProgress.current]) {
      konamiProgress.current++;
      if (konamiProgress.current === KONAMI_SEQUENCE.length) {
        konamiProgress.current = 0;
        onKonami?.();
      }
    } else {
      konamiProgress.current = 0;
    }
  }, [onKonami]);

  const handleSecretWord = useCallback((key) => {
    if (key.length === 1) {
      typedChars.current = (typedChars.current + key.toUpperCase()).slice(-10);
      if (typedChars.current.includes('PRODUCT')) {
        typedChars.current = '';
        onProductType?.();
      }
    }
  }, [onProductType]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      handleKonami(e.key);
      handleSecretWord(e.key);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKonami, handleSecretWord]);

  const handleNameClick = useCallback(() => {
    nameClickCount.current++;
    if (nameClickCount.current >= 5) {
      nameClickCount.current = 0;
      onNameClick5?.();
    }
  }, [onNameClick5]);

  return { handleNameClick };
}
