// import sup as supabase from "../utils/supabaseClient"
import { useMsal } from "@azure/msal-react"
import { createClient } from "@supabase/supabase-js";
import { Database } from "../Database";

const useSupabase = () => {
    const { instance } = useMsal();
    const account = instance.getActiveAccount();

    const supabase = createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mzwtsbcsknililupdwfa.supabase.co",
        // Anon key:
        process.env.NEXT_PUBLIC_SUPABASE_ANON || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16d3RzYmNza25pbGlsdXBkd2ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njg0NDc5OTAsImV4cCI6MTk4NDAyMzk5MH0.mq0-y5QjL2xwxsnCs8fpK7r7CC3dcnHGYl5_vSWk0KI"
    );

    if(!account) {
        return {supabase};
    }

    const token = account.idToken;
    console.log(token);
    
    supabase.auth.setSession({ access_token: token ? token : "", refresh_token: ""});

    return {supabase};
}

export default useSupabase;