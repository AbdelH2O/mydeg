import { httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import type { AppRouter } from "../server/routers/_app";
import { env } from "./env";

function getBaseUrl() {
	if (typeof window !== "undefined")
		// browser should use relative path
		return "";

	if (env.VERCEL_URL)
		// reference for vercel.com
		return `https://${env.VERCEL_URL}`;

	if (env.RENDER_INTERNAL_HOSTNAME) {
		const port = env.PORT ? `:${env.PORT}` : "";
		// reference for render.com
		return `http://${env.RENDER_INTERNAL_HOSTNAME}${port}`;
	}

	// assume localhost
	return `http://localhost:${env.PORT ?? 3000}`;
}

export const trpc = createTRPCNext<AppRouter>({
	config({ ctx }) {
		return {
			links: [
				httpBatchLink({
					/**
					 * If you want to use SSR, you need to use the server's full URL
					 * @link https://trpc.io/docs/ssr
					 **/
					url: `${getBaseUrl()}/api/trpc`,
				}),
			],
			/**
			 * @link https://tanstack.com/query/v4/docs/reference/QueryClient
			 **/
			// queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
		};
	},
	/**
	 * @link https://trpc.io/docs/ssr
	 **/
	ssr: false,
});
