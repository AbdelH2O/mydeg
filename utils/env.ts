import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_MSAL_AUTHORITY: z.string().url(),
    NEXT_PUBLIC_MSAL_CLIENT_ID: z.string().uuid(),
    NEXT_PUBLIC_MSAL_REDIRECT_URI: z.string().url(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_MSAL_AUTHORITY: process.env.NEXT_PUBLIC_MSAL_AUTHORITY,
    NEXT_PUBLIC_MSAL_CLIENT_ID: process.env.NEXT_PUBLIC_MSAL_CLIENT_ID,
    NEXT_PUBLIC_MSAL_REDIRECT_URI:
      process.env.NEXT_PUBLIC_MSAL_REDIRECT_URI,
  },
});