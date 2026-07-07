
-- Tighten RLS on inquiries
DROP POLICY IF EXISTS "Public can submit inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Public can insert valid inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "No public reads" ON public.inquiries;
DROP POLICY IF EXISTS "No public updates" ON public.inquiries;
DROP POLICY IF EXISTS "No deletes" ON public.inquiries;

-- Reset grants — least privilege
REVOKE ALL ON public.inquiries FROM anon, authenticated, PUBLIC;
GRANT INSERT ON public.inquiries TO anon;
GRANT ALL ON public.inquiries TO service_role;

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- 1. INSERT: anon may submit only when required fields are non-empty
CREATE POLICY "Public can insert valid inquiries"
  ON public.inquiries
  FOR INSERT
  TO anon
  WITH CHECK (
    full_name IS NOT NULL AND length(btrim(full_name)) > 0
    AND email IS NOT NULL AND length(btrim(email)) > 0
    AND service_needed IS NOT NULL AND length(btrim(service_needed)) > 0
    AND project_details IS NOT NULL AND length(btrim(project_details)) > 0
  );

-- 2/3/4. No SELECT, UPDATE, or DELETE policies for anon/authenticated →
-- all reads, updates, and deletes are denied for public roles.
-- Admin dashboard reads/updates run through the service role
-- (supabaseAdmin), which bypasses RLS. This enforces the requested
-- "admin-only reads/updates" and "no deletes except service role".
