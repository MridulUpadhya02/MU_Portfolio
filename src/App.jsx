import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import IntroSequence from './components/intro/IntroSequence';
import SystemNav from './components/nav/SystemNav';
import Hero from './components/hero/Hero';

import { useCursor } from './hooks/useCursor';
import { useMode } from './hooks/useMode';
import { useSound } from './hooks/useSound';
import { useEasterEggs } from './hooks/useEasterEggs';
import { PortfolioDataProvider } from './context/PortfolioDataContext';

// Lazy load heavy sections
import { lazy, Suspense, useEffect } from 'react';

const AdminPanel = lazy(() => import('./components/admin/AdminPanel'));
const HowIThink = lazy(() => import('./components/think/HowIThink'));
const Work = lazy(() => import('./components/work/Work'));
const CaseStudy = lazy(() => import('./components/work/CaseStudy'));
const ARASSimulator = lazy(() => import('./components/aras/ARASSimulator'));
const ImpactEngine = lazy(() => import('./components/impact/ImpactEngine'));
const Timeline = lazy(() => import('./components/timeline/Timeline'));
const Approach = lazy(() => import('./components/approach/Approach'));
const SkillsTools = lazy(() => import('./components/skills/SkillsTools'));
const About = lazy(() => import('./components/about/About'));
const Contact = lazy(() => import('./components/contact/Contact'));
const ProductInspector = lazy(() => import('./components/inspector/ProductInspector'));

function SectionLoader() {
  return (
    <div style={{
      minHeight: '40vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '11px',
      letterSpacing: '0.2em',
      color: 'var(--color-text-tertiary)',
      textTransform: 'uppercase',
    }}>
      ···
    </div>
  );
}

// Easter Egg overlay
function EasterEggOverlay({ type, onClose }) {
  const content = {
    konami: {
      title: 'PM MODE UNLOCKED',
      message: 'Focus: 9000.\nYou found the Konami code.\nMost users don\'t notice what\'s hidden.\nYou did. That\'s a PM instinct.',
      sub: '[ PRESS ESC TO RETURN TO PRODUCT ]',
    },
    nameClick: {
      title: 'STILL ITERATING.',
      message: 'You clicked my name 5 times.\nStill trying to figure out the perfect version.\nAren\'t we all.',
      sub: '[ ACKNOWLEDGED ]',
    },
    productType: {
      title: 'PRODUCT INSPECTOR ACTIVATED',
      message: 'You typed PRODUCT.\nNow you see how this portfolio was built.\nEvery section has a purpose. Every decision, a trade-off.',
      sub: '[ CTRL+SHIFT+P TO TOGGLE ]',
    },
    endDiscovery: {
      title: 'YOU FOUND SOMETHING.',
      message: 'The best PMs explore past the obvious.\nThis isn\'t the end.\nIt\'s where the interesting conversations begin.',
      sub: '[ mridul.upadhya@[CONTENT NEEDED] ]',
    },
  };

  const c = content[type] || content.konami;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        background: 'rgba(6,6,8,0.97)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(20px)',
        padding: '40px',
        textAlign: 'center',
      }}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '11px',
          letterSpacing: '0.3em',
          color: 'var(--color-accent)',
          textTransform: 'uppercase',
          marginBottom: '24px',
        }}>
          ◈ EASTER EGG FOUND ◈
        </div>
        <h2 style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 'clamp(32px, 6vw, 72px)',
          fontWeight: 800,
          color: '#F2F2F2',
          marginBottom: '24px',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
        }}>
          {c.title}
        </h2>
        <p style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 'clamp(14px, 1.6vw, 18px)',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.7,
          maxWidth: '500px',
          whiteSpace: 'pre-line',
          marginBottom: '32px',
        }}>
          {c.message}
        </p>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '10px',
          letterSpacing: '0.2em',
          color: 'var(--color-accent-dim)',
          textTransform: 'uppercase',
        }}>
          {c.sub}
        </div>
        <div style={{
          marginTop: '48px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '10px',
          color: 'var(--color-text-tertiary)',
          letterSpacing: '0.15em',
        }}>
          CLICK ANYWHERE TO CLOSE
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function App() {
  const [currentPath, setCurrentPath] = useState(() => (typeof window !== 'undefined' ? window.location.pathname : '/'));
  const [introComplete, setIntroComplete] = useState(() => (typeof window !== 'undefined' && window.location.pathname === '/admin'));
  const [activeProject, setActiveProject] = useState(null);
  const [showARAS, setShowARAS] = useState(false);
  const [inspectorActive, setInspectorActive] = useState(false);
  const [easterEgg, setEasterEgg] = useState(null);

  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', onLocationChange);
    return () => window.removeEventListener('popstate', onLocationChange);
  }, []);

  const navigateTo = useCallback((path) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
  }, []);

  const { setCursor, resetCursor } = useCursor();
  const { mode, setMode, cycleMode } = useMode();
  const { enabled: soundEnabled, toggle: toggleSound, sounds } = useSound();

  const { handleNameClick } = useEasterEggs({
    onKonami: () => setEasterEgg('konami'),
    onNameClick5: () => setEasterEgg('nameClick'),
    onProductType: () => {
      setInspectorActive(true);
      setEasterEgg('productType');
    },
  });

  const handleProjectOpen = useCallback((project) => {
    setActiveProject(project);
    sounds?.open();
  }, [sounds]);

  const handleProjectClose = useCallback(() => {
    setActiveProject(null);
    sounds?.close();
  }, [sounds]);

  const handleOpenARAS = useCallback(() => {
    setShowARAS(true);
    setActiveProject(null);
    sounds?.open();
  }, [sounds]);

  const handleInspectorToggle = useCallback(() => {
    setInspectorActive(prev => !prev);
  }, []);

  return (
    <PortfolioDataProvider>
      {currentPath === '/admin' ? (
        <Suspense fallback={<SectionLoader />}>
          <AdminPanel onBack={() => navigateTo('/')} />
        </Suspense>
      ) : (
        <>
          {/* Custom cursor — disabled; using native OS cursor */}
          {/* <CustomCursor position={position} cursorState={cursorState} cursorLabel={cursorLabel} isVisible={isVisible} /> */}

          {/* Intro sequence */}
          <AnimatePresence>
            {!introComplete && (
              <IntroSequence onComplete={() => setIntroComplete(true)} />
            )}
          </AnimatePresence>

          {/* Main content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Navigation */}
            <SystemNav
              mode={mode}
              setMode={setMode}
              cycleMode={cycleMode}
              soundEnabled={soundEnabled}
              onSoundToggle={toggleSound}
              setCursor={setCursor}
              resetCursor={resetCursor}
              sounds={sounds}
            />

            {/* Hero */}
            <Hero
              setCursor={setCursor}
              resetCursor={resetCursor}
              onNameClick={handleNameClick}
              sounds={sounds}
            />

            {/* How I Think */}
            <Suspense fallback={<SectionLoader />}>
              <HowIThink
                setCursor={setCursor}
                resetCursor={resetCursor}
                sounds={sounds}
              />
            </Suspense>

            {/* Work / Case Studies */}
            <Suspense fallback={<SectionLoader />}>
              <Work
                setCursor={setCursor}
                resetCursor={resetCursor}
                onProjectOpen={handleProjectOpen}
                sounds={sounds}
              />
            </Suspense>

            {/* Impact Engine */}
            <Suspense fallback={<SectionLoader />}>
              <ImpactEngine
                setCursor={setCursor}
                resetCursor={resetCursor}
              />
            </Suspense>

            {/* Timeline */}
            <Suspense fallback={<SectionLoader />}>
              <Timeline
                setCursor={setCursor}
                resetCursor={resetCursor}
                sounds={sounds}
              />
            </Suspense>

            {/* About */}
            <Suspense fallback={<SectionLoader />}>
              <About
                setCursor={setCursor}
                resetCursor={resetCursor}
              />
            </Suspense>

            {/* Approach */}
            <Suspense fallback={<SectionLoader />}>
              <Approach
                setCursor={setCursor}
                resetCursor={resetCursor}
              />
            </Suspense>

            {/* Skills & Tools */}
            <Suspense fallback={<SectionLoader />}>
              <SkillsTools
                setCursor={setCursor}
                resetCursor={resetCursor}
              />
            </Suspense>

            {/* Contact */}
            <Suspense fallback={<SectionLoader />}>
              <Contact
                setCursor={setCursor}
                resetCursor={resetCursor}
                onEasterEgg={() => setEasterEgg('endDiscovery')}
                sounds={sounds}
              />
            </Suspense>
          </motion.div>

      {/* Case Study overlay */}
      <AnimatePresence>
        {activeProject && (
          <Suspense fallback={null}>
            <CaseStudy
              project={activeProject}
              onClose={handleProjectClose}
              onOpenSimulator={handleOpenARAS}
              setCursor={setCursor}
              resetCursor={resetCursor}
            />
          </Suspense>
        )}
      </AnimatePresence>

      {/* ARAS Simulator */}
      <AnimatePresence>
        {showARAS && (
          <Suspense fallback={null}>
            <ARASSimulator
              onClose={() => setShowARAS(false)}
              setCursor={setCursor}
              resetCursor={resetCursor}
            />
          </Suspense>
        )}
      </AnimatePresence>

      {/* Product Inspector */}
      <Suspense fallback={null}>
        <ProductInspector
          isActive={inspectorActive}
          onToggle={handleInspectorToggle}
        />
      </Suspense>

      {/* Easter Egg overlay */}
      <AnimatePresence>
        {easterEgg && (
          <EasterEggOverlay
            type={easterEgg}
            onClose={() => setEasterEgg(null)}
          />
        )}
      </AnimatePresence>
        </>
      )}
    </PortfolioDataProvider>
  );
}
