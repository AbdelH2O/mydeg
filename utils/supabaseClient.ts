import { SupabaseClient } from "@supabase/supabase-js";

const supabase = new SupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mzwtsbcsknililupdwfa.supabase.co",
    // Anon key:
    process.env.NEXT_PUBLIC_SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16d3RzYmNza25pbGlsdXBkd2ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njg0NDc5OTAsImV4cCI6MTk4NDAyMzk5MH0.mq0-y5QjL2xwxsnCs8fpK7r7CC3dcnHGYl5_vSWk0KI"
);

export default supabase;