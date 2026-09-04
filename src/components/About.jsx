import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Target, Users, BarChart3, Zap } from 'lucide-react';

const About = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const skills = [
    { icon: <Target className="text-gradient" size={32} />, title: 'Product Strategy', desc: 'Defining roadmaps aligned with business goals and user needs.' },
    { icon: <Users className="text-gradient" size={32} />, title: 'User Empathy', desc: 'Deep-diving into user research to build what truly matters.' },
    { icon: <BarChart3 className="text-gradient" size={32} />, title: 'Data-Driven', desc: 'Leveraging analytics to iterate and optimize product performance.' },
    { icon: <Zap className="text-gradient" size={32} />, title: 'Agile Execution', desc: 'Leading cross-functional teams to deliver value rapidly.' }
  ];

  return (
    <section id="about" className="section" ref={ref}>
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>The <span className="text-gradient">Philosophy</span></h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Great products sit at the intersection of business viability, technical feasibility, and human desire. Here is how I navigate that space.
          </p>
        </motion.div>

        <div className="grid-3">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass-card"
            >
              <div style={{ marginBottom: '1.5rem', display: 'inline-block', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                {skill.icon}
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{skill.title}</h3>
              <p style={{ color: 'var(--text-secondary)' }}>{skill.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
