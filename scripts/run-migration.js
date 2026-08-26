import pg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { Client } = pg;
const __dirname = dirname(fileURLToPath(import.meta.url));

// Ambil DATABASE_URL atau SUPABASE_DB_URL dari .env
const envPath = join(__dirname, '..', '.env');
let dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;

if (!dbUrl) {
  try {
    const envContent = readFileSync(envPath, 'utf-8');
    for (const line of envContent.split('\n')) {
      const [key, ...rest] = line.split('=');
      const val = rest.join('=').trim().replace(/^["']|["']$/g, '');
      if (key?.trim() === 'DATABASE_URL' || key?.trim() === 'SUPABASE_DB_URL') {
        dbUrl = val;
      }
    }
  } catch (e) {
    console.error('Gagal membaca .env:', e.message);
  }
}

if (!dbUrl) {
  console.error('❌ DATABASE_URL tidak ditemukan di .env.');
  console.error('Format: postgres://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres');
  process.exit(1);
}

const sqlPath = join(__dirname, 'migration.sql');
const sqlContent = readFileSync(sqlPath, 'utf-8');

async function runMigration() {
  console.log('🚀 Menghubungkan ke PostgreSQL Supabase...');
  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('✅ Terhubung ke database!');
    console.log('⚡ Menjalankan SQL migration...');
    
    await client.query(sqlContent);
    
    console.log('🎉 Migrasi SQL berhasil dijalankan!');
    console.log('   - Tabel "paket" siap');
    console.log('   - Tabel "galeri" siap');
    console.log('   - Storage bucket "gallery" & RLS policy siap');
  } catch (err) {
    console.error('❌ Error saat eksekusi SQL:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
