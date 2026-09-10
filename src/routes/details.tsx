import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  FileText,
  RotateCw,
  Send,
  History,
  X,
  Printer,
  Download,
  Clock,
  TrendingDown,
  TrendingUp,
  Activity,
  DollarSign,
  Bell,
  Archive,
  Check,
  MoreVertical,
} from "lucide-react";

export const Route = createFileRoute("/details")({
  head: () => ({
    meta: [
      { title: "Low sales share despite moderate stock — AI Analysis Report" },
      {
        name: "description",
        content:
          "White paper analysis report and AI Assistant for pharmacy inventory performance.",
      },
    ],
  }),
  component: CaseDetailsPage,
});

interface HistoryItem {
  id: string;
  title: string;
  timestamp: string;
}

const caseHistoryList: HistoryItem[] = [
  {
    id: "case-1",
    title: "Low sales share despite moderate stock",
    timestamp: "04 Sept 2026, 05:57 am",
  },
  {
    id: "case-2",
    title: "Patient volume dropped by 14%",
    timestamp: "02 Sept 2026, 11:20 am",
  },
  {
    id: "case-3",
    title: "OP cancellations increased by 18%",
    timestamp: "28 Aug 2026, 02:15 pm",
  },
  {
    id: "case-4",
    title: "Laboratory claim reconciliation",
    timestamp: "24 Aug 2026, 09:30 am",
  },
];

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  content: string;
}

const initialMessages: ChatMessage[] = [
  {
    id: "m-1",
    sender: "user",
    content: "What are current promotion strategies for these products?",
  },
  {
    id: "m-2",
    sender: "ai",
    content:
      "Based on current data, it appears that none of the main products with increasing demand are currently benefiting from special promotional strategies like discounts. Most items do not show any discounts being applied, and the pricing remains consistent for each product (PromoPriceVariety is either 1 or 2, indicating little to no price variation for most products).\n\nKey points:\n• No discounts are being offered on these items.\n• There is very limited price variation within individual products.\n• Current strategies seem to rely on standard pricing rather than promotional offers.\n\nIf you'd like, I can suggest potential promotions or other sales strategies tailored to these products to help boost their visibility and sales. Let me know your preference!",
  },
];

interface CaseKpiItem {
  icon: typeof Activity;
  source: string;
  timeframe: string;
  headline: string;
  baselineLabel: string;
  baselineValue: string;
  automatedLabel: string;
  automatedValue: string;
  delta: string;
  status: string;
  positive: boolean;
}

const defaultCaseKpis: [CaseKpiItem, CaseKpiItem] = [
  {
    icon: TrendingDown,
    source: "Pharmacy Inventory & Sales Feed",
    timeframe: "30-Day Audit",
    headline: "Market Sales Share Penetration",
    baselineLabel: "Historical Target",
    baselineValue: "2.80% share",
    automatedLabel: "Current status",
    automatedValue: "0.64% actual",
    delta: "↓ 2.16% below target",
    status: "Severe SKU lag",
    positive: false,
  },
  {
    icon: TrendingUp,
    source: "Financial Impact & Opportunity",
    timeframe: "Annualized Run Rate",
    headline: "Recoverable Annual Margin Opportunity",
    baselineLabel: "Unoptimized Baseline",
    baselineValue: "€0 incremental",
    automatedLabel: "Automated Potential",
    automatedValue: "+€18,400 / yr",
    delta: "↑ 8.2% EBITDA lift",
    status: "Pricing & reorder fix",
    positive: true,
  },
];

const caseKpis: Record<string, [CaseKpiItem, CaseKpiItem]> = {
  "case-1": defaultCaseKpis,
  "case-2": [
    {
      icon: TrendingDown,
      source: "Clinical Outpatient Operations",
      timeframe: "Weekly Comparison",
      headline: "Weekly Patient Inflow Rate",
      baselineLabel: "Historical Baseline",
      baselineValue: "1,420 visits/wk",
      automatedLabel: "Current status",
      automatedValue: "1,221 visits/wk",
      delta: "↓ 14.0% drop",
      status: "Capacity gap detected",
      positive: false,
    },
    {
      icon: DollarSign,
      source: "Capacity & Revenue Leakage",
      timeframe: "Weekly Leakage",
      headline: "Unrealized Consultation Value",
      baselineLabel: "Target Volume Revenue",
      baselineValue: "€71,000 / wk",
      automatedLabel: "Current Run Rate",
      automatedValue: "€61,050 / wk",
      delta: "-€9,950 / wk loss",
      status: "Slot re-allocation needed",
      positive: false,
    },
  ],
  "case-3": [
    {
      icon: TrendingDown,
      source: "OP Appointment Scheduling",
      timeframe: "Last 14 Days",
      headline: "Outpatient Cancellation Rate",
      baselineLabel: "Prior 30-Day Avg",
      baselineValue: "6.2% cancellations",
      automatedLabel: "Current status",
      automatedValue: "24.2% cancellations",
      delta: "↑ 18.0% surge",
      status: "Urgent slot recovery",
      positive: false,
    },
    {
      icon: Activity,
      source: "Consultation Utilization",
      timeframe: "Weekly Impact",
      headline: "Wasted Clinic Hours Weekly",
      baselineLabel: "Normal Idle Time",
      baselineValue: "4.5 hrs / dept",
      automatedLabel: "Current Impact",
      automatedValue: "18.2 hrs / dept",
      delta: "+13.7 hrs idle",
      status: "SMS confirmation needed",
      positive: false,
    },
  ],
  "case-4": [
    {
      icon: TrendingDown,
      source: "Laboratory & Diagnostics Billing",
      timeframe: "Month to Date",
      headline: "Diagnostic Claims Discrepancy",
      baselineLabel: "Approved Benchmark",
      baselineValue: "98.4% billed",
      automatedLabel: "Current status",
      automatedValue: "88.1% billed",
      delta: "↓ 10.3% unbilled",
      status: "4 billing mismatches",
      positive: false,
    },
    {
      icon: TrendingUp,
      source: "Revenue Assurance Pipeline",
      timeframe: "Pending Audit",
      headline: "Recoverable Unbilled Lab Claims",
      baselineLabel: "Reconciled Revenue",
      baselineValue: "€142,000 processed",
      automatedLabel: "Unbilled Pipeline",
      automatedValue: "€14,600 pending",
      delta: "+€14,600 recoverable",
      status: "Batch re-submission",
      positive: true,
    },
  ],
};

function CaseDetailsPage() {
  const [selectedCaseId, setSelectedCaseId] = useState<string>("case-1");
  // Case History collapsed by default
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showConsolidatedModal, setShowConsolidatedModal] = useState<boolean>(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isArchived, setIsArchived] = useState<boolean>(false);
  const [showMoreMenu, setShowMoreMenu] = useState<boolean>(false);

  useEffect(() => {
    const handleOutsideClick = () => setShowMoreMenu(false);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  // AI Assistant Chat state
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [chatInput, setChatInput] = useState<string>("");

  const handleCheckStatus = () => {
    setIsCheckingStatus(true);
    setStatusMessage("Checking data feeds across Good Doc & Hospital EHR...");
    setTimeout(() => {
      setIsCheckingStatus(false);
      setStatusMessage("Status verified: 100% up to date with latest inventory audit");
      setTimeout(() => setStatusMessage(null), 4000);
    }, 1200);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: "user",
      content: userText,
    };
    setMessages((prev) => [...prev, newMsg]);
    setChatInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiReply: ChatMessage = {
        id: `m-ai-${Date.now()}`,
        sender: "ai",
        content: `I've analyzed the live inventory feeds regarding "${userText}". The recommendation is to bundle 'A TO Z NS + TAB' with high-traffic post-op supplies to recover an estimated €18,400 in annualized sales without additional supplier cost.`,
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 600);
  };

  const defaultCase: HistoryItem = {
    id: "case-1",
    title: "Low sales share despite moderate stock",
    timestamp: "04 Sept 2026, 05:57 am",
  };

  const selectedCase: HistoryItem =
    caseHistoryList.find((c) => c.id === selectedCaseId) ?? caseHistoryList[0] ?? defaultCase;

  const currentKpis: [CaseKpiItem, CaseKpiItem] = caseKpis[selectedCase.id] ?? defaultCaseKpis;

  return (
    <div className="min-h-screen bg-surface-tint font-sans text-foreground flex flex-col">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/60 px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-4">
        {/* Left Side: Back Arrow and Title only (Icon and Completed status removed) */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/"
            className="grid size-9 place-items-center rounded-full hover:bg-tile text-muted-foreground hover:text-foreground transition cursor-pointer"
            aria-label="Back to dashboard"
            title="Back to Dashboard"
          >
            <ArrowLeft className="size-5" />
          </Link>

          <h1 className="text-base sm:text-lg font-semibold text-foreground truncate">
            {selectedCase.title}
          </h1>
        </div>

        {/* Right Side Options: Follow, Archive, Case History, Consolidated Report, Check Status Now */}
        <div className="flex items-center gap-2.5 ml-auto">
          {/* Follow Button */}
          <button
            onClick={() => {
              setIsFollowing((prev) => {
                const next = !prev;
                setStatusMessage(next ? "You are now following this project for updates" : "Unfollowed project");
                setTimeout(() => setStatusMessage(null), 3000);
                return next;
              });
            }}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-sm font-medium transition cursor-pointer active:scale-95 shadow-2xs ${
              isFollowing
                ? "border-emerald-500/80 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700"
                : "border-border bg-surface text-foreground hover:bg-tile"
            }`}
            title={isFollowing ? "Following project" : "Follow project"}
          >
            {isFollowing ? (
              <>
                <Check className="size-4 text-emerald-600 dark:text-emerald-400" />
                <span>Following</span>
              </>
            ) : (
              <>
                <Bell className="size-4 text-muted-foreground" />
                <span>Follow</span>
              </>
            )}
          </button>

          {/* Three dot action menu containing Archive option */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMoreMenu((prev) => !prev);
              }}
              className={`inline-flex items-center justify-center rounded-xl border p-2 transition cursor-pointer active:scale-95 shadow-2xs ${
                isArchived
                  ? "border-amber-500/80 bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-tile"
              }`}
              title={isArchived ? "Project archived (Click for options)" : "More options"}
              aria-label="More options"
            >
              <MoreVertical className="size-4" />
            </button>

            {showMoreMenu && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-full mt-1.5 z-40 w-52 rounded-xl border border-border/80 bg-surface p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-100"
              >
                <button
                  onClick={() => {
                    setIsArchived((prev) => {
                      const next = !prev;
                      setStatusMessage(next ? "Project has been archived" : "Project restored from archive");
                      setTimeout(() => setStatusMessage(null), 3000);
                      return next;
                    });
                    setShowMoreMenu(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-tile hover:text-amber-700 dark:hover:text-amber-300 transition cursor-pointer"
                >
                  <Archive className="size-4 text-amber-600 dark:text-amber-400" />
                  <span>{isArchived ? "Restore from Archive" : "Archive Project"}</span>
                </button>
              </div>
            )}
          </div>

          {/* Option to view Case History (collapsed by default) */}
          <button
            onClick={() => setShowHistory((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-sm font-medium transition cursor-pointer ${
              showHistory
                ? "border-brand-blue bg-blue-50/70 text-brand-blue dark:bg-blue-950/50"
                : "border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-tile"
            }`}
            title="View or hide Case History"
          >
            <History className="size-4" />
            <span>Case History</span>
          </button>

          {/* Option to Consolidate Report */}
          <button
            onClick={() => setShowConsolidatedModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-1.5 text-sm font-medium text-foreground hover:bg-tile transition shadow-2xs cursor-pointer active:scale-95"
          >
            <FileText className="size-4 text-muted-foreground" />
            Consolidated Report
          </button>

          {/* Option to Check Status Now */}
          <button
            onClick={handleCheckStatus}
            disabled={isCheckingStatus}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-1.5 text-sm font-medium text-foreground hover:bg-tile transition shadow-2xs cursor-pointer active:scale-95 disabled:opacity-60"
          >
            <RotateCw
              className={`size-4 ${
                isCheckingStatus ? "animate-spin text-brand-blue" : "text-muted-foreground"
              }`}
            />
            Check Status Now
          </button>
        </div>
      </header>

      {/* Archive project notification banner */}
      {isArchived && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs py-2 px-4 flex items-center justify-between font-medium">
          <div className="flex items-center gap-2">
            <Archive className="size-3.5 text-amber-600" />
            <span>This project is currently archived. It is preserved in the project archive repository.</span>
          </div>
          <button
            onClick={() => {
              setIsArchived(false);
              setStatusMessage("Project restored from archive");
              setTimeout(() => setStatusMessage(null), 3000);
            }}
            className="underline font-semibold hover:text-amber-950 dark:hover:text-amber-100 cursor-pointer"
          >
            Restore Project
          </button>
        </div>
      )}

      {/* Status verification notification banner */}
      {statusMessage && (
        <div className="bg-emerald-600 text-white text-xs py-1.5 px-4 text-center font-medium animate-in fade-in transition-all">
          {statusMessage}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: CASE HISTORY (Collapsed by default, expands on click) */}
        {showHistory && (
          <aside className="w-64 shrink-0 border-r border-border/80 bg-surface p-4 space-y-3 overflow-y-auto hidden md:block animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Clock className="size-3" />
                Case History
              </span>
              <span className="text-[10px] rounded-full bg-tile px-1.5 py-0.5 text-muted-foreground font-medium">
                {caseHistoryList.length}
              </span>
            </div>

            <div className="space-y-2">
              {caseHistoryList.map((item) => {
                const isSelected = item.id === selectedCaseId;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedCaseId(item.id)}
                    className={`w-full text-left rounded-2xl p-3.5 transition-all border relative cursor-pointer ${
                      isSelected
                        ? "border-blue-400/80 bg-blue-50/70 dark:bg-blue-950/40 dark:border-blue-800 shadow-xs"
                        : "border-border/60 bg-surface hover:bg-tile/70 text-muted-foreground"
                    }`}
                  >
                    <h4
                      className={`text-xs leading-snug ${
                        isSelected ? "text-foreground font-semibold" : "text-foreground/80 font-medium"
                      }`}
                    >
                      {item.title}
                    </h4>
                    <span className="mt-2 block text-[11px] text-muted-foreground">
                      {item.timestamp}
                    </span>

                    {isSelected && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 size-2 rounded-full bg-brand-blue" />
                    )}
                  </button>
                );
              })}
            </div>
          </aside>
        )}

        {/* CENTER COLUMN: AI ANALYSIS REPORT (White Card / Document / Whitepaper Style) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* White Paper Document Card */}
            <article className="rounded-3xl bg-surface border border-border/80 p-7 sm:p-10 lg:p-12 shadow-xs space-y-8">
              {/* Document Header */}
              <div className="border-b border-border/60 pb-6 space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-semibold uppercase tracking-widest text-xs text-brand-blue">
                    AI Analysis Report
                  </span>
                  <span className="rounded-full bg-tile border border-border/60 px-3 py-0.5 text-xs font-medium text-foreground">
                    85% Confidence
                  </span>
                </div>

                {/* Subject as main title: Large font size with clean non-bold font-normal */}
                <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-normal tracking-tight text-foreground leading-[1.18]">
                  {selectedCase.title}
                </h2>
              </div>

              {/* Section 1: Executive Summary & Findings */}
              <section className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  1. Executive Summary & Findings
                </h3>
                <p className="text-base sm:text-[17px] leading-relaxed text-foreground/90 font-normal">
                  Analyzed pharmacy product data to identify products with moderate stock levels and low sales share, indicating potential growth opportunities. Products with steady or increasing demand but not translating to proportional sales share were focused on. Products with moderate stock but low sales (less than 1% sales share) were identified as underperforming. Potential reasons include visibility, pricing, or placement issues, especially for products with positive sales quantities but low sales share percentage. Suggested targeted promotional strategies, inventory adjustments, and pricing reviews to improve performance.
                </p>
              </section>

              {/* Automated Discovery KPI Metrics (styled like Insights tab) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {currentKpis.map((kpi, idx) => (
                  <div
                    key={idx}
                    className="rounded-3xl bg-tile/40 border border-border/70 p-5 sm:p-6 space-y-4 shadow-2xs hover:border-foreground/30 transition-all duration-200"
                  >
                    {/* Top Source & Timeframe */}
                    <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5 truncate">
                        <kpi.icon className="size-4 shrink-0 text-muted-foreground" />
                        <span className="truncate">{kpi.source}</span>
                      </div>
                      <span className="shrink-0 rounded-full bg-surface border border-border/60 px-3 py-0.5 text-xs font-medium text-foreground">
                        {kpi.timeframe}
                      </span>
                    </div>

                    {/* Headline */}
                    <h4 className="text-lg sm:text-xl font-normal text-foreground leading-snug">
                      {kpi.headline}
                    </h4>

                    {/* Previous vs Current Automated Comparison Strip */}
                    <div className="rounded-2xl bg-surface/90 dark:bg-zinc-900/70 p-3.5 border border-border/50 space-y-2 shadow-2xs">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{kpi.baselineLabel}</span>
                        <span className="font-semibold text-foreground">{kpi.baselineValue}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{kpi.automatedLabel}</span>
                        <span
                          className={`font-bold text-base ${
                            kpi.positive
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {kpi.automatedValue}
                        </span>
                      </div>
                    </div>

                    {/* Footer: Delta & Status */}
                    <div className="pt-2 border-t border-border/40 flex items-center justify-between text-sm">
                      <span
                        className={`inline-block rounded-full px-3 py-0.5 text-xs font-medium ${
                          kpi.positive
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                            : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
                        }`}
                      >
                        {kpi.delta}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">
                        {kpi.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Section 2: Key Data Points */}
              <section className="space-y-3 pt-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  2. Key Data Points & Empirical Metrics
                </h3>

                <div className="space-y-3">
                  {[
                    {
                      label: "Identified SKUs",
                      content:
                        "Two products identified with low sales share but moderate stock and sales quantity: 'A TO Z NS + TAB' and 'SOFT SWAB 10*10 8PLY (GAUZE)'.",
                    },
                    {
                      label: "Market Penetration",
                      content:
                        "Sales share percentages remain below 1%, indicating low market penetration despite steady moderate inventory availability.",
                    },
                    {
                      label: "Inventory Level",
                      content:
                        "Stock levels maintained consistently above 15 units, confirming underperformance is not caused by stock-outs or replenishment delays.",
                    },
                    {
                      label: "Demand Pattern",
                      content:
                        "Moderate sales quantities indicate persistent baseline demand that is unoptimized for revenue and volume growth.",
                    },
                    {
                      label: "Price Calibration",
                      content:
                        "Average pricing structure is readily accessible for immediate review to evaluate elasticity and margin competitive balance.",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3.5 rounded-2xl bg-tile/40 border border-border/50 p-4 sm:p-5 text-sm sm:text-base leading-relaxed"
                    >
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-surface border border-border/80 text-foreground text-sm font-semibold mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-semibold text-foreground mr-2 text-base">{item.label}:</span>
                        <span className="text-foreground/90 text-sm sm:text-base">{item.content}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 3: Strategic Next Steps */}
              <section className="space-y-3 pt-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  3. Strategic Next Steps & Action Plan
                </h3>

                <div className="space-y-3">
                  {[
                    {
                      action: "Shelf Placement & Merchandising",
                      detail:
                        "Investigate shelf placement and physical visibility for identified products in high-traffic outpatient dispensary bays.",
                    },
                    {
                      action: "Pricing Competitiveness",
                      detail:
                        "Review current unit pricing strategy to ensure competitive parity against retail benchmarks without sacrificing contribution margin.",
                    },
                    {
                      action: "Promotional Bundling",
                      detail:
                        "Implement targeted product bundling with post-procedure recovery kits to accelerate sales conversion and inventory turnover.",
                    },
                    {
                      action: "Stock Level Optimization",
                      detail:
                        "Monitor stock levels closely with automated reorder thresholds to prevent overstock while preventing sudden stockouts.",
                    },
                    {
                      action: "Customer & Clinician Feedback",
                      detail:
                        "Conduct targeted feedback collection across nursing and pharmacy staff to understand specific friction points in ordering.",
                    },
                  ].map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3.5 rounded-2xl border border-border/60 bg-surface p-4 sm:p-5 text-sm sm:text-base leading-relaxed"
                    >
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 text-xs font-bold mt-0.5">
                        ✓
                      </span>
                      <div>
                        <span className="font-semibold text-foreground mr-2 text-base">{step.action}:</span>
                        <span className="text-foreground/85 text-sm sm:text-base">{step.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 4: Issue Details (matching attached image) */}
              <section className="space-y-4 pt-4 border-t border-border/60">
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-foreground">
                    Issue Details
                  </h3>
                  <p className="mt-1 text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Identifies products in pharmacy with increasing demand but low sales share, finds top growth opportunities, and suggests strategies for improvement.
                  </p>
                  <div className="mt-3 flex items-center gap-6 text-sm text-muted-foreground">
                    <span>
                      <strong className="font-medium text-foreground">Impact:</strong> Moderate Stock / Low Sales
                    </span>
                    <span>
                      <strong className="font-medium text-foreground">Period:</strong> 2026-09-10
                    </span>
                  </div>
                </div>

                {/* Table matching user's attached screenshot */}
                <div className="overflow-x-auto rounded-2xl border border-border/80 bg-surface shadow-2xs">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-border/70 bg-[#f8fafc] dark:bg-zinc-800/60 text-slate-700 dark:text-slate-200 font-semibold">
                        <th className="px-4 py-4 text-sm">Product ID</th>
                        <th className="px-4 py-4 text-sm">Product Name</th>
                        <th className="px-4 py-4 text-sm">Stock Level</th>
                        <th className="px-4 py-4 text-sm">Sales Quantity</th>
                        <th className="px-4 py-4 text-sm">Sales Share (%)</th>
                        <th className="px-4 py-4 text-sm">Total Revenue</th>
                        <th className="px-4 py-4 text-sm">Average Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60 text-foreground/90">
                      <tr className="hover:bg-tile/40 transition-colors">
                        <td className="px-4 py-4 font-medium text-foreground">37565</td>
                        <td className="px-4 py-4 font-medium text-foreground leading-snug">
                          A TO Z NS +<br />TAB
                        </td>
                        <td className="px-4 py-4">15</td>
                        <td className="px-4 py-4">12.07</td>
                        <td className="px-4 py-4">0.35</td>
                        <td className="px-4 py-4">190.1</td>
                        <td className="px-4 py-4">15.75</td>
                      </tr>
                      <tr className="hover:bg-tile/40 transition-colors">
                        <td className="px-4 py-4 font-medium text-foreground">37714</td>
                        <td className="px-4 py-4 font-medium text-foreground leading-snug">
                          SOFT SWAB<br />10*10 8PLY<br />(GAUZE)
                        </td>
                        <td className="px-4 py-4">18</td>
                        <td className="px-4 py-4">32.38</td>
                        <td className="px-4 py-4">0.93</td>
                        <td className="px-4 py-4">281.52</td>
                        <td className="px-4 py-4">8.69</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </article>
          </div>
        </main>

        {/* RIGHT COLUMN: AI ASSISTANT ("AI Assistant", minimal layout) */}
        <aside className="w-80 lg:w-96 shrink-0 border-l border-border/80 bg-surface flex flex-col justify-between hidden lg:flex">
          {/* Assistant Header (Icon removed) */}
          <div className="flex items-center justify-between border-b border-border/70 p-4">
            <h3 className="text-base font-semibold text-foreground">AI Assistant</h3>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m) =>
              m.sender === "user" ? (
                <div key={m.id} className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl bg-brand-blue px-4 py-3 text-base text-white leading-relaxed shadow-xs">
                    {m.content}
                  </div>
                </div>
              ) : (
                <div key={m.id} className="flex justify-start">
                  <div className="max-w-[95%] rounded-2xl bg-tile/70 border border-border/60 p-4 text-base leading-relaxed text-foreground/90 whitespace-pre-line shadow-2xs space-y-2.5">
                    {m.content}
                  </div>
                </div>
              )
            )}
          </div>

          {/* Chat Input Box */}
          <div className="border-t border-border/70 p-3.5 bg-surface">
            <form onSubmit={handleSendMessage} className="relative flex items-center">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask a question..."
                className="w-full rounded-2xl border border-border/80 bg-surface pl-4 pr-12 py-3 text-base text-foreground outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20 transition placeholder:text-muted-foreground shadow-2xs"
              />
              <button
                type="submit"
                className="absolute right-2 grid size-9 place-items-center rounded-full bg-brand-blue text-white hover:opacity-90 transition cursor-pointer"
                aria-label="Send message"
              >
                <Send className="size-4" />
              </button>
            </form>
          </div>
        </aside>
      </div>

      {/* CONSOLIDATED REPORT MODAL */}
      {showConsolidatedModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowConsolidatedModal(false)}
        >
          <div
            className="w-full max-w-2xl rounded-3xl bg-surface p-6 sm:p-8 shadow-2xl border border-border/80 animate-in zoom-in-95 duration-200 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-border/50 pb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-blue">
                  Executive Brief
                </span>
                <h3 className="text-xl font-bold text-foreground mt-0.5">
                  Consolidated Anomaly & Growth Report
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Report ID: CR-2026-09-04 · Generated Today at 05:57 AM
                </p>
              </div>
              <button
                onClick={() => setShowConsolidatedModal(false)}
                className="rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-tile transition cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4 text-xs sm:text-sm text-foreground/85 leading-relaxed">
              <div className="rounded-2xl bg-tile/70 border border-border/50 p-4 space-y-2">
                <span className="text-xs font-bold text-foreground uppercase tracking-wide block">
                  1. Executive Summary
                </span>
                <p>
                  Comprehensive cross-repository scan across Good Doc clinical feeds, outpatient scheduling records, and pharmacy warehouse receipts identified low sales conversion despite steady stock availability in outpatient surgical products.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-tile/50 border border-border/40 p-3.5">
                  <span className="text-xs text-muted-foreground font-medium block">
                    Underperforming SKUs
                  </span>
                  <span className="text-lg font-bold text-foreground">2 Primary Items</span>
                  <span className="text-xs text-muted-foreground block mt-0.5">
                    A to Z NS + Tab & Soft Swab
                  </span>
                </div>

                <div className="rounded-2xl bg-tile/50 border border-border/40 p-3.5">
                  <span className="text-xs text-muted-foreground font-medium block">
                    Potential Margin Delta
                  </span>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    +€18,400 / yr
                  </span>
                  <span className="text-xs text-muted-foreground block mt-0.5">
                    Via promotional bundling
                  </span>
                </div>
              </div>

              <div className="rounded-2xl bg-tile/70 border border-border/50 p-4 space-y-2">
                <span className="text-xs font-bold text-foreground uppercase tracking-wide block">
                  2. Immediate Recommendations
                </span>
                <ul className="space-y-1.5 text-xs text-muted-foreground list-disc pl-4">
                  <li>Deploy targeted packaging discounts at outpatient pharmacy counter.</li>
                  <li>Reallocate prime eye-level shelf space for 'SOFT SWAB' in trauma intake.</li>
                  <li>Verify insurance billing codes to ensure automatic secondary coverage.</li>
                </ul>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border/50 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert("Report sent to print queue.")}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-foreground hover:bg-tile transition cursor-pointer"
                >
                  <Printer className="size-3.5" />
                  Print
                </button>
                <button
                  onClick={() => alert("Consolidated PDF downloaded.")}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-foreground hover:bg-tile transition cursor-pointer"
                >
                  <Download className="size-3.5" />
                  Download PDF
                </button>
              </div>

              <button
                onClick={() => setShowConsolidatedModal(false)}
                className="rounded-xl bg-foreground px-4 py-2 font-medium text-surface shadow-xs hover:opacity-90 transition cursor-pointer"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
