/**
 * Messages of a previously opened session.
 *
 * A stored `deep_insight` turn holds the whole plan as JSON, so it renders as
 * the plan card rather than as a wall of text. The question above it comes from
 * the user's own stored turn where there is one; the plan only supplies it when
 * the session has no such row. Its controls are read-only:
 * re-running a past plan is a separate action, not an accident of scrolling
 * back through history.
 */
import type { ConversationEntry } from "../api/types";
import { toReport } from "../lib/report";
import { applyApprovedData, toReportPlan } from "../lib/report-plan";
import { ReportPlanCard } from "./ReportPlanCard";
import { ReportView } from "./ReportView";
import { ChatResponseCard } from "./ChatResponseCard";

const noop = () => {
  /* history is not editable */
};

export function ConversationList({
  entries,
  isLoading,
}: {
  entries: Array<ConversationEntry>;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="space-y-3" role="status" aria-busy="true">
        <span className="sr-only">Loading this session</span>
        {[0, 1, 2].map((row) => (
          <div key={row} className={`flex ${row % 2 === 0 ? "justify-end" : "justify-start"}`}>
            <div className="h-10 w-2/3 animate-pulse rounded-2xl bg-slate-200/80" />
          </div>
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-slate-500">
        No messages were returned for this session.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => {
        if (entry.kind === "report") {
          const report = toReport(safeParse(entry.reportJson));
          return report === null ? null : <ReportView key={entry.id} report={report} />;
        }

        if (entry.kind === "chat") {
          return (
            <ChatResponseCard
              key={entry.id}
              answer={{ title: entry.title, response: entry.response }}
            />
          );
        }

        if (entry.kind === "plan") {
          const storedPlan = toReportPlan(safeParse(entry.planJson));
          if (storedPlan === null) return null;
          const plan = applyApprovedData(storedPlan, entry.approvedStatus, entry.approvedData);

          return (
            <div key={entry.id}>
              {entry.showPrompt && plan.prompt !== "" ? (
                <div className="mb-4 flex justify-end">
                  <div className="max-w-xl rounded-2xl border border-slate-200/90 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 shadow-2xs">
                    {plan.prompt}
                  </div>
                </div>
              ) : null}
              <ReportPlanCard
                plan={plan}
                onToggleAgent={noop}
                onToggleSuggested={noop}
                onEditAgentPrompt={noop}
                onEditSuggestedPrompt={noop}
                onContinue={noop}
                continueStage="idle"
                readOnly
              />
            </div>
          );
        }

        return (
          <div
            key={entry.id}
            className={`flex ${entry.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xl whitespace-pre-line rounded-2xl border border-slate-200/90 bg-white px-4 py-2.5 text-sm shadow-2xs ${
                entry.role === "user" ? "font-medium text-slate-900" : "text-slate-700"
              }`}
            >
              {entry.text}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function safeParse(json: string): unknown {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}
