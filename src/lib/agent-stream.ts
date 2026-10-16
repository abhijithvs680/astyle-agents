/**
 * Parser and types for agent creation events streamed over the chat socket.
 *
 * When specialist agents are created in the background, the platform emits
 * `new_message` events with `type: "agent_stream"` and `status: "streaming"`.
 * The body contains JSON (optionally wrapped in a Markdown code block) detailing
 * the agent's title, role, description, DBAccess, and prompt.
 */
import { unwrapJsonFence } from "./report";

export const AGENT_STREAM_EVENT = "new_message";

export type AgentStreamItem = {
  title: string;
  role: string;
  description: string;
  dbAccess?: string | undefined;
  prompt?: string | undefined;
  workflowLogId?: number | undefined;
  agentId?: string | undefined;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Parses a `new_message` socket event carrying an agent stream payload.
 *
 * Returns `null` if the event is not an `agent_stream` message or cannot be parsed.
 */
export function parseAgentStreamEvent(raw: unknown): AgentStreamItem | null {
  const payload = Array.isArray(raw) && raw[0] === AGENT_STREAM_EVENT ? raw[1] : raw;
  if (!isRecord(payload)) return null;

  const type = str(payload["type"]);
  const status = str(payload["status"]);

  // Must match agent_stream type or streaming status with an agent body
  if (type !== "agent_stream" && status !== "streaming") {
    return null;
  }

  const rawBody = payload["Body"] ?? payload["body"];
  if (rawBody === undefined || rawBody === null) {
    return null;
  }

  let parsed: unknown = rawBody;

  if (typeof rawBody === "string") {
    const text = unwrapJsonFence(rawBody);
    try {
      parsed = JSON.parse(text);
    } catch {
      // Fallback: look for an enclosed JSON object substring
      const match = /\{[\s\S]*\}/.exec(text);
      if (match !== null) {
        try {
          parsed = JSON.parse(match[0]);
        } catch {
          return null;
        }
      } else {
        return null;
      }
    }
  }

  if (!isRecord(parsed)) return null;

  const title = str(parsed["Title"] ?? parsed["title"] ?? parsed["name"]);
  if (title === "") return null;

  const role = str(parsed["Role"] ?? parsed["role"] ?? parsed["category"]);
  const description = str(parsed["Description"] ?? parsed["description"]);
  const dbAccess = str(parsed["DBAccess"] ?? parsed["dbAccess"]);
  const prompt = str(parsed["Prompt"] ?? parsed["prompt"]);
  const workflowLogId =
    typeof payload["workflow_log_id"] === "number" ? payload["workflow_log_id"] : undefined;
  const rawAgentId =
    parsed["agent_id"] ??
    parsed["agentId"] ??
    parsed["AgentID"] ??
    parsed["id"] ??
    parsed["ID"] ??
    payload["agent_id"] ??
    payload["agentId"] ??
    payload["AgentID"];
  const agentId =
    typeof rawAgentId === "string" && rawAgentId.trim() !== ""
      ? rawAgentId.trim()
      : typeof rawAgentId === "number" && Number.isFinite(rawAgentId)
        ? String(rawAgentId)
        : undefined;

  return {
    title,
    role,
    description,
    ...(dbAccess !== "" ? { dbAccess } : {}),
    ...(prompt !== "" ? { prompt } : {}),
    ...(workflowLogId !== undefined ? { workflowLogId } : {}),
    ...(agentId !== undefined ? { agentId } : {}),
  };
}
