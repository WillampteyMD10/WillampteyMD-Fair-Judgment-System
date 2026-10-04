// api/worker.js
// Fair Judgment System — Worker AI processor.
//
// Reads one queued intent from Supabase,
// generates Worker AI + Detective AI analysis,
// writes the certification to fair_judgments,
// then marks the intent as processed.

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || null;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || null;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || null;
const CRON_SECRET = process.env.CRON_SECRET || null;

const OPENAI_MODEL = 'gpt-6-luna';

async function runOpenAI(input) {
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      input
    })
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(
      body?.error?.message ||
      `OpenAI request failed with status ${response.status}`
    );
  }

  if (!body.output_text) {
    throw new Error('OpenAI returned no output text.');
  }

  return body.output_text.trim();
}

async function generateIntentHash(title, creator, genesis) {
  const source =
    `${title.trim()}:${creator.trim()}:${genesis.trim()}:${new Date().toISOString().split('T')[0]}`;

  const encoded = new TextEncoder().encode(source);
  const digest = await crypto.subtle.digest('SHA-256', encoded);

  return Array.from(new Uint8Array(digest))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

export default async function handler(req, res) {
  try {
    // Protect the Worker endpoint.
    if (!CRON_SECRET) {
      return res.status(500).json({
        ok: false,
        message: 'CRON_SECRET not set in environment'
      });
    }

    const authorization = req.headers.authorization || '';

    if (authorization !== `Bearer ${CRON_SECRET}`) {
      return res.status(401).json({
        ok: false,
        message: 'Unauthorized'
      });
    }

    if (req.method !== 'GET' && req.method !== 'POST') {
      return res.status(405).json({
        ok: false,
        message: 'Method not allowed'
      });
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({
        ok: false,
        message:
          'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set in environment'
      });
    }

    if (!OPENAI_API_KEY) {
      return res.status(500).json({
        ok: false,
        message: 'OPENAI_API_KEY not set in environment'
      });
    }

    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY
    );

    // Diagnostic: see whether the Worker can see any intents at all.
    const { data: debugIntents, error: debugIntentError } = await supabase
      .from('intents')
      .select('id,status')
      .limit(10);

    console.log('Worker debug intents:', debugIntents);
    console.log('Worker debug intents error:', debugIntentError);

    // 1. Get the oldest queued intent.
    const { data: intents, error: intentError } = await supabase
      .from('intents')
      .select('*')
      .eq('status', 'queued_for_worker_ai')
      .order('created_at', { ascending: true })
      .limit(1);

    if (intentError) {
      console.error('Worker intent query error:', intentError);

      return res.status(500).json({
        ok: false,
        message: 'Could not read queued intent',
        error: intentError.message
      });
    }

    console.log(
      'Worker queued intent count:',
      intents?.length || 0
    );

    const intent = intents?.[0] || null;

    if (!intent) {
      return res.status(200).json({
        ok: true,
        message: 'No queued intents found.'
      });
    }

    // 2. Generate Worker AI analysis.
    const workerAI = await runOpenAI([
      {
        role: 'system',
        content:
          'You are the Worker AI layer of the Fair Judgment System. ' +
          'Your role is to structurally expand and analyze the human-originated intent. ' +
          'Do not claim that AI-generated material is human-authored. ' +
          'Do not invent evidence. Clearly distinguish the supplied human genesis ' +
          'from your own generated analysis.'
      },
      {
        role: 'user',
        content:
          `Project title: ${intent.project_title}\n\n` +
          `Creator: ${intent.creator_name}\n\n` +
          `Human Genesis:\n${intent.human_genesis}\n\n` +
          'Produce a concise Worker AI analysis containing:\n' +
          '1. Structural interpretation\n' +
          '2. Key concepts or components\n' +
          '3. Possible implementation directions\n' +
          '4. Explicit distinction between human-provided intent and AI-generated expansion'
      }
    ]);

    // 3. Generate Detective AI analysis.
    const detectiveVerdict = await runOpenAI([
      {
        role: 'system',
        content:
          'You are the Detective AI layer of the Fair Judgment System. ' +
          'Your role is to critically inspect the relationship between the human genesis ' +
          'and the Worker AI expansion. Do not pretend to have a plagiarism detector, ' +
          'hidden database, biometric detector, or certainty you do not possess. ' +
          'Do not assign fake probabilities. Give an evidence-based analytical stance.'
      },
      {
        role: 'user',
        content:
          `Project title: ${intent.project_title}\n\n` +
          `Human Genesis:\n${intent.human_genesis}\n\n` +
          `Worker AI Analysis:\n${workerAI}\n\n` +
          'Produce a concise Detective AI assessment containing:\n' +
          '1. What appears directly grounded in the supplied human genesis\n' +
          '2. What appears to be AI expansion or interpretation\n' +
          '3. Potential ambiguity or unsupported claims\n' +
          '4. A final Fair Judgment stance explaining the distinction'
      }
    ]);

    // 4. Generate the certificate hash.
    const intentHash = await generateIntentHash(
      intent.project_title,
      intent.creator_name,
      intent.human_genesis
    );

    // 5. Write the completed certification.
    const {
      data: certification,
      error: certificationError
    } = await supabase
      .from('fair_judgments')
      .insert([{
        project_title: intent.project_title,
        creator_name: intent.creator_name,
        human_genesis: intent.human_genesis,
        worker_ai: workerAI,
        detective_verdict: detectiveVerdict,
        intent_hash: intentHash,
        certified_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (certificationError) {
      console.error(
        'Worker fair_judgments insert error:',
        certificationError
      );

      return res.status(500).json({
        ok: false,
        message:
          'AI analysis completed but certification write failed',
        error: certificationError.message,
        intent_id: intent.id
      });
    }

    // 6. Mark the original intent as processed.
    const { error: updateError } = await supabase
      .from('intents')
      .update({
        status: 'processed_by_worker_ai'
      })
      .eq('id', intent.id);

    if (updateError) {
      console.error(
        'Worker intent status update error:',
        updateError
      );

      return res.status(500).json({
        ok: false,
        message:
          'Certification created but intent status update failed',
        error: updateError.message,
        intent_id: intent.id,
        certification_id: certification.id
      });
    }

    return res.status(200).json({
      ok: true,
      message: 'Intent processed successfully.',
      intent_id: intent.id,
      certification_id: certification.id,
      intent_hash: intentHash
    });

  } catch (err) {
    console.error('api/worker handler error:', err);

    return res.status(500).json({
      ok: false,
      message: err.message || 'Worker internal error'
    });
  }
}
