CREATE OR REPLACE FUNCTION public.whoami()
RETURNS TABLE(curr_role text, curr_user text, auth_role text, auth_uid text)
LANGUAGE sql SECURITY INVOKER SET search_path = public AS $$
  SELECT current_role::text, current_user::text, auth.role()::text, auth.uid()::text;
$$;
GRANT EXECUTE ON FUNCTION public.whoami() TO anon, authenticated, public;