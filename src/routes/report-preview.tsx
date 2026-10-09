/**
 * Development-only harness for the report renderer.
 *
 * The app is token-gated, so there is no way to look at a report without a
 * live backend session. This route renders the fixture in
 * `docs/report-template.example.json` through the real `ReportView`, which is
 * what makes it possible to check every block type in both themes, at every
 * breakpoint, without a run.
 *
 * It is excluded from production builds by the `import.meta.env.DEV` guard
 * below and by the matching guard in `src/routes/__root.tsx`.
 */
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { ReportView } from "../components/ReportView";
import { reportFromText } from "../lib/report";
import forecastFixture from "../../docs/report-template.forecast.example.json";
import stockoutFixture from "../../docs/report-template.example.json";

const FIXTURES = {
  forecast: { label: "Forecast", source: forecastFixture },
  stockouts: { label: "Stockouts", source: stockoutFixture },
} as const;

type FixtureKey = keyof typeof FIXTURES;

export const Route = createFileRoute("/report-preview")({
  component: ReportPreviewPage,
});

function ReportPreviewPage() {
  const [active, setActive] = useState<FixtureKey>("forecast");

  if (!import.meta.env.DEV) {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-muted-foreground">
        Not available.
      </div>
    );
  }

  const report = reportFromText(JSON.stringify(FIXTURES[active].source));

  return (
    <div className="h-screen overflow-y-auto bg-background">
      <header className="sticky top-0 z-40 flex h-12 items-center justify-between gap-3 bg-ink px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <span className="select-none text-sm font-semibold tracking-wider text-white">
            REPORT PREVIEW
          </span>
          <div className="flex items-center gap-1">
            {(Object.keys(FIXTURES) as Array<FixtureKey>).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setActive(key)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                  active === key
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                {FIXTURES[key].label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[58rem] px-4 py-8 sm:px-6">
        {report === null ? (
          <p className="text-sm text-destructive">The fixture did not parse.</p>
        ) : (
          <ReportView key={active} report={report} />
        )}
      </main>
    </div>
  );
}
