import { useState, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDown,
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
          "Welcome to CXO. Connect Good Doc, Good Bank, and operational data to surface cases from day one.",
      },
      { property: "og:title", content: "Welcome — CXO" },
      {
        property: "og:description",
        content: "Connect Good Doc, Good Bank, and upload files to start analyzing cases.",
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

const featureBanners = [
  {
    id: "cases",
    number: "01",
    eyebrow: "Case intelligence",
    title: "Cases appear the moment ops drift",
    body: "CXO watches scheduling, billing, and clinical signals so anomalies become actionable cases—not buried reports.",
    icon: Radio,
    image: "/medical_scan.jpg",
    tone: "from-[oklch(0.26_0.05_248)] via-[oklch(0.32_0.07_235)] to-[oklch(0.38_0.06_220)]",
  },
  {
    id: "connect",
    number: "02",
    eyebrow: "Live connectors",
    title: "Good Doc and Good Bank, linked in minutes",
    body: "Authorize document and treasury feeds once. CXO keeps operational and financial context in the same workspace.",
    icon: Landmark,
    image: "/medical_lab.jpg",
    tone: "from-[oklch(0.28_0.06_165)] via-[oklch(0.33_0.07_185)] to-[oklch(0.37_0.06_205)]",
  },
  {
    id: "insights",
    number: "03",
    eyebrow: "Executive feed",
    title: "Revenue and care signals in one stream",
    body: "Margin pressure, wait-time spikes, and utilization gaps surface together so leadership can act with shared context.",
    icon: TrendingUp,
    image: "/medical_surgery.jpg",
    tone: "from-[oklch(0.30_0.06_45)] via-[oklch(0.34_0.07_50)] to-[oklch(0.38_0.06_60)]",
  },
  {
    id: "secure",
    number: "04",
    eyebrow: "Enterprise intake",
    title: "Upload internal files when systems lag",
    body: "Drop spreadsheets, audits, and PDFs into Data Center. Sensitive ops files stay inside your controlled workspace.",
    icon: ShieldCheck,
    image: "/medical_lab.jpg",
    tone: "from-[oklch(0.28_0.04_275)] via-[oklch(0.33_0.05_260)] to-[oklch(0.37_0.05_245)]",
  },
];

const journeySteps = [
  {
    label: "Connect",
    detail: "Link Good Doc, Good Bank, and the systems you already trust.",
  },
  {
    label: "Watch",
    detail: "CXO listens for drift across ops, revenue, and care signals.",
  },
  {
    label: "Act",
    detail: "Open cases with shared context before issues harden into crises.",
  },
];

const marqueeItems = [
  "Case detection",
  "Good Doc",
  "Good Bank",
  "Treasury signals",
  "Wait-time spikes",
  "OR utilization",
  "Workflow Agent",
  "Data Center intake",
  "Executive feed",
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
  const featuresRef = useRef<HTMLElement>(null);

  const primaryServices = services.slice(0, 3);
  const extraServices = services.slice(3);
  const visibleServices = showMore ? services : primaryServices;
  const connectedCount = Object.values(connected).filter(Boolean).length;
  const canContinueFromConnect = connectedCount > 0;

  const startConnect = () => setStep(1);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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

  if (step === 0) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-[oklch(0.965_0.012_225)] font-sans text-foreground">
        <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-[oklch(0.68_0.15_55)] text-sm font-semibold text-surface shadow-xs">
              CX
            </span>
            <span
              className="text-2xl tracking-tight text-surface sm:text-[28px]"
              style={{ fontFamily: "Syne, Archivo, sans-serif" }}
            >
              CXO
            </span>
          </div>
          <div className="flex items-center gap-5">
            <button
              onClick={scrollToFeatures}
              className="hidden text-sm text-surface/80 transition hover:text-surface sm:inline cursor-pointer"
            >
              Features
            </button>
            <Link to="/" className="text-sm text-surface/80 transition hover:text-surface">
              Skip for now
            </Link>
          </div>
        </header>

        {/* Full-bleed welcome hero */}
        <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden">
          <img
            src="/medical_surgery.jpg"
            alt=""
            className="absolute inset-0 size-full object-cover welcome-hero-pan"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.22_0.04_240_/0.42)_0%,oklch(0.17_0.05_230_/0.58)_45%,oklch(0.14_0.04_220_/0.92)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_12%,oklch(0.58_0.09_195_/0.28),transparent_52%)]" />

          <div className="relative z-10 w-full px-4 pb-16 pt-28 sm:px-8 sm:pb-20">
            <div className="welcome-hero-copy max-w-3xl">
              <p
                className="text-sm font-semibold uppercase tracking-[0.22em] text-[oklch(0.86_0.04_200)]"
                style={{ fontFamily: "Syne, Archivo, sans-serif" }}
              >
                Welcome customers
              </p>
              <h1
                className="mt-4 max-w-2xl text-4xl font-semibold leading-[1.04] tracking-tight text-surface sm:text-6xl lg:text-[4.25rem]"
                style={{ fontFamily: "Syne, Archivo, sans-serif" }}
              >
                Your hospital ops,
                <span className="block text-[oklch(0.88_0.05_195)]">finally readable.</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-surface/85 sm:text-lg">
                Connect Good Doc, Good Bank, and the rest of your stack so CXO can open cases
                before the next board deck is late.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={startConnect}
                  className="inline-flex items-center gap-2 rounded-full bg-surface px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-surface/95 cursor-pointer"
                >
                  Connect your data
                  <ArrowRight className="size-4" />
                </button>
                <button
                  onClick={scrollToFeatures}
                  className="inline-flex items-center gap-2 rounded-full border border-surface/35 bg-surface/10 px-5 py-3 text-sm font-medium text-surface backdrop-blur-sm transition hover:bg-surface/15 cursor-pointer"
                >
                  Explore feature banners
                  <ArrowDown className="size-4 welcome-bounce" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Moving capability ribbon */}
        <div className="border-y border-border/60 bg-surface py-3 overflow-hidden">
          <div className="welcome-marquee flex w-max gap-8 whitespace-nowrap px-4">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span
                key={`${item}-${i}`}
                className="inline-flex items-center gap-8 text-sm font-medium text-muted-foreground"
              >
                <span className="size-1.5 rounded-full bg-brand-blue" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Feature banners */}
        <section ref={featuresRef} className="px-4 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-[11px] font-bold uppercase tracking-widest text-brand-blue">
                  Feature banners
                </p>
                <h2
                  className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
                  style={{ fontFamily: "Syne, Archivo, sans-serif" }}
                >
                  What customers unlock in week one
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Four immersive banners—connectors, cases, executive signal, and secure intake—
                  mapped to the path from welcome to first live case.
                </p>
              </div>
              <button
                onClick={startConnect}
                className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium transition hover:bg-tile cursor-pointer sm:self-auto"
              >
                Start setup
                <ArrowRight className="size-4" />
              </button>
            </div>

            <div className="mt-10 space-y-5">
              {featureBanners.map((banner, index) => {
                const Icon = banner.icon;
                const reverse = index % 2 === 1;
                return (
                  <article
                    key={banner.id}
                    className={`welcome-banner group relative overflow-hidden rounded-[28px] bg-gradient-to-br ${banner.tone}`}
                    style={{ animationDelay: `${index * 90}ms` }}
                  >
                    <div
                      className={`grid min-h-[260px] items-stretch sm:min-h-[300px] ${
                        reverse
                          ? "sm:grid-cols-[1.08fr_0.92fr]"
                          : "sm:grid-cols-[0.92fr_1.08fr]"
                      }`}
                    >
                      <div
                        className={`relative flex flex-col justify-between p-6 sm:p-8 ${
                          reverse ? "sm:order-2" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <span className="grid size-11 place-items-center rounded-2xl bg-surface/15 text-surface backdrop-blur-sm">
                            <Icon className="size-5" />
                          </span>
                          <span
                            className="text-4xl font-semibold leading-none text-surface/20 sm:text-5xl"
                            style={{ fontFamily: "Syne, Archivo, sans-serif" }}
                          >
                            {banner.number}
                          </span>
                        </div>
                        <div className="mt-8 sm:mt-10">
                          <p className="text-[11px] font-bold uppercase tracking-widest text-surface/70">
                            {banner.eyebrow}
                          </p>
                          <h3
                            className="mt-2 max-w-md text-2xl font-semibold leading-tight text-surface sm:text-3xl"
                            style={{ fontFamily: "Syne, Archivo, sans-serif" }}
                          >
                            {banner.title}
                          </h3>
                          <p className="mt-3 max-w-md text-sm leading-relaxed text-surface/80">
                            {banner.body}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`relative min-h-[190px] overflow-hidden ${
                          reverse ? "sm:order-1" : ""
                        }`}
                      >
                        <img
                          src={banner.image}
                          alt=""
                          className="absolute inset-0 size-full object-cover opacity-85 transition duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:via-transparent sm:to-black/15" />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Journey strip */}
        <section className="px-4 pb-8 sm:px-8">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-[28px] border border-border/70 bg-surface">
            <div className="grid gap-0 md:grid-cols-3">
              {journeySteps.map((item, index) => (
                <div
                  key={item.label}
                  className={`relative p-6 sm:p-8 ${
                    index < journeySteps.length - 1 ? "md:border-r border-border/70" : ""
                  }`}
                >
                  <p
                    className="text-sm font-semibold text-brand-blue"
                    style={{ fontFamily: "Syne, Archivo, sans-serif" }}
                  >
                    {String(index + 1).padStart(2, "0")} · {item.label}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sources strip */}
        <section className="border-y border-border/70 bg-surface px-4 py-12 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <p className="text-center text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              Connect on day one
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <div
                    key={service.id}
                    className="inline-flex items-center gap-2.5 rounded-full border border-border bg-tile/60 px-4 py-2.5"
                  >
                    <span className={`grid size-8 place-items-center rounded-full ${service.tint}`}>
                      <Icon className="size-3.5" />
                    </span>
                    <span className="text-sm font-medium text-foreground">{service.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Closing CTA with atmosphere */}
        <section className="relative overflow-hidden px-4 py-20 sm:px-8 sm:py-24">
          <img
            src="/medical_scan.jpg"
            alt=""
            className="absolute inset-0 size-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.965_0.012_225_/0.92)_0%,oklch(0.965_0.012_225_/0.88)_100%)]" />
          <div className="relative mx-auto max-w-3xl text-center">
            <Sparkles className="mx-auto size-6 text-brand-blue" />
            <h2
              className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl"
              style={{ fontFamily: "Syne, Archivo, sans-serif" }}
            >
              Ready when your data is
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
              Connect at least one source—Good Doc or Good Bank is enough to welcome your first
              live cases into CXO.
            </p>
            <button
              onClick={startConnect}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-semibold text-surface transition hover:opacity-90 cursor-pointer"
            >
              Start connecting
              <ArrowRight className="size-4" />
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-tint font-sans text-foreground">
      <header className="flex items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full bg-[oklch(0.68_0.15_55)] text-sm font-medium text-surface shadow-xs">
            CX
          </span>
          <span className="text-xl sm:text-[22px]" style={{ fontFamily: "Syne, Archivo, sans-serif" }}>
            CXO
          </span>
        </div>
        {step < 3 && (
          <Link to="/" className="text-sm text-muted-foreground transition hover:text-foreground">
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
          {step === 1 && (
            <>
              <h2
                className="text-[22px] font-semibold"
                style={{ fontFamily: "Syne, Archivo, sans-serif" }}
              >
                Connect your data
              </h2>
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
                  className="text-sm font-medium text-foreground transition-colors hover:text-brand-blue cursor-pointer"
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
                  <h2
                    className="text-[22px] font-semibold"
                    style={{ fontFamily: "Syne, Archivo, sans-serif" }}
                  >
                    Upload files
                  </h2>
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
                  className="inline-flex shrink-0 items-center gap-2 rounded-full bg-chip-active px-4 py-2 text-sm font-medium text-chip-active-foreground transition hover:opacity-90 cursor-pointer"
                >
                  <UploadCloud className="size-4" />
                  Upload file
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
            </>
          )}

          {step === 3 && (
            <div className="py-8 text-center">
              <CheckCircle2 className="mx-auto size-12 text-positive" />
              <h2
                className="mt-4 text-[22px] font-semibold"
                style={{ fontFamily: "Syne, Archivo, sans-serif" }}
              >
                You&apos;re ready
              </h2>
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
          )}

          {step > 0 && step < 3 && (
            <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:bg-tile cursor-pointer"
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
                    className="rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:bg-tile disabled:opacity-70 cursor-pointer"
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
