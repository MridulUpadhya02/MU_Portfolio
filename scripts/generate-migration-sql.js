import { PERSONAL, PROJECTS, SIDE_PROJECTS, THINK_NODES, TIMELINE_STAGES } from '../src/data/content.js';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve } from 'path';

const DEFAULT_APPROACH_STEPS = [
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

const DEFAULT_IMPACT_METRICS = [
  { value: '196+', label: 'Regression Cases', description: 'Managed across all projects post-launch' },
  { value: '40+', label: 'Users Interviewed', description: 'Deep discovery sessions with QA leads, PMs & testers' },
  { value: '30%', label: 'TAT Improvement', description: 'Reduction in time-to-assign after RFR detection' },
  { value: '0%', label: 'Mis-assignments', description: 'Assignment to unavailable testers after ARAS launch' },
];

const DEFAULT_PORTFOLIO_DATA = {
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

const sqlDir = resolve(process.cwd(), 'supabase');
if (!existsSync(sqlDir)) {
  mkdirSync(sqlDir, { recursive: true });
}

let sql = `-- ========================================================================
-- SUPABASE MIGRATION: Centralized Portfolio Persistence
-- Generated for Mridul Upadhya's Portfolio
-- ========================================================================

-- 1. Create portfolio_sections table (Single source of truth for all sections)
CREATE TABLE IF NOT EXISTS public.portfolio_sections (
  id TEXT PRIMARY KEY,
  content JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Create admin_security table (Stores master admin passcode centrally)
CREATE TABLE IF NOT EXISTS public.admin_security (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  passcode TEXT NOT NULL DEFAULT 'mridul2026',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Insert default admin passcode if not present
INSERT INTO public.admin_security (id, passcode)
VALUES (1, 'mridul2026')
ON CONFLICT (id) DO NOTHING;

-- 3. Row Level Security (RLS)
ALTER TABLE public.portfolio_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_security ENABLE ROW LEVEL SECURITY;

-- Allow anyone (public/anon) to read portfolio sections
DROP POLICY IF EXISTS "Public Read Portfolio Sections" ON public.portfolio_sections;
CREATE POLICY "Public Read Portfolio Sections" ON public.portfolio_sections
  FOR SELECT USING (true);

-- Deny direct public write access (writes only happen via security definer RPCs)
DROP POLICY IF EXISTS "Deny Public Insert" ON public.portfolio_sections;
DROP POLICY IF EXISTS "Deny Public Update" ON public.portfolio_sections;
DROP POLICY IF EXISTS "Deny Public Delete" ON public.portfolio_sections;

-- 4. Secure RPC Stored Procedures (SECURITY DEFINER allows atomic checks & updates)

-- Function: Verify Admin Passcode
CREATE OR REPLACE FUNCTION public.verify_admin_passcode(p_passcode TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stored_passcode TEXT;
BEGIN
  SELECT passcode INTO stored_passcode FROM public.admin_security WHERE id = 1;
  IF stored_passcode IS NULL THEN
    stored_passcode := 'mridul2026';
  END IF;
  RETURN p_passcode = stored_passcode;
END;
$$;

-- Function: Change Admin Passcode
CREATE OR REPLACE FUNCTION public.change_admin_passcode(p_old_passcode TEXT, p_new_passcode TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stored_passcode TEXT;
BEGIN
  SELECT passcode INTO stored_passcode FROM public.admin_security WHERE id = 1;
  IF stored_passcode IS NULL THEN
    stored_passcode := 'mridul2026';
  END IF;

  IF p_old_passcode <> stored_passcode THEN
    RAISE EXCEPTION 'Invalid current passcode';
  END IF;

  IF length(trim(p_new_passcode)) < 4 THEN
    RAISE EXCEPTION 'New passcode must be at least 4 characters long';
  END IF;

  UPDATE public.admin_security
  SET passcode = trim(p_new_passcode), updated_at = timezone('utc'::text, now())
  WHERE id = 1;

  RETURN TRUE;
END;
$$;

-- Function: Update a single portfolio section
CREATE OR REPLACE FUNCTION public.update_portfolio_section(
  p_section TEXT,
  p_content JSONB,
  p_passcode TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_valid BOOLEAN;
BEGIN
  is_valid := public.verify_admin_passcode(p_passcode);
  IF NOT is_valid THEN
    RAISE EXCEPTION 'Unauthorized: Invalid admin security key';
  END IF;

  INSERT INTO public.portfolio_sections (id, content, updated_at)
  VALUES (p_section, p_content, timezone('utc'::text, now()))
  ON CONFLICT (id) DO UPDATE
  SET content = EXCLUDED.content,
      updated_at = timezone('utc'::text, now());

  RETURN TRUE;
END;
$$;

-- Function: Update all portfolio sections in bulk
CREATE OR REPLACE FUNCTION public.update_all_portfolio_data(
  p_data JSONB,
  p_passcode TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_valid BOOLEAN;
  key TEXT;
  val JSONB;
BEGIN
  is_valid := public.verify_admin_passcode(p_passcode);
  IF NOT is_valid THEN
    RAISE EXCEPTION 'Unauthorized: Invalid admin security key';
  END IF;

  FOR key, val IN SELECT * FROM jsonb_each(p_data)
  LOOP
    INSERT INTO public.portfolio_sections (id, content, updated_at)
    VALUES (key, val, timezone('utc'::text, now()))
    ON CONFLICT (id) DO UPDATE
    SET content = EXCLUDED.content,
        updated_at = timezone('utc'::text, now());
  END LOOP;

  RETURN TRUE;
END;
$$;

-- 5. Enable Realtime Replication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'portfolio_sections'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.portfolio_sections;
  END IF;
END;
$$;

-- 6. Initial Seed Data (Preserves 100% of existing portfolio content)
`;

for (const [key, content] of Object.entries(DEFAULT_PORTFOLIO_DATA)) {
  const jsonStr = JSON.stringify(content).replace(/'/g, "''");
  sql += `
INSERT INTO public.portfolio_sections (id, content)
VALUES ('${key}', '${jsonStr}'::jsonb)
ON CONFLICT (id) DO NOTHING;
`;
}

sql += `
-- ========================================================================
-- END OF MIGRATION
-- ========================================================================
`;

writeFileSync(resolve(sqlDir, 'migration.sql'), sql, 'utf8');
console.log('Successfully generated supabase/migration.sql');
