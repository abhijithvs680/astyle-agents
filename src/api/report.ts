/**
 * Runs the report a user approved on the plan card.
 *
 * Fire-and-forget, like `startAnalysis`: the workflow answers over the chat
 * socket, so a timeout here says nothing about the run.
 *
 * What is sent is the plan *as displayed* — only the agents left switched on,
 * carrying whatever edits the user made to the runtime prompts. The agent that
 * proposed the plan does not get to decide what actually runs.
 *
 * Approved suggestions do not appear separately: they are created first (see
 * `agents.ts`) and arrive here as ordinary catalog agents.
 */
import { createServerFn } from "@tanstack/react-start";

import { dispatchAuthenticated } from "./client.server";
import { decodeTokenClaims } from "./jwt.server";
import { requireSessionToken } from "./session.server";
import type { ContinueReportInput, ContinueReportResult } from "./types";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function list(value: unknown): Array<Record<string, unknown>> {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is Record<string, unknown> =>
      typeof item === "object" && item !== null && !Array.isArray(item),
  );
}

/** Drops keys whose value is empty, so the workflow never sees `"field": ""`. */
function compact(record: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(record).filter(([, value]) => value !== ""));
}

export const continueReport = createServerFn({ method: "POST" })
  .validator((input: ContinueReportInput) => {
    const sessionId = str(input?.sessionId);
    if (!UUID_PATTERN.test(sessionId)) {
      throw new Error("sessionId must be a UUID.");
    }

    // The workflow runs one specific plan, identified by the row it was stored
    // as. Without it there is nothing to attach the report to.
    const conversationId = str(input?.conversationId);
    if (conversationId === "") {
      throw new Error("conversationId is required to continue a plan.");
    }

    const agents = list(input?.agents).map((agent) => ({
      id: str(agent["id"]),
      name: str(agent["name"]),
      role: str(agent["role"]),
      runtime_prompt: str(agent["runtimePrompt"]),
    }));

    // Nothing would run, and the workflow would have to guess what the user
    // meant. Better to fail here than to start an empty report.
    if (agents.length === 0) {
      throw new Error("At least one agent must be selected.");
    }

    return {
      sessionId,
      conversationId,
      prompt: str(input?.prompt),
      planTitle: str(input?.planTitle),
      planSummary: str(input?.planSummary),
      sessionTitle: str(input?.sessionTitle),
      customInstructions: str(input?.customInstructions),
      agents,
    };
  })
  .handler(async ({ data }): Promise<ContinueReportResult> => {
    const token = await requireSessionToken();
    const claims = decodeTokenClaims(token);

    if (claims?.email === undefined) {
      throw new Error("Session token carries no email claim.");
    }

    await dispatchAuthenticated("continueReport", {
      session_id: data.sessionId,
      conversation_id: data.conversationId,
      // The plan already opened this session; this is the turn that executes it.
      new_session: false,
      mode: "deep-insights",
      prompt: data.prompt,
      plan_title: data.planTitle,
      plan_summary: data.planSummary,
      session_title: data.sessionTitle,
      custom_instructions: data.customInstructions,
      // The approved roster. Agents the user created from a suggestion are in
      // here too — by this point they exist in the catalog like any other.
      agents: data.agents,
      // Identity comes from the token, never from the client, so a caller
      // cannot run a report as somebody else.
      email: claims.email,
      uid: claims.uid ?? "",
    });

    return { accepted: true, sessionId: data.sessionId };
  });
