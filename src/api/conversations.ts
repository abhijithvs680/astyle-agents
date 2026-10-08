/**
 * Messages belonging to one session, loaded when it is opened from the sidebar.
 *
 * A row's `Content` is plain text, the plan JSON, or the finished report — the
 * same payloads the socket delivers, stored as strings. All three are
 * normalised here so the UI never has to guess.
 */
import { createServerFn } from "@tanstack/react-start";

import { postAuthenticated } from "./client.server";
import { decodeTokenClaims } from "./jwt.server";
import { requireSessionToken } from "./session.server";
import type { ConversationEntry, ConversationsResult } from "./types";
import { toChatAnswer } from "../lib/chat-response";

/** Platform bookkeeping that rides along on every row; never content. */
const ENVELOPE_FIELDS = new Set(["jsCodes", "workflow_log_id", "Echo", "Status", "Time", "Errors"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function hasContent(row: unknown): boolean {
  if (!isRecord(row)) return false;
  return Object.keys(row).some((key) => !ENVELOPE_FIELDS.has(key));
}

/**
 * `CreatedOn` arrives as "MM/DD/YYYY HH:mm:ss". Anything else — and the
 * platform does emit nonsense like "10/10/2175" — returns null so the row
 * keeps its original position instead of being flung to one end.
 */
function parseCreatedOn(value: string): number | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})$/.exec(value);
  if (m === null) return null;
  const [, month, day, year, hour, minute, second] = m;
  const numericYear = Number(year);
  if (numericYear < 2000 || numericYear > new Date().getUTCFullYear() + 1) return null;
  const time = Date.UTC(
    numericYear,
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second),
  );
  const parsed = new Date(time);
  return parsed.getUTCMonth() === Number(month) - 1 && parsed.getUTCDate() === Number(day)
    ? time
    : null;
}

/** Same text, give or take whitespace and case — enough to spot a repeat. */
function normalise(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * `Role` arrives as "Agent" / "User". Anything unrecognised is treated as the
 * agent: attributing an unknown message to the user would misrepresent who
 * said it, while the reverse is merely neutral.
 */
function isUserRole(role: string): boolean {
  const r = role.toLowerCase();
  return r === "user" || r === "human";
}

function toEntry(row: unknown, index: number): ConversationEntry | null {
  if (!isRecord(row)) return null;

  const content = str(row["Content"]);
  if (content === "") return null;

  const id = str(row["ConversationID"]) || str(row["rowID"]) || `row-${index}`;
  const role = isUserRole(str(row["Role"])) ? "user" : "agent";
  const createdOn = str(row["CreatedOn"]);

  // A deep_insight turn stores the whole plan as JSON in Content.
  if (content.startsWith("{")) {
    try {
      const parsed: unknown = JSON.parse(content);
      // A finished report. Checked before the plan, because only one of the
      // two carries `blocks`.
      if (isRecord(parsed) && Array.isArray(parsed["blocks"])) {
        return {
          id,
          role,
          kind: "report",
          reportJson: content,
          ...(createdOn !== "" ? { createdOn } : {}),
        };
      }

      if (isRecord(parsed) && Array.isArray(parsed["agents"])) {
        return {
          id,
          role,
          kind: "plan",
          planJson: content,
          approvedStatus: str(row["ApprovedStatus"]).toLowerCase(),
          ...(str(row["ApprovedData"]) !== "" ? { approvedData: str(row["ApprovedData"]) } : {}),
          // Only the real column — `id` above falls back to `rowID`, which is
          // not what the report workflow expects.
          ...(str(row["ConversationID"]) !== ""
            ? { conversationId: str(row["ConversationID"]) }
            : {}),
          // Decided once every row is known: see below.
          showPrompt: true,
          ...(createdOn !== "" ? { createdOn } : {}),
        };
      }

      const chat = role === "agent" ? toChatAnswer(parsed) : null;
      if (chat !== null) {
        return { id, role, kind: "chat", ...chat, ...(createdOn !== "" ? { createdOn } : {}) };
      }
    } catch {
      // Saved chat answers can contain unescaped line breaks inside their
      // JSON string. Recover their title and body like live socket replies.
      const chat = role === "agent" ? toChatAnswer(content) : null;
      if (chat !== null) {
        return { id, role, kind: "chat", ...chat, ...(createdOn !== "" ? { createdOn } : {}) };
      }
    }
  }

  return { id, role, kind: "text", text: content, ...(createdOn !== "" ? { createdOn } : {}) };
}

/** Convert stored workflow rows into the same cards used by the main chat. */
export function normalizeConversationRows(rows: Array<unknown>): Array<ConversationEntry> {
  const entries = rows
    .filter(hasContent)
    .map(toEntry)
    .filter((entry): entry is ConversationEntry => entry !== null);

  // Put dated turns in chronological order. The platform also emits implausible
  // timestamps (for example, year 2176); keep those rows in their original
  // relative order after dated rows.
  const order = new Map(entries.map((entry, index) => [entry, index]));
  entries.sort((a, b) => {
    const ta = parseCreatedOn(a.createdOn ?? "");
    const tb = parseCreatedOn(b.createdOn ?? "");
    if (ta === null && tb !== null) return 1;
    if (ta !== null && tb === null) return -1;
    if (ta !== null && tb !== null && ta !== tb) return ta - tb;
    return (order.get(a) ?? 0) - (order.get(b) ?? 0);
  });

  // A plan echoes the question back inside its JSON. When the session also
  // stores the user's own turn, that turn is the one to show.
  const asked = new Set(
    entries
      .filter((entry) => entry.role === "user" && entry.kind === "text")
      .map((entry) => normalise(entry.kind === "text" ? entry.text : "")),
  );
  for (const entry of entries) {
    if (entry.kind !== "plan") continue;
    let prompt = "";
    try {
      const parsed: unknown = JSON.parse(entry.planJson);
      if (isRecord(parsed)) prompt = str(parsed["prompt"]);
    } catch {
      // An unreadable prompt should not add a duplicate bubble.
    }
    entry.showPrompt = prompt !== "" && !asked.has(normalise(prompt));
  }

  return entries;
}

export const fetchConversations = createServerFn({ method: "POST" })
  .validator((input: { sessionId?: string | undefined }) => {
    const sessionId = typeof input?.sessionId === "string" ? input.sessionId.trim() : "";
    if (sessionId === "") throw new Error("A sessionId is required.");
    return { sessionId };
  })
  .handler(async ({ data }): Promise<ConversationsResult> => {
    const token = await requireSessionToken();
    const email = decodeTokenClaims(token)?.email;
    if (email === undefined) throw new Error("Session token carries no email claim.");

    const response = await postAuthenticated("getConversations", {
      session_id: data.sessionId,
      email,
    });

    return { sessionId: data.sessionId, entries: normalizeConversationRows(response) };
  });
