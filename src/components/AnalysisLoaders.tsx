/**
 * Waiting states for a dispatched analysis run.
 *
 * Both runs answer over the chat socket rather than the HTTP response, so
 * these stay up until a socket event for the session arrives. Neither is on a
 * timer — nothing here fabricates progress it cannot observe.
 */

function Shimmer({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-slate-200/80 ${className}`} />;
}

/**
 * Deep Insights: a placeholder shaped like the Report Generation Plan card, so
 * the layout doesn't jump when the real plan replaces it.
 */
export function PlanSkeleton() {
  return (
    <div
      className="rounded-2xl border border-sky-200/80 bg-gradient-to-b from-white via-sky-50/20 to-white p-5 sm:p-7 shadow-2xs space-y-5 animate-in fade-in duration-300"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Building your report plan</span>

      <div className="border-b border-slate-200/70 pb-3 space-y-2">
        <div className="flex items-center gap-2.5">
          <img src="/flower-logo.png" alt="" className="size-5 object-contain animate-spin" />
          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Building your report plan
          </h3>
        </div>
        <p className="text-sm text-slate-600 font-normal">
          Selecting the specialist agents and data sources this question needs.
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
