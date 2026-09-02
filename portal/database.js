// portal/database.js
const SUPABASE_URL = "https://cbqkkipipssgplwbuqrm.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNicWtraXBpcHNzZ3Bsd2J1cXJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwOTA3NjEsImV4cCI6MjEwMTY2Njc2MX0.b4coHxXwK9L8XIq6moXH4GNcSb2uk6eeKE7hPO2Ra-M"; // Keep your actual long key here!

let supabaseClient = null;

// ADDED EXPORT HERE so the dashboard page can access this function
export function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;

  const supabaseInstance = window.supabase || (typeof supabase !== 'undefined' ? supabase : null);

  if (supabaseInstance && supabaseInstance.createClient) {
    supabaseClient = supabaseInstance.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return supabaseClient;
  }
  
  return null;
}

/**
 * Encapsulates the network payload pipeline pushing student inputs to the database
 * ADDED EXPORT HERE to make sure the form submission runs perfectly
 */
export async function commitStudentGenesisToCloud(studentId, projectTitle, genesisSparkText) {
  const activeClient = getSupabaseClient();
  
  if (!activeClient) {
    return { success: false, error: "Database engine cluster offline. Retrying connection..." };
  }

  try {
    const { data, error } = await activeClient
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
