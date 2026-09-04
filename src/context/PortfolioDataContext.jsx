import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PERSONAL, PROJECTS, SIDE_PROJECTS, THINK_NODES, TIMELINE_STAGES } from '../data/content.js';

const STORAGE_KEY = 'mridul_portfolio_custom_data_v1';

export const DEFAULT_APPROACH_STEPS = [
  {
    num: '01',
    title: 'Discover',
    icon: '🔍',
    color: 'rgba(90,138,255,0.12)',
    border: 'rgba(90,138,255,0.2)',
    glow: 'rgba(90,138,255,0.15)',
    description:
      'Deep user research, stakeholder interviews, and data mining to surface the real problem — not the symptom.',
    tags: ['User Interviews', 'Data Analysis', 'Market Research'],
  },
  {
    num: '02',
    title: 'Define',
    icon: '🎯',
    color: 'rgba(200,242,62,0.08)',
    border: 'rgba(200,242,62,0.2)',
    glow: 'rgba(200,242,62,0.12)',
    description:
      'Translate messy insights into crisp problem statements, success metrics, and a ruthlessly prioritised backlog.',
    tags: ['PRD', 'OKRs', 'Prioritisation'],
  },
  {
    num: '03',
    title: 'Build',
    icon: '⚡',
    color: 'rgba(255,138,101,0.08)',
    border: 'rgba(255,138,101,0.2)',
    glow: 'rgba(255,138,101,0.12)',
    description:
      'Ship in small, validated slices. Work alongside engineering to unblock fast and keep quality bar high.',
    tags: ['Sprints', 'UAT', 'Stakeholders'],
  },
  {
    num: '04',
    title: 'Learn',
    icon: '📈',
    color: 'rgba(74,222,128,0.08)',
    border: 'rgba(74,222,128,0.2)',
    glow: 'rgba(74,222,128,0.12)',
    description:
      "Measure against the metrics that matter. Double down on what works, iterate fast on what doesn't.",
    tags: ['Analytics', 'A/B Tests', 'Retros'],
  },
];

export const DEFAULT_IMPACT_METRICS = [
  { value: '196+', label: 'Regression Cases', description: 'Managed across all projects post-launch' },
  { value: '40+', label: 'Users Interviewed', description: 'Deep discovery sessions with QA leads, PMs & testers' },
  { value: '30%', label: 'TAT Improvement', description: 'Reduction in time-to-assign after RFR detection' },
  { value: '0%', label: 'Mis-assignments', description: 'Assignment to unavailable testers after ARAS launch' },
];

export const DEFAULT_PORTFOLIO_DATA = {
  hero: {
    greeting: "Hi, I'm",
    name: "Mridul",
    title: "Product Manager",
    badge: "PRODUCT MINDED. IMPACT DRIVEN.",
    tagline: "I build products that solve real user problems, drive business growth and create meaningful impact.",
    roles: ["PRODUCT MANAGER", "PRODUCT THINKER", "SYSTEM BUILDER"],
    stats: [
      { value: '2+', label: 'Years of Experience' },
      { value: '3+', label: 'Products Launched' },
      { value: '35+', label: 'Features Delivered' },
      { value: '100K+', label: 'Users Impacted' },
    ],
    resumeUrl: "/resume.pdf",
    resumeFileName: "Mridul_Upadhya_Resume.pdf",
    resumeFileSize: "Default PDF",
    resumeUpdatedAt: null,
    linkedinUrl: "https://linkedin.com/in/mridulupadhya02",
    githubUrl: "https://github.com/MridulUpadhya02",
  },
  personal: PERSONAL,
  think: {
    problemStatement: "Users are abandoning the workflow.",
    frameworkStages: ['DISCOVER', 'DEFINE', 'PRIORITIZE', 'BUILD', 'MEASURE'],
    nodes: THINK_NODES,
  },
  projects: SIDE_PROJECTS,
  caseStudies: PROJECTS,
  timeline: TIMELINE_STAGES,
  skills: [
    { label: 'Product Discovery', level: 95 },
    { label: 'Roadmap Planning', level: 90 },
    { label: 'Stakeholder Management', level: 88 },
    { label: 'User Research & UAT', level: 92 },
    { label: 'PRD & Spec Writing', level: 87 },
    { label: 'Data-Driven Decisions', level: 85 },
    { label: 'Agile / Scrum', level: 90 },
    { label: 'Prioritisation Frameworks', level: 88 },
  ],
  tools: [
    { name: 'Jira', category: 'PM', icon: '🟦' },
    { name: 'Confluence', category: 'Docs', icon: '📄' },
    { name: 'Figma', category: 'Design', icon: '🎨' },
    { name: 'Mixpanel', category: 'Analytics', icon: '📊' },
    { name: 'Miro', category: 'Collab', icon: '🗂️' },
    { name: 'SQL', category: 'Data', icon: '🗄️' },
    { name: 'Notion', category: 'Docs', icon: '📝' },
    { name: 'Looker', category: 'Analytics', icon: '🔭' },
    { name: 'Slack', category: 'Comms', icon: '💬' },
    { name: 'Linear', category: 'PM', icon: '⚡' },
    { name: 'Hotjar', category: 'Research', icon: '🎯' },
    { name: 'Amplitude', category: 'Analytics', icon: '📈' },
  ],
  approach: DEFAULT_APPROACH_STEPS,
  impactEngine: {
    metrics: DEFAULT_IMPACT_METRICS,
  },
  contact: {
    headline: "Let's Build Something",
    highlightText: "Impactful Together",
    subtitle: "Whether you have a product challenge, need end-to-end PM leadership, or want to exchange ideas on systems & scale — my inbox is always open.",
    email: "mridulupadhya861@gmail.com",
    linkedin: "https://linkedin.com/in/mridulupadhya02",
    github: "https://github.com/MridulUpadhya02",
    location: "Mumbai, India",
    meetingLink: "https://calendly.com/mridulupadhya02",
    badges: [
      { title: 'Quick Response', sub: 'Usually replies within 24 hours' },
      { title: 'Open to Opportunities', sub: 'Full-time roles, collaborations or product discussions' },
      { title: "Let's Create Impact", sub: 'Building solutions that make a difference' },
    ],
  },
};

function parseStoredData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_PORTFOLIO_DATA,
        ...parsed,
        hero: { ...DEFAULT_PORTFOLIO_DATA.hero, ...(parsed.hero || {}) },
        personal: {
          ...DEFAULT_PORTFOLIO_DATA.personal,
          ...(parsed.personal || {}),
          contact: {
            ...DEFAULT_PORTFOLIO_DATA.personal?.contact,
            ...(parsed.personal?.contact || {}),
          },
          bio: parsed.personal?.bio || DEFAULT_PORTFOLIO_DATA.personal.bio,
        },
        think: { ...DEFAULT_PORTFOLIO_DATA.think, ...(parsed.think || {}) },
        contact: { ...DEFAULT_PORTFOLIO_DATA.contact, ...(parsed.contact || {}) },
        projects: parsed.projects || DEFAULT_PORTFOLIO_DATA.projects,
        caseStudies: parsed.caseStudies || DEFAULT_PORTFOLIO_DATA.caseStudies,
        timeline: parsed.timeline || DEFAULT_PORTFOLIO_DATA.timeline,
        skills: parsed.skills || DEFAULT_PORTFOLIO_DATA.skills,
        tools: parsed.tools || DEFAULT_PORTFOLIO_DATA.tools,
        approach: parsed.approach || DEFAULT_PORTFOLIO_DATA.approach,
        impactEngine: parsed.impactEngine || DEFAULT_PORTFOLIO_DATA.impactEngine,
      };
    }
  } catch (e) {
    console.warn('Failed to load portfolio custom data from storage:', e);
  }
  return DEFAULT_PORTFOLIO_DATA;
}

const PortfolioDataContext = createContext({
  data: DEFAULT_PORTFOLIO_DATA,
  updateSection: () => {},
  updateFullData: () => {},
  resetToDefaults: () => {},
  hasCustomizations: false,
});

export function PortfolioDataProvider({ children }) {
  const [data, setData] = useState(parseStoredData);
  const [hasCustomizations, setHasCustomizations] = useState(false);

  useEffect(() => {
    try {
      setHasCustomizations(Boolean(localStorage.getItem(STORAGE_KEY)));
    } catch {
      setHasCustomizations(false);
    }
  }, [data]);

  // Real-time synchronization across browser tabs and windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY) {
        setData(parseStoredData());
      }
    };
    const handleCustomSync = (e) => {
      if (e.detail) {
        setData(e.detail);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('portfolio-data-synced', handleCustomSync);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('portfolio-data-synced', handleCustomSync);
    };
  }, []);

  const updateSection = useCallback((sectionKey, updater) => {
    setData((prev) => {
      const currentSection = prev[sectionKey];
      const nextSection = typeof updater === 'function' ? updater(currentSection) : updater;
      const nextState = {
        ...prev,
        [sectionKey]: nextSection,
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
        window.dispatchEvent(new CustomEvent('portfolio-data-synced', { detail: nextState }));
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
      }
      return nextState;
    });
  }, []);

  const updateFullData = useCallback((newData) => {
    const sanitized = {
      ...DEFAULT_PORTFOLIO_DATA,
      ...newData,
      hero: { ...DEFAULT_PORTFOLIO_DATA.hero, ...(newData.hero || {}) },
      personal: {
        ...DEFAULT_PORTFOLIO_DATA.personal,
        ...(newData.personal || {}),
        contact: {
          ...DEFAULT_PORTFOLIO_DATA.personal?.contact,
          ...(newData.personal?.contact || {}),
        },
        bio: newData.personal?.bio || DEFAULT_PORTFOLIO_DATA.personal.bio,
      },
      think: { ...DEFAULT_PORTFOLIO_DATA.think, ...(newData.think || {}) },
      contact: { ...DEFAULT_PORTFOLIO_DATA.contact, ...(newData.contact || {}) },
      projects: newData.projects || DEFAULT_PORTFOLIO_DATA.projects,
      caseStudies: newData.caseStudies || DEFAULT_PORTFOLIO_DATA.caseStudies,
      timeline: newData.timeline || DEFAULT_PORTFOLIO_DATA.timeline,
      skills: newData.skills || DEFAULT_PORTFOLIO_DATA.skills,
      tools: newData.tools || DEFAULT_PORTFOLIO_DATA.tools,
      approach: newData.approach || DEFAULT_PORTFOLIO_DATA.approach,
      impactEngine: newData.impactEngine || DEFAULT_PORTFOLIO_DATA.impactEngine,
    };
    setData(sanitized);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
      window.dispatchEvent(new CustomEvent('portfolio-data-synced', { detail: sanitized }));
    } catch (e) {
      console.error('Failed to save full data:', e);
    }
  }, []);

  const resetToDefaults = useCallback(() => {
    setData(DEFAULT_PORTFOLIO_DATA);
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('portfolio-data-synced', { detail: DEFAULT_PORTFOLIO_DATA }));
    } catch (e) {
      console.error('Failed to clear storage:', e);
    }
  }, []);

  return (
    <PortfolioDataContext.Provider
      value={{
        data,
        updateSection,
        updateFullData,
        resetToDefaults,
        hasCustomizations,
      }}
    >
      {children}
    </PortfolioDataContext.Provider>
  );
}

export function usePortfolioData() {
  return useContext(PortfolioDataContext);
}
