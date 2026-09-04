import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Experience = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const experiences = [
    { role: 'Senior Product Manager', company: 'TechNova', period: '2022 - Present', desc: 'Led the core product team, increasing user retention by 40% through AI-driven personalization.' },
    { role: 'Product Manager', company: 'Innovate Solutions', period: '2019 - 2022', desc: 'Launched 3 major features from 0 to 1, driving $2M in new ARR.' },
    { role: 'Associate PM', company: 'Startup Inc', period: '2017 - 2019', desc: 'Managed agile sprints and backlog for a team of 10 engineers.' }
  ];

  return (
    <section id="experience" className="section" ref={ref}>
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 style={{ fontSize: '3rem', marginBottom: '3rem' }}>My <span className="text-gradient">Journey</span></h2>
        </motion.div>

        <div style={{ position: 'relative', paddingLeft: '2rem' }}>
          {/* Timeline Line */}
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '2px', background: 'var(--glass-border)' }}></div>

          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              style={{ position: 'relative', marginBottom: '3rem' }}
            >
              {/* Timeline Dot */}
              <div style={{ position: 'absolute', left: '-2rem', top: '0.5rem', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--accent-cyan)', transform: 'translateX(-4px)', boxShadow: '0 0 10px var(--accent-cyan)' }}></div>
              
              <div className="glass-card">
                <span style={{ color: 'var(--accent-purple)', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{exp.period}</span>
                <h3 style={{ fontSize: '1.5rem', margin: '0.5rem 0' }}>{exp.role} <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>@ {exp.company}</span></h3>
                <p style={{ color: 'var(--text-secondary)' }}>{exp.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
