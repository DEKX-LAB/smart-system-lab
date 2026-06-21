CREATE OR REPLACE FUNCTION public.whoami3()
RETURNS jsonb LANGUAGE sql SECURITY INVOKER SET search_path = public AS $$
  SELECT jsonb_build_object(
    'database', current_database(),
    'schema', current_schema(),
    'inquiries_oid', 'public.inquiries'::regclass::oid,
    'policies', (SELECT jsonb_agg(jsonb_build_object('name',polname,'cmd',polcmd,'permissive',polpermissive,'roles',polroles::regrole[]::text[])) FROM pg_policy WHERE polrelid='public.inquiries'::regclass)
  );
$$;
GRANT EXECUTE ON FUNCTION public.whoami3() TO public;