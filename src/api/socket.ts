/**
 * Credentials for the browser's Socket.IO connection to the platform chat
 * system (v1, `receiver-chatsystem`).
 *
 * The token lives in an httpOnly cookie, which JavaScript cannot read — but a
 * browser socket must present it in the handshake. This server function is the
 * controlled hand-off: the authenticated client asks for it over RPC and keeps
 * it in memory for the lifetime of the connection. It is never written to
 * localStorage and never rendered into the page HTML.
 */
import { createServerFn } from "@tanstack/react-start";

import { getSocketHandshakeToken, getSocketTenantId, getSocketUrl } from "./env.server";
import { decodeTokenClaims } from "./jwt.server";
import { requireSessionToken } from "./session.server";
import type { SocketCredentials } from "./types";

export const getSocketCredentials = createServerFn({ method: "POST" }).handler(
  async (): Promise<SocketCredentials> => {
    const token = await requireSessionToken();
    const claims = decodeTokenClaims(token);

    if (claims?.email === undefined) {
      throw new Error("Session token carries no email claim.");
    }

    const tenantId = getSocketTenantId();

    return {
      url: getSocketUrl(),
      handshakeToken: getSocketHandshakeToken(),
      authToken: token,
      user: {
        email: claims.email,
        username: claims.fname ?? claims.email,
        id: claims.uid ?? "",
      },
      ...(tenantId !== undefined ? { tenantId } : {}),
    };
  },
);
