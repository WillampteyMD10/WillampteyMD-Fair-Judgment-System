// Reference the 'supabase-core' alias mapped in your index.html
import { createClient } from "supabase-core";

// Replace these placeholders with your actual project credentials from your Supabase dashboard
const supabaseUrl = 'https://supabase.co';
const supabaseKey = 'your-anon-public-api-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
