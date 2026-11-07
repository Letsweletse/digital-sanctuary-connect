-- Gate Gaborone sermon library. Run once in Supabase > SQL Editor.
create table if not exists public.sermons (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  speaker text not null,
  preached_on date not null,
  series text,
  scripture text,
  description text,
  audio_url text,
  audio_key text,
  duration_seconds integer,
  size_bytes bigint,
  mime_type text,
  youtube_url text,
  cover_image text,
  plays integer not null default 0,
  downloads integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists sermons_preached_on_idx on public.sermons (preached_on desc);

-- The website reads and writes with the server-side service key only.
alter table public.sermons enable row level security;

create or replace function public.bump_sermon(p_id uuid, p_field text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_field = 'plays' then update sermons set plays = plays + 1 where id = p_id;
  elsif p_field = 'downloads' then update sermons set downloads = downloads + 1 where id = p_id;
  end if;
end $$;
revoke all on function public.bump_sermon(uuid, text) from public, anon, authenticated;

insert into public.sermons (slug, title, speaker, preached_on, series, description, youtube_url, cover_image)
values
 ('2025-10-05-the-wisdom-of-god','The Wisdom of God','Pastor Kobus Bezuidenhout','2025-10-05','Sunday Service',
  'Sunday sermon on the wisdom of God, delivered by Pastor Kobus Bezuidenhout.','https://www.youtube.com/watch?v=OVYHy6jebeo','/img/kobus-portrait.jpg'),
 ('2024-10-12-the-lord-as-master','The Lord as Master','Peter Taylor','2024-10-12','Sunday Service',
  'Sunday sermon on the Lordship of Christ, delivered by Peter Taylor.','https://www.youtube.com/watch?v=MK_KDfNjML4','/img/peter-naomi-taylor-2.jpg')
on conflict (slug) do nothing;
