/**
 * Maps API session rows onto what the history sidebar renders.
 */
import type { SessionSummary } from "../api/types";
import type { HistorySession } from "../components/SessionHistorySidebar";

type Group = HistorySession["group"];

/**
 * Bucket a row by date. The API currently returns empty timestamps, so an
 * unparseable date falls back to the least specific bucket rather than
 * claiming the session is from today.
 */
function groupFor(iso: string | null): Group {
  if (iso === null) return "Previous 7 Days";

  const when = new Date(iso);
  if (Number.isNaN(when.getTime())) return "Previous 7 Days";

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const dayMs = 24 * 60 * 60 * 1000;
  if (when.getTime() >= startOfToday.getTime()) return "Today";
  if (when.getTime() >= startOfToday.getTime() - dayMs) return "Yesterday";
  return "Previous 7 Days";
}

function timestampFor(iso: string | null): string {
  if (iso === null) return "";

  const when = new Date(iso);
  if (Number.isNaN(when.getTime())) return "";

  return when.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function toHistorySessions(sessions: Array<SessionSummary>): Array<HistorySession> {
  return sessions.map((session) => {
    const when = session.updatedOn ?? session.createdOn;

    return {
      id: session.id,
      title: session.title,
      timestamp: timestampFor(when),
      group: groupFor(when),
      // `getInitialData` returns no transcript, so a selected session opens
      // empty until there's an endpoint to load its messages.
      messages: [],
      summarySnippet: "",
      ...(session.source !== null ? { category: session.source } : {}),
      ...(session.model !== null ? { agentName: session.model } : {}),
    };
  });
}
