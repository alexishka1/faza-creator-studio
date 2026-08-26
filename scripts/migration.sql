-- ============================================================
-- FAZA STUDIO — Supabase Migration
-- Jalankan di: Supabase Dashboard > SQL Editor
-- ============================================================

-- ── 1. TABEL PAKET ──────────────────────────────────────────
create table if not exists paket (
  id          text primary key default ('pkg-' || extract(epoch from now())::bigint::text),
  nama        text not null,
  subtitle    text,
  kategori    text not null check (kategori in ('b2c', 'b2b')),
  harga       text not null,
  tag         text,
  deskripsi   text,
  fitur       text[],
  url_foto    text,
  status      text default 'aktif' check (status in ('aktif', 'nonaktif')),
  urutan      integer default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- RLS: siapapun bisa baca, hanya service key yang bisa tulis
alter table paket enable row level security;

drop policy if exists "Public read paket" on paket;
create policy "Public read paket"
  on paket for select
  using (true);

-- ── 2. TABEL GALERI ─────────────────────────────────────────
create table if not exists galeri (
  id          text primary key default ('gal-' || extract(epoch from now())::bigint::text),
  url_foto    text not null,
  caption     text,
  kategori    text,
  urutan      integer default 0,
  created_at  timestamptz default now()
);

-- RLS
alter table galeri enable row level security;

drop policy if exists "Public read galeri" on galeri;
create policy "Public read galeri"
  on galeri for select
  using (true);

-- ── 3. SUPABASE STORAGE — bucket gallery ────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'gallery',
  'gallery',
  true,
  5242880,   -- 5 MB max per file
  array['image/webp', 'image/jpeg', 'image/png', 'image/avif']
)
on conflict (id) do update set public = true;

-- Storage policy: siapapun bisa baca
drop policy if exists "Public read gallery storage" on storage.objects;
create policy "Public read gallery storage"
  on storage.objects for select
  using (bucket_id = 'gallery');

-- Storage policy: hanya authenticated / service key yang bisa upload
drop policy if exists "Service upload gallery" on storage.objects;
create policy "Service upload gallery"
  on storage.objects for insert
  with check (bucket_id = 'gallery');

drop policy if exists "Service delete gallery" on storage.objects;
create policy "Service delete gallery"
  on storage.objects for delete
  using (bucket_id = 'gallery');

-- ── 4. HELPER: updated_at trigger untuk tabel paket ─────────
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on paket;
create trigger set_updated_at
  before update on paket
  for each row execute function update_updated_at_column();

-- ── 5. INDEXES ───────────────────────────────────────────────
create index if not exists idx_paket_kategori on paket (kategori);
create index if not exists idx_paket_urutan   on paket (urutan);
create index if not exists idx_galeri_kategori on galeri (kategori);
create index if not exists idx_galeri_urutan   on galeri (urutan);
