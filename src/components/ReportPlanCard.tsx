/**
 * Renders a Deep Insights plan once it arrives over the socket.
 *
 * Everything here is driven by the parsed plan — nothing is invented when the
 * agent omits it. An empty agent list and an `error` status are both normal
 * states the plan agent can report, so they render as themselves rather than
 * as a broken card.
 *
 * Runtime prompts are editable because the edited text is what actually gets
 * sent to the agent; showing them read-only would make the plan a preview of
 * something the user cannot influence.
 */
import { AlertTriangle, Check, Pencil, X } from "lucide-react";
import { useState } from "react";

import type { ReportPlan } from "../lib/report-plan";

/**
 * Continuing happens in two steps, and they fail differently: creating an
 * agent is a real request that can be rejected, while starting the report is
 * fire-and-forget. The user is told which one they are waiting on.
 */
export type ContinueStage = "idle" | "creating-agents" | "starting";

type Props = {
  plan: ReportPlan;
  onToggleAgent: (agentId: string) => void;
  onToggleSuggested: (agentId: string) => void;
  onEditAgentPrompt: (agentId: string, text: string) => void;
  onEditSuggestedPrompt: (agentId: string, text: string) => void;
  onContinue: () => void;
  continueStage: ContinueStage;
  /** History: show the plan as it was, without controls that would re-run it. */
  readOnly?: boolean;
};

function Toggle({
  on,
  label,
  onClick,
  disabled = false,
}: {
  on: boolean;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors ${
        disabled ? "cursor-default opacity-70" : "cursor-pointer"
      } ${on ? "bg-[#0e7490]" : "bg-slate-300"}`}
    >
      <span
        className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-sm transition duration-200 ${
          on ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

/**
 * A runtime prompt the user can rewrite before the run. Keeps its own draft so
 * cancelling leaves the plan untouched.
 */
function EditablePrompt({
  value,
  label,
  onSave,
  readOnly = false,
}: {
  value: string;
  label: string;
  onSave: (text: string) => void;
  readOnly?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  if (isEditing) {
    return (
      <div className="mt-1.5 space-y-2">
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={6}
          aria-label={`Edit instruction for ${label}`}
          className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm text-slate-800 focus:border-[#0e7490] focus:outline-none"
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              // An empty instruction would silently send nothing, so treat a
              // blank draft as "leave it as it was".
              const next = draft.trim();
              if (next !== "") onSave(next);
              setIsEditing(false);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0e7490] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#0c627a]"
          >
            <Check className="size-3.5" aria-hidden="true" />
            Save
          </button>
          <button
            type="button"
            onClick={() => {
              setDraft(value);
              setIsEditing(false);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <X className="size-3.5" aria-hidden="true" />
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-1 group/prompt">
      {value === "" ? (
        <p className="text-sm italic text-slate-400">No instruction was provided for this agent.</p>
      ) : (
        <p className="whitespace-pre-line text-sm text-slate-600">{value}</p>
      )}
      {readOnly ? null : (
        <button
          type="button"
          onClick={() => {
            setDraft(value);
            setIsEditing(true);
          }}
          className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#0e7490] hover:underline"
        >
          <Pencil className="size-3" aria-hidden="true" />
          Edit instruction
        </button>
      )}
    </div>
  );
}

export function ReportPlanCard({
  plan,
  onToggleAgent,
  onToggleSuggested,
  onEditAgentPrompt,
  onEditSuggestedPrompt,
  onContinue,
  continueStage,
  readOnly = false,
}: Props) {
  const activeAgents = plan.agents.filter((a) => a.isEnabled).length;
  const approved = plan.suggestedAgents.filter((a) => a.isApproved).length;

  // Nothing would run, so continuing would produce an empty report.
  const hasRoster = activeAgents + approved > 0;
  // The report workflow runs one specific stored plan, by its row id. A plan
  // that arrived without one cannot be continued at all.
  const hasConversationId = plan.conversationId !== undefined;
  const isBusy = continueStage !== "idle";
  const canContinue = hasRoster && hasConversationId;

  const busyLabel =
    continueStage === "creating-agents"
      ? approved === 1
        ? "Creating 1 agent…"
        : `Creating ${approved} agents…`
      : "Starting…";

  return (
    <div
      data-report-plan-card
      className="mb-5 space-y-5 rounded-2xl border border-sky-200/80 bg-gradient-to-b from-white via-sky-50/20 to-white p-5 shadow-2xs animate-in fade-in duration-300 sm:p-7"
    >
      <div className="border-b border-slate-200/70 pb-3">
        <h3 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
          {plan.planTitle}
        </h3>
        {plan.planSummary ? (
          <p className="mt-1 text-sm font-normal text-slate-600">{plan.planSummary}</p>
        ) : null}
      </div>

      {plan.status === "error" && plan.error ? (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-3.5">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900">Plan could not be completed</div>
            <p className="mt-0.5 text-sm text-slate-600">{plan.error}</p>
          </div>
        </div>
      ) : null}

      {plan.agents.length > 0 ? (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Agents
            </span>
            <span className="text-xs font-medium text-slate-500">
              {activeAgents} of {plan.agents.length} active
            </span>
          </div>
          <div className="divide-y divide-slate-200/80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
            {plan.agents.map((agent) => (
              <div key={agent.id} className="flex items-start gap-3 p-3.5">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-base">
                  {agent.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-slate-900">{agent.name}</div>
                  {agent.role ? <div className="text-sm text-slate-600">{agent.role}</div> : null}
                  <EditablePrompt
                    value={agent.runtimePrompt}
                    label={agent.name}
                    onSave={(text) => onEditAgentPrompt(agent.id, text)}
                    readOnly={readOnly}
                  />
                </div>
                <Toggle
                  on={agent.isEnabled}
                  label={`Enable ${agent.name}`}
                  onClick={() => onToggleAgent(agent.id)}
                  disabled={readOnly}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="px-1 text-sm text-slate-600">
          No agents were selected for this report.
          {plan.suggestedAgents.length > 0
            ? " Approve one of the suggestions below to give this question an agent that can answer it."
            : ""}
        </p>
      )}

      {plan.suggestedAgents.length > 0 ? (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Suggested New Specialist Agents
            </span>
            <span className="text-xs font-medium text-slate-500">
              {approved} of {plan.suggestedAgents.length} approved
            </span>
          </div>
          <p className="px-1 text-sm text-slate-600">
            Not part of your standing roster. Approve the ones you want this report to use.
          </p>
          <div className="divide-y divide-amber-200/70 overflow-hidden rounded-xl border border-amber-200 bg-amber-50/40">
            {plan.suggestedAgents.map((agent) => (
              <div key={agent.id} className="flex items-start gap-3 p-3.5">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-amber-200 bg-white text-base">
                  {agent.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-slate-900">{agent.name}</div>
                  {agent.role ? <div className="text-sm text-slate-600">{agent.role}</div> : null}
                  {agent.description ? (
                    <p className="mt-1 text-sm text-slate-600">{agent.description}</p>
                  ) : null}
                  {agent.rationale ? (
                    <p className="mt-1.5 text-xs text-amber-800">Why: {agent.rationale}</p>
                  ) : null}
                  <EditablePrompt
                    value={agent.runtimePrompt}
                    label={agent.name}
                    onSave={(text) => onEditSuggestedPrompt(agent.id, text)}
                    readOnly={readOnly}
                  />
                </div>
                <Toggle
                  on={agent.isApproved}
                  label={`Approve ${agent.name}`}
                  onClick={() => onToggleSuggested(agent.id)}
                  disabled={readOnly}
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {readOnly ? null : (
        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200/70 pt-4">
          {isBusy ? (
            <span className="flex items-center gap-2 text-sm text-slate-600" role="status">
              <span
                className="size-3.5 animate-spin rounded-full border-2 border-slate-300 border-t-[#0e7490]"
                aria-hidden="true"
              />
              {continueStage === "creating-agents"
                ? "Adding the approved specialists to your catalog…"
                : "Starting the report…"}
            </span>
          ) : !hasConversationId ? (
            <span className="text-sm text-slate-500">
              This plan arrived without a conversation id, so it cannot be run.
            </span>
          ) : !hasRoster ? (
            <span className="text-sm text-slate-500">
              Enable at least one agent, or approve a suggestion, to continue.
            </span>
          ) : null}
          <button
            type="button"
            onClick={onContinue}
            disabled={!canContinue || isBusy}
            className="inline-flex items-center justify-center rounded-xl bg-[#0e7490] px-5 py-2 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#0c627a] disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isBusy ? busyLabel : "Continue"}
          </button>
        </div>
      )}
    </div>
  );
}
