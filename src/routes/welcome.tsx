import { useState, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Cloud,
  Database,
  FileText,
  Landmark,
  Loader2,
  RotateCw,
  Table2,
  Trash2,
  UploadCloud,
  Workflow,
} from "lucide-react";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "Welcome — CXO Platform" },
      {
        name: "description",
        content:
          "Welcome to CXO. Connect Good Doc, Good Bank, and your operational data to get started.",
      },
      { property: "og:title", content: "Welcome — CXO Platform" },
      {
        property: "og:description",
        content: "Connect Good Doc, Good Bank, and upload files to start analyzing cases.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WelcomePage,
});

const steps = ["Welcome", "Connect data", "Upload files", "Ready"];

type ServiceId = "goodDoc" | "goodBank" | "workflowAgent" | "snowflake" | "bigQuery";

const services: {
  id: ServiceId;
  name: string;
  detail: string;
  connectedDetail: string;
  icon: typeof FileText;
  tint: string;
}[] = [
  {
    id: "goodDoc",
    name: "Good Doc",
    detail: "Google Docs & Workspace",
    connectedDetail: "Google Docs & Workspace connected",
    icon: FileText,
    tint: "bg-[oklch(0.93_0.05_255)] text-[oklch(0.5_0.16_255)]",
  },
  {
    id: "goodBank",
    name: "Good Bank",
    detail: "Banking & Treasury API",
    connectedDetail: "Treasury & reserve accounts linked",
    icon: Landmark,
    tint: "bg-[oklch(0.93_0.06_150)] text-[oklch(0.48_0.14_150)]",
  },
  {
    id: "workflowAgent",
    name: "Workflow Agent",
    detail: "Automated data workflows & ETL",
    connectedDetail: "Autonomous pipeline execution active",
    icon: Workflow,
    tint: "bg-[oklch(0.93_0.06_300)] text-[oklch(0.52_0.15_300)]",
  },
  {
    id: "snowflake",
    name: "Snowflake",
    detail: "Enterprise Data Warehouse",
    connectedDetail: "Warehouse link synced",
    icon: Cloud,
    tint: "bg-[oklch(0.93_0.05_220)] text-[oklch(0.5_0.15_220)]",
  },
  {
    id: "bigQuery",
    name: "BigQuery",
    detail: "Google Cloud analytics",
    connectedDetail: "Cloud analytics pipeline active",
    icon: Database,
    tint: "bg-[oklch(0.94_0.05_40)] text-[oklch(0.52_0.14_40)]",
  },
];

interface UploadedFile {
  name: string;
  size: string;
  updated: string;
}

function WelcomePage() {
  const [step, setStep] = useState(0);
  const [connected, setConnected] = useState<Record<ServiceId, boolean>>({
    goodDoc: false,
    goodBank: false,
    workflowAgent: false,
    snowflake: false,
    bigQuery: false,
  });
  const [connectingServiceName, setConnectingServiceName] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [finishing, setFinishing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const primaryServices = services.slice(0, 3);
  const extraServices = services.slice(3);
  const visibleServices = showMore ? services : primaryServices;
  const connectedCount = Object.values(connected).filter(Boolean).length;
  const canContinueFromConnect = connectedCount > 0;

  const handleConnectService = (service: (typeof services)[number]) => {
    if (connected[service.id]) {
      setConnected((prev) => ({ ...prev, [service.id]: false }));
      return;
    }
    setConnectingServiceName(service.name);
    setTimeout(() => {
      setConnected((prev) => ({ ...prev, [service.id]: true }));
      setConnectingServiceName(null);
    }, 1400);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const newFiles: UploadedFile[] = Array.from(e.target.files).map((f) => ({
      name: f.name,
      size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      updated: "Just now",
    }));
    setFiles((curr) => [...newFiles, ...curr]);
    e.target.value = "";
  };

  const removeFile = (name: string) => {
    setFiles((curr) => curr.filter((f) => f.name !== name));
  };

  const finishSetup = () => {
    setFinishing(true);
    setTimeout(() => {
      setFinishing(false);
      setStep(3);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-surface-tint font-sans text-foreground">
      <header className="flex items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full bg-[oklch(0.68_0.15_55)] text-sm font-medium text-surface shadow-xs">
            CX
          </span>
          <span className="text-xl sm:text-[22px]">CXO</span>
        </div>
        {step < 3 && (
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            Skip for now
          </Link>
        )}
      </header>

      <main className="mx-auto w-full max-w-3xl px-3 pb-16 sm:px-6">
        {step > 0 && step < 3 && (
          <ol className="mb-4 flex flex-wrap items-center gap-2 rounded-3xl bg-surface p-4 text-sm">
            {steps.map((label, i) => (
              <li key={label} className="flex items-center gap-2">
                <span
                  className={`grid size-6 place-items-center rounded-full text-xs ${
                    i < step
                      ? "bg-brand-blue text-surface"
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
                {i < steps.length - 1 && <span className="mx-1 text-border sm:mx-2">—</span>}
              </li>
            ))}
          </ol>
        )}

        <section className="rounded-3xl bg-surface p-5 sm:p-7">
          {step === 0 && (
            <div className="py-4 text-center sm:py-8">
              <p className="text-[11px] font-bold uppercase tracking-widest text-brand-blue">
                Getting started
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Welcome to CXO
              </h1>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                Connect your operational sources so CXO can surface cases, revenue signals, and
                clinical insights from day one.
              </p>

              <div className="mx-auto mt-8 grid max-w-lg gap-3 text-left sm:grid-cols-3">
                {[
                  { label: "Step 1", body: "Connect Good Doc, Good Bank & more" },
                  { label: "Step 2", body: "Upload internal files if needed" },
                  { label: "Step 3", body: "Open your cases dashboard" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl bg-tile p-4">
                    <p className="text-xs font-medium text-brand-blue">{item.label}</p>
                    <p className="mt-1 text-sm text-foreground">{item.body}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setStep(1)}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-surface shadow-xs hover:opacity-90 transition cursor-pointer"
              >
                Connect your data
                <ArrowRight className="size-4" />
              </button>
            </div>
          )}

          {step === 1 && (
            <>
              <h2 className="text-[22px]">Connect your data</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Connect external accounts to feed live documents and financial data into your
                workspace. Connect at least one service to continue.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {visibleServices.map((service) => {
                  const Icon = service.icon;
                  const isOn = connected[service.id];
                  return (
                    <div
                      key={service.id}
                      className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
                        isOn
                          ? "border-brand-blue bg-tile"
                          : "border-border bg-surface hover:bg-tile"
                      }`}
                    >
                      <span
                        className={`grid size-11 shrink-0 place-items-center rounded-xl ${service.tint}`}
                      >
                        <Icon className="size-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="block font-medium">{service.name}</span>
                        <span className="block truncate text-sm text-muted-foreground">
                          {isOn ? service.connectedDetail : service.detail}
                        </span>
                      </div>
                      <button
                        onClick={() => handleConnectService(service)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                          isOn
                            ? "bg-chip-active text-chip-active-foreground"
                            : "border border-border bg-surface text-foreground hover:bg-tile"
                        }`}
                      >
                        {isOn ? (
                          <>
                            <Check className="size-3.5 text-brand-blue" />
                            Connected
                          </>
                        ) : (
                          "Connect"
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 text-center">
                <button
                  onClick={() => setShowMore((prev) => !prev)}
                  className="text-sm font-medium text-foreground hover:text-brand-blue transition-colors cursor-pointer"
                >
                  {showMore ? "Show less" : `Load more (${extraServices.length})`}
                </button>
              </div>

              {connectedCount > 0 && (
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  {connectedCount} service{connectedCount === 1 ? "" : "s"} connected
                </p>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-[22px]">Upload files</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Optionally upload spreadsheets, documents, or reports for analysis. You can
                    skip this and add files later in Data Center.
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".csv,.xlsx,.xls,.pdf,.json,.txt"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="shrink-0 inline-flex items-center gap-2 rounded-full bg-chip-active px-4 py-2 text-sm font-medium text-chip-active-foreground hover:opacity-90 transition cursor-pointer"
                >
                  <UploadCloud className="size-4" />
                  Upload file
                </button>
              </div>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="mt-5 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-tile/50 p-6 text-center cursor-pointer hover:bg-tile transition"
              >
                <UploadCloud className="mb-2 size-6 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">
                  Click to select files or drag and drop
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">CSV, Excel, or PDF files</p>
              </div>

              <div className="mt-5">
                <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                  Uploaded files ({files.length})
                </h3>
                <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border">
                  {files.map((file) => (
                    <li
                      key={file.name}
                      className="flex items-center gap-4 p-4 hover:bg-tile transition"
                    >
                      <Table2 className="size-4 shrink-0 text-muted-foreground" />
                      <div className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{file.name}</span>
                        <span className="block text-xs text-muted-foreground">
                          {file.size} · {file.updated}
                        </span>
                      </div>
                      <button
                        onClick={() => removeFile(file.name)}
                        className="rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-surface transition cursor-pointer"
                        aria-label="Remove file"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </li>
                  ))}
                  {files.length === 0 && (
                    <li className="p-4 text-center text-sm text-muted-foreground">
                      No files uploaded yet.
                    </li>
                  )}
                </ul>
              </div>
            </>
          )}

          {step === 3 && (
            <div className="py-8 text-center">
              <CheckCircle2 className="mx-auto size-12 text-positive" />
              <h2 className="mt-4 text-[22px]">You&apos;re ready</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                {connectedCount > 0
                  ? `${connectedCount} service${connectedCount === 1 ? "" : "s"} connected`
                  : "No services connected yet"}
                {files.length > 0
                  ? ` · ${files.length} file${files.length === 1 ? "" : "s"} uploaded`
                  : ""}
                . CXO will start detecting cases from your linked sources.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-surface hover:opacity-90 transition"
                >
                  Go to dashboard
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  to="/data-center"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-tile transition"
                >
                  Open Data Center
                </Link>
              </div>
            </div>
          )}

          {step > 0 && step < 3 && (
            <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-tile transition cursor-pointer"
              >
                Back
              </button>
              {step === 1 && (
                <button
                  onClick={() => setStep(2)}
                  disabled={!canContinueFromConnect}
                  className="inline-flex items-center gap-2 rounded-full bg-chip-active px-5 py-2.5 text-sm font-medium text-chip-active-foreground disabled:opacity-40 cursor-pointer"
                >
                  Continue
                  <ArrowRight className="size-4" />
                </button>
              )}
              {step === 2 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={finishSetup}
                    disabled={finishing}
                    className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-tile transition cursor-pointer disabled:opacity-70"
                  >
                    Skip
                  </button>
                  <button
                    onClick={finishSetup}
                    disabled={finishing}
                    className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-surface disabled:opacity-70 cursor-pointer"
                  >
                    {finishing && <Loader2 className="size-4 animate-spin" />}
                    {finishing ? "Finishing…" : "Finish setup"}
                    {!finishing && <ArrowRight className="size-4" />}
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {connectingServiceName && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="flex w-full max-w-sm flex-col items-center space-y-5 rounded-3xl border border-border/80 bg-surface p-8 text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="relative flex items-center justify-center">
              <div className="size-16 animate-spin rounded-full border-3 border-brand-blue/20 border-t-brand-blue" />
              <div className="absolute flex size-9 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                <RotateCw className="size-5 animate-spin" />
              </div>
            </div>
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-widest text-brand-blue">
                Live Data Integration
              </span>
              <h3 className="text-lg font-semibold text-foreground">
                Connecting {connectingServiceName}
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Authorizing enterprise OAuth credentials, establishing secure socket pipelines, and
                synchronizing operational feeds...
              </p>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-tile">
              <div className="h-full w-4/5 animate-pulse rounded-full bg-brand-blue" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
