
-- JijiSauti Civic Intelligence Platform - Complete Database Schema
-- This file contains all the tables, functions, and policies for the application

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create custom types
CREATE TYPE user_type AS ENUM ('resident', 'informal_worker', 'official', 'admin');
CREATE TYPE issue_status AS ENUM ('reported', 'acknowledged', 'in-progress', 'resolved', 'closed');
CREATE TYPE issue_category AS ENUM ('sewage', 'noise', 'construction', 'power', 'roads', 'waste', 'lighting', 'drainage', 'other');
CREATE TYPE campaign_status AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled');
CREATE TYPE violation_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE violation_status AS ENUM ('reported', 'under_investigation', 'confirmed', 'resolved', 'dismissed');
CREATE TYPE event_status AS ENUM ('planned', 'ongoing', 'completed', 'cancelled');
CREATE TYPE worker_verification_status AS ENUM ('pending', 'verified', 'rejected', 'suspended');
CREATE TYPE content_status AS ENUM ('draft', 'pending_review', 'approved', 'rejected', 'published');
CREATE TYPE notification_type AS ENUM ('info', 'warning', 'success', 'error', 'update');

-- User Profiles Table
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone TEXT,
    user_type user_type DEFAULT 'resident',
    civic_credits INTEGER DEFAULT 0,
    location GEOGRAPHY(POINT, 4326),
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

-- Civic Issues Table
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

-- Zoning Violations
CREATE TABLE zoning_violations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    address TEXT,
    violation_type TEXT NOT NULL,
    developer_name TEXT,
    building_description TEXT,
    severity violation_severity DEFAULT 'medium',
    status violation_status DEFAULT 'reported',
    evidence_urls TEXT[],
    evidence_description TEXT,
    reporter_id UUID REFERENCES auth.users(id),
    assigned_investigator_id UUID REFERENCES government_officials(id),
    reporter_contact TEXT,
    witness_count INTEGER DEFAULT 0,
    official_response TEXT,
    investigation_notes TEXT,
    resolution_date TIMESTAMP WITH TIME ZONE,
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

-- Admin Settings
CREATE TABLE admin_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key TEXT UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    description TEXT,
    category TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    updated_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
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

-- Enable Row Level Security
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
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view public profiles" ON user_profiles
    FOR SELECT USING (
        privacy_settings->>'profile_visible' = 'true' OR 
        auth.uid() = id OR
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND user_type = 'admin')
    );

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for government_officials
CREATE POLICY "Anyone can view active officials" ON government_officials
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage officials" ON government_officials
    FOR ALL USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND user_type = 'admin')
    );

-- RLS Policies for civic_issues
CREATE POLICY "Anyone can view public issues" ON civic_issues
    FOR SELECT USING (
        is_public = true OR 
        auth.uid() = reporter_id OR
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND user_type IN ('admin', 'official'))
    );

CREATE POLICY "Authenticated users can create issues" ON civic_issues
    FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can update own issues or officials can update assigned" ON civic_issues
    FOR UPDATE USING (
        auth.uid() = reporter_id OR
        EXISTS (
            SELECT 1 FROM government_officials go 
            JOIN user_profiles up ON go.user_id = up.id 
            WHERE up.id = auth.uid() AND go.id = assigned_officer_id
        ) OR
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND user_type = 'admin')
    );

-- RLS Policies for campaigns
CREATE POLICY "Anyone can view approved public campaigns" ON campaigns
    FOR SELECT USING (
        (is_public = true AND admin_approved = true) OR 
        auth.uid() = creator_id OR
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND user_type = 'admin')
    );

CREATE POLICY "Authenticated users can create campaigns" ON campaigns
    FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update own campaigns or admins can approve" ON campaigns
    FOR UPDATE USING (
        auth.uid() = creator_id OR
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND user_type = 'admin')
    );

-- RLS Policies for worker_registry
CREATE POLICY "Anyone can view verified workers" ON worker_registry
    FOR SELECT USING (
        verification_status = 'verified' OR 
        auth.uid() = user_id OR
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND user_type = 'admin')
    );

CREATE POLICY "Users can create own worker profile" ON worker_registry
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own worker profile" ON worker_registry
    FOR UPDATE USING (
        auth.uid() = user_id OR
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND user_type = 'admin')
    );

-- RLS Policies for community_events
CREATE POLICY "Anyone can view approved public events" ON community_events
    FOR SELECT USING (
        (is_public = true AND admin_approved = true) OR 
        auth.uid() = organizer_id OR
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND user_type = 'admin')
    );

CREATE POLICY "Authenticated users can create events" ON community_events
    FOR INSERT WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Users can update own events or admins can approve" ON community_events
    FOR UPDATE USING (
        auth.uid() = organizer_id OR
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND user_type = 'admin')
    );

-- RLS Policies for zoning_violations
CREATE POLICY "Anyone can view violations" ON zoning_violations
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can report violations" ON zoning_violations
    FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Reporters and officials can update violations" ON zoning_violations
    FOR UPDATE USING (
        auth.uid() = reporter_id OR
        EXISTS (
            SELECT 1 FROM government_officials go 
            JOIN user_profiles up ON go.user_id = up.id 
            WHERE up.id = auth.uid() AND go.id = assigned_investigator_id
        ) OR
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND user_type = 'admin')
    );

-- RLS Policies for cms_content
CREATE POLICY "Anyone can view published content" ON cms_content
    FOR SELECT USING (status = 'published');

CREATE POLICY "Authors can manage their content" ON cms_content
    FOR ALL USING (auth.uid() = author_id);

CREATE POLICY "Admins can manage all content" ON cms_content
    FOR ALL USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND user_type = 'admin')
    );

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for admin_settings
CREATE POLICY "Anyone can view public settings" ON admin_settings
    FOR SELECT USING (is_public = true);

CREATE POLICY "Admins can manage all settings" ON admin_settings
    FOR ALL USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND user_type = 'admin')
    );

-- Functions for common operations
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at columns
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_government_officials_updated_at BEFORE UPDATE ON government_officials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_civic_issues_updated_at BEFORE UPDATE ON civic_issues
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_worker_registry_updated_at BEFORE UPDATE ON worker_registry
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_postings_updated_at BEFORE UPDATE ON job_postings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_events_updated_at BEFORE UPDATE ON community_events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_discussions_updated_at BEFORE UPDATE ON discussions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_zoning_violations_updated_at BEFORE UPDATE ON zoning_violations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cms_content_updated_at BEFORE UPDATE ON cms_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_settings_updated_at BEFORE UPDATE ON admin_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (id, full_name, phone)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NEW.raw_user_meta_data->>'phone'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- Function to calculate distance between two points
CREATE OR REPLACE FUNCTION calculate_distance(lat1 FLOAT, lng1 FLOAT, lat2 FLOAT, lng2 FLOAT)
RETURNS FLOAT AS $$
BEGIN
    RETURN ST_Distance(
        ST_GeogFromText('POINT(' || lng1 || ' ' || lat1 || ')'),
        ST_GeogFromText('POINT(' || lng2 || ' ' || lat2 || ')')
    );
END;
$$ LANGUAGE plpgsql;

-- Function to update civic credits
CREATE OR REPLACE FUNCTION update_civic_credits(
    user_uuid UUID,
    credit_amount INTEGER,
    transaction_description TEXT,
    transaction_related_id UUID DEFAULT NULL,
    transaction_related_type TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    -- Update user's civic credits
    UPDATE user_profiles 
    SET civic_credits = civic_credits + credit_amount
    WHERE id = user_uuid;
    
    -- Log the transaction
    INSERT INTO civic_credits_transactions (
        user_id, amount, transaction_type, description, related_id, related_type
    ) VALUES (
        user_uuid, 
        credit_amount, 
        CASE WHEN credit_amount > 0 THEN 'earned' ELSE 'spent' END,
        transaction_description,
        transaction_related_id,
        transaction_related_type
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to assign government official to issue
CREATE OR REPLACE FUNCTION assign_official_to_issue(
    issue_uuid UUID,
    official_uuid UUID,
    assigned_by_uuid UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    is_admin BOOLEAN;
BEGIN
    -- Check if the assigner is an admin
    SELECT EXISTS(
        SELECT 1 FROM user_profiles 
        WHERE id = assigned_by_uuid AND user_type = 'admin'
    ) INTO is_admin;
    
    IF NOT is_admin THEN
        RAISE EXCEPTION 'Only admins can assign officials to issues';
    END IF;
    
    -- Update the issue
    UPDATE civic_issues 
    SET assigned_officer_id = official_uuid,
        status = 'acknowledged',
        updated_at = NOW()
    WHERE id = issue_uuid;
    
    -- Create notification for the assigned official
    INSERT INTO notifications (
        user_id, title, message, type, related_id, related_type
    ) 
    SELECT 
        go.user_id,
        'New Issue Assignment',
        'You have been assigned to investigate a civic issue',
        'info',
        issue_uuid,
        'civic_issue'
    FROM government_officials go
    WHERE go.id = official_uuid;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to auto-approve content based on user type
CREATE OR REPLACE FUNCTION auto_approve_content()
RETURNS TRIGGER AS $$
BEGIN
    -- Auto-approve content from officials and admins
    IF EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = NEW.author_id AND user_type IN ('admin', 'official')
    ) THEN
        NEW.status = 'approved';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-approval
CREATE TRIGGER auto_approve_cms_content
    BEFORE INSERT ON cms_content
    FOR EACH ROW EXECUTE FUNCTION auto_approve_content();

-- Insert default admin settings
INSERT INTO admin_settings (setting_key, setting_value, description, category, is_public) VALUES
('app_name', '"JijiSauti"', 'Application name', 'general', true),
('app_version', '"1.0.0"', 'Current application version', 'general', true),
('maintenance_mode', 'false', 'Enable/disable maintenance mode', 'system', false),
('max_file_upload_size', '10485760', 'Maximum file upload size in bytes (10MB)', 'system', false),
('civic_credits_per_issue', '10', 'Civic credits awarded per issue report', 'rewards', true),
('civic_credits_per_vote', '1', 'Civic credits awarded per vote', 'rewards', true),
('require_admin_approval_campaigns', 'true', 'Require admin approval for campaigns', 'moderation', true),
('require_admin_approval_events', 'true', 'Require admin approval for events', 'moderation', true),
('notification_settings', '{"email": true, "sms": false, "push": true}', 'Default notification settings', 'notifications', true),
('contact_email', '"admin@jijisauti.org"', 'Admin contact email', 'contact', true),
('support_phone', '"+254700000000"', 'Support phone number', 'contact', true);

COMMENT ON SCHEMA public IS 'JijiSauti Civic Intelligence Platform Database Schema - Production Ready';
