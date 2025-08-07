-- Enable RLS on civic_issues table specifically (the missing one)
ALTER TABLE public.civic_issues ENABLE ROW LEVEL SECURITY;

-- Add policies for civic_issues
CREATE POLICY "Anyone can view civic issues" ON civic_issues FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create issues" ON civic_issues FOR INSERT
WITH CHECK (auth.uid() = reported_by);

CREATE POLICY "Users can update own issues" ON civic_issues FOR UPDATE
USING (auth.uid() = reported_by);

-- Set search path for our custom functions only (skip PostGIS)
-- Note: Only set for functions that actually exist
DO $$
BEGIN
    -- Try to set search path for functions if they exist
    BEGIN
        ALTER FUNCTION grant_flash_challenge_reward(uuid, integer, text[]) SET search_path = public;
    EXCEPTION WHEN undefined_function THEN
        -- Function doesn't exist yet, skip
    END;
    
    BEGIN
        ALTER FUNCTION auto_verify_challenge_response(uuid) SET search_path = public;
    EXCEPTION WHEN undefined_function THEN
        -- Function doesn't exist yet, skip
    END;
    
    BEGIN
        ALTER FUNCTION generate_group_recommendations(uuid, text) SET search_path = public;
    EXCEPTION WHEN undefined_function THEN
        -- Function doesn't exist yet, skip
    END;
END
$$;