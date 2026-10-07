/**
 * Parsing for the `report_gen_plan` socket event.
 *
 * The platform wraps the plan in a background-workflow envelope and sends the
 * plan itself as a JSON *string* in `response`, so it needs two parses. Both
 * the envelope and the plan come from outside the app, so nothing here trusts
 * its input: every field is checked, and anything malformed degrades to a
 * usable default rather than throwing into the socket handler.
 */
import type { AgentPlanItem, SuggestedAgentItem } from "../components/CxoDashboard";

/** Socket event name carrying a Deep Insights plan. */
export const REPORT_PLAN_EVENT = "report_gen_plan";

export type ReportPlan = {
  sessionId: string;
  /**
   * The row this plan was stored as. Comes off the socket envelope as
   * `conversation_id`, or off the stored row as `ConversationID`. The report
   * workflow needs it to know which plan it is being asked to run.
   */
  conversationId?: string;
  prompt: string;
  sessionTitle?: string;
  planTitle: string;
  planSummary?: string;
  agents: Array<AgentPlanItem>;
  suggestedAgents: Array<SuggestedAgentItem>;
  customInstructions?: string;
  status: "planning" | "ready" | "error";
  /** Set when status is "error"; also set when the payload itself was unusable. */
  error?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function str(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
}

function bool(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

/** Ids may arrive as numbers (the catalog uses numeric or UUID ids). */
function id(value: unknown, fallback: string): string {
  if (typeof value === "string" && value.trim() !== "") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return fallback;
}

function toAgent(raw: unknown, index: number): AgentPlanItem | null {
  if (!isRecord(raw)) return null;
  const name = str(raw["name"]);
  if (name === undefined) return null;

  return {
    id: id(raw["id"], `agent-${index}`),
    name,
    role: str(raw["role"]) ?? "",
    icon: str(raw["icon"]) ?? "🤖",
    // Falls back to an empty string rather than inventing text: the plan card
    // lets the user edit this, and a fabricated instruction would be sent.
    runtimePrompt: str(raw["runtimePrompt"]) ?? "",
    isEnabled: bool(raw["isEnabled"], true),
    ...(raw["isCustom"] === true ? { isCustom: true as const } : {}),
  };
}

function toSuggested(raw: unknown, index: number): SuggestedAgentItem | null {
  if (!isRecord(raw)) return null;
  const name = str(raw["name"]);
  if (name === undefined) return null;

  const rationale = str(raw["rationale"]);

  return {
    id: id(raw["id"], `suggested-${index}`),
    name,
    role: str(raw["role"]) ?? "",
    icon: str(raw["icon"]) ?? "✨",
    description: str(raw["description"]) ?? "",
    runtimePrompt: str(raw["runtimePrompt"]) ?? "",
    ...(rationale !== undefined ? { rationale } : {}),
    // Never trust an approval from the wire: the user opts in, locally.
    isApproved: false,
  };
}

function mapList<T>(raw: unknown, map: (item: unknown, index: number) => T | null): Array<T> {
  if (!Array.isArray(raw)) return [];
  return raw.map(map).filter((item): item is T => item !== null);
}

function toStatus(raw: unknown): ReportPlan["status"] {
  return raw === "planning" || raw === "error" ? raw : "ready";
}

/**
 * Fields the platform's background-workflow envelope is expected to carry.
 * Anything else is a fragment of `response` that leaked out of the string when
 * the envelope was serialised — see `strayEnvelopeKeys`.
 */
const ENVELOPE_KEYS = new Set([
  "USER_ID",
  "Session_ID",
  "session_id",
  "response",
  "conversation_id",
  "userId",
  "tag",
  "jobId",
  "icon",
  "type",
  "data",
  "web_domain",
]);

/**
 * Keys that are really fragments of a broken `response` string.
 *
 * When the envelope is built without escaping `response` properly, a bare
 * quote inside it terminates the string early and the remainder is parsed as
 * further object keys (with null values). Their presence means the plan was
 * complete but mangled in transit — a different failure from a size limit.
 */
function strayEnvelopeKeys(envelope: Record<string, unknown>): Array<string> {
  return Object.keys(envelope).filter((key) => !ENVELOPE_KEYS.has(key));
}

/**
 * Distinguishes a payload that was cut off mid-flight from one that is simply
 * malformed. A truncated plan ends inside an unterminated string or with
 * unclosed braces, which points at an output/field limit upstream rather than
 * at a bug in the agent's formatting.
 */
function looksTruncated(json: string): boolean {
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (const char of json) {
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === "\\") {
      escaped = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (char === "{" || char === "[") depth++;
    if (char === "}" || char === "]") depth--;
  }

  return inString || depth > 0;
}

/**
 * Pull the plan out of a `report_gen_plan` event.
 *
 * Returns null when the payload carries no session id — without one there is
 * no run to attach it to, so acting on it would be a guess.
 */
export function parseReportPlanEvent(raw: unknown): ReportPlan | null {
  if (!isRecord(raw)) return null;

  // The envelope repeats the id; `Session_ID` is authoritative, `jobId` is the
  // fallback seen on background-workflow events.
  const envelopeSessionId = str(raw["Session_ID"]) ?? str(raw["session_id"]) ?? str(raw["jobId"]);
  const conversationId = str(raw["conversation_id"]);

  let body: unknown = raw["response"];
  if (typeof body === "string") {
    // Held separately: `body` is reassigned by the parse, so it is no longer
    // known to be a string in the catch block.
    const rawJson = body;
    try {
      body = JSON.parse(rawJson);
    } catch {
      const stray = strayEnvelopeKeys(raw);
      const truncated = looksTruncated(rawJson);

      let detail: string;
      if (stray.length > 0) {
        detail =
          `The plan arrived corrupted: ${stray.length} fragment(s) of it leaked out of the ` +
          "response field into neighbouring fields, which means it was not escaped correctly " +
          "when the event was built. The plan itself looks complete — this is a transport bug.";
      } else if (truncated) {
        detail =
          `The plan was cut off after ${rawJson.length} characters, mid-way through the JSON. ` +
          "That usually means an output or field-size limit was hit upstream, not a formatting bug.";
      } else {
        detail = "The plan response was not valid JSON.";
      }

      console.error("[plan] could not parse response", {
        sessionId: envelopeSessionId,
        length: rawJson.length,
        truncated,
        strayKeyCount: stray.length,
        strayKeyPreviews: stray.map((key) => key.slice(0, 60)),
        tail: rawJson.slice(-80),
      });

      return envelopeSessionId === undefined
        ? null
        : {
            sessionId: envelopeSessionId,
            ...(conversationId !== undefined ? { conversationId } : {}),
            prompt: "",
            planTitle: "Report Generation Plan",
            agents: [],
            suggestedAgents: [],
            status: "error",
            error: detail,
          };
    }
  }

  return toReportPlan(body, envelopeSessionId, conversationId);
}

/**
 * Map an already-parsed plan object onto `ReportPlan`.
 *
 * Shared by the socket path and by stored conversations, whose `Content`
 * column holds the very same plan JSON.
 */
export function toReportPlan(
  body: unknown,
  fallbackSessionId?: string,
  conversationId?: string,
): ReportPlan | null {
  const plan = isRecord(body) ? body : {};
  const sessionId = str(plan["sessionId"]) ?? fallbackSessionId;
  if (sessionId === undefined) return null;

  const sessionTitle = str(plan["sessionTitle"]);
  const planSummary = str(plan["planSummary"]);
  const customInstructions = str(plan["customInstructions"]);
  const status = toStatus(plan["status"]);
  const error = str(plan["error"]);

  return {
    sessionId,
    ...(conversationId !== undefined && conversationId !== "" ? { conversationId } : {}),
    prompt: str(plan["prompt"]) ?? "",
    ...(sessionTitle !== undefined ? { sessionTitle } : {}),
    planTitle: str(plan["planTitle"]) ?? "Report Generation Plan",
    ...(planSummary !== undefined ? { planSummary } : {}),
    agents: mapList(plan["agents"], toAgent),
    suggestedAgents: mapList(plan["suggestedAgents"], toSuggested),
    ...(customInstructions !== undefined ? { customInstructions } : {}),
    status,
    ...(error !== undefined ? { error } : {}),
  };
}
