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
  CheckCircle2,
  MoreVertical,
  Sparkles,
  RotateCcw,
  Table2,
} from "lucide-react";
import { AIAssistantDefaultView } from "../components/AIAssistantDefaultView";

export const Route = createFileRoute("/details")({
  head: () => ({
    meta: [
      { title: "Dead stock ties up cash — AI Analysis Report" },
      {
        name: "description",
        content:
          "White paper analysis report and AI Assistant for dead stock recovery and working capital optimization across branches.",
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
    title: "Dead stock ties up cash",
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
    content: "How much working capital is currently locked up in dead stock across branches?",
  },
  {
    id: "m-2",
    sender: "ai",
    content:
      "A total of $5,000 in unsold medicines is currently sitting idle across 3 hospital branches (Suburban Dispensary East, North Outpatient Clinic, and Westside Daycare Unit), locking vital working capital and occupying 38 cu ft of high-demand storage space.\n\nKey Breakdown:\n• Human Albumin 20% Infusion (14 vials): $1,820 (Suburban Dispensary East - 194 days idle)\n• A to Z NS Multivitamin Tabs (120 packs): $1,450 (North Outpatient Clinic - 165 days idle)\n• Ceftriaxone 1g Injectable (65 vials): $980 (Westside Daycare Unit - 182 days idle)\n• Sterile Surgical Gauze 8Ply (85 boxes): $750 (Trauma Satellite Dispensary - 140 days idle)\n\nRecommended Action:\n1. Execute inter-branch transfers of Human Albumin and Surgical Gauze to Central Inpatient ICU and Surgery.\n2. Process vendor return credit for eligible Ceftriaxone batches ($980).\n3. Bundle remaining stock into trauma discharge packs to liquidate $1,450 within 30 days.",
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
    icon: DollarSign,
    source: "Dispensary Working Capital & Inventory Feed",
    timeframe: "Cross-Branch Audit",
    headline: "Locked Working Capital in Unsold Stock",
    baselineLabel: "Allowable Idle Buffer",
    baselineValue: "$1,200 threshold",
    automatedLabel: "Current status",
    automatedValue: "$5,000 locked cash",
    delta: "↑ $3,800 above threshold",
    status: "Stagnant across branches",
    positive: false,
  },
  {
    icon: TrendingUp,
    source: "Working Capital & Storage Reclamation",
    timeframe: "Automated Recovery Pipeline",
    headline: "Recoverable Capital & Shelf Space",
    baselineLabel: "Projected Write-Off",
    baselineValue: "$0 recovered",
    automatedLabel: "Automated Potential",
    automatedValue: "+$5,000 capital released",
    delta: "↑ 38 cu ft shelf freed",
    status: "Inter-branch transfer ready",
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

interface CaseAssistantConfig {
  suggestions: string[];
}

const caseAssistantConfigs: Record<string, CaseAssistantConfig> = {
  "case-1": {
    suggestions: [
      "How to unlock the $5,000 in locked working capital?",
      "Which branches hold the highest volume of dead stock medicines?",
      "Recommend inter-branch stock transfers to prevent write-offs",
      "Process supplier consignment buy-back & credit requests",
    ],
  },
  "case-2": {
    suggestions: [
      "Identify departments with the sharpest 14% drop",
      "Analyze doctor consultation utilization lag",
      "Review outpatient appointment lead-time barriers",
      "Recommend patient retention & outreach initiatives",
    ],
  },
  "case-3": {
    suggestions: [
      "Identify root causes for the 18% cancellation spike",
      "Evaluate appointment reminder SMS delivery timing",
      "Analyze morning surgical suite idle buffer times",
      "Draft cancellation mitigation protocols",
    ],
  },
  "case-4": {
    suggestions: [
      "Reconcile unbilled vs completed laboratory orders",
      "Identify documentation gaps causing claim rejections",
      "Audit €38,000 unbilled pharmacy & lab revenue gap",
      "Set up automated discrepancy alerts for billing",
    ],
  },
};

interface CaseSectionData {
  keyDataPoints: string[];
  suggestedNextSteps: string[];
}

const caseSectionData: Record<string, CaseSectionData> = {
  "case-1": {
    keyDataPoints: [
      "$5,000 in unsold medicines sit stagnant across pharmacy branches locking working capital",
      "Over 38 cubic feet of secure and refrigerated storage space occupied by non-moving SKUs",
      "Holding duration exceeds 160+ days with zero dispensations recorded in suburban clinics",
      "Expiring shelf-life creates impending write-off risk unless redistributed within 45 days",
    ],
    suggestedNextSteps: [
      "Initiate immediate automated inter-branch stock transfers to central trauma and ICU units",
      "Trigger supplier consignment buy-back protocols for batches within return-eligibility windows",
      "Apply bundled prescription clearance incentives on non-critical supportive health therapies",
      "Activate automated reorder freeze triggers for medicine SKUs exceeding 90-day velocity lag",
    ],
  },
  "case-2": {
    keyDataPoints: [
      "Outpatient patient inflow dropped by 14% across surgical departments",
      "Appointment lead times lengthened from 8 to 15 business days",
      "Senior physician morning consultation slots operating at 54% utilization",
      "Front-desk patient scheduling complaints rose 22% this month",
    ],
    suggestedNextSteps: [
      "Realign morning consultation rotas to match peak afternoon demand",
      "Implement automated appointment confirmation and waitlist backfill",
      "Expand outpatient walk-in slots for priority specialty clinics",
      "Audit lead-time bottlenecks across referral scheduling pipelines",
    ],
  },
  "case-3": {
    keyDataPoints: [
      "Appointment cancellation surge concentrated on Monday & Friday mornings",
      "68% of cancellations occurred within 4 hours of appointment time",
      "Surgical suite idle buffer times increased to 38 minutes per turnover",
      "SMS appointment reminder delivery rates dropped below 74%",
    ],
    suggestedNextSteps: [
      "Deploy automated 24-hour and 2-hour SMS reminder notifications",
      "Establish a rapid standby list to backfill late cancellation openings",
      "Standardize cancellation policy with easy one-click rescheduling",
      "Optimize surgical block scheduling buffers to reduce idle downtime",
    ],
  },
  "case-4": {
    keyDataPoints: [
      "€38,000 in completed laboratory diagnostic orders remain unbilled",
      "Discrepancies identified between ordered, completed, and submitted claims",
      "42 claim rejections linked to missing clinical modifier codes",
      "Turnaround time for billing reconciliation averaged 18 business days",
    ],
    suggestedNextSteps: [
      "Reconcile electronic health record lab orders with billing clearinghouse",
      "Implement mandatory modifier validation before claim submission",
      "Automate daily discrepancy alerts between diagnostic tests and billing",
      "Train clinical intake staff on required diagnosis-to-procedure codes",
    ],
  },
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

  // AI Assistant Chat state (starts empty to display default layout from attached reference)
  const [messages, setMessages] = useState<ChatMessage[]>([]);
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

  const handleSendMessage = (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const userText = (customPrompt ?? chatInput).trim();
    if (!userText) return;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: "user",
      content: userText,
    };
    setMessages((prev) => [...prev, newMsg]);
    setChatInput("");

    // Simulate AI contextual response grounded in the left-side report
    setTimeout(() => {
      let replyContent = "";
      const lower = userText.toLowerCase();

      // Case 1 specific responses (Dead stock ties up cash)
      if (lower.includes("unlock") || lower.includes("5,000") || lower.includes("working capital") || lower.includes("cash")) {
        replyContent = `The $5,000 in locked working capital is concentrated across 4 unsold medicine SKUs in 3 outpatient satellite branches. By executing automated inter-branch stock transfers to the central trauma ICU and triggering vendor consignment buy-backs, $3,270 can be liquidated within 72 hours, and the remaining $1,730 cleared through bundled recovery protocols.`;
      } else if (lower.includes("which branch") || lower.includes("branches") || lower.includes("suburban") || lower.includes("highest volume")) {
        replyContent = `Dead stock is distributed across 3 branches:
• Suburban Dispensary East: $1,820 (Human Albumin 20% Infusion - 194 days idle)
• North Outpatient Clinic: $1,450 (A to Z NS Multivitamin Tabs - 165 days idle)
• Westside Daycare Unit: $980 (Ceftriaxone 1g Injectable - 182 days idle)
• Trauma Satellite: $750 (Sterile Surgical Gauze 8Ply - 140 days idle)
Suburban Dispensary East represents 36.4% of total locked capital.`;
      } else if (lower.includes("transfer") || lower.includes("write-off") || lower.includes("inter-branch")) {
        replyContent = `Recommended transfer routing:
1. Transfer 14 vials of Human Albumin ($1,820) from Suburban Dispensary East to Central Inpatient ICU where weekly burn rate is 22 vials.
2. Transfer 85 boxes of Sterile Surgical Gauze ($750) from Trauma Satellite to Main Surgical Theatres.
This completely prevents expiration write-offs and saves $2,570 in upcoming central replenishment purchases.`;
      } else if (lower.includes("supplier") || lower.includes("return") || lower.includes("buy-back") || lower.includes("consignment") || lower.includes("credit")) {
        replyContent = `Ceftriaxone 1g Injectable vials ($980) were procured under standard distributor return terms with a 180-day guarantee. Generating an automated return authorization ticket now will recover a 100% account credit directly against the hospital's next pharmaceutical procurement cycle.`;
      }
      // Case 2 specific responses
      else if (lower.includes("14% drop") || lower.includes("volume dropped")) {
        replyContent = `Analysis of outpatient scheduling shows the 14% volume drop is concentrated in General Surgery (-22%) and Orthopedics (-17%). Key drivers are lengthened appointment lead times (from 8 to 15 days) and conflicting morning doctor rotas.`;
      } else if (lower.includes("doctor consultation utilization") || lower.includes("utilization lag")) {
        replyContent = `7 senior physicians currently operate at 54% consultation utilization during morning slots. Realigning outpatient consultation hours to afternoon demand spikes will recover up to 110 patient appointments weekly.`;
      }
      // Case 3 specific responses
      else if (lower.includes("cancellation spike") || lower.includes("18%")) {
        replyContent = `The 18% appointment cancellation surge peaked on Mondays and Fridays. 68% of cancellations occurred within 4 hours of appointment time, indicating patient transit friction and lack of automated SMS 24-hour reminders.`;
      }
      // Case 4 specific responses
      else if (lower.includes("unbilled") || lower.includes("claim") || lower.includes("reconcil")) {
        replyContent = `Cross-referencing laboratory order logs against billing clearinghouse identified €38,000 in unbilled diagnostic services over the last 30 days due to missing clinical modifier codes on order forms.`;
      }
      // General fallbacks
      else {
        replyContent = `Regarding "${userText}": Based on the live report and inventory data on the left for "${selectedCase.title}", all data feeds are synced. Let me know if you would like me to draft an operational action plan or export these metrics to your executive report.`;
      }

      const aiReply: ChatMessage = {
        id: `m-ai-${Date.now()}`,
        sender: "ai",
        content: replyContent,
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

  const currentAssistantConfig: CaseAssistantConfig =
    caseAssistantConfigs[selectedCase.id] ?? caseAssistantConfigs["case-1"]!;

  const currentKpis: [CaseKpiItem, CaseKpiItem] = caseKpis[selectedCase.id] ?? defaultCaseKpis;

  const currentCaseData: CaseSectionData =
    caseSectionData[selectedCase.id] ?? caseSectionData["case-1"]!;

  return (
    <div className="h-screen bg-surface-tint font-sans text-foreground flex flex-col overflow-hidden">
      {/* Top Header Bar - identical styling and height as home page */}
      <header className="sticky top-0 z-40 h-16 shrink-0 bg-background/95 backdrop-blur-md border-b border-border/60 flex items-center justify-between px-4 sm:px-6">
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

        {/* Right Side Options: Check Status Now, Case History, Follow, Consolidated Report, Three Dots */}
        <div className="flex items-center gap-2.5 ml-auto">
          {/* 1. Check Status Now */}
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

          {/* 2. Case History */}
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

          {/* 3. Follow */}
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

          {/* 4. Consolidated Report */}
          <button
            onClick={() => setShowConsolidatedModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-1.5 text-sm font-medium text-foreground hover:bg-tile transition shadow-2xs cursor-pointer active:scale-95"
          >
            <FileText className="size-4 text-muted-foreground" />
            Consolidated Report
          </button>

          {/* 5. Three Dots action menu */}
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
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* LEFT COLUMN: CASE HISTORY (Collapsed by default, expands on click) */}
        {showHistory && (
          <aside className="w-64 shrink-0 border-r border-border/80 bg-surface p-4 space-y-3 overflow-y-auto no-scrollbar hidden md:block animate-in slide-in-from-left duration-200">
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

        {/* CENTER COLUMN: AI ANALYSIS REPORT (Modular Cards) */}
        <main className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-6 lg:p-8 bg-surface-tint">
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-5">
            {/* Card 1: Case Title & Scope */}
            <section className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 p-5 sm:p-6 shadow-2xs">
              <div className="space-y-1.5">
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground leading-snug">
                  {selectedCase.title}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Multi-branch pharmaceutical inventory diagnostic, idle working capital recovery, and storage space optimization analysis.
                </p>
              </div>
            </section>

            {/* Card 2: Executive Summary & Findings */}
            <section className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 p-5 sm:p-6 shadow-2xs space-y-3.5">
              <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-zinc-800 pb-2.5">
                <FileText className="size-4 text-brand-blue shrink-0" />
                <h3 className="text-sm sm:text-base font-semibold tracking-tight text-foreground">
                  Executive Summary & Findings
                </h3>
              </div>

              <p className="text-xs sm:text-sm leading-relaxed text-foreground/90 font-normal">
                Multi-branch audit across hospital dispensary locations identified $5,000 in unsold pharmaceutical stock sitting stagnant across regional outpatient branches. These non-moving medicines severely lock up vital working capital while consuming critical refrigerated space and secure dispensary shelves. Telemetry from electronic health records and dispensary logs confirms zero units dispensed over the past 140–194 days for these batches, creating imminent risk of full inventory write-offs upon expiration. Automated recovery actions focus on immediate inter-branch transfers to central emergency and surgical suites, vendor consignment returns, and dynamic reorder threshold freezes.
              </p>

              {/* Executive Callout / Core Takeaway Box */}
              <div className="rounded-xl border-l-4 border-brand-blue bg-slate-50/90 dark:bg-zinc-800/50 p-4 sm:p-5 border-y border-r border-slate-200/70 dark:border-zinc-700/60 shadow-2xs">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-blue">
                    Core Operational Takeaway
                  </span>
                  <p className="text-xs sm:text-sm leading-relaxed text-foreground/90">
                    $5,000 in liquid capital is immobilized in dead stock across satellite branches due to fragmented cross-branch inventory visibility. Rapid inter-branch rebalancing unlocks 100% of this locked capital and frees 38 cu ft of high-value clinic storage without incurring secondary replenishment costs.
                  </p>
                </div>
              </div>
            </section>

            {/* Card 3: Key Data Points */}
            <section className="rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-2xs space-y-3.5">
              <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-zinc-800 pb-2.5">
                <svg
                  className="size-4 shrink-0 text-[#2563eb] dark:text-[#60a5fa]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                </svg>
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#2563eb] dark:text-[#60a5fa]">
                  Key Data Points
                </h3>
              </div>

              <div className="space-y-2">
                {currentCaseData.keyDataPoints.map((point, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3.5 rounded-xl bg-[#f0f7ff] dark:bg-blue-950/35 border border-blue-100/60 dark:border-blue-900/30 px-3.5 py-2.5 sm:px-4 sm:py-3 transition-colors"
                  >
                    <span className="grid size-5.5 sm:size-6 shrink-0 place-items-center rounded-full bg-[#dbeafe] text-[#2563eb] dark:bg-blue-900/70 dark:text-blue-200 text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm text-foreground/90 font-normal leading-normal">
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Card 4: Suggested Next Steps */}
            <section className="rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-2xs space-y-3.5">
              <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-zinc-800 pb-2.5">
                <CheckCircle2 className="size-4.5 shrink-0 text-[#059669] dark:text-[#34d399]" />
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#059669] dark:text-[#34d399]">
                  Suggested Next Steps
                </h3>
              </div>

              <div className="space-y-2">
                {currentCaseData.suggestedNextSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3.5 rounded-xl bg-[#f0fdf4] dark:bg-emerald-950/35 border border-emerald-100/60 dark:border-emerald-900/30 px-3.5 py-2.5 sm:px-4 sm:py-3 transition-colors"
                  >
                    <CheckCircle2 className="size-4.5 shrink-0 text-[#059669] dark:text-[#34d399]" />
                    <span className="text-xs sm:text-sm text-foreground/90 font-normal leading-normal">
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Card 5: Issue Details & Dead Stock Breakdown */}
            <section className="rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-zinc-800 pb-2.5">
                <Table2 className="size-4.5 text-brand-blue shrink-0" />
                <h3 className="text-sm sm:text-base font-semibold tracking-tight text-foreground">
                  Issue Details & Dead Stock Breakdown
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                Detailed breakdown of unsold pharmaceutical inventory sitting stagnant across regional branches, with locked capital valuations, idle holding duration, and immediate reallocation routings.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground bg-slate-50/80 dark:bg-zinc-800/40 rounded-xl p-3 border border-slate-200/80 dark:border-zinc-700/60">
                <span>
                  <strong className="font-semibold text-foreground">Impact Profile:</strong> Dead Stock / Working Capital Lockup
                </span>
                <span className="text-slate-300 dark:text-zinc-700 hidden sm:inline">•</span>
                <span>
                  <strong className="font-semibold text-foreground">Audit Period:</strong> 2026-09-10
                </span>
                <span className="text-slate-300 dark:text-zinc-700 hidden sm:inline">•</span>
                <span>
                  <strong className="font-semibold text-foreground">Scope:</strong> 3 Regional Branches · 4 Target SKUs ($5,000 Total)
                </span>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs">
                <table className="w-full text-left text-xs sm:text-sm whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/70 text-slate-700 dark:text-slate-200 font-semibold">
                      <th className="px-4 py-3 text-[11px] uppercase tracking-wider">Product ID</th>
                      <th className="px-4 py-3 text-[11px] uppercase tracking-wider">Product Name</th>
                      <th className="px-4 py-3 text-[11px] uppercase tracking-wider">Branch Location</th>
                      <th className="px-4 py-3 text-[11px] uppercase tracking-wider text-right">Stock Level</th>
                      <th className="px-4 py-3 text-[11px] uppercase tracking-wider text-right">Holding Duration</th>
                      <th className="px-4 py-3 text-[11px] uppercase tracking-wider text-right">Locked Capital</th>
                      <th className="px-4 py-3 text-[11px] uppercase tracking-wider text-right">Recommended Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/80 dark:divide-zinc-800 text-foreground/90">
                    <tr className="hover:bg-slate-50/70 dark:hover:bg-zinc-800/40 transition-colors">
                      <td className="px-4 py-3 font-mono font-medium text-foreground">48291</td>
                      <td className="px-4 py-3 font-medium text-foreground leading-snug">
                        HUMAN ALBUMIN 20%<br /><span className="text-xs text-muted-foreground">50ml IV Infusion</span>
                      </td>
                      <td className="px-4 py-3 text-foreground/80">Suburban Dispensary East</td>
                      <td className="px-4 py-3 font-mono text-right">14 vials</td>
                      <td className="px-4 py-3 font-mono text-right font-medium text-rose-600 dark:text-rose-400">194 days</td>
                      <td className="px-4 py-3 font-mono text-right font-semibold text-rose-600 dark:text-rose-400">$1,820.00</td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-block rounded-full bg-blue-50 dark:bg-blue-950/60 text-brand-blue px-2.5 py-0.5 text-xs font-medium">
                          Transfer to ICU
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/70 dark:hover:bg-zinc-800/40 transition-colors">
                      <td className="px-4 py-3 font-mono font-medium text-foreground">37565</td>
                      <td className="px-4 py-3 font-medium text-foreground leading-snug">
                        A TO Z NS MULTI<br /><span className="text-xs text-muted-foreground">Therapeutic Tabs (30s)</span>
                      </td>
                      <td className="px-4 py-3 text-foreground/80">North Outpatient Clinic</td>
                      <td className="px-4 py-3 font-mono text-right">120 packs</td>
                      <td className="px-4 py-3 font-mono text-right font-medium text-rose-600 dark:text-rose-400">165 days</td>
                      <td className="px-4 py-3 font-mono text-right font-semibold text-rose-600 dark:text-rose-400">$1,450.00</td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-block rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 text-xs font-medium">
                          Bundled Clearance
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/70 dark:hover:bg-zinc-800/40 transition-colors">
                      <td className="px-4 py-3 font-mono font-medium text-foreground">51024</td>
                      <td className="px-4 py-3 font-medium text-foreground leading-snug">
                        CEFTRIAXONE 1G INJ<br /><span className="text-xs text-muted-foreground">Powder for Solution</span>
                      </td>
                      <td className="px-4 py-3 text-foreground/80">Westside Daycare Unit</td>
                      <td className="px-4 py-3 font-mono text-right">65 vials</td>
                      <td className="px-4 py-3 font-mono text-right font-medium text-rose-600 dark:text-rose-400">182 days</td>
                      <td className="px-4 py-3 font-mono text-right font-semibold text-rose-600 dark:text-rose-400">$980.00</td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-block rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 px-2.5 py-0.5 text-xs font-medium">
                          Vendor Buy-Back
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/70 dark:hover:bg-zinc-800/40 transition-colors">
                      <td className="px-4 py-3 font-mono font-medium text-foreground">37714</td>
                      <td className="px-4 py-3 font-medium text-foreground leading-snug">
                        STERILE GAUZE 8PLY<br /><span className="text-xs text-muted-foreground">10x10cm Sponge (Pack)</span>
                      </td>
                      <td className="px-4 py-3 text-foreground/80">Trauma Satellite Dispensary</td>
                      <td className="px-4 py-3 font-mono text-right">85 boxes</td>
                      <td className="px-4 py-3 font-mono text-right font-medium text-amber-600 dark:text-amber-400">140 days</td>
                      <td className="px-4 py-3 font-mono text-right font-semibold text-rose-600 dark:text-rose-400">$750.00</td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-block rounded-full bg-blue-50 dark:bg-blue-950/60 text-brand-blue px-2.5 py-0.5 text-xs font-medium">
                          Transfer to Surgery
                        </span>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-300 dark:border-zinc-700 bg-slate-50/90 dark:bg-zinc-800/80 font-semibold text-foreground">
                      <td colSpan={5} className="px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
                        Total Stagnant Inventory (4 SKUs Across 3 Regional Branches)
                      </td>
                      <td className="px-4 py-3 font-mono text-right text-base text-rose-600 dark:text-rose-400 font-bold">
                        $5,000.00
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        100% Recoverable
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </section>
          </div>
        </main>

        {/* RIGHT COLUMN: AI ASSISTANT (Fixed within viewport height, independent message scroll) */}
        <aside className="w-80 xl:w-96 shrink-0 border-l border-border/80 bg-surface flex flex-col h-full min-h-0 hidden md:flex">
          {/* Assistant Header */}
          <div className="shrink-0 flex items-center justify-between border-b border-border/70 px-4 py-3 bg-surface">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-foreground">AI Assistant</h3>
              {messages.length > 0 && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-brand-blue dark:bg-blue-950 font-medium">
                  {messages.length} {messages.length === 1 ? "message" : "messages"}
                </span>
              )}
            </div>

            {messages.length > 0 && (
              <button
                type="button"
                onClick={() => setMessages([])}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded-lg hover:bg-tile transition cursor-pointer"
                title="New chat (Return to default screen)"
              >
                <RotateCcw className="size-3.5" />
                <span>New chat</span>
              </button>
            )}
          </div>

          {/* Main Area: Default View OR Active Chat Messages */}
          {messages.length === 0 ? (
            <div className="flex-1 min-h-0 overflow-y-auto flex items-center justify-center bg-surface">
              <AIAssistantDefaultView
                suggestions={currentAssistantConfig.suggestions}
                onSendMessage={(prompt) => handleSendMessage(undefined, prompt)}
              />
            </div>
          ) : (
            <>
              {/* Chat Messages */}
              <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
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

              {/* Chat Input Box (Permanently fixed at bottom of viewport) */}
              <div className="shrink-0 border-t border-border/70 p-3.5 bg-surface">
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
            </>
          )}
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
                  Consolidated Dead Stock & Capital Recovery Report
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Report ID: CR-2026-09-10 · Generated Today at 05:57 AM
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
                  Comprehensive cross-branch audit across hospital dispensary locations identified $5,000 in unsold pharmaceutical stock sitting stagnant across regional outpatient branches, locking up critical working capital and consuming prime dispensary storage space.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-tile/50 border border-border/40 p-3.5">
                  <span className="text-xs text-muted-foreground font-medium block">
                    Stagnant Dead Stock
                  </span>
                  <span className="text-lg font-bold text-rose-600 dark:text-rose-400">$5,000 USD</span>
                  <span className="text-xs text-muted-foreground block mt-0.5">
                    4 SKUs across 3 branches
                  </span>
                </div>

                <div className="rounded-2xl bg-tile/50 border border-border/40 p-3.5">
                  <span className="text-xs text-muted-foreground font-medium block">
                    Recoverable Working Capital
                  </span>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    +$5,000.00
                  </span>
                  <span className="text-xs text-muted-foreground block mt-0.5">
                    Via transfers & returns
                  </span>
                </div>
              </div>

              <div className="rounded-2xl bg-tile/70 border border-border/50 p-4 space-y-2">
                <span className="text-xs font-bold text-foreground uppercase tracking-wide block">
                  2. Immediate Recommendations
                </span>
                <ul className="space-y-1.5 text-xs text-muted-foreground list-disc pl-4">
                  <li>Transfer 14 vials of Human Albumin ($1,820) from Suburban Branch directly to Central Inpatient ICU.</li>
                  <li>Return eligible Ceftriaxone injectable batches ($980) to primary distributor for 100% account credit.</li>
                  <li>Bundle remaining vitamins and sterile gauze ($2,200) into outpatient discharge kits.</li>
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
