import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink } from 'lucide-react';

const Projects = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const projects = [
    { title: 'Project Alpha', category: 'SaaS Platform', metrics: 'Increased MAU by 150%', desc: 'A B2B SaaS platform streamlining workflow automation for remote teams. Led the product from ideation to launch.' },
    { title: 'Beta Analytics', category: 'Data Product', metrics: '$500k ARR in 6 months', desc: 'An intuitive dashboard turning complex data sets into actionable insights for marketing teams.' },
    { title: 'Consumer App V2', category: 'Mobile App', metrics: '4.8 App Store Rating', desc: 'Redesigned the core user journey, reducing friction in the onboarding process by 60%.' }
  ];

  return (
    <section id="projects" className="section" ref={ref}>
      <div className="bg-glow" style={{ top: '20%', right: '-20%', background: 'radial-gradient(circle, rgba(255, 0, 127, 0.1) 0%, rgba(10, 10, 15, 0) 70%)' }}></div>
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
        >
          <div>
            <h2 style={{ fontSize: '3rem' }}>Featured <span className="text-gradient">Projects</span></h2>
          </div>
        </motion.div>

        <div className="grid-3">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="glass-card"
              style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              <div style={{ padding: '0.5rem 1rem', background: 'rgba(0, 240, 255, 0.1)', color: 'var(--accent-cyan)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, display: 'inline-block', marginBottom: '1rem', alignSelf: 'flex-start' }}>
                {project.category}
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{project.title}</h3>
              <p style={{ color: 'var(--accent-pink)', fontWeight: 500, marginBottom: '1rem', fontSize: '0.9rem' }}>Metric: {project.metrics}</p>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', flexGrow: 1 }}>{project.desc}</p>
              
              <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontSize: '0.9rem' }}><ExternalLink size={16} /> Case Study</a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
