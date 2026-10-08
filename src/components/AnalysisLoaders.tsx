/**
 * Waiting states for a dispatched analysis run.
 *
 * Both runs answer over the chat socket rather than the HTTP response, so
 * these stay up until a socket event for the session arrives. The plan loader
 * shows a small set of status messages while the request is running; it does
 * not claim a completion percentage or finish the request on a timer.
 */
import { useEffect, useState } from "react";

function Shimmer({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`animate-pulse rounded bg-slate-200/80 ${className}`} style={style} />;
}

/**
 * Deep Insights: a placeholder shaped like the Report Generation Plan card, so
 * the layout doesn't jump when the real plan replaces it.
 */
export function PlanSkeleton() {
  const [statusStep, setStatusStep] = useState(0);

  useEffect(() => {
    const statusTimer = window.setInterval(() => {
      setStatusStep((step) => Math.min(step + 1, 4));
    }, 8000);
    return () => window.clearInterval(statusTimer);
  }, []);

  const status =
    statusStep === 0
      ? "Getting information…"
      : statusStep === 1
        ? "Generating ideas…"
        : statusStep === 2
          ? "Building your report plan…"
          : statusStep === 3
            ? "Finalizing…"
            : "Still working on your report plan…";

  return (
    <div
      className="space-y-5 rounded-2xl border-2 border-sky-300/80 bg-gradient-to-b from-white via-sky-50/35 to-white p-6 shadow-md animate-in fade-in duration-300 sm:p-9"
      role="status"
      aria-busy="true"
    >
      <span className="sr-only">Building your report plan</span>

      <div className="space-y-2 border-b border-slate-200/70 pb-4">
        <div className="flex items-center gap-2.5">
          <img src="/flower-logo.png" alt="" className="size-8 object-contain animate-spin" />
          <h3 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
            Building your report plan
          </h3>
        </div>
        <p className="text-sm font-normal text-slate-600">This may take a few minutes.</p>
        <p className="text-sm font-medium text-slate-600" aria-live="polite">
          {status}
        </p>
      </div>

      <div className="space-y-2.5">
        <Shimmer className="h-3.5 w-28" />
        <div className="divide-y divide-slate-200/80 rounded-xl border border-slate-200 bg-white overflow-hidden">
          {[0, 1, 2, 3].map((row) => (
            <div key={row} className="flex items-center gap-3 p-3.5">
              <Shimmer className="size-9 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Shimmer className="h-3.5 w-1/3" />
                <Shimmer className="h-3 w-2/3" />
              </div>
              <Shimmer className="h-5 w-9 shrink-0 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2.5">
        <Shimmer className="h-3.5 w-32" />
        <div className="divide-y divide-slate-200/80 rounded-xl border border-slate-200 bg-white overflow-hidden">
          {[0, 1].map((row) => (
            <div key={row} className="flex items-center gap-3 p-3.5">
              <Shimmer className="size-9 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Shimmer className="h-3.5 w-2/5" />
                <Shimmer className="h-3 w-1/2" />
              </div>
              <Shimmer className="h-5 w-9 shrink-0 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Chat Mode: a few lines of text taking shape. */
export function ChatSkeleton() {
  return (
    <div
      className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm space-y-4 animate-in fade-in duration-300"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Thinking</span>

      <div className="flex items-center gap-3">
        <img src="/flower-logo.png" alt="" className="size-7 object-contain animate-spin" />
        <span className="text-sm font-medium text-slate-600">Thinking…</span>
      </div>

      <div className="space-y-2.5">
        <Shimmer className="h-3.5 w-[92%]" />
        <Shimmer className="h-3.5 w-[85%]" />
        <Shimmer className="h-3.5 w-[70%]" />
        <Shimmer className="h-3.5 w-[45%]" />
      </div>
    </div>
  );
}

/**
 * The gap between pressing Continue and the first agent existing.
 *
 * Counted, not spun: the user approved a specific number of specialists, and
 * seeing that number come back tells them the right thing is happening.
 */
export function AgentCreationLoader({ count }: { count: number }) {
  return (
    <div
      className="animate-in fade-in space-y-4 rounded-2xl border border-amber-200/80 bg-amber-50/30 p-5 shadow-2xs duration-300 sm:p-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex items-center gap-2.5">
        <img src="/flower-logo.png" alt="" className="size-5 animate-spin object-contain" />
        <h3 className="text-base font-bold tracking-tight text-slate-900">
          {count === 1 ? "Creating 1 new agent" : `Creating ${count} new agents`}
        </h3>
      </div>
      <p className="text-sm font-normal text-slate-600">
        Adding the specialists you approved to your catalog before the report runs.
      </p>

      <div className="divide-y divide-amber-200/70 overflow-hidden rounded-xl border border-amber-200 bg-white">
        {Array.from({ length: Math.max(1, count) }, (_, row) => (
          <div key={row} className="flex items-center gap-3 p-3.5">
            <Shimmer className="size-9 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Shimmer className="h-3.5 w-2/5" />
              <Shimmer className="h-3 w-3/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * The wait for the report itself, shaped like the report that replaces it:
 * a summary block, a chart, and a second chart.
 */
export function ReportSkeleton() {
  return (
    <div
      className="animate-in fade-in space-y-6 rounded-2xl border border-sky-200/80 bg-gradient-to-b from-white via-sky-50/20 to-white p-5 shadow-2xs duration-300 sm:p-7"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Generating your report</span>

      <div className="space-y-2 border-b border-slate-200/70 pb-3">
        <div className="flex items-center gap-2.5">
          <img src="/flower-logo.png" alt="" className="size-5 animate-spin object-contain" />
          <h3 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
            Generating your report
          </h3>
        </div>
        <p className="text-sm font-normal text-slate-600">
          The agents are running their analyses and the findings are being combined.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((card) => (
          <div key={card} className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
            <Shimmer className="h-3 w-2/3" />
            <Shimmer className="h-5 w-1/2" />
            <Shimmer className="h-2.5 w-3/4" />
          </div>
        ))}
      </div>

      <div className="space-y-2.5 rounded-xl border border-slate-200 bg-white p-5">
        <Shimmer className="h-3.5 w-1/3" />
        <div className="flex h-36 items-end justify-around gap-3 pt-4">
          {[70, 40, 85, 55, 30].map((height, bar) => (
            <Shimmer
              key={bar}
              className="w-10 rounded-t-lg sm:w-14"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2.5 rounded-xl border border-slate-200 bg-white p-5">
        <Shimmer className="h-3.5 w-2/5" />
        <Shimmer className="h-3 w-[92%]" />
        <Shimmer className="h-3 w-[78%]" />
        <Shimmer className="h-3 w-[60%]" />
      </div>
    </div>
  );
}
