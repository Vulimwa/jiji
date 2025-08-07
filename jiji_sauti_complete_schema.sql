-- =====================================================
-- JijiSauti Civic Intelligence Platform - Complete Database Schema
-- =====================================================
-- This file contains the complete database schema for deployment
-- Simply paste this entire file into your Supabase SQL editor and run it

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- =====================================================
-- CUSTOM TYPES (ENUMS)
-- =====================================================

CREATE TYPE user_type AS ENUM ('resident', 'informal_worker', 'official', 'admin');
CREATE TYPE issue_status AS ENUM ('reported', 'acknowledged', 'in-progress', 'resolved', 'closed');
CREATE TYPE issue_category AS ENUM ('sewage', 'noise', 'construction', 'power', 'roads', 'waste', 'lighting', 'drainage', 'other');
CREATE TYPE campaign_status AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled');
CREATE TYPE violation_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE violation_status AS ENUM ('reported', 'acknowledged', 'under_investigation', 'confirmed', 'resolved', 'dismissed');
CREATE TYPE event_status AS ENUM ('planned', 'ongoing', 'completed', 'cancelled');
CREATE TYPE worker_verification_status AS ENUM ('pending', 'verified', 'rejected', 'suspended');
CREATE TYPE content_status AS ENUM ('draft', 'pending_review', 'approved', 'rejected', 'published');
CREATE TYPE notification_type AS ENUM ('info', 'warning', 'success', 'error', 'update');

-- =====================================================
-- MAIN TABLES
-- =====================================================

-- User Profiles Table
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone TEXT,
    user_type user_type DEFAULT 'resident',
    civic_credits INTEGER DEFAULT 0,
    location GEOGRAPHY(POINT, 4326),
    primary_location GEOGRAPHY(POINT, 4326),
    address TEXT,
    profile_image_url TEXT,
    bio TEXT,
    date_of_birth DATE,
    gender TEXT,
    occupation TEXT,
    notification_preferences JSONB DEFAULT '{"email": true, "sms": false, "push": true}',
    privacy_settings JSONB DEFAULT '{"profile_visible": true, "location_sharing": true}',
    is_verified BOOLEAN DEFAULT FALSE,
    verification_documents TEXT[],
    stakeholder_tags TEXT[] DEFAULT '{}',
    interests TEXT[] DEFAULT '{}',
    service_radius INTEGER DEFAULT 1000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Government Officials Table
CREATE TABLE government_officials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    department TEXT NOT NULL,
    position TEXT NOT NULL,
    jurisdiction_area GEOGRAPHY(POLYGON, 4326),
    contact_email TEXT,
    contact_phone TEXT,
    office_address TEXT,
    specializations TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    assigned_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Civic Issues Table (with gov response tracking)
CREATE TABLE civic_issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category issue_category NOT NULL,
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    address TEXT,
    image_urls TEXT[],
    audio_url TEXT,
    priority_votes INTEGER DEFAULT 0,
    status issue_status DEFAULT 'reported',
    reporter_id UUID REFERENCES auth.users(id),
    assigned_officer_id UUID REFERENCES government_officials(id),
    county_response TEXT,
    resolution_notes TEXT,
    resolution_images TEXT[],
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    assigned_at TIMESTAMP WITH TIME ZONE,
    resolution_date TIMESTAMP WITH TIME ZONE,
    urgency_level INTEGER DEFAULT 1 CHECK (urgency_level BETWEEN 1 AND 5),
    is_public BOOLEAN DEFAULT TRUE,
    tags TEXT[],
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Issue Comments/Updates
CREATE TABLE issue_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id UUID REFERENCES civic_issues(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    comment TEXT NOT NULL,
    is_official_response BOOLEAN DEFAULT FALSE,
    attachments TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Issue Votes (for priority ranking)
CREATE TABLE issue_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id UUID REFERENCES civic_issues(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    vote_type TEXT CHECK (vote_type IN ('up', 'down')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(issue_id, user_id)
);

-- Community Campaigns
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    goals TEXT,
    creator_id UUID REFERENCES auth.users(id),
    target_signatures INTEGER,
    current_signatures INTEGER DEFAULT 0,
    target_amount DECIMAL(10,2),
    current_amount DECIMAL(10,2) DEFAULT 0,
    status campaign_status DEFAULT 'draft',
    category TEXT,
    location GEOGRAPHY(POINT, 4326),
    address TEXT,
    image_urls TEXT[],
    deadline DATE,
    is_public BOOLEAN DEFAULT TRUE,
    tags TEXT[],
    required_documents TEXT[],
    petition_text TEXT,
    admin_approved BOOLEAN DEFAULT FALSE,
    approved_by UUID REFERENCES auth.users(id),
    approval_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaign Signatures/Support
CREATE TABLE campaign_signatures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    signature_type TEXT DEFAULT 'support' CHECK (signature_type IN ('support', 'signature', 'donation')),
    amount DECIMAL(10,2),
    comment TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(campaign_id, user_id, signature_type)
);

-- Collaboration Groups
CREATE TABLE collaboration_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    issue_focus TEXT NOT NULL,
    created_by UUID NOT NULL,
    location GEOGRAPHY(POINT, 4326),
    address TEXT,
    group_type TEXT NOT NULL DEFAULT 'public',
    status TEXT NOT NULL DEFAULT 'active',
    member_count INTEGER DEFAULT 0,
    max_members INTEGER DEFAULT 100,
    logo_url TEXT,
    banner_url TEXT,
    tags TEXT[] DEFAULT '{}',
    privacy_settings JSONB DEFAULT '{"public_activity": true, "join_approval_required": false}',
    contact_info JSONB DEFAULT '{}',
    achievements JSONB DEFAULT '{}',
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Group Memberships
CREATE TABLE group_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL,
    user_id UUID NOT NULL,
    role TEXT DEFAULT 'member',
    status TEXT DEFAULT 'active',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    invited_by UUID,
    UNIQUE(group_id, user_id)
);

-- Group Tasks
CREATE TABLE group_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    task_type TEXT NOT NULL DEFAULT 'general',
    priority TEXT NOT NULL DEFAULT 'medium',
    status TEXT NOT NULL DEFAULT 'open',
    created_by UUID NOT NULL,
    assigned_to UUID,
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    estimated_hours INTEGER,
    actual_hours INTEGER,
    location GEOGRAPHY(POINT, 4326),
    address TEXT,
    tags TEXT[] DEFAULT '{}',
    attachments TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Group Activities
CREATE TABLE group_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL,
    user_id UUID NOT NULL,
    activity_type TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    related_content_type TEXT,
    related_content_id UUID,
    metadata JSONB DEFAULT '{}',
    is_pinned BOOLEAN DEFAULT FALSE,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Group Impact Scores
CREATE TABLE group_impact_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL,
    calculation_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    impact_rating TEXT DEFAULT 'emerging',
    tasks_completed INTEGER DEFAULT 0,
    campaigns_supported INTEGER DEFAULT 0,
    issues_addressed INTEGER DEFAULT 0,
    meetings_held INTEGER DEFAULT 0,
    community_engagement_score DECIMAL DEFAULT 0.0,
    badges_earned TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Micro Taskforces
CREATE TABLE micro_taskforces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    content_type TEXT NOT NULL,
    content_id UUID NOT NULL,
    created_by UUID NOT NULL,
    max_members INTEGER DEFAULT 15,
    current_members INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    skills_needed TEXT[] DEFAULT '{}',
    time_commitment TEXT,
    location GEOGRAPHY(POINT, 4326),
    address TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Taskforce Memberships
CREATE TABLE taskforce_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    taskforce_id UUID NOT NULL,
    user_id UUID NOT NULL,
    role TEXT DEFAULT 'member',
    status TEXT DEFAULT 'active',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Taskforce Activities
CREATE TABLE taskforce_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    taskforce_id UUID NOT NULL,
    user_id UUID NOT NULL,
    activity_type TEXT NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Impact Scores (for civic match)
CREATE TABLE impact_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type TEXT NOT NULL,
    content_id UUID NOT NULL,
    total_stakeholders INTEGER DEFAULT 0,
    engaged_stakeholders INTEGER DEFAULT 0,
    stakeholder_diversity_score DECIMAL DEFAULT 0.0,
    geographic_coverage_score DECIMAL DEFAULT 0.0,
    decision_maker_engagement BOOLEAN DEFAULT FALSE,
    missing_voice_alerts TEXT[] DEFAULT '{}',
    overall_impact_score DECIMAL DEFAULT 0.0,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Informal Worker Registry
CREATE TABLE worker_registry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    services TEXT[] NOT NULL,
    specializations TEXT[],
    location GEOGRAPHY(POINT, 4326),
    service_radius INTEGER DEFAULT 5000,
    hourly_rate DECIMAL(8,2),
    daily_rate DECIMAL(8,2),
    verification_status worker_verification_status DEFAULT 'pending',
    rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    total_reviews INTEGER DEFAULT 0,
    total_jobs INTEGER DEFAULT 0,
    availability_schedule JSONB,
    portfolio_images TEXT[],
    certifications TEXT[],
    languages TEXT[],
    tools_equipment TEXT[],
    is_available BOOLEAN DEFAULT TRUE,
    verified_by UUID REFERENCES auth.users(id),
    verification_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Worker Reviews
CREATE TABLE worker_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    worker_id UUID REFERENCES worker_registry(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES auth.users(id),
    job_id UUID,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    images TEXT[],
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job Postings
CREATE TABLE job_postings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    posted_by UUID REFERENCES auth.users(id),
    category TEXT,
    location GEOGRAPHY(POINT, 4326),
    address TEXT,
    budget_min DECIMAL(10,2),
    budget_max DECIMAL(10,2),
    civic_credits_reward INTEGER DEFAULT 0,
    urgency TEXT DEFAULT 'normal' CHECK (urgency IN ('low', 'normal', 'high', 'emergency')),
    required_skills TEXT[],
    job_type TEXT DEFAULT 'one-time' CHECK (job_type IN ('one-time', 'recurring', 'contract')),
    duration_estimate TEXT,
    applications_deadline TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'open' CHECK (status IN ('draft', 'open', 'in_progress', 'completed', 'cancelled')),
    selected_worker_id UUID REFERENCES worker_registry(id),
    images TEXT[],
    admin_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job Applications
CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES job_postings(id) ON DELETE CASCADE,
    worker_id UUID REFERENCES worker_registry(id),
    proposed_rate DECIMAL(10,2),
    estimated_duration TEXT,
    cover_letter TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community Events
CREATE TABLE community_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    organizer_id UUID REFERENCES auth.users(id),
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    location GEOGRAPHY(POINT, 4326),
    address TEXT NOT NULL,
    category TEXT,
    max_attendees INTEGER,
    current_attendees INTEGER DEFAULT 0,
    status event_status DEFAULT 'planned',
    is_public BOOLEAN DEFAULT TRUE,
    registration_required BOOLEAN DEFAULT FALSE,
    registration_fee DECIMAL(8,2) DEFAULT 0,
    image_urls TEXT[],
    tags TEXT[],
    agenda TEXT,
    requirements TEXT[],
    contact_info JSONB,
    admin_approved BOOLEAN DEFAULT FALSE,
    approved_by UUID REFERENCES auth.users(id),
    approval_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event Attendance
CREATE TABLE event_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES community_events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    attendance_status TEXT DEFAULT 'registered' CHECK (attendance_status IN ('registered', 'attended', 'no_show', 'cancelled')),
    payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
    notes TEXT
);

-- Community Discussions
CREATE TABLE discussions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES auth.users(id),
    category TEXT,
    location GEOGRAPHY(POINT, 4326),
    address TEXT,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    tags TEXT[],
    admin_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Discussion Replies
CREATE TABLE discussion_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    discussion_id UUID REFERENCES discussions(id) ON DELETE CASCADE,
    parent_reply_id UUID REFERENCES discussion_replies(id),
    author_id UUID REFERENCES auth.users(id),
    content TEXT NOT NULL,
    attachments TEXT[],
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document Questions
CREATE TABLE document_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    document_title TEXT NOT NULL,
    document_type TEXT DEFAULT 'general',
    question TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    answer TEXT,
    status TEXT DEFAULT 'pending',
    answered_by UUID,
    answered_at TIMESTAMP WITH TIME ZONE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Zoning Violations (with enhanced gov response tracking)
CREATE TABLE zoning_violations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    address TEXT,
    plot_number TEXT,
    violation_type TEXT NOT NULL,
    developer_name TEXT,
    evidence_description TEXT,
    severity violation_severity DEFAULT 'medium',
    status violation_status DEFAULT 'reported',
    image_urls TEXT[],
    reporter_id UUID REFERENCES auth.users(id),
    is_anonymous BOOLEAN DEFAULT FALSE,
    latitude DECIMAL,
    longitude DECIMAL,
    assigned_investigator_id UUID REFERENCES government_officials(id),
    investigation_notes TEXT,
    resolution_date TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    assigned_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Violation Evidence
CREATE TABLE violation_evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    violation_id UUID REFERENCES zoning_violations(id) ON DELETE CASCADE,
    submitted_by UUID REFERENCES auth.users(id),
    evidence_type TEXT CHECK (evidence_type IN ('photo', 'video', 'document', 'audio')),
    file_url TEXT NOT NULL,
    description TEXT,
    location GEOGRAPHY(POINT, 4326),
    timestamp_taken TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES government_officials(id),
    verification_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budget Cycles
CREATE TABLE budget_cycles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    total_budget DECIMAL NOT NULL,
    available_budget DECIMAL NOT NULL,
    submission_start TIMESTAMP WITH TIME ZONE NOT NULL,
    submission_end TIMESTAMP WITH TIME ZONE NOT NULL,
    voting_start TIMESTAMP WITH TIME ZONE NOT NULL,
    voting_end TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Budget Proposals
CREATE TABLE budget_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    estimated_cost DECIMAL NOT NULL,
    category TEXT NOT NULL,
    submitted_by UUID NOT NULL,
    cycle_id UUID NOT NULL,
    location GEOGRAPHY(POINT, 4326),
    address TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    current_progress INTEGER DEFAULT 0,
    impact_description TEXT,
    timeline_months INTEGER,
    beneficiaries_count INTEGER,
    photo_urls TEXT[],
    total_tokens INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- User Budget Tokens
CREATE TABLE user_budget_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    cycle_id UUID NOT NULL,
    tokens_total INTEGER NOT NULL DEFAULT 5,
    tokens_used INTEGER NOT NULL DEFAULT 0,
    tokens_available INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Budget Votes
CREATE TABLE budget_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cycle_id UUID NOT NULL,
    proposal_id UUID NOT NULL,
    user_id UUID NOT NULL,
    tokens_allocated INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Project Updates
CREATE TABLE project_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    update_type TEXT DEFAULT 'general',
    progress_percent INTEGER,
    photo_urls TEXT[],
    posted_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Project Feedback
CREATE TABLE project_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID NOT NULL,
    user_id UUID NOT NULL,
    feedback_text TEXT NOT NULL,
    rating INTEGER NOT NULL,
    before_photo_url TEXT,
    after_photo_url TEXT,
    impact_story TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Flash Challenges
CREATE TABLE flash_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    reward_badge TEXT,
    submission_types TEXT[] DEFAULT ARRAY['photo'],
    verification_method TEXT DEFAULT 'auto',
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    goal_count INTEGER DEFAULT 50,
    current_count INTEGER DEFAULT 0,
    reward_points INTEGER DEFAULT 10,
    location_scope GEOGRAPHY(POINT, 4326),
    radius_meters INTEGER DEFAULT 1000,
    status TEXT DEFAULT 'active',
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Flash Challenge Responses
CREATE TABLE flash_challenge_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL,
    user_id UUID NOT NULL,
    submission_type TEXT NOT NULL,
    submission_content JSONB NOT NULL,
    location GEOGRAPHY(POINT, 4326),
    verification_status TEXT DEFAULT 'pending',
    verified_by UUID,
    verified_at TIMESTAMP WITH TIME ZONE,
    points_awarded INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Management (for Payload CMS integration)
CREATE TABLE cms_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_type TEXT NOT NULL,
    title TEXT NOT NULL,
    content JSONB NOT NULL,
    status content_status DEFAULT 'draft',
    author_id UUID REFERENCES auth.users(id),
    published_at TIMESTAMP WITH TIME ZONE,
    featured BOOLEAN DEFAULT FALSE,
    tags TEXT[],
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type notification_type DEFAULT 'info',
    related_id UUID,
    related_type TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Activity Log
CREATE TABLE user_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    description TEXT,
    related_id UUID,
    related_type TEXT,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Civic Credits Transactions
CREATE TABLE civic_credits_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    transaction_type TEXT CHECK (transaction_type IN ('earned', 'spent', 'bonus', 'penalty')),
    description TEXT,
    related_id UUID,
    related_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SECURITY FUNCTIONS
-- =====================================================

-- Secure function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND user_type = 'admin'
  );
$$;

-- Secure function to check if user is authenticated
CREATE OR REPLACE FUNCTION is_authenticated()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid() IS NOT NULL;
$$;

-- Secure function to get current user role
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS user_type
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT user_type FROM user_profiles WHERE id = auth.uid();
$$;

-- Updated timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'));
  RETURN NEW;
END;
$$;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Updated timestamp triggers
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_government_officials_updated_at BEFORE UPDATE ON government_officials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_civic_issues_updated_at BEFORE UPDATE ON civic_issues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_worker_registry_updated_at BEFORE UPDATE ON worker_registry FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_postings_updated_at BEFORE UPDATE ON job_postings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_community_events_updated_at BEFORE UPDATE ON community_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_discussions_updated_at BEFORE UPDATE ON discussions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_discussion_replies_updated_at BEFORE UPDATE ON discussion_replies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_zoning_violations_updated_at BEFORE UPDATE ON zoning_violations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cms_content_updated_at BEFORE UPDATE ON cms_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_collaboration_groups_updated_at BEFORE UPDATE ON collaboration_groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_group_tasks_updated_at BEFORE UPDATE ON group_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budget_cycles_updated_at BEFORE UPDATE ON budget_cycles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budget_proposals_updated_at BEFORE UPDATE ON budget_proposals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_budget_tokens_updated_at BEFORE UPDATE ON user_budget_tokens FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_updates_updated_at BEFORE UPDATE ON project_updates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_flash_challenges_updated_at BEFORE UPDATE ON flash_challenges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_document_questions_updated_at BEFORE UPDATE ON document_questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_impact_scores_updated_at BEFORE UPDATE ON impact_scores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_civic_issues_location ON civic_issues USING GIST(location);
CREATE INDEX idx_civic_issues_status ON civic_issues(status);
CREATE INDEX idx_civic_issues_category ON civic_issues(category);
CREATE INDEX idx_civic_issues_reporter ON civic_issues(reporter_id);
CREATE INDEX idx_civic_issues_assigned_officer ON civic_issues(assigned_officer_id);
CREATE INDEX idx_civic_issues_created_at ON civic_issues(created_at DESC);

CREATE INDEX idx_campaigns_location ON campaigns USING GIST(location);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_creator ON campaigns(creator_id);
CREATE INDEX idx_campaigns_admin_approved ON campaigns(admin_approved);

CREATE INDEX idx_worker_registry_location ON worker_registry USING GIST(location);
CREATE INDEX idx_worker_registry_services ON worker_registry USING GIN(services);
CREATE INDEX idx_worker_registry_verification ON worker_registry(verification_status);

CREATE INDEX idx_events_date ON community_events(event_date);
CREATE INDEX idx_events_location ON community_events USING GIST(location);
CREATE INDEX idx_events_organizer ON community_events(organizer_id);
CREATE INDEX idx_events_admin_approved ON community_events(admin_approved);

CREATE INDEX idx_discussions_created_at ON discussions(created_at DESC);
CREATE INDEX idx_discussions_category ON discussions(category);

CREATE INDEX idx_violations_location ON zoning_violations USING GIST(location);
CREATE INDEX idx_violations_status ON zoning_violations(status);
CREATE INDEX idx_violations_severity ON zoning_violations(severity);
CREATE INDEX idx_violations_assigned_investigator ON zoning_violations(assigned_investigator_id);

CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read);
CREATE INDEX idx_user_activities_user_date ON user_activities(user_id, created_at DESC);
CREATE INDEX idx_cms_content_status ON cms_content(status);
CREATE INDEX idx_cms_content_type ON cms_content(content_type);

-- =====================================================
-- ROW LEVEL SECURITY SETUP
-- =====================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE government_officials ENABLE ROW LEVEL SECURITY;
ALTER TABLE civic_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE issue_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE issue_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE zoning_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE violation_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE civic_credits_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_impact_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE micro_taskforces ENABLE ROW LEVEL SECURITY;
ALTER TABLE taskforce_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE taskforce_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_budget_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE flash_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE flash_challenge_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_questions ENABLE ROW LEVEL SECURITY;

-- Spatial ref sys policy
-- CREATE POLICY "Allow read access to spatial_ref_sys" ON spatial_ref_sys FOR SELECT USING (true);

-- User Profiles RLS
CREATE POLICY "Users can view public profiles" ON user_profiles FOR SELECT USING (
  (privacy_settings->>'profile_visible')::boolean = true OR 
  auth.uid() = id OR 
  is_admin()
);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- Government Officials RLS
CREATE POLICY "Anyone can view active officials" ON government_officials FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage officials" ON government_officials FOR ALL USING (is_admin());

-- Civic Issues RLS
CREATE POLICY "Anyone can view public issues" ON civic_issues FOR SELECT USING (is_public = true);
CREATE POLICY "Users can create issues" ON civic_issues FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Users can update own issues" ON civic_issues FOR UPDATE USING (auth.uid() = reporter_id OR is_admin());

-- Issue Comments RLS
CREATE POLICY "Anyone can view comments" ON issue_comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON issue_comments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Issue Votes RLS
CREATE POLICY "Anyone can view votes" ON issue_votes FOR SELECT USING (true);
CREATE POLICY "Users can cast votes" ON issue_votes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Campaigns RLS
CREATE POLICY "Anyone can view approved public campaigns" ON campaigns FOR SELECT USING (
  (is_public = true AND admin_approved = true) OR 
  auth.uid() = creator_id OR 
  is_admin()
);
CREATE POLICY "Authenticated users can create campaigns" ON campaigns FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Users can update own campaigns or admins can approve" ON campaigns FOR UPDATE USING (
  auth.uid() = creator_id OR is_admin()
);

-- Campaign Signatures RLS
CREATE POLICY "Users can view own signatures" ON campaign_signatures FOR SELECT USING (
  auth.uid() = user_id OR 
  campaign_id IN (SELECT id FROM campaigns WHERE is_public = true AND admin_approved = true)
);
CREATE POLICY "Users can sign campaigns" ON campaign_signatures FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Worker Registry RLS
CREATE POLICY "Anyone can view verified workers" ON worker_registry FOR SELECT USING (verification_status = 'verified');
CREATE POLICY "Users can register as workers" ON worker_registry FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Workers can update own profiles" ON worker_registry FOR UPDATE USING (auth.uid() = user_id OR is_admin());

-- Worker Reviews RLS
CREATE POLICY "Anyone can view verified reviews" ON worker_reviews FOR SELECT USING (is_verified = true OR auth.uid() = reviewer_id);
CREATE POLICY "Users can create reviews" ON worker_reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Job Postings RLS
CREATE POLICY "Anyone can view approved job postings" ON job_postings FOR SELECT USING (admin_approved = true);
CREATE POLICY "Users can create job postings" ON job_postings FOR INSERT WITH CHECK (auth.uid() = posted_by);
CREATE POLICY "Job posters can update own postings" ON job_postings FOR UPDATE USING (auth.uid() = posted_by);

-- Job Applications RLS
CREATE POLICY "Job posters and applicants can view applications" ON job_applications FOR SELECT USING (
  auth.uid() = worker_id OR 
  job_id IN (SELECT id FROM job_postings WHERE posted_by = auth.uid())
);
CREATE POLICY "Workers can create applications" ON job_applications FOR INSERT WITH CHECK (auth.uid() = worker_id);

-- Events RLS
CREATE POLICY "Anyone can view approved public events" ON community_events FOR SELECT USING (
  (is_public = true AND admin_approved = true) OR 
  auth.uid() = organizer_id OR 
  is_admin()
);
CREATE POLICY "Authenticated users can create events" ON community_events FOR INSERT WITH CHECK (auth.uid() = organizer_id);
CREATE POLICY "Users can update own events or admins can approve" ON community_events FOR UPDATE USING (
  auth.uid() = organizer_id OR is_admin()
);

-- Event Attendance RLS
CREATE POLICY "Users can view own attendance" ON event_attendance FOR SELECT USING (
  auth.uid() = user_id OR 
  event_id IN (SELECT id FROM community_events WHERE is_public = true AND admin_approved = true)
);
CREATE POLICY "Users can register for events" ON event_attendance FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Discussions RLS
CREATE POLICY "Anyone can view approved discussions" ON discussions FOR SELECT USING (admin_approved = true);
CREATE POLICY "Users can create discussions" ON discussions FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own discussions" ON discussions FOR UPDATE USING (auth.uid() = author_id);

-- Discussion Replies RLS
CREATE POLICY "Anyone can view replies" ON discussion_replies FOR SELECT USING (true);
CREATE POLICY "Users can create replies" ON discussion_replies FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Zoning Violations RLS
CREATE POLICY "Anyone can view zoning violations" ON zoning_violations FOR SELECT USING (true);
CREATE POLICY "Users can report violations" ON zoning_violations FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Users can update own reports or officials can investigate" ON zoning_violations FOR UPDATE USING (
  auth.uid() = reporter_id OR 
  auth.uid() = assigned_investigator_id OR 
  is_admin()
);

-- Violation Evidence RLS
CREATE POLICY "Anyone can view verified evidence" ON violation_evidence FOR SELECT USING (
  verified_by IS NOT NULL OR auth.uid() = submitted_by
);
CREATE POLICY "Users can submit violation evidence" ON violation_evidence FOR INSERT WITH CHECK (auth.uid() = submitted_by);

-- CMS Content RLS
CREATE POLICY "Anyone can view published content" ON cms_content FOR SELECT USING (status = 'published');
CREATE POLICY "Authors can manage their content" ON cms_content FOR ALL USING (auth.uid() = author_id);
CREATE POLICY "Admins can manage all content" ON cms_content FOR ALL USING (is_admin());

-- Notifications RLS
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- User Activities RLS
CREATE POLICY "Admins can manage user activities" ON user_activities FOR ALL USING (is_admin());

-- Civic Credits RLS
CREATE POLICY "Users can view own transactions" ON civic_credits_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create transactions" ON civic_credits_transactions FOR INSERT WITH CHECK (true);

-- Collaboration Groups RLS
CREATE POLICY "Anyone can view public groups" ON collaboration_groups FOR SELECT USING (
  group_type = 'public' OR 
  EXISTS (
    SELECT 1 FROM group_memberships 
    WHERE group_id = collaboration_groups.id AND user_id = auth.uid() AND status = 'active'
  )
);
CREATE POLICY "Authenticated users can create groups" ON collaboration_groups FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Group admins can update groups" ON collaboration_groups FOR UPDATE USING (
  auth.uid() = created_by OR 
  EXISTS (
    SELECT 1 FROM group_memberships 
    WHERE group_id = collaboration_groups.id AND user_id = auth.uid() 
    AND role IN ('admin', 'moderator') AND status = 'active'
  )
);

-- Group Memberships RLS
CREATE POLICY "Group members can view memberships" ON group_memberships FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM group_memberships gm 
    WHERE gm.group_id = group_memberships.group_id AND gm.user_id = auth.uid() AND gm.status = 'active'
  )
);
CREATE POLICY "Users can join groups" ON group_memberships FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Group Tasks RLS
CREATE POLICY "Group members can view tasks" ON group_tasks FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM group_memberships 
    WHERE group_id = group_tasks.group_id AND user_id = auth.uid() AND status = 'active'
  )
);
CREATE POLICY "Group members can create tasks" ON group_tasks FOR INSERT WITH CHECK (
  auth.uid() = created_by AND 
  EXISTS (
    SELECT 1 FROM group_memberships 
    WHERE group_id = group_tasks.group_id AND user_id = auth.uid() AND status = 'active'
  )
);
CREATE POLICY "Task creators and assignees can update tasks" ON group_tasks FOR UPDATE USING (
  auth.uid() = created_by OR auth.uid() = assigned_to OR 
  EXISTS (
    SELECT 1 FROM group_memberships 
    WHERE group_id = group_tasks.group_id AND user_id = auth.uid() 
    AND role IN ('admin', 'moderator') AND status = 'active'
  )
);

-- Group Activities RLS
CREATE POLICY "Group members can view activities" ON group_activities FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM group_memberships 
    WHERE group_id = group_activities.group_id AND user_id = auth.uid() AND status = 'active'
  ) OR 
  EXISTS (
    SELECT 1 FROM collaboration_groups 
    WHERE id = group_activities.group_id AND group_type = 'public'
  )
);
CREATE POLICY "Group members can create activities" ON group_activities FOR INSERT WITH CHECK (
  auth.uid() = user_id AND 
  EXISTS (
    SELECT 1 FROM group_memberships 
    WHERE group_id = group_activities.group_id AND user_id = auth.uid() AND status = 'active'
  )
);

-- Group Impact Scores RLS
CREATE POLICY "Anyone can view group impact scores" ON group_impact_scores FOR SELECT USING (true);
CREATE POLICY "System can manage impact scores" ON group_impact_scores FOR ALL USING (is_admin());

-- Micro Taskforces RLS
CREATE POLICY "Anyone can view active taskforces" ON micro_taskforces FOR SELECT USING (status = 'active');
CREATE POLICY "Authenticated users can create taskforces" ON micro_taskforces FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Creators can update taskforces" ON micro_taskforces FOR UPDATE USING (auth.uid() = created_by);

-- Taskforce Memberships RLS
CREATE POLICY "Members can view taskforce memberships" ON taskforce_memberships FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM taskforce_memberships tm 
    WHERE tm.taskforce_id = taskforce_memberships.taskforce_id AND tm.user_id = auth.uid() AND tm.status = 'active'
  )
);
CREATE POLICY "Users can join taskforces" ON taskforce_memberships FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Taskforce Activities RLS
CREATE POLICY "Members can view activities" ON taskforce_activities FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM taskforce_memberships 
    WHERE taskforce_id = taskforce_activities.taskforce_id AND user_id = auth.uid() AND status = 'active'
  )
);
CREATE POLICY "Members can create activities" ON taskforce_activities FOR INSERT WITH CHECK (
  auth.uid() = user_id AND 
  EXISTS (
    SELECT 1 FROM taskforce_memberships 
    WHERE taskforce_id = taskforce_activities.taskforce_id AND user_id = auth.uid() AND status = 'active'
  )
);

-- Impact Scores RLS
CREATE POLICY "Anyone can view impact scores" ON impact_scores FOR SELECT USING (true);
CREATE POLICY "System can manage impact scores" ON impact_scores FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND user_type IN ('admin', 'official')
  )
);

-- Budget Cycles RLS
CREATE POLICY "Anyone can view active budget cycles" ON budget_cycles FOR SELECT USING (status = 'active');
CREATE POLICY "Admins can manage budget cycles" ON budget_cycles FOR ALL USING (is_admin());

-- Budget Proposals RLS
CREATE POLICY "Anyone can view proposals in active cycles" ON budget_proposals FOR SELECT USING (
  cycle_id IN (SELECT id FROM budget_cycles WHERE status = 'active')
);
CREATE POLICY "Users can submit proposals" ON budget_proposals FOR INSERT WITH CHECK (auth.uid() = submitted_by);
CREATE POLICY "Users can update own proposals" ON budget_proposals FOR UPDATE USING (auth.uid() = submitted_by);

-- User Budget Tokens RLS
CREATE POLICY "Users can view own tokens" ON user_budget_tokens FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage user tokens" ON user_budget_tokens FOR ALL USING (true);

-- Budget Votes RLS
CREATE POLICY "Users can view own votes" ON budget_votes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can cast votes" ON budget_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own votes" ON budget_votes FOR UPDATE USING (auth.uid() = user_id);

-- Project Updates RLS
CREATE POLICY "Anyone can view project updates" ON project_updates FOR SELECT USING (true);
CREATE POLICY "Project owners and admins can post updates" ON project_updates FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM budget_proposals 
    WHERE id = project_updates.proposal_id AND 
    (submitted_by = auth.uid() OR is_admin())
  )
);

-- Project Feedback RLS
CREATE POLICY "Anyone can view project feedback" ON project_feedback FOR SELECT USING (true);
CREATE POLICY "Users can submit feedback" ON project_feedback FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Flash Challenges RLS
CREATE POLICY "Anyone can view active flash challenges" ON flash_challenges FOR SELECT USING (
  status = 'active' AND end_time > NOW()
);
CREATE POLICY "Admins can manage flash challenges" ON flash_challenges FOR ALL USING (is_admin());

-- Flash Challenge Responses RLS
CREATE POLICY "Users can view own responses" ON flash_challenge_responses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all responses" ON flash_challenge_responses FOR SELECT USING (is_admin());
CREATE POLICY "Users can submit challenge responses" ON flash_challenge_responses FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Document Questions RLS
CREATE POLICY "Users can view own questions and answered questions" ON document_questions FOR SELECT USING (
  auth.uid() = user_id OR status = 'answered' OR is_admin()
);
CREATE POLICY "Authenticated users can create questions" ON document_questions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own questions or officials can answer" ON document_questions FOR UPDATE USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND user_type IN ('admin', 'official')
  )
);

-- =====================================================
-- COMPLETE DEPLOYMENT MESSAGE
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '✅ JijiSauti Database Schema Deployed Successfully!';
    RAISE NOTICE '📊 All tables, functions, triggers, and RLS policies are now active.';
    RAISE NOTICE '🔐 Security measures implemented and authentication ready.';
    RAISE NOTICE '🏛️ Government Response Tracker enhanced for accountability.';
    RAISE NOTICE '🚀 Your civic platform is ready to serve the community!';
END $$;