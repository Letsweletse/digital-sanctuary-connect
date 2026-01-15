-- Drop existing restrictive policies and create permissive ones for event_registrations
DROP POLICY IF EXISTS "Anyone can insert registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Authenticated users can update registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Authenticated users can view registrations" ON public.event_registrations;

-- Create PERMISSIVE policies (these allow access)
CREATE POLICY "Public can insert registrations" 
ON public.event_registrations 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Public can view registrations" 
ON public.event_registrations 
FOR SELECT 
TO anon, authenticated
USING (true);

CREATE POLICY "Public can update registrations" 
ON public.event_registrations 
FOR UPDATE 
TO anon, authenticated
USING (true)
WITH CHECK (true);