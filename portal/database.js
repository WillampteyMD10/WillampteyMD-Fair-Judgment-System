// portal/database.js
// Vercel auto-injects variables here if declared in project settings. Place dynamic production fallbacks below.
const SUPABASE_URL = "https://supabase.co"; 
const SUPABASE_ANON_KEY = "your-actual-anon-public-key-string";

let supabaseClient = null;

if (typeof supabase !== 'undefined') {
  // Gracefully binds to the CDN library loaded within the dashboard layout head segment
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  console.error("Supabase infrastructure layer failed to initialize dynamically.");
}

/**
 * Encapsulates the network payload pipeline pushing student inputs to the database
 */
async function commitStudentGenesisToCloud(studentId, projectTitle, genesisSparkText) {
  if (!supabaseClient) {
    return { success: false, error: "Database engine cluster offline." };
  }

  try {
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
    return { success: true, data };
  } catch (error) {
    console.error("Database connection transactional failure:", error.message);
    return { success: false, error: error.message };
  }
}
