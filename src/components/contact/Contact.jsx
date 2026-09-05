import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolioData } from '../../context/PortfolioDataContext';



/* ─────────────────────────────────────────────────────
   FEATURE BADGES
───────────────────────────────────────────────────── */
const BADGES = [
  {
    icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>),
    title: 'Quick Response', sub: 'Usually replies within 24 hours',
  },
  {
    icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>),
    title: 'Open to Opportunities', sub: 'Full-time roles, collaborations or product discussions',
  },
  {
    icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>),
    title: "Let's Create Impact", sub: 'Building solutions that make a difference',
  },
];

/* ─────────────────────────────────────────────────────
   CONNECT LINKS
───────────────────────────────────────────────────── */
const CONNECT_LINKS = [
  {
    icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>),
    label: 'Email', value: 'mridulupadhya861@gmail.com', href: 'mailto:mridulupadhya861@gmail.com',
  },
  {
    icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>),
    label: 'LinkedIn', value: 'linkedin.com/in/mridulupadhya02', href: 'https://linkedin.com/in/mridulupadhya02',
  },
  {
    icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>),
    label: 'Location', value: 'Mumbai, India', href: null,
  },
  {
    icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>),
    label: "Let's Talk", value: 'Book a quick 15-min call', href: 'https://calendly.com/mridulupadhya02',
  },
];

/* ─────────────────────────────────────────────────────
   CINEMATIC ENDING
───────────────────────────────────────────────────── */
function CinematicEnding({ onEasterEgg, setCursor, resetCursor }) {
  const [phase, setPhase] = useState(0);
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const t1 = setTimeout(() => setPhase(1), 2200);
    const t2 = setTimeout(() => setPhase(2), 3600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [visible]);

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28, padding: 'clamp(40px, 6vh, 80px) 0 clamp(20px, 3vh, 40px)' }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: visible ? 1 : 0 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(12px, 1.4vw, 18px)', fontWeight: 400, color: 'var(--color-text-tertiary)', letterSpacing: '0.06em', textAlign: 'center' }}>
        YOU&apos;VE REACHED THE END.
      </motion.div>
      <AnimatePresence>
        {phase >= 1 && (
          <motion.div key="or" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(24px, 3.5vw, 48px)', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em', textAlign: 'center', lineHeight: 1.05 }}>
            OR HAVE YOU?
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {phase >= 2 && (
          <motion.button key="dot" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }} transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }} onClick={() => onEasterEgg?.()} onMouseEnter={() => setCursor?.('SECRET', '?')} onMouseLeave={() => resetCursor?.()} aria-label="Easter egg" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <motion.div animate={{ scale:[1,1.35,1], opacity:[0.5,1,0.5], boxShadow:['0 0 0px 0px rgba(200,242,62,0)','0 0 28px 6px rgba(200,242,62,0.35)','0 0 0px 0px rgba(200,242,62,0)'] }} transition={{ duration:2.8, repeat:Infinity, ease:'easeInOut' }} style={{ width:10, height:10, borderRadius:'50%', background:'var(--color-accent)' }} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ padding: 'clamp(36px, 5vh, 72px) clamp(16px, 4.5vw, 104px) clamp(28px, 4vh, 60px)' }}>
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--color-border) 20%, rgba(200,242,62,0.14) 50%, var(--color-border) 80%, transparent)', marginBottom: 'clamp(32px, 4.5vh, 56px)' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(11px, 1.2vw, 14px)', fontWeight: 500, letterSpacing: '0.02em', color: 'var(--color-text-tertiary)' }}>Mridul Upadhya · 2025</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(7px, 0.78vw, 9px)', letterSpacing: '0.22em', color: 'var(--color-accent)', opacity: 0.45, textTransform: 'uppercase' }}>PRODUCTS ARE SYSTEMS OF DECISIONS</div>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(7px, 0.78vw, 9px)', letterSpacing: '0.24em', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '9px', opacity: 0.5 }}>
          <span style={{ color: 'rgba(200,242,62,0.3)', fontSize: '9px' }}>◈</span>
          BUILT WITH INTENT
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────
   SAY HELLO MODAL COMPONENT
   Direct submission to mridulupadhya861@gmail.com
───────────────────────────────────────────────────── */
function SayHelloModal({ isOpen, onClose, recipientEmail = 'mridulupadhya861@gmail.com', setCursor, resetCursor }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState("Hi Mridul,\n\nI came across your portfolio and would love to discuss an exciting project / opportunity.");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${recipientEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: email,
          _subject: `👋 [Say Hello] Opportunity / Message from ${name}`,
          message: message,
          _template: 'table',
          _captcha: 'false',
        }),
      });

      const resData = await response.json().catch(() => ({}));
      if (response.ok && (resData.success === 'true' || resData.success === true || resData.message)) {
        setSent(true);
      } else {
        throw new Error(resData.message || 'Submission failed');
      }
    } catch (err) {
      console.warn('FormSubmit network request failed, falling back to mail client:', err);
      const mailtoUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(`[Say Hello] Opportunity from ${name}`)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
      window.location.href = mailtoUrl;
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
        }}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(3, 4, 7, 0.85)',
            backdropFilter: 'blur(12px)',
          }}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '520px',
            background: 'linear-gradient(180deg, #13151c 0%, #0c0d12 100%)',
            border: '1px solid rgba(200, 242, 62, 0.28)',
            borderRadius: '20px',
            padding: 'clamp(24px, 4vw, 36px)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 40px rgba(200, 242, 62, 0.12)',
            color: '#fff',
            zIndex: 2,
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '18px',
              right: '18px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8E958A',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#8E958A';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
            }}
            aria-label="Close modal"
          >
            ✕
          </button>

          {sent ? (
            <div style={{ textAlign: 'center', padding: '24px 8px 12px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'var(--color-accent-ghost)',
                  border: '2px solid var(--color-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 18px',
                }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '22px', fontWeight: 700, margin: '0 0 10px' }}>
                Message Sent! 🎉
              </h3>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', color: 'rgba(200,210,185,0.7)', lineHeight: 1.6, margin: '0 0 24px' }}>
                Thanks for reaching out! Mridul will reply within <strong style={{ color: 'var(--color-accent)' }}>12 hours</strong>.
              </p>
              <button
                onClick={onClose}
                style={{
                  background: 'var(--color-accent)',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#050608',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '14px',
                  fontWeight: 700,
                  padding: '12px 28px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(200,242,62,0.35)',
                }}
              >
                Back to Portfolio
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px',
                  background: 'rgba(200, 242, 62, 0.1)',
                  border: '1px solid rgba(200, 242, 62, 0.28)',
                  borderRadius: '999px',
                  padding: '4px 12px',
                }}
              >
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--color-accent)', boxShadow: '0 0 8px var(--color-accent-glow)' }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', color: 'var(--color-accent)', textTransform: 'uppercase' }}>
                  ⚡ QUICKEST RESPONSE · WITHIN 12 HOURS
                </span>
              </div>

              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(20px, 2.4vw, 24px)', fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                Say Hello to Mridul 👋
              </h3>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '13px', color: 'rgba(200, 210, 185, 0.7)', lineHeight: 1.5, margin: '0 0 20px' }}>
                Drop a quick note below. This is the <strong>fastest way to reach me</strong> with a guaranteed reply within <strong style={{ color: 'var(--color-accent)' }}>12 hours</strong>.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '12px', fontWeight: 600, color: 'rgba(200, 210, 185, 0.8)', marginBottom: '6px' }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Rivera"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: '14px',
                      padding: '11px 14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '12px', fontWeight: 600, color: 'rgba(200, 210, 185, 0.8)', marginBottom: '6px' }}>
                    Your Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="alex@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: '14px',
                      padding: '11px 14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '12px', fontWeight: 600, color: 'rgba(200, 210, 185, 0.8)', marginBottom: '6px' }}>
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: '13.5px',
                      lineHeight: 1.5,
                      padding: '11px 14px',
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={!submitting ? { scale: 1.02 } : {}}
                whileTap={!submitting ? { scale: 0.98 } : {}}
                onMouseEnter={() => !submitting && setCursor?.('HOVER')}
                onMouseLeave={() => resetCursor?.()}
                style={{
                  width: '100%',
                  background: 'var(--color-accent)',
                  color: '#050608',
                  border: 'none',
                  borderRadius: '10px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '14px',
                  fontWeight: 700,
                  padding: '13px 20px',
                  cursor: submitting ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 18px var(--color-accent-glow)',
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? 'Sending to Mridul...' : 'Send to Mridul 🚀'}
              </motion.button>

              <div style={{ textAlign: 'center', marginTop: '14px' }}>
                <a
                  href={`mailto:${recipientEmail}?subject=${encodeURIComponent(`Hello Mridul!`)}&body=${encodeURIComponent(message)}`}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '11px',
                    color: 'rgba(200, 210, 185, 0.55)',
                    textDecoration: 'none',
                    letterSpacing: '0.04em',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(200, 210, 185, 0.55)')}
                >
                  Or open default email client ↗
                </a>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────
   MAIN CONTACT SECTION
───────────────────────────────────────────────────── */
export default function Contact({ setCursor, resetCursor, onEasterEgg }) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [sayHelloOpen, setSayHelloOpen] = useState(false);
  const { data } = usePortfolioData();
  const contact = data?.contact || {};

  const dynamicBadges = (contact.badges && contact.badges.length > 0)
    ? contact.badges.map((b, i) => ({
        icon: BADGES[i % BADGES.length]?.icon,
        title: b.title,
        sub: b.sub,
      }))
    : BADGES;

  const dynamicLinks = [
    {
      icon: CONNECT_LINKS[0].icon,
      label: 'Email',
      value: contact.email || 'mridulupadhya861@gmail.com',
      href: `mailto:${contact.email || 'mridulupadhya861@gmail.com'}`,
    },
    {
      icon: CONNECT_LINKS[1].icon,
      label: 'LinkedIn',
      value: contact.linkedin?.replace(/^https?:\/\//, '') || 'linkedin.com/in/mridulupadhya02',
      href: contact.linkedin || 'https://linkedin.com/in/mridulupadhya02',
    },
    {
      icon: CONNECT_LINKS[2].icon,
      label: 'Location',
      value: contact.location || 'Mumbai, India',
      href: null,
    },
    {
      icon: CONNECT_LINKS[3].icon,
      label: "Let's Talk",
      value: 'Book a quick 15-min call',
      href: contact.meetingLink || 'https://calendly.com/mridulupadhya02',
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const recipient = contact.email || 'mridulupadhya861@gmail.com';

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${recipient}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          _subject: formData.subject ? `[Portfolio Message] ${formData.subject}` : `New message from ${formData.name}`,
          message: formData.message,
          _template: 'table',
          _captcha: 'false',
        }),
      });

      const resData = await response.json().catch(() => ({}));
      if (response.ok && (resData.success === 'true' || resData.success === true || resData.message)) {
        setSent(true);
      } else {
        throw new Error(resData.message || 'Submission failed');
      }
    } catch (err) {
      console.warn('FormSubmit network request failed or blocked, falling back to mailto client:', err);
      // Fallback opens user's email client directly with all pre-filled content
      const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(formData.subject || `Message from ${formData.name}`)}&body=${encodeURIComponent(`From: ${formData.name} (${formData.email})\n\n${formData.message}`)}`;
      window.location.href = mailtoUrl;
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  const inputBase = {
    width: '100%',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    color: '#e8f0e0',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 'clamp(13px, 1.3vw, 15px)',
    padding: '13px 16px',
    outline: 'none',
    transition: 'border-color 200ms ease, background 200ms ease',
    boxSizing: 'border-box',
  };

  const handleFocus = (e) => { e.target.style.borderColor = 'var(--color-accent)'; e.target.style.background = 'var(--color-accent-ghost)'; };
  const handleBlur  = (e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)';  e.target.style.background = 'rgba(255,255,255,0.03)'; };

  const FV = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] } }),
  };

  return (
    <section id="contact" data-inspect="CONTACT: Connect section" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-void)', position: 'relative', overflow: 'hidden' }}>

      {/* ── HERO ── */}
      <div style={{ padding: 'clamp(64px, 10vh, 120px) clamp(20px, 6vw, 96px) clamp(40px, 6vh, 80px)', position: 'relative' }}>
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(200,242,62,0.2) 40%, transparent)', marginBottom: 'clamp(40px, 6vh, 72px)' }} />

        <div style={{ maxWidth: 720 }}>
          {/* Text */}
          <div>
            <motion.div custom={0} variants={FV} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 'clamp(16px, 2.5vh, 28px)' }}>
              <span style={{ color: 'var(--color-accent)', fontSize: 14 }}>✦</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(10px, 1vw, 12px)', letterSpacing: '0.18em', color: 'var(--color-accent)', textTransform: 'uppercase' }}>LET&apos;S CONNECT</span>
            </motion.div>

            <motion.h2 custom={1} variants={FV} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(32px, 5vw, 72px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05, margin: '0 0 clamp(16px, 2.5vh, 24px)', color: '#fff' }}>
              {contact.headline || "Let's Build Something"}{' '}
              <span style={{ color: 'var(--color-accent)', display: 'block' }}>{contact.highlightText || 'Impactful Together'}</span>
            </motion.h2>

            <motion.p custom={2} variants={FV} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(14px, 1.5vw, 17px)', fontWeight: 400, color: 'rgba(220,230,210,0.65)', lineHeight: 1.7, margin: '0 0 clamp(28px, 4vh, 44px)', maxWidth: 480 }}>
              {contact.subtitle || "I'm always open to discussing new opportunities, solving interesting problems and building products that create real impact. Let's connect!"}
            </motion.p>

            <motion.div custom={3} variants={FV} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(14px, 2vw, 28px)' }}>
              {dynamicBadges.map(({ icon, title, sub }) => (
                <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, minWidth: 'min(100%, 140px)' }}>
                  <div style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: 2 }}>{icon}</div>
                  <div>
                    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(12px, 1.2vw, 14px)', fontWeight: 600, color: 'var(--color-accent)', marginBottom: 3 }}>{title}</div>
                    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(11px, 1vw, 12px)', color: 'rgba(200,210,185,0.6)', lineHeight: 1.5 }}>{sub}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── CARDS ── */}
      <div style={{ padding: '0 clamp(20px, 6vw, 96px) clamp(40px, 6vh, 80px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: 'clamp(20px, 3vw, 32px)' }}>

          {/* Form card */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 20, padding: 'clamp(24px, 4vw, 40px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(18px, 2vw, 24px)', fontWeight: 700, color: '#fff', margin: 0 }}>Send Me a Message</h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </div>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(12px, 1.2vw, 14px)', color: 'rgba(200,210,185,0.55)', margin: '0 0 clamp(20px, 3vh, 32px)', lineHeight: 1.5 }}>Drop a message and I&apos;ll get back to you!</p>

            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="sent" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', padding: 'clamp(30px, 5vh, 50px) 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--color-accent-ghost)', border: '2px solid var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(16px, 1.6vw, 20px)', fontWeight: 700, color: '#fff' }}>Message Sent!</div>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(13px, 1.2vw, 15px)', color: 'rgba(200,210,185,0.6)', lineHeight: 1.6 }}>Thanks for reaching out. I&apos;ll get back to you within 24 hours.</div>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 1.8vh, 18px)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'clamp(12px, 1.5vw, 16px)' }}>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(200,210,185,0.4)', pointerEvents: 'none' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      </span>
                      <input style={{ ...inputBase, paddingLeft: 38 }} placeholder="Your Name" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} onFocus={handleFocus} onBlur={handleBlur} required />
                    </div>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(200,210,185,0.4)', pointerEvents: 'none' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      </span>
                      <input type="email" style={{ ...inputBase, paddingLeft: 38 }} placeholder="Your Email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} onFocus={handleFocus} onBlur={handleBlur} required />
                    </div>
                  </div>

                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(200,210,185,0.4)', pointerEvents: 'none' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>
                    </span>
                    <input style={{ ...inputBase, paddingLeft: 38 }} placeholder="Subject" value={formData.subject} onChange={e => setFormData(p => ({ ...p, subject: e.target.value }))} onFocus={handleFocus} onBlur={handleBlur} />
                  </div>

                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 14, top: 16, color: 'rgba(200,210,185,0.4)', pointerEvents: 'none' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                    </span>
                    <textarea style={{ ...inputBase, paddingLeft: 38, paddingTop: 14, resize: 'vertical', minHeight: 120, lineHeight: 1.6 }} placeholder="Your Message" value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))} onFocus={handleFocus} onBlur={handleBlur} required />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={!submitting ? { scale: 1.02 } : {}}
                    whileTap={!submitting ? { scale: 0.98 } : {}}
                    onMouseEnter={() => !submitting && setCursor?.('HOVER')}
                    onMouseLeave={() => resetCursor?.()}
                    style={{
                      width: '100%',
                      background: 'var(--color-accent)',
                      border: 'none',
                      borderRadius: 10,
                      color: '#0a0a0f',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: 'clamp(14px, 1.4vw, 16px)',
                      fontWeight: 700,
                      padding: '14px 24px',
                      cursor: submitting ? 'wait' : 'pointer',
                      opacity: submitting ? 0.75 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 10,
                      boxShadow: '0 4px 18px var(--color-accent-glow)',
                    }}
                  >
                    {submitting ? 'Sending Message...' : 'Send Message'}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 20, padding: 'clamp(24px, 4vw, 40px)', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(18px, 2vw, 24px)', fontWeight: 700, color: '#fff', margin: '0 0 6px' }}>Direct Connect</h3>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(12px, 1.2vw, 14px)', color: 'rgba(200,210,185,0.55)', margin: '0 0 clamp(20px, 3vh, 32px)', lineHeight: 1.5 }}>Reach out directly on any of these channels</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.5vh, 14px)', flex: 1 }}>
              {dynamicLinks.map(({ label, value, href, icon }) => {
                const inner = (
                  <motion.div
                    key={label}
                    onHoverStart={() => setHoveredLink(label)}
                    onHoverEnd={() => setHoveredLink(null)}
                    onMouseEnter={() => href && setCursor?.('LINK')}
                    onMouseLeave={() => resetCursor?.()}
                    animate={{ backgroundColor: hoveredLink === label ? 'var(--color-accent-ghost)' : 'rgba(255,255,255,0.0)' }}
                    style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 'clamp(12px, 1.8vh, 18px) clamp(12px, 1.5vw, 16px)', borderRadius: 12, border: '1px solid', borderColor: hoveredLink === label ? 'var(--color-accent-border)' : 'rgba(255,255,255,0.07)', cursor: href ? 'pointer' : 'default', transition: 'border-color 200ms ease', textDecoration: 'none' }}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0, background: hoveredLink === label ? 'var(--color-accent-ghost)' : 'rgba(255,255,255,0.06)', border: '1px solid', borderColor: hoveredLink === label ? 'var(--color-accent-border)' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: hoveredLink === label ? 'var(--color-accent)' : 'rgba(200,210,185,0.6)', transition: 'all 200ms ease' }}>
                      {icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(13px, 1.3vw, 15px)', fontWeight: 600, color: '#fff', marginBottom: 2 }}>{label}</div>
                      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(11px, 1vw, 13px)', color: 'rgba(200,210,185,0.5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</div>
                    </div>
                    {href && (
                      <motion.div animate={{ x: hoveredLink === label ? 3 : 0, color: hoveredLink === label ? 'var(--color-accent)' : 'rgba(200,210,185,0.3)' }} transition={{ duration: 0.2 }} style={{ flexShrink: 0 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                      </motion.div>
                    )}
                  </motion.div>
                );
                return href ? (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>{inner}</a>
                ) : (
                  <div key={label}>{inner}</div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} style={{ margin: '0 clamp(20px, 6vw, 96px)', borderRadius: 16, background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: 'clamp(20px, 3vh, 32px) clamp(24px, 4vw, 48px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'clamp(16px, 2vw, 24px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 2vw, 20px)', flexWrap: 'wrap' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--color-accent-ghost)', border: '1px solid var(--color-accent-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div>
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(14px, 1.5vw, 18px)', fontWeight: 700, color: '#fff', marginBottom: 4 }}>
              Got an exciting project or opportunity?
            </div>
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(12px, 1.2vw, 14px)', color: 'rgba(200,210,185,0.55)', lineHeight: 1.5 }}>
              I&apos;d love to hear about it and explore how we can work together.
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                marginTop: 6,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '10.5px',
                fontWeight: 600,
                color: 'var(--color-accent)',
                letterSpacing: '0.04em',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-accent)', boxShadow: '0 0 8px var(--color-accent-glow)', display: 'inline-block' }} />
              <span>⚡ Quickest response — replies within 12 hours</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              background: 'var(--color-accent-ghost)',
              border: '1px solid var(--color-accent-border)',
              padding: '3px 10px',
              borderRadius: 999,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              fontWeight: 600,
              color: 'var(--color-accent)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              boxShadow: '0 0 10px var(--color-accent-ghost)',
            }}
          >
            ⚡ Response within 12h
          </div>

          <motion.button
            onClick={() => setSayHelloOpen(true)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onMouseEnter={() => setCursor?.('HOVER')}
            onMouseLeave={() => resetCursor?.()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--color-accent)',
              color: '#0a0a0f',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(13px, 1.3vw, 15px)',
              fontWeight: 700,
              padding: 'clamp(10px, 1.5vh, 14px) clamp(20px, 2.5vw, 32px)',
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              boxShadow: '0 4px 18px var(--color-accent-glow)',
            }}
          >
            Say Hello 👋
          </motion.button>
        </div>
      </motion.div>

      {/* Say Hello direct modal */}
      <SayHelloModal
        isOpen={sayHelloOpen}
        onClose={() => setSayHelloOpen(false)}
        recipientEmail={contact.email || 'mridulupadhya861@gmail.com'}
        setCursor={setCursor}
        resetCursor={resetCursor}
      />

      {/* Cinematic ending + footer */}
      <CinematicEnding onEasterEgg={onEasterEgg} setCursor={setCursor} resetCursor={resetCursor} />
      <Footer />
    </section>
  );
}
