-- Run once in the Supabase dashboard → SQL Editor.
-- Creates storage for editable site content (home page, partners, events)
-- and a public bucket for images/videos uploaded from the admin pages.

-- ── 1. Editable site content ──────────────────────────────────────────────────
create table if not exists public.site_content (
  key        text primary key,          -- 'home' | 'partners' | 'events'
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

-- The site reads content with the public anon key; the admin pages write with it
-- too (same model as the existing chapters_data table).
drop policy if exists "site_content read" on public.site_content;
create policy "site_content read" on public.site_content
  for select using (true);

drop policy if exists "site_content insert" on public.site_content;
create policy "site_content insert" on public.site_content
  for insert with check (true);

drop policy if exists "site_content update" on public.site_content;
create policy "site_content update" on public.site_content
  for update using (true) with check (true);

-- ── 2. Media uploads bucket ───────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do nothing;

drop policy if exists "site-media read" on storage.objects;
create policy "site-media read" on storage.objects
  for select using (bucket_id = 'site-media');

drop policy if exists "site-media upload" on storage.objects;
create policy "site-media upload" on storage.objects
  for insert with check (bucket_id = 'site-media');
