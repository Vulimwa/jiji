-- Add RLS policies for tables without them

-- Campaign signatures policies
CREATE POLICY "Users can sign campaigns" ON campaign_signatures FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own signatures" ON campaign_signatures FOR SELECT
USING (auth.uid() = user_id OR campaign_id IN (
  SELECT id FROM campaigns WHERE is_public = true AND admin_approved = true
));

-- Event attendance policies  
CREATE POLICY "Users can register for events" ON event_attendance FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own attendance" ON event_attendance FOR SELECT
USING (auth.uid() = user_id OR event_id IN (
  SELECT id FROM community_events WHERE is_public = true AND admin_approved = true  
));

-- Job postings policies
CREATE POLICY "Anyone can view approved job postings" ON job_postings FOR SELECT
USING (admin_approved = true);

CREATE POLICY "Users can create job postings" ON job_postings FOR INSERT  
WITH CHECK (auth.uid() = posted_by);

CREATE POLICY "Job posters can update own postings" ON job_postings FOR UPDATE
USING (auth.uid() = posted_by);

-- User activities policies (admin only)
CREATE POLICY "Admins can manage user activities" ON user_activities FOR ALL
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE id = auth.uid() AND user_type = 'admin'
));

-- Violation evidence policies
CREATE POLICY "Users can submit violation evidence" ON violation_evidence FOR INSERT
WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Anyone can view verified evidence" ON violation_evidence FOR SELECT  
USING (verified_by IS NOT NULL OR auth.uid() = submitted_by);

-- Civic credits transactions policies
CREATE POLICY "Users can view own transactions" ON civic_credits_transactions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can create transactions" ON civic_credits_transactions FOR INSERT
WITH CHECK (true); -- System operations

-- Issue comments policies
CREATE POLICY "Users can create comments" ON issue_comments FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view comments" ON issue_comments FOR SELECT
USING (true);

-- Discussion replies policies  
CREATE POLICY "Users can create replies" ON discussion_replies FOR INSERT
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Anyone can view replies" ON discussion_replies FOR SELECT
USING (true);

-- Discussions policies
CREATE POLICY "Users can create discussions" ON discussions FOR INSERT
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Anyone can view approved discussions" ON discussions FOR SELECT  
USING (admin_approved = true);

CREATE POLICY "Authors can update own discussions" ON discussions FOR UPDATE
USING (auth.uid() = author_id);

-- Job applications policies
CREATE POLICY "Workers can create applications" ON job_applications FOR INSERT
WITH CHECK (auth.uid() = worker_id);

CREATE POLICY "Job posters and applicants can view applications" ON job_applications FOR SELECT
USING (auth.uid() = worker_id OR job_id IN (
  SELECT id FROM job_postings WHERE posted_by = auth.uid()
));

-- Worker reviews policies  
CREATE POLICY "Users can create reviews" ON worker_reviews FOR INSERT
WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Anyone can view verified reviews" ON worker_reviews FOR SELECT
USING (is_verified = true OR auth.uid() = reviewer_id);

-- Fix function security by adding proper search_path
ALTER FUNCTION public.grant_flash_challenge_reward(uuid, integer, text[]) 
SET search_path = public;

ALTER FUNCTION public.auto_verify_challenge_response(uuid) 
SET search_path = public;

ALTER FUNCTION public.generate_group_recommendations(uuid, text) 
SET search_path = public;

-- Add security definer for sensitive functions
ALTER FUNCTION public.grant_flash_challenge_reward(uuid, integer, text[]) 
SECURITY DEFINER;

ALTER FUNCTION public.auto_verify_challenge_response(uuid) 
SECURITY DEFINER;