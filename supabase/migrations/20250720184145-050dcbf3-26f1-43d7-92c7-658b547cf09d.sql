-- Create enhanced tables for JijiSauti platform step by step

-- Create zoning_violations table
CREATE TABLE IF NOT EXISTS zoning_violations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  violation_type TEXT NOT NULL,
  location geometry(Point, 4326),
  address TEXT,
  plot_number TEXT,
  developer_name TEXT,
  evidence_description TEXT,
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'confirmed', 'resolved')),
  image_urls TEXT[],
  reporter_id UUID REFERENCES auth.users(id),
  is_anonymous boolean DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create issue_updates table for allowing users to update their reports
CREATE TABLE IF NOT EXISTS issue_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES civic_issues(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  update_text TEXT NOT NULL,
  additional_images TEXT[],
  update_type TEXT DEFAULT 'progress' CHECK (update_type IN ('progress', 'clarification', 'evidence')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create violation_updates table for zoning violation updates
CREATE TABLE IF NOT EXISTS violation_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  violation_id UUID NOT NULL REFERENCES zoning_violations(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  update_text TEXT NOT NULL,
  additional_images TEXT[],
  update_type TEXT DEFAULT 'progress' CHECK (update_type IN ('progress', 'clarification', 'evidence')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create stakeholder_profiles table for civic match feature
CREATE TABLE IF NOT EXISTS stakeholder_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  organization_name TEXT,
  stakeholder_type TEXT NOT NULL, -- 'resident', 'business', 'ngo', 'government', 'media'
  influence_level INTEGER DEFAULT 1 CHECK (influence_level BETWEEN 1 AND 5),
  expertise_areas TEXT[],
  contact_preferences jsonb DEFAULT '{}',
  location geometry(Point, 4326),
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create cms_job_postings for admin-created jobs
CREATE TABLE IF NOT EXISTS cms_job_postings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  location geometry(Point, 4326),
  address TEXT,
  budget_min NUMERIC,
  budget_max NUMERIC,
  required_skills TEXT[],
  urgency TEXT DEFAULT 'normal' CHECK (urgency IN ('low', 'normal', 'high', 'urgent')),
  civic_credits_reward INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'closed')),
  created_by UUID REFERENCES auth.users(id),
  published_at TIMESTAMPTZ,
  deadline TIMESTAMPTZ,
  image_urls TEXT[],
  contact_info jsonb DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE zoning_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE issue_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE violation_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE stakeholder_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_job_postings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view zoning violations" ON zoning_violations FOR SELECT USING (true);
CREATE POLICY "Authenticated users can report violations" ON zoning_violations FOR INSERT WITH CHECK (auth.uid() = reporter_id OR is_anonymous = true);
CREATE POLICY "Users can update own violations or admins can manage" ON zoning_violations FOR UPDATE USING (auth.uid() = reporter_id OR EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.user_type = 'admin'));

CREATE POLICY "Users can view issue updates" ON issue_updates FOR SELECT USING (true);
CREATE POLICY "Issue reporters can add updates" ON issue_updates FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM civic_issues WHERE civic_issues.id = issue_updates.issue_id AND civic_issues.reporter_id = auth.uid()));

CREATE POLICY "Users can view violation updates" ON violation_updates FOR SELECT USING (true);
CREATE POLICY "Violation reporters can add updates" ON violation_updates FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM zoning_violations WHERE zoning_violations.id = violation_updates.violation_id AND zoning_violations.reporter_id = auth.uid()));

CREATE POLICY "Anyone can view stakeholder profiles" ON stakeholder_profiles FOR SELECT USING (true);
CREATE POLICY "Users can manage own stakeholder profile" ON stakeholder_profiles FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view published jobs" ON cms_job_postings FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can manage job postings" ON cms_job_postings FOR ALL USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.user_type = 'admin'));

-- Add missing columns to existing tables
ALTER TABLE civic_issues ADD COLUMN IF NOT EXISTS coordinates geometry(Point, 4326);
ALTER TABLE civic_issues ADD COLUMN IF NOT EXISTS is_anonymous boolean DEFAULT false;
ALTER TABLE civic_issues ADD COLUMN IF NOT EXISTS plot_number text;

ALTER TABLE job_postings ADD COLUMN IF NOT EXISTS coordinates geometry(Point, 4326);
ALTER TABLE job_postings ADD COLUMN IF NOT EXISTS is_user_created boolean DEFAULT false;
ALTER TABLE job_postings ADD COLUMN IF NOT EXISTS contact_info jsonb DEFAULT '{}';

ALTER TABLE collaboration_groups ADD COLUMN IF NOT EXISTS coordinates geometry(Point, 4326);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_civic_issues_coordinates ON civic_issues USING GIST(coordinates);
CREATE INDEX IF NOT EXISTS idx_zoning_violations_coordinates ON zoning_violations USING GIST(coordinates);
CREATE INDEX IF NOT EXISTS idx_collaboration_groups_coordinates ON collaboration_groups USING GIST(coordinates);
CREATE INDEX IF NOT EXISTS idx_stakeholder_profiles_coordinates ON stakeholder_profiles USING GIST(coordinates);
CREATE INDEX IF NOT EXISTS idx_cms_job_postings_coordinates ON cms_job_postings USING GIST(coordinates);

-- Sample data
INSERT INTO zoning_violations (title, description, violation_type, address, severity, status)
VALUES 
  ('Unauthorized high-rise construction', 'Building exceeding approved height limits on Lenana Road', 'Height Limit Exceeded', 'Lenana Road, Kilimani', 'high', 'investigating'),
  ('Commercial use in residential zone', 'Shop operating in designated residential area', 'Zoning Misuse', 'Kindaruma Road, Kilimani', 'medium', 'pending'),
  ('Construction without permit', 'New building construction without visible permits', 'Building Without Permit', 'Argwings Kodhek Road', 'high', 'confirmed');

-- Sample CMS job postings
INSERT INTO cms_job_postings (title, description, category, address, budget_min, budget_max, required_skills, urgency, civic_credits_reward, status, published_at)
VALUES 
  ('Community Center Electrical Repair', 'Repair electrical wiring and install backup lighting system', 'Electrical', 'Kilimani Community Center', 8000, 12000, ARRAY['Electrical Work', 'Safety Compliance'], 'high', 75, 'published', now()),
  ('Public Toilet Maintenance', 'Monthly cleaning and maintenance of public facilities', 'Maintenance', 'Kilimani Market Area', 3000, 5000, ARRAY['Cleaning', 'Plumbing'], 'normal', 40, 'published', now()),
  ('Street Art Mural Project', 'Create community mural on designated wall space', 'Creative', 'Kindaruma Road Underpass', 15000, 25000, ARRAY['Art', 'Community Engagement'], 'low', 100, 'published', now());