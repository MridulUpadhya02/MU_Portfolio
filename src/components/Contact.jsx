import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Mail } from 'lucide-react';

const LinkedinIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Contact = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section id="contact" className="section" ref={ref} style={{ borderTop: '1px solid var(--glass-border)' }}>
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}
        >
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Let's <span className="text-gradient">Connect</span></h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>
            Currently open for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
          </p>

          <a href="mailto:hello@example.com" className="btn btn-primary" style={{ marginBottom: '4rem' }}>
            <Mail size={18} /> Say Hello
          </a>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
            <a href="#" className="glass-card" style={{ padding: '1rem', borderRadius: '50%' }}><LinkedinIcon size={24} /></a>
            <a href="#" className="glass-card" style={{ padding: '1rem', borderRadius: '50%' }}><TwitterIcon size={24} /></a>
          </div>
        </motion.div>
      </div>
      <footer style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4rem', borderTop: '1px solid var(--glass-border)' }}>
        <p>© {new Date().getFullYear()} Mridul Upadhya. Built with React & Vite.</p>
      </footer>
    </section>
  );
};

export default Contact;
