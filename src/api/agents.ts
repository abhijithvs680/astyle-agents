/**
 * Dispatches creation of specialist agents approved on the plan card.
 *
 * Fire-and-forget: each created agent is emitted over the chat socket as a
 * `new_message` event with `type: "agent_stream"`, so this returns immediately
 * without blocking on HTTP responses. This completely eliminates HTTP timeouts.
 */
import { createServerFn } from "@tanstack/react-start";

import { dispatchAuthenticated } from "./client.server";
import type { CreateAgentsInput, CreateAgentsResult } from "./types";

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export const createAgents = createServerFn({ method: "POST" })
  .validator((input: CreateAgentsInput) => {
    const agents = (Array.isArray(input?.agents) ? input.agents : [])
      .filter(isRecord)
      .map((agent) => ({
        suggestionId: str(agent["suggestionId"]),
        title: str(agent["title"]),
        category: str(agent["category"]),
        description: str(agent["description"]),
      }))
      .filter((agent) => agent.title !== "");

    if (agents.length === 0) {
      throw new Error("At least one agent is required.");
    }

    return { agents };
  })
  .handler(async ({ data }): Promise<CreateAgentsResult> => {
    for (const agent of data.agents) {
      await dispatchAuthenticated("agentCreation", {
        title: agent.title,
        category: agent.category,
        description: agent.description,
      });
    }

    return { accepted: true, dispatchedCount: data.agents.length };
  });

