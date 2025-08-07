-- Fix remaining security issues

-- Enable RLS on remaining table (likely civic_issues or similar)
DO $$
DECLARE
    tbl record;
BEGIN
    -- Get tables without RLS enabled
    FOR tbl IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename NOT IN (
            SELECT table_name::text
            FROM information_schema.tables t
            JOIN pg_class c ON c.relname = t.table_name
            WHERE t.table_schema = 'public'
            AND c.relrowsecurity = true
        )
        -- Exclude system tables
        AND tablename NOT LIKE 'pg_%'
        AND tablename NOT LIKE 'auth_%'
        AND tablename NOT LIKE 'storage_%'
        AND tablename NOT LIKE 'realtime_%'
        AND tablename NOT LIKE 'supabase_%'
        AND tablename NOT LIKE 'vault_%'
    LOOP
        -- Enable RLS
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl.tablename);
        
        -- Add basic policy for authenticated users if no policies exist
        BEGIN
            EXECUTE format('CREATE POLICY "Allow authenticated access" ON public.%I FOR ALL USING (auth.uid() IS NOT NULL)', tbl.tablename);
        EXCEPTION WHEN duplicate_object THEN
            -- Policy already exists, skip
        END;
    END LOOP;
END
$$;

-- Fix function search paths for existing functions
DO $$
DECLARE
    func record;
BEGIN
    FOR func IN 
        SELECT 
            n.nspname as schema_name,
            p.proname as function_name,
            pg_get_function_identity_arguments(p.oid) as args
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
        AND p.proname NOT LIKE 'st_%'  -- Exclude PostGIS functions
        AND p.proname NOT LIKE 'geometry%'  -- Exclude PostGIS functions
        AND p.proname NOT LIKE 'box%'  -- Exclude PostGIS functions
        AND p.proname NOT LIKE 'gidx%'  -- Exclude PostGIS functions
        AND p.proname NOT LIKE 'postgis%'  -- Exclude PostGIS functions
        AND p.proname NOT LIKE 'get_proj%'  -- Exclude PostGIS functions
        AND p.proname NOT LIKE 'text'  -- Exclude PostGIS functions
        AND p.proname NOT LIKE 'pgis_%'  -- Exclude PostGIS functions
        AND p.proname NOT LIKE '_st_%'  -- Exclude PostGIS functions
        AND p.proname NOT LIKE 'dropgeometry%'  -- Exclude PostGIS functions
        AND p.proname NOT LIKE 'populate_%'  -- Exclude PostGIS functions
        AND p.proname NOT LIKE 'updategeometry%'  -- Exclude PostGIS functions
        AND p.proname NOT LIKE '_postgis_%'  -- Exclude PostGIS functions
    LOOP
        BEGIN
            -- Set search path to public only
            EXECUTE format('ALTER FUNCTION %I.%I(%s) SET search_path = public', 
                          func.schema_name, func.function_name, func.args);
        EXCEPTION WHEN OTHERS THEN
            -- Function might not exist or other issues, continue
        END;
    END LOOP;
END
$$;