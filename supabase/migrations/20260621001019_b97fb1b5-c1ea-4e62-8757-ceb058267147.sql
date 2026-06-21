CREATE OR REPLACE FUNCTION public.whoami2()
RETURNS jsonb LANGUAGE sql SECURITY INVOKER SET search_path = public AS $$
  SELECT jsonb_build_object(
    'current_role', current_role,
    'current_user', current_user,
    'session_user', session_user,
    'jwt_claims', current_setting('request.jwt.claims', true),
    'jwt_role', current_setting('request.jwt.claim.role', true),
    'row_security', current_setting('row_security', true)
  );
$$;
GRANT EXECUTE ON FUNCTION public.whoami2() TO public;