-- ═══════════════════════════════════════════════════════════════════
-- FAZA STUDIO DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- ═══════════════════════════════════════════════════════════════════

-- 1. TABEL PAKET LAYANAN (B2C & B2B)
CREATE TABLE IF NOT EXISTS public.paket (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  category TEXT NOT NULL CHECK (category IN ('b2c', 'b2b')),
  price TEXT NOT NULL,
  tag TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'Tersedia' CHECK (status IN ('Tersedia', 'Penuh / Sold Out', 'Promo')),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABEL GALERI FOTO STUDIO
CREATE TABLE IF NOT EXISTS public.galeri (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  desktop_src TEXT NOT NULL,
  mobile_src TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABEL RESERVASI (BOOKING)
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  layanan TEXT NOT NULL,
  tanggal DATE NOT NULL,
  jam TEXT NOT NULL,
  pesan TEXT DEFAULT '-',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABEL BLOKIR JADWAL (BLOCKED SLOTS)
CREATE TABLE IF NOT EXISTS public.blocked_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tanggal DATE NOT NULL,
  jam TEXT, -- NULL berarti blokir 1 hari penuh
  alasan TEXT DEFAULT 'Maintenance / Libur Studio',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─── UNIQUE CONSTRAINT & INDEXES ─────────────────────────────────
-- Mencegah 2 booking aktif (pending/confirmed) di tanggal dan jam yang sama di level database
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_booking 
ON public.bookings (tanggal, jam) 
WHERE status IN ('pending', 'confirmed');

CREATE INDEX IF NOT EXISTS idx_bookings_tanggal ON public.bookings(tanggal);
CREATE INDEX IF NOT EXISTS idx_blocked_slots_tanggal ON public.blocked_slots(tanggal);
CREATE INDEX IF NOT EXISTS idx_paket_category ON public.paket(category, order_index);

-- ─── ROW LEVEL SECURITY (RLS) ────────────────────────────────────
ALTER TABLE public.paket ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galeri ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_slots ENABLE ROW LEVEL SECURITY;

-- Public can read active packages and gallery
CREATE POLICY "Public Read Paket" ON public.paket FOR SELECT USING (true);
CREATE POLICY "Public Read Galeri" ON public.galeri FOR SELECT USING (true);

-- Public can insert new bookings and check availability
CREATE POLICY "Public Insert Bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Bookings For Availability" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Public Read Blocked Slots" ON public.blocked_slots FOR SELECT USING (true);

-- Service Role / Admin has full access to all tables
CREATE POLICY "Admin Full Access Paket" ON public.paket FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Galeri" ON public.galeri FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Bookings" ON public.bookings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Blocked Slots" ON public.blocked_slots FOR ALL USING (true) WITH CHECK (true);
