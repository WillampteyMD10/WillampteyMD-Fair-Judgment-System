// portal/database.js

// These keys point to your secure environment variables inside Vercel's global hardware layer.
// Since you successfully configured them 2 days ago, Vercel automatically injects them here.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cbqkkipipssgplwbuqrm.supabase.co"; 
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNicWtraXBpcHNzZ3Bsd2J1cXJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwOTA3NjEsImV4cCI6MjEwMTY2Njc2MX0.b4coHxXwK9L8XIq6moXH4GNcSb2uk6eeKE7hPO2Ra-M";

let supabaseClient = null;

// Initialize connection using the public CDN library loaded by your dashboard layout header
if (typeof supabase !== 'undefined') {
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  console.error("CRITICAL: Supabase CDN cloud infrastructure layer failed to initialize dynamically.");
}

/**
 * Transmits the authenticated student submission payload straight to your Supabase ledger table.
 */
async function commitStudentGenesisToCloud(studentId, projectTitle, genesisSparkText) {
  if (!supabaseClient) {
    return { success: false, error: "Database engine cluster is currently offline." };
  }

  try {
    // Inserts the structured transaction row into your indexed database schema
    const { data, error } = await supabaseClient
      .from('student_genesis_ledger')
      .insert([
        { 
          student_id: studentId, 
          asset_title: projectTitle, 
          genesis_baseline: genesisSparkText,
          committed_at: new Date().toISOString()
        }
      ]);

    if (error) throw error;
    
    // Returns a clear success code to your portal/dashboard.html form handler
    return { success: true, data };
  } catch (error) {
    console.error("Database connection transactional failure:", error.message);
    return { success: false, error: error.message };
  }
}

















