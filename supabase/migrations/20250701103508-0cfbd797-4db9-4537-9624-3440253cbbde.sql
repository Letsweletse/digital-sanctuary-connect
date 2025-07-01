
-- Create table to store event registrations
CREATE TABLE public.event_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name TEXT NOT NULL,
  event_date TEXT NOT NULL,
  event_time TEXT,
  event_location TEXT,
  attendee_name TEXT NOT NULL,
  attendee_email TEXT NOT NULL,
  attendee_phone TEXT,
  attendee_title TEXT,
  attendee_role TEXT,
  attendee_denomination TEXT,
  number_of_attendees INTEGER DEFAULT 1,
  registration_type TEXT DEFAULT 'Standard',
  check_in_id TEXT,
  check_in_url TEXT,
  additional_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  email_sent BOOLEAN DEFAULT false,
  whatsapp_sent BOOLEAN DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Create policies for event registrations
CREATE POLICY "Anyone can insert registrations" 
  ON public.event_registrations 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view registrations" 
  ON public.event_registrations 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update registrations" 
  ON public.event_registrations 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Create index for better performance
CREATE INDEX idx_event_registrations_email ON public.event_registrations(attendee_email);
CREATE INDEX idx_event_registrations_event_name ON public.event_registrations(event_name);
CREATE INDEX idx_event_registrations_created_at ON public.event_registrations(created_at);
