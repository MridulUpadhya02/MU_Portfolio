import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function dataUrlToBlobUrl(dataUrl) {
  if (!dataUrl || typeof dataUrl !== 'string') return '';
  if (!dataUrl.startsWith('data:')) return dataUrl;
  try {
    const parts = dataUrl.split(',');
    const mime = parts[0].match(/:(.*?);/)?.[1] || 'application/pdf';
    const binary = atob(parts[1]);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([array], { type: mime });
    return URL.createObjectURL(blob);
  } catch (err) {
    console.warn('Failed to convert dataURL to BlobURL:', err);
    return dataUrl;
  }
}

export default function PdfPreviewModal({
  isOpen,
  onClose,
  pdfUrl,
  fileName,
  title = 'Case Study Document',
  fileSize,
  accentColor = '#C8F23E',
}) {
  const [blobUrl, setBlobUrl] = useState('');

  useEffect(() => {
    if (!isOpen || !pdfUrl) {
      setBlobUrl('');
      return;
    }

    const createdUrl = dataUrlToBlobUrl(pdfUrl);
    setBlobUrl(createdUrl);

    // Lock body scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Keydown listener for ESC
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      if (createdUrl && createdUrl.startsWith('blob:')) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [isOpen, pdfUrl, onClose]);

  if (!isOpen || !pdfUrl) return null;

  const displayFileName = fileName || `${title.replace(/\s+/g, '_')}_Case_Study.pdf`;

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
          padding: 'clamp(12px, 2.5vw, 32px)',
          boxSizing: 'border-box',
        }}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(5, 5, 8, 0.88)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'relative',
            width: 'min(1100px, 96vw)',
            height: 'min(88vh, 880px)',
            background: '#0D0D12',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '20px',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 1,
          }}
        >
          {/* Header Bar */}
          <div
            style={{
              padding: '16px 20px',
              background: '#12121A',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            {/* Title & File details */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: 'rgba(255, 75, 75, 0.15)',
                  border: '1px solid rgba(255, 75, 75, 0.35)',
                  color: '#FF6B6B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '11px',
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                PDF
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: 'clamp(180px, 35vw, 420px)',
                  }}
                  title={displayFileName}
                >
                  {displayFileName}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: 'rgba(200, 210, 185, 0.45)',
                    fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: '0.04em',
                  }}
                >
                  {title} {fileSize ? `· ${fileSize}` : ''}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              {/* Direct Download */}
              <motion.a
                href={pdfUrl}
                download={displayFileName}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: accentColor || '#C8F23E',
                  color: '#07070A',
                  padding: '7px 14px',
                  borderRadius: 8,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '12px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  cursor: 'pointer',
                  boxShadow: `0 2px 10px ${accentColor || '#C8F23E'}40`,
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download
              </motion.a>

              {/* Open in new window */}
              {blobUrl && (
                <motion.a
                  href={blobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: 'rgba(255, 255, 255, 0.85)',
                    padding: '7px 12px',
                    borderRadius: 8,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '11px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    cursor: 'pointer',
                  }}
                  title="Open in browser's native PDF viewer"
                >
                  <span>Open Tab</span>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </motion.a>
              )}

              {/* Close ESC */}
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.05, borderColor: 'rgba(255,255,255,0.3)' }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.65)',
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '11px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>ESC</span>
                <span style={{ fontSize: '13px', lineHeight: 1 }}>✕</span>
              </motion.button>
            </div>
          </div>

          {/* Viewer Frame */}
          <div
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
              background: '#181820',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {blobUrl ? (
              <iframe
                src={`${blobUrl}#toolbar=1&navpanes=0`}
                title={displayFileName}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  background: '#1F1F28',
                }}
              />
            ) : (
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                <div>Preparing PDF preview...</div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
