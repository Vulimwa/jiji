-- Enable RLS on civic_issues table with correct column names
ALTER TABLE public.civic_issues ENABLE ROW LEVEL SECURITY;

-- Add policies for civic_issues
CREATE POLICY "Anyone can view civic issues" ON civic_issues FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create issues" ON civic_issues FOR INSERT
WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can update own issues" ON civic_issues FOR UPDATE
USING (auth.uid() = reporter_id);