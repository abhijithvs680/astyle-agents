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

/** The signed-in user, read from the session token's claims. */
export type CurrentUser = {
  name: string;
  email: string;
};

export type SessionState =
  | { status: "authenticated"; user: CurrentUser }
  | { status: "invalid"; reason: InvalidReason };

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

/**
 * One stored turn in a session.
 *
 * A `deep_insight` turn keeps the plan as JSON rather than a parsed object so
 * this type stays serialisable across the server-function boundary; the client
 * maps it with `toReportPlan`.
 */
export type ConversationEntry = {
  id: string;
  role: "user" | "agent";
  /** Platform `CreatedOn`, verbatim — it is not always a sane date. */
  createdOn?: string;
} & (
  | { kind: "text"; text: string }
  | { kind: "chat"; title: string; response: string }
  | {
      kind: "report";
      /** The generated report, as stored. Kept a string so it crosses the
       *  server-function boundary unchanged. */
      reportJson: string;
    }
  | {
      kind: "plan";
      planJson: string;
      /** `ConversationID` of this row; the report workflow keys on it. */
      conversationId?: string;
      /**
       * Platform `ApprovedStatus`, lowercased. A trailing plan that is not yet
       * approved is still awaiting the user's decision, so it reopens for
       * editing instead of rendering as settled history.
       */
      approvedStatus: string;
      /** ApprovedData records the roster actually sent when Continue was pressed. */
      approvedData?: string;
      /**
       * Whether the card should print the prompt the plan echoes back. False
       * once the session also stores the user's own turn, so the question is
       * not shown twice.
       */
      showPrompt: boolean;
    }
);

export type ConversationsResult = {
  sessionId: string;
  entries: Array<ConversationEntry>;
};

/** What the plan card hands back when the user presses Continue. */
export type ContinueReportInput = {
  sessionId: string;
  /** The plan row being continued, so the workflow knows which one to run. */
  conversationId: string;
  prompt?: string | undefined;
  planTitle?: string | undefined;
  planSummary?: string | undefined;
  sessionTitle?: string | undefined;
  customInstructions?: string | undefined;
  /** Catalog agents left switched on, with any edits to their instructions. */
  agents: Array<{
    id: string;
    name: string;
    role?: string | undefined;
    runtimePrompt?: string | undefined;
  }>;
};

/** One approved suggestion, on its way to becoming a catalog agent. */
export type CreateAgentsInput = {
  agents: Array<{
    /** The suggestion this came from, so the caller can match the result back. */
    suggestionId: string;
    title: string;
    category: string;
    description: string;
  }>;
};

/** An agent that now exists in the catalog, with the id the platform minted. */
export type CreatedAgent = {
  id: string;
  suggestionId: string;
  name: string;
  role: string;
  description: string;
};

export type ContinueReportResult = { accepted: true; sessionId: string };
