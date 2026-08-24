import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { B2C_SERVICES, B2B_SERVICES } from '../src/data/services.js';
import { PORTFOLIO_ITEMS } from '../src/data/portfolio.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Simple .env parser
function loadEnv() {
  const paths = [join(__dirname, '../.env.local'), join(__dirname, '../.env')];
  for (const p of paths) {
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, 'utf8');
      content.split('\n').forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const idx = trimmed.indexOf('=');
          const k = trimmed.slice(0, idx).trim();
          const v = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
          if (!process.env[k]) process.env[k] = v;
        }
      });
    }
  }
}

loadEnv();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env or .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('🚀 Seeding data to Supabase:', supabaseUrl);

  // 1. Seed Packages (B2C & B2B)
  const packagesToSeed = [
    ...B2C_SERVICES.map((p, idx) => ({
      id: p.id,
      title: p.title,
      subtitle: p.subtitle,
      category: 'b2c',
      price: p.price,
      tag: p.tag || null,
      features: p.features || [],
      status: p.status || 'Tersedia',
      order_index: idx,
    })),
    ...B2B_SERVICES.map((p, idx) => ({
      id: p.id,
      title: p.title,
      subtitle: p.subtitle,
      category: 'b2b',
      price: p.price,
      tag: p.tag || null,
      features: p.features || [],
      status: p.status || 'Tersedia',
      order_index: idx + 10,
    })),
  ];

  console.log(`📦 Seeding ${packagesToSeed.length} packages...`);
  const { error: pkgErr } = await supabase
    .from('paket')
    .upsert(packagesToSeed, { onConflict: 'id' });

  if (pkgErr) {
    console.warn('⚠️ Note on seeding paket:', pkgErr.message);
  } else {
    console.log('✅ Successfully seeded paket!');
  }

  // 2. Seed Portfolio Gallery
  const galleryToSeed = PORTFOLIO_ITEMS.map((item, idx) => ({
    id: String(item.id),
    title: item.title,
    category: item.category,
    desktop_src: item.desktopSrc,
    mobile_src: item.mobileSrc,
    order_index: idx,
  }));

  console.log(`🖼️ Seeding ${galleryToSeed.length} gallery photos...`);
  const { error: galErr } = await supabase
    .from('galeri')
    .upsert(galleryToSeed, { onConflict: 'id' });

  if (galErr) {
    console.warn('⚠️ Note on seeding galeri:', galErr.message);
  } else {
    console.log('✅ Successfully seeded galeri!');
  }

  console.log('🎉 Seeding completed!');
}

seed().catch(console.error);
