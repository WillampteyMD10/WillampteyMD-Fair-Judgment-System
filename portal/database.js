// portal/database.js
const SUPABASE_URL = "https://cbqkkipipssgplwbuqrm.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNicWtraXBpcHNzZ3Bsd2J1cXJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwOTA3NjEsImV4cCI6MjEwMTY2Njc2MX0.b4coHxXwK9L8XIq6moXH4GNcSb2uk6eeKE7hPO2Ra-M"; 

let supabaseClient = null;

// Self-initializing connection loop that attaches directly to the global window environment
function initializeDatabase() {
  if (supabaseClient) return supabaseClient;

  // Search through all possible browser layers for the Supabase bundle
  const supabaseInstance = window.supabase || (typeof supabase !== 'undefined' ? supabase : null);

  if (supabaseInstance && supabaseInstance.createClient) {
    try {
      supabaseClient = supabaseInstance.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      console.log("Supabase core layer established successfully.");
      return supabaseClient;
    } catch (err) {
      console.error("Failed to construct client instance:", err.message);
    }
  }
  return null;
}

// Automatically execute on load to populate the window immediately
initializeDatabase();

/**
 * Global submission entry point that bypasses framework import limitations
 */
window.commitStudentGenesisToCloud = async function(studentId, projectTitle, genesisSparkText) {
  // Ensure the client instance is awake and connected right when the button is pressed
  const client = initializeDatabase();
  
   // 1. Call your function live to establish the client dynamic variable
  const activeClient = initializeDatabase();

  // 2. Update the check to use the freshly initialized connection
  if (!activeClient) {
    return { success: false, error: "Database engine cluster offline. Retrying connection..." };
  }

  try {
    // 3. Use activeClient to execute the transaction safely
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
};
// ✅ Add this line at the absolute bottom of database.js to bridge the naming gap
window.saveGenesisLedger = window.commitStudentGenesisToCloud;
