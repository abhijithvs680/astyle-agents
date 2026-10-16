/** The creation workflow announces each new agent over the chat socket. */
export const AGENT_CREATED_EVENT = "agent_created";

export type AgentCreatedEvent = {
  agentId: string;
  agentName: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function nonempty(value: unknown): string | null {
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

/**
 * Accepts either the socket callback payload or the event tuple shown in logs:
 *
 * ```json
 * ["agent_created", { "agent_name": "Excess Inventory & Valuation Analyst",
 *                     "agent_id": "126", "tag": "agent_created", ... }]
 * ```
 *
 * `agent_id` is a stringified number. Without it nothing was created, so the
 * event is treated as unreadable.
 */
export function parseAgentCreatedEvent(raw: unknown): AgentCreatedEvent | null {
  let payload = Array.isArray(raw) && raw[0] === AGENT_CREATED_EVENT ? raw[1] : raw;
  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload);
    } catch {
      return null;
    }
  }
  if (!isRecord(payload)) return null;

  const agentId =
    nonempty(payload["agent_id"]) ?? nonempty(payload["AgentID"]) ?? nonempty(payload["agentId"]);
  if (agentId === null) return null;

  return { agentId, agentName: nonempty(payload["agent_name"]) ?? "" };
}
