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
  Quote,
  CheckSquare,
  Square,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import { AIAssistantDefaultView } from "../components/AIAssistantDefaultView";

export const Route = createFileRoute("/details")({
  head: () => ({
    meta: [
      { title: "Q3 Revenue Drop & Margin Compression Analysis — AI Analysis Report" },
      {
        name: "description",
        content:
          "Comprehensive diagnostic on August revenue decline (-11.4%), acute chronic medication stockouts, footfall churn, and margin compression.",
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
    title: "Q3 Revenue Drop & Margin Compression Analysis",
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
    content: "What drove the 11.4% MoM revenue drop and margin compression in August?",
  },
  {
    id: "m-2",
    sender: "ai",
    content:
      "Chain gross revenue declined 11.4% MoM in August (falling from $1.60M to $1.42M), compressing EBITDA margins from 14.2% down to 9.8%.\n\nPrimary Contributory Drivers:\n• Acute Chronic Medication Stockouts: Stockout rates on top-50 chronic prescription drugs (antidiabetics, cardiac, antihypertensives) surged to 18.2%, causing an estimated $142,000 in lost basket conversions.\n• Quick-Commerce App Footfall Churn: Launch of competing 10-minute delivery dark stores in suburban clusters triggered a 19% drop in walk-in footfall, lowering average basket size from 3.4 to 2.6 items.\n• Severe Inventory Imbalance: While prescription essentials were unavailable, non-pharma personal care accumulated excess holding stock, locking up $310,000 in idle working capital (pushing DOS to 54 days).\n\nImmediate Action: Auto-transfer surplus cardiac/diabetic stock to Central Zone within 48 hours and launch a promotional clearance for personal care stock >90 days old.",
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
    source: "Chain Financial & Revenue Feed",
    timeframe: "August MoM Comparison",
    headline: "Gross Chain Revenue Deficit",
    baselineLabel: "August Target",
    baselineValue: "$1.60M target",
    automatedLabel: "Current Revenue",
    automatedValue: "$1.42M August",
    delta: "↓ 11.4% MoM drop",
    status: "EBITDA compressed to 9.8%",
    positive: false,
  },
  {
    icon: TrendingDown,
    source: "Chronic Prescription Supply Chain",
    timeframe: "Central Zone Audit",
    headline: "Chronic Prescription Fill Rate",
    baselineLabel: "Target Benchmark",
    baselineValue: "96.0% fill benchmark",
    automatedLabel: "Current Fill Rate",
    automatedValue: "81.8% August fill",
    delta: "↓ 14.2% fill deficit",
    status: "$142,000 lost conversions",
    positive: false,
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
      "Why did August gross revenue decline by 11.4%?",
      "Which branches had chronic medication stockouts?",
      "How to liquidate the $310,000 in personal care dead stock?",
      "What is our strategy against competing 10-minute delivery apps?",
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

export interface KeyMetricRow {
  metric: string;
  current: string;
  target: string;
  variance: string;
  negative: boolean;
}

export const case1KeyMetrics: KeyMetricRow[] = [
  {
    metric: "Gross Revenue",
    current: "$1.42M",
    target: "$1.60M",
    variance: "-11.4%",
    negative: true,
  },
  {
    metric: "Prescription Fill Rate",
    current: "81.8%",
    target: "96.0%",
    variance: "-14.2%",
    negative: true,
  },
  {
    metric: "Average Basket Value (ABV)",
    current: "$28.50",
    target: "$34.20",
    variance: "-16.6%",
    negative: true,
  },
  {
    metric: "Inventory Days of Supply (DOS)",
    current: "54 Days",
    target: "38 Days",
    variance: "+16 Days",
    negative: true,
  },
  {
    metric: "Customer Retention (90-Day)",
    current: "64%",
    target: "73%",
    variance: "-9.0%",
    negative: true,
  },
];

export interface SampleDataRecord {
  branchId: string;
  categoryItem: string;
  issueDetected: string;
  financialImpact: string;
  driver: string;
}

export const case1SampleData: SampleDataRecord[] = [
  {
    branchId: "BR-004 (Metro Downtown)",
    categoryItem: "Metformin 500mg, Telmisartan 40mg",
    issueDetected: "Out of Stock (6 days)",
    financialImpact: "-$14,200 lost sales",
    driver: "Vendor delivery delay",
  },
  {
    branchId: "BR-012 (West End Mall)",
    categoryItem: "OTC Pain Relief & First Aid",
    issueDetected: "Footfall drop (-28%)",
    financialImpact: "-$21,000 vs. budget",
    driver: "Competing app dark store nearby",
  },
  {
    branchId: "BR-009 (Airport Road)",
    categoryItem: "Premium Skincare & Cosmetics",
    issueDetected: "Zero turnover (90+ days)",
    financialImpact: "$46,000 trapped cash",
    driver: "Mismatched store demographic",
  },
  {
    branchId: "BR-018 (Green Valley)",
    categoryItem: "Chronic Prescription Refills",
    issueDetected: "Refill lapse (+31%)",
    financialImpact: "-$18,500 recurring",
    driver: "Service churn to quick-commerce",
  },
];

const caseSectionData: Record<string, CaseSectionData> = {
  "case-1": {
    keyDataPoints: [
      "Supply Chain Breakdown in Fast-Movers: Stockout rates on top-50 chronic prescription drugs (antidiabetics, cardiac, antihypertensives) surged to 18.2%, accounting for an estimated $142,000 in lost basket conversions.",
      "Aggressive Local Competition: Three high-density suburban clusters saw customer churn rise by 22% due to hyper-local quick-commerce apps offering 10-minute delivery on generic OTC items.",
      "Inventory Imbalance: While prescription essentials were understocked, non-pharma personal care categories accumulated excess holding stock, tying up $310,000 in idle working capital.",
      "Shrinking Prescription Attach Rate: Average basket size fell from 3.4 to 2.6 items per transaction as pharmacists consistently missed cross-selling OTC wellness products alongside refills.",
    ],
    suggestedNextSteps: [
      "Emergency Central Stock Rebalancing: Auto-transfer excess cardiac and diabetic stock from slower peripheral branches to the top 6 Central Zone locations within 48 hours.",
      "Supplier SLA Review: Meet with primary wholesale distributors regarding unfulfilled POs and activate secondary local distributors for chronic medicines.",
      "Launch Same-Day Express Refill: Pilot a 60-minute delivery guarantee for subscription and repeat prescription patients within a 3-mile radius of key branches.",
      "Dead-Stock Liquidation: Run a targeted promotional clearance on slow-moving FMCG and personal care stock older than 90 days to free up operational cash flow.",
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

export type CaseDetailsStatus = "Open" | "Hold" | "Close" | "Reopen";

interface StatusOption {
  value: CaseDetailsStatus;
  label: string;
  badgeClass: string;
  dotClass: string;
  description: string;
}

const statusOptions: StatusOption[] = [
  {
    value: "Open",
    label: "Open",
    badgeClass: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200/80 dark:border-blue-800/60",
    dotClass: "bg-blue-600 dark:bg-blue-400 animate-pulse",
    description: "Active investigation in progress",
  },
  {
    value: "Hold",
    label: "Hold",
    badgeClass: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60",
    dotClass: "bg-amber-500",
    description: "Temporarily paused pending data",
  },
  {
    value: "Close",
    label: "Close",
    badgeClass: "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 border-slate-300 dark:border-zinc-700",
    dotClass: "bg-slate-500",
    description: "Findings and actions finalized",
  },
  {
    value: "Reopen",
    label: "Reopen",
    badgeClass: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60",
    dotClass: "bg-emerald-500 animate-pulse",
    description: "Re-activated for follow-up audit",
  },
];

function CaseDetailsPage() {
  const [selectedCaseId, setSelectedCaseId] = useState<string>("case-1");
  // Case History collapsed by default
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showConsolidatedModal, setShowConsolidatedModal] = useState<boolean>(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isArchived, setIsArchived] = useState<boolean>(false);
  const [projectStatus, setProjectStatus] = useState<CaseDetailsStatus>("Open");
  const [showStatusDropdown, setShowStatusDropdown] = useState<boolean>(false);
  const [showMoreMenu, setShowMoreMenu] = useState<boolean>(false);

  useEffect(() => {
    const handleOutsideClick = () => {
      setShowMoreMenu(false);
      setShowStatusDropdown(false);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  const currentStatusConfig =
    statusOptions.find((s) => s.value === projectStatus) ?? statusOptions[0]!;

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

      // Case 1 specific responses (Case #842: Q3 Revenue Drop & Margin Compression Analysis)
      if (
        lower.includes("why") ||
        lower.includes("drop") ||
        lower.includes("11.4") ||
        lower.includes("margin") ||
        lower.includes("ebitda") ||
        lower.includes("revenue")
      ) {
        replyContent = `Overall chain revenue declined 11.4% MoM in August (from $1.60M down to $1.42M), compressing EBITDA margins from 14.2% to 9.8%.\n\nPrimary Drivers:\n1. Fast-Mover Stockouts: Chronic prescription drug stockouts surged to 18.2%, causing $142,000 in lost basket conversions.\n2. Quick-Commerce Competition: Walk-in footfall dropped 19% following the launch of competing 10-minute delivery apps, reducing Average Basket Value from $34.20 to $28.50 (-16.6%).\n3. Inventory Imbalance: Non-pharma personal care accumulated excess holding stock, tying up $310,000 in idle working capital (increasing DOS to 54 days).`;
      } else if (
        lower.includes("stockout") ||
        lower.includes("chronic") ||
        lower.includes("fast-mover") ||
        lower.includes("metformin") ||
        lower.includes("supply chain")
      ) {
        replyContent = `Stockout rates on top-50 chronic prescription drugs (antidiabetics, cardiac, antihypertensives) surged to 18.2% across Central Zone branches. In BR-004 (Metro Downtown), Metformin 500mg and Telmisartan 40mg were out of stock for 6 consecutive days due to wholesale vendor delivery delays, resulting in -$14,200 in direct lost sales and recurring patient churn.`;
      } else if (
        lower.includes("dead stock") ||
        lower.includes("personal care") ||
        lower.includes("310") ||
        lower.includes("capital") ||
        lower.includes("skincare") ||
        lower.includes("imbalance")
      ) {
        replyContent = `While chronic prescription medications were severely understocked, non-pharma personal care categories accumulated excess holding stock, tying up $310,000 in idle working capital. In BR-009 (Airport Road), premium skincare and cosmetics have recorded zero turnover for over 90 days ($46,000 trapped cash) due to a mismatched store demographic. A targeted clearance sale is recommended immediately.`;
      } else if (
        lower.includes("competition") ||
        lower.includes("delivery") ||
        lower.includes("footfall") ||
        lower.includes("churn") ||
        lower.includes("10-minute") ||
        lower.includes("dark store")
      ) {
        replyContent = `Three high-density suburban clusters saw customer churn rise by 22% due to hyper-local quick-commerce apps offering 10-minute delivery on generic OTC items. In BR-012 (West End Mall), footfall dropped 28% (-$21,000 vs budget) due to a competing dark store opening nearby. We recommend piloting a 60-minute delivery guarantee for repeat prescription patients within a 3-mile radius.`;
      } else if (
        lower.includes("action") ||
        lower.includes("recommend") ||
        lower.includes("to-do") ||
        lower.includes("rebalance") ||
        lower.includes("solution")
      ) {
        replyContent = `Top 4 recommended actions:
1. Emergency Central Stock Rebalancing: Auto-transfer excess cardiac and diabetic stock from peripheral branches to the top 6 Central Zone locations within 48 hours.
2. Supplier SLA Review: Meet with primary wholesale distributors regarding unfulfilled POs and activate secondary local distributors for chronic medicines.
3. Launch Same-Day Express Refill: Pilot a 60-minute delivery guarantee for subscription and repeat prescription patients within a 3-mile radius of key branches.
4. Dead-Stock Liquidation: Run a targeted promotional clearance on slow-moving FMCG and personal care stock older than 90 days to free up operational cash flow.`;
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
    title: "Q3 Revenue Drop & Margin Compression Analysis",
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
        {/* Left Side: Back button with Arrow and "Back" text */}
        <div className="flex items-center gap-2 min-w-0">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl px-2.5 py-1.5 hover:bg-tile text-muted-foreground hover:text-foreground transition cursor-pointer group"
            aria-label="Back to dashboard"
            title="Back to Dashboard"
          >
            <ArrowLeft className="size-5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm sm:text-base font-semibold text-foreground">Back</span>
          </Link>
        </div>

        {/* Right Side Options: Check Status Now, Case History, Continuous Auditing, Three Dots */}
        <div className="flex items-center gap-2.5 ml-auto">
          {/* 1. Check Status Now */}
          <button
            onClick={handleCheckStatus}
            disabled={isCheckingStatus}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-1.5 text-sm font-medium text-foreground hover:bg-tile transition shadow-2xs cursor-pointer active:scale-95 disabled:opacity-60"
          >
            <RotateCw
              className={`size-4 ${isCheckingStatus ? "animate-spin text-brand-blue" : "text-muted-foreground"
                }`}
            />
            Check Status Now
          </button>

          {/* 2. Case History */}
          <button
            onClick={() => setShowHistory((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-sm font-medium transition cursor-pointer ${showHistory
              ? "border-brand-blue bg-blue-50/70 text-brand-blue dark:bg-blue-950/50"
              : "border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-tile"
              }`}
            title="View or hide Case History"
          >
            <History className="size-4" />
            <span>Case History</span>
          </button>

          {/* 3. Continuous Auditing */}
          <button
            onClick={() => {
              setIsFollowing((prev) => {
                const next = !prev;
                setStatusMessage(
                  next
                    ? "Continuous auditing activated for this case"
                    : "Continuous auditing paused"
                );
                setTimeout(() => setStatusMessage(null), 3000);
                return next;
              });
            }}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-sm font-medium transition cursor-pointer active:scale-95 shadow-2xs ${isFollowing
              ? "border-emerald-500/80 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700"
              : "border-border bg-surface text-foreground hover:bg-tile"
              }`}
            title={isFollowing ? "Continuous auditing active" : "Enable continuous auditing"}
          >
            {isFollowing ? (
              <>
                <Check className="size-4 text-emerald-600 dark:text-emerald-400" />
                <span>Continuous Auditing</span>
              </>
            ) : (
              <>
                <Bell className="size-4 text-muted-foreground" />
                <span>Continuous Auditing</span>
              </>
            )}
          </button>

          {/* 4. Three Dots action menu (Includes Close Project, Consolidated Report, Archive Project) */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMoreMenu((prev) => !prev);
              }}
              className={`inline-flex items-center justify-center rounded-xl border p-2 transition cursor-pointer active:scale-95 shadow-2xs ${isArchived || projectStatus === "Close"
                ? "border-amber-500/80 bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700"
                : "border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-tile"
                }`}
              title="More options"
              aria-label="More options"
            >
              <MoreVertical className="size-4" />
            </button>

            {showMoreMenu && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-full mt-1.5 z-40 w-56 rounded-xl border border-border/80 bg-surface p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-100"
              >
                {/* Status Switcher Header */}
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Status
                </div>
                <div className="grid grid-cols-2 gap-1 px-1.5 pb-1.5">
                  {statusOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setProjectStatus(opt.value);
                        setStatusMessage(`Status updated to "${opt.label}"`);
                        setTimeout(() => setStatusMessage(null), 3000);
                        setShowMoreMenu(false);
                      }}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${projectStatus === opt.value
                        ? "bg-tile font-semibold text-foreground border border-border/80"
                        : "hover:bg-tile text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      <span className={`size-1.5 rounded-full ${opt.dotClass}`} />
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>

                <div className="my-1 border-t border-border/50" />

                {/* Consolidated Report */}
                <button
                  onClick={() => {
                    setShowConsolidatedModal(true);
                    setShowMoreMenu(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-tile transition cursor-pointer"
                >
                  <FileText className="size-4 text-muted-foreground" />
                  <span>Consolidated Report</span>
                </button>

                <div className="my-1 border-t border-border/50" />

                {/* Archive Project */}
                <button
                  onClick={() => {
                    setIsArchived((prev) => {
                      const next = !prev;
                      setStatusMessage(
                        next ? "Project has been archived" : "Project restored from archive"
                      );
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

      {/* Project Closed notification banner */}
      {projectStatus === "Close" && (
        <div className="bg-slate-500/10 border-b border-slate-500/25 text-slate-800 dark:text-slate-200 text-xs py-2 px-4 flex items-center justify-between font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>This project is marked as Closed. All findings and actions have been finalized.</span>
          </div>
          <button
            onClick={() => {
              setProjectStatus("Reopen");
              setStatusMessage("Project reopened");
              setTimeout(() => setStatusMessage(null), 3000);
            }}
            className="underline font-semibold hover:text-slate-950 dark:hover:text-slate-100 cursor-pointer"
          >
            Reopen Project
          </button>
        </div>
      )}

      {/* Project on Hold notification banner */}
      {projectStatus === "Hold" && (
        <div className="bg-amber-500/10 border-b border-amber-500/25 text-amber-900 dark:text-amber-200 text-xs py-2 px-4 flex items-center justify-between font-medium">
          <div className="flex items-center gap-2">
            <Clock className="size-3.5 text-amber-600 dark:text-amber-400" />
            <span>This project is currently on Hold. Investigation is paused pending clinical data.</span>
          </div>
          <button
            onClick={() => {
              setProjectStatus("Open");
              setStatusMessage("Project resumed (Open)");
              setTimeout(() => setStatusMessage(null), 3000);
            }}
            className="underline font-semibold hover:text-amber-950 dark:hover:text-amber-100 cursor-pointer"
          >
            Resume Project
          </button>
        </div>
      )}

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
                    className={`w-full text-left rounded-2xl p-3.5 transition-all border relative cursor-pointer ${isSelected
                      ? "border-blue-400/80 bg-blue-50/70 dark:bg-blue-950/40 dark:border-blue-800 shadow-xs"
                      : "border-border/60 bg-surface hover:bg-tile/70 text-muted-foreground"
                      }`}
                  >
                    <h4
                      className={`text-xs leading-snug ${isSelected ? "text-foreground font-semibold" : "text-foreground/80 font-medium"
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
            <section className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 p-5 sm:p-6 shadow-2xs space-y-3">
              <div className="relative inline-block text-xs">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowStatusDropdown((prev) => !prev);
                  }}
                  className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1 font-semibold transition cursor-pointer active:scale-95 shadow-2xs ${currentStatusConfig.badgeClass} hover:opacity-90`}
                  title="Click to change status"
                  aria-expanded={showStatusDropdown}
                >
                  <span className={`size-2 rounded-full ${currentStatusConfig.dotClass}`} />
                  <span>Status: {currentStatusConfig.label}</span>
                  <ChevronDown
                    className={`size-3.5 text-current transition-transform duration-200 ${showStatusDropdown ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {showStatusDropdown && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute left-0 top-full mt-2 z-30 w-44 rounded-2xl border border-border/80 bg-surface p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-100"
                  >
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/40 mb-1">
                      Change Status
                    </div>
                    {statusOptions.map((opt) => {
                      const isSelected = projectStatus === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setProjectStatus(opt.value);
                            setStatusMessage(`Status updated to "${opt.label}"`);
                            setTimeout(() => setStatusMessage(null), 3000);
                            setShowStatusDropdown(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition cursor-pointer ${isSelected
                            ? "bg-tile font-semibold text-foreground"
                            : "text-foreground/80 hover:bg-tile hover:text-foreground"
                            }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`size-2 rounded-full ${opt.dotClass}`} />
                            <span className="font-medium text-foreground">{opt.label}</span>
                          </div>
                          {isSelected && <Check className="size-3.5 text-brand-blue shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground leading-snug">
                  {selectedCase.title}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Comprehensive audit of August revenue contraction (-11.4%), acute chronic medication stockouts, footfall churn, and margin compression.
                </p>
              </div>
            </section>

            {/* Card 2: Executive Summary & Findings */}
            <section className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 p-5 sm:p-6 shadow-2xs space-y-3.5">
              <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-zinc-800 pb-2.5">
                <FileText className="size-4 text-brand-blue shrink-0" />
                <h3 className="text-sm sm:text-base font-semibold tracking-tight text-foreground">
                  Executive Summary
                </h3>
              </div>

              <p className="text-xs sm:text-sm leading-relaxed text-foreground/90 font-normal">
                Overall chain revenue declined 11.4% MoM in August, driven primarily by acute stockouts in top-margin chronic-care medications across the Central Zone and a 19% drop in walk-in footfall following the launch of a competing 10-minute delivery model. High operational overhead and dead-stock buildup in secondary product categories further compressed EBITDA margins from 14.2% to 9.8%.
              </p>

              {/* Executive Quote Block (Quote icon removed) */}
              <blockquote className="relative my-3 rounded-2xl border-l-4 border-rose-500 bg-rose-50/70 dark:bg-rose-950/30 p-5 sm:p-6 border-y border-r border-rose-200/70 dark:border-rose-900/40 shadow-xs">
                <p className="text-base sm:text-lg font-medium italic leading-relaxed text-foreground/95">
                  Gross revenue fell from $1.60M to $1.42M (-11.4%), while EBITDA margins contracted from 14.2% to 9.8%. Immediate recovery requires emergency central stock rebalancing, vendor SLA escalation, and liquidating $310,000 in non-pharma dead stock.
                </p>
              </blockquote>
            </section>

            {/* Card 3: High-Level Insights */}
            <section className="rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="border-b border-slate-200/80 dark:border-zinc-800 pb-3">
                <h3 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
                  High-Level Insights
                </h3>
              </div>

              <div className="space-y-3">
                {currentCaseData.keyDataPoints.map((point, idx) => {
                  const parts = point.split(":");
                  const title = parts.length > 1 ? parts[0] : `Insight ${idx + 1}`;
                  const description = parts.length > 1 ? parts.slice(1).join(":") : point;
                  return (
                    <div
                      key={idx}
                      className="rounded-xl bg-[#f0f7ff] dark:bg-blue-950/35 border border-blue-100/60 dark:border-blue-900/30 p-4 sm:p-5 transition-all hover:border-blue-200 dark:hover:border-blue-800/60"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6">
                        {/* Left side: Bigger Title with Number */}
                        <div className="sm:w-5/12 md:w-1/3 shrink-0 flex items-start gap-3">
                          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#dbeafe] text-[#2563eb] dark:bg-blue-900/70 dark:text-blue-200 text-sm font-bold">
                            {idx + 1}
                          </span>
                          <h4 className="text-sm sm:text-base font-normal text-foreground leading-snug pt-0.5">
                            {title}
                          </h4>
                        </div>

                        {/* Right side: Content */}
                        <div className="sm:flex-1 pt-0.5 sm:border-l sm:border-blue-200/60 dark:sm:border-blue-900/40 sm:pl-6">
                          <p className="text-sm sm:text-[15px] leading-relaxed text-foreground/85 font-normal">
                            {description.trim()}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Card 4: Key Metrics */}
            <section className="rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-zinc-800 pb-3">
                <h3 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
                  Key Metrics
                </h3>
                <span className="text-[11px] font-medium text-muted-foreground">
                  August MoM Variance
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs">
                <table className="w-full text-left text-xs sm:text-sm whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/70 text-slate-700 dark:text-slate-200 font-semibold">
                      <th className="px-4 py-3 text-[11px] uppercase tracking-wider">Metric</th>
                      <th className="px-4 py-3 text-[11px] uppercase tracking-wider text-right">Current (Aug)</th>
                      <th className="px-4 py-3 text-[11px] uppercase tracking-wider text-right">Target / Prior Month</th>
                      <th className="px-4 py-3 text-[11px] uppercase tracking-wider text-right">Variance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/80 dark:divide-zinc-800 text-foreground/90">
                    {case1KeyMetrics.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-zinc-800/40 transition-colors">
                        <td className="px-4 py-3 font-medium text-foreground">{row.metric}</td>
                        <td className="px-4 py-3 font-mono text-right font-semibold text-foreground">
                          {row.current}
                        </td>
                        <td className="px-4 py-3 font-mono text-right text-muted-foreground">
                          {row.target}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="inline-flex items-center gap-1 font-mono font-bold text-xs px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                            {row.variance}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Card 5: Recommended Actions (To-Do) */}
            <section className="rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="border-b border-slate-200/80 dark:border-zinc-800 pb-3">
                <h3 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
                  Recommended Actions (To-Do)
                </h3>
              </div>

              <div className="space-y-3">
                {currentCaseData.suggestedNextSteps.map((step, idx) => {
                  const parts = step.split(":");
                  const title = parts.length > 1 ? parts[0] : `Action ${idx + 1}`;
                  const description = parts.length > 1 ? parts.slice(1).join(":") : step;
                  return (
                    <div
                      key={idx}
                      className="rounded-xl bg-[#f0fdf4] dark:bg-emerald-950/35 border border-emerald-100/60 dark:border-emerald-900/30 p-4 sm:p-5 transition-all hover:border-emerald-200 dark:hover:border-emerald-800/60"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6">
                        {/* Left side: Title with Checkbox Indicator */}
                        <div className="sm:w-5/12 md:w-1/3 shrink-0 flex items-start gap-2.5">
                          <div className="mt-0.5 size-4.5 rounded-[5px] border border-emerald-500/70 bg-white dark:bg-zinc-900 flex items-center justify-center shrink-0 shadow-2xs">
                            <Check className="size-3 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
                          </div>
                          <h4 className="text-sm sm:text-base font-normal text-foreground leading-snug pt-0.5">
                            {title}
                          </h4>
                        </div>

                        {/* Right side: Content */}
                        <div className="sm:flex-1 pt-0.5 sm:border-l sm:border-emerald-200/60 dark:sm:border-emerald-900/40 sm:pl-6">
                          <p className="text-sm sm:text-[15px] leading-relaxed text-foreground/85 font-normal">
                            {description.trim()}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Card 6: Sample Data Records (Underlying Evidence) */}
            <section className="rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="border-b border-slate-200/80 dark:border-zinc-800 pb-3">
                <h3 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
                  Sample Data Records (Underlying Evidence)
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                Direct evidence telemetry from urban and suburban pharmacy branch locations detailing fast-mover stockouts, footfall churn, and dead stock capital lockup.
              </p>

              {/* Data Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs">
                <table className="w-full text-left text-xs sm:text-sm whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/70 text-slate-700 dark:text-slate-200 font-semibold">
                      <th className="px-4 py-3 text-[11px] uppercase tracking-wider">Branch ID</th>
                      <th className="px-4 py-3 text-[11px] uppercase tracking-wider">Category / Item</th>
                      <th className="px-4 py-3 text-[11px] uppercase tracking-wider">Issue Detected</th>
                      <th className="px-4 py-3 text-[11px] uppercase tracking-wider text-right">Financial Impact</th>
                      <th className="px-4 py-3 text-[11px] uppercase tracking-wider">Driver</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/80 dark:divide-zinc-800 text-foreground/90">
                    {case1SampleData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-zinc-800/40 transition-colors">
                        <td className="px-4 py-3 font-mono font-medium text-foreground">{row.branchId}</td>
                        <td className="px-4 py-3 font-medium text-foreground">{row.categoryItem}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                            {row.issueDetected}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-right font-semibold text-rose-600 dark:text-rose-400">
                          {row.financialImpact}
                        </td>
                        <td className="px-4 py-3 text-foreground/80">{row.driver}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-300 dark:border-zinc-700 bg-slate-50/90 dark:bg-zinc-800/80 font-semibold text-foreground">
                      <td colSpan={3} className="px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
                        Total Sampled Immediate Financial Exposure
                      </td>
                      <td className="px-4 py-3 font-mono text-right text-base text-rose-600 dark:text-rose-400 font-bold">
                        -$99,700
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        Across 4 sample branches
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
                  Q3 Revenue Drop & Margin Compression Analysis
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Generated Today at 05:57 AM
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
                  Overall chain revenue declined 11.4% MoM in August, driven primarily by acute stockouts in top-margin chronic-care medications across the Central Zone and a 19% drop in walk-in footfall following the launch of a competing 10-minute delivery model. EBITDA margins compressed from 14.2% to 9.8%.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-tile/50 border border-border/40 p-3.5">
                  <span className="text-xs text-muted-foreground font-medium block">
                    August Gross Revenue
                  </span>
                  <span className="text-lg font-bold text-rose-600 dark:text-rose-400">$1.42M USD</span>
                  <span className="text-xs text-muted-foreground block mt-0.5">
                    -11.4% vs $1.60M target
                  </span>
                </div>

                <div className="rounded-2xl bg-tile/50 border border-border/40 p-3.5">
                  <span className="text-xs text-muted-foreground font-medium block">
                    Prescription Fill Rate
                  </span>
                  <span className="text-lg font-bold text-rose-600 dark:text-rose-400">
                    81.8% Fill
                  </span>
                  <span className="text-xs text-muted-foreground block mt-0.5">
                    $142,000 lost conversions
                  </span>
                </div>
              </div>

              <div className="rounded-2xl bg-tile/70 border border-border/50 p-4 space-y-2">
                <span className="text-xs font-bold text-foreground uppercase tracking-wide block">
                  2. Immediate Recommendations
                </span>
                <ul className="space-y-1.5 text-xs text-muted-foreground list-disc pl-4">
                  <li>Emergency Central Stock Rebalancing: Auto-transfer excess cardiac and diabetic stock to top 6 Central Zone branches within 48 hours.</li>
                  <li>Supplier SLA Review: Meet with wholesale distributors regarding unfulfilled POs and activate secondary local distributors.</li>
                  <li>Launch Same-Day Express Refill: Pilot a 60-minute delivery guarantee for repeat prescription patients within 3 miles.</li>
                  <li>Dead-Stock Liquidation: Promotional clearance on slow-moving FMCG and personal care stock older than 90 days to free up $310,000.</li>
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
