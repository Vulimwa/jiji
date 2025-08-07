-- Fix critical RLS and security issues

-- First, enable RLS on spatial_ref_sys table that's currently missing it
ALTER TABLE public.spatial_ref_sys ENABLE ROW LEVEL SECURITY;

-- Add policy for spatial_ref_sys (read-only for authenticated users)
CREATE POLICY "Allow read access to spatial_ref_sys" ON public.spatial_ref_sys
FOR SELECT USING (true);

-- Fix function search paths for security
-- Update all custom functions to have proper search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SET search_path = public;

-- Create function to get current user role safely (security definer)
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT user_type::text FROM public.user_profiles WHERE id = auth.uid();
$$ LANGUAGE SQL 
SECURITY DEFINER 
STABLE
SET search_path = public;

-- Create function to check if user has admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND user_type = 'admin'
  );
$$ LANGUAGE SQL 
SECURITY DEFINER 
STABLE
SET search_path = public;

-- Create function to check if user is authenticated
CREATE OR REPLACE FUNCTION public.is_authenticated()
RETURNS BOOLEAN AS $$
  SELECT auth.uid() IS NOT NULL;
$$ LANGUAGE SQL 
SECURITY DEFINER 
STABLE
SET search_path = public;