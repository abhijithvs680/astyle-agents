/**
 * Creates the specialist agents a user approved on the plan card.
 *
 * Unlike the run endpoints this one is awaited: the report cannot be started
 * until each agent exists and has an id, because the id is what the report
 * workflow is given. One call per agent, sequentially — the platform mints the
 * ids, and firing them together would race.
 */
import { createServerFn } from "@tanstack/react-start";

import { postAuthenticated } from "./client.server";
import type { CreateAgentsInput, CreatedAgent } from "./types";

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Pull the new agent's id out of the creation response, which looks like:
 *
 * ```json
 * [{ "title": "Shopify Sales Performance Tracker", "agent_id": "17",
 *    "jsCodes": [], "workflow_log_id": 81058893 }]
 * ```
 *
 * `agent_id` is a stringified number. The two aliases are kept because the
 * platform is inconsistent about casing across workflows; anything else is
 * treated as a failure rather than guessed at.
 */
function extractAgentId(response: unknown): string {
  const rows = Array.isArray(response) ? response : [response];

  for (const row of rows) {
    if (!isRecord(row)) continue;

    for (const key of ["agent_id", "AgentID", "agentId"]) {
      const value = row[key];
      if (typeof value === "string" && value.trim() !== "") return value.trim();
      if (typeof value === "number" && Number.isFinite(value)) return String(value);
    }
  }

  return "";
}

/** The response echoes the title back; prefer it over what we sent. */
function extractTitle(response: unknown, fallback: string): string {
  const rows = Array.isArray(response) ? response : [response];

  for (const row of rows) {
    if (isRecord(row) && str(row["title"]) !== "") return str(row["title"]);
  }

  return fallback;
}

export const createAgents = createServerFn({ method: "POST" })
  .validator((input: CreateAgentsInput) => {
    const agents = (Array.isArray(input?.agents) ? input.agents : [])
      .filter(isRecord)
      .map((agent) => ({
        // Carried through untouched so the caller can match the result back to
        // the suggestion it came from, and keep the edited runtime prompt.
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
  .handler(async ({ data }): Promise<Array<CreatedAgent>> => {
    const created: Array<CreatedAgent> = [];

    for (const agent of data.agents) {
      const response = await postAuthenticated("agentCreation", {
        title: agent.title,
        category: agent.category,
        description: agent.description,
      });

      const id = extractAgentId(response);
      if (id === "") {
        // No `agent_id` means the agent was not created. Starting the report
        // anyway would quietly drop an agent the user explicitly approved.
        console.error("[agents] creation returned no agent_id", { title: agent.title, response });
        throw new Error(`"${agent.title}" could not be created.`);
      }

      created.push({
        id,
        suggestionId: agent.suggestionId,
        name: extractTitle(response, agent.title),
        role: agent.category,
        description: agent.description,
      });
    }

    return created;
  });
