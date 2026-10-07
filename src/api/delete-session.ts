/**
 * Deletes a session.
 *
 * Awaited rather than dispatched: this is destructive and irreversible, so the
 * user is told whether it actually happened instead of watching the row vanish
 * optimistically and reappear on the next load.
 */
import { createServerFn } from "@tanstack/react-start";

import { postAuthenticated } from "./client.server";
import { decodeTokenClaims } from "./jwt.server";
import { requireSessionToken } from "./session.server";

export const deleteSession = createServerFn({ method: "POST" })
  .validator((input: { sessionId?: string | undefined }) => {
    const sessionId = typeof input?.sessionId === "string" ? input.sessionId.trim() : "";
    if (sessionId === "") throw new Error("A sessionId is required.");
    return { sessionId };
  })
  .handler(async ({ data }): Promise<{ sessionId: string }> => {
    const token = await requireSessionToken();
    const email = decodeTokenClaims(token)?.email;
    if (email === undefined) throw new Error("Session token carries no email claim.");

    // `session_id`, never the history row id - those are different keys and the
    // row id would delete nothing.
    await postAuthenticated("deleteSession", { session_id: data.sessionId, email });

    return { sessionId: data.sessionId };
  });
