import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolioData, DEFAULT_PORTFOLIO_DATA } from '../../context/PortfolioDataContext';
import PdfPreviewModal from '../shared/PdfPreviewModal';

const AUTH_STORAGE_KEY = 'mridul_hq_auth_token_v1';
const PASSCODE_STORAGE_KEY = 'mridul_hq_passcode_v1';
const DEFAULT_PASSCODE = 'mridul2026';

function getStoredPasscode() {
  try {
    return localStorage.getItem(PASSCODE_STORAGE_KEY) || DEFAULT_PASSCODE;
  } catch {
    return DEFAULT_PASSCODE;
  }
}

function setStoredPasscode(newCode) {
  try {
    localStorage.setItem(PASSCODE_STORAGE_KEY, newCode);
  } catch (e) {
    console.error('Failed to save passcode:', e);
  }
}

/* ─────────────────────────────────────────────────────────────
   AUTHENTICATION LOGIN GATE
───────────────────────────────────────────────────────────── */
function AdminLoginGate({ onLoginSuccess, onBack }) {
  const [passcode, setPasscode] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!passcode) return;
    setLoading(true);
    setError(false);

    setTimeout(() => {
      const stored = getStoredPasscode();
      if (passcode.trim() === stored.trim()) {
        const token = `auth_token_${Date.now()}`;
        if (rememberMe) {
          localStorage.setItem(AUTH_STORAGE_KEY, token);
        } else {
          sessionStorage.setItem(AUTH_STORAGE_KEY, token);
        }
        onLoginSuccess();
      } else {
        setError(true);
        setLoading(false);
      }
    }, 350);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#07070A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      color: '#FFFFFF',
    }}>
      {/* Ambient glowing orbs */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        left: '20%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(200,242,62,0.06) 0%, transparent 70%)',
        filter: 'blur(70px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-15%',
        right: '20%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(155,127,255,0.05) 0%, transparent 70%)',
        filter: 'blur(70px)',
        pointerEvents: 'none',
      }} />

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'rgba(14, 14, 20, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          padding: 'clamp(28px, 5vw, 40px)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(200, 242, 62, 0.04)',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Glowing badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={{
            background: 'rgba(200, 242, 62, 0.1)',
            border: '1px solid rgba(200, 242, 62, 0.3)',
            borderRadius: '999px',
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#C8F23E',
              boxShadow: '0 0 10px #C8F23E',
            }} />
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: '#C8F23E',
              textTransform: 'uppercase',
            }}>
              HQ // ACCESS CONTROL
            </span>
          </div>
        </div>

        {/* Title & subtitle */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            margin: '0 0 8px',
            color: '#FFFFFF',
          }}>
            Authentication Required
          </h1>
          <p style={{
            fontSize: '13px',
            color: 'rgba(255, 255, 255, 0.55)',
            lineHeight: 1.5,
            margin: 0,
          }}>
            Enter the master security key to access the portfolio command center.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{
              display: 'block',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.6)',
              marginBottom: '8px',
            }}>
              Master Security Key
            </label>
            <motion.div
              animate={error ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
              transition={{ duration: 0.4 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${error ? '#FF5555' : 'rgba(255, 255, 255, 0.12)'}`,
                borderRadius: '12px',
                padding: '0 12px',
                transition: 'border-color 200ms ease',
              }}
            >
              <input
                type={showPass ? 'text' : 'password'}
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="Enter passcode..."
                autoFocus
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  color: '#FFFFFF',
                  padding: '12px 0',
                  fontSize: '14px',
                  outline: 'none',
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: showPass ? '0.04em' : '0.2em',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.45)',
                  cursor: 'pointer',
                  padding: '4px 6px',
                  fontSize: '13px',
                }}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </motion.div>
          </div>

          {/* Error notice */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  color: '#FF7777',
                  fontSize: '12px',
                  background: 'rgba(255, 80, 80, 0.1)',
                  border: '1px solid rgba(255, 80, 80, 0.25)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                <span>⚠</span>
                <span>Access Denied: Invalid security key.</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Remember me toggle */}
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.65)',
            cursor: 'pointer',
            userSelect: 'none',
          }}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ accentColor: '#C8F23E', cursor: 'pointer' }}
            />
            Keep me logged in on this browser
          </label>

          {/* Submit button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: '#C8F23E',
              border: 'none',
              borderRadius: '12px',
              padding: '13px 20px',
              color: '#08080C',
              fontSize: '14px',
              fontWeight: 800,
              cursor: loading ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '8px',
              boxShadow: '0 8px 24px rgba(200, 242, 62, 0.3)',
              transition: 'box-shadow 200ms ease',
            }}
          >
            {loading ? 'Verifying Key...' : 'Authorize & Enter HQ →'}
          </motion.button>
        </form>

        {/* Footer info & return link */}
        <div style={{
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
        }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            color: 'rgba(255, 255, 255, 0.4)',
            textAlign: 'center',
          }}>
            Default passcode: <span style={{ color: '#C8F23E', background: 'rgba(200,242,62,0.1)', padding: '2px 6px', borderRadius: '4px' }}>mridul2026</span>
          </div>

          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'; }}
          >
            ← Return to Live Portfolio
          </button>
        </div>
      </motion.div>
    </div>
  );
}

const TABS = [
  { id: 'dashboard', label: 'Overview', icon: '⚡' },
  { id: 'hero', label: 'Hero (01)', icon: '👤' },
  { id: 'think', label: 'How I Think (02)', icon: '🧠' },
  { id: 'projects', label: 'Projects (03-A)', icon: '💼' },
  { id: 'caseStudies', label: 'Case Studies (03-B)', icon: '📖' },
  { id: 'impact', label: 'Impact (04)', icon: '📊' },
  { id: 'timeline', label: 'Timeline (05)', icon: '⏳' },
  { id: 'about', label: 'About & Bio (06)', icon: '📝' },
  { id: 'approach', label: 'Approach (07)', icon: '🔄' },
  { id: 'skills', label: 'Skills & Tools (08)', icon: '🛠️' },
  { id: 'contact', label: 'Contact Info (09)', icon: '📬' },
  { id: 'raw', label: 'JSON Backup', icon: '💾' },
];

export default function AdminPanel({ onBack }) {
  const { data, updateSection, updateFullData, resetToDefaults, hasCustomizations } = usePortfolioData();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return Boolean(sessionStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem(AUTH_STORAGE_KEY));
    } catch {
      return false;
    }
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleExport = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mridul-portfolio-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported successfully!');
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        updateFullData(parsed);
        showToast('Backup restored successfully!');
      } catch {
        alert('Invalid JSON file. Please check the file and try again.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    if (window.confirm('Reset all changes back to factory default? Any custom inputs will be cleared.')) {
      resetToDefaults();
      showToast('Reset to original default content!');
    }
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLoginGate onLoginSuccess={() => setIsAuthenticated(true)} onBack={onBack} />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#07070A',
      color: '#EEEEEE',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Top Header */}
      <header style={{
        background: 'rgba(12, 12, 18, 0.95)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '12px clamp(16px, 4vw, 40px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        {/* Left branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: 'rgba(200, 242, 62, 0.12)',
            border: '1px solid rgba(200, 242, 62, 0.35)',
            color: '#C8F23E',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            fontWeight: 800,
            padding: '5px 10px',
            borderRadius: '8px',
            letterSpacing: '0.08em',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#C8F23E',
              boxShadow: '0 0 8px #C8F23E',
            }} />
            HQ ADMIN
          </div>
          <div>
            <h1 style={{ fontSize: '15px', fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>
              Portfolio Control Center
            </h1>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              color: hasCustomizations ? '#C8F23E' : 'rgba(255,255,255,0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <span>●</span>
              <span>{hasCustomizations ? 'Custom live data active (LocalStorage)' : 'Default system data active'}</span>
            </div>
          </div>
        </div>

        {/* Right action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".json"
            style={{ display: 'none' }}
          />

          <button
            onClick={handleExport}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#DDD',
              borderRadius: '8px',
              padding: '7px 12px',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 500,
            }}
          >
            <span>↓</span> Export
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#DDD',
              borderRadius: '8px',
              padding: '7px 12px',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 500,
            }}
          >
            <span>↑</span> Import
          </button>

          <button
            onClick={handleReset}
            style={{
              background: 'rgba(255, 60, 60, 0.08)',
              border: '1px solid rgba(255, 60, 60, 0.25)',
              color: '#FF8888',
              borderRadius: '8px',
              padding: '7px 12px',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 500,
            }}
          >
            <span>↺</span> Reset
          </button>

          <button
            onClick={handleLogout}
            title="Sign out of HQ Admin"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#FF9999',
              borderRadius: '8px',
              padding: '7px 12px',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 500,
            }}
          >
            <span>🔒</span> Logout
          </button>

          <button
            onClick={onBack}
            style={{
              background: '#C8F23E',
              border: 'none',
              color: '#08080C',
              borderRadius: '8px',
              padding: '7px 16px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 0 16px rgba(200, 242, 62, 0.2)',
            }}
          >
            <span>←</span> Back to Portfolio
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div style={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Navigation Tabs (Sidebar on desktop, scrollable bar on mobile) */}
        <nav style={{
          width: 'clamp(200px, 22vw, 260px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.07)',
          background: 'rgba(10, 10, 14, 0.6)',
          padding: '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          flexShrink: 0,
          overflowY: 'auto',
        }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '9px',
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.3)',
            padding: '8px 12px',
            textTransform: 'uppercase',
          }}>
            PORTFOLIO SECTIONS
          </div>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: isActive ? 'rgba(200, 242, 62, 0.1)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(200, 242, 62, 0.28)' : 'transparent'}`,
                  color: isActive ? '#C8F23E' : 'rgba(255,255,255,0.7)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '13px',
                  fontWeight: isActive ? 700 : 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 180ms ease',
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Content workspace */}
        <main style={{
          flex: 1,
          padding: 'clamp(20px, 3.5vw, 40px)',
          overflowY: 'auto',
          maxWidth: '1000px',
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22 }}
            >
              {activeTab === 'dashboard' && <DashboardTab data={data} setActiveTab={setActiveTab} onBack={onBack} showToast={showToast} />}
              {activeTab === 'hero' && <HeroTab data={data.hero} updateSection={updateSection} showToast={showToast} />}
              {activeTab === 'think' && <ThinkTab data={data.think} updateSection={updateSection} showToast={showToast} />}
              {activeTab === 'projects' && <ProjectsTab data={data.projects} updateSection={updateSection} showToast={showToast} />}
              {activeTab === 'caseStudies' && <CaseStudiesTab data={data.caseStudies} updateSection={updateSection} showToast={showToast} />}
              {activeTab === 'impact' && <ImpactTab data={data.impactEngine} updateSection={updateSection} showToast={showToast} />}
              {activeTab === 'timeline' && <TimelineTab data={data.timeline} updateSection={updateSection} showToast={showToast} />}
              {activeTab === 'about' && <AboutTab data={data.personal} updateSection={updateSection} showToast={showToast} />}
              {activeTab === 'approach' && <ApproachTab data={data.approach} updateSection={updateSection} showToast={showToast} />}
              {activeTab === 'skills' && <SkillsTab skills={data.skills} tools={data.tools} updateSection={updateSection} showToast={showToast} />}
              {activeTab === 'contact' && <ContactTab data={data.contact} updateSection={updateSection} showToast={showToast} />}
              {activeTab === 'raw' && <RawDataTab data={data} updateFullData={updateFullData} showToast={showToast} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Floating Save Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 9999,
              background: '#C8F23E',
              color: '#07070A',
              padding: '10px 20px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '13px',
              boxShadow: '0 8px 28px rgba(200, 242, 62, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>✓</span> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SecurityCard({ showToast }) {
  const [current, setCurrent] = useState('');
  const [newCode, setNewCode] = useState('');
  const [confirmCode, setConfirmCode] = useState('');
  const [msg, setMsg] = useState(null);

  const handleUpdate = (e) => {
    e.preventDefault();
    const stored = getStoredPasscode();
    if (current.trim() !== stored.trim()) {
      setMsg({ type: 'error', text: 'Current passcode is incorrect.' });
      return;
    }
    if (!newCode || newCode.length < 4) {
      setMsg({ type: 'error', text: 'New passcode must be at least 4 characters.' });
      return;
    }
    if (newCode !== confirmCode) {
      setMsg({ type: 'error', text: 'New passcodes do not match.' });
      return;
    }
    setStoredPasscode(newCode.trim());
    setCurrent('');
    setNewCode('');
    setConfirmCode('');
    setMsg({ type: 'success', text: 'Master passcode updated successfully!' });
    showToast?.('Master passcode updated!');
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '28px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>🔐</span>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 2px' }}>Admin Security & Master Passcode</h3>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
              Update the master security key required to log into this HQ control panel.
            </p>
          </div>
        </div>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '10px',
          color: '#C8F23E',
          background: 'rgba(200,242,62,0.08)',
          border: '1px solid rgba(200,242,62,0.2)',
          padding: '4px 10px',
          borderRadius: '6px',
        }}>
          PASSCODE PROTECTED
        </div>
      </div>

      <form onSubmit={handleUpdate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', alignItems: 'flex-end' }}>
        <div>
          <label style={{ display: 'block', fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>
            Current Passcode
          </label>
          <input
            type="password"
            placeholder="Current key"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            style={inputStyle}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>
            New Passcode
          </label>
          <input
            type="password"
            placeholder="New key (min 4 chars)"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            style={inputStyle}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>
            Confirm New Passcode
          </label>
          <input
            type="password"
            placeholder="Repeat new key"
            value={confirmCode}
            onChange={(e) => setConfirmCode(e.target.value)}
            style={inputStyle}
            required
          />
        </div>

        <button
          type="submit"
          style={{
            background: '#C8F23E',
            border: 'none',
            color: '#08080C',
            borderRadius: '8px',
            padding: '11px 18px',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
            height: '42px',
            whiteSpace: 'nowrap',
          }}
        >
          Update Passcode
        </button>
      </form>

      {msg && (
        <div style={{
          marginTop: '12px',
          fontSize: '12px',
          fontFamily: "'JetBrains Mono', monospace",
          color: msg.type === 'error' ? '#FF7777' : '#C8F23E',
          background: msg.type === 'error' ? 'rgba(255,80,80,0.1)' : 'rgba(200,242,62,0.1)',
          border: `1px solid ${msg.type === 'error' ? 'rgba(255,80,80,0.25)' : 'rgba(200,242,62,0.25)'}`,
          padding: '8px 12px',
          borderRadius: '8px',
        }}>
          {msg.text}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TAB: DASHBOARD OVERVIEW
───────────────────────────────────────────────────────────── */
function DashboardTab({ data, setActiveTab, onBack, showToast }) {
  const cards = [
    { title: 'Hero Identity', count: `${data.hero?.name || 'Mridul'} · ${data.hero?.title || 'PM'}`, tab: 'hero', icon: '👤' },
    { title: 'Thinking Nodes', count: `${(data.think?.nodes || []).length} reasoning nodes`, tab: 'think', icon: '🧠' },
    { title: 'Shipped Projects', count: `${(data.projects || []).length} showcase projects`, tab: 'projects', icon: '💼' },
    { title: 'Case Studies', count: `${(data.caseStudies || []).length} deep dive analyses`, tab: 'caseStudies', icon: '📖' },
    { title: 'Impact Engine', count: `${(data.impactEngine?.metrics || []).length} impact metrics`, tab: 'impact', icon: '📊' },
    { title: 'Career Timeline', count: `${(data.timeline || []).length} career stages`, tab: 'timeline', icon: '⏳' },
    { title: 'About & Bio', count: `${(data.personal?.bio || []).length} bio fragments`, tab: 'about', icon: '📝' },
    { title: 'Approach & Process', count: `${(data.approach || []).length} framework stages`, tab: 'approach', icon: '🔄' },
    { title: 'Skills & Tools', count: `${(data.skills || []).length} skills · ${(data.tools || []).length} tools`, tab: 'skills', icon: '🛠️' },
    { title: 'Contact Coordinates', count: `${data.contact?.email || 'mridulupadhya861@gmail.com'}`, tab: 'contact', icon: '📬' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 8px' }}>System Control Dashboard</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', margin: 0 }}>
          Manage and configure every headline, project, case study, and node in real time. Changes are stored locally in your browser.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '16px',
        marginBottom: '32px',
      }}>
        {cards.map((c) => (
          <div
            key={c.tab}
            onClick={() => setActiveTab(c.tab)}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 200ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(200, 242, 62, 0.4)';
              e.currentTarget.style.background = 'rgba(200, 242, 62, 0.04)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>{c.icon}</div>
            <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>{c.title}</div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              color: 'rgba(200, 242, 62, 0.8)',
            }}>
              {c.count} →
            </div>
          </div>
        ))}
      </div>

      {/* Security & Passcode Management Card */}
      <SecurityCard showToast={showToast} />

      <div style={{
        background: 'rgba(200, 242, 62, 0.05)',
        border: '1px solid rgba(200, 242, 62, 0.2)',
        borderRadius: '16px',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#C8F23E', marginBottom: '4px' }}>
            Ready to view your changes?
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
            Jump right back to the portfolio to test the live updates.
          </div>
        </div>
        <button
          onClick={onBack}
          style={{
            background: '#C8F23E',
            border: 'none',
            color: '#08080C',
            borderRadius: '10px',
            padding: '10px 22px',
            fontSize: '13px',
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          View Live Portfolio →
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TAB: HERO & BIO
───────────────────────────────────────────────────────────── */
function HeroTab({ data, updateSection, showToast }) {
  const [form, setForm] = useState(data || {});
  const pdfInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setForm(data || {});
  }, [data]);

  const handleChange = (field, val) => {
    const next = { ...form, [field]: val };
    setForm(next);
    updateSection('hero', next);
  };

  const handleStatChange = (index, key, val) => {
    const nextStats = [...form.stats];
    nextStats[index] = { ...nextStats[index], [key]: val };
    handleChange('stats', nextStats);
  };

  const handleRolesChange = (val) => {
    const rolesArray = val.split(',').map((s) => s.trim()).filter(Boolean);
    handleChange('roles', rolesArray);
  };

  const handlePdfUpload = (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please select a valid PDF file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('PDF file size exceeds 5MB. Please upload a PDF under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target.result;
      const sizeStr = file.size < 1024 * 1024
        ? `${(file.size / 1024).toFixed(1)} KB`
        : `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

      const next = {
        ...form,
        resumeUrl: base64Data,
        resumeFileName: file.name,
        resumeFileSize: sizeStr,
        resumeUpdatedAt: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      };
      setForm(next);
      updateSection('hero', next);
      showToast(`Resume PDF "${file.name}" uploaded successfully!`);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePdf = () => {
    if (window.confirm('Remove this uploaded resume PDF and revert to default?')) {
      const next = {
        ...form,
        resumeUrl: '/resume.pdf',
        resumeFileName: '',
        resumeFileSize: '',
        resumeUpdatedAt: null,
      };
      setForm(next);
      updateSection('hero', next);
      showToast('Resume reset to default.');
    }
  };

  const hasUploadedPdf = Boolean(form.resumeFileName || (form.resumeUrl && form.resumeUrl.startsWith('data:application/pdf')));

  return (
    <SectionWrapper
      title="Hero Section & Identity"
      desc="Control the first impression visitors receive on entering the site."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        <InputGroup label="Greeting">
          <input
            value={form.greeting || ''}
            onChange={(e) => handleChange('greeting', e.target.value)}
            style={inputStyle}
          />
        </InputGroup>

        <InputGroup label="Name">
          <input
            value={form.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            style={inputStyle}
          />
        </InputGroup>

        <InputGroup label="Main Title">
          <input
            value={form.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            style={inputStyle}
          />
        </InputGroup>

        <InputGroup label="Status Badge">
          <input
            value={form.badge || ''}
            onChange={(e) => handleChange('badge', e.target.value)}
            style={inputStyle}
          />
        </InputGroup>
      </div>

      <InputGroup label="Tagline (Interactive words in Hero)">
        <textarea
          rows={3}
          value={form.tagline || ''}
          onChange={(e) => handleChange('tagline', e.target.value)}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </InputGroup>

      <InputGroup label="Role Tags (comma-separated)">
        <input
          value={(form.roles || []).join(', ')}
          onChange={(e) => handleRolesChange(e.target.value)}
          style={inputStyle}
        />
      </InputGroup>

      <div style={{ marginTop: '24px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>Hero Metric Stats (4 items)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {(form.stats || []).map((stat, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '14px', borderRadius: '12px' }}>
              <div style={{ fontSize: '11px', color: '#C8F23E', fontFamily: "'JetBrains Mono', monospace", marginBottom: '8px' }}>
                STAT 0{i + 1}
              </div>
              <input
                placeholder="Value (e.g. 2+)"
                value={stat.value}
                onChange={(e) => handleStatChange(i, 'value', e.target.value)}
                style={{ ...inputStyle, marginBottom: '8px' }}
              />
              <input
                placeholder="Label"
                value={stat.label}
                onChange={(e) => handleStatChange(i, 'label', e.target.value)}
                style={inputStyle}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── RESUME PDF UPLOAD ── */}
      <div style={{ marginTop: '24px' }}>
        <input
          type="file"
          ref={pdfInputRef}
          accept="application/pdf,.pdf"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handlePdfUpload(f);
            e.target.value = '';
          }}
          style={{ display: 'none' }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#C8F23E', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
            Resume Document (PDF)
          </label>
          {form.resumeUpdatedAt && (
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontFamily: "'JetBrains Mono', monospace" }}>
              Uploaded {form.resumeUpdatedAt}
            </span>
          )}
        </div>

        {hasUploadedPdf ? (
          <div style={{
            background: 'rgba(200, 242, 62, 0.04)',
            border: '1px solid rgba(200, 242, 62, 0.25)',
            borderRadius: '14px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'rgba(255, 75, 75, 0.15)',
                border: '1px solid rgba(255, 75, 75, 0.35)',
                color: '#FF6B6B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 800,
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: '0.05em',
                flexShrink: 0,
              }}>
                PDF
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', marginBottom: '2px', wordBreak: 'break-all' }}>
                  {form.resumeFileName || 'Custom_Resume.pdf'}
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontFamily: "'JetBrains Mono', monospace" }}>
                  {form.resumeFileSize || 'PDF Document'} · Active on portfolio & ready for download
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {form.resumeUrl && (
                <a
                  href={form.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={form.resumeFileName || 'Mridul_Upadhya_Resume.pdf'}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#EEEEEE',
                    borderRadius: '8px',
                    padding: '7px 14px',
                    fontSize: '12px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  👁️ Preview
                </a>
              )}
              <button
                type="button"
                onClick={() => pdfInputRef.current?.click()}
                style={{
                  background: 'rgba(200, 242, 62, 0.15)',
                  border: '1px solid rgba(200, 242, 62, 0.35)',
                  color: '#C8F23E',
                  borderRadius: '8px',
                  padding: '7px 14px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                ↑ Replace PDF
              </button>
              <button
                type="button"
                onClick={handleRemovePdf}
                style={{
                  background: 'rgba(255, 75, 75, 0.1)',
                  border: '1px solid rgba(255, 75, 75, 0.25)',
                  color: '#FF8888',
                  borderRadius: '8px',
                  padding: '7px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Reset
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => pdfInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file) handlePdfUpload(file);
            }}
            style={{
              border: `2px dashed ${isDragging ? '#C8F23E' : 'rgba(255,255,255,0.18)'}`,
              background: isDragging ? 'rgba(200, 242, 62, 0.08)' : 'rgba(255,255,255,0.02)',
              borderRadius: '16px',
              padding: '30px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 200ms ease',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📄</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
              Click or drag & drop to upload your Resume PDF
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', fontFamily: "'JetBrains Mono', monospace" }}>
              Accepts .pdf files up to 5MB · Directly downloaded by visitors when clicking "Download Resume"
            </div>
            <button
              type="button"
              style={{
                marginTop: '14px',
                background: '#C8F23E',
                border: 'none',
                color: '#07070A',
                borderRadius: '8px',
                padding: '8px 18px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                pointerEvents: 'none',
              }}
            >
              Select PDF File
            </button>
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <InputGroup label="LinkedIn URL">
          <input
            value={form.linkedinUrl || ''}
            onChange={(e) => handleChange('linkedinUrl', e.target.value)}
            style={inputStyle}
          />
        </InputGroup>
      </div>

      <SaveButton onClick={() => {
        updateSection('hero', form);
        showToast('Hero section saved & live on portfolio!');
      }} />
    </SectionWrapper>
  );
}

/* ─────────────────────────────────────────────────────────────
   TAB: HOW I THINK (NODES)
───────────────────────────────────────────────────────────── */
function ThinkTab({ data, updateSection, showToast }) {
  const [form, setForm] = useState(data || { nodes: [] });

  useEffect(() => {
    setForm(data || { nodes: [] });
  }, [data]);

  const handleProblemChange = (val) => {
    const next = { ...form, problemStatement: val };
    setForm(next);
    updateSection('think', next);
  };

  const handleNodeUpdate = (index, key, val) => {
    const nextNodes = [...form.nodes];
    nextNodes[index] = { ...nextNodes[index], [key]: val };
    const next = { ...form, nodes: nextNodes };
    setForm(next);
    updateSection('think', next);
  };

  const handleAddNode = () => {
    const newNode = {
      id: `node-${Date.now()}`,
      label: 'NEW?',
      question: 'What is the core question?',
      answer: 'Explain your reasoning and methodology here.',
      framework: 'DISCOVER',
    };
    const next = { ...form, nodes: [...form.nodes, newNode] };
    setForm(next);
    updateSection('think', next);
    showToast('New thinking node added!');
  };

  const handleDeleteNode = (index) => {
    if (window.confirm('Delete this reasoning node?')) {
      const nextNodes = form.nodes.filter((_, i) => i !== index);
      const next = { ...form, nodes: nextNodes };
      setForm(next);
      updateSection('think', next);
      showToast('Node removed.');
    }
  };

  return (
    <SectionWrapper
      title="How I Think — Reasoning Architecture"
      desc="Manage your problem statement and interactive PM reasoning nodes."
    >
      <InputGroup label="Center Problem Statement">
        <input
          value={form.problemStatement || ''}
          onChange={(e) => handleProblemChange(e.target.value)}
          style={inputStyle}
        />
      </InputGroup>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '28px 0 16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>
          Reasoning Nodes ({form.nodes.length})
        </h3>
        <button
          onClick={handleAddNode}
          style={{
            background: 'rgba(200, 242, 62, 0.15)',
            border: '1px solid rgba(200, 242, 62, 0.35)',
            color: '#C8F23E',
            borderRadius: '8px',
            padding: '6px 14px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          + Add Node
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {form.nodes.map((node, i) => (
          <div
            key={node.id || i}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '14px',
              padding: '18px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                fontWeight: 700,
                color: '#C8F23E',
              }}>
                NODE 0{i + 1}: {node.label}
              </span>
              <button
                onClick={() => handleDeleteNode(i)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FF6666',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', marginBottom: '10px' }}>
              <input
                placeholder="Label (e.g. WHY?)"
                value={node.label}
                onChange={(e) => handleNodeUpdate(i, 'label', e.target.value)}
                style={inputStyle}
              />
              <input
                placeholder="Framework Stage (e.g. DISCOVER, BUILD)"
                value={node.framework}
                onChange={(e) => handleNodeUpdate(i, 'framework', e.target.value)}
                style={inputStyle}
              />
            </div>

            <input
              placeholder="Question prompt"
              value={node.question}
              onChange={(e) => handleNodeUpdate(i, 'question', e.target.value)}
              style={{ ...inputStyle, marginBottom: '10px' }}
            />

            <textarea
              placeholder="Detailed answer / framework logic"
              rows={3}
              value={node.answer}
              onChange={(e) => handleNodeUpdate(i, 'answer', e.target.value)}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>
        ))}
      </div>

      <SaveButton onClick={() => {
        updateSection('think', form);
        showToast('How I Think section saved & live on portfolio!');
      }} />
    </SectionWrapper>
  );
}

/* ─────────────────────────────────────────────────────────────
   TAB: PROJECTS (03-A)
───────────────────────────────────────────────────────────── */
function ProjectsTab({ data, updateSection, showToast }) {
  const [list, setList] = useState(data || []);

  useEffect(() => {
    setList(data || []);
  }, [data]);

  const handleUpdate = (index, key, val) => {
    const next = [...list];
    if (key === 'tags') {
      next[index] = { ...next[index], tags: val.split(',').map((t) => t.trim()).filter(Boolean) };
    } else if (key === 'metricValue') {
      next[index] = { ...next[index], metric: { ...next[index].metric, value: val } };
    } else if (key === 'metricLabel') {
      next[index] = { ...next[index], metric: { ...next[index].metric, label: val } };
    } else {
      next[index] = { ...next[index], [key]: val };
    }
    setList(next);
    updateSection('projects', next);
  };

  const handleAdd = () => {
    const newProj = {
      id: `proj-${Date.now()}`,
      title: 'New Project Title',
      category: 'Product / B2B',
      year: new Date().getFullYear().toString(),
      description: 'Describe the key objective and outcome of this project.',
      tags: ['Product', 'Strategy'],
      accentColor: '#4A90A0',
      metric: { value: '100+', label: 'Impact Metric' },
      link: '',
    };
    const next = [...list, newProj];
    setList(next);
    updateSection('projects', next);
    showToast('New project created!');
  };

  const handleDelete = (index) => {
    if (window.confirm('Delete this project?')) {
      const next = list.filter((_, i) => i !== index);
      setList(next);
      updateSection('projects', next);
      showToast('Project deleted.');
    }
  };

  return (
    <SectionWrapper
      title="Shipped Projects (03-A)"
      desc="Manage the expandable project cards displayed in Section 03-A."
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <button
          onClick={handleAdd}
          style={{
            background: '#C8F23E',
            border: 'none',
            color: '#07070A',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          + Add Project
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {list.map((proj, i) => (
          <div
            key={proj.id || i}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderLeft: `4px solid ${proj.accentColor || '#C8F23E'}`,
              borderRadius: '16px',
              padding: '20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ fontSize: '16px', fontWeight: 800 }}>{proj.title}</div>
              <button
                onClick={() => handleDelete(i)}
                style={{ background: 'none', border: 'none', color: '#FF6666', fontSize: '11px', cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <InputGroup label="Title">
                <input
                  value={proj.title}
                  onChange={(e) => handleUpdate(i, 'title', e.target.value)}
                  style={inputStyle}
                />
              </InputGroup>
              <InputGroup label="Category">
                <input
                  value={proj.category}
                  onChange={(e) => handleUpdate(i, 'category', e.target.value)}
                  style={inputStyle}
                />
              </InputGroup>
              <InputGroup label="Year">
                <input
                  value={proj.year}
                  onChange={(e) => handleUpdate(i, 'year', e.target.value)}
                  style={inputStyle}
                />
              </InputGroup>
            </div>

            <InputGroup label="Description">
              <textarea
                rows={3}
                value={proj.description}
                onChange={(e) => handleUpdate(i, 'description', e.target.value)}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </InputGroup>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', marginTop: '12px' }}>
              <InputGroup label="Metric Number">
                <input
                  value={proj.metric?.value || ''}
                  onChange={(e) => handleUpdate(i, 'metricValue', e.target.value)}
                  style={inputStyle}
                />
              </InputGroup>
              <InputGroup label="Metric Label">
                <input
                  value={proj.metric?.label || ''}
                  onChange={(e) => handleUpdate(i, 'metricLabel', e.target.value)}
                  style={inputStyle}
                />
              </InputGroup>
              <InputGroup label="Accent Color">
                <input
                  type="color"
                  value={proj.accentColor || '#C8F23E'}
                  onChange={(e) => handleUpdate(i, 'accentColor', e.target.value)}
                  style={{ ...inputStyle, padding: '2px', height: '38px', cursor: 'pointer' }}
                />
              </InputGroup>
              <InputGroup label="Tags (comma-separated)">
                <input
                  value={(proj.tags || []).join(', ')}
                  onChange={(e) => handleUpdate(i, 'tags', e.target.value)}
                  style={inputStyle}
                />
              </InputGroup>
            </div>

            <div style={{ marginTop: '12px' }}>
              <InputGroup label="Project Live Link / URL (optional — leaves 'Live' button hidden if blank)">
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="url"
                    placeholder="https://example.com (or enter domain, e.g. mysite.com)"
                    value={proj.link || ''}
                    onChange={(e) => handleUpdate(i, 'link', e.target.value)}
                    style={{ ...inputStyle, paddingRight: proj.link?.trim() ? '82px' : '12px' }}
                  />
                  {proj.link && proj.link.trim() && (
                    <a
                      href={proj.link.startsWith('http') ? proj.link.trim() : `https://${proj.link.trim()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        position: 'absolute',
                        right: '8px',
                        background: 'rgba(200,242,62,0.15)',
                        color: '#C8F23E',
                        border: '1px solid rgba(200,242,62,0.3)',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        fontSize: '11px',
                        fontWeight: 700,
                        fontFamily: "'JetBrains Mono', monospace",
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      Test ↗
                    </a>
                  )}
                </div>
              </InputGroup>
            </div>
          </div>
        ))}
      </div>

      <SaveButton onClick={() => {
        updateSection('projects', list);
        showToast('Projects saved & live on portfolio!');
      }} />
    </SectionWrapper>
  );
}

/* ─────────────────────────────────────────────────────────────
   TAB: CASE STUDIES (03-B)
───────────────────────────────────────────────────────────── */
function CaseStudiesTab({ data, updateSection, showToast }) {
  const [list, setList] = useState(data || []);
  const [previewPdf, setPreviewPdf] = useState(null);

  useEffect(() => {
    setList(data || []);
  }, [data]);

  const handleUpdate = (index, key, val) => {
    const next = [...list];
    if (key === 'tags') {
      next[index] = { ...next[index], tags: val.split(',').map((t) => t.trim()).filter(Boolean) };
    } else {
      next[index] = { ...next[index], [key]: val };
    }
    setList(next);
    updateSection('caseStudies', next);
  };

  const handleImpactUpdate = (studyIndex, impactIndex, field, val) => {
    const next = [...list];
    const impacts = [...next[studyIndex].impact];
    impacts[impactIndex] = { ...impacts[impactIndex], [field]: val };
    next[studyIndex] = { ...next[studyIndex], impact: impacts };
    setList(next);
    updateSection('caseStudies', next);
  };

  const handlePdfUpload = (index, file) => {
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      showToast('Please select a valid PDF file (.pdf).', 'error');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      showToast('File is too large. Please upload a PDF under 8 MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target.result;
      const sizeStr = file.size < 1024 * 1024
        ? `${(file.size / 1024).toFixed(1)} KB`
        : `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

      const next = [...list];
      next[index] = {
        ...next[index],
        pdfUrl: base64Data,
        pdfFileName: file.name,
        pdfFileSize: sizeStr,
        pdfUpdatedAt: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      };
      setList(next);
      updateSection('caseStudies', next);
      showToast(`PDF "${file.name}" uploaded for ${next[index].title}!`);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePdf = (index) => {
    if (window.confirm(`Remove PDF document from "${list[index].title}"?`)) {
      const next = [...list];
      next[index] = {
        ...next[index],
        pdfUrl: null,
        pdfFileName: null,
        pdfFileSize: null,
        pdfUpdatedAt: null,
      };
      setList(next);
      updateSection('caseStudies', next);
      showToast(`PDF removed from "${next[index].title}".`);
    }
  };

  return (
    <SectionWrapper
      title="Deep Dive Case Studies (03-B)"
      desc="Configure detailed case study records, problem statements, and impact metrics."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {list.map((study, i) => (
          <div
            key={study.id || i}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '12px',
                  color: '#C8F23E',
                  fontWeight: 800,
                }}>
                  {study.index || `0${i + 1}`}
                </span>
                <span style={{ fontSize: '18px', fontWeight: 800 }}>{study.title}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <InputGroup label="Title">
                <input
                  value={study.title}
                  onChange={(e) => handleUpdate(i, 'title', e.target.value)}
                  style={inputStyle}
                />
              </InputGroup>
              <InputGroup label="Subtitle">
                <input
                  value={study.subtitle}
                  onChange={(e) => handleUpdate(i, 'subtitle', e.target.value)}
                  style={inputStyle}
                />
              </InputGroup>
              <InputGroup label="Company">
                <input
                  value={study.company}
                  onChange={(e) => handleUpdate(i, 'company', e.target.value)}
                  style={inputStyle}
                />
              </InputGroup>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <InputGroup label="Problem Statement">
                <textarea
                  rows={3}
                  value={study.problem}
                  onChange={(e) => handleUpdate(i, 'problem', e.target.value)}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </InputGroup>
              <InputGroup label="Solution Shipped">
                <textarea
                  rows={3}
                  value={study.solution}
                  onChange={(e) => handleUpdate(i, 'solution', e.target.value)}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </InputGroup>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <InputGroup label="Project Live Link / URL (optional — leaves 'Live' button hidden if blank)">
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="url"
                    placeholder="https://example.com (or enter domain, e.g. mysite.com)"
                    value={study.link || ''}
                    onChange={(e) => handleUpdate(i, 'link', e.target.value)}
                    style={{ ...inputStyle, paddingRight: study.link?.trim() ? '82px' : '12px' }}
                  />
                  {study.link && study.link.trim() && (
                    <a
                      href={study.link.startsWith('http') ? study.link.trim() : `https://${study.link.trim()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        position: 'absolute',
                        right: '8px',
                        background: 'rgba(200,242,62,0.15)',
                        color: '#C8F23E',
                        border: '1px solid rgba(200,242,62,0.3)',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        fontSize: '11px',
                        fontWeight: 700,
                        fontFamily: "'JetBrains Mono', monospace",
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      Test ↗
                    </a>
                  )}
                </div>
              </InputGroup>
            </div>

            {/* Impact Metric Chips */}
            <div style={{ marginTop: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#C8F23E', marginBottom: '8px' }}>
                Impact Metrics
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                {(study.impact || []).map((imp, impIdx) => (
                  <div key={impIdx} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '10px', borderRadius: '8px' }}>
                    <input
                      placeholder="Value (e.g. 196+)"
                      value={imp.value}
                      onChange={(e) => handleImpactUpdate(i, impIdx, 'value', e.target.value)}
                      style={{ ...inputStyle, marginBottom: '6px' }}
                    />
                    <input
                      placeholder="Label"
                      value={imp.label}
                      onChange={(e) => handleImpactUpdate(i, impIdx, 'label', e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Case Study PDF Attachment Section */}
            <div style={{
              marginTop: '16px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '16px 18px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '15px' }}>📄</span>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
                      Case Study PDF Document
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.45)', fontFamily: "'JetBrains Mono', monospace" }}>
                      Visitors can preview and download this document on your portfolio
                    </div>
                  </div>
                </div>

                {study.pdfUrl && (
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '10px',
                    color: '#C8F23E',
                    background: 'rgba(200, 242, 62, 0.12)',
                    border: '1px solid rgba(200, 242, 62, 0.3)',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontWeight: 700,
                  }}>
                    ACTIVE ON PORTFOLIO
                  </span>
                )}
              </div>

              {study.pdfUrl ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 12,
                  background: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                    <div style={{
                      width: 38,
                      height: 38,
                      borderRadius: 8,
                      background: 'rgba(255, 75, 75, 0.15)',
                      border: '1px solid rgba(255, 75, 75, 0.35)',
                      color: '#FF6B6B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: 800,
                      fontFamily: "'JetBrains Mono', monospace",
                      flexShrink: 0,
                    }}>
                      PDF
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '13px',
                          fontWeight: 700,
                          color: '#FFFFFF',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: 'clamp(180px, 30vw, 360px)',
                        }}
                        title={study.pdfFileName || `${study.title}_Case_Study.pdf`}
                      >
                        {study.pdfFileName || `${study.title}_Case_Study.pdf`}
                      </div>
                      <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.45)', fontFamily: "'JetBrains Mono', monospace" }}>
                        {study.pdfFileSize || 'PDF Document'} {study.pdfUpdatedAt && `· Uploaded ${study.pdfUpdatedAt}`}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => setPreviewPdf({
                        url: study.pdfUrl,
                        title: study.title,
                        fileName: study.pdfFileName,
                        fileSize: study.pdfFileSize,
                      })}
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#EEEEEE',
                        borderRadius: '8px',
                        padding: '6px 12px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      👁️ Preview
                    </button>

                    <a
                      href={study.pdfUrl}
                      download={study.pdfFileName || `${study.title}_Case_Study.pdf`}
                      style={{
                        background: 'rgba(200, 242, 62, 0.12)',
                        border: '1px solid rgba(200, 242, 62, 0.35)',
                        color: '#C8F23E',
                        borderRadius: '8px',
                        padding: '6px 12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      ⬇️ Download
                    </a>

                    <label style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#CCCCCC',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}>
                      🔄 Replace
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handlePdfUpload(i, e.target.files[0]);
                          }
                        }}
                        style={{ display: 'none' }}
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => handleRemovePdf(i)}
                      style={{
                        background: 'rgba(255, 80, 80, 0.1)',
                        border: '1px solid rgba(255, 80, 80, 0.25)',
                        color: '#FF6B6B',
                        borderRadius: '8px',
                        padding: '6px 10px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '24px 16px',
                  border: '1px dashed rgba(255, 255, 255, 0.16)',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.01)',
                  cursor: 'pointer',
                  transition: 'border-color 200ms ease, background 200ms ease',
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(200, 242, 62, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                  }}>
                    📄
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#F0F0F0' }}>
                    Click to upload Case Study PDF (PRD, Spec, or Slides)
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)', fontFamily: "'JetBrains Mono', monospace" }}>
                    Supports PDF up to 8 MB · Enables Preview & Download on portfolio
                  </div>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handlePdfUpload(i, e.target.files[0]);
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>
          </div>
        ))}
      </div>

      <SaveButton onClick={() => {
        updateSection('caseStudies', list);
        showToast('Case studies saved & live on portfolio!');
      }} />

      <PdfPreviewModal
        isOpen={Boolean(previewPdf)}
        onClose={() => setPreviewPdf(null)}
        pdfUrl={previewPdf?.url}
        fileName={previewPdf?.fileName}
        title={previewPdf?.title}
        fileSize={previewPdf?.fileSize}
      />
    </SectionWrapper>
  );
}

/* ─────────────────────────────────────────────────────────────
   TAB: SKILLS & TOOLS
───────────────────────────────────────────────────────────── */
function SkillsTab({ skills, tools, updateSection, showToast }) {
  const [skillList, setSkillList] = useState(skills || []);
  const [toolList, setToolList] = useState(tools || []);

  useEffect(() => {
    setSkillList(skills || []);
  }, [skills]);

  useEffect(() => {
    setToolList(tools || []);
  }, [tools]);

  const handleSkillChange = (index, field, val) => {
    const next = [...skillList];
    next[index] = { ...next[index], [field]: field === 'level' ? Number(val) : val };
    setSkillList(next);
    updateSection('skills', next);
  };

  const handleAddSkill = () => {
    const next = [...skillList, { label: 'New PM Skill', level: 85 }];
    setSkillList(next);
    updateSection('skills', next);
  };

  const handleDeleteSkill = (idx) => {
    const next = skillList.filter((_, i) => i !== idx);
    setSkillList(next);
    updateSection('skills', next);
  };

  const handleToolChange = (index, field, val) => {
    const next = [...toolList];
    next[index] = { ...next[index], [field]: val };
    setToolList(next);
    updateSection('tools', next);
  };

  const handleAddTool = () => {
    const next = [...toolList, { name: 'Tool', category: 'Category', icon: '⚡' }];
    setToolList(next);
    updateSection('tools', next);
  };

  const handleDeleteTool = (idx) => {
    const next = toolList.filter((_, i) => i !== idx);
    setToolList(next);
    updateSection('tools', next);
  };

  return (
    <SectionWrapper title="Skills & Tools Arsenal" desc="Manage proficiency bars and stack icons.">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
        {/* Skills Column */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>PM Skills ({skillList.length})</h3>
            <button
              onClick={handleAddSkill}
              style={{
                background: 'rgba(200, 242, 62, 0.15)',
                border: '1px solid rgba(200, 242, 62, 0.35)',
                color: '#C8F23E',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              + Add
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {skillList.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '8px' }}>
                <input
                  value={s.label}
                  onChange={(e) => handleSkillChange(i, 'label', e.target.value)}
                  style={{ ...inputStyle, flex: 2 }}
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={s.level}
                  onChange={(e) => handleSkillChange(i, 'level', e.target.value)}
                  style={{ ...inputStyle, width: '60px', textAlign: 'center' }}
                />
                <span style={{ fontSize: '11px', color: '#C8F23E' }}>%</span>
                <button
                  onClick={() => handleDeleteSkill(i)}
                  style={{ background: 'none', border: 'none', color: '#FF6666', cursor: 'pointer', fontSize: '13px' }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Tools Column */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Tools Stack ({toolList.length})</h3>
            <button
              onClick={handleAddTool}
              style={{
                background: 'rgba(200, 242, 62, 0.15)',
                border: '1px solid rgba(200, 242, 62, 0.35)',
                color: '#C8F23E',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              + Add
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {toolList.map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '8px' }}>
                <input
                  value={t.icon}
                  onChange={(e) => handleToolChange(i, 'icon', e.target.value)}
                  style={{ ...inputStyle, width: '42px', textAlign: 'center' }}
                />
                <input
                  value={t.name}
                  onChange={(e) => handleToolChange(i, 'name', e.target.value)}
                  style={{ ...inputStyle, flex: 2 }}
                />
                <input
                  value={t.category}
                  onChange={(e) => handleToolChange(i, 'category', e.target.value)}
                  style={{ ...inputStyle, flex: 1.5 }}
                />
                <button
                  onClick={() => handleDeleteTool(i)}
                  style={{ background: 'none', border: 'none', color: '#FF6666', cursor: 'pointer', fontSize: '13px' }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SaveButton onClick={() => {
        updateSection('skills', skillList);
        updateSection('tools', toolList);
        showToast('Skills & Tools saved & live on portfolio!');
      }} />
    </SectionWrapper>
  );
}

/* ─────────────────────────────────────────────────────────────
   TAB: CONTACT & SOCIALS
───────────────────────────────────────────────────────────── */
function ContactTab({ data, updateSection, showToast }) {
  const [form, setForm] = useState(data || {});

  useEffect(() => {
    setForm(data || {});
  }, [data]);

  const handleChange = (field, val) => {
    const next = { ...form, [field]: val };
    setForm(next);
    updateSection('contact', next);
  };

  return (
    <SectionWrapper title="Contact Coordinates" desc="Set your contact details and badges.">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        <InputGroup label="Email Address">
          <input
            value={form.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            style={inputStyle}
          />
        </InputGroup>
        <InputGroup label="Location">
          <input
            value={form.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            style={inputStyle}
          />
        </InputGroup>
        <InputGroup label="LinkedIn Profile URL">
          <input
            value={form.linkedin || ''}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            style={inputStyle}
          />
        </InputGroup>
        <InputGroup label="GitHub Profile URL">
          <input
            value={form.github || ''}
            onChange={(e) => handleChange('github', e.target.value)}
            style={inputStyle}
          />
        </InputGroup>
        <InputGroup label="Calendly / Booking URL">
          <input
            value={form.meetingLink || ''}
            onChange={(e) => handleChange('meetingLink', e.target.value)}
            style={inputStyle}
          />
        </InputGroup>
      </div>

      <div style={{ marginTop: '20px' }}>
        <InputGroup label="Section Subtitle">
          <textarea
            rows={3}
            value={form.subtitle || ''}
            onChange={(e) => handleChange('subtitle', e.target.value)}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </InputGroup>
      </div>

      <SaveButton onClick={() => {
        updateSection('contact', form);
        showToast('Contact settings saved & live on portfolio!');
      }} />
    </SectionWrapper>
  );
}

/* ─────────────────────────────────────────────────────────────
   TAB: RAW JSON / BACKUP
───────────────────────────────────────────────────────────── */
function RawDataTab({ data, updateFullData, showToast }) {
  const [text, setText] = useState(() => JSON.stringify(data, null, 2));

  useEffect(() => {
    setText(JSON.stringify(data, null, 2));
  }, [data]);

  const handleApply = () => {
    try {
      const parsed = JSON.parse(text);
      updateFullData(parsed);
      showToast('Raw JSON applied to portfolio successfully!');
    } catch {
      alert('Error parsing JSON. Check syntax and commas.');
    }
  };

  return (
    <SectionWrapper title="Raw JSON Configuration" desc="Direct JSON editor for power users.">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={24}
        style={{
          ...inputStyle,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '11px',
          lineHeight: 1.6,
          resize: 'vertical',
        }}
      />
      <div style={{ marginTop: '16px' }}>
        <button
          onClick={handleApply}
          style={{
            background: '#C8F23E',
            border: 'none',
            color: '#07070A',
            borderRadius: '8px',
            padding: '10px 24px',
            fontSize: '13px',
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          Apply Changes
        </button>
      </div>
    </SectionWrapper>
  );
}

/* ─────────────────────────────────────────────────────────────
   TAB: ABOUT & BIO (06)
───────────────────────────────────────────────────────────── */
function AboutTab({ data, updateSection, showToast }) {
  const [form, setForm] = useState(data || {});

  useEffect(() => {
    setForm(data || {});
  }, [data]);

  const handlePhotoChange = (val) => {
    const next = {
      ...form,
      contact: {
        ...(form.contact || {}),
        photo: val,
      },
    };
    setForm(next);
    updateSection('personal', next);
  };

  const handleFragmentChange = (idx, field, val) => {
    const nextBio = [...(form.bio || [])];
    nextBio[idx] = { ...nextBio[idx], [field]: val };
    const next = { ...form, bio: nextBio };
    setForm(next);
    updateSection('personal', next);
  };

  const handleParaChange = (fragIdx, paraIdx, val) => {
    const nextBio = [...(form.bio || [])];
    const paras = [...(nextBio[fragIdx].paras || [])];
    paras[paraIdx] = val;
    nextBio[fragIdx] = { ...nextBio[fragIdx], paras };
    const next = { ...form, bio: nextBio };
    setForm(next);
    updateSection('personal', next);
  };

  const handleSave = () => {
    updateSection('personal', form);
    showToast('About & Bio saved & live on portfolio!');
  };

  return (
    <SectionWrapper
      title="About & The Human Behind The Product (06)"
      desc="Control your portrait photo and the interactive narrative bio fragments."
    >
      <InputGroup label="Profile Photo URL (or path like /src/assets/hero.png)">
        <input
          value={form.contact?.photo || ''}
          placeholder="/src/assets/hero.png or image URL (leave empty for monogram)"
          onChange={(e) => handlePhotoChange(e.target.value)}
          style={inputStyle}
        />
      </InputGroup>

      <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>
          Bio Fragments ({(form.bio || []).length})
        </h3>
        {(form.bio || []).map((frag, i) => (
          <div
            key={frag.label || i}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '20px',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', marginBottom: '12px' }}>
              <InputGroup label="Section Label">
                <input
                  value={frag.label || ''}
                  onChange={(e) => handleFragmentChange(i, 'label', e.target.value)}
                  style={inputStyle}
                />
              </InputGroup>
              <InputGroup label="Headline">
                <input
                  value={frag.headline || ''}
                  onChange={(e) => handleFragmentChange(i, 'headline', e.target.value)}
                  style={inputStyle}
                />
              </InputGroup>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontFamily: "'JetBrains Mono', monospace", display: 'block', marginBottom: '6px' }}>
                Paragraphs (Story narrative)
              </label>
              {(frag.paras || []).map((p, pIdx) => (
                <textarea
                  key={pIdx}
                  rows={2}
                  value={p}
                  onChange={(e) => handleParaChange(i, pIdx, e.target.value)}
                  style={{ ...inputStyle, marginBottom: '8px', resize: 'vertical' }}
                />
              ))}
            </div>

            <InputGroup label="Highlight Quote">
              <input
                value={frag.quote || ''}
                onChange={(e) => handleFragmentChange(i, 'quote', e.target.value)}
                style={inputStyle}
              />
            </InputGroup>
          </div>
        ))}
      </div>

      <SaveButton onClick={handleSave} />
    </SectionWrapper>
  );
}

/* ─────────────────────────────────────────────────────────────
   TAB: IMPACT ENGINE (04)
───────────────────────────────────────────────────────────── */
function ImpactTab({ data, updateSection, showToast }) {
  const [metrics, setMetrics] = useState(data?.metrics || []);

  useEffect(() => {
    setMetrics(data?.metrics || []);
  }, [data]);

  const handleMetricChange = (idx, field, val) => {
    const next = [...metrics];
    next[idx] = { ...next[idx], [field]: val };
    setMetrics(next);
    updateSection('impactEngine', { ...(data || {}), metrics: next });
  };

  const handleSave = () => {
    updateSection('impactEngine', { ...(data || {}), metrics });
    showToast('Impact metrics saved & live on portfolio!');
  };

  return (
    <SectionWrapper
      title="Impact Engine Metrics (04)"
      desc="Configure the headline quantitative metrics shown in Section 04."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {metrics.map((m, i) => (
          <div
            key={i}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '20px',
            }}
          >
            <div style={{ fontSize: '11px', color: '#C8F23E', fontFamily: "'JetBrains Mono', monospace", marginBottom: '10px' }}>
              METRIC 0{i + 1}
            </div>
            <InputGroup label="Value (e.g. 196+, 30%)">
              <input
                value={m.value || ''}
                onChange={(e) => handleMetricChange(i, 'value', e.target.value)}
                style={{ ...inputStyle, marginBottom: '8px' }}
              />
            </InputGroup>
            <InputGroup label="Label">
              <input
                value={m.label || ''}
                onChange={(e) => handleMetricChange(i, 'label', e.target.value)}
                style={{ ...inputStyle, marginBottom: '8px' }}
              />
            </InputGroup>
            <InputGroup label="Description">
              <textarea
                rows={2}
                value={m.description || ''}
                onChange={(e) => handleMetricChange(i, 'description', e.target.value)}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </InputGroup>
          </div>
        ))}
      </div>

      <SaveButton onClick={handleSave} />
    </SectionWrapper>
  );
}

/* ─────────────────────────────────────────────────────────────
   TAB: CAREER TIMELINE (05)
───────────────────────────────────────────────────────────── */
function TimelineTab({ data, updateSection, showToast }) {
  const [list, setList] = useState(data || []);

  useEffect(() => {
    setList(data || []);
  }, [data]);

  const handleUpdate = (idx, field, val) => {
    const next = [...list];
    if (field === 'highlights') {
      next[idx] = { ...next[idx], highlights: val.split('\n').filter(Boolean) };
    } else {
      next[idx] = { ...next[idx], [field]: val };
    }
    setList(next);
    updateSection('timeline', next);
  };

  const handleAdd = () => {
    const newStage = {
      stage: `0${list.length + 1}`,
      role: 'Product Role',
      company: 'Company Name',
      period: `${new Date().getFullYear()} — Present`,
      description: 'Describe the scope, ownership and user/business impact in this role.',
      metric: 'Impact Metric',
      highlights: ['Key achievement or product launched', 'Second key milestone delivered'],
    };
    const next = [...list, newStage];
    setList(next);
    updateSection('timeline', next);
    showToast('New timeline stage added!');
  };

  const handleDelete = (idx) => {
    if (window.confirm('Delete this career stage?')) {
      const next = list.filter((_, i) => i !== idx);
      setList(next);
      updateSection('timeline', next);
      showToast('Stage deleted.');
    }
  };

  const handleSave = () => {
    updateSection('timeline', list);
    showToast('Career timeline saved & live on portfolio!');
  };

  return (
    <SectionWrapper
      title="Career Timeline & Experience (05)"
      desc="Configure your progression, leadership roles, metrics and key deliverables."
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <button
          onClick={handleAdd}
          style={{
            background: '#C8F23E',
            border: 'none',
            color: '#07070A',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          + Add Career Stage
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {list.map((item, i) => (
          <div
            key={i}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#C8F23E', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: '13px' }}>
                  {item.stage || `0${i + 1}`}
                </span>
                <span style={{ fontSize: '16px', fontWeight: 700 }}>
                  {item.role} @ {item.company}
                </span>
              </div>
              <button
                onClick={() => handleDelete(i)}
                style={{ background: 'none', border: 'none', color: '#FF6666', fontSize: '12px', cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '12px' }}>
              <InputGroup label="Stage Number">
                <input
                  value={item.stage || ''}
                  onChange={(e) => handleUpdate(i, 'stage', e.target.value)}
                  style={inputStyle}
                />
              </InputGroup>
              <InputGroup label="Role">
                <input
                  value={item.role || ''}
                  onChange={(e) => handleUpdate(i, 'role', e.target.value)}
                  style={inputStyle}
                />
              </InputGroup>
              <InputGroup label="Company">
                <input
                  value={item.company || ''}
                  onChange={(e) => handleUpdate(i, 'company', e.target.value)}
                  style={inputStyle}
                />
              </InputGroup>
              <InputGroup label="Period">
                <input
                  value={item.period || ''}
                  onChange={(e) => handleUpdate(i, 'period', e.target.value)}
                  style={inputStyle}
                />
              </InputGroup>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <InputGroup label="Description">
                <textarea
                  rows={2}
                  value={item.description || ''}
                  onChange={(e) => handleUpdate(i, 'description', e.target.value)}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </InputGroup>
              <InputGroup label="Key Metric">
                <input
                  value={item.metric || ''}
                  onChange={(e) => handleUpdate(i, 'metric', e.target.value)}
                  style={inputStyle}
                />
              </InputGroup>
            </div>

            <InputGroup label="Key Highlights (one per line)">
              <textarea
                rows={3}
                value={(item.highlights || []).join('\n')}
                onChange={(e) => handleUpdate(i, 'highlights', e.target.value)}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </InputGroup>
          </div>
        ))}
      </div>

      <SaveButton onClick={handleSave} />
    </SectionWrapper>
  );
}

/* ─────────────────────────────────────────────────────────────
   TAB: APPROACH & PROCESS (07)
───────────────────────────────────────────────────────────── */
function ApproachTab({ data, updateSection, showToast }) {
  const [steps, setSteps] = useState(data || []);

  useEffect(() => {
    setSteps(data || []);
  }, [data]);

  const handleStepChange = (idx, field, val) => {
    const next = [...steps];
    if (field === 'tags') {
      next[idx] = { ...next[idx], tags: val.split(',').map((s) => s.trim()).filter(Boolean) };
    } else {
      next[idx] = { ...next[idx], [field]: val };
    }
    setSteps(next);
    updateSection('approach', next);
  };

  const handleSave = () => {
    updateSection('approach', steps);
    showToast('Approach steps saved & live on portfolio!');
  };

  return (
    <SectionWrapper
      title="How I Work — 4-Stage PM Process (07)"
      desc="Configure your methodology loop (Discover, Define, Build, Learn)."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {steps.map((step, i) => (
          <div
            key={i}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '18px' }}>{step.icon || '🎯'}</span>
              <span style={{ color: '#C8F23E', fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: '12px' }}>
                STAGE {step.num || `0${i + 1}`}
              </span>
            </div>
            <InputGroup label="Stage Title">
              <input
                value={step.title || ''}
                onChange={(e) => handleStepChange(i, 'title', e.target.value)}
                style={{ ...inputStyle, marginBottom: '8px' }}
              />
            </InputGroup>
            <InputGroup label="Description">
              <textarea
                rows={3}
                value={step.description || ''}
                onChange={(e) => handleStepChange(i, 'description', e.target.value)}
                style={{ ...inputStyle, marginBottom: '8px', resize: 'vertical' }}
              />
            </InputGroup>
            <InputGroup label="Tags (comma-separated)">
              <input
                value={(step.tags || []).join(', ')}
                onChange={(e) => handleStepChange(i, 'tags', e.target.value)}
                style={inputStyle}
              />
            </InputGroup>
          </div>
        ))}
      </div>

      <SaveButton onClick={handleSave} />
    </SectionWrapper>
  );
}

/* ─────────────────────────────────────────────────────────────
   REUSABLE UI HELPERS
───────────────────────────────────────────────────────────── */
function SectionWrapper({ title, desc, children }) {
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 6px' }}>{title}</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: 0 }}>{desc}</p>
      </div>
      {children}
    </div>
  );
}

function InputGroup({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '10px',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.6)',
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function SaveButton({ onClick }) {
  return (
    <div style={{ marginTop: '24px' }}>
      <button
        onClick={onClick}
        style={{
          background: '#C8F23E',
          border: 'none',
          color: '#08080C',
          borderRadius: '8px',
          padding: '9px 20px',
          fontSize: '12px',
          fontWeight: 800,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span>✓</span> Save Changes
      </button>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  background: 'rgba(255, 255, 255, 0.04)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '8px',
  padding: '10px 12px',
  color: '#FFFFFF',
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  fontSize: '13px',
  outline: 'none',
  boxSizing: 'border-box',
};
