/** The chat workflow sends a JSON answer inside the socket event's response field. */
export const CHAT_RESPONSE_EVENT = "chat_response";

export type ChatAnswer = {
  title: string;
  response: string;
};

export type ChatResponse = ChatAnswer & { sessionId: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function nonempty(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

function readableText(value: string): string {
  // Some workflow runs escape line breaks a second time. Keep the paragraph
  // breaks even when the surrounding JSON cannot be parsed as a whole.
  return value
    .replace(/\\+r\\+n/g, "\n")
    .replace(/\\+n/g, "\n")
    .replace(/\\+r/g, "\n")
    .replace(/\\+t/g, "\t")
    .replace(/\\+"/g, '"');
}

function recoverJsonAnswer(value: string): ChatAnswer | null {
  const text = readableText(value);
  const title = /"title"\s*:\s*"([\s\S]*?)"\s*,\s*"response"\s*:/.exec(text);
  const response = /"response"\s*:\s*"([\s\S]*)"\s*}\s*$/.exec(text);
  if (title === null || response === null) return null;
  const answer = readableText(response[1] ?? "").trim();
  if (answer === "") return null;
  return { title: readableText(title[1] ?? "").trim() || "Answer", response: answer };
}

/** Also used for chat answers saved in a session's conversation history. */
export function toChatAnswer(value: unknown): ChatAnswer | null {
  if (typeof value === "string") {
    const text = value.trim();
    if (!text.startsWith("{")) return null;
    try {
      return toChatAnswer(JSON.parse(text));
    } catch {
      return recoverJsonAnswer(text);
    }
  }
  if (!isRecord(value)) return null;
  const response = nonempty(value["response"]);
  if (response === null) return null;
  if (response.startsWith("{")) {
    const nested = toChatAnswer(response);
    if (nested !== null) return nested;
  }
  return { title: nonempty(value["title"]) ?? "Answer", response: readableText(response) };
}

/** Accepts either the socket callback payload or the event tuple shown in logs. */
export function parseChatResponseEvent(raw: unknown): ChatResponse | null {
  const payload = Array.isArray(raw) && raw[0] === CHAT_RESPONSE_EVENT ? raw[1] : raw;
  if (!isRecord(payload)) return null;

  const sessionId =
    nonempty(payload["Session_ID"]) ??
    nonempty(payload["session_id"]) ??
    nonempty(payload["sessionId"]) ??
    nonempty(payload["jobId"]);
  if (sessionId === null) return null;

  let body: unknown = payload["response"];
  if (typeof body === "string") {
    const responseText = body;
    try {
      body = JSON.parse(responseText);
    } catch {
      body = recoverJsonAnswer(responseText) ?? { response: responseText };
    }
  }

  const answer = toChatAnswer(body) ?? (typeof body === "string" ? recoverJsonAnswer(body) : null);
  return answer === null ? null : { sessionId, ...answer };
}
