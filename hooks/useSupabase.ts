// import sup as supabase from "../utils/supabaseClient"
import { useMsal } from "@azure/msal-react";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../Database";
import { env } from "../utils/env";

const useSupabase = () => {
	const { instance } = useMsal();
	const account = instance.getActiveAccount();

	const supabase = createClient<Database>(
		env.NEXT_PUBLIC_SUPABASE_URL,
		// Anon key:
		env.NEXT_PUBLIC_SUPABASE_ANON
	);

	if (!account) {
		return { supabase };
	}

	const token = account.idToken;
	// console.log(token);

	supabase.auth.setSession({
		access_token: token ? token : "",
		refresh_token: "",
	});

	return { supabase };
};

export default useSupabase;
