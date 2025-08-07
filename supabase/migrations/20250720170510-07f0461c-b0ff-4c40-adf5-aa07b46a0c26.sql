-- Add project tracking tables and enhance CMS integration

-- Create project_updates table for detailed project tracking
CREATE TABLE IF NOT EXISTS public.project_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES budget_proposals(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  update_type TEXT DEFAULT 'general', -- 'milestone', 'progress', 'issue', 'completion'
  progress_percent INTEGER CHECK (progress_percent >= 0 AND progress_percent <= 100),
  photo_urls TEXT[],
  posted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create project_feedback table for community input
CREATE TABLE IF NOT EXISTS public.project_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES budget_proposals(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  feedback_text TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  before_photo_url TEXT,
  after_photo_url TEXT,
  impact_story TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add status tracking columns to budget_proposals
ALTER TABLE budget_proposals 
ADD COLUMN IF NOT EXISTS implementation_start_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS expected_completion_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS actual_completion_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS project_manager_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS contractor_info JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS current_progress INTEGER DEFAULT 0 CHECK (current_progress >= 0 AND current_progress <= 100);

-- Enable RLS on new tables
ALTER TABLE project_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_feedback ENABLE ROW LEVEL SECURITY;

-- Create policies for project_updates
CREATE POLICY "Anyone can view project updates" ON project_updates FOR SELECT USING (true);

CREATE POLICY "Project owners and admins can post updates" ON project_updates FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM budget_proposals 
    WHERE budget_proposals.id = project_updates.proposal_id 
    AND (
      budget_proposals.submitted_by = auth.uid() OR
      EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_profiles.id = auth.uid() 
        AND user_profiles.user_type = 'admin'
      )
    )
  )
);

-- Create policies for project_feedback  
CREATE POLICY "Anyone can view project feedback" ON project_feedback FOR SELECT USING (true);

CREATE POLICY "Users can submit feedback" ON project_feedback FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own feedback" ON project_feedback FOR UPDATE 
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_project_updates_proposal_id ON project_updates(proposal_id);
CREATE INDEX IF NOT EXISTS idx_project_updates_created_at ON project_updates(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_feedback_proposal_id ON project_feedback(proposal_id);
CREATE INDEX IF NOT EXISTS idx_budget_proposals_status ON budget_proposals(status);

-- Create function to update proposal progress based on latest update
CREATE OR REPLACE FUNCTION update_proposal_progress()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE budget_proposals 
  SET current_progress = NEW.progress_percent,
      updated_at = now()
  WHERE id = NEW.proposal_id 
  AND NEW.progress_percent IS NOT NULL;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update proposal progress
DROP TRIGGER IF EXISTS trigger_update_proposal_progress ON project_updates;
CREATE TRIGGER trigger_update_proposal_progress
  AFTER INSERT OR UPDATE ON project_updates
  FOR EACH ROW
  EXECUTE FUNCTION update_proposal_progress();

-- Insert sample project updates for demonstration
INSERT INTO project_updates (proposal_id, title, description, update_type, progress_percent, posted_by)
SELECT 
  bp.id,
  'Project Kickoff Meeting',
  'Initial planning and stakeholder alignment completed. All necessary permits have been identified and application process has begun.',
  'milestone',
  15,
  bp.submitted_by
FROM budget_proposals bp
WHERE bp.status = 'funded'
LIMIT 3;

INSERT INTO project_updates (proposal_id, title, description, update_type, progress_percent, posted_by)
SELECT 
  bp.id,
  'Permits Obtained',
  'All necessary permits and approvals have been secured. Construction materials have been ordered and delivery is scheduled.',
  'milestone', 
  35,
  bp.submitted_by
FROM budget_proposals bp
WHERE bp.status = 'funded'
LIMIT 2;

-- Add realtime functionality for project tracking
ALTER TABLE project_updates REPLICA IDENTITY FULL;
ALTER TABLE project_feedback REPLICA IDENTITY FULL;

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE project_updates;
ALTER PUBLICATION supabase_realtime ADD TABLE project_feedback;