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
  Radio,
  RotateCw,
  ShieldCheck,
  Sparkles,
  Table2,
  Trash2,
  TrendingUp,
  UploadCloud,
  Workflow,
} from "lucide-react";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "Welcome — CXO" },
      {
        name: "description",
        content:
          "Welcome to CXO. Connect Good Doc, Good Bank, and operational data to get started.",
      },
      { property: "og:title", content: "Welcome — CXO" },
      {
        property: "og:description",
        content: "Connect Good Doc, Good Bank, Workflow Agent, Snowflake, or BigQuery to begin.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700;800&display=swap",
      },
    ],
  }),
  component: WelcomePage,
});

const steps = ["Welcome", "Upload files", "Ready"];

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
    connectedDetail: "Docs & Workspace linked",
    icon: FileText,
    tint: "bg-[oklch(0.93_0.05_255)] text-[oklch(0.5_0.16_255)]",
  },
  {
    id: "goodBank",
    name: "Good Bank",
    detail: "Banking & Treasury API",
    connectedDetail: "Treasury accounts linked",
    icon: Landmark,
    tint: "bg-[oklch(0.93_0.06_150)] text-[oklch(0.48_0.14_150)]",
  },
  {
    id: "workflowAgent",
    name: "Workflow Agent",
    detail: "Automated data workflows",
    connectedDetail: "Pipeline execution active",
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
    connectedDetail: "Analytics pipeline active",
    icon: Database,
    tint: "bg-[oklch(0.94_0.05_40)] text-[oklch(0.52_0.14_40)]",
  },
];

const unlocks = [
  {
    id: "cases",
    title: "Case intelligence",
    body: "Surface ops drift as actionable cases.",
    icon: Radio,
    tint: "bg-[oklch(0.93_0.05_255)] text-[oklch(0.5_0.16_255)]",
  },
  {
    id: "connectors",
    title: "Live connectors",
    body: "Keep Good Doc and Good Bank in sync.",
    icon: Landmark,
    tint: "bg-[oklch(0.93_0.06_150)] text-[oklch(0.48_0.14_150)]",
  },
  {
    id: "feed",
    title: "Executive feed",
    body: "Revenue and care signals in one stream.",
    icon: TrendingUp,
    tint: "bg-[oklch(0.94_0.05_40)] text-[oklch(0.52_0.14_40)]",
  },
  {
    id: "intake",
    title: "Enterprise intake",
    body: "Upload internal files when systems lag.",
    icon: ShieldCheck,
    tint: "bg-[oklch(0.93_0.04_280)] text-[oklch(0.5_0.12_280)]",
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
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [finishing, setFinishing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const connectedCount = Object.values(connected).filter(Boolean).length;
  const canContinue = connectedCount > 0;

  const handleConnectService = (service: (typeof services)[number]) => {
    if (connected[service.id]) {
      setConnected((prev) => ({ ...prev, [service.id]: false }));
      return;
    }
    setConnectingServiceName(service.name);
    setTimeout(() => {
      setConnected((prev) => ({ ...prev, [service.id]: true }));
      setConnectingServiceName(null);
    }, 1200);
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
      setStep(2);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-surface-tint font-sans text-foreground">
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border/60 bg-background/95 px-4 backdrop-blur-md sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid size-8 place-items-center rounded-full bg-[oklch(0.68_0.15_55)] text-xs font-semibold text-surface shadow-xs">
            CX
          </span>
          <span
            className="text-lg tracking-tight sm:text-xl"
            style={{ fontFamily: "Syne, Archivo, sans-serif" }}
          >
            CXO
          </span>
        </div>
        {step < 2 && (
          <Link
            to="/"
            className="text-sm text-muted-foreground transition hover:text-foreground"
          >
            Skip for now
          </Link>
        )}
      </header>

      <main className="mx-auto w-full max-w-3xl px-3 py-6 sm:px-6 sm:py-8">
        {step > 0 && step < 2 && (
          <ol className="mb-4 flex flex-wrap items-center gap-2 rounded-2xl bg-surface p-3.5 text-sm">
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
                {i < steps.length - 1 && <span className="mx-1 text-border">—</span>}
              </li>
            ))}
          </ol>
        )}

        {step === 0 && (
          <div className="space-y-4">
            {/* Main app banner */}
            <section className="overflow-hidden rounded-3xl bg-surface p-5 sm:p-7">
              <div className="welcome-app-banner rounded-2xl bg-[linear-gradient(135deg,oklch(0.94_0.03_230),oklch(0.97_0.01_250)_55%,oklch(0.95_0.025_200))] px-5 py-6 sm:px-7 sm:py-8">
                <p className="text-[11px] font-bold uppercase tracking-widest text-brand-blue">
                  Ready when your data is
                </p>
                <h1
                  className="mt-2 max-w-xl text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl"
                  style={{ fontFamily: "Syne, Archivo, sans-serif" }}
                >
                  Welcome. Your Data ops, finally readable.
                </h1>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
                  Connect at least one source to start detecting cases in CXO.
                </p>
              </div>

              <div className="mt-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="text-sm font-semibold text-foreground">Connect</h2>
                  {connectedCount > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {connectedCount} connected
                    </span>
                  )}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {services.map((service) => {
                    const Icon = service.icon;
                    const isOn = connected[service.id];
                    return (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => handleConnectService(service)}
                        className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition cursor-pointer ${
                          isOn
                            ? "border-brand-blue bg-tile"
                            : "border-border bg-surface hover:bg-tile"
                        }`}
                      >
                        <span
                          className={`grid size-10 shrink-0 place-items-center rounded-xl ${service.tint}`}
                        >
                          <Icon className="size-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium text-foreground">
                            {service.name}
                          </span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {isOn ? service.connectedDetail : service.detail}
                          </span>
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                            isOn
                              ? "bg-chip-active text-chip-active-foreground"
                              : "border border-border text-foreground"
                          }`}
                        >
                          {isOn ? (
                            <>
                              <Check className="size-3 text-brand-blue" />
                              Connected
                            </>
                          ) : (
                            "Connect"
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
                <p className="text-xs text-muted-foreground">
                  {canContinue
                    ? "Continue to optional file upload, or finish later."
                    : "Connect one source to continue."}
                </p>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={!canContinue}
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-surface transition hover:opacity-90 disabled:opacity-40 cursor-pointer"
                >
                  Continue
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </section>

            {/* Small unlocks section */}
            <section className="rounded-3xl bg-surface p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-brand-blue" />
                <h2
                  className="text-base font-semibold text-foreground sm:text-lg"
                  style={{ fontFamily: "Syne, Archivo, sans-serif" }}
                >
                  See what CXO unlocks
                </h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                After you connect, these capabilities turn on in your workspace.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {unlocks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 rounded-2xl bg-tile/80 p-3.5"
                    >
                      <span
                        className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl ${item.tint}`}
                      >
                        <Icon className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">{item.title}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                          {item.body}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {step === 1 && (
          <section className="rounded-3xl bg-surface p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  className="text-[22px] font-semibold"
                  style={{ fontFamily: "Syne, Archivo, sans-serif" }}
                >
                  Upload files
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Optional. Add spreadsheets or reports now, or skip and upload later in Data
                  Center.
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
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-chip-active px-4 py-2 text-sm font-medium text-chip-active-foreground transition hover:opacity-90 cursor-pointer"
              >
                <UploadCloud className="size-4" />
                Upload
              </button>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-tile/50 p-6 text-center transition hover:bg-tile"
            >
              <UploadCloud className="mb-2 size-6 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                Click to select files or drag and drop
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">CSV, Excel, or PDF</p>
            </div>

            <div className="mt-5">
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                Uploaded files ({files.length})
              </h3>
              <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border">
                {files.map((file) => (
                  <li
                    key={file.name}
                    className="flex items-center gap-4 p-4 transition hover:bg-tile"
                  >
                    <Table2 className="size-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{file.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {file.size} · {file.updated}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(file.name)}
                      className="rounded-full p-1.5 text-muted-foreground transition hover:bg-surface hover:text-foreground cursor-pointer"
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

            <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:bg-tile cursor-pointer"
              >
                Back
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={finishSetup}
                  disabled={finishing}
                  className="rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:bg-tile disabled:opacity-70 cursor-pointer"
                >
                  Skip
                </button>
                <button
                  type="button"
                  onClick={finishSetup}
                  disabled={finishing}
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-surface disabled:opacity-70 cursor-pointer"
                >
                  {finishing && <Loader2 className="size-4 animate-spin" />}
                  {finishing ? "Finishing…" : "Finish setup"}
                  {!finishing && <ArrowRight className="size-4" />}
                </button>
              </div>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="rounded-3xl bg-surface p-5 sm:p-7">
            <div className="py-6 text-center">
              <CheckCircle2 className="mx-auto size-12 text-positive" />
              <h2
                className="mt-4 text-[22px] font-semibold"
                style={{ fontFamily: "Syne, Archivo, sans-serif" }}
              >
                You&apos;re ready
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                {connectedCount} source{connectedCount === 1 ? "" : "s"} connected
                {files.length > 0
                  ? ` · ${files.length} file${files.length === 1 ? "" : "s"} uploaded`
                  : ""}
                . CXO can start detecting cases from your linked data.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-surface transition hover:opacity-90"
                >
                  Go to dashboard
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  to="/data-center"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition hover:bg-tile"
                >
                  Open Data Center
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      {connectingServiceName && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="flex w-full max-w-sm flex-col items-center space-y-5 rounded-3xl border border-border/80 bg-surface p-8 text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="relative flex items-center justify-center">
              <div className="size-16 animate-spin rounded-full border-[3px] border-brand-blue/20 border-t-brand-blue" />
              <div className="absolute flex size-9 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                <RotateCw className="size-5 animate-spin" />
              </div>
            </div>
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-widest text-brand-blue">
                Connecting
              </span>
              <h3 className="text-lg font-semibold text-foreground">{connectingServiceName}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Authorizing access and syncing feeds into your CXO workspace…
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
