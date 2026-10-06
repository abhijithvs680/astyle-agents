/**
 * Server-only environment access.
 *
 * Never import this from a component or a route's `component` — these values
 * must not reach the client bundle.
 */

/** Thrown when the server itself is misconfigured, as opposed to a bad token. */
export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigurationError";
  }
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined || value.trim() === "") {
    throw new ConfigurationError(
      `Missing required server environment variable ${name}. Add it to .env — see .env.example.`,
    );
  }
  return value.trim();
}

/** Hostname shipped in .env.example — reaching it means nobody set a real one. */
const PLACEHOLDER_HOST = "your-api-host.example.com";

/** Base URL every endpoint id is appended to, without a trailing slash. */
export function getApiBaseUrl(): string {
  const raw = requireEnv("API_BASE_URL").replace(/\/+$/, "");

  if (raw.includes(PLACEHOLDER_HOST)) {
    throw new ConfigurationError(
      `API_BASE_URL is still the placeholder from .env.example (${PLACEHOLDER_HOST}). ` +
        `Set it to the real API host and restart the dev server.`,
    );
  }

  return raw;
}

/** Password used to seal the session cookie. */
export function getSessionSecret(): string {
  const secret = requireEnv("SESSION_SECRET");
  if (secret.length < 32) {
    throw new ConfigurationError("SESSION_SECRET must be at least 32 characters long.");
  }
  return secret;
}

/**
 * Socket.IO endpoint for the platform chat system (v1, `receiver-chatsystem`).
 * Not a secret — it reaches the browser, which holds the connection.
 */
export function getSocketUrl(): string {
  return requireEnv("SOCKET_URL").replace(/\/+$/, "");
}

/**
 * Token for the Socket.IO *handshake* only.
 *
 * v1 (`receiver-chatsystem`) verifies this against a single shared JWT_SECRET
 * baked into its config — it is a gate proving a legitimate client, not the
 * user's identity. A tenant-signed user JWT fails it with "invalid signature".
 * The real user is declared afterwards via the `vizru_user` event.
 */
export function getSocketHandshakeToken(): string {
  return requireEnv("SOCKET_HANDSHAKE_TOKEN");
}

/**
 * Optional tenant id for the `vizru_user` handshake.
 *
 * Only affects tenant-wide features: joining the `{tid}general` room and the
 * `get_active_userlist` presence roster. Per-user messages arrive via the
 * `{uid}user` room regardless, so this stays optional.
 */
export function getSocketTenantId(): string | undefined {
  const value = process.env["SOCKET_TENANT_ID"];
  return value === undefined || value.trim() === "" ? undefined : value.trim();
}

export function isProduction(): boolean {
  return process.env["NODE_ENV"] === "production";
}
