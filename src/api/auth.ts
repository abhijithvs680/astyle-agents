/**
 * Landing-page token handshake.
 *
 * The app is opened as `/?token=<token>`. The server validates that token
 * against the backend and, on success, seals it into a session cookie. Anything
 * else lands the visitor on the invalid-configuration page.
 */
import { createServerFn } from "@tanstack/react-start";

import { isAffirmative, postUnauthenticated } from "./client.server";
import { ConfigurationError } from "./env.server";
import { clearAppSession, createAppSession, getSessionToken } from "./session.server";
import type { SessionState } from "./types";

/**
 * Validate `token` and establish a session for it.
 *
 * Called from the landing-page loader, so it runs on the server during SSR and
 * on navigation. Returns a result rather than throwing — the route renders the
 * invalid-configuration page from it.
 */
export const establishSession = createServerFn({ method: "POST" })
  .validator((input: { token?: string | undefined }) => ({
    token: typeof input?.token === "string" ? input.token.trim() : "",
  }))
  .handler(async ({ data }): Promise<SessionState> => {
    const { token } = data;

    try {
      if (token === "") {
        // No token in the URL. A session from an earlier visit still counts, so
        // a refresh or an in-app navigation doesn't bounce the user out.
        const existing = await getSessionToken();
        return existing === undefined
          ? { status: "invalid", reason: "missing-token" }
          : { status: "authenticated" };
      }

      // Already validated this exact token — don't spend a round trip on it.
      if ((await getSessionToken()) === token) {
        return { status: "authenticated" };
      }

      const response = await postUnauthenticated("validateToken", { token });

      if (!isAffirmative(response)) {
        await clearAppSession();
        return { status: "invalid", reason: "rejected" };
      }

      await createAppSession(token);
      return { status: "authenticated" };
    } catch (error) {
      console.error("[auth] token handshake failed", error);
      return {
        status: "invalid",
        reason: error instanceof ConfigurationError ? "configuration" : "unreachable",
      };
    }
  });
