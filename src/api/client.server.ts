/**
 * Server-side API client. Every backend call in the app goes through here so
 * the bearer token stays on the server.
 */
import { API_ENDPOINTS, type ApiEndpointName } from "../config";
import { getApiBaseUrl } from "./env.server";
import { requireSessionToken } from "./session.server";

/**
 * The platform answers with an array of envelopes rather than a bare payload:
 *
 * ```json
 * [{ "Status": "[200,\"OK\"]", "Body": "Hello there, Fella!", "Value": "True", ... }]
 * ```
 */
export type ApiEnvelope = {
  Echo?: unknown;
  Status?: string | null;
  Time?: string | null;
  Errors?: unknown;
  Body?: unknown;
  Value?: string | null;
  jsCodes?: Array<unknown>;
  workflow_log_id?: number | null;
};

export type ApiResponse = Array<ApiEnvelope>;

export class ApiError extends Error {
  readonly status: number;
  readonly endpoint: ApiEndpointName;

  constructor(endpoint: ApiEndpointName, status: number, message: string) {
    super(`API call "${endpoint}" failed (${status}): ${message}`);
    this.name = "ApiError";
    this.status = status;
    this.endpoint = endpoint;
  }
}

function endpointUrl(endpoint: ApiEndpointName): string {
  return `${getApiBaseUrl()}/${API_ENDPOINTS[endpoint]}`;
}

async function post(
  endpoint: ApiEndpointName,
  body: Record<string, unknown>,
  headers: Record<string, string>,
): Promise<ApiResponse> {
  const response = await fetch(endpointUrl(endpoint), {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json", ...headers },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new ApiError(endpoint, response.status, await response.text().catch(() => ""));
  }

  const payload: unknown = await response.json();
  return Array.isArray(payload) ? (payload as ApiResponse) : [payload as ApiEnvelope];
}

/**
 * POST without a bearer token. Only the token handshake uses this — it runs
 * before a session exists, and sends the token in the body instead.
 */
export function postUnauthenticated(
  endpoint: ApiEndpointName,
  body: Record<string, unknown>,
): Promise<ApiResponse> {
  return post(endpoint, body, {});
}

/**
 * POST authenticated with the session token as a bearer credential. This is the
 * entry point for every feature call made after the landing-page handshake.
 */
export async function postAuthenticated(
  endpoint: ApiEndpointName,
  body: Record<string, unknown> = {},
): Promise<ApiResponse> {
  const token = await requireSessionToken();
  return post(endpoint, body, { authorization: `Bearer ${token}` });
}

/** The platform signals success with the string `"True"` in `Value`. */
export function isAffirmative(response: ApiResponse): boolean {
  const value = response[0]?.Value;
  return typeof value === "string" && value.trim().toLowerCase() === "true";
}

/**
 * Timeout for dispatched workflow runs. Long-running agent workflows routinely
 * exceed any sane HTTP timeout — the answer comes back over the socket — so
 * this only exists to stop sockets accumulating forever.
 */
const DISPATCH_TIMEOUT_MS = 120_000;

/**
 * Send a request and *do not* wait for the answer.
 *
 * The agent workflows reply over the chat socket, not in the HTTP response, so
 * a timeout or an error here says nothing about whether the run succeeded. The
 * outcome is logged and then dropped; the caller returns to the UI immediately
 * so the loader can start.
 */
export async function dispatchAuthenticated(
  endpoint: ApiEndpointName,
  body: Record<string, unknown>,
): Promise<void> {
  const token = await requireSessionToken();
  const url = endpointUrl(endpoint);

  // Logged at send time: a fire-and-forget run leaves no other trace that it
  // was actually sent, and the socket reply arrives out of band.
  console.log(`[dispatch] -> ${endpoint}`);

  const run = fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(DISPATCH_TIMEOUT_MS),
  });

  // Never rejects: an unhandled rejection here would take down the process,
  // and by design nobody is waiting for this result.
  void run
    .then((response) => {
      if (!response.ok) {
        console.warn(`[dispatch] ${endpoint} answered ${response.status} (ignored)`);
      }
      // Drain the body so the connection can be released.
      return response.text().catch(() => "");
    })
    .catch((error: unknown) => {
      const reason = error instanceof Error ? error.name : String(error);
      console.warn(
        `[dispatch] ${endpoint} did not complete: ${reason} (expected — reply via socket)`,
      );
    });
}
