/**
 * Encrypted-cookie session holding the token the landing page was opened with.
 *
 * Server-only. The token never reaches the client: the browser gets an opaque,
 * sealed, httpOnly cookie and every authenticated call is made from the server.
 */
// Aliased: this is a TanStack Start server utility, not a React hook, and the
// `use` prefix otherwise trips react-hooks/rules-of-hooks.
import { useSession as openStartSession } from "@tanstack/react-start/server";

import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "../config";
import { getSessionSecret, isProduction } from "./env.server";

export type AppSessionData = {
  /** Bearer token for all downstream API calls. */
  token: string;
  /** Epoch ms the session was minted. */
  createdAt: number;
};

/** Thrown when an authenticated call is attempted without a session. */
export class MissingSessionError extends Error {
  constructor() {
    super("No active session. The app must be opened with a valid token.");
    this.name = "MissingSessionError";
  }
}

function sessionConfig() {
  return {
    name: SESSION_COOKIE_NAME,
    password: getSessionSecret(),
    maxAge: SESSION_MAX_AGE_SECONDS,
    cookie: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: isProduction(),
      path: "/",
    },
  };
}

export function getAppSession() {
  return openStartSession<AppSessionData>(sessionConfig());
}

/** Replace whatever session exists with one bound to `token`. */
export async function createAppSession(token: string): Promise<void> {
  const session = await getAppSession();
  await session.update({ token, createdAt: Date.now() });
}

export async function clearAppSession(): Promise<void> {
  const session = await getAppSession();
  await session.clear();
}

/** The current session's token, or `undefined` when there is no session. */
export async function getSessionToken(): Promise<string | undefined> {
  const session = await getAppSession();
  return session.data.token;
}

/** The current session's token, throwing when the caller has no session. */
export async function requireSessionToken(): Promise<string> {
  const token = await getSessionToken();
  if (token === undefined || token === "") {
    throw new MissingSessionError();
  }
  return token;
}
