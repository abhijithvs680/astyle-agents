/**
 * Starts the creation of one specialist agent the user approved on the plan
 * card.
 *
 * The creation workflow routinely outlives the HTTP timeout, so the response
 * is not waited for: the new agent's id arrives over the chat socket as an
 * `agent_created` event (see `lib/agent-created.ts`). The caller creates the
 * agents one at a time, waiting for each event before sending the next — the
 * platform mints the ids, and firing them together would race.
 */
import { createServerFn } from "@tanstack/react-start";

import { dispatchAuthenticated } from "./client.server";
import type { CreateAgentInput } from "./types";

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export const dispatchAgentCreation = createServerFn({ method: "POST" })
  .validator((input: CreateAgentInput) => {
    const agent = {
      title: str(input?.title),
      category: str(input?.category),
      description: str(input?.description),
    };

    if (agent.title === "") {
      throw new Error("An agent title is required.");
    }

    return agent;
  })
  .handler(async ({ data }): Promise<{ dispatched: true }> => {
    await dispatchAuthenticated("agentCreation", {
      title: data.title,
      category: data.category,
      description: data.description,
    });

    return { dispatched: true };
  });
