// api/cases.js
// Serverless endpoint that returns the list of certified cases from Supabase.

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || null;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || null;

export default async function handler(req, res) {
  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({ ok: false, message: 'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set in environment' });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data, error } = await supabase
      .from('fair_judgments')
      .select('*')
      .order('certified_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('api/cases supabase error', error);
      return res.status(500).json({ ok: false, message: 'Error querying Supabase', error: error.message || error });
    }

    return res.status(200).json(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error('api/cases handler error', err);
    return res.status(500).json({ ok: false, message: err.message || 'Internal error' });
  }
}
