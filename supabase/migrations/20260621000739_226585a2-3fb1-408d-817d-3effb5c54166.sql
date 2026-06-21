DROP POLICY IF EXISTS "Anyone can submit an inquiry" ON public.inquiries;
CREATE POLICY "Public can submit inquiries"
  ON public.inquiries
  FOR INSERT
  TO public
  WITH CHECK (true);