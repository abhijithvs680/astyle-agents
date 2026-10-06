/**
 * Types shared between the server handshake and the UI that renders its result.
 * Client-safe: no server-only imports.
 */

/** Why a visitor could not be let in. */
export type InvalidReason =
  /** No token in the URL and no session to fall back on. */
  | "missing-token"
  /** The backend answered, but said the token is not valid. */
  | "rejected"
  /** The server is missing API_BASE_URL or SESSION_SECRET. */
  | "configuration"
  /** The backend could not be reached or answered with an error. */
  | "unreachable";

export type SessionState =
  { status: "authenticated" } | { status: "invalid"; reason: InvalidReason };

/** A session row from `getInitialData`, normalised for the UI. */
export type SessionSummary = {
  id: string;
  title: string;
  model: string | null;
  source: string | null;
  /** Raw timestamps as the API returns them; may be empty/unparseable. */
  createdOn: string | null;
  updatedOn: string | null;
  archived: boolean;
};

/** What the browser needs to open its Socket.IO connection. */
export type SocketCredentials = {
  url: string;
  /**
   * Gate token for the handshake query, signed with the chat server's shared
   * secret. Not the user's identity.
   */
  handshakeToken: string;
  /**
   * The user's own JWT, sent in `vizru_user` as `auth_token`. The chat server
   * uses it as the bearer credential when it triggers workflows for this user.
   * Held in memory only — never persisted.
   */
  authToken: string;
  user: {
    email: string;
    username: string;
    id: string;
  };
  /** Omitted when SOCKET_TENANT_ID is unset; only tenant-wide features need it. */
  tenantId?: string;
};

/** Which agent pipeline a prompt is sent to. */
export type AnalysisMode = "deep-insights" | "chat";

/**
 * Acknowledgement that a run was dispatched. It does NOT mean the workflow
 * finished — the result arrives over the socket, keyed by `sessionId`.
 */
export type StartAnalysisResult = {
  accepted: true;
  sessionId: string;
  mode: AnalysisMode;
};
