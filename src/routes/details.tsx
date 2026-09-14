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
  ChevronLeft,
  ChevronRight,
  Presentation,
  Layers,
  ListFilter,
} from "lucide-react";
import { AIAssistantDefaultView } from "../components/AIAssistantDefaultView";
import { ScanningRadarIcon } from "../components/ScanningRadarIcon";

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

export interface CaseSummaryConfig {
  narrative: string;
  quote: string;
  metrics: { label: string; val: string; alert?: boolean }[];
}

export const caseSummaries: Record<string, CaseSummaryConfig> = {
  "case-1": {
    narrative:
      "Overall chain revenue declined 11.4% MoM in August, driven primarily by acute stockouts in top-margin chronic-care medications across the Central Zone and a 19% drop in walk-in footfall following the launch of a competing 10-minute delivery model. High operational overhead and dead-stock buildup in secondary product categories further compressed EBITDA margins from 14.2% to 9.8%.",
    quote:
      "Gross revenue fell from $1.60M to $1.42M (-11.4%), while EBITDA margins contracted from 14.2% to 9.8%. Immediate recovery requires emergency central stock rebalancing, vendor SLA escalation, and liquidating $310,000 in non-pharma dead stock.",
    metrics: [
      { label: "Revenue", val: "-$180K (-11.4%)", alert: true },
      { label: "Rx Stockout", val: "18.2%", alert: true },
      { label: "EBITDA Margin", val: "9.8% (-4.4%)", alert: true },
      { label: "Trapped Stock", val: "$310,000" },
    ],
  },
  "case-2": {
    narrative:
      "Outpatient consultations and surgical admissions declined 14% across specialties during the recent cycle, primarily due to lead times lengthening to 15 business days. Underutilization of morning physician rotas and lack of automated appointment confirmations compounded patient scheduling attrition.",
    quote:
      "Outpatient inflow contracted 14% with 46% unused morning slots. Corrective measures focus on realigning physician schedules, opening walk-in specialty slots, and automated waitlist backfill.",
    metrics: [
      { label: "Patient Volume", val: "-14%", alert: true },
      { label: "Lead Time", val: "15 Days (+7d)", alert: true },
      { label: "Slot Utilization", val: "54%", alert: true },
      { label: "Complaints", val: "+22%" },
    ],
  },
  "case-3": {
    narrative:
      "Outpatient appointment cancellations surged by 18%, highly concentrated on Monday and Friday mornings. Investigation reveals 68% of cancellations occurred within 4 hours of appointment times, driving surgical suite idle turnover buffer times up to 38 minutes.",
    quote:
      "Late cancellations surged by 18%, creating 38 minutes of surgical suite idle buffer per turnover. Recommended rapid fixes include 24h/2h automated SMS reminders and active standby waitlist backfills.",
    metrics: [
      { label: "Cancellations", val: "+18%", alert: true },
      { label: "Late Cancel Rate", val: "68%", alert: true },
      { label: "Idle Buffer", val: "38 mins", alert: true },
      { label: "SMS Delivery", val: "74% (-26%)" },
    ],
  },
  "case-4": {
    narrative:
      "Audit of clinical clearinghouse logs identified €38,000 in completed laboratory diagnostic orders that remained unbilled over the past 30 days. Reconciliation uncovered 42 rejected claims due to missing procedure modifier codes and manual intake transcription omissions.",
    quote:
      "€38,000 in unbilled laboratory diagnostics identified. Action plan mandates automated daily order-to-claim reconciliation, EHR billing validation filters, and clinician modifier retraining.",
    metrics: [
      { label: "Unbilled Gap", val: "€38,000", alert: true },
      { label: "Rejected Claims", val: "42 Claims", alert: true },
      { label: "Cycle Time", val: "18 Days", alert: true },
      { label: "Modifier Errors", val: "100%" },
    ],
  },
};

export const caseKeyMetricsData: Record<string, KeyMetricRow[]> = {
  "case-1": case1KeyMetrics,
  "case-2": [
    { metric: "Outpatient Inflow", current: "1,420 Patients", target: "1,650 Patients", variance: "-14.0%", negative: true },
    { metric: "Consultation Lead Time", current: "15 Days", target: "8 Days", variance: "+7 Days", negative: true },
    { metric: "Physician Slot Utilization", current: "54%", target: "88%", variance: "-34.0%", negative: true },
    { metric: "Walk-in Conversion Rate", current: "41%", target: "65%", variance: "-24.0%", negative: true },
    { metric: "Patient Scheduling CSAT", current: "72%", target: "92%", variance: "-20.0%", negative: true },
  ],
  "case-3": [
    { metric: "OP Appointment Cancellations", current: "348 Appointments", target: "295 Appointments", variance: "+18.0%", negative: true },
    { metric: "Short-Notice Cancel (<4h)", current: "68%", target: "20%", variance: "+48.0%", negative: true },
    { metric: "Surgical Suite Turnover Buffer", current: "38 mins", target: "15 mins", variance: "+23 mins", negative: true },
    { metric: "SMS Reminder Delivery Rate", current: "73.8%", target: "98.0%", variance: "-24.2%", negative: true },
    { metric: "Standby Waitlist Backfill Rate", current: "22%", target: "75%", variance: "-53.0%", negative: true },
  ],
  "case-4": [
    { metric: "Unbilled Diagnostic Orders", current: "€38,000", target: "€0", variance: "+€38,000", negative: true },
    { metric: "Rejected Claim Rate", current: "14.2%", target: "2.5%", variance: "+11.7%", negative: true },
    { metric: "Reconciliation Cycle Time", current: "18 Days", target: "3 Days", variance: "+15 Days", negative: true },
    { metric: "Modifier Code Accuracy", current: "62%", target: "99%", variance: "-37.0%", negative: true },
    { metric: "EHR-to-Billing Auto Match", current: "78%", target: "98%", variance: "-20.0%", negative: true },
  ],
};

export const caseSampleTelemetryData: Record<string, { records: SampleDataRecord[]; totalExposure: string; coverage: string }> = {
  "case-1": {
    records: case1SampleData,
    totalExposure: "-$99,700",
    coverage: "Across 4 sample branches",
  },
  "case-2": {
    records: [
      { branchId: "DEPT-CARD", categoryItem: "Cardiology Consultations", issueDetected: "Lead time 16 days", financialImpact: "-$32,000 unbooked", driver: "Slot misallocation" },
      { branchId: "DEPT-ORTH", categoryItem: "Orthopedic Surgery", issueDetected: "Lead time 18 days", financialImpact: "-$48,000 unbooked", driver: "Surgeon rotation" },
      { branchId: "DEPT-NEUR", categoryItem: "Neurology Clinics", issueDetected: "Morning idle 58%", financialImpact: "-$22,000 idle time", driver: "Transit peak clash" },
      { branchId: "DEPT-PEDI", categoryItem: "Pediatric Outpatient", issueDetected: "Walk-in deflection", financialImpact: "-$14,500 churn", driver: "Long waiting buffer" },
    ],
    totalExposure: "-$116,500",
    coverage: "Across 4 outpatient clinical departments",
  },
  "case-3": {
    records: [
      { branchId: "OR-SUITE-1", categoryItem: "General Surgery Suite", issueDetected: "Late cancel (Mon 8am)", financialImpact: "-$18,400 idle OR", driver: "No 24h reminder SMS" },
      { branchId: "OR-SUITE-3", categoryItem: "Day Surgery Unit", issueDetected: "Turnover lag 42 mins", financialImpact: "-$12,600 buffer loss", driver: "Standby patient delay" },
      { branchId: "CLINIC-A", categoryItem: "Specialist OP Morning", issueDetected: "6 cancellations", financialImpact: "-$8,200 unfilled", driver: "Transit bottleneck" },
      { branchId: "CLINIC-C", categoryItem: "Friday Afternoon Clinic", issueDetected: "4 cancellations", financialImpact: "-$6,800 unfilled", driver: "Weekend reschedule" },
    ],
    totalExposure: "-$46,000",
    coverage: "Across 4 operative & clinical suites",
  },
  "case-4": {
    records: [
      { branchId: "LAB-HEMA", categoryItem: "Complete Blood Counts (CBC)", issueDetected: "Unbilled modifier 25", financialImpact: "€12,400 held", driver: "Order slip transcription" },
      { branchId: "LAB-BIO", categoryItem: "Comprehensive Metabolic Panel", issueDetected: "Unmatched requisition", financialImpact: "€14,200 pending", driver: "EHR sync delay" },
      { branchId: "LAB-PATH", categoryItem: "Tissue Biopsy Diagnostic", issueDetected: "Rejected diagnosis code", financialImpact: "€7,800 rejected", driver: "Clinical modifier missing" },
      { branchId: "LAB-MICR", categoryItem: "Microbiology Culture Panel", issueDetected: "Delayed bill submission", financialImpact: "€3,600 delayed", driver: "Batch processing lag" },
    ],
    totalExposure: "€38,000",
    coverage: "Across 4 laboratory diagnostic divisions",
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
  const [showIndexDropdown, setShowIndexDropdown] = useState<boolean>(false);

  // Slide presentation definitions, scrollspy, and scroll progress state
  const slideDefs = [
    { id: "summary", shortTitle: "Summary", fullTitle: "Executive Summary" },
    { id: "insights", shortTitle: "Insights", fullTitle: "High-Level Insights" },
    { id: "metrics", shortTitle: "Metrics", fullTitle: "Key Metrics" },
    { id: "actions", shortTitle: "Actions", fullTitle: "Recommended Actions" },
    { id: "telemetry", shortTitle: "Evidence", fullTitle: "Sample Data Records" },
  ];

  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeSlideId, setActiveSlideId] = useState<string>("summary");
  const [checkedActions, setCheckedActions] = useState<Record<number, boolean>>({});
  const [showAIAssistant, setShowAIAssistant] = useState<boolean>(true);

  const handleMainScroll = (e: React.UIEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll > 0) {
      const pct = (el.scrollTop / maxScroll) * 100;
      setScrollProgress(Math.min(100, Math.max(0, pct)));
    } else {
      setScrollProgress(0);
    }

    // Scrollspy: update active slide based on scroll position
    const containerTop = el.getBoundingClientRect().top;
    let currentId = slideDefs[0]?.id ?? "summary";
    for (const slide of slideDefs) {
      const slideEl = document.getElementById(`slide-${slide.id}`);
      if (slideEl) {
        const rect = slideEl.getBoundingClientRect();
        if (rect.top - containerTop <= 160) {
          currentId = slide.id;
        }
      }
    }
    setActiveSlideId(currentId);
  };

  const scrollToSlide = (slideId: string) => {
    const el = document.getElementById(`slide-${slideId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setActiveSlideId(slideId);
  };

  const toggleAction = (idx: number) => {
    setCheckedActions((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  useEffect(() => {
    const handleOutsideClick = () => {
      setShowMoreMenu(false);
      setShowStatusDropdown(false);
      setShowIndexDropdown(false);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  // Reset checked actions when switching case
  useEffect(() => {
    setCheckedActions({});
  }, [selectedCaseId]);

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

  const currentSummary: CaseSummaryConfig =
    caseSummaries[selectedCase.id] ?? caseSummaries["case-1"]!;

  const currentMetrics: KeyMetricRow[] =
    caseKeyMetricsData[selectedCase.id] ?? caseKeyMetricsData["case-1"]!;

  const currentTelemetry =
    caseSampleTelemetryData[selectedCase.id] ?? caseSampleTelemetryData["case-1"]!;


  const renderSlideCard = (slideIdx: number, anchorId?: string) => {
    switch (slideIdx) {
      case 0:
        return (
          <article
            key="slide-0"
            id={anchorId}
            className="rounded-none border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[520px]"
          >
            {/* Left Column: Ambient Pastel Glow & Title */}
            <div className="lg:col-span-5 p-7 sm:p-9 lg:p-10 flex flex-col justify-start border-b lg:border-b-0 lg:border-r border-slate-200/80 dark:border-zinc-800 relative overflow-hidden bg-gradient-to-br from-[#dff2fe]/95 via-[#e5faf0]/90 to-[#fefae0]/95 dark:from-[#092237] dark:via-[#072a1b] dark:to-[#222110]">
              <div className="pointer-events-none absolute -top-16 -left-16 size-56 rounded-full bg-sky-300/35 dark:bg-sky-500/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -right-16 size-56 rounded-full bg-emerald-300/30 dark:bg-emerald-500/15 blur-3xl" />
              <div className="pointer-events-none absolute top-1/2 left-1/3 size-40 rounded-full bg-amber-200/25 dark:bg-amber-500/10 blur-2xl" />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xs border border-white/60 dark:border-zinc-700/60 text-slate-800 dark:text-slate-200 shadow-2xs">
                    Executive Summary
                  </span>
                </div>

                <div className="space-y-2 pt-2">
                  <h2
                    style={{ fontWeight: 300 }}
                    className="text-2xl sm:text-3xl lg:text-[32px] font-light font-[300] tracking-tight text-slate-900 dark:text-slate-100 leading-snug"
                  >
                    {selectedCase.title}
                  </h2>
                  <p
                    style={{ fontWeight: 300 }}
                    className="text-sm sm:text-base text-slate-700/90 dark:text-slate-300/90 leading-relaxed font-light font-[300]"
                  >
                    Comprehensive diagnostic on operational run rates, medication supply integrity, footfall churn, and margin variance.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Clean Executive Content */}
            <div className="lg:col-span-7 p-7 sm:p-9 lg:p-10 flex flex-col justify-center bg-white dark:bg-zinc-900 space-y-6">
              <div className="flex items-center gap-2.5 pb-2 border-b border-border/60">
                <FileText className="size-5 text-brand-blue shrink-0" />
                <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Executive Summary
                </h3>
              </div>

              <p
                style={{ fontWeight: 300, fontSize: "18px" }}
                className="text-[18px] leading-relaxed text-foreground/90 font-light font-[300]"
              >
                {currentSummary.narrative}
              </p>

              <blockquote className="rounded-2xl border-l-4 border-rose-500 bg-rose-50/80 dark:bg-rose-950/30 p-5 sm:p-6 border-y border-r border-rose-200/70 dark:border-rose-900/40 shadow-2xs">
                <p
                  style={{ fontWeight: 300, fontSize: "16px" }}
                  className="text-[16px] italic leading-relaxed text-foreground/95 font-light font-[300]"
                >
                  {currentSummary.quote}
                </p>
              </blockquote>

              {/* Key Highlights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                {currentSummary.metrics.map((m, mIdx) => {
                  const match = m.val.match(/^(.*?)\s*(\([+-]?\d+[^)]*\))$/);
                  const mainVal = match ? match[1] : m.val;
                  const changeVal = match ? match[2] : null;

                  return (
                    <div
                      key={mIdx}
                      className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-800/40 p-3.5 space-y-1"
                    >
                      <span className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        {m.label}
                      </span>
                      <div className="flex flex-wrap items-baseline gap-1">
                        <span
                          className={`text-base sm:text-lg font-['Archivo'] tabular-nums font-bold ${
                            m.alert ? "text-rose-600 dark:text-rose-400" : "text-slate-800 dark:text-slate-200"
                          }`}
                        >
                          {mainVal}
                        </span>
                        {changeVal && (
                          <span
                            className={`text-xs font-['Archivo'] tabular-nums font-medium ${
                              m.alert ? "text-rose-600/80 dark:text-rose-400/80" : "text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            {changeVal}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </article>
        );

      case 1:
        return (
          <article
            key="slide-1"
            id={anchorId}
            className="rounded-none border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[520px]"
          >
            {/* Left Column: Ambient Pastel Glow */}
            <div className="lg:col-span-5 p-7 sm:p-9 lg:p-10 flex flex-col justify-start border-b lg:border-b-0 lg:border-r border-slate-200/80 dark:border-zinc-800 relative overflow-hidden bg-gradient-to-br from-[#dff2fe]/95 via-[#e5faf0]/90 to-[#fefae0]/95 dark:from-[#092237] dark:via-[#072a1b] dark:to-[#222110]">
              <div className="pointer-events-none absolute -top-16 -left-16 size-56 rounded-full bg-sky-300/35 dark:bg-sky-500/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -right-16 size-56 rounded-full bg-emerald-300/30 dark:bg-emerald-500/15 blur-3xl" />
              <div className="pointer-events-none absolute top-1/2 left-1/3 size-40 rounded-full bg-amber-200/25 dark:bg-amber-500/10 blur-2xl" />

              <div className="relative z-10 space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xs border border-white/60 dark:border-zinc-700/60 text-slate-800 dark:text-slate-200 shadow-2xs">
                  Root Cause Analysis
                </span>

                <div className="space-y-2 pt-2">
                  <h2
                    style={{ fontWeight: 300 }}
                    className="text-2xl sm:text-3xl lg:text-[32px] font-light font-[300] tracking-tight text-slate-900 dark:text-slate-100 leading-snug"
                  >
                    High-Level Insights & Root Drivers
                  </h2>
                  <p
                    style={{ fontWeight: 300 }}
                    className="text-sm sm:text-base text-slate-700/90 dark:text-slate-300/90 leading-relaxed font-light font-[300]"
                  >
                    4 primary systemic breakdown vectors detected through automated reconciliation of POS transactions, fulfillment delays, and clinical prescriptions.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: 4 Systemic Insights */}
            <div className="lg:col-span-7 p-7 sm:p-9 lg:p-10 flex flex-col justify-center bg-white dark:bg-zinc-900 space-y-5">
              <div className="flex items-center gap-2.5 pb-2 border-b border-border/60">
                <TrendingDown className="size-5 text-brand-blue shrink-0" />
                <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  High-Level Insights
                </h3>
              </div>

              <div className="space-y-3.5">
                {currentCaseData.keyDataPoints.map((point, idx) => {
                  const parts = point.split(":");
                  const title = parts.length > 1 ? parts[0] : `Systemic Driver ${idx + 1}`;
                  const description = parts.length > 1 ? parts.slice(1).join(":") : point;
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl bg-slate-50/80 dark:bg-zinc-800/50 border border-slate-200/70 dark:border-zinc-800 p-4 sm:p-5 transition hover:border-slate-300 dark:hover:border-zinc-700"
                    >
                      <div className="flex items-start gap-4">
                        <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-blue-100 dark:bg-blue-900/60 text-brand-blue dark:text-blue-300 text-sm font-bold shadow-2xs">
                          {idx + 1}
                        </span>
                        <div className="space-y-1 flex-1">
                          <h4 className="text-base sm:text-lg font-semibold text-foreground leading-snug">
                            {title}
                          </h4>
                          <p className="text-base sm:text-[17px] leading-relaxed text-foreground/85 font-normal">
                            {description.trim()}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </article>
        );

      case 2:
        return (
          <article
            key="slide-2"
            id={anchorId}
            className="rounded-none border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[520px]"
          >
            {/* Left Column: Ambient Pastel Glow */}
            <div className="lg:col-span-5 p-7 sm:p-9 lg:p-10 flex flex-col justify-start border-b lg:border-b-0 lg:border-r border-slate-200/80 dark:border-zinc-800 relative overflow-hidden bg-gradient-to-br from-[#dff2fe]/95 via-[#e5faf0]/90 to-[#fefae0]/95 dark:from-[#092237] dark:via-[#072a1b] dark:to-[#222110]">
              <div className="pointer-events-none absolute -top-16 -left-16 size-56 rounded-full bg-sky-300/35 dark:bg-sky-500/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -right-16 size-56 rounded-full bg-emerald-300/30 dark:bg-emerald-500/15 blur-3xl" />
              <div className="pointer-events-none absolute top-1/2 left-1/3 size-40 rounded-full bg-amber-200/25 dark:bg-amber-500/10 blur-2xl" />

              <div className="relative z-10 space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xs border border-white/60 dark:border-zinc-700/60 text-slate-800 dark:text-slate-200 shadow-2xs">
                  Financial Performance
                </span>

                <div className="space-y-2 pt-2">
                  <h2
                    style={{ fontWeight: 300 }}
                    className="text-2xl sm:text-3xl lg:text-[32px] font-light font-[300] tracking-tight text-slate-900 dark:text-slate-100 leading-snug"
                  >
                    Key Metrics & Financial Variances
                  </h2>
                  <p
                    style={{ fontWeight: 300 }}
                    className="text-sm sm:text-base text-slate-700/90 dark:text-slate-300/90 leading-relaxed font-light font-[300]"
                  >
                    Operating performance benchmarked against historical baseline targets and prior month run rates.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Key Metrics Table */}
            <div className="lg:col-span-7 p-7 sm:p-9 lg:p-10 flex flex-col justify-center bg-white dark:bg-zinc-900 space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <div className="flex items-center gap-2.5">
                  <Table2 className="size-5 text-brand-blue shrink-0" />
                  <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Key Metrics
                </h3>
                </div>
                <span className="text-xs font-medium text-muted-foreground">Variance vs. Target</span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/70 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm uppercase tracking-wider">
                      <th className="px-3.5 sm:px-4 py-3">Metric</th>
                      <th className="px-3.5 sm:px-4 py-3 text-right">Current</th>
                      <th className="px-3.5 sm:px-4 py-3 text-right">Target / Prior</th>
                      <th className="px-3.5 sm:px-4 py-3 text-right">Variance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/80 dark:divide-zinc-800">
                    {currentMetrics.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-zinc-800/40 transition-colors">
                        <td className="px-3.5 sm:px-4 py-3 text-sm sm:text-base font-medium text-foreground">{row.metric}</td>
                        <td className="px-3.5 sm:px-4 py-3 font-['Archivo'] tabular-nums text-sm sm:text-base font-bold text-foreground text-right">{row.current}</td>
                        <td className="px-3.5 sm:px-4 py-3 font-['Archivo'] tabular-nums text-sm sm:text-base text-muted-foreground text-right">{row.target}</td>
                        <td className="px-3.5 sm:px-4 py-3 text-right">
                          <span className="inline-flex items-center font-['Archivo'] tabular-nums font-medium text-[11px] sm:text-xs px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                            {row.variance}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-sm sm:text-base text-muted-foreground italic pt-1">
                Prescription fill rate drop directly accounts for over 78% of the overall basket churn and margin compression.
              </p>
            </div>
          </article>
        );

      case 3:
        return (
          <article
            key="slide-3"
            id={anchorId}
            className="rounded-none border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[520px]"
          >
            {/* Left Column: Ambient Pastel Glow */}
            <div className="lg:col-span-5 p-7 sm:p-9 lg:p-10 flex flex-col justify-start border-b lg:border-b-0 lg:border-r border-slate-200/80 dark:border-zinc-800 relative overflow-hidden bg-gradient-to-br from-[#dff2fe]/95 via-[#e5faf0]/90 to-[#fefae0]/95 dark:from-[#092237] dark:via-[#072a1b] dark:to-[#222110]">
              <div className="pointer-events-none absolute -top-16 -left-16 size-56 rounded-full bg-sky-300/35 dark:bg-sky-500/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -right-16 size-56 rounded-full bg-emerald-300/30 dark:bg-emerald-500/15 blur-3xl" />
              <div className="pointer-events-none absolute top-1/2 left-1/3 size-40 rounded-full bg-amber-200/25 dark:bg-amber-500/10 blur-2xl" />

              <div className="relative z-10 space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xs border border-white/60 dark:border-zinc-700/60 text-slate-800 dark:text-slate-200 shadow-2xs">
                  Strategic Action Plan
                </span>

                <div className="space-y-2 pt-2">
                  <h2
                    style={{ fontWeight: 300 }}
                    className="text-2xl sm:text-3xl lg:text-[32px] font-light font-[300] tracking-tight text-slate-900 dark:text-slate-100 leading-snug"
                  >
                    Recommended Action Plan (To-Do)
                  </h2>
                  <p
                    style={{ fontWeight: 300 }}
                    className="text-sm sm:text-base text-slate-700/90 dark:text-slate-300/90 leading-relaxed font-light font-[300]"
                  >
                    Targeted interventions to restore chronic-care fill rates, protect walk-in market share against quick-commerce, and unlock trapped cash.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Action Items */}
            <div className="lg:col-span-7 p-7 sm:p-9 lg:p-10 flex flex-col justify-center bg-white dark:bg-zinc-900 space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <div className="flex items-center gap-2.5">
                  <CheckSquare className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Recommended Actions
                </h3>
                </div>
                <span className="text-xs text-muted-foreground">Click card to mark complete</span>
              </div>

              <div className="space-y-3.5">
                {currentCaseData.suggestedNextSteps.map((step, idx) => {
                  const isDone = !!checkedActions[idx];
                  const parts = step.split(":");
                  const title = parts.length > 1 ? parts[0] : `Turnaround Action ${idx + 1}`;
                  const description = parts.length > 1 ? parts.slice(1).join(":") : step;
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleAction(idx)}
                      className={`rounded-2xl border p-4 sm:p-5 transition cursor-pointer ${
                        isDone
                          ? "bg-emerald-50/70 border-emerald-300/80 dark:bg-emerald-950/25 dark:border-emerald-800/60"
                          : "bg-slate-50/80 border-slate-200/70 hover:border-slate-300 dark:bg-zinc-800/50 dark:border-zinc-800 dark:hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAction(idx);
                          }}
                          className={`mt-1 size-5 rounded-lg border flex items-center justify-center transition shrink-0 cursor-pointer shadow-2xs ${
                            isDone
                              ? "bg-emerald-600 border-emerald-600 text-white"
                              : "border-slate-300 bg-white dark:border-zinc-600 dark:bg-zinc-800"
                          }`}
                          aria-label={`Mark action ${idx + 1} as ${isDone ? "incomplete" : "complete"}`}
                        >
                          {isDone && <Check className="size-3.5 stroke-[3]" />}
                        </button>
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4
                              className={`text-base sm:text-lg font-semibold leading-snug ${
                                isDone ? "text-emerald-800 dark:text-emerald-300 line-through" : "text-foreground"
                              }`}
                            >
                              {title}
                            </h4>
                            {isDone && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 shrink-0">
                                <Check className="size-3 stroke-[2.5]" /> Completed
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-base sm:text-[17px] leading-relaxed font-normal ${
                              isDone ? "text-foreground/75" : "text-foreground/85"
                            }`}
                          >
                            {description.trim()}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </article>
        );

      case 4:
        return (
          <article
            key="slide-4"
            id={anchorId}
            className="rounded-none border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden flex flex-col min-h-[520px]"
          >
            {/* Top Ambient Header Banner (Full Width) */}
            <div className="p-7 sm:p-9 border-b border-slate-200/80 dark:border-zinc-800 relative overflow-hidden bg-gradient-to-br from-[#dff2fe]/95 via-[#e5faf0]/90 to-[#fefae0]/95 dark:from-[#092237] dark:via-[#072a1b] dark:to-[#222110]">
              <div className="pointer-events-none absolute -top-16 -left-16 size-56 rounded-full bg-sky-300/35 dark:bg-sky-500/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -right-16 size-56 rounded-full bg-emerald-300/30 dark:bg-emerald-500/15 blur-3xl" />
              <div className="pointer-events-none absolute top-1/2 left-1/3 size-40 rounded-full bg-amber-200/25 dark:bg-amber-500/10 blur-2xl" />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xs border border-white/60 dark:border-zinc-700/60 text-slate-800 dark:text-slate-200 shadow-2xs">
                    Evidence Telemetry
                  </span>

                  <h2
                    style={{ fontWeight: 300 }}
                    className="text-2xl sm:text-3xl lg:text-[32px] font-light font-[300] tracking-tight text-slate-900 dark:text-slate-100 leading-snug"
                  >
                    Sample Telemetry & Evidence Records
                  </h2>
                  <p
                    style={{ fontWeight: 300 }}
                    className="text-sm sm:text-base text-slate-700/90 dark:text-slate-300/90 leading-relaxed font-light font-[300]"
                  >
                    Branch-level transaction telemetry capturing stockout durations, footfall churn, and dead stock capital lockup across monitored clusters.
                  </p>
                </div>

                {/* Exposure Highlight Banner */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 rounded-2xl bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xs border border-white/60 dark:border-zinc-700/60 p-4 sm:p-5 shadow-2xs shrink-0">
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Sampled Financial Exposure
                    </span>
                    <span className="text-2xl sm:text-3xl font-['Archivo'] tabular-nums font-bold text-rose-600 dark:text-rose-400">
                      {currentTelemetry.totalExposure}
                    </span>
                    <span className="block text-xs text-muted-foreground pt-0.5">
                      {currentTelemetry.coverage}
                    </span>
                  </div>
                  <div className="hidden sm:block h-10 w-px bg-slate-200 dark:bg-zinc-700" />
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Telemetry Status
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full mt-1">
                      <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                      Live Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Full-Width Telemetry Table Section (Compact) */}
            <div className="p-4 sm:p-6 bg-white dark:bg-zinc-900 flex-1 space-y-3">
              <div className="flex items-center justify-between pb-1.5 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <Activity className="size-4 text-brand-blue shrink-0" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Sample Data Records (Underlying Evidence)
                </h3>
                </div>
                <span className="text-[11px] font-medium text-muted-foreground">
                  Showing {currentTelemetry.records.length} Audited Clinical & Retail Clusters
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/70 text-slate-700 dark:text-slate-200 font-semibold text-xs uppercase tracking-wider">
                      <th className="px-3.5 py-2 whitespace-nowrap">Identifier</th>
                      <th className="px-3.5 py-2 whitespace-nowrap">Category / Item</th>
                      <th className="px-3.5 py-2 whitespace-nowrap">Issue Detected</th>
                      <th className="px-3.5 py-2 text-right whitespace-nowrap">Financial Impact</th>
                      <th className="px-3.5 py-2">Root Driver</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/80 dark:divide-zinc-800">
                    {currentTelemetry.records.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-zinc-800/40 transition-colors">
                        <td className="px-3.5 py-2 font-['Archivo'] tabular-nums text-xs sm:text-sm font-semibold text-foreground whitespace-nowrap">{row.branchId}</td>
                        <td className="px-3.5 py-2 text-xs sm:text-sm font-medium text-foreground whitespace-nowrap">{row.categoryItem}</td>
                        <td className="px-3.5 py-2 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-medium bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                            {row.issueDetected}
                          </span>
                        </td>
                        <td className="px-3.5 py-2 font-['Archivo'] tabular-nums text-right text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-400 whitespace-nowrap">
                          {row.financialImpact}
                        </td>
                        <td className="px-3.5 py-2 text-xs sm:text-sm text-foreground/80">{row.driver}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-300 dark:border-zinc-700 bg-slate-50/90 dark:bg-zinc-800/80 font-semibold">
                      <td colSpan={3} className="px-3.5 py-2 text-xs uppercase tracking-wider text-muted-foreground">
                        Total Sampled Immediate Financial Exposure
                      </td>
                      <td className="px-3.5 py-2 font-['Archivo'] tabular-nums text-right text-xs sm:text-sm text-rose-600 dark:text-rose-400 font-bold whitespace-nowrap">
                        {currentTelemetry.totalExposure}
                      </td>
                      <td className="px-3.5 py-2 text-xs text-muted-foreground">
                        {currentTelemetry.coverage}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </article>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-surface-tint font-sans text-foreground flex flex-col overflow-hidden">
      {/* Top Primary Header Bar - clean, uncluttered (no buttons on top) */}
      <header className="sticky top-0 z-40 h-14 shrink-0 bg-[#072333] border-b border-[#0f354c] flex items-center justify-between px-4 sm:px-6">
        {/* Left Side: Back button with Arrow and "Back" text, plus project title */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl px-2.5 py-1.5 hover:bg-white/10 text-sky-100 hover:text-white transition cursor-pointer group shrink-0"
            aria-label="Back to dashboard"
            title="Back to Dashboard"
          >
            <ArrowLeft className="size-5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm sm:text-base font-semibold text-white">Back</span>
          </Link>
          <div className="h-4 w-px bg-[#0f354c] shrink-0" />
          <span
            style={{ fontWeight: 200 }}
            className="text-sm sm:text-base font-extralight font-[200] text-slate-100 tracking-wide truncate max-w-[240px] xs:max-w-[320px] sm:max-w-md md:max-w-xl select-none"
            title={selectedCase.title}
          >
            {selectedCase.title.length > 32
              ? `${selectedCase.title.slice(0, 32)}...`
              : selectedCase.title}
          </span>
        </div>
      </header>

      {/* SECONDARY HEADER: Text Menu of actions with line separators & Scroll Progress Bar */}
      <section className="sticky top-14 z-30 bg-surface/95 backdrop-blur-md border-b border-border/70 shrink-0 shadow-2xs">
        <div className="px-4 sm:px-6 py-1.5 flex items-center justify-between gap-3 relative">
          {/* Left Side: Interactive Section Scrollspy (Slides 1-5 with Active Tracking) */}
          <nav aria-label="Slide section navigation" className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5 shrink-0">
            {slideDefs.map((slide, idx) => {
              const isActive = activeSlideId === slide.id;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => scrollToSlide(slide.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs sm:text-sm font-medium font-[500] rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 font-semibold border border-blue-200/80 dark:border-blue-800/80 shadow-2xs"
                      : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-tile"
                  }`}
                  title={`Jump to ${slide.fullTitle}`}
                >
                  <span
                    className={`inline-flex items-center justify-center size-4 rounded-full text-[10px] font-['Archivo'] tabular-nums font-bold transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white dark:bg-blue-500"
                        : "bg-slate-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span>{slide.shortTitle}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Side: Case Action Buttons & Status (Moved to Right Side) */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 overflow-visible relative py-0.5 ml-auto">
            {/* 1. Case History Button */}
            <button
              type="button"
              onClick={() => setShowHistory((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs sm:text-sm font-medium font-[500] rounded-lg transition cursor-pointer ${
                showHistory
                  ? "text-blue-700 bg-blue-100/80 dark:text-blue-400 dark:bg-blue-950/60 font-medium"
                  : "text-zinc-900 hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400 hover:bg-tile"
              }`}
              title="View or hide Case History"
            >
              <History className={`size-3.5 sm:size-4 ${showHistory ? "text-blue-700 dark:text-blue-400" : "text-zinc-700 dark:text-zinc-300"}`} />
              <span>Case History</span>
            </button>

            {/* Line separator */}
            <div className="h-3.5 w-px bg-zinc-300 dark:bg-zinc-700 mx-0.5 sm:mx-1" />

            {/* 2. Check Status Now */}
            <button
              type="button"
              onClick={handleCheckStatus}
              disabled={isCheckingStatus}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs sm:text-sm font-medium font-[500] rounded-lg text-zinc-900 hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400 hover:bg-tile transition cursor-pointer disabled:opacity-60"
              title="Check Status Now"
            >
              <RotateCw
                className={`size-3.5 sm:size-4 ${
                  isCheckingStatus ? "animate-spin text-blue-600" : "text-zinc-700 dark:text-zinc-300"
                }`}
              />
              <span>Check Status Now</span>
            </button>

            {/* Line separator */}
            <div className="h-3.5 w-px bg-zinc-300 dark:bg-zinc-700 mx-0.5 sm:mx-1" />

            {/* 3. Continuous Auditing */}
            <button
              type="button"
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
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs sm:text-sm font-medium font-[500] rounded-lg transition cursor-pointer ${
                isFollowing
                  ? "text-emerald-700 bg-emerald-100/80 dark:text-emerald-400 dark:bg-emerald-950/60 font-medium"
                  : "text-zinc-900 hover:text-emerald-600 dark:text-zinc-100 dark:hover:text-emerald-400 hover:bg-tile"
              }`}
              title={isFollowing ? "Continuous auditing active" : "Enable continuous auditing"}
            >
              {isFollowing ? (
                <>
                  <ScanningRadarIcon size={15} />
                  <span>Continuous Auditing</span>
                </>
              ) : (
                <>
                  <Bell className="size-3.5 sm:size-4 text-zinc-700 dark:text-zinc-300" />
                  <span>Continuous Auditing</span>
                </>
              )}
            </button>

            {/* Line separator */}
            <div className="h-3.5 w-px bg-zinc-300 dark:bg-zinc-700 mx-0.5 sm:mx-1" />

            {/* 4. Status Dropdown */}
            <div className="relative inline-block">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowStatusDropdown((prev) => !prev);
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs sm:text-sm font-medium font-[500] rounded-lg transition cursor-pointer border hover:opacity-90 active:scale-95 shadow-2xs ${currentStatusConfig.badgeClass}`}
                title="Click to change project status"
                aria-expanded={showStatusDropdown}
              >
                <span className={`size-2 rounded-full ${currentStatusConfig.dotClass}`} />
                <span>Status: {currentStatusConfig.label}</span>
                <ChevronDown
                  className={`size-3 text-current transition-transform duration-200 ${
                    showStatusDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showStatusDropdown && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-full mt-1.5 z-50 w-44 rounded-2xl border border-border/80 bg-surface p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-100"
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
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition cursor-pointer ${
                          isSelected
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

            {/* Line separator */}
            <div className="h-3.5 w-px bg-zinc-300 dark:bg-zinc-700 mx-0.5 sm:mx-1" />

            {/* 5. Three Dots action menu */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMoreMenu((prev) => !prev);
                }}
                className="inline-flex items-center justify-center p-1 rounded-lg text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white hover:bg-tile transition cursor-pointer"
                title="More options"
                aria-label="More options"
              >
                <MoreVertical className="size-3.5 sm:size-4" />
              </button>

              {showMoreMenu && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-full mt-1.5 z-40 w-52 rounded-xl border border-border/80 bg-surface p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-100"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setShowConsolidatedModal(true);
                      setShowMoreMenu(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium text-foreground hover:bg-tile transition cursor-pointer"
                  >
                    <FileText className="size-4 text-muted-foreground" />
                    <span>Consolidated Report</span>
                  </button>

                  <div className="my-1 border-t border-border/50" />

                  <button
                    type="button"
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
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium text-foreground hover:bg-tile hover:text-amber-700 dark:hover:text-amber-300 transition cursor-pointer"
                  >
                    <Archive className="size-4 text-amber-600 dark:text-amber-400" />
                    <span>{isArchived ? "Restore from Archive" : "Archive Project"}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Line separator */}
            <div className="h-3.5 w-px bg-zinc-300 dark:bg-zinc-700 mx-0.5 sm:mx-1" />

            {/* 6. Quick Access Index Dropdown */}
            <div className="relative inline-block">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowIndexDropdown((prev) => !prev);
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border/70 bg-surface hover:bg-tile text-xs font-medium font-[500] text-zinc-800 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer shadow-2xs group"
                title="Quick Jump / Slide Index"
                aria-label="Slide Index"
              >
                <ListFilter className="size-3 text-zinc-600 dark:text-zinc-400 group-hover:text-blue-600" />
                <span>Index</span>
                <ChevronDown
                  className={`size-3 text-zinc-500 transition-transform duration-150 ${
                    showIndexDropdown ? "rotate-180" : ""
                  }`}
                />
                <span className="text-[10px] font-['Archivo'] tabular-nums px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 ml-0.5">
                  {Math.round(scrollProgress)}%
                </span>
              </button>

              {showIndexDropdown && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-full mt-2 z-50 w-72 rounded-2xl border border-border/90 bg-surface p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-100"
                >
                  <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/50 mb-1 flex items-center justify-between">
                    <span>Case Index</span>
                    <span className="text-[10px] font-normal lowercase text-muted-foreground">quick access</span>
                  </div>

                  <div className="space-y-0.5">
                    {slideDefs.map((slide, idx) => (
                      <button
                        key={slide.id}
                        type="button"
                        onClick={() => {
                          scrollToSlide(slide.id);
                          setShowIndexDropdown(false);
                        }}
                        className="flex w-full items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-xs font-medium text-foreground hover:bg-tile hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer text-left group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-['Archivo'] tabular-nums text-[11px] text-muted-foreground group-hover:text-blue-600 font-bold shrink-0">
                            0{idx + 1}
                          </span>
                          <span className="truncate font-semibold">{slide.fullTitle}</span>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-muted-foreground shrink-0">
                          {slide.shortTitle}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scroll Progress Bar directly below the menu with smaller height (h-0.5 = 2px) */}
        <div className="w-full h-0.5 bg-slate-200/80 dark:bg-zinc-800 overflow-hidden relative">
          <div
            className="h-full bg-linear-to-r from-blue-600 via-indigo-600 to-blue-500 transition-[width] duration-100 ease-out shadow-xs"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </section>

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

        {/* CENTER COLUMN: INTERACTIVE SLIDES REPORT (All Slides Mode with Scroll Progress) */}
        <main
          onScroll={handleMainScroll}
          className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-6 lg:p-8 bg-surface-tint"
        >
          <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
            {slideDefs.map((s, idx) => renderSlideCard(idx, `slide-${s.id}`))}
          </div>
        </main>

        {/* RIGHT COLUMN: AI ASSISTANT (Collapsible with Arrow Toggle) */}
        {showAIAssistant ? (
          <aside className="w-80 xl:w-96 shrink-0 border-l border-border/80 bg-surface flex flex-col h-full min-h-0 hidden md:flex animate-in slide-in-from-right-4 duration-200">
            {/* Assistant Header with Collapse Arrow */}
            <div className="shrink-0 flex items-center justify-between border-b border-border/70 px-4 py-3 bg-surface">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-foreground">AI Assistant</h3>
                {messages.length > 0 && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-brand-blue dark:bg-blue-950 font-medium">
                    {messages.length} {messages.length === 1 ? "message" : "messages"}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
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

                {/* Hide AI Assistant Arrow Button */}
                <button
                  type="button"
                  onClick={() => setShowAIAssistant(false)}
                  className="size-7 rounded-xl border border-border/80 hover:bg-tile text-muted-foreground hover:text-foreground flex items-center justify-center transition cursor-pointer shadow-2xs"
                  title="Hide AI Assistant (Click arrow to collapse)"
                  aria-label="Hide AI Assistant"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
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
        ) : (
          /* Collapsed AI Assistant Rail with Expand Arrow */
          <aside className="w-11 shrink-0 border-l border-border/80 bg-surface flex flex-col items-center py-3.5 hidden md:flex transition-all">
            <button
              type="button"
              onClick={() => setShowAIAssistant(true)}
              className="p-2 rounded-xl hover:bg-tile text-muted-foreground hover:text-foreground transition cursor-pointer flex flex-col items-center gap-2.5 group shadow-2xs border border-transparent hover:border-border/60"
              title="Show AI Assistant (Click arrow to expand)"
              aria-label="Show AI Assistant"
            >
              <ChevronLeft className="size-4 text-brand-blue group-hover:-translate-x-0.5 transition-transform" />
              <Sparkles className="size-3.5 text-muted-foreground group-hover:text-brand-blue transition-colors" />
              <span className="text-[11px] font-semibold [writing-mode:vertical-lr] rotate-180 text-muted-foreground group-hover:text-foreground tracking-wider py-1">
                AI Assistant
              </span>
            </button>
          </aside>
        )}
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
