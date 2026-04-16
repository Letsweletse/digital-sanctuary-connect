
CREATE TABLE public.pledges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pledger_name TEXT NOT NULL,
  pledger_email TEXT NOT NULL,
  pledger_phone TEXT,
  event_name TEXT NOT NULL DEFAULT 'Apostolic Conference - Malawi 2026',
  pledge_amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'BWP',
  message TEXT,
  email_sent BOOLEAN DEFAULT false,
  whatsapp_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.pledges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit pledges"
ON public.pledges
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can view pledges"
ON public.pledges
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Authenticated can update pledges"
ON public.pledges
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
