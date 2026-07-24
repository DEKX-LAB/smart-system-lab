ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

REVOKE SELECT ON public.inquiries FROM anon;
GRANT SELECT ON public.inquiries TO authenticated;

DROP POLICY IF EXISTS "Authenticated users can read inquiries" ON public.inquiries;
CREATE POLICY "Authenticated users can read inquiries"
ON public.inquiries
FOR SELECT
TO authenticated
USING (true);