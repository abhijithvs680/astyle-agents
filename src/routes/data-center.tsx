import { useState, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Home,
  Briefcase,
  Database,
  Compass,
  FolderKanban,
  FileText,
  Server,
  UploadCloud,
  Check,
  Building2,
  Landmark,
  FileSpreadsheet,
  Trash2,
  Table2,
  Workflow,
  Cloud,
  Plus,
  ChevronUp,
  RotateCw,
} from "lucide-react";

export const Route = createFileRoute("/data-center")({
  head: () => ({
    meta: [
      { title: "Data Center — CXO Platform" },
      {
        name: "description",
        content: "Connect Good Doc, Good Bank, and upload internal operational files.",
      },
      { property: "og:title", content: "Data Center — CXO Platform" },
      {
        property: "og:description",
        content: "Connect Good Doc, Good Bank, and upload files for analysis.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DataCenterPage,
});

const railIcons = [
  { icon: Home, label: "Home", to: "/" },
  { icon: Briefcase, label: "Cases", to: "/cases" },
  { icon: Compass, label: "Explore", to: "/explore" },
  { icon: FolderKanban, label: "Folders", to: "/folders" },
  { icon: FileText, label: "Files", to: "/files" },
  { icon: Server, label: "Data Center", to: "/data-center", active: true },
];

interface UploadedFile {
  name: string;
  size: string;
  updated: string;
}

const initialFiles: UploadedFile[] = [
  { name: "Q3_Departmental_EBITDA.xlsx", size: "2.4 MB", updated: "Today, 10:14 AM" },
  { name: "Patient_Escalation_Logs.csv", size: "1.8 MB", updated: "Yesterday" },
  { name: "Operating_Room_Audit.pdf", size: "5.1 MB", updated: "2 days ago" },
  { name: "Pharmacy_Procurement_Batch.csv", size: "840 KB", updated: "3 days ago" },
];

function DataCenterPage() {
  const [goodDocConnected, setGoodDocConnected] = useState(true);
  const [goodBankConnected, setGoodBankConnected] = useState(false);
  const [workflowAgentConnected, setWorkflowAgentConnected] = useState(false);
  const [snowflakeConnected, setSnowflakeConnected] = useState(false);
  const [bigQueryConnected, setBigQueryConnected] = useState(false);
  const [connectingServiceName, setConnectingServiceName] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>(initialFiles);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleConnectService = (serviceName: string, onConnect: () => void) => {
    setConnectingServiceName(serviceName);
    setTimeout(() => {
      onConnect();
      setConnectingServiceName(null);
    }, 1400);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles: UploadedFile[] = Array.from(e.target.files).map((f) => ({
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
        updated: "Just now",
      }));
      setFiles((curr) => [...newFiles, ...curr]);
    }
  };

  const removeFile = (name: string) => {
    setFiles((curr) => curr.filter((f) => f.name !== name));
  };

  return (
    <div className="min-h-screen bg-surface-tint font-sans text-foreground">
      {/* Header matching home page with profile icon, name, and designation on right (Fixed on scroll) */}
      <header className="sticky top-0 z-40 h-16 bg-[#072333] border-b border-[#0f354c] flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="text-xl sm:text-[22px] font-semibold text-white hover:opacity-85 transition cursor-pointer"
            title="CXO Home"
          >
            CXO
          </Link>
        </div>

        {/* Profile icon, name, and designation on top right */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium leading-none text-white">Robert</p>
            <p className="text-xs text-sky-200/70 mt-1">Chief Executive Officer</p>
          </div>
          <span className="grid size-9 place-items-center rounded-full bg-[oklch(0.68_0.15_55)] text-sm font-medium text-white shadow-xs">
            R
          </span>
        </div>
      </header>

      <div className="flex">
        {/* Navigation rail matching home page (Fixed while scrolling) */}
        <nav className="hidden w-[72px] shrink-0 flex-col items-center gap-2 pt-3 md:flex sticky top-16 h-[calc(100vh-4rem)] border-r border-border/40 overflow-visible">
          {railIcons.map(({ icon: Icon, label, to, active }) => (
            <div key={label} className="relative group flex items-center justify-center">
              <Link
                to={to}
                aria-label={label}
                className={`relative grid size-12 place-items-center rounded-full transition-colors duration-200 cursor-pointer ${
                  active
                    ? "bg-chip-active text-chip-active-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-tile"
                }`}
              >
                <Icon className="size-5" />
              </Link>

              {/* Floating Tooltip on Hover */}
              <div className="pointer-events-none absolute left-[calc(100%+12px)] z-50 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1 text-xs font-medium text-background opacity-0 shadow-lg transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0.5">
                {label}
                <span className="absolute -left-1 top-1/2 -translate-y-1/2 border-4 border-transparent border-r-foreground" />
              </div>
            </div>
          ))}
        </nav>

        {/* Main Content Area */}
        <main className="min-w-0 flex-1 px-3 pt-4 pb-12 sm:px-6 sm:pt-6">
          <div className="mx-auto max-w-3xl space-y-6 pt-2">
            {/* Sources Panel: Good Doc, Good Bank, Workflow Agent, Load More */}
            <section className="rounded-3xl bg-surface p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-[22px]">Connected Services</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Connect external accounts to feed live documents and financial data into your workspace.
                  </p>
                </div>
                <Link
                  to="/welcome"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue hover:underline"
                >
                  New user setup
                  <Plus className="size-3.5" />
                </Link>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {/* Good Doc Card - Selected */}
                <div
                  className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
                    goodDocConnected
                      ? "border-brand-blue bg-tile"
                      : "border-border bg-surface hover:bg-tile"
                  }`}
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[oklch(0.93_0.05_255)] text-[oklch(0.5_0.16_255)]">
                    <FileText className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="block font-medium">Good Doc</span>
                    <span className="block truncate text-sm text-muted-foreground">
                      {goodDocConnected ? "Hospital operating system connected" : "Hospital operating system"}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (goodDocConnected) {
                        setGoodDocConnected(false);
                      } else {
                        handleConnectService("Hospital operating system", () => setGoodDocConnected(true));
                      }
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                      goodDocConnected
                        ? "bg-chip-active text-chip-active-foreground"
                        : "border border-border bg-surface text-foreground hover:bg-tile"
                    }`}
                  >
                    {goodDocConnected ? (
                      <>
                        <Check className="size-3.5 text-brand-blue" />
                        Connected
                      </>
                    ) : (
                      "Connect"
                    )}
                  </button>
                </div>

                {/* Good Bank Card - Not selected */}
                <div
                  className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
                    goodBankConnected
                      ? "border-brand-blue bg-tile"
                      : "border-border bg-surface hover:bg-tile"
                  }`}
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[oklch(0.93_0.06_150)] text-[oklch(0.48_0.14_150)]">
                    <Landmark className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="block font-medium">Good Bank</span>
                    <span className="block truncate text-sm text-muted-foreground">
                      {goodBankConnected ? "Treasury & reserve accounts linked" : "Banking & Treasury API"}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (goodBankConnected) {
                        setGoodBankConnected(false);
                      } else {
                        handleConnectService("Good Bank (Treasury API)", () => setGoodBankConnected(true));
                      }
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                      goodBankConnected
                        ? "bg-chip-active text-chip-active-foreground"
                        : "border border-border bg-surface text-foreground hover:bg-tile"
                    }`}
                  >
                    {goodBankConnected ? (
                      <>
                        <Check className="size-3.5 text-brand-blue" />
                        Connected
                      </>
                    ) : (
                      "Connect"
                    )}
                  </button>
                </div>

                {/* Workflow Agent Card - Added */}
                <div
                  className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
                    workflowAgentConnected
                      ? "border-brand-blue bg-tile"
                      : "border-border bg-surface hover:bg-tile"
                  }`}
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[oklch(0.93_0.06_300)] text-[oklch(0.52_0.15_300)]">
                    <Workflow className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="block font-medium">Workflow Agent</span>
                    <span className="block truncate text-sm text-muted-foreground">
                      {workflowAgentConnected ? "Autonomous pipeline execution active" : "Automated data workflows & ETL"}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (workflowAgentConnected) {
                        setWorkflowAgentConnected(false);
                      } else {
                        handleConnectService("Workflow Agent", () => setWorkflowAgentConnected(true));
                      }
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                      workflowAgentConnected
                        ? "bg-chip-active text-chip-active-foreground"
                        : "border border-border bg-surface text-foreground hover:bg-tile"
                    }`}
                  >
                    {workflowAgentConnected ? (
                      <>
                        <Check className="size-3.5 text-brand-blue" />
                        Connected
                      </>
                    ) : (
                      "Connect"
                    )}
                  </button>
                </div>

                {/* Expanded Extra Sources */}
                {showMore && (
                  <>
                    <div
                      className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
                        snowflakeConnected
                          ? "border-brand-blue bg-tile"
                          : "border-border bg-surface hover:bg-tile"
                      }`}
                    >
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[oklch(0.93_0.05_220)] text-[oklch(0.5_0.15_220)]">
                        <Cloud className="size-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="block font-medium">Snowflake</span>
                        <span className="block truncate text-sm text-muted-foreground">
                          {snowflakeConnected ? "Warehouse link synced" : "Enterprise Data Warehouse"}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          if (snowflakeConnected) {
                            setSnowflakeConnected(false);
                          } else {
                            handleConnectService("Snowflake Data Warehouse", () => setSnowflakeConnected(true));
                          }
                        }}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                          snowflakeConnected
                            ? "bg-chip-active text-chip-active-foreground"
                            : "border border-border bg-surface text-foreground hover:bg-tile"
                        }`}
                      >
                        {snowflakeConnected ? (
                          <>
                            <Check className="size-3.5 text-brand-blue" />
                            Connected
                          </>
                        ) : (
                          "Connect"
                        )}
                      </button>
                    </div>

                    <div
                      className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
                        bigQueryConnected
                          ? "border-brand-blue bg-tile"
                          : "border-border bg-surface hover:bg-tile"
                      }`}
                    >
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[oklch(0.94_0.05_40)] text-[oklch(0.52_0.14_40)]">
                        <Database className="size-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="block font-medium">BigQuery</span>
                        <span className="block truncate text-sm text-muted-foreground">
                          {bigQueryConnected ? "Cloud analytics pipeline active" : "Google Cloud analytics"}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          if (bigQueryConnected) {
                            setBigQueryConnected(false);
                          } else {
                            handleConnectService("Google BigQuery", () => setBigQueryConnected(true));
                          }
                        }}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                          bigQueryConnected
                            ? "bg-chip-active text-chip-active-foreground"
                            : "border border-border bg-surface text-foreground hover:bg-tile"
                        }`}
                      >
                        {bigQueryConnected ? (
                          <>
                            <Check className="size-3.5 text-brand-blue" />
                            Connected
                          </>
                        ) : (
                          "Connect"
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-5 text-center">
                <button
                  onClick={() => setShowMore((prev) => !prev)}
                  className="text-sm font-medium text-foreground hover:text-brand-blue transition-colors"
                >
                  {showMore ? "Show less" : "Load more"}
                </button>
              </div>
            </section>

            {/* Separate Section to Upload Files */}
            <section className="rounded-3xl bg-surface p-5 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-[22px]">Upload files</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Upload spreadsheets, documents, or reports for analysis.
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
                  className="inline-flex items-center gap-2 rounded-full bg-chip-active px-4 py-2 text-sm font-medium text-chip-active-foreground hover:opacity-90 transition"
                >
                  <UploadCloud className="size-4" />
                  Upload file
                </button>
              </div>

              {/* Upload Drop area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="mt-5 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-tile/50 p-6 text-center cursor-pointer hover:bg-tile transition"
              >
                <UploadCloud className="size-6 text-muted-foreground mb-2" />
                <p className="text-sm font-medium text-foreground">
                  Click to select files or drag and drop
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  CSV, Excel, or PDF files
                </p>
              </div>

              {/* Uploaded Files list like connect data tables */}
              <div className="mt-5">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Uploaded files ({files.length})
                </h3>
                <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border">
                  {files.map((t) => (
                    <li key={t.name} className="flex items-center gap-4 p-4 hover:bg-tile transition">
                      <Table2 className="size-4 shrink-0 text-muted-foreground" />
                      <div className="min-w-0 flex-1">
                        <span className="block truncate font-medium text-sm">{t.name}</span>
                        <span className="block text-xs text-muted-foreground">
                          {t.size} · {t.updated}
                        </span>
                      </div>
                      <span className="hidden text-xs text-muted-foreground sm:block">
                        Ready
                      </span>
                      <button
                        onClick={() => removeFile(t.name)}
                        className="rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-surface transition"
                        aria-label="Remove file"
                        title="Remove file"
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
            </section>
          </div>
        </main>
      </div>

      {/* PAGE LEVEL LOADER WHILE CONNECTING A SERVICE */}
      {connectingServiceName && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="flex flex-col items-center max-w-sm w-full bg-surface border border-border/80 rounded-3xl p-8 shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-200">
            {/* Spinning Indicator */}
            <div className="relative flex items-center justify-center">
              <div className="size-16 rounded-full border-3 border-brand-blue/20 border-t-brand-blue animate-spin" />
              <div className="absolute size-9 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                <RotateCw className="size-5 animate-spin" />
              </div>
            </div>

            {/* Text & Status */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-widest text-brand-blue">
                Live Data Integration
              </span>
              <h3 className="text-lg font-semibold text-foreground">
                Connecting {connectingServiceName}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Authorizing enterprise OAuth credentials, establishing secure socket pipelines, and synchronizing operational feeds...
              </p>
            </div>

            {/* Animated Progress Bar */}
            <div className="w-full h-1.5 bg-tile rounded-full overflow-hidden">
              <div className="h-full bg-brand-blue rounded-full animate-pulse w-4/5" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
