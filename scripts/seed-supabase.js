/**
 * Standalone Supabase Seed Script
 * Run with: node scripts/seed-supabase.js
 * 
 * Automatically reads VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY from .env
 * and seeds/syncs the initial portfolio content into the portfolio_sections table.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// Parse .env if present
const envPath = resolve(process.cwd(), '.env');
let env = {};
if (existsSync(envPath)) {
  const lines = readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [k, ...v] = trimmed.split('=');
      env[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
    }
  }
}

const supabaseUrl = process.env.VITE_SUPABASE_URL || env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY;
const adminPasscode = process.env.VITE_ADMIN_PASSCODE || env.VITE_ADMIN_PASSCODE || 'mridul2026';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in your environment or .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  console.log(`Connecting to Supabase at ${supabaseUrl}...`);

  // Dynamically import default data from source
  const { DEFAULT_PORTFOLIO_DATA } = await import('../src/context/PortfolioDataContext.jsx');

  const sections = Object.entries(DEFAULT_PORTFOLIO_DATA);
  console.log(`Found ${sections.length} sections to seed: ${sections.map(([k]) => k).join(', ')}`);

  let successCount = 0;

  for (const [sectionKey, content] of sections) {
    process.stdout.write(`Seeding section "${sectionKey}"... `);

    // Try RPC first (verifies passcode)
    const { data: rpcSuccess, error: rpcError } = await supabase.rpc('update_portfolio_section', {
      p_section: sectionKey,
      p_content: content,
      p_passcode: adminPasscode,
    });

    if (!rpcError && rpcSuccess) {
      console.log('✓ (via RPC)');
      successCount++;
    } else {
      // If RPC fails (e.g. initial setup before RPC or direct upsert allowed), try direct upsert
      const { error: upsertError } = await supabase
        .from('portfolio_sections')
        .upsert({ id: sectionKey, content, updated_at: new Date().toISOString() });

      if (upsertError) {
        console.error(`✗ Failed: ${rpcError?.message || upsertError.message}`);
      } else {
        console.log('✓ (via direct upsert)');
        successCount++;
      }
    }
  }

  console.log(`\nSeed complete: ${successCount}/${sections.length} sections synchronized.`);
}

seed().catch((err) => {
  console.error('Seed process failed:', err);
  process.exit(1);
});
