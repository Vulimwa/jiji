-- Add Participatory Budgeting tables and update Civic Match sidebar integration

-- Create participatory budgeting tables
CREATE TABLE public.budget_cycles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  total_budget NUMERIC NOT NULL DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  voting_start TIMESTAMP WITH TIME ZONE NOT NULL,
  voting_end TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'open_submissions', 'review', 'voting', 'completed')),
  tokens_per_user INTEGER NOT NULL DEFAULT 5,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.budget_proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cycle_id UUID NOT NULL REFERENCES budget_cycles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  estimated_cost NUMERIC NOT NULL,
  location GEOMETRY(Point, 4326),
  address TEXT,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'funded', 'completed')),
  submitted_by UUID,
  image_urls TEXT[],
  voice_url TEXT,
  total_tokens INTEGER NOT NULL DEFAULT 0,
  review_notes TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.budget_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cycle_id UUID NOT NULL REFERENCES budget_cycles(id) ON DELETE CASCADE,
  proposal_id UUID NOT NULL REFERENCES budget_proposals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  tokens_allocated INTEGER NOT NULL CHECK (tokens_allocated > 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(proposal_id, user_id)
);

CREATE TABLE public.user_budget_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  cycle_id UUID NOT NULL REFERENCES budget_cycles(id) ON DELETE CASCADE,
  tokens_total INTEGER NOT NULL DEFAULT 5,
  tokens_used INTEGER NOT NULL DEFAULT 0,
  tokens_available INTEGER GENERATED ALWAYS AS (tokens_total - tokens_used) STORED,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, cycle_id)
);

CREATE TABLE public.project_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID NOT NULL REFERENCES budget_proposals(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  progress_percent INTEGER CHECK (progress_percent >= 0 AND progress_percent <= 100),
  photo_urls TEXT[],
  update_type TEXT DEFAULT 'general' CHECK (update_type IN ('general', 'milestone', 'completion', 'delay', 'budget_change')),
  posted_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.project_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID NOT NULL REFERENCES budget_proposals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  before_photo_url TEXT,
  after_photo_url TEXT,
  impact_story TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(proposal_id, user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.budget_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_budget_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies for budget_cycles
CREATE POLICY "Anyone can view active budget cycles"
  ON public.budget_cycles
  FOR SELECT
  USING (status IN ('open_submissions', 'voting', 'completed'));

CREATE POLICY "Admins can manage budget cycles"
  ON public.budget_cycles
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.user_type = 'admin'
  ));

-- RLS Policies for budget_proposals
CREATE POLICY "Anyone can view approved proposals"
  ON public.budget_proposals
  FOR SELECT
  USING (status IN ('approved', 'funded', 'completed') OR auth.uid() = submitted_by);

CREATE POLICY "Authenticated users can submit proposals"
  ON public.budget_proposals
  FOR INSERT
  WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Users can update own proposals or admins can manage"
  ON public.budget_proposals
  FOR UPDATE
  USING (auth.uid() = submitted_by OR EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.user_type = 'admin'
  ));

-- RLS Policies for budget_votes
CREATE POLICY "Users can view own votes"
  ON public.budget_votes
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can cast votes"
  ON public.budget_votes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own votes"
  ON public.budget_votes
  FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for user_budget_tokens
CREATE POLICY "Users can view own tokens"
  ON public.user_budget_tokens
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage user tokens"
  ON public.user_budget_tokens
  FOR ALL
  USING (true);

-- RLS Policies for project_updates
CREATE POLICY "Anyone can view project updates"
  ON public.project_updates
  FOR SELECT
  USING (true);

CREATE POLICY "Project owners and admins can post updates"
  ON public.project_updates
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM budget_proposals
      WHERE budget_proposals.id = proposal_id
      AND (budget_proposals.submitted_by = auth.uid() OR EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_profiles.id = auth.uid()
        AND user_profiles.user_type = 'admin'
      ))
    )
  );

-- RLS Policies for project_feedback
CREATE POLICY "Anyone can view project feedback"
  ON public.project_feedback
  FOR SELECT
  USING (true);

CREATE POLICY "Users can submit feedback"
  ON public.project_feedback
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own feedback"
  ON public.project_feedback
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_budget_proposals_cycle_id ON budget_proposals(cycle_id);
CREATE INDEX idx_budget_proposals_location ON budget_proposals USING GIST(location);
CREATE INDEX idx_budget_votes_cycle_proposal ON budget_votes(cycle_id, proposal_id);
CREATE INDEX idx_budget_votes_user_id ON budget_votes(user_id);
CREATE INDEX idx_user_budget_tokens_user_cycle ON user_budget_tokens(user_id, cycle_id);
CREATE INDEX idx_project_updates_proposal_id ON project_updates(proposal_id);
CREATE INDEX idx_project_feedback_proposal_id ON project_feedback(proposal_id);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_budget_cycles_updated_at
  BEFORE UPDATE ON public.budget_cycles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_budget_proposals_updated_at
  BEFORE UPDATE ON public.budget_proposals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_budget_tokens_updated_at
  BEFORE UPDATE ON public.user_budget_tokens
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_updates_updated_at
  BEFORE UPDATE ON public.project_updates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to automatically allocate tokens when user joins a cycle
CREATE OR REPLACE FUNCTION public.allocate_user_tokens(user_id_param UUID, cycle_id_param UUID)
RETURNS VOID AS $$
DECLARE
  cycle_tokens INTEGER;
BEGIN
  -- Get tokens per user for this cycle
  SELECT tokens_per_user INTO cycle_tokens
  FROM budget_cycles
  WHERE id = cycle_id_param;

  -- Insert or update user tokens
  INSERT INTO user_budget_tokens (user_id, cycle_id, tokens_total)
  VALUES (user_id_param, cycle_id_param, cycle_tokens)
  ON CONFLICT (user_id, cycle_id)
  DO UPDATE SET tokens_total = cycle_tokens;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update vote totals on proposals
CREATE OR REPLACE FUNCTION public.update_proposal_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE budget_proposals
    SET total_tokens = total_tokens + NEW.tokens_allocated
    WHERE id = NEW.proposal_id;
    
    -- Update user tokens used
    UPDATE user_budget_tokens
    SET tokens_used = tokens_used + NEW.tokens_allocated
    WHERE user_id = NEW.user_id AND cycle_id = NEW.cycle_id;
    
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE budget_proposals
    SET total_tokens = total_tokens - OLD.tokens_allocated + NEW.tokens_allocated
    WHERE id = NEW.proposal_id;
    
    -- Update user tokens used
    UPDATE user_budget_tokens
    SET tokens_used = tokens_used - OLD.tokens_allocated + NEW.tokens_allocated
    WHERE user_id = NEW.user_id AND cycle_id = NEW.cycle_id;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE budget_proposals
    SET total_tokens = total_tokens - OLD.tokens_allocated
    WHERE id = OLD.proposal_id;
    
    -- Update user tokens used
    UPDATE user_budget_tokens
    SET tokens_used = tokens_used - OLD.tokens_allocated
    WHERE user_id = OLD.user_id AND cycle_id = OLD.cycle_id;
    
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER budget_votes_update_count
  AFTER INSERT OR UPDATE OR DELETE ON public.budget_votes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_proposal_vote_count();

-- Insert sample budget cycle
INSERT INTO public.budget_cycles (
  title,
  description,
  total_budget,
  start_date,
  end_date,
  voting_start,
  voting_end,
  status
) VALUES (
  '2024 Kilimani Community Budget',
  'Community-driven budget allocation for local infrastructure and services improvements in Kilimani ward.',
  5000000,
  '2024-01-01 00:00:00+03',
  '2024-12-31 23:59:59+03',
  '2024-06-01 00:00:00+03',
  '2024-06-30 23:59:59+03',
  'voting'
);

-- Insert sample proposals for the budget cycle
INSERT INTO public.budget_proposals (
  cycle_id,
  title,
  description,
  estimated_cost,
  location,
  address,
  category,
  status
) VALUES 
(
  (SELECT id FROM budget_cycles WHERE title = '2024 Kilimani Community Budget'),
  'Fix Lenana Road Drainage',
  'Repair and improve drainage system along Lenana Road to prevent flooding during rainy season.',
  850000,
  ST_SetSRID(ST_MakePoint(36.8065, -1.2958), 4326),
  'Lenana Road, Kilimani',
  'Infrastructure',
  'approved'
),
(
  (SELECT id FROM budget_cycles WHERE title = '2024 Kilimani Community Budget'),
  'Install LED Street Lights',
  'Replace old street lights with energy-efficient LED lights in the residential areas of Kilimani.',
  1200000,
  ST_SetSRID(ST_MakePoint(36.8045, -1.2948), 4326),
  'Kilimani Residential Area',
  'Safety',
  'approved'
),
(
  (SELECT id FROM budget_cycles WHERE title = '2024 Kilimani Community Budget'),
  'Community Garden Project',
  'Establish a community garden space for residents to grow vegetables and promote food security.',
  450000,
  ST_SetSRID(ST_MakePoint(36.8075, -1.2968), 4326),
  'Kilimani Community Center',
  'Environment',
  'approved'
);