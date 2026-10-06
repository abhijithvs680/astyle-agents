/**
 * Application configuration.
 *
 * Only non-secret values belong here. The API base URL and the session secret
 * live in the server environment — see `src/api/env.server.ts` and `.env.example`.
 */

/**
 * Every backend endpoint the app talks to, keyed by a readable name.
 *
 * Values are platform workflow ids; the server resolves them against
 * `API_BASE_URL` (see `src/api/client.server.ts`). Add new endpoints here rather than
 * inlining ids at call sites.
 */
export const API_ENDPOINTS = {
  /**
   * Validates a landing-page token.
   * POST `{ token }` — unauthenticated; this call is what mints the session.
   * Responds with an envelope whose `Value` is `"True"` when the token is good.
   */
  validateToken: "astylev2jwtvalidator6ac4d2d95be99",

  /**
   * Landing-page bootstrap: session history and anything else the dashboard
   * needs on first paint. POST `{ email }`, authenticated with the bearer token.
   */
  getInitialData: "astylev2getinitialdata6ac4d661ebe49",

  /**
   * Deep Insights run: plans and orchestrates the specialist agents.
   * POST the analysis payload; the result arrives over the socket, not in the
   * HTTP response (this call routinely times out — that is expected).
   */
  agentOrchestration: "astylev2agentorchestration6abe0f0f6f184",

  /**
   * Chat Mode run: single-turn conversational answer.
   * Same fire-and-forget contract as `agentOrchestration`.
   */
  chatModeAgent: "astylev2chatmodeagent6ac5023d207e4",
} as const;

export type ApiEndpointName = keyof typeof API_ENDPOINTS;

/** Query-string parameter that carries the token onto the landing page. */
export const TOKEN_SEARCH_PARAM = "token";

/** Name of the encrypted session cookie. */
export const SESSION_COOKIE_NAME = "astyle_session";

/** How long a session stays valid, in seconds. */
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;
