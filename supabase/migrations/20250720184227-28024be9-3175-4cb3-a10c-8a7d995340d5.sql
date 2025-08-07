-- Create enhanced tables for JijiSauti platform - Part 1: Tables only

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