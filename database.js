// portal/database.js
// Crucial: Replace the placeholder strings below with your exact Supabase credentials locally,
// or configure them as Environment Variables inside your Vercel Dashboard for absolute security.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "YOUR_SUPABASE_URL_HERE";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY_HERE";

// Initialize the secure Supabase client framework
let supabaseClient = null;

if (typeof supabase !== 'undefined') {
  // If loading via browser CDN script tag
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  console.warn("Supabase CDN script library not yet initialized in the document header.");
}

/**
 * Commits a student's verified original asset baseline safely into the isolated cloud database ledger.
 */
async function commitStudentGenesisToCloud(studentId, projectTitle, genesisSparkText) {
  if (!supabaseClient) {
    return { success: false, error: "Database engine connection offline." };
  }

  try {
    const { data, error } = await supabaseClient
      .from('student_genesis_ledger') // This matches your isolated target table name
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
    console.error("Database Transaction Exception:", error.message);
    return { success: false, error: error.message };
  }
}
