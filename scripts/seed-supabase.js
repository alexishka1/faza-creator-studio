/**
 * Seed Script — Faza Studio Supabase Migration
 * ─────────────────────────────────────────────
 * Membaca data hardcode dari src/data/ dan INSERT ke Supabase.
 * Jalankan SEKALI setelah migration.sql dieksekusi di Supabase:
 *
 *   node scripts/seed-supabase.js
 *
 * CATATAN: Script ini pakai SUPABASE_SERVICE_KEY dari .env
 * Pastikan file .env ada di root project.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load .env manual (tanpa dotenv untuk meminimalkan dependency)
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '..', '.env');

let SUPABASE_URL = '';
let SERVICE_KEY  = '';

try {
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const [key, ...rest] = line.split('=');
    const val = rest.join('=').trim().replace(/^["']|["']$/g, '');
    if (key?.trim() === 'VITE_SUPABASE_URL') SUPABASE_URL = val;
    if (key?.trim() === 'SUPABASE_SERVICE_KEY') SERVICE_KEY = val;
  }
} catch (e) {
  console.error('❌ Tidak bisa baca .env:', e.message);
  process.exit(1);
}

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ VITE_SUPABASE_URL atau SUPABASE_SERVICE_KEY tidak ditemukan di .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── Data paket dari services.js ───────────────────────────────
const B2C_SERVICES = [
  { id: 'studio-rent',      nama: 'Studio Rental',    subtitle: '/ Hour',             kategori: 'b2c', harga: 'IDR 150,000 – 250,000', tag: 'RETAIL / HOURLY',         deskripsi: 'Flexible private studio rental with professional continuous & strobe lighting, interchangeable cyclorama backdrops, and air-conditioned dressing rooms.', fitur: ['Professional Lighting Setup Included','Cyclorama & Seamless Backdrops','Air-Conditioned & Private Vanity','Minimum 1-Hour Booking'], url_foto: '/images/optimized/DSCF9516-1600.webp', urutan: 1 },
  { id: 'happy-hour',       nama: 'Weekday',          subtitle: 'Happy Hour',         kategori: 'b2c', harga: 'IDR 499,000',           tag: 'POPULAR DEAL',           deskripsi: 'Exclusive value studio package for weekday sessions (Monday–Thursday). Ideal for content creators, graduation portraits, and personal projects.', fitur: ['2-Hour Complete Studio Access','All High-Res Raw Files Provided','5 Curated Edited Photos','Up to 4 Persons Included'], url_foto: '/images/optimized/DSCF9527-1600.webp', urutan: 2 },
  { id: 'together-moment',  nama: 'Together',         subtitle: 'Moment',             kategori: 'b2c', harga: 'IDR 699,000',           tag: 'BEST FOR GROUPS',        deskripsi: 'Capture timeless group memories for families, graduation cohorts, best friends, and creative teams with aesthetic and directed studio compositions.', fitur: ['2-Hour Directed Studio Session','Capacity Up to 8 Persons','10 Premium Retouched Photos','Instant Cloud Drive Gallery Access'], url_foto: '/images/optimized/DSCF9518-1600.webp', urutan: 3 },
  { id: 'linkedin-portrait',nama: 'Executive',        subtitle: 'Portrait',           kategori: 'b2c', harga: 'IDR 150,000',           tag: 'CAREER & PROFILE',       deskripsi: 'Fast, sharp, and commanding executive headshots engineered to elevate your LinkedIn profile, corporate bio, and personal brand presence.', fitur: ['30-Minute Focused Headshot Session','Curated Aesthetic Backdrop Selection','3 Master-Retouched High-Res Photos','Express 24-48h Delivery'], url_foto: '/images/optimized/DSCF9520-1600.webp', urutan: 4 },
];

const B2B_SERVICES = [
  { id: 'editorial-fashion',   nama: 'Editorial',  subtitle: '& Fashion',        kategori: 'b2b', harga: 'IDR 5,000,000',          tag: 'COMMERCIAL PRODUCTION', deskripsi: 'High-end commercial photoshoot designed for fashion brands, lookbooks, and magazine editorials. Includes creative direction and complex multi-light setups.', fitur: ['Creative Direction & Concept Board','Full Studio Lighting Architecture','80 High-End Retouched Images','Full Commercial Usage License'], url_foto: '/images/optimized/DSCF9524-1600.webp', urutan: 5 },
  { id: 'product-commercial',  nama: 'Product',    subtitle: '& Commercial',     kategori: 'b2b', harga: 'IDR 2,000,000',          tag: 'BRAND & CATALOG',       deskripsi: 'Sharp, texture-accurate product photography with specialized tabletop and lifestyle setups tailored for e-commerce, digital advertising, and marketplace storefronts.', fitur: ['Up to 30 Product SKUs','Clean White / Dark / Styled Setup','40 Ready-to-Use Master Edits','Ultra High-Res Print-Ready Files'], url_foto: '/images/optimized/DSCF9515-1600.webp', urutan: 6 },
  { id: 'sewa-ruang',          nama: 'Space Buyout',subtitle: 'Half-Day / Full-Day', kategori: 'b2b', harga: 'IDR 1,200,000 – 2,000,000', tag: 'VENUE PRODUCTION', deskripsi: 'Exclusive private buyout of the entire creative space for video commercials, film shoots, casting calls, creative workshops, and brand launches.', fitur: ['Half-Day (4h) / Full-Day (8h) Options','Full Access to Cyclorama & Lounge','High-Capacity Power & High-Speed WiFi','Dedicated Makeup & Client Holding Area'], url_foto: '/images/optimized/DSCF9516-1600.webp', urutan: 7 },
  { id: 'podcast-bundle',      nama: 'Podcast',    subtitle: 'Bundle',           kategori: 'b2b', harga: 'IDR 850,000',            tag: 'AUDIO & TALKSHOW',      deskripsi: 'Turnkey studio setup for video podcasts, vodcasts, and talkshows equipped with multi-microphone audio capture and cinematic ambient lighting.', fitur: ['2-Hour Sound-Treated Recording Block','2-3 Pro Broadcast Microphones & Mixer','Cinematic Studio Lighting Atmosphere','Immediate Raw Multi-Track Audio & Video'], url_foto: '/images/optimized/DSCF9527-1600.webp', urutan: 8 },
  { id: 'retainer-bulanan',    nama: 'Monthly',    subtitle: 'Retainer',         kategori: 'b2b', harga: 'From IDR 4,500,000 / mo', tag: 'AGENCY PARTNERSHIP',  deskripsi: 'Ongoing visual production partnership for agencies and active brands. Includes flexible monthly studio hours, prioritized calendar booking, and dedicated creative support.', fitur: ['Flexible Monthly Studio Hours Pool','Priority Calendar Scheduling Anytime','Dedicated Photographer & Editor Team','Cost-Optimized Production Volume'], url_foto: '/images/optimized/DSCF9518-1600.webp', urutan: 9 },
];

// ── Data galeri dari portfolio.js ─────────────────────────────
const PORTFOLIO_ITEMS = [
  { id: 'gal-1', url_foto: '/images/optimized/DSCF9516-1600.webp', caption: 'Studio Ambiance & Cyclorama Wall',         kategori: 'Studio & Space',         urutan: 1 },
  { id: 'gal-2', url_foto: '/images/optimized/DSCF9527-1600.webp', caption: 'Warm Tone Portrait Session',              kategori: 'Portrait & Personal',    urutan: 2 },
  { id: 'gal-3', url_foto: '/images/optimized/DSCF9518-1600.webp', caption: 'Editorial & Fashion Visual Story',        kategori: 'Editorial & Fashion',    urutan: 3 },
  { id: 'gal-4', url_foto: '/images/optimized/DSCF9520-1600.webp', caption: 'LinkedIn & Executive Headshot',           kategori: 'Portrait & Personal',    urutan: 4 },
  { id: 'gal-5', url_foto: '/images/optimized/DSCF9524-1600.webp', caption: 'Lookbook & Styling Concept Production',  kategori: 'Editorial & Fashion',    urutan: 5 },
  { id: 'gal-6', url_foto: '/images/optimized/DSCF9515-1600.webp', caption: 'Commercial Studio Lighting Architecture', kategori: 'Commercial & Product',  urutan: 6 },
  { id: 'gal-7', url_foto: '/images/optimized/DSCF9528-1600.webp', caption: 'Lounge Area & Private Makeup Station',   kategori: 'Studio & Space',         urutan: 7 },
  { id: 'gal-8', url_foto: '/images/optimized/DSCF9530-1600.webp', caption: 'Product Showcase & E-Commerce Catalog',  kategori: 'Commercial & Product',  urutan: 8 },
];

async function seed() {
  console.log('🌱 Mulai seeding ke Supabase...\n');
  console.log(`📡 URL: ${SUPABASE_URL}\n`);

  // ── Seed tabel paket ─────────────────────────────────────────
  console.log('📦 Seeding tabel paket...');
  const allPaket = [...B2C_SERVICES, ...B2B_SERVICES];

  for (const p of allPaket) {
    const { error } = await supabase
      .from('paket')
      .upsert([p], { onConflict: 'id' });

    if (error) {
      console.warn(`  ⚠️  ${p.id}: ${error.message}`);
    } else {
      console.log(`  ✅  ${p.id} — ${p.nama} (${p.kategori})`);
    }
  }

  // ── Seed tabel galeri ─────────────────────────────────────────
  console.log('\n🖼️  Seeding tabel galeri...');

  for (const g of PORTFOLIO_ITEMS) {
    const { error } = await supabase
      .from('galeri')
      .upsert([g], { onConflict: 'id' });

    if (error) {
      console.warn(`  ⚠️  ${g.id}: ${error.message}`);
    } else {
      console.log(`  ✅  ${g.id} — ${g.caption}`);
    }
  }

  console.log('\n🎉 Seed selesai!');
  console.log('');
  console.log('📋 Langkah selanjutnya:');
  console.log('   1. Cek tabel di Supabase Dashboard');
  console.log('   2. Test: curl https://[project].vercel.app/api/gallery');
  console.log('   3. Upload foto real via Admin Panel → Galeri');
  console.log('   4. Set env vars di Vercel Dashboard');
}

seed().catch((err) => {
  console.error('❌ Seed gagal:', err);
  process.exit(1);
});
