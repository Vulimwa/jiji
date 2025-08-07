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

-- Fix PostGIS functions search paths (the ones we can modify)
-- Note: System PostGIS functions cannot be modified, only custom ones

-- Create trigger function for automatic profile creation on auth user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, user_type)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), 
          COALESCE(NEW.raw_user_meta_data->>'user_type', 'resident')::user_type);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public;

-- Create trigger for new user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();