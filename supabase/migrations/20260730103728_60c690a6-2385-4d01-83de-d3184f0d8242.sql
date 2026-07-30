REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

DROP FUNCTION IF EXISTS public.whoami();
DROP FUNCTION IF EXISTS public.whoami2();
DROP FUNCTION IF EXISTS public.whoami3();