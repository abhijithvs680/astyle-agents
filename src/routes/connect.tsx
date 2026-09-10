import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  Check,
  Database,
  FileSpreadsheet,
  Cloud,
  Table2,
  Search,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/connect")({
  head: () => ({
    meta: [
      { title: "Connect with Data — Classroom Admin" },
      {
        name: "description",
        content:
          "Connect a database, browse its tables, and import student and class records into Classroom Admin.",
      },
      { property: "og:title", content: "Connect with Data — Classroom Admin" },
      {
        property: "og:description",
        content: "Connect a database, pick tables, and import records into Classroom Admin.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ConnectPage,
});

const sources = [
  {
    id: "postgres",
    name: "PostgreSQL",
    detail: "school-records.internal · 5432",
    icon: Database,
    tint: "bg-[oklch(0.93_0.05_255)] text-[oklch(0.5_0.16_255)]",
  },
  {
    id: "bigquery",
    name: "BigQuery",
    detail: "district-analytics · US",
    icon: Cloud,
    tint: "bg-[oklch(0.94_0.05_200)] text-[oklch(0.5_0.14_215)]",
  },
  {
    id: "sheets",
    name: "Google Sheets",
    detail: "Enrollment master sheet",
    icon: FileSpreadsheet,
    tint: "bg-[oklch(0.93_0.06_150)] text-[oklch(0.48_0.14_150)]",
  },
  {
    id: "mysql",
    name: "MySQL",
    detail: "legacy-sis · 3306",
    icon: Database,
    tint: "bg-[oklch(0.95_0.05_60)] text-[oklch(0.52_0.14_60)]",
  },
];

const tables = [
  { name: "students", rows: "12,480", cols: 18, updated: "2 min ago" },
  { name: "classes", rows: "864", cols: 11, updated: "12 min ago" },
  { name: "enrollments", rows: "31,209", cols: 7, updated: "1 hr ago" },
  { name: "assignments", rows: "9,117", cols: 14, updated: "3 hrs ago" },
  { name: "grades", rows: "104,552", cols: 9, updated: "yesterday" },
  { name: "teachers", rows: "612", cols: 16, updated: "yesterday" },
];

const steps = ["Choose a source", "Select tables", "Import"];

function ConnectPage() {
  const [step, setStep] = useState(0);
  const [source, setSource] = useState<string | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [importing, setImporting] = useState(false);
  const [done, setDone] = useState(false);

  const visible = tables.filter((t) => t.name.includes(query.trim().toLowerCase()));
  const sourceName = sources.find((s) => s.id === source)?.name ?? "";

  const toggle = (name: string) =>
    setPicked((p) => (p.includes(name) ? p.filter((n) => n !== name) : [...p, name]));

  const runImport = () => {
    setImporting(true);
    setTimeout(() => {
      setImporting(false);
      setDone(true);
    }, 1400);
  };

  return (
    <div className="min-h-screen bg-surface-tint font-sans text-foreground">
      <header className="flex items-center px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Link to="/" className="rounded-full p-2 hover:bg-tile" aria-label="Back to home">
            <ArrowLeft className="size-6 text-muted-foreground" />
          </Link>
          <span className="grid size-7 place-items-center rounded-md bg-[oklch(0.62_0.16_150)]">
            <BookOpenText className="size-4 text-surface" />
          </span>
          <span className="text-xl sm:text-[22px]">Connect with data</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-3 pb-16 sm:px-6">
        <ol className="mb-4 flex flex-wrap items-center gap-2 rounded-3xl bg-surface p-4 text-sm">
          {steps.map((label, i) => (
            <li key={label} className="flex items-center gap-2">
              <span
                className={`grid size-6 place-items-center rounded-full text-xs ${
                  i < step
                    ? "bg-[oklch(0.62_0.16_150)] text-surface"
                    : i === step
                      ? "bg-chip-active text-chip-active-foreground"
                      : "bg-tile text-muted-foreground"
                }`}
              >
                {i < step ? <Check className="size-3.5" /> : i + 1}
              </span>
              <span className={i === step ? "text-foreground" : "text-muted-foreground"}>
                {label}
              </span>
              {i < steps.length - 1 && <span className="mx-2 text-border">—</span>}
            </li>
          ))}
        </ol>

        <section className="rounded-3xl bg-surface p-5 sm:p-6">
          {step === 0 && (
            <>
              <h2 className="text-[22px]">Choose a database</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Pick where your school records live. You can add more sources later.
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {sources.map(({ id, name, detail, icon: Icon, tint }) => (
                  <button
                    key={id}
                    onClick={() => setSource(id)}
                    className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
                      source === id
                        ? "border-brand-blue bg-tile"
                        : "border-border bg-surface hover:bg-tile"
                    }`}
                  >
                    <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${tint}`}>
                      <Icon className="size-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-medium">{name}</span>
                      <span className="block truncate text-sm text-muted-foreground">{detail}</span>
                    </span>
                    {source === id && <Check className="ml-auto size-5 text-brand-blue" />}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="text-[22px]">Tables in {sourceName}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Select the tables you want to bring into Classroom.
              </p>
              <div className="mt-5 flex items-center gap-2 rounded-full border border-border px-4 py-2">
                <Search className="size-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search tables"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
              <ul className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border">
                {visible.map((t) => {
                  const on = picked.includes(t.name);
                  return (
                    <li key={t.name}>
                      <button
                        onClick={() => toggle(t.name)}
                        className={`flex w-full items-center gap-4 p-4 text-left ${on ? "bg-tile" : "hover:bg-tile"}`}
                      >
                        <span
                          className={`grid size-5 shrink-0 place-items-center rounded-md border ${
                            on ? "border-brand-blue bg-brand-blue" : "border-border"
                          }`}
                        >
                          {on && <Check className="size-3.5 text-surface" />}
                        </span>
                        <Table2 className="size-4 shrink-0 text-muted-foreground" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium">{t.name}</span>
                          <span className="block text-sm text-muted-foreground">
                            {t.rows} rows · {t.cols} columns
                          </span>
                        </span>
                        <span className="hidden text-sm text-muted-foreground sm:block">
                          {t.updated}
                        </span>
                      </button>
                    </li>
                  );
                })}
                {visible.length === 0 && (
                  <li className="p-4 text-sm text-muted-foreground">No tables match “{query}”.</li>
                )}
              </ul>
            </>
          )}

          {step === 2 && !done && (
            <>
              <h2 className="text-[22px]">Review and import</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {picked.length} table{picked.length === 1 ? "" : "s"} from {sourceName} will be
                imported into your school workspace.
              </p>
              <div className="mt-5 grid gap-3">
                {picked.map((name) => {
                  const t = tables.find((x) => x.name === name)!;
                  return (
                    <div
                      key={name}
                      className="flex items-center gap-4 rounded-2xl bg-tile p-4 text-sm"
                    >
                      <Table2 className="size-4 text-muted-foreground" />
                      <span className="font-medium">{t.name}</span>
                      <span className="ml-auto text-muted-foreground">{t.rows} rows</span>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={runImport}
                disabled={importing}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-chip-active px-5 py-2.5 text-sm font-medium text-chip-active-foreground disabled:opacity-70"
              >
                {importing && <Loader2 className="size-4 animate-spin" />}
                {importing ? "Importing…" : "Start import"}
              </button>
            </>
          )}

          {done && (
            <div className="py-6 text-center">
              <CheckCircle2 className="mx-auto size-12 text-positive" />
              <h2 className="mt-4 text-[22px]">Import complete</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {picked.length} table{picked.length === 1 ? "" : "s"} from {sourceName} are now
                available in your dashboard.
              </p>
              <Link
                to="/"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-chip-active px-5 py-2.5 text-sm font-medium text-chip-active-foreground"
              >
                Back to home
              </Link>
            </div>
          )}

          {!done && (
            <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="rounded-full border border-border px-4 py-2 text-sm font-medium disabled:opacity-40"
              >
                Back
              </button>
              {step < 2 && (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={(step === 0 && !source) || (step === 1 && picked.length === 0)}
                  className="inline-flex items-center gap-2 rounded-full bg-chip-active px-5 py-2.5 text-sm font-medium text-chip-active-foreground disabled:opacity-40"
                >
                  Continue
                  <ArrowRight className="size-4" />
                </button>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
