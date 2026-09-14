import { useState, useRef, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Menu,
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  Clock,
  Cloud,
  Database,
  FileText,
  Landmark,
  Loader2,
  Megaphone,
  Radio,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
  TrendingUp,
  UploadCloud,
  Users,
  Workflow,
} from "lucide-react";
import { MainMenuDrawer } from "../components/MainMenuDrawer";

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

type ServiceId = "goodDoc" | "goodBank" | "workflowAgent" | "snowflake" | "bigQuery";

interface ServiceItem {
  id: ServiceId;
  name: string;
  detail: string;
  connectedDetail: string;
  dataCount: string;
  summary: string;
  icon: typeof FileText;
  tint: string;
}

const services: ServiceItem[] = [
  {
    id: "goodDoc",
    name: "Good Doc",
    detail: "Hospital operating system",
    connectedDetail: "Docs & Workspace linked",
    dataCount: "14 clinical tables synced",
    summary: "Clinical records, inventory catalogs, and patient admissions are now synced.",
    icon: FileText,
    tint: "bg-[oklch(0.93_0.05_255)] text-[oklch(0.5_0.16_255)]",
  },
  {
    id: "goodBank",
    name: "Good Bank",
    detail: "Banking & Treasury API",
    connectedDetail: "Treasury accounts linked",
    dataCount: "8 treasury accounts synced",
    summary: "Operating accounts, payment gateways, and ledger records are now connected.",
    icon: Landmark,
    tint: "bg-[oklch(0.93_0.06_150)] text-[oklch(0.48_0.14_150)]",
  },
  {
    id: "workflowAgent",
    name: "Workflow Agent",
    detail: "Automated data workflows",
    connectedDetail: "Pipeline execution active",
    dataCount: "6 execution pipelines active",
    summary: "Automated operational alerts and task schedulers are now live.",
    icon: Workflow,
    tint: "bg-[oklch(0.93_0.06_300)] text-[oklch(0.52_0.15_300)]",
  },
  {
    id: "snowflake",
    name: "Snowflake",
    detail: "Enterprise Data Warehouse",
    connectedDetail: "Warehouse link synced",
    dataCount: "22 EDW tables synced",
    summary: "Enterprise warehouse schemas and analytics partitions are now integrated.",
    icon: Cloud,
    tint: "bg-[oklch(0.93_0.05_220)] text-[oklch(0.5_0.15_220)]",
  },
  {
    id: "bigQuery",
    name: "BigQuery",
    detail: "Google Cloud analytics",
    connectedDetail: "Analytics pipeline active",
    dataCount: "18 analytics datasets synced",
    summary: "Streaming event pipelines and analytical models are now connected.",
    icon: Database,
    tint: "bg-[oklch(0.94_0.05_40)] text-[oklch(0.52_0.14_40)]",
  },
];

interface ConnectionStepDef {
  title: string;
  processingText: string;
  resultText: string;
}

const CONNECTION_STEPS: ConnectionStepDef[] = [
  {
    title: "Checking subscription",
    processingText: "Verifying user subscription entitlement…",
    resultText: "Valid subscription found",
  },
  {
    title: "Identifying organization",
    processingText: "Locating organization associated with your account…",
    resultText: "Baines Healthcare organization found",
  },
  {
    title: "Configuring agent for your organization",
    processingText: "Configuring CXO agent models and clinical parameters…",
    resultText: "Agent configured for Baines Healthcare",
  },
  {
    title: "Completing configuration",
    processingText: "Performing final validation and workspace setup…",
    resultText: "Configuration completed successfully",
  },
];

interface SampleDataSetGuide {
  dataset: string;
  examples: string;
  howItHelps: string;
  icon: typeof FileText;
  tint: string;
}

const SAMPLE_DATASETS_GUIDE: SampleDataSetGuide[] = [
  {
    dataset: "Marketing Campaign Data",
    examples: "Campaign performance, ad spend, leads, conversions, channel performance",
    howItHelps:
      "Identify which campaigns are driving growth, where spend is inefficient, and which channels need attention",
    icon: Megaphone,
    tint: "bg-[oklch(0.93_0.05_255)] text-[oklch(0.5_0.16_255)]",
  },
  {
    dataset: "CRM Data",
    examples: "Leads, opportunities, customer accounts, sales pipeline, deal stages",
    howItHelps:
      "Understand pipeline health, customer movement, sales performance, and potential revenue risks",
    icon: Users,
    tint: "bg-[oklch(0.93_0.06_150)] text-[oklch(0.48_0.14_150)]",
  },
  {
    dataset: "Vendor Data",
    examples: "Vendor contracts, purchase history, pricing, delivery records, vendor performance",
    howItHelps:
      "Identify vendor cost increases, purchasing inefficiencies, dependency risks, and potential savings",
    icon: ShoppingBag,
    tint: "bg-[oklch(0.93_0.06_300)] text-[oklch(0.52_0.15_300)]",
  },
  {
    dataset: "Internal Audit Reports",
    examples: "Audit findings, compliance issues, control gaps, previous audit reports",
    howItHelps:
      "Surface recurring issues, unresolved risks, and areas requiring management attention",
    icon: ShieldCheck,
    tint: "bg-[oklch(0.94_0.05_40)] text-[oklch(0.52_0.14_40)]",
  },
  {
    dataset: "Financial Data",
    examples: "Budgets, forecasts, P&L, cash flow, expense reports",
    howItHelps:
      "Compare actual performance against plans and identify financial trends, anomalies, and risks",
    icon: Landmark,
    tint: "bg-[oklch(0.93_0.05_200)] text-[oklch(0.48_0.15_200)]",
  },
  {
    dataset: "Sales Data",
    examples: "Sales transactions, product performance, regional sales, customer segments",
    howItHelps:
      "Identify revenue drivers, declining products, underperforming regions, and unusual sales patterns",
    icon: BarChart3,
    tint: "bg-[oklch(0.94_0.06_70)] text-[oklch(0.52_0.16_70)]",
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
}

type ViewMode = "select" | "connecting" | "connected" | "upload";

function WelcomePage() {
  const [viewMode, setViewMode] = useState<ViewMode>("select");
  const [connectingService, setConnectingService] = useState<ServiceItem | null>(null);
  const [connectedServices, setConnectedServices] = useState<Record<ServiceId, boolean>>({
    goodDoc: false,
    goodBank: false,
    workflowAgent: false,
    snowflake: false,
    bigQuery: false,
  });
  const [connectionTimestamp, setConnectionTimestamp] = useState<string>("");

  // 5-step sequential progress state: 0 to 5
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  // Supporting documents
  const [supportingFiles, setSupportingFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);

  const connectedCount = Object.values(connectedServices).filter(Boolean).length;

  // Handle clicking Connect on a service
  const handleStartConnect = (service: ServiceItem) => {
    if (connectedServices[service.id]) {
      // Toggle off if already connected
      setConnectedServices((prev) => ({ ...prev, [service.id]: false }));
      return;
    }
    setConnectingService(service);
    setCurrentStepIndex(0);
    setViewMode("connecting");
  };

  // Run the 4 sequential steps strictly when in connecting mode
  useEffect(() => {
    if (viewMode !== "connecting" || !connectingService) {
      setCurrentStepIndex(0);
      return;
    }

    // Step durations: realistic loading times for subscription, org, agent config, and finalization
    const stepDurations = [2800, 2600, 3200, 2400];
    let step = 0;
    let timerId: NodeJS.Timeout;
    let active = true;

    const advanceStep = () => {
      if (!active) return;
      timerId = setTimeout(() => {
        if (!active) return;
        step++;
        setCurrentStepIndex(step);

        if (step < CONNECTION_STEPS.length) {
          advanceStep();
        } else {
          // All 4 steps completed!
          const now = new Date();
          const formatted = `${now.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })} at ${now.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}`;
          setConnectionTimestamp(formatted);
          setConnectedServices((prev) => ({
            ...prev,
            [connectingService.id]: true,
          }));

          // Automatically transition to the connected screen after brief pause to review all completed results
          timerId = setTimeout(() => {
            if (!active) return;
            setViewMode("connected");
          }, 1200);
        }
      }, stepDurations[step] || 2500);
    };

    advanceStep();

    return () => {
      active = false;
      clearTimeout(timerId);
    };
  }, [viewMode, connectingService]);

  const handleCancelConnection = () => {
    setViewMode("select");
    setConnectingService(null);
    setCurrentStepIndex(0);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const allowedExtensions = [".csv", ".pdf", ".parquet"];
    const validFiles = Array.from(e.target.files).filter((f) => {
      const ext = "." + (f.name.split(".").pop()?.toLowerCase() || "");
      return allowedExtensions.includes(ext);
    });
    const newFiles: UploadedFile[] = validFiles.map((f) => ({
      name: f.name,
      size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
    }));
    setSupportingFiles((prev) => [...newFiles, ...prev]);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!e.dataTransfer.files?.length) return;
    const allowedExtensions = [".csv", ".pdf", ".parquet"];
    const validFiles = Array.from(e.dataTransfer.files).filter((f) => {
      const ext = "." + (f.name.split(".").pop()?.toLowerCase() || "");
      return allowedExtensions.includes(ext);
    });
    const newFiles: UploadedFile[] = validFiles.map((f) => ({
      name: f.name,
      size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
    }));
    setSupportingFiles((prev) => [...newFiles, ...prev]);
  };

  const removeFile = (name: string) => {
    setSupportingFiles((prev) => prev.filter((f) => f.name !== name));
  };

  // Progress percentage calculation: realistic progression for 4 steps
  const progressPercent = (() => {
    switch (currentStepIndex) {
      case 0:
        return 25;
      case 1:
        return 50;
      case 2:
        return 75;
      case 3:
        return 92;
      case 4:
        return 100;
      default:
        return 0;
    }
  })();

  const onboardingSteps = ["Select Service", "Sync & validate", "Connect data", "Add files"];
  const currentStepNum =
    viewMode === "select"
      ? 0
      : viewMode === "connecting"
        ? 1
        : viewMode === "connected"
          ? 2
          : 3;

  return (
    <div className="min-h-screen bg-surface-tint font-sans text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 h-16 bg-[#072333] border-b border-[#0f354c] flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMainMenuOpen(true)}
            className="rounded-full p-2 hover:bg-white/10 transition cursor-pointer"
            aria-label="Main menu"
          >
            <Menu className="size-6 text-sky-100" />
          </button>
          <Link
            to="/"
            className="text-xl sm:text-[22px] font-semibold text-white hover:opacity-85 transition cursor-pointer"
            title="CXO Home"
          >
            CXO
          </Link>
        </div>

        {/* Profile on right */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center rounded-full border border-sky-300/35 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-white/20 transition cursor-pointer mr-1"
          >
            Skip for now
          </Link>
          <div className="text-right">
            <p className="text-sm font-medium leading-none text-white">Robert</p>
            <p className="text-xs text-sky-200/70 mt-1">Chief Executive Officer</p>
          </div>
          <span className="grid size-9 place-items-center rounded-full bg-[oklch(0.68_0.15_55)] text-sm font-medium text-white shadow-xs">
            R
          </span>
        </div>
      </header>

      <main className={`mx-auto w-full px-4 py-8 sm:py-10 transition-all duration-300 ${viewMode === "upload" ? "max-w-4xl" : "max-w-2xl"}`}>
        {/* Minimal Onboarding Stepper Header */}
        <ol className="mb-6 flex items-center justify-center gap-2 rounded-2xl bg-surface p-3 text-xs sm:text-sm border border-border/50">
          {onboardingSteps.map((label, i) => (
            <li key={label} className="flex items-center gap-2">
              <span
                className={`grid size-6 place-items-center rounded-full text-xs font-['Archivo'] tabular-nums ${i < currentStepNum
                  ? "bg-emerald-500 text-white"
                  : i === currentStepNum
                    ? "bg-foreground text-surface font-semibold"
                    : "bg-tile text-muted-foreground"
                  }`}
              >
                {i < currentStepNum ? (
                  <Check className="size-3.5 stroke-[2.5]" />
                ) : (
                  i + 1
                )}
              </span>
              <span
                className={
                  i === currentStepNum
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                }
              >
                {label}
              </span>
              {i < onboardingSteps.length - 1 && (
                <span className="mx-2 text-border">—</span>
              )}
            </li>
          ))}
        </ol>

        {/* STEP 1: SELECT / CONNECT SOURCES */}
        {viewMode === "select" && (
          <div className="space-y-6">
            <section className="rounded-3xl bg-surface p-6 sm:p-8 border border-border/60">
              <div className="welcome-app-banner rounded-2xl bg-[linear-gradient(135deg,oklch(0.94_0.03_230),oklch(0.97_0.01_250)_55%,oklch(0.95_0.025_200))] px-6 py-7">
                <p className="text-[11px] font-bold uppercase tracking-widest text-brand-blue">
                  Ready when your data is
                </p>
                <h1
                  className="mt-2 text-2xl sm:text-3xl font-semibold leading-tight tracking-tight text-foreground"
                  style={{ fontFamily: "Syne, Archivo, sans-serif" }}
                >
                  Welcome. Your Data ops, finally readable.
                </h1>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  Connect at least one source to start detecting cases in CXO.
                </p>
              </div>

              <div className="mt-6">
                <div className="mb-3.5 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-foreground">
                    Available Sources
                  </h2>
                  {connectedCount > 0 && (
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      {connectedCount} connected
                    </span>
                  )}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {services.map((service) => {
                    const Icon = service.icon;
                    const isOn = connectedServices[service.id];
                    return (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => handleStartConnect(service)}
                        className={`flex w-full items-center gap-3.5 rounded-2xl border p-4 text-left transition cursor-pointer ${isOn
                          ? "border-brand-blue/80 bg-tile"
                          : "border-border/80 bg-surface hover:bg-tile"
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
                          <span className="block truncate text-xs text-muted-foreground mt-0.5">
                            {isOn ? service.connectedDetail : service.detail}
                          </span>
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${isOn
                            ? "bg-chip-active text-chip-active-foreground"
                            : "border border-border text-foreground hover:bg-tile"
                            }`}
                        >
                          {isOn ? (
                            <>
                              <Check className="size-3 text-brand-blue stroke-[2.5]" />
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

              {connectedCount > 0 && (
                <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-5">
                  <p className="text-xs text-muted-foreground">
                    Sources are connected. Ready to proceed.
                  </p>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-surface transition hover:opacity-90"
                  >
                    Go to dashboard
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              )}
            </section>

            {/* Unlocks Overview */}
            <section className="rounded-3xl bg-surface p-6 border border-border/60">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-brand-blue" />
                <h2
                  className="text-base font-semibold text-foreground"
                  style={{ fontFamily: "Syne, Archivo, sans-serif" }}
                >
                  See what CXO unlocks
                </h2>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                After you connect, these capabilities turn on in your workspace.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {unlocks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 rounded-2xl bg-tile/70 p-3.5"
                    >
                      <span
                        className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl ${item.tint}`}
                      >
                        <Icon className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {item.title}
                        </p>
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

        {/* STEP 2: IN-PAGE SEQUENTIAL PROGRESS SCREEN (NO POPUP) */}
        {viewMode === "connecting" && connectingService && (
          <section className="rounded-3xl bg-surface p-6 sm:p-8 border border-border/60">
            {/* Header with Hierarchy */}
            <div className="flex items-center gap-4">
              <div
                className={`grid size-12 shrink-0 place-items-center rounded-2xl ${connectingService.tint}`}
              >
                {(() => {
                  const Icon = connectingService.icon;
                  return <Icon className="size-6" />;
                })()}
              </div>
              <div className="min-w-0">
                <h2
                  className="text-xl sm:text-2xl font-semibold text-foreground"
                  style={{ fontFamily: "Syne, Archivo, sans-serif" }}
                >
                  Connecting {connectingService.name}
                </h2>
                <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground truncate">
                  Validating subscription entitlement, organization, and agent configuration.
                </p>
              </div>
            </div>

            {/* Gradient Progress Bar */}
            <div className="mt-8">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span className="font-medium text-foreground">
                  Step {Math.min(currentStepIndex + 1, 4)} of 4 · {CONNECTION_STEPS[Math.min(currentStepIndex, 3)]?.title ?? ""}
                </span>
                <span className="font-['Archivo'] tabular-nums font-semibold text-brand-blue">
                  {progressPercent}%
                </span>
              </div>
              <div className="h-2.5 w-full bg-tile rounded-full overflow-hidden p-0.5 border border-border/60">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 via-blue-600 to-indigo-500 rounded-full transition-all duration-700 ease-out shadow-xs"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* 4 Sequential Steps with Clear Hierarchy & Actual Results */}
            <div className="mt-6 space-y-3">
              {CONNECTION_STEPS.map((step, idx) => {
                const isCompleted = idx < currentStepIndex;
                const isActive = idx === currentStepIndex && currentStepIndex < 4;

                return (
                  <div
                    key={step.title}
                    className={`loader-step-box flex items-start gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-500 ease-in-out ${isActive
                      ? "loader-step-active-bg shadow-xs opacity-100 scale-[1.01]"
                      : isCompleted
                        ? "bg-surface border border-border/40 opacity-95 scale-100"
                        : "bg-surface border border-transparent opacity-60 scale-100"
                      }`}
                  >
                    {/* Status Icon */}
                    <div className="shrink-0 mt-0.5">
                      {isCompleted ? (
                        <span className="grid size-7 place-items-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                          <Check className="size-4 stroke-[2.5]" />
                        </span>
                      ) : isActive ? (
                        <span className="grid size-7 place-items-center rounded-full bg-brand-blue/20 text-brand-blue shadow-2xs">
                          <Loader2 className="size-4 animate-spin stroke-[2.5]" />
                        </span>
                      ) : (
                        <span className="grid size-7 place-items-center rounded-full bg-tile text-muted-foreground/60 text-xs font-medium font-['Archivo']">
                          {idx + 1}
                        </span>
                      )}
                    </div>

                    {/* Step Title & Result/Processing Detail */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`${isActive
                            ? "text-sm font-semibold text-foreground"
                            : isCompleted
                              ? idx < 2
                                ? "text-xs font-medium text-muted-foreground"
                                : "text-sm font-medium text-foreground"
                              : "text-sm text-muted-foreground/70"
                            }`}
                        >
                          {idx < 2 && isCompleted ? `Step ${idx + 1} · ${step.title}` : step.title}
                        </span>

                        {/* Status Badge */}
                        <div className="shrink-0 text-xs">
                          {isCompleted ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                              Completed
                            </span>
                          ) : isActive ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-brand-blue/15 px-2 py-0.5 text-[11px] font-semibold text-brand-blue animate-pulse">
                              Processing…
                            </span>
                          ) : (
                            <span className="text-muted-foreground/40 font-normal text-[11px]">
                              Waiting
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Display realistic loading state beneath the step while active */}
                      {isActive && (
                        <p className="mt-1 text-xs text-brand-blue/90 animate-pulse">
                          {step.processingText}
                        </p>
                      )}

                      {/* Minimal small white card with checkbox only for Steps 1 & 2 */}
                      {isCompleted && idx < 2 && (
                        <div className="mt-2 inline-flex items-center gap-2 rounded-xl border border-border/80 bg-surface px-3 py-1.5 shadow-2xs animate-in fade-in slide-in-from-top-1 duration-200">
                          <div className="size-4 shrink-0 rounded-[4px] border border-emerald-600 bg-emerald-600 text-white flex items-center justify-center">
                            <Check className="size-2.5 stroke-[3]" />
                          </div>
                          {idx === 1 && (
                            <img
                              src="/baines-logo.png"
                              alt="Baines Healthcare"
                              className="h-4.5 w-auto object-contain shrink-0"
                            />
                          )}
                          <span className="text-xs sm:text-sm font-medium text-foreground">
                            {step.resultText}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Minimal Footer with Relevant Spacing */}
            <div className="mt-8 pt-5 border-t border-border/60 flex items-center justify-between">
              <button
                type="button"
                onClick={handleCancelConnection}
                className="text-xs text-muted-foreground hover:text-foreground transition cursor-pointer"
              >
                Cancel connection
              </button>
              <span className="text-xs text-muted-foreground/60">
                TLS 1.3 mTLS authenticated
              </span>
            </div>
          </section>
        )}

        {/* STEP 3: CONNECTED CONFIRMATION (ONLY ONE BUTTON: NEXT) */}
        {viewMode === "connected" && connectingService && (
          <section className="rounded-3xl bg-surface p-6 sm:p-10 border border-border/60 text-center">
            <div className="py-4">
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mb-5">
                <CheckCircle2 className="size-9 stroke-[2]" />
              </div>
              <h2
                className="text-2xl sm:text-3xl font-semibold text-foreground"
                style={{ fontFamily: "Syne, Archivo, sans-serif" }}
              >
                {connectingService.name} connected
              </h2>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
                Agent configured for <span className="inline-flex items-center gap-1.5 font-semibold text-foreground align-middle"><img src="/baines-logo.png" alt="Baines Healthcare" className="h-4 w-auto inline-block object-contain" />Baines Healthcare</span>. Data has been verified and continuous synchronization is active.
              </p>
            </div>

            {/* ONLY ONE BUTTON: Next */}
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setViewMode("upload")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-9 py-3 text-sm font-semibold text-surface transition hover:opacity-90 shadow-xs cursor-pointer"
              >
                Next
                <ArrowRight className="size-4" />
              </button>
            </div>
          </section>
        )}

        {/* STEP 4: ADDITIONAL DATA UPLOAD PAGE */}
        {viewMode === "upload" && (
          <section className="rounded-3xl bg-surface p-6 sm:p-10 border border-border/60">
            <div className="text-center">
              <h2
                className="text-2xl sm:text-3xl font-semibold text-foreground"
                style={{ fontFamily: "Syne, Archivo, sans-serif" }}
              >
                Have additional files to upload?
              </h2>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Add additional business data to help your agents deliver more informed and relevant insights.</p>
            </div>

            {/* Auto-scrolling Data Sets Guide Boxes */}
            <div className="mt-8 relative overflow-hidden py-1">
              {/* Soft edge blur/gradient masks */}
              <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-surface to-transparent z-10" />
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-surface to-transparent z-10" />

              <div className="animate-auto-scroll flex gap-3.5">
                {[...SAMPLE_DATASETS_GUIDE, ...SAMPLE_DATASETS_GUIDE].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={`${item.dataset}-${idx}`}
                      className="w-[260px] sm:w-[290px] shrink-0 flex flex-col justify-start rounded-2xl border border-border/70 bg-tile/45 p-4 transition-all duration-200 hover:bg-tile/70 hover:border-brand-blue/35 hover:shadow-xs"
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <span className={`grid size-8 shrink-0 place-items-center rounded-xl ${item.tint}`}>
                          <Icon className="size-4" />
                        </span>
                        <h4 className="text-xs sm:text-sm font-semibold text-foreground leading-snug">
                          {item.dataset}
                        </h4>
                      </div>

                      <p className="text-xs leading-relaxed text-foreground/80 font-normal">
                        {item.howItHelps}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* File Upload Option (Only CSV, PDF, and Parquet) */}
            <div className="mt-8 pt-6 border-t border-border/60">
              {/* Hidden File Input */}
              <input
                type="file"
                multiple
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileUpload}
                accept=".csv,.pdf,.parquet"
              />

              {/* Upload Area Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-tile/40 p-7 text-center transition hover:bg-tile/70 hover:border-brand-blue/50"
              >
                <UploadCloud className="mb-2.5 size-8 text-brand-blue/80" />
                <p className="text-sm font-medium text-foreground">
                  Click to upload files or drag and drop
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Only CSV, PDF, and Parquet are supported up to 50MB
                </p>
              </div>
            </div>

            {/* Uploaded Files List */}
            {supportingFiles.length > 0 && (
              <div className="mt-5 max-w-md mx-auto space-y-2 text-left">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Selected files ({supportingFiles.length})
                </p>
                {supportingFiles.map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-tile/50 px-3.5 py-2.5 text-sm"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="size-4 shrink-0 text-brand-blue" />
                      <span className="truncate font-medium text-foreground text-xs sm:text-sm">
                        {file.name}
                      </span>
                      <span className="text-xs text-muted-foreground font-['Archivo'] shrink-0">
                        {file.size}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(file.name)}
                      className="p-1 rounded-full hover:bg-surface text-muted-foreground hover:text-foreground transition cursor-pointer"
                      title="Remove file"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons: Option to skip, or go to dashboard */}
            <div className="mt-8 border-t border-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <Link
                to="/"
                className="w-full sm:w-auto order-2 sm:order-1 inline-flex items-center justify-center rounded-full border border-border/90 bg-tile px-7 py-2.5 text-sm font-semibold text-foreground hover:bg-tile/80 hover:border-foreground/30 transition text-center shadow-2xs cursor-pointer"
              >
                Skip for now
              </Link>
              <Link
                to="/"
                className="w-full sm:w-auto order-1 sm:order-2 inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-8 py-2.5 text-sm font-semibold text-surface transition hover:opacity-90 text-center shadow-xs cursor-pointer"
              >
                Go to dashboard
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </section>
        )}
      </main>

      {/* Main Navigation Drawer with Files & Add File capability */}
      <MainMenuDrawer
        isOpen={isMainMenuOpen}
        onClose={() => setIsMainMenuOpen(false)}
        onFileAdded={(file) => {
          const sizeStr =
            file.size > 1024 * 1024
              ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
              : `${Math.round(file.size / 1024)} KB`;
          setSupportingFiles((prev) => [
            ...prev,
            { name: file.name, size: sizeStr },
          ]);
        }}
      />
    </div>
  );
}
