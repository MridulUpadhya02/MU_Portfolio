import { motion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';

const Hero = () => {
  return (
    <section className="section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '8rem' }}>
      <div className="bg-glow" style={{ top: '10%', left: '-10%' }}></div>
      <div className="bg-glow" style={{ bottom: '10%', right: '-10%', background: 'radial-gradient(circle, rgba(0, 240, 255, 0.15) 0%, rgba(10, 10, 15, 0) 70%)' }}></div>
      
      <div className="container grid-2">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.span 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '20px', marginBottom: '1.5rem', color: 'var(--accent-cyan)', fontWeight: 500 }}
          >
            👋 Welcome to my portfolio
          </motion.span>
          <h1 style={{ fontSize: 'clamp(3rem, 5vw, 5rem)', marginBottom: '1rem' }}>
            Crafting <span className="text-gradient">Products</span> That People Love.
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '500px' }}>
            I'm Mridul Upadhya, a Product Manager dedicated to turning complex problems into elegant, scalable, and user-centric solutions.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="#projects" className="btn btn-primary">
              View My Work <ArrowRight size={18} />
            </a>
            <a href="#" className="btn btn-outline">
              Resume <Download size={18} />
            </a>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}
        >
          <div style={{ width: '100%', maxWidth: '400px', aspectRatio: '1/1', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '30px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             {/* Placeholder for actual image or 3D graphic */}
             <div style={{ position: 'absolute', inset: 0, background: 'var(--gradient-main)', opacity: 0.2, filter: 'blur(40px)' }}></div>
             <h2 style={{ zIndex: 1, fontSize: '8rem', opacity: 0.1, fontFamily: 'var(--font-heading)' }}>MU</h2>
          </div>
          
          {/* Floating cards for tech/skills vibe */}
          <motion.div 
            animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="glass-card" style={{ position: 'absolute', top: '10%', left: '-10%', padding: '1rem' }}>
            <span style={{ fontWeight: 'bold' }}>Strategy</span>
          </motion.div>
          <motion.div 
            animate={{ y: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="glass-card" style={{ position: 'absolute', bottom: '15%', right: '-5%', padding: '1rem' }}>
            <span style={{ fontWeight: 'bold', color: 'var(--accent-cyan)' }}>Growth</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
