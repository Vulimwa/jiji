-- Add officer assignment and response tracking to civic issues
ALTER TABLE civic_issues 
ADD COLUMN IF NOT EXISTS officer_assigned_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS first_response_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS expected_resolution_date timestamp with time zone;

-- Create collaboration groups table
CREATE TABLE IF NOT EXISTS collaboration_groups (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  issue_focus text NOT NULL,
  location geometry(POINT, 4326),
  address text,
  group_type text NOT NULL DEFAULT 'public', -- 'public' or 'private'
  status text NOT NULL DEFAULT 'active', -- 'active', 'inactive', 'disbanded'
  created_by uuid REFERENCES user_profiles(id) NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  member_count integer DEFAULT 0,
  max_members integer DEFAULT 100,
  logo_url text,
  banner_url text,
  tags text[] DEFAULT '{}',
  privacy_settings jsonb DEFAULT '{"join_approval_required": false, "public_activity": true}',
  contact_info jsonb DEFAULT '{}',
  achievements jsonb DEFAULT '{}',
  is_verified boolean DEFAULT false,
  verified_at timestamp with time zone,
  verified_by uuid REFERENCES user_profiles(id)
);

-- Create group memberships table
CREATE TABLE IF NOT EXISTS group_memberships (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id uuid REFERENCES collaboration_groups(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL DEFAULT 'member', -- 'admin', 'moderator', 'member'
  status text NOT NULL DEFAULT 'active', -- 'active', 'pending', 'banned'
  joined_at timestamp with time zone NOT NULL DEFAULT now(),
  invited_by uuid REFERENCES user_profiles(id),
  contribution_score integer DEFAULT 0,
  last_active_at timestamp with time zone DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Create group activities table
CREATE TABLE IF NOT EXISTS group_activities (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id uuid REFERENCES collaboration_groups(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES user_profiles(id) NOT NULL,
  activity_type text NOT NULL, -- 'post', 'task_created', 'task_completed', 'meeting', 'campaign_linked'
  title text NOT NULL,
  content text,
  metadata jsonb DEFAULT '{}',
  related_content_type text, -- 'civic_issue', 'campaign', 'task', 'meeting'
  related_content_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  is_pinned boolean DEFAULT false,
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0
);

-- Create group tasks table
CREATE TABLE IF NOT EXISTS group_tasks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id uuid REFERENCES collaboration_groups(id) ON DELETE CASCADE NOT NULL,
  created_by uuid REFERENCES user_profiles(id) NOT NULL,
  assigned_to uuid REFERENCES user_profiles(id),
  title text NOT NULL,
  description text,
  task_type text NOT NULL DEFAULT 'general', -- 'petition', 'meeting', 'cleanup', 'research', 'advocacy', 'general'
  priority text NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  status text NOT NULL DEFAULT 'open', -- 'open', 'in_progress', 'review', 'completed', 'cancelled'
  due_date timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone,
  estimated_hours integer,
  actual_hours integer,
  tags text[] DEFAULT '{}',
  attachments text[] DEFAULT '{}',
  location geometry(POINT, 4326),
  address text
);

-- Create group campaigns link table
CREATE TABLE IF NOT EXISTS group_campaigns (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id uuid REFERENCES collaboration_groups(id) ON DELETE CASCADE NOT NULL,
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  linked_by uuid REFERENCES user_profiles(id) NOT NULL,
  linked_at timestamp with time zone NOT NULL DEFAULT now(),
  relationship_type text NOT NULL DEFAULT 'supporting', -- 'supporting', 'organizing', 'monitoring'
  notes text,
  UNIQUE(group_id, campaign_id)
);

-- Create group impact tracking table
CREATE TABLE IF NOT EXISTS group_impact_scores (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id uuid REFERENCES collaboration_groups(id) ON DELETE CASCADE NOT NULL,
  calculation_date timestamp with time zone NOT NULL DEFAULT now(),
  tasks_completed integer DEFAULT 0,
  campaigns_supported integer DEFAULT 0,
  issues_addressed integer DEFAULT 0,
  meetings_held integer DEFAULT 0,
  community_engagement_score numeric(5,2) DEFAULT 0.0,
  impact_rating text DEFAULT 'emerging', -- 'emerging', 'growing', 'established', 'influential'
  badges_earned text[] DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE collaboration_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_impact_scores ENABLE ROW LEVEL SECURITY;

-- RLS policies for collaboration_groups
CREATE POLICY "Anyone can view public groups" ON collaboration_groups
  FOR SELECT USING (group_type = 'public' OR EXISTS (
    SELECT 1 FROM group_memberships 
    WHERE group_id = collaboration_groups.id AND user_id = auth.uid() AND status = 'active'
  ));

CREATE POLICY "Authenticated users can create groups" ON collaboration_groups
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Group admins can update groups" ON collaboration_groups
  FOR UPDATE USING (
    auth.uid() = created_by OR 
    EXISTS (
      SELECT 1 FROM group_memberships 
      WHERE group_id = collaboration_groups.id AND user_id = auth.uid() 
      AND role IN ('admin', 'moderator') AND status = 'active'
    )
  );

-- RLS policies for group_memberships
CREATE POLICY "Users can view group memberships" ON group_memberships
  FOR SELECT USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM collaboration_groups 
      WHERE id = group_memberships.group_id AND group_type = 'public'
    ) OR
    EXISTS (
      SELECT 1 FROM group_memberships gm 
      WHERE gm.group_id = group_memberships.group_id AND gm.user_id = auth.uid() AND gm.status = 'active'
    )
  );

CREATE POLICY "Users can join groups" ON group_memberships
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own membership or group admins can manage" ON group_memberships
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM group_memberships 
      WHERE group_id = group_memberships.group_id AND user_id = auth.uid() 
      AND role IN ('admin', 'moderator') AND status = 'active'
    )
  );

-- RLS policies for group_activities
CREATE POLICY "Group members can view activities" ON group_activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_memberships 
      WHERE group_id = group_activities.group_id AND user_id = auth.uid() AND status = 'active'
    ) OR
    EXISTS (
      SELECT 1 FROM collaboration_groups 
      WHERE id = group_activities.group_id AND group_type = 'public'
    )
  );

CREATE POLICY "Group members can create activities" ON group_activities
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM group_memberships 
      WHERE group_id = group_activities.group_id AND user_id = auth.uid() AND status = 'active'
    )
  );

-- RLS policies for group_tasks
CREATE POLICY "Group members can view tasks" ON group_tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_memberships 
      WHERE group_id = group_tasks.group_id AND user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Group members can create tasks" ON group_tasks
  FOR INSERT WITH CHECK (
    auth.uid() = created_by AND
    EXISTS (
      SELECT 1 FROM group_memberships 
      WHERE group_id = group_tasks.group_id AND user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Task creators and assignees can update tasks" ON group_tasks
  FOR UPDATE USING (
    auth.uid() = created_by OR 
    auth.uid() = assigned_to OR
    EXISTS (
      SELECT 1 FROM group_memberships 
      WHERE group_id = group_tasks.group_id AND user_id = auth.uid() 
      AND role IN ('admin', 'moderator') AND status = 'active'
    )
  );

-- RLS policies for group_campaigns
CREATE POLICY "Anyone can view group campaigns" ON group_campaigns
  FOR SELECT USING (true);

CREATE POLICY "Group members can link campaigns" ON group_campaigns
  FOR INSERT WITH CHECK (
    auth.uid() = linked_by AND
    EXISTS (
      SELECT 1 FROM group_memberships 
      WHERE group_id = group_campaigns.group_id AND user_id = auth.uid() AND status = 'active'
    )
  );

-- RLS policies for group_impact_scores
CREATE POLICY "Anyone can view group impact scores" ON group_impact_scores
  FOR SELECT USING (true);

CREATE POLICY "System can manage impact scores" ON group_impact_scores
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_collaboration_groups_location ON collaboration_groups USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_collaboration_groups_created_by ON collaboration_groups (created_by);
CREATE INDEX IF NOT EXISTS idx_collaboration_groups_issue_focus ON collaboration_groups (issue_focus);
CREATE INDEX IF NOT EXISTS idx_group_memberships_group_user ON group_memberships (group_id, user_id);
CREATE INDEX IF NOT EXISTS idx_group_memberships_user_id ON group_memberships (user_id);
CREATE INDEX IF NOT EXISTS idx_group_activities_group_id ON group_activities (group_id);
CREATE INDEX IF NOT EXISTS idx_group_tasks_group_id ON group_tasks (group_id);
CREATE INDEX IF NOT EXISTS idx_group_tasks_assigned_to ON group_tasks (assigned_to);
CREATE INDEX IF NOT EXISTS idx_civic_issues_assigned_officer ON civic_issues (assigned_officer_id);

-- Create functions for group management
CREATE OR REPLACE FUNCTION update_group_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE collaboration_groups 
    SET member_count = member_count + 1 
    WHERE id = NEW.group_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE collaboration_groups 
    SET member_count = member_count - 1 
    WHERE id = OLD.group_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for member count updates
DROP TRIGGER IF EXISTS trigger_update_group_member_count ON group_memberships;
CREATE TRIGGER trigger_update_group_member_count
  AFTER INSERT OR DELETE ON group_memberships
  FOR EACH ROW EXECUTE FUNCTION update_group_member_count();

-- Function to calculate response time for civic issues
CREATE OR REPLACE FUNCTION calculate_response_time_hours(
  reported_at timestamp with time zone,
  first_response timestamp with time zone
)
RETURNS integer AS $$
BEGIN
  IF first_response IS NULL THEN
    RETURN NULL;
  END IF;
  
  RETURN EXTRACT(EPOCH FROM (first_response - reported_at)) / 3600;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Update timestamps function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_collaboration_groups_updated_at 
    BEFORE UPDATE ON collaboration_groups 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_group_tasks_updated_at 
    BEFORE UPDATE ON group_tasks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();