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
    // 🌟 CORRECTED CORB PREVENTION LAYER: Retrieve the true database UUID cached during login
    let userUuid = localStorage.getItem('supabase_auth_user_uuid');

    // Fallback look up to network session if local memory was cleared
    if (!userUuid) {
        const { data: { user } } = await activeClient.auth.getUser();
        if (user) userUuid = user.id;
    }

    if (!userUuid || userUuid === 'undefined') {
        return { success: false, error: "Authentication session loading... Please try again in 1 second." };
    }

    // 🌟 MAP TO YOUR SECURE DASHBOARD TABLE
    const { data, error } = await activeClient
      .from('intents') // Maps cleanly to your established dashboard table schema
      .insert([
        { 
          user_id: userUuid,               // Passes the secure system identifier UUID string
          creator_name: studentId,         // Stores your visual profile name ("StU-01") safely
          project_title: projectTitle,     // Maps form input
          human_genesis: genesisSparkText, // Stores your Human Genesis outline parameters
          status: 'queued_for_worker_ai'
        }
      ]);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Database connection transactional failure:", error.message);
    return { success: false, error: error.message };
  }
};

// ✅ KEEP THIS AS THE ABSOLUTE BOTTOM: Bridges the naming gap perfectly
window.saveGenesisLedger = window.commitStudentGenesisToCloud;



