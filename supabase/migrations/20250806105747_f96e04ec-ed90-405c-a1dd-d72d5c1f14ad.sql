-- Create flash_challenges table
CREATE TABLE public.flash_challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  goal_count INTEGER DEFAULT 50,
  current_count INTEGER DEFAULT 0,
  reward_points INTEGER DEFAULT 10,
  reward_badge TEXT,
  submission_types TEXT[] DEFAULT ARRAY['photo'],
  location_scope GEOMETRY(Point, 4326),
  radius_meters INTEGER DEFAULT 1000,
  verification_method TEXT DEFAULT 'auto',
  status TEXT DEFAULT 'active',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create flash_challenge_responses table
CREATE TABLE public.flash_challenge_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID NOT NULL REFERENCES public.flash_challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  submission_type TEXT NOT NULL,
  submission_content JSONB NOT NULL,
  location GEOMETRY(Point, 4326),
  verification_status TEXT DEFAULT 'pending',
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  points_awarded INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create micro_taskforces table
CREATE TABLE public.micro_taskforces (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  issue_id UUID REFERENCES public.civic_issues(id),
  campaign_id UUID REFERENCES public.campaigns(id),
  location GEOMETRY(Point, 4326),
  radius_meters INTEGER DEFAULT 500,
  max_members INTEGER DEFAULT 20,
  current_members INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  chat_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT false,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create taskforce_memberships table
CREATE TABLE public.taskforce_memberships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  taskforce_id UUID NOT NULL REFERENCES public.micro_taskforces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'active',
  UNIQUE(taskforce_id, user_id)
);

-- Create taskforce_activities table
CREATE TABLE public.taskforce_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  taskforce_id UUID NOT NULL REFERENCES public.micro_taskforces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  activity_type TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create group_recommendations table
CREATE TABLE public.group_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  content_id UUID NOT NULL,
  content_type TEXT NOT NULL,
  recommendation_type TEXT NOT NULL,
  target_id UUID,
  target_type TEXT,
  score NUMERIC DEFAULT 0.0,
  reason TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create user_flash_stats table
CREATE TABLE public.user_flash_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  total_challenges_completed INTEGER DEFAULT 0,
  total_points_earned INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  badges_earned TEXT[] DEFAULT '{}',
  last_challenge_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.flash_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flash_challenge_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.micro_taskforces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taskforce_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taskforce_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_flash_stats ENABLE ROW LEVEL SECURITY;

-- Flash challenges policies
CREATE POLICY "Anyone can view active flash challenges" ON public.flash_challenges
  FOR SELECT USING (status = 'active' AND end_time > now());

CREATE POLICY "Admins can manage flash challenges" ON public.flash_challenges
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- Flash challenge responses policies
CREATE POLICY "Users can submit challenge responses" ON public.flash_challenge_responses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own responses" ON public.flash_challenge_responses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all responses" ON public.flash_challenge_responses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- Micro taskforces policies
CREATE POLICY "Anyone can view active taskforces" ON public.micro_taskforces
  FOR SELECT USING (status = 'active');

CREATE POLICY "Authenticated users can create taskforces" ON public.micro_taskforces
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Members can update taskforces" ON public.micro_taskforces
  FOR UPDATE USING (
    auth.uid() = created_by OR 
    EXISTS (
      SELECT 1 FROM taskforce_memberships 
      WHERE taskforce_id = micro_taskforces.id 
      AND user_id = auth.uid() 
      AND role IN ('admin', 'moderator')
    )
  );

-- Taskforce memberships policies
CREATE POLICY "Users can join taskforces" ON public.taskforce_memberships
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Members can view taskforce memberships" ON public.taskforce_memberships
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM taskforce_memberships tm
      WHERE tm.taskforce_id = taskforce_memberships.taskforce_id 
      AND tm.user_id = auth.uid() AND tm.status = 'active'
    )
  );

-- Taskforce activities policies
CREATE POLICY "Members can create activities" ON public.taskforce_activities
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND 
    EXISTS (
      SELECT 1 FROM taskforce_memberships 
      WHERE taskforce_id = taskforce_activities.taskforce_id 
      AND user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Members can view activities" ON public.taskforce_activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM taskforce_memberships 
      WHERE taskforce_id = taskforce_activities.taskforce_id 
      AND user_id = auth.uid() AND status = 'active'
    )
  );

-- Group recommendations policies
CREATE POLICY "Users can view own recommendations" ON public.group_recommendations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create recommendations" ON public.group_recommendations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own recommendations" ON public.group_recommendations
  FOR UPDATE USING (auth.uid() = user_id);

-- User flash stats policies
CREATE POLICY "Users can view own stats" ON public.user_flash_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage user stats" ON public.user_flash_stats
  FOR ALL USING (true);

-- Function to auto-verify low-risk challenge responses
CREATE OR REPLACE FUNCTION auto_verify_challenge_response()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-verify for certain submission types
  IF NEW.submission_type IN ('rating', 'vote', 'checkin') THEN
    NEW.verification_status := 'verified';
    NEW.verified_at := now();
    
    -- Award points
    UPDATE user_profiles 
    SET civic_credits = civic_credits + (
      SELECT reward_points FROM flash_challenges WHERE id = NEW.challenge_id
    )
    WHERE id = NEW.user_id;
    
    NEW.points_awarded := (SELECT reward_points FROM flash_challenges WHERE id = NEW.challenge_id);
    
    -- Update challenge count
    UPDATE flash_challenges 
    SET current_count = current_count + 1 
    WHERE id = NEW.challenge_id;
    
    -- Update user stats
    INSERT INTO user_flash_stats (user_id, total_challenges_completed, total_points_earned, last_challenge_date)
    VALUES (NEW.user_id, 1, NEW.points_awarded, now())
    ON CONFLICT (user_id) DO UPDATE SET
      total_challenges_completed = user_flash_stats.total_challenges_completed + 1,
      total_points_earned = user_flash_stats.total_points_earned + NEW.points_awarded,
      last_challenge_date = now(),
      updated_at = now();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-verification
CREATE TRIGGER trigger_auto_verify_challenge_response
  BEFORE INSERT ON flash_challenge_responses
  FOR EACH ROW EXECUTE FUNCTION auto_verify_challenge_response();

-- Function to update taskforce member count
CREATE OR REPLACE FUNCTION update_taskforce_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE micro_taskforces 
    SET current_members = current_members + 1 
    WHERE id = NEW.taskforce_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE micro_taskforces 
    SET current_members = current_members - 1 
    WHERE id = OLD.taskforce_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for taskforce member count
CREATE TRIGGER trigger_update_taskforce_member_count
  AFTER INSERT OR DELETE ON taskforce_memberships
  FOR EACH ROW EXECUTE FUNCTION update_taskforce_member_count();

-- Create indexes for performance
CREATE INDEX idx_flash_challenges_active ON flash_challenges(status, end_time) WHERE status = 'active';
CREATE INDEX idx_flash_challenge_responses_challenge ON flash_challenge_responses(challenge_id);
CREATE INDEX idx_flash_challenge_responses_user ON flash_challenge_responses(user_id);
CREATE INDEX idx_flash_challenge_responses_location ON flash_challenge_responses USING GIST(location);
CREATE INDEX idx_micro_taskforces_location ON micro_taskforces USING GIST(location);
CREATE INDEX idx_taskforce_memberships_user ON taskforce_memberships(user_id);
CREATE INDEX idx_group_recommendations_user ON group_recommendations(user_id, status);