/**
 * Kicks off an analysis run.
 *
 * Both modes are fire-and-forget: the workflow answers over the chat socket,
 * so this returns as soon as the request is dispatched. A timeout or an error
 * from the workflow endpoint is expected and says nothing about the run.
 */
import { createServerFn } from "@tanstack/react-start";

import { dispatchAuthenticated } from "./client.server";
import { decodeTokenClaims } from "./jwt.server";
import { requireSessionToken } from "./session.server";
import type { AnalysisMode, StartAnalysisResult } from "./types";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type StartAnalysisInput = {
  mode?: string | undefined;
  prompt?: string | undefined;
  sessionId?: string | undefined;
  newSession?: boolean | undefined;
};

export const startAnalysis = createServerFn({ method: "POST" })
  .validator((input: StartAnalysisInput) => {
    const prompt = typeof input?.prompt === "string" ? input.prompt.trim() : "";
    if (prompt === "") {
      throw new Error("A prompt is required.");
    }

    const sessionId = typeof input?.sessionId === "string" ? input.sessionId : "";
    if (!UUID_PATTERN.test(sessionId)) {
      throw new Error("sessionId must be a UUID.");
    }

    const mode: AnalysisMode = input?.mode === "chat" ? "chat" : "deep-insights";

    return { mode, prompt, sessionId, newSession: input?.newSession === true };
  })
  .handler(async ({ data }): Promise<StartAnalysisResult> => {
    const token = await requireSessionToken();
    const claims = decodeTokenClaims(token);

    if (claims?.email === undefined) {
      throw new Error("Session token carries no email claim.");
    }

    const endpoint = data.mode === "chat" ? "chatModeAgent" : "agentOrchestration";

    await dispatchAuthenticated(endpoint, {
      session_id: data.sessionId,
      new_session: data.newSession,
      prompt: data.prompt,
      mode: data.mode,
      // Identity is taken from the token, never from the client, so a caller
      // cannot run an analysis as somebody else.
      email: claims.email,
      uid: claims.uid ?? "",
    });

    return { accepted: true, sessionId: data.sessionId, mode: data.mode };
  });
