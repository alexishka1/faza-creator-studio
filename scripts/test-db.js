import pg from 'pg';
const { Client } = pg;

const projectRef = 'jpldmtguuoijhsfzlvkr';
const password = 'fazastudioo';

const regions = [
  'aws-0-ap-southeast-1', // Singapore
  'aws-0-ap-southeast-2',
  'aws-0-us-east-1',
  'aws-0-us-east-2',
  'aws-0-us-west-1',
  'aws-0-us-west-2',
  'aws-0-eu-central-1',
  'aws-0-eu-west-1',
  'aws-0-eu-west-2',
  'aws-0-ap-south-1',
  'aws-0-ap-northeast-1',
  'aws-0-ap-northeast-2',
  'aws-0-sa-east-1',
];

async function probe() {
  for (const reg of regions) {
    const host = `${reg}.pooler.supabase.com`;
    const connectionString = `postgresql://postgres.${projectRef}:${password}@${host}:6543/postgres`;
    const client = new Client({
      connectionString,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 4000,
    });
    try {
      console.log(`Probing ${reg}...`);
      await client.connect();
      console.log(`🎉 SUCCESS connected to ${reg}!`);
      const res = await client.query('SELECT current_database(), current_user;');
      console.log('Result:', res.rows);
      await client.end();
      return connectionString;
    } catch (err) {
      console.log(`  ❌ ${reg} failed: ${err.message}`);
      try { await client.end(); } catch (e) {}
    }
  }

  console.log('Probing direct host...');
  const directClient = new Client({
    connectionString: `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 4000,
  });
  try {
    await directClient.connect();
    console.log('🎉 SUCCESS connected to direct host!');
    await directClient.end();
    return `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`;
  } catch (err) {
    console.log(`  ❌ Direct failed: ${err.message}`);
    try { await directClient.end(); } catch (e) {}
  }
  return null;
}

probe().then((res) => {
  if (res) {
    console.log('\n✅ VALID CONNECTION STRING FOUND:\n', res);
  } else {
    console.log('\n❌ No connection succeeded with projectRef:', projectRef);
  }
  process.exit(0);
});
