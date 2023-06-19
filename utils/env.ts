import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		VERCEL_URL: z.string().url().optional(),
    RENDER_INTERNAL_HOSTNAME: z.string().url().optional(),
    PORT: z.number().max(2**16).optional(),

	},

	client: {
		NEXT_PUBLIC_MSAL_AUTHORITY: z.string().url(),
		NEXT_PUBLIC_MSAL_CLIENT_ID: z.string().uuid(),
		NEXT_PUBLIC_MSAL_REDIRECT_URI: z.string().url(),
		NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
		NEXT_PUBLIC_SUPABASE_ANON: z.string(),
	},
	runtimeEnv: {
		VERCEL_URL: process.env.VERCEL_URL,
    RENDER_INTERNAL_HOSTNAME: process.env.RENDER_INTERNAL_HOSTNAME,
    PORT: process.env.PORT,

		NEXT_PUBLIC_MSAL_AUTHORITY: process.env.NEXT_PUBLIC_MSAL_AUTHORITY,
		NEXT_PUBLIC_MSAL_CLIENT_ID: process.env.NEXT_PUBLIC_MSAL_CLIENT_ID,
		NEXT_PUBLIC_MSAL_REDIRECT_URI:
			process.env.NEXT_PUBLIC_MSAL_REDIRECT_URI,
		NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
		NEXT_PUBLIC_SUPABASE_ANON: process.env.NEXT_PUBLIC_SUPABASE_ANON,
	},
});
