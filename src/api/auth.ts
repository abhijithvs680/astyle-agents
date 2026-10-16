/**
 * Landing-page token handshake.
 *
 * The app is opened as `/?token=<token>`. The server validates that token
 * against the backend and, on success, seals it into a session cookie. A missing
 * or rejected token sends the visitor to the platform sign-in page; anything
 * else lands them on the invalid-configuration page.
 */
import { createServerFn } from "@tanstack/react-start";

import { isAffirmative, postUnauthenticated } from "./client.server";
import { ConfigurationError, getSignInUrl } from "./env.server";
import { decodeTokenClaims } from "./jwt.server";
import { clearAppSession, createAppSession, getSessionToken } from "./session.server";
import type { CurrentUser, SessionState } from "./types";

/** Display identity from the token's claims, falling back to the email. */
function userFromToken(token: string): CurrentUser {
  const claims = decodeTokenClaims(token);
  const email = claims?.email?.trim() ?? "";
  const fullName = [claims?.fname, claims?.lname]
    .map((part) => part?.trim() ?? "")
    .filter((part) => part !== "")
    .join(" ");
  return { name: fullName || email.split("@")[0] || "User", email };
}

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
          ? { status: "invalid", reason: "missing-token", signInUrl: getSignInUrl() }
          : { status: "authenticated", user: userFromToken(existing) };
      }

      // Already validated this exact token — don't spend a round trip on it.
      if ((await getSessionToken()) === token) {
        return { status: "authenticated", user: userFromToken(token) };
      }

      const response = await postUnauthenticated("validateToken", { token });

      if (!isAffirmative(response)) {
        await clearAppSession();
        return { status: "invalid", reason: "rejected", signInUrl: getSignInUrl() };
      }

      await createAppSession(token);
      return { status: "authenticated", user: userFromToken(token) };
    } catch (error) {
      console.error("[auth] token handshake failed", error);
      return {
        status: "invalid",
        reason: error instanceof ConfigurationError ? "configuration" : "unreachable",
      };
    }
  });
