import { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  Activity,
  Send,
  FileText,
  Clock,
  Check,
  RotateCw,
  Bell,
  CheckCircle2,
  MoreVertical,
  Sparkles,
  RotateCcw,
  Table2,
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ListFilter,
  History,
  ArrowLeft,
  Archive,
  X,
} from "lucide-react";
import { AIAssistantDefaultView } from "./AIAssistantDefaultView";
import { ScanningRadarIcon } from "./ScanningRadarIcon";

export interface HistoryItem {
  id: string;
  title: string;
  timestamp: string;
}

export const caseHistoryList: HistoryItem[] = [
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

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  content: string;
}

export const initialMessages: ChatMessage[] = [
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

export interface CaseKpiItem {
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

export const defaultCaseKpis: [CaseKpiItem, CaseKpiItem] = [
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

export const caseKpis: Record<string, [CaseKpiItem, CaseKpiItem]> = {
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

export interface CaseAssistantConfig {
  suggestions: string[];
}

export const caseAssistantConfigs: Record<string, CaseAssistantConfig> = {
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

export interface CaseSectionData {
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

export const caseSectionData: Record<string, CaseSectionData> = {
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

export interface StatusOption {
  value: CaseDetailsStatus;
  label: string;
  badgeClass: string;
  dotClass: string;
  description: string;
}

export const statusOptions: StatusOption[] = [
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

export interface CustomCaseItem {
  id?: string | undefined;
  title: string;
  body: string;
  age?: string | undefined;
  agent?: string | undefined;
  expiryDate?: string | undefined;
  isLive?: boolean | undefined;
}

export interface CaseDetailsViewProps {
  selectedCaseId?: string;
  onCaseChange?: (caseId: string) => void;
  customCase?: CustomCaseItem | null;
  onBack?: () => void;
  hideHeader?: boolean;
  initialShowChat?: boolean; // defaults to false
}

export function CaseDetailsView({
  selectedCaseId = "case-1",
  onCaseChange,
  customCase,
  onBack,
  hideHeader = false,
  initialShowChat = false,
}: CaseDetailsViewProps) {
  const [internalCaseId, setInternalCaseId] = useState<string>(selectedCaseId);

  useEffect(() => {
    setInternalCaseId(selectedCaseId);
  }, [selectedCaseId]);

  const activeCaseId = internalCaseId;

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

  // Chat option is hidden by default as requested!
  const [showAIAssistant, setShowAIAssistant] = useState<boolean>(initialShowChat);

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

  const handleMainScroll = (e: React.UIEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll > 0) {
      const pct = (el.scrollTop / maxScroll) * 100;
      setScrollProgress(Math.min(100, Math.max(0, pct)));
    } else {
      setScrollProgress(0);
    }

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
  }, [activeCaseId, customCase]);

  const currentStatusConfig =
    statusOptions.find((s) => s.value === projectStatus) ?? statusOptions[0]!;

  // AI Assistant Chat state (starts empty to display default layout)
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

      if (lower.includes("revenue") || lower.includes("decline") || lower.includes("drop")) {
        replyContent =
          "Analysis confirms the primary root driver for the revenue drop is acute chronic medication stockouts (18.2% stockout rate on top-50 cardiac and diabetic SKUs, yielding -$142,000 in lost basket conversions), exacerbated by a 19% drop in walk-in footfall following the expansion of competitor dark stores.";
      } else if (lower.includes("stockout") || lower.includes("branches")) {
        replyContent =
          "Audited clusters BR-004 (Metro Downtown) and BR-018 (Green Valley) exhibited the highest prescription refill lapse and stockout rates. We recommend an emergency 48-hour central stock rebalancing to restock these locations.";
      } else if (lower.includes("action") || lower.includes("steps") || lower.includes("plan")) {
        replyContent =
          "Recommended 4-Step Strategic Plan:\n1. Auto-transfer surplus cardiac/diabetic inventory to Central Zone within 48h.\n2. Escalate vendor SLAs with primary pharmaceutical wholesalers.\n3. Pilot a 60-minute express refill delivery service within 3 miles.\n4. Run a clearance liquidation on >90-day-old non-pharma personal care stock.";
      } else {
        replyContent = `Insight for "${userText}": Based on live telemetry, the operational health of this case indicates urgent attention on supply replenishment and workflow buffer compression. Key metrics remain trackable in the Key Metrics tab.`;
      }

      const aiReply: ChatMessage = {
        id: `m-reply-${Date.now()}`,
        sender: "ai",
        content: replyContent,
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 800);
  };

  const defaultCase = {
    id: "case-1",
    title: "Q3 Revenue Drop & Margin Compression Analysis",
    timestamp: "04 Sept 2026, 05:57 am",
  };

  const selectedCase: HistoryItem = {
    id: customCase?.id ?? activeCaseId,
    title: customCase?.title ?? (caseHistoryList.find((c) => c.id === activeCaseId)?.title || defaultCase.title),
    timestamp: customCase?.age ?? (caseHistoryList.find((c) => c.id === activeCaseId)?.timestamp || defaultCase.timestamp),
  };

  const currentAssistantConfig: CaseAssistantConfig =
    caseAssistantConfigs[activeCaseId] ?? caseAssistantConfigs["case-1"]!;

  const currentCaseData: CaseSectionData =
    caseSectionData[activeCaseId] ?? {
      keyDataPoints: [
        customCase?.body
          ? `Primary Anomaly Detected: ${customCase.body}`
          : "Systemic breakdown vectors detected through automated reconciliation of records.",
        "Operational efficiency buffers running 18% below benchmark targets.",
        "Resource allocation variance identified across monitored clinical divisions.",
        "Documentation and verification delays impacting cycle time resolution.",
      ],
      suggestedNextSteps: [
        "Initiate automated multi-department workflow review within 24 hours.",
        "Escalate flagged discrepancies to department coordinators.",
        "Implement predictive monitoring buffers to prevent recurrence.",
        "Audit end-of-shift operational clearance summaries.",
      ],
    };

  const currentSummary: CaseSummaryConfig =
    caseSummaries[activeCaseId] ?? {
      narrative: customCase?.body || caseSummaries["case-1"]!.narrative,
      quote: `Actionable focus for ${selectedCase.title}: Rapid resolution of detected variance and cross-departmental coordination.`,
      metrics: [
        { label: "Status", val: "Active Audit", alert: true },
        { label: "Discrepancy", val: "Detected", alert: true },
        { label: "Confidence", val: "94.2%" },
        { label: "Impact", val: "Monitored" },
      ],
    };

  const currentMetrics: KeyMetricRow[] =
    caseKeyMetricsData[activeCaseId] ?? caseKeyMetricsData["case-1"]!;

  const currentTelemetry =
    caseSampleTelemetryData[activeCaseId] ?? caseSampleTelemetryData["case-1"]!;

  const renderSlideCard = (slideIdx: number, anchorId?: string) => {
    switch (slideIdx) {
      case 0:
        return (
          <article
            key="slide-0"
            id={anchorId}
            className="rounded-none border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[460px] shadow-xs"
          >
            {/* Left Column: Ambient Pastel Glow & Title */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-start border-b lg:border-b-0 lg:border-r border-slate-200/80 dark:border-zinc-800 relative overflow-hidden bg-gradient-to-br from-[#dff2fe]/95 via-[#e5faf0]/90 to-[#fefae0]/95 dark:from-[#092237] dark:via-[#072a1b] dark:to-[#222110]">
              <div className="pointer-events-none absolute -top-16 -left-16 size-56 rounded-full bg-sky-300/35 dark:bg-sky-500/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -right-16 size-56 rounded-full bg-emerald-300/30 dark:bg-emerald-500/15 blur-3xl" />
              <div className="pointer-events-none absolute top-1/2 left-1/3 size-40 rounded-full bg-amber-200/25 dark:bg-amber-500/10 blur-2xl" />

              <div className="relative z-10 space-y-3.5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xs border border-white/60 dark:border-zinc-700/60 text-slate-800 dark:text-slate-200 shadow-2xs">
                    Executive Summary
                  </span>
                  {customCase?.agent && (
                    <span className="inline-flex items-center gap-1 text-[11px] rounded-full px-2 py-0.5 bg-brand-blue/15 text-brand-blue font-medium border border-brand-blue/25">
                      <Sparkles className="size-3" />
                      {customCase.agent}
                    </span>
                  )}
                </div>

                <div className="space-y-2 pt-1">
                  <h2
                    style={{ fontWeight: 300 }}
                    className="text-2xl sm:text-3xl font-light tracking-tight text-slate-900 dark:text-slate-100 leading-snug"
                  >
                    {selectedCase.title}
                  </h2>
                  <p
                    style={{ fontWeight: 300 }}
                    className="text-xs sm:text-sm text-slate-700/90 dark:text-slate-300/90 leading-relaxed font-light"
                  >
                    Comprehensive diagnostic on operational run rates, medication supply integrity, footfall churn, and margin variance.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Clean Executive Content */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center bg-white dark:bg-zinc-900 space-y-5">
              <div className="flex items-center gap-2.5 pb-2 border-b border-border/60">
                <FileText className="size-4.5 text-brand-blue shrink-0" />
                <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Executive Summary
                </h3>
              </div>

              <p
                style={{ fontWeight: 300, fontSize: "16px" }}
                className="text-[16px] leading-relaxed text-foreground/90 font-light"
              >
                {currentSummary.narrative}
              </p>

              <blockquote className="rounded-2xl border-l-4 border-rose-500 bg-rose-50/80 dark:bg-rose-950/30 p-4 sm:p-5 border-y border-r border-rose-200/70 dark:border-rose-900/40 shadow-2xs">
                <p
                  style={{ fontWeight: 300, fontSize: "15px" }}
                  className="text-[15px] italic leading-relaxed text-foreground/95 font-light"
                >
                  {currentSummary.quote}
                </p>
              </blockquote>

              {/* Key Highlights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                {currentSummary.metrics.map((m, mIdx) => {
                  const match = m.val.match(/^(.*?)\s*(\([+-]?\d+[^)]*\))$/);
                  const mainVal = match ? match[1] : m.val;
                  const changeVal = match ? match[2] : null;

                  return (
                    <div
                      key={mIdx}
                      className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-800/40 p-3 space-y-1"
                    >
                      <span className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        {m.label}
                      </span>
                      <div className="flex flex-wrap items-baseline gap-1">
                        <span
                          className={`text-sm sm:text-base font-['Archivo'] tabular-nums font-bold ${
                            m.alert ? "text-rose-600 dark:text-rose-400" : "text-slate-800 dark:text-slate-200"
                          }`}
                        >
                          {mainVal}
                        </span>
                        {changeVal && (
                          <span
                            className={`text-[11px] font-['Archivo'] tabular-nums font-medium ${
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
            className="rounded-none border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[460px] shadow-xs"
          >
            {/* Left Column: Ambient Pastel Glow */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-start border-b lg:border-b-0 lg:border-r border-slate-200/80 dark:border-zinc-800 relative overflow-hidden bg-gradient-to-br from-[#dff2fe]/95 via-[#e5faf0]/90 to-[#fefae0]/95 dark:from-[#092237] dark:via-[#072a1b] dark:to-[#222110]">
              <div className="pointer-events-none absolute -top-16 -left-16 size-56 rounded-full bg-sky-300/35 dark:bg-sky-500/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -right-16 size-56 rounded-full bg-emerald-300/30 dark:bg-emerald-500/15 blur-3xl" />
              <div className="pointer-events-none absolute top-1/2 left-1/3 size-40 rounded-full bg-amber-200/25 dark:bg-amber-500/10 blur-2xl" />

              <div className="relative z-10 space-y-3.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xs border border-white/60 dark:border-zinc-700/60 text-slate-800 dark:text-slate-200 shadow-2xs">
                  Root Cause Analysis
                </span>

                <div className="space-y-2 pt-1">
                  <h2
                    style={{ fontWeight: 300 }}
                    className="text-2xl sm:text-3xl font-light tracking-tight text-slate-900 dark:text-slate-100 leading-snug"
                  >
                    High-Level Insights & Root Drivers
                  </h2>
                  <p
                    style={{ fontWeight: 300 }}
                    className="text-xs sm:text-sm text-slate-700/90 dark:text-slate-300/90 leading-relaxed font-light"
                  >
                    Primary systemic breakdown vectors detected through automated reconciliation of records and workflows.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: 4 Systemic Insights */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center bg-white dark:bg-zinc-900 space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-border/60">
                <TrendingDown className="size-4.5 text-brand-blue shrink-0" />
                <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  High-Level Insights
                </h3>
              </div>

              <div className="space-y-3">
                {currentCaseData.keyDataPoints.map((point, idx) => {
                  const parts = point.split(":");
                  const title = parts.length > 1 ? parts[0] : `Systemic Driver ${idx + 1}`;
                  const description = parts.length > 1 ? parts.slice(1).join(":") : point;
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl bg-slate-50/80 dark:bg-zinc-800/50 border border-slate-200/70 dark:border-zinc-800 p-3.5 sm:p-4 transition hover:border-slate-300 dark:hover:border-zinc-700"
                    >
                      <div className="flex items-start gap-3.5">
                        <span className="grid size-7 shrink-0 place-items-center rounded-xl bg-blue-100 dark:bg-blue-900/60 text-brand-blue dark:text-blue-300 text-xs font-bold shadow-2xs">
                          {idx + 1}
                        </span>
                        <div className="space-y-1 flex-1">
                          <h4 className="text-sm sm:text-base font-semibold text-foreground leading-snug">
                            {title}
                          </h4>
                          <p className="text-xs sm:text-sm leading-relaxed text-foreground/85 font-normal">
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
            className="rounded-none border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[460px] shadow-xs"
          >
            {/* Left Column: Ambient Pastel Glow */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-start border-b lg:border-b-0 lg:border-r border-slate-200/80 dark:border-zinc-800 relative overflow-hidden bg-gradient-to-br from-[#dff2fe]/95 via-[#e5faf0]/90 to-[#fefae0]/95 dark:from-[#092237] dark:via-[#072a1b] dark:to-[#222110]">
              <div className="pointer-events-none absolute -top-16 -left-16 size-56 rounded-full bg-sky-300/35 dark:bg-sky-500/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -right-16 size-56 rounded-full bg-emerald-300/30 dark:bg-emerald-500/15 blur-3xl" />
              <div className="pointer-events-none absolute top-1/2 left-1/3 size-40 rounded-full bg-amber-200/25 dark:bg-amber-500/10 blur-2xl" />

              <div className="relative z-10 space-y-3.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xs border border-white/60 dark:border-zinc-700/60 text-slate-800 dark:text-slate-200 shadow-2xs">
                  Financial Performance
                </span>

                <div className="space-y-2 pt-1">
                  <h2
                    style={{ fontWeight: 300 }}
                    className="text-2xl sm:text-3xl font-light tracking-tight text-slate-900 dark:text-slate-100 leading-snug"
                  >
                    Key Metrics & Variances
                  </h2>
                  <p
                    style={{ fontWeight: 300 }}
                    className="text-xs sm:text-sm text-slate-700/90 dark:text-slate-300/90 leading-relaxed font-light"
                  >
                    Operating performance benchmarked against baseline targets and prior cycle run rates.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Key Metrics Table */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center bg-white dark:bg-zinc-900 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <Table2 className="size-4.5 text-brand-blue shrink-0" />
                  <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Key Metrics
                  </h3>
                </div>
                <span className="text-xs font-medium text-muted-foreground">Variance vs. Target</span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/70 text-slate-700 dark:text-slate-200 font-semibold text-xs uppercase tracking-wider">
                      <th className="px-3.5 py-2.5">Metric</th>
                      <th className="px-3.5 py-2.5 text-right">Current</th>
                      <th className="px-3.5 py-2.5 text-right">Target / Prior</th>
                      <th className="px-3.5 py-2.5 text-right">Variance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/80 dark:divide-zinc-800">
                    {currentMetrics.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-zinc-800/40 transition-colors">
                        <td className="px-3.5 py-2.5 text-xs sm:text-sm font-medium text-foreground">{row.metric}</td>
                        <td className="px-3.5 py-2.5 font-['Archivo'] tabular-nums text-xs sm:text-sm font-bold text-foreground text-right">{row.current}</td>
                        <td className="px-3.5 py-2.5 font-['Archivo'] tabular-nums text-xs sm:text-sm text-muted-foreground text-right">{row.target}</td>
                        <td className="px-3.5 py-2.5 text-right">
                          <span className="inline-flex items-center font-['Archivo'] tabular-nums font-medium text-[11px] px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                            {row.variance}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground italic pt-1">
                Variance flags are continuously updated by scheduled data reconciliations.
              </p>
            </div>
          </article>
        );

      case 3:
        return (
          <article
            key="slide-3"
            id={anchorId}
            className="rounded-none border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[460px] shadow-xs"
          >
            {/* Left Column: Ambient Pastel Glow */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-start border-b lg:border-b-0 lg:border-r border-slate-200/80 dark:border-zinc-800 relative overflow-hidden bg-gradient-to-br from-[#dff2fe]/95 via-[#e5faf0]/90 to-[#fefae0]/95 dark:from-[#092237] dark:via-[#072a1b] dark:to-[#222110]">
              <div className="pointer-events-none absolute -top-16 -left-16 size-56 rounded-full bg-sky-300/35 dark:bg-sky-500/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -right-16 size-56 rounded-full bg-emerald-300/30 dark:bg-emerald-500/15 blur-3xl" />
              <div className="pointer-events-none absolute top-1/2 left-1/3 size-40 rounded-full bg-amber-200/25 dark:bg-amber-500/10 blur-2xl" />

              <div className="relative z-10 space-y-3.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xs border border-white/60 dark:border-zinc-700/60 text-slate-800 dark:text-slate-200 shadow-2xs">
                  Strategic Action Plan
                </span>

                <div className="space-y-2 pt-1">
                  <h2
                    style={{ fontWeight: 300 }}
                    className="text-2xl sm:text-3xl font-light tracking-tight text-slate-900 dark:text-slate-100 leading-snug"
                  >
                    Recommended Action Plan
                  </h2>
                  <p
                    style={{ fontWeight: 300 }}
                    className="text-xs sm:text-sm text-slate-700/90 dark:text-slate-300/90 leading-relaxed font-light"
                  >
                    Targeted interventions to mitigate detected variance and streamline operational throughput.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Action Items */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center bg-white dark:bg-zinc-900 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <CheckSquare className="size-4.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Recommended Actions
                  </h3>
                </div>
                <span className="text-xs text-muted-foreground">Click item to toggle status</span>
              </div>

              <div className="space-y-3">
                {currentCaseData.suggestedNextSteps.map((step, idx) => {
                  const isDone = !!checkedActions[idx];
                  const parts = step.split(":");
                  const title = parts.length > 1 ? parts[0] : `Turnaround Action ${idx + 1}`;
                  const description = parts.length > 1 ? parts.slice(1).join(":") : step;
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleAction(idx)}
                      className={`rounded-2xl border p-3.5 sm:p-4 transition cursor-pointer ${
                        isDone
                          ? "bg-emerald-50/70 border-emerald-300/80 dark:bg-emerald-950/25 dark:border-emerald-800/60"
                          : "bg-slate-50/80 border-slate-200/70 hover:border-slate-300 dark:bg-zinc-800/50 dark:border-zinc-800 dark:hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAction(idx);
                          }}
                          className={`mt-0.5 size-5 rounded-lg border flex items-center justify-center transition shrink-0 cursor-pointer shadow-2xs ${
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
                              className={`text-sm sm:text-base font-semibold leading-snug ${
                                isDone ? "text-emerald-800 dark:text-emerald-300 line-through" : "text-foreground"
                              }`}
                            >
                              {title}
                            </h4>
                            {isDone && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 shrink-0">
                                <Check className="size-3 stroke-[2.5]" /> Completed
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-xs sm:text-sm leading-relaxed font-normal ${
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
            className="rounded-none border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden flex flex-col min-h-[460px] shadow-xs"
          >
            {/* Top Ambient Header Banner */}
            <div className="p-6 sm:p-8 border-b border-slate-200/80 dark:border-zinc-800 relative overflow-hidden bg-gradient-to-br from-[#dff2fe]/95 via-[#e5faf0]/90 to-[#fefae0]/95 dark:from-[#092237] dark:via-[#072a1b] dark:to-[#222110]">
              <div className="pointer-events-none absolute -top-16 -left-16 size-56 rounded-full bg-sky-300/35 dark:bg-sky-500/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -right-16 size-56 rounded-full bg-emerald-300/30 dark:bg-emerald-500/15 blur-3xl" />
              <div className="pointer-events-none absolute top-1/2 left-1/3 size-40 rounded-full bg-amber-200/25 dark:bg-amber-500/10 blur-2xl" />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                <div className="space-y-2 max-w-2xl">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xs border border-white/60 dark:border-zinc-700/60 text-slate-800 dark:text-slate-200 shadow-2xs">
                    Evidence Telemetry
                  </span>

                  <h2
                    style={{ fontWeight: 300 }}
                    className="text-2xl sm:text-3xl font-light tracking-tight text-slate-900 dark:text-slate-100 leading-snug"
                  >
                    Sample Telemetry & Evidence Records
                  </h2>
                  <p
                    style={{ fontWeight: 300 }}
                    className="text-xs sm:text-sm text-slate-700/90 dark:text-slate-300/90 leading-relaxed font-light"
                  >
                    Transaction telemetry capturing variances, delays, and capital exposure across monitored clusters.
                  </p>
                </div>

                {/* Exposure Highlight Banner */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 rounded-2xl bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xs border border-white/60 dark:border-zinc-700/60 p-4 shadow-2xs shrink-0">
                  <div>
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Sampled Financial Exposure
                    </span>
                    <span className="text-xl sm:text-2xl font-['Archivo'] tabular-nums font-bold text-rose-600 dark:text-rose-400">
                      {currentTelemetry.totalExposure}
                    </span>
                    <span className="block text-[11px] text-muted-foreground pt-0.5">
                      {currentTelemetry.coverage}
                    </span>
                  </div>
                  <div className="hidden sm:block h-9 w-px bg-slate-200 dark:bg-zinc-700" />
                  <div>
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
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

            {/* Telemetry Table */}
            <div className="p-4 sm:p-6 bg-white dark:bg-zinc-900 flex-1 space-y-3">
              <div className="flex items-center justify-between pb-1.5 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <Activity className="size-4 text-brand-blue shrink-0" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Sample Data Records (Underlying Evidence)
                  </h3>
                </div>
                <span className="text-[11px] font-medium text-muted-foreground">
                  Showing {currentTelemetry.records.length} Audited Clusters
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs rounded-xl">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/70 text-slate-700 dark:text-slate-200 font-semibold text-[11px] uppercase tracking-wider">
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
                        <td className="px-3.5 py-2 font-['Archivo'] tabular-nums text-xs font-semibold text-foreground whitespace-nowrap">{row.branchId}</td>
                        <td className="px-3.5 py-2 text-xs font-medium text-foreground whitespace-nowrap">{row.categoryItem}</td>
                        <td className="px-3.5 py-2 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                            {row.issueDetected}
                          </span>
                        </td>
                        <td className="px-3.5 py-2 font-['Archivo'] tabular-nums text-right text-xs font-bold text-rose-600 dark:text-rose-400 whitespace-nowrap">
                          {row.financialImpact}
                        </td>
                        <td className="px-3.5 py-2 text-xs text-foreground/80">{row.driver}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-300 dark:border-zinc-700 bg-slate-50/90 dark:bg-zinc-800/80 font-semibold">
                      <td colSpan={3} className="px-3.5 py-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                        Total Sampled Exposure
                      </td>
                      <td className="px-3.5 py-2 font-['Archivo'] tabular-nums text-right text-xs text-rose-600 dark:text-rose-400 font-bold whitespace-nowrap">
                        {currentTelemetry.totalExposure}
                      </td>
                      <td className="px-3.5 py-2 text-[11px] text-muted-foreground">
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
    <div className="h-full flex flex-col overflow-hidden bg-surface-tint">
      {/* UNIFIED SINGLE HEADER BAR */}
      <section className="bg-surface/95 backdrop-blur-md border-b border-border/80 shrink-0 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left Side: Case Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <h2 className="text-sm sm:text-base font-semibold text-foreground truncate" title={selectedCase.title}>
            {selectedCase.title}
          </h2>
        </div>

        {/* Right Side of Title: Continuous Auditing + Status Dropdown + AI Chat */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 overflow-visible relative">

          {/* Continuous Auditing Toggle */}
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
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition cursor-pointer border shadow-2xs ${
              isFollowing
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium"
                : "border-border/80 bg-surface text-foreground hover:bg-tile"
            }`}
            title={isFollowing ? "Continuous auditing active" : "Enable continuous auditing"}
          >
            {isFollowing ? (
              <>
                <ScanningRadarIcon size={14} />
                <span className="hidden sm:inline">Auditing Active</span>
              </>
            ) : (
              <>
                <Bell className="size-3.5 text-muted-foreground" />
                <span className="hidden sm:inline">Continuous Auditing</span>
              </>
            )}
          </button>

          {/* Status Dropdown */}
          <div className="relative inline-block">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowStatusDropdown((prev) => !prev);
              }}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition cursor-pointer border hover:opacity-90 active:scale-95 shadow-2xs ${currentStatusConfig.badgeClass}`}
              title="Click to change project status"
              aria-expanded={showStatusDropdown}
            >
              <span className={`size-2 rounded-full ${currentStatusConfig.dotClass}`} />
              <span>{currentStatusConfig.label}</span>
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
                      <div className="flex items-center gap-2">
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

          {/* AI Assistant Chat Toggle Button */}
          <button
            type="button"
            onClick={() => setShowAIAssistant((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer border shadow-2xs ${
              showAIAssistant
                ? "border-brand-blue/50 bg-brand-blue/10 text-brand-blue font-semibold ring-1 ring-brand-blue/20"
                : "border-border/80 bg-surface text-foreground hover:bg-tile"
            }`}
            title={showAIAssistant ? "Hide AI Assistant (Click to collapse)" : "Show AI Assistant (Click to chat)"}
            aria-label="Toggle AI Assistant"
          >
            <Sparkles className="size-3.5 text-brand-blue" />
            <span className="hidden sm:inline">AI Chat</span>
          </button>
        </div>
      </section>

      {/* Scroll Progress Bar (2px height) */}
      <div className="w-full h-0.5 bg-slate-200/80 dark:bg-zinc-800 overflow-hidden relative shrink-0">
        <div
          className="h-full bg-linear-to-r from-blue-600 via-indigo-600 to-blue-500 transition-[width] duration-100 ease-out shadow-xs"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Status notification banner */}
      {statusMessage && (
        <div className="bg-emerald-600 text-white text-xs py-1.5 px-4 text-center font-medium animate-in fade-in transition-all">
          {statusMessage}
        </div>
      )}

      {/* Main Split Body: Slides Report in Center + Collapsible AI Assistant Chat on Right */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        {/* CENTER REPORT CONTENT */}
        <main
          onScroll={handleMainScroll}
          className="flex-1 overflow-y-auto no-scrollbar p-3 sm:p-5 lg:p-6 bg-surface-tint"
        >
          <div className="max-w-5xl mx-auto space-y-5 sm:space-y-6">
            {slideDefs.map((s, idx) => renderSlideCard(idx, `slide-${s.id}`))}
          </div>
        </main>

        {/* RIGHT COLUMN: AI ASSISTANT CHAT (Hidden by default, slides in when enabled) */}
        {showAIAssistant ? (
          <aside className="w-80 xl:w-96 shrink-0 border-l border-border/80 bg-surface flex flex-col h-full min-h-0 animate-in slide-in-from-right duration-200 z-20">
            {/* Assistant Header */}
            <div className="shrink-0 flex items-center justify-between border-b border-border/70 px-4 py-3 bg-surface">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-brand-blue" />
                <h3 className="text-sm font-semibold text-foreground">AI Assistant</h3>
                {messages.length > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-brand-blue dark:bg-blue-950 font-medium">
                    {messages.length}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setMessages([])}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded-lg hover:bg-tile transition cursor-pointer"
                    title="New chat"
                  >
                    <RotateCcw className="size-3" />
                    <span>New chat</span>
                  </button>
                )}

                {/* Hide / Collapse Assistant Button */}
                <button
                  type="button"
                  onClick={() => setShowAIAssistant(false)}
                  className="size-7 rounded-xl border border-border/80 hover:bg-tile text-muted-foreground hover:text-foreground flex items-center justify-center transition cursor-pointer shadow-2xs"
                  title="Hide AI Assistant"
                  aria-label="Hide AI Assistant"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            {messages.length === 0 ? (
              <div className="flex-1 min-h-0 overflow-y-auto flex items-center justify-center bg-surface">
                <AIAssistantDefaultView
                  suggestions={currentAssistantConfig.suggestions}
                  onSendMessage={(prompt) => handleSendMessage(undefined, prompt)}
                />
              </div>
            ) : (
              <>
                <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3.5">
                  {messages.map((m) =>
                    m.sender === "user" ? (
                      <div key={m.id} className="flex justify-end">
                        <div className="max-w-[85%] rounded-2xl bg-brand-blue px-3.5 py-2.5 text-sm text-white leading-relaxed shadow-xs">
                          {m.content}
                        </div>
                      </div>
                    ) : (
                      <div key={m.id} className="flex justify-start">
                        <div className="max-w-[95%] rounded-2xl bg-tile/70 border border-border/60 p-3.5 text-sm leading-relaxed text-foreground/90 whitespace-pre-line shadow-2xs space-y-2">
                          {m.content}
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* Fixed Chat Input Box */}
                <div className="shrink-0 border-t border-border/70 p-3 bg-surface">
                  <form onSubmit={handleSendMessage} className="relative flex items-center">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask a question about this case..."
                      className="w-full rounded-2xl border border-border/80 bg-surface pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-foreground outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20 transition placeholder:text-muted-foreground shadow-2xs"
                    />
                    <button
                      type="submit"
                      className="absolute right-1.5 grid size-7 place-items-center rounded-full bg-brand-blue text-white hover:opacity-90 transition cursor-pointer"
                      aria-label="Send message"
                    >
                      <Send className="size-3.5" />
                    </button>
                  </form>
                </div>
              </>
            )}
          </aside>
        ) : (
          /* Subtle Collapsed Rail Tab to easily expand chat */
          <aside className="w-10 shrink-0 border-l border-border/80 bg-surface hidden md:flex flex-col items-center py-3.5 transition-all">
            <button
              type="button"
              onClick={() => setShowAIAssistant(true)}
              className="p-2 rounded-xl hover:bg-tile text-muted-foreground hover:text-foreground transition cursor-pointer flex flex-col items-center gap-2 group shadow-2xs border border-transparent hover:border-border/60"
              title="Open AI Assistant Chat"
              aria-label="Open AI Assistant"
            >
              <ChevronLeft className="size-4 text-brand-blue group-hover:-translate-x-0.5 transition-transform" />
              <Sparkles className="size-3.5 text-muted-foreground group-hover:text-brand-blue transition-colors" />
            </button>
          </aside>
        )}
      </div>
    </div>
  );
}
