/**
 * Minimal JWT payload reader.
 *
 * Server-only. This does NOT verify the signature — it just reads claims out of
 * a token the backend already accepted. Never use it to decide access; the
 * handshake in `auth.ts` is what establishes trust.
 */

export type TokenClaims = {
  email?: string;
  uid?: string;
  fname?: string;
  domain?: string;
  exp?: number;
};

export function decodeTokenClaims(token: string): TokenClaims | undefined {
  const payload = token.split(".")[1];
  if (payload === undefined) return undefined;

  try {
    const json = Buffer.from(payload, "base64url").toString("utf8");
    const claims: unknown = JSON.parse(json);
    return typeof claims === "object" && claims !== null ? (claims as TokenClaims) : undefined;
  } catch {
    return undefined;
  }
}
