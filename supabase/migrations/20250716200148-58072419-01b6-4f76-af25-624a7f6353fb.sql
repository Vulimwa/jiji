-- Enhance user profiles with more granular stakeholder roles
ALTER TYPE user_type ADD VALUE IF NOT EXISTS 'vendor';
ALTER TYPE user_type ADD VALUE IF NOT EXISTS 'boda_driver';
ALTER TYPE user_type ADD VALUE IF NOT EXISTS 'hawker';
ALTER TYPE user_type ADD VALUE IF NOT EXISTS 'youth_leader';
ALTER TYPE user_type ADD VALUE IF NOT EXISTS 'landowner';
ALTER TYPE user_type ADD VALUE IF NOT EXISTS 'security_guard';
ALTER TYPE user_type ADD VALUE IF NOT EXISTS 'business_owner';

-- Add stakeholder tags to user profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS stakeholder_tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS service_radius INTEGER DEFAULT 1000,
ADD COLUMN IF NOT EXISTS primary_location GEOMETRY(Point, 4326),
ADD COLUMN IF NOT EXISTS interests TEXT[] DEFAULT '{}';

-- Create stakeholder categories table
CREATE TABLE public.stakeholder_categories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    relevance_keywords TEXT[] DEFAULT '{}',
    issue_categories TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create stakeholder matches table
CREATE TABLE public.stakeholder_matches (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    content_type TEXT NOT NULL CHECK (content_type IN ('civic_issue', 'campaign', 'community_event', 'discussion')),
    content_id UUID NOT NULL,
    stakeholder_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    relevance_score NUMERIC(3,2) DEFAULT 0.0 CHECK (relevance_score >= 0 AND relevance_score <= 1),
    match_reasons TEXT[] DEFAULT '{}',
    distance_meters INTEGER,
    invited_at TIMESTAMP WITH TIME ZONE,
    responded_at TIMESTAMP WITH TIME ZONE,
    response_type TEXT CHECK (response_type IN ('viewed', 'engaged', 'participated', 'ignored')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create impact scores table
CREATE TABLE public.impact_scores (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    content_type TEXT NOT NULL CHECK (content_type IN ('civic_issue', 'campaign', 'community_event', 'discussion')),
    content_id UUID NOT NULL,
    total_stakeholders INTEGER DEFAULT 0,
    engaged_stakeholders INTEGER DEFAULT 0,
    stakeholder_diversity_score NUMERIC(3,2) DEFAULT 0.0,
    geographic_coverage_score NUMERIC(3,2) DEFAULT 0.0,
    decision_maker_engagement BOOLEAN DEFAULT false,
    missing_voice_alerts TEXT[] DEFAULT '{}',
    overall_impact_score NUMERIC(3,2) DEFAULT 0.0 CHECK (overall_impact_score >= 0 AND overall_impact_score <= 1),
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create stakeholder invitations table
CREATE TABLE public.stakeholder_invitations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    content_type TEXT NOT NULL CHECK (content_type IN ('civic_issue', 'campaign', 'community_event', 'discussion')),
    content_id UUID NOT NULL,
    stakeholder_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    invitation_method TEXT DEFAULT 'platform' CHECK (invitation_method IN ('platform', 'sms', 'email')),
    invitation_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    viewed_at TIMESTAMP WITH TIME ZONE,
    responded_at TIMESTAMP WITH TIME ZONE,
    response_action TEXT CHECK (response_action IN ('participated', 'declined', 'ignored')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.stakeholder_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stakeholder_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stakeholder_invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for stakeholder_categories
CREATE POLICY "Anyone can view stakeholder categories" 
ON public.stakeholder_categories FOR SELECT USING (true);

CREATE POLICY "Admins can manage stakeholder categories" 
ON public.stakeholder_categories FOR ALL 
USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.id = auth.uid() 
    AND user_profiles.user_type = 'admin'
));

-- RLS Policies for stakeholder_matches
CREATE POLICY "Users can view relevant stakeholder matches" 
ON public.stakeholder_matches FOR SELECT 
USING (
    stakeholder_id = auth.uid() 
    OR EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_profiles.id = auth.uid() 
        AND user_profiles.user_type IN ('admin', 'official')
    )
);

CREATE POLICY "System can create stakeholder matches" 
ON public.stakeholder_matches FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Stakeholders can update their matches" 
ON public.stakeholder_matches FOR UPDATE 
USING (
    stakeholder_id = auth.uid() 
    OR EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_profiles.id = auth.uid() 
        AND user_profiles.user_type IN ('admin', 'official')
    )
);

-- RLS Policies for impact_scores
CREATE POLICY "Anyone can view impact scores" 
ON public.impact_scores FOR SELECT USING (true);

CREATE POLICY "System can manage impact scores" 
ON public.impact_scores FOR ALL 
USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.id = auth.uid() 
    AND user_profiles.user_type IN ('admin', 'official')
));

-- RLS Policies for stakeholder_invitations
CREATE POLICY "Users can view their invitations" 
ON public.stakeholder_invitations FOR SELECT 
USING (
    stakeholder_id = auth.uid() 
    OR EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_profiles.id = auth.uid() 
        AND user_profiles.user_type IN ('admin', 'official')
    )
);

CREATE POLICY "System can create invitations" 
ON public.stakeholder_invitations FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their invitation responses" 
ON public.stakeholder_invitations FOR UPDATE 
USING (stakeholder_id = auth.uid());

-- Create indexes for performance
CREATE INDEX idx_stakeholder_matches_content ON public.stakeholder_matches(content_type, content_id);
CREATE INDEX idx_stakeholder_matches_stakeholder ON public.stakeholder_matches(stakeholder_id);
CREATE INDEX idx_stakeholder_matches_relevance ON public.stakeholder_matches(relevance_score DESC);
CREATE INDEX idx_impact_scores_content ON public.impact_scores(content_type, content_id);
CREATE INDEX idx_impact_scores_overall ON public.impact_scores(overall_impact_score DESC);
CREATE INDEX idx_stakeholder_invitations_stakeholder ON public.stakeholder_invitations(stakeholder_id);
CREATE INDEX idx_stakeholder_invitations_content ON public.stakeholder_invitations(content_type, content_id);
CREATE INDEX idx_user_profiles_location ON public.user_profiles USING GIST(primary_location);

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_stakeholder_categories_updated_at
BEFORE UPDATE ON public.stakeholder_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_stakeholder_matches_updated_at
BEFORE UPDATE ON public.stakeholder_matches
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_impact_scores_updated_at
BEFORE UPDATE ON public.impact_scores
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default stakeholder categories
INSERT INTO public.stakeholder_categories (name, description, icon, relevance_keywords, issue_categories) VALUES
('Residents', 'Local community residents', 'home', '{"residential", "neighborhood", "housing", "noise", "security"}', '{"infrastructure", "noise", "security", "waste_management"}'),
('Vendors', 'Street vendors and market traders', 'store', '{"market", "trading", "business", "vendor", "commerce"}', '{"markets", "business", "licensing", "waste_management"}'),
('Boda Drivers', 'Motorcycle taxi drivers', 'bike', '{"transport", "traffic", "roads", "parking", "mobility"}', '{"transportation", "traffic", "roads", "security"}'),
('Security Guards', 'Private and public security personnel', 'shield', '{"security", "safety", "night", "patrol", "crime"}', '{"security", "crime", "lighting"}'),
('Business Owners', 'Local business proprietors', 'briefcase', '{"business", "commerce", "licensing", "taxation"}', '{"business", "licensing", "markets", "infrastructure"}'),
('Youth Leaders', 'Community youth representatives', 'users', '{"youth", "education", "sports", "employment"}', '{"education", "sports", "employment", "social_services"}'),
('Landowners', 'Property and land owners', 'map-pin', '{"property", "land", "development", "zoning"}', '{"zoning", "development", "infrastructure"}'),
('Environmental Groups', 'Environmental and conservation activists', 'leaf', '{"environment", "conservation", "waste", "pollution"}', '{"environment", "waste_management", "pollution"}'),
('Women Groups', 'Women community groups and leaders', 'heart', '{"women", "gender", "empowerment", "safety"}', '{"social_services", "security", "health"}'),
('Religious Leaders', 'Faith-based community leaders', 'church', '{"faith", "community", "moral", "guidance"}', '{"social_services", "community_events"}');