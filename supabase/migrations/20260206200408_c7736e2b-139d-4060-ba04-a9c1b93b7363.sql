
-- Create Q&A questions table for live conference Q&A
CREATE TABLE public.qa_questions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_name text NOT NULL,
  question text NOT NULL,
  is_highlighted boolean NOT NULL DEFAULT false,
  is_dismissed boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.qa_questions ENABLE ROW LEVEL SECURITY;

-- Anyone can submit questions (no signup required)
CREATE POLICY "Anyone can insert questions"
ON public.qa_questions
FOR INSERT
WITH CHECK (true);

-- Anyone can view non-dismissed questions
CREATE POLICY "Anyone can view questions"
ON public.qa_questions
FOR SELECT
USING (true);

-- Anyone can update questions (for admin highlight/dismiss - no auth in this app)
CREATE POLICY "Anyone can update questions"
ON public.qa_questions
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Anyone can delete questions
CREATE POLICY "Anyone can delete questions"
ON public.qa_questions
FOR DELETE
USING (true);

-- Enable realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE public.qa_questions;
