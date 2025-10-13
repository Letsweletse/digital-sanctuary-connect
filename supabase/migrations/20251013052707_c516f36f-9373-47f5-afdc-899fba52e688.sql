-- Add new sermon: The Lord As Master by Peter Taylor
INSERT INTO public.sermons (
  title,
  speaker,
  date,
  youtube_id,
  description,
  tags,
  featured,
  views,
  downloads
) VALUES (
  'The Lord As Master',
  'Peter Taylor',
  '2024-10-12',
  'MK_KDfNjML4',
  'Sunday Sermon on The Lord As Master delivered by Peter Taylor',
  ARRAY['Sunday Service', 'Teaching', 'Lordship'],
  false,
  0,
  0
)
ON CONFLICT DO NOTHING;