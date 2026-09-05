import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { PERSONAL, PROJECTS, SIDE_PROJECTS, THINK_NODES, TIMELINE_STAGES } from '../data/content.js';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js';

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

const PortfolioDataContext = createContext({
  data: DEFAULT_PORTFOLIO_DATA,
  updateSection: async () => {},
  updateFullData: async () => {},
  resetToDefaults: async () => {},
  hasCustomizations: false,
  isSupabaseActive: false,
  syncStatus: 'loading', // 'loading' | 'synced' | 'local_fallback' | 'error'
  isSaving: false,
  lastSyncedAt: null,
  syncError: null,
  refreshData: async () => {},
  verifyPasscode: async () => false,
  changePasscode: async () => {},
});

export function PortfolioDataProvider({ children }) {
  const [data, setData] = useState(DEFAULT_PORTFOLIO_DATA);
  const [hasCustomizations, setHasCustomizations] = useState(false);
  const [syncStatus, setSyncStatus] = useState(() => (isSupabaseConfigured() ? 'loading' : 'local_fallback'));
  const [isSaving, setIsSaving] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [syncError, setSyncError] = useState(null);
  const isMountedRef = useRef(true);

  // Helper to get active admin passcode from session
  const getActivePasscode = useCallback(() => {
    try {
      return (
        sessionStorage.getItem('mridul_hq_active_passcode') ||
        localStorage.getItem('mridul_hq_passcode_v1') ||
        'mridul2026'
      );
    } catch {
      return 'mridul2026';
    }
  }, []);

  // Fetch all sections from Supabase
  const refreshData = useCallback(async () => {
    if (!isSupabaseConfigured() || !supabase) {
      setSyncStatus('local_fallback');
      return;
    }

    try {
      setSyncStatus((prev) => (prev === 'synced' ? 'synced' : 'loading'));
      const { data: rows, error } = await supabase
        .from('portfolio_sections')
        .select('id, content, updated_at');

      if (error) {
        console.warn('[Supabase Sync] Fetch warning:', error.message);
        setSyncStatus('error');
        setSyncError(error.message);
        return;
      }

      if (rows && rows.length > 0) {
        const merged = { ...DEFAULT_PORTFOLIO_DATA };
        rows.forEach(({ id, content }) => {
          let parsed = content;
          if (typeof content === 'string') {
            try {
              parsed = JSON.parse(content);
            } catch {
              parsed = content;
            }
          }

          if (id === 'caseStudies') {
            merged.caseStudies = Array.isArray(parsed) && parsed.length > 0
              ? parsed
              : DEFAULT_PORTFOLIO_DATA.caseStudies;
          } else if (id === 'projects') {
            merged.projects = Array.isArray(parsed) && parsed.length > 0
              ? parsed
              : DEFAULT_PORTFOLIO_DATA.projects;
          } else if (parsed && typeof parsed === 'object') {
            merged[id] = parsed;
          }
        });
        setData(merged);
        setHasCustomizations(true);
        setSyncStatus('synced');
        setLastSyncedAt(new Date());
        setSyncError(null);
      } else {
        // Table exists but has no records yet
        setSyncStatus('synced');
        setHasCustomizations(false);
      }
    } catch (err) {
      console.error('[Supabase Sync] Fetch error:', err);
      setSyncStatus('error');
      setSyncError(err.message || 'Connection error');
    }
  }, []);

  // Initial load and Realtime listener across all devices
  useEffect(() => {
    isMountedRef.current = true;
    refreshData();

    if (!isSupabaseConfigured() || !supabase) {
      return () => {
        isMountedRef.current = false;
      };
    }

    // Subscribe to Postgres changes on portfolio_sections
    const channel = supabase
      .channel('public:portfolio_sections')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'portfolio_sections' },
        (payload) => {
          if (payload.new && payload.new.id) {
            let nextVal = payload.new.content;
            if (typeof nextVal === 'string') {
              try { nextVal = JSON.parse(nextVal); } catch {}
            }
            if (payload.new.id === 'caseStudies' && (!Array.isArray(nextVal) || nextVal.length === 0)) {
              nextVal = DEFAULT_PORTFOLIO_DATA.caseStudies;
            } else if (payload.new.id === 'projects' && (!Array.isArray(nextVal) || nextVal.length === 0)) {
              nextVal = DEFAULT_PORTFOLIO_DATA.projects;
            }

            setData((prev) => ({
              ...prev,
              [payload.new.id]: nextVal,
            }));
            setLastSyncedAt(new Date());
            setSyncStatus('synced');
            setHasCustomizations(true);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.info('[Supabase Realtime] Connected. Synchronizing portfolio across devices.');
        }
      });

    return () => {
      isMountedRef.current = false;
      supabase.removeChannel(channel);
    };
  }, [refreshData]);

  // Update a single section
  const updateSection = useCallback(async (sectionKey, updater) => {
    let nextContent = null;
    setData((prev) => {
      const current = prev[sectionKey];
      const next = typeof updater === 'function' ? updater(current) : updater;
      nextContent = next;
      return {
        ...prev,
        [sectionKey]: next,
      };
    });

    if (!nextContent) return;

    if (isSupabaseConfigured() && supabase) {
      setIsSaving(true);
      setSyncError(null);
      const passcode = getActivePasscode();

      try {
        // 1. Try secure RPC function (verifies admin passcode)
        const { data: rpcSuccess, error: rpcError } = await supabase.rpc('update_portfolio_section', {
          p_section: sectionKey,
          p_content: nextContent,
          p_passcode: passcode,
        });

        if (rpcError) {
          // 2. Direct upsert fallback
          const { error: upsertError } = await supabase
            .from('portfolio_sections')
            .upsert({
              id: sectionKey,
              content: nextContent,
              updated_at: new Date().toISOString(),
            });

          if (upsertError) {
            throw new Error(rpcError.message || upsertError.message);
          }
        }

        setLastSyncedAt(new Date());
        setSyncStatus('synced');
        setHasCustomizations(true);
      } catch (err) {
        console.error(`[Supabase Save] Failed to update section "${sectionKey}":`, err);
        setSyncError(err.message || 'Failed to save to Supabase');
        throw err;
      } finally {
        setIsSaving(false);
      }
    }
  }, [getActivePasscode]);

  // Bulk update all data
  const updateFullData = useCallback(async (newData) => {
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

    if (isSupabaseConfigured() && supabase) {
      setIsSaving(true);
      setSyncError(null);
      const passcode = getActivePasscode();

      try {
        const { error: rpcError } = await supabase.rpc('update_all_portfolio_data', {
          p_data: sanitized,
          p_passcode: passcode,
        });

        if (rpcError) {
          const records = Object.entries(sanitized).map(([id, content]) => ({
            id,
            content,
            updated_at: new Date().toISOString(),
          }));
          const { error: upsertError } = await supabase
            .from('portfolio_sections')
            .upsert(records);
          if (upsertError) throw upsertError;
        }

        setLastSyncedAt(new Date());
        setSyncStatus('synced');
        setHasCustomizations(true);
      } catch (err) {
        console.error('[Supabase Save] Bulk update failed:', err);
        setSyncError(err.message || 'Bulk save failed');
        throw err;
      } finally {
        setIsSaving(false);
      }
    }
  }, [getActivePasscode]);

  // Reset to default data
  const resetToDefaults = useCallback(async () => {
    setData(DEFAULT_PORTFOLIO_DATA);
    if (isSupabaseConfigured() && supabase) {
      await updateFullData(DEFAULT_PORTFOLIO_DATA);
      setHasCustomizations(false);
    }
  }, [updateFullData]);

  // Passcode verification helper
  const verifyPasscode = useCallback(async (candidatePasscode) => {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: isValid, error } = await supabase.rpc('verify_admin_passcode', {
          p_passcode: candidatePasscode.trim(),
        });
        if (!error && typeof isValid === 'boolean') {
          return isValid;
        }
      } catch (e) {
        console.warn('[Supabase Auth] RPC verify failed, falling back to local:', e);
      }
    }
    const localCode = localStorage.getItem('mridul_hq_passcode_v1') || 'mridul2026';
    return candidatePasscode.trim() === localCode.trim();
  }, []);

  // Change passcode helper
  const changePasscode = useCallback(async (oldPasscode, newPasscode) => {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.rpc('change_admin_passcode', {
        p_old_passcode: oldPasscode.trim(),
        p_new_passcode: newPasscode.trim(),
      });
      if (error) {
        throw new Error(error.message || 'Failed to update passcode in database');
      }
    }
    sessionStorage.setItem('mridul_hq_active_passcode', newPasscode.trim());
    localStorage.setItem('mridul_hq_passcode_v1', newPasscode.trim());
  }, []);

  return (
    <PortfolioDataContext.Provider
      value={{
        data,
        updateSection,
        updateFullData,
        resetToDefaults,
        hasCustomizations,
        isSupabaseActive: isSupabaseConfigured(),
        syncStatus,
        isSaving,
        lastSyncedAt,
        syncError,
        refreshData,
        verifyPasscode,
        changePasscode,
      }}
    >
      {children}
    </PortfolioDataContext.Provider>
  );
}

export function usePortfolioData() {
  return useContext(PortfolioDataContext);
}
