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
  chatModeAgent: "astylev2chatmodeagent6ac5eb98f21d9",

  /**
   * Creates one specialist agent in the catalog. POST `{ title, category,
   * description }` — one call per agent. Called when the user approves a
   * suggested agent, before the report runs, and unlike the run endpoints this
   * one is awaited: its response carries the new agent's id.
   */
  agentCreation: "astylev2agentcreation6ac5f7eda6b6b",

  /**
   * Runs the report the user approved on the plan card. POST the approved
   * plan — only the agents, data sources and suggestions left switched on,
   * carrying whatever edits were made to their runtime prompts.
   * Same fire-and-forget contract as `agentOrchestration`.
   */
  continueReport: "astylev26ac5f949993d2",

  /**
   * Permanently deletes one session. POST `{ session_id }`, authenticated with
   * the bearer token. Unlike the run endpoints this one is awaited: the user
   * is told whether their session actually went.
   */
  deleteSession: "astylev2deletesession6ac5e242511ef",

  /**
   * Messages belonging to one session, loaded when the user opens it from the
   * sidebar. POST `{ session_id, email }`, authenticated with the bearer token.
   */
  getConversations: "astylev2getconversations6ac5d29d97733",

  /** Specialists shown in the Specialists view. POST `{}` with the session bearer token. */
  getCaseAgents: "astylev2getcaseagents6ac6a72e5c316",

  /** Stored conversations for one specialist. POST `{ agent_id }` with the session bearer token. */
  getSpecialistConversations: "astylev2getspecialistconversations6ac6bca40cb6e",

  /** Run the selected specialist; its agent ID is the chat session ID. */
  runSpecialist: "astylev2runspecialist6ac6c7430d14f",
} as const;

export type ApiEndpointName = keyof typeof API_ENDPOINTS;

/** Query-string parameter that carries the token onto the landing page. */
export const TOKEN_SEARCH_PARAM = "token";

/** Name of the encrypted session cookie. */
export const SESSION_COOKIE_NAME = "astyle_session";

/** How long a session stays valid, in seconds. */
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

/** Voice mode buttons are hidden until voice input is implemented. */
export const VOICE_MODE_ENABLED = false;
