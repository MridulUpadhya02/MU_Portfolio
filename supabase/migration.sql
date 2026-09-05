-- ========================================================================
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

INSERT INTO public.portfolio_sections (id, content)
VALUES ('hero', '{"greeting":"Hi, I''m","name":"Mridul","title":"Product Manager","badge":"PRODUCT MINDED. IMPACT DRIVEN.","tagline":"I build products that solve real user problems, drive business growth and create meaningful impact.","roles":["PRODUCT MANAGER","PRODUCT THINKER","SYSTEM BUILDER"],"stats":[{"value":"2+","label":"Years of Experience"},{"value":"3+","label":"Products Launched"},{"value":"35+","label":"Features Delivered"},{"value":"100K+","label":"Users Impacted"}],"resumeUrl":"/resume.pdf","resumeFileName":"Mridul_Upadhya_Resume.pdf","resumeFileSize":"Default PDF","resumeUpdatedAt":null,"linkedinUrl":"https://linkedin.com/in/mridulupadhya02","githubUrl":"https://github.com/MridulUpadhya02"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.portfolio_sections (id, content)
VALUES ('personal', '{"name":{"first":"Mridul","last":"Upadhya","full":"Mridul Upadhya"},"title":"Product Manager","company":"Jio Platforms","tagline":"I turn messy problems into products people actually use.","bio":[{"label":"PRODUCT","text":"Obsessed with understanding why users behave the way they do."},{"label":"BUILD","text":"Turns ambiguity and chaos into structured, shippable systems."},{"label":"LEARN","text":"Experiments constantly. Fails fast. Iterates faster."},{"label":"OUTSIDE PRODUCT","text":"Music. Conversations. Curious about everything."}],"contact":{"email":"mridulupadhya861@gmail.com","linkedin":"https://linkedin.com/in/mridulupadhya02","photo":null}}'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.portfolio_sections (id, content)
VALUES ('think', '{"problemStatement":"Users are abandoning the workflow.","frameworkStages":["DISCOVER","DEFINE","PRIORITIZE","BUILD","MEASURE"],"nodes":[{"id":"why","label":"WHY?","question":"Why is this really happening?","answer":"I start by questioning the problem itself. \"Users abandoning\" is a symptom — not a problem. I ask 5 whys before touching solutions. In 80% of cases, the stated problem is not the real problem.","framework":"DISCOVER"},{"id":"who","label":"WHO?","question":"Who exactly is experiencing this?","answer":"Not all users are equal. I segment: Who is abandoning? New users or returning? Power users or casual? The answer changes everything. I map user journeys for each segment.","framework":"DEFINE"},{"id":"data","label":"DATA?","question":"What does the data actually say?","answer":"I look for the drop-off point in the funnel, session recordings, support tickets, and NPS comments. Qualitative tells you what. Quantitative tells you how much. You need both.","framework":"DEFINE"},{"id":"what","label":"WHAT?","question":"What options do we have?","answer":"I generate at least 5 potential solutions — including the extreme ones. Constraints often eliminate the best ideas too early. I force myself to think beyond the obvious before pruning.","framework":"PRIORITIZE"},{"id":"tradeoff","label":"TRADE-OFF?","question":"What are we giving up?","answer":"Every decision has a cost. I map effort vs. impact explicitly. I ask: what happens if we don''t do this? I present trade-offs to stakeholders — not just recommendations.","framework":"PRIORITIZE"},{"id":"decision","label":"DECISION?","question":"What are we committing to, and why?","answer":"I document the decision: what we''re doing, what we''re NOT doing, and why. This prevents decision drift. If the context changes, we revisit — but we have a record.","framework":"BUILD"},{"id":"measure","label":"MEASURE?","question":"How will we know if we''re right?","answer":"I define success metrics before building — not after. Leading indicators (engagement, activation) and lagging indicators (retention, revenue). Without a hypothesis, you can''t learn.","framework":"MEASURE"}]}'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.portfolio_sections (id, content)
VALUES ('projects', '[{"id":"proj-1","title":"BOND 360 Dashboard","category":"Internal Tool","year":"2024","description":"A unified QA command-center giving leads real-time visibility into retest queues, tester capacity, and cycle health — replacing spreadsheet chaos.","tags":["Dashboard","B2B","QA"],"accentColor":"#4A90A0","metric":{"value":"196+","label":"Cases tracked"},"link":null},{"id":"proj-2","title":"NaMo App Revamp","category":"Consumer Mobile","year":"2023","description":"End-to-end redesign of the citizen engagement platform — streamlining navigation, boosting content discoverability and reducing drop-off in key flows.","tags":["Mobile","Consumer","Engagement"],"accentColor":"#7A70D0","metric":{"value":"100K+","label":"Users reached"},"link":null},{"id":"proj-3","title":"Digital Asset Management","category":"Enterprise Infrastructure","year":"2023","description":"Built the asset ingestion, tagging, and distribution pipeline from scratch — enabling cross-team creative collaboration at scale across Jio properties.","tags":["Enterprise","B2B","Infrastructure"],"accentColor":"#C0903A","metric":{"value":"35+","label":"Features shipped"},"link":null}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.portfolio_sections (id, content)
VALUES ('caseStudies', '[{"id":"aras","index":"01","title":"ARAS / BOND 360","subtitle":"Automated Retest Assignment System","company":"Jio Platforms","year":"2024","tags":["Automation","B2B","Workflow","QA"],"problem":"Retest assignment was entirely dependent on manual coordination — creating delays, errors, and invisible bottlenecks in the QA cycle.","insight":"After 40+ user interviews, the real pain wasn''t the time taken — it was the cognitive load of tracking tester availability in real time. Every PM & lead had a different mental model of who was free.","decision":"Build an intelligent assignment engine that removes human judgment from a decision that should be algorithmic: detect RFR status → check real-time availability → select optimal tester → assign → notify.","solution":"ARAS — an automated retest assignment system embedded in BOND 360 that handles the entire retest workflow from RFR detection to assignment confirmation and logging.","impact":[{"value":"196+","label":"Regression Cases Managed","description":"Across all projects post-launch"},{"value":"40+","label":"Users Interviewed","description":"Deep discovery sessions with QA leads, PMs, and testers"},{"value":"20–30%","label":"Retest TAT Improvement","description":"Reduction in time-to-assign after RFR"},{"value":"0%","label":"Mis-assignments","description":"Assignment to unavailable testers after ARAS launch"}],"tradeoffs":"We chose rule-based assignment over ML-based scheduling to ship faster and reduce the trust-building burden with users who were skeptical of \"black box\" decisions.","retrospective":"[CONTENT NEEDED — what you''d do differently]","isInteractive":true,"color":"#1A2A3A","accentColor":"#4A90A0","type":"caseStudy","link":null},{"id":"namo","index":"02","title":"NaMo App Revamp","subtitle":"Citizen Engagement Platform Redesign","company":"Jio Platforms","year":"2023","tags":["Consumer","Mobile","Engagement","Scale"],"problem":"[CONTENT NEEDED — specific problem statement]","insight":"[CONTENT NEEDED — key discovery from research]","decision":"[CONTENT NEEDED — strategic decision made]","solution":"[CONTENT NEEDED — what was built/changed]","impact":[{"value":"[?]","label":"Users Impacted","description":"[CONTENT NEEDED]"},{"value":"[?]","label":"Engagement Metric","description":"[CONTENT NEEDED]"}],"tradeoffs":"[CONTENT NEEDED]","retrospective":"[CONTENT NEEDED]","isInteractive":false,"color":"#1A1A2A","accentColor":"#7A70D0","type":"caseStudy","link":null},{"id":"dam","index":"03","title":"Digital Asset Management","subtitle":"Enterprise Asset Infrastructure","company":"Jio Platforms","year":"2023","tags":["Enterprise","Infrastructure","B2B","Scale"],"problem":"[CONTENT NEEDED — the core problem]","insight":"[CONTENT NEEDED — discovery insight]","decision":"[CONTENT NEEDED — product decision]","solution":"[CONTENT NEEDED — solution shipped]","impact":[{"value":"[?]","label":"Assets Managed","description":"[CONTENT NEEDED]"},{"value":"[?]","label":"Teams Enabled","description":"[CONTENT NEEDED]"}],"tradeoffs":"[CONTENT NEEDED]","retrospective":"[CONTENT NEEDED]","isInteractive":false,"color":"#1E1A12","accentColor":"#C0903A","type":"caseStudy","link":null}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.portfolio_sections (id, content)
VALUES ('timeline', '[{"stage":"01","title":"DISCOVER","period":"Early Career","company":"Jio Platforms","role":"Associate Product Manager","description":"Deep product discovery work. 40+ user interviews. Learning to separate symptoms from root causes. Building the research muscle.","outcome":"Defined the problem space for ARAS — which no one had articulated clearly before."},{"stage":"02","title":"BUILD","period":"[CONTENT NEEDED]","company":"Jio Platforms","role":"Product Manager","description":"Translating discovery insights into PRDs, specs, and working software. Navigating engineering trade-offs. Shipping under ambiguity.","outcome":"Shipped ARAS, NaMo App Revamp, and Digital Asset Management."},{"stage":"03","title":"SHIP","period":"2023–2024","company":"Jio Platforms","role":"Product Manager","description":"UAT coordination. Launch readiness. Stakeholder communication. The 10 things that go wrong in the last week.","outcome":"3 major products shipped. 196+ regression cases managed through ARAS."},{"stage":"04","title":"LEARN","period":"Ongoing","company":"Jio Platforms","role":"Product Manager","description":"Post-launch measurement. Identifying what worked and what didn''t. Intellectual honesty about mistakes. Iterating based on real usage.","outcome":"ARAS reduced mis-assignments to 0% post-launch. Continuous improvement cycle established."},{"stage":"05","title":"SCALE","period":"[CONTENT NEEDED]","company":"[CONTENT NEEDED]","role":"[CONTENT NEEDED]","description":"Taking what works and making it bigger, more reliable, more impactful.","outcome":"[CONTENT NEEDED]"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.portfolio_sections (id, content)
VALUES ('skills', '[{"label":"Product Discovery","level":95},{"label":"Roadmap Planning","level":90},{"label":"Stakeholder Management","level":88},{"label":"User Research & UAT","level":92},{"label":"PRD & Spec Writing","level":87},{"label":"Data-Driven Decisions","level":85},{"label":"Agile / Scrum","level":90},{"label":"Prioritisation Frameworks","level":88}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.portfolio_sections (id, content)
VALUES ('tools', '[{"name":"Jira","category":"PM","icon":"🟦"},{"name":"Confluence","category":"Docs","icon":"📄"},{"name":"Figma","category":"Design","icon":"🎨"},{"name":"Mixpanel","category":"Analytics","icon":"📊"},{"name":"Miro","category":"Collab","icon":"🗂️"},{"name":"SQL","category":"Data","icon":"🗄️"},{"name":"Notion","category":"Docs","icon":"📝"},{"name":"Looker","category":"Analytics","icon":"🔭"},{"name":"Slack","category":"Comms","icon":"💬"},{"name":"Linear","category":"PM","icon":"⚡"},{"name":"Hotjar","category":"Research","icon":"🎯"},{"name":"Amplitude","category":"Analytics","icon":"📈"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.portfolio_sections (id, content)
VALUES ('approach', '[{"num":"01","title":"Discover","icon":"🔍","color":"rgba(90,138,255,0.12)","border":"rgba(90,138,255,0.2)","glow":"rgba(90,138,255,0.15)","description":"Deep user research, stakeholder interviews, and data mining to surface the real problem — not the symptom.","tags":["User Interviews","Data Analysis","Market Research"]},{"num":"02","title":"Define","icon":"🎯","color":"rgba(200,242,62,0.08)","border":"rgba(200,242,62,0.2)","glow":"rgba(200,242,62,0.12)","description":"Translate messy insights into crisp problem statements, success metrics, and a ruthlessly prioritised backlog.","tags":["PRD","OKRs","Prioritisation"]},{"num":"03","title":"Build","icon":"⚡","color":"rgba(255,138,101,0.08)","border":"rgba(255,138,101,0.2)","glow":"rgba(255,138,101,0.12)","description":"Ship in small, validated slices. Work alongside engineering to unblock fast and keep quality bar high.","tags":["Sprints","UAT","Stakeholders"]},{"num":"04","title":"Learn","icon":"📈","color":"rgba(74,222,128,0.08)","border":"rgba(74,222,128,0.2)","glow":"rgba(74,222,128,0.12)","description":"Measure against the metrics that matter. Double down on what works, iterate fast on what doesn''t.","tags":["Analytics","A/B Tests","Retros"]}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.portfolio_sections (id, content)
VALUES ('impactEngine', '{"metrics":[{"value":"196+","label":"Regression Cases","description":"Managed across all projects post-launch"},{"value":"40+","label":"Users Interviewed","description":"Deep discovery sessions with QA leads, PMs & testers"},{"value":"30%","label":"TAT Improvement","description":"Reduction in time-to-assign after RFR detection"},{"value":"0%","label":"Mis-assignments","description":"Assignment to unavailable testers after ARAS launch"}]}'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.portfolio_sections (id, content)
VALUES ('contact', '{"headline":"Let''s Build Something","highlightText":"Impactful Together","subtitle":"Whether you have a product challenge, need end-to-end PM leadership, or want to exchange ideas on systems & scale — my inbox is always open.","email":"mridulupadhya861@gmail.com","linkedin":"https://linkedin.com/in/mridulupadhya02","github":"https://github.com/MridulUpadhya02","location":"Mumbai, India","meetingLink":"https://calendly.com/mridulupadhya02","badges":[{"title":"Quick Response","sub":"Usually replies within 24 hours"},{"title":"Open to Opportunities","sub":"Full-time roles, collaborations or product discussions"},{"title":"Let''s Create Impact","sub":"Building solutions that make a difference"}]}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ========================================================================
-- END OF MIGRATION
-- ========================================================================
