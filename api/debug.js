// api/debug.js
// Temporary debug endpoint to help verify which Supabase project the server functions are using
// Returns non-sensitive info: the supabase host (not the key) and a row count for the fair_judgments table.

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || null;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || null;

export default async function handler(req, res) {
  try {
    const host = SUPABASE_URL ? (() => { try { return new URL(SUPABASE_URL).hostname } catch (e) { return SUPABASE_URL } })() : null;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(200).json({ ok: false, message: 'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set in environment', supabase_host: host });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Query for exact count (we select a single column with count option)
    const { data, error, count } = await supabase.from('fair_judgments').select('id', { count: 'exact' }).limit(1);

    if (error) {
      console.error('debug supabase error', error);
      return res.status(500).json({ ok: false, message: 'Error querying Supabase', supabase_host: host, error: error.message || error });
    }

    return res.status(200).json({ ok: true, supabase_host: host, row_count: typeof count === 'number' ? count : (Array.isArray(data) ? data.length : 0) });
  } catch (err) {
    console.error('debug handler error', err);
    return res.status(500).json({ ok: false, message: err.message || 'Internal error' });
  }
}
