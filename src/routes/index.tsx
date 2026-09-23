import { useState, useRef, useEffect, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Home,
  Bot,
  Database,
  TrendingDown,
  TrendingUp,
  ArrowRight,
  Expand,
  Server,
  Sparkles,
  Clock,
  Activity,
  HeartPulse,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Radio,
  Radar,
  Archive,
  ChevronDown,
  FileText,
  Pill,
  Receipt,
  CheckCircle2,
  Search,
  Filter,
  Check,
  Loader2,
} from "lucide-react";
import { CaseDetailsView } from "../components/CaseDetailsView";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Inbox for CXO — Case Analytics & Insights Dashboard" },
      {
        name: "description",
        content:
          "Inbox for CXO showing newly detected cases, active case analytics, and operational anomalies across departments.",
      },
      { property: "og:title", content: "Inbox for CXO — Case Analytics Dashboard" },
      {
        property: "og:description",
        content:
          "Explore new detected cases and track active cases across revenue, operations, and patient experience.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const railIcons = [
  { icon: Home, label: "Home", to: "/", active: true },
  { icon: Bot, label: "Agents", to: "/cases" },
  { icon: FileText, label: "Files", to: "/files" },
  { icon: Server, label: "Data Center", to: "/data-center" },
];

interface SuggestedCase {
  id: string;
  category: "Pharmacy" | "Billing" | "Operations" | "Clinical";
  department: string;
  title: string;
  description: string;
  impactMetric: string;
  severity: "High" | "Medium" | "Low";
  signal: string;
}

const suggestedCasesList: SuggestedCase[] = [
  {
    id: "sug-1",
    category: "Pharmacy",
    department: "Pharmacy & Inpatient Therapeutics",
    title: "High-Cost Antimicrobial Formulary Variance",
    description: "Off-formulary broad-spectrum antibiotic dispensing with severe margin disparity detected across surgical suites.",
    impactMetric: "$48,000 potential savings",
    severity: "High",
    signal: "Detected 1 hr ago",
  },
  {
    id: "sug-2",
    category: "Pharmacy",
    department: "Dispensary & Inventory",
    title: "Chronic Medication Stockout & Reorder Gaps",
    description: "Predictive inventory flags 14 vital cardiovascular medications nearing safety stock exhaustion before next shipment.",
    impactMetric: "14 critical SKUs at risk",
    severity: "Medium",
    signal: "Detected 3 hrs ago",
  },
  {
    id: "sug-3",
    category: "Pharmacy",
    department: "Chemotherapy Compounding",
    title: "Compounding Pharmacy Waste & Over-Dispensation",
    description: "Excess reconstituted IV admixture batching identified, resulting in 22% discarded oncology infusions.",
    impactMetric: "$34,200 monthly waste",
    severity: "Medium",
    signal: "Detected yesterday",
  },
  {
    id: "sug-4",
    category: "Billing",
    department: "Revenue Cycle & Billing",
    title: "Outpatient Laboratory Claim Unbundling Discrepancy",
    description: "Unbundled panel billing detected in arterial blood gas and metabolic profiles triggering 18% claim denials.",
    impactMetric: "€62,400 uncollected revenue",
    severity: "High",
    signal: "Detected 2 hrs ago",
  },
  {
    id: "sug-5",
    category: "Billing",
    department: "Virtual Care Operations",
    title: "Telehealth Concession & Copay Waiver Audit",
    description: "Unapproved front-desk copay override waivers identified in virtual psychiatric and internal medicine visits.",
    impactMetric: "$19,500 margin concession",
    severity: "Low",
    signal: "Detected yesterday",
  },
  {
    id: "sug-6",
    category: "Billing",
    department: "Emergency Billing Audit",
    title: "Emergency Triage Coding Level Downcoding",
    description: "Acuity Level 4 emergency interventions systematically billed as Level 2 due to documentation gaps in triage notes.",
    impactMetric: "$85,000 reimbursement delta",
    severity: "High",
    signal: "Detected 5 hrs ago",
  },
  {
    id: "sug-7",
    category: "Operations",
    department: "Surgical Suite Operations",
    title: "Operating Room Morning Turnaround Delays",
    description: "First-case morning starts delayed by average 26 minutes, leading to 2.4 hours cumulative idle surgical theater time daily.",
    impactMetric: "14.2 lost theater hours/wk",
    severity: "High",
    signal: "Detected 4 hrs ago",
  },
  {
    id: "sug-8",
    category: "Operations",
    department: "Radiology & Imaging",
    title: "Diagnostic Imaging Scanner Utilization Slump",
    description: "MRI 2 & CT Suite 3 show 38% unbooked slots between 1:00 PM and 4:30 PM despite a 12-day outpatient waitlist.",
    impactMetric: "46 recoverable scan slots/wk",
    severity: "Medium",
    signal: "Detected 6 hrs ago",
  },
  {
    id: "sug-9",
    category: "Clinical",
    department: "Inpatient Bed Flow",
    title: "Post-Acute Inpatient Discharge Clearance Lag",
    description: "Multidisciplinary social work and pharmacy discharge reviews delayed past 2 PM, inflating bed turnaround time.",
    impactMetric: "1.6 days excess ALOS",
    severity: "Medium",
    signal: "Detected 2 days ago",
  },
  {
    id: "sug-10",
    category: "Clinical",
    department: "Critical Care Step-Down",
    title: "Unplanned 72-Hour ICU Readmission Spike",
    description: "Step-down ward transfers exhibiting respiratory decompensation within 48 hours, prompting unplanned ICU return.",
    impactMetric: "8 clinical escalations flagged",
    severity: "High",
    signal: "Detected 8 hrs ago",
  },
];

const SUGGESTED_CATEGORIES = [
  { id: "All", label: "All Categories" },
  { id: "Pharmacy", label: "Pharmacy" },
  { id: "Billing", label: "Billing" },
  { id: "Operations", label: "Operations" },
  { id: "Clinical", label: "Clinical" },
] as const;

export interface AIAgentOption {
  id: string;
  name: string;
  category: "Pharmacy" | "Billing" | "Operations" | "Clinical";
  role: string;
  icon: React.ElementType;
  color: string;
  status: string;
}

export const AVAILABLE_AGENTS: AIAgentOption[] = [
  {
    id: "pharmacy",
    name: "Pharmacy Intelligence Agent",
    category: "Pharmacy",
    role: "Formulary parity, drug procurement arbitrage & dosage margin tracking",
    icon: Pill,
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    status: "Active • Model v2.4",
  },
  {
    id: "billing",
    name: "Revenue & Billing Audit Agent",
    category: "Billing",
    role: "Claims reconciliation, code denials, unbilled procedures & payer anomalies",
    icon: Receipt,
    color: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    status: "Active • Model v3.1",
  },
  {
    id: "operations",
    name: "Workflow & Operations Agent",
    category: "Operations",
    role: "OR scheduling bottlenecks, bed turnaround, radiology queues & staffing buffers",
    icon: Activity,
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    status: "Active • Model v2.2",
  },
  {
    id: "clinical",
    name: "Clinical Quality & Safety Agent",
    category: "Clinical",
    role: "Inpatient protocol compliance, 72h readmission risks & diagnostic clearance lags",
    icon: Stethoscope,
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    status: "Active • Model v2.8",
  },
];

interface ActiveCaseItem {
  age: string;
  title: string;
  body: string;
  expiryDate?: string | undefined;
  isLive?: boolean | undefined;
  agent?: string | undefined;
}

const initialActiveCases: ActiveCaseItem[] = [
  {
    age: "Just now",
    title: "Q3 Revenue Drop & Margin Compression Analysis",
    body: "Overall chain revenue declined 11.4% MoM in August, driven by acute chronic stockouts ($142k lost) and a 19% drop in footfall.",
    isLive: true,
  },
  {
    age: "2 hrs ago",
    title: "Pharmacy Revenue Anomaly",
    body: "Pharmacy sales increased by 8%, while medicine consumption increased by 21%.",
  },
  {
    age: "2 hrs ago",
    title: "Increasing Patient Wait Time",
    body: "Average patient waiting time increased from 34 to 49 minutes over the last quarter.",
    isLive: true,
  },
  {
    age: "4 hrs ago",
    title: "Laboratory Claim Reconciliation",
    body: "Differences were detected between ordered, completed, and billed laboratory services.",
  },
  {
    age: "1 day ago",
    title: "Operating Room Capacity Lag",
    body: "Morning surgical suites experienced 18% idle interval due to scheduling buffers.",
  },
  {
    age: "2 days ago",
    title: "Inpatient Bed Turnaround Lag",
    body: "Average inpatient discharge summary turnaround lengthened from 2.1 to 4.8 days.",
  },
];

interface SmallInsightCard {
  id: string;
  timeframe: "today" | "week" | "month";
  timeLabel: string;
  source: string;
  sourceIcon: React.ElementType;
  headline: string;
  previous: string;
  current: string;
  delta: string;
  tag: string;
  image?: string;
  chartData?: number[];
  chartType?: "area" | "bar" | "line";
  chartColor?: string;
}

const smallInsights: SmallInsightCard[] = [
  {
    id: "card-1",
    timeframe: "week",
    timeLabel: "This Week",
    source: "Outpatient Scheduling",
    sourceIcon: Stethoscope,
    headline: "Patient drop down ratio is improved by 3% from last week",
    previous: "14.2% drop rate",
    current: "11.2% drop rate",
    delta: "↓ 3.0% improved",
    tag: "+64 visits recovered",
    image: "/medical_surgery.jpg",
  },
  {
    id: "card-2",
    timeframe: "today",
    timeLabel: "Today",
    source: "Cardiology & Vascular",
    sourceIcon: HeartPulse,
    headline: "OP cancellation rate decreased by 4.2% compared to last cycle",
    previous: "18.0% cancellations",
    current: "13.8% cancellations",
    delta: "↓ 4.2% reduction",
    tag: "42 recovered slots",
    image: "/medical_scan.jpg",
  },
  {
    id: "card-3",
    timeframe: "week",
    timeLabel: "This Week",
    source: "Provider Rota Audit",
    sourceIcon: Activity,
    headline: "Doctor consultation utilization gained 6.5% vs previous roster",
    previous: "68.0% capacity",
    current: "74.5% capacity",
    delta: "↑ 6.5% gain",
    tag: "7 specialist rosters",
    chartData: [68, 69, 72, 74.5],
    chartType: "line",
    chartColor: "#10b981",
  },
  {
    id: "card-4",
    timeframe: "today",
    timeLabel: "Today",
    source: "Triage & Registration Feed",
    sourceIcon: Sparkles,
    headline: "Intake wait time shortened by 15 mins since morning intake",
    previous: "49 mins avg wait",
    current: "34 mins avg wait",
    delta: "↓ 15 mins faster",
    tag: "Triage wave normalized",
    chartData: [49, 44, 38, 34],
    chartType: "bar",
    chartColor: "#3b82f6",
  },
  {
    id: "card-5",
    timeframe: "month",
    timeLabel: "This Month",
    source: "Revenue Cycle Clearinghouse",
    sourceIcon: Stethoscope,
    headline: "Pharmacy unbilled revenue gap narrowed by €38,000 vs last month",
    previous: "€64k unbilled delta",
    current: "€26k unbilled delta",
    delta: "↓ €38k recovered",
    tag: "Diagnostic batch resolved",
    image: "/medical_lab.jpg",
  },
  {
    id: "card-6",
    timeframe: "month",
    timeLabel: "This Month",
    source: "Inpatient Bed Flow",
    sourceIcon: Activity,
    headline: "Discharge turnaround speed accelerated by 1.8 days from baseline",
    previous: "4.8 days turnaround",
    current: "3.0 days turnaround",
    delta: "↓ 1.8 days faster",
    tag: "3.2 hrs bed freed",
    chartData: [4.8, 4.2, 3.5, 3.0],
    chartType: "line",
    chartColor: "#10b981",
  },
  {
    id: "card-7",
    timeframe: "today",
    timeLabel: "Today",
    source: "Emergency Observation",
    sourceIcon: Activity,
    headline: "ER admission bottleneck lowered by 22% compared to yesterday",
    previous: "58 mins boarding",
    current: "45 mins boarding",
    delta: "↓ 13 mins reduction",
    tag: "Fast-track stream active",
    chartData: [58, 54, 49, 45],
    chartType: "area",
    chartColor: "#3b82f6",
  },
  {
    id: "card-8",
    timeframe: "today",
    timeLabel: "Today",
    source: "Diagnostic Radiology",
    sourceIcon: Stethoscope,
    headline: "STAT CT scan turnaround time improved by 19% from prior shift",
    previous: "42 mins reporting",
    current: "34 mins reporting",
    delta: "↓ 8 mins faster",
    tag: "AI triage priority",
    image: "/medical_scan.jpg",
  },
  {
    id: "card-9",
    timeframe: "week",
    timeLabel: "This Week",
    source: "Pharmacy Dispensation",
    sourceIcon: Sparkles,
    headline: "Prescription fulfillment error rate reduced by 3.8% vs last week",
    previous: "4.9% variance",
    current: "1.1% variance",
    delta: "↓ 3.8% accuracy gain",
    tag: "Barcode verification",
    image: "/medical_lab.jpg",
  },
  {
    id: "card-10",
    timeframe: "week",
    timeLabel: "This Week",
    source: "Surgical Suite Operations",
    sourceIcon: HeartPulse,
    headline: "OR turnover interval compressed by 12 mins across general surgery",
    previous: "47 mins between cases",
    current: "35 mins between cases",
    delta: "↓ 12 mins faster",
    tag: "+14 cases scheduled",
    chartData: [47, 44, 39, 35],
    chartType: "bar",
    chartColor: "#10b981",
  },
  {
    id: "card-11",
    timeframe: "month",
    timeLabel: "This Month",
    source: "Ambulatory Care Network",
    sourceIcon: Stethoscope,
    headline: "Patient 30-day readmission rate dropped by 2.4% over last month",
    previous: "11.6% readmissions",
    current: "9.2% readmissions",
    delta: "↓ 2.4% reduction",
    tag: "Care pathway adherence",
    image: "/medical_surgery.jpg",
  },
  {
    id: "card-12",
    timeframe: "month",
    timeLabel: "This Month",
    source: "Clinical Documentation",
    sourceIcon: Activity,
    headline: "Insurance pre-authorization cycle shortened by 2.6 days this month",
    previous: "6.1 days approval",
    current: "3.5 days approval",
    delta: "↓ 2.6 days accelerated",
    tag: "Automated payer rules",
    chartData: [6.1, 5.2, 4.3, 3.5],
    chartType: "line",
    chartColor: "#3b82f6",
  },
];

function MiniSparkline({
  type,
  data,
  color = "#3b82f6",
}: {
  type: "area" | "bar" | "line";
  data: number[];
  color?: string | undefined;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 110;
  const height = 32;
  const padding = 3;

  if (type === "bar") {
    const barWidth = width / (data.length * 1.8);
    return (
      <svg width={width} height={height} className="overflow-visible">
        {data.map((val, i) => {
          const h = ((val - min) / range) * (height - padding * 2) + 4;
          const x = i * (width / data.length) + 2;
          const y = height - h - padding;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={barWidth}
              height={h}
              rx={2}
              fill={color}
              opacity={i === data.length - 1 ? 1 : 0.45 + (i / data.length) * 0.45}
            />
          );
        })}
      </svg>
    );
  }

  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
      const y = height - ((val - min) / range) * (height - padding * 2) - padding;
      return `${x},${y}`;
    })
    .join(" ");

  const lastPoint = points.split(" ").slice(-1)[0] ?? "0,0";
  const [lastX = "0", lastY = "0"] = lastPoint.split(",");

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      <circle
        cx={lastX}
        cy={lastY}
        r="3"
        fill={color}
      />
    </svg>
  );
}

function Index() {
  const navigate = useNavigate();
  const [casesList, setCasesList] = useState(initialActiveCases);
  const [archivedCaseTitles, setArchivedCaseTitles] = useState<string[]>([]);
  const [lastArchivedNotice, setLastArchivedNotice] = useState<string | null>(null);

  const archiveCase = (title: string) => {
    setArchivedCaseTitles((prev) => (prev.includes(title) ? prev : [...prev, title]));
    setLastArchivedNotice(title);
    setTimeout(() => {
      setLastArchivedNotice((curr) => (curr === title ? null : curr));
    }, 5000);
  };

  const restoreCase = (title: string) => {
    setArchivedCaseTitles((prev) => prev.filter((t) => t !== title));
    setLastArchivedNotice(null);
  };

  const toggleLiveMonitoring = (title: string) => {
    setCasesList((prev) =>
      prev.map((c) => {
        if (c.title === title) {
          const currentLive = c.isLive ?? (c.title === "Increasing Patient Wait Time" || c.title === "Q3 Revenue Drop & Margin Compression Analysis");
          return { ...c, isLive: !currentLive };
        }
        return c;
      })
    );
  };

  const [caseSearchQuery, setCaseSearchQuery] = useState("");
  const [selectedSuggestedCategory, setSelectedSuggestedCategory] = useState<string>("All");
  const [isCategoryFilterOpen, setIsCategoryFilterOpen] = useState(false);
  const [suggestedNotice, setSuggestedNotice] = useState<string | null>(null);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);

  const displayedCases = useMemo(() => {
    return casesList
      .filter((c) => !archivedCaseTitles.includes(c.title))
      .filter((c) => {
        if (selectedSuggestedCategory === "All") return true;
        const cat = selectedSuggestedCategory.toLowerCase();
        return (
          (c.agent && c.agent.toLowerCase().includes(cat)) ||
          c.title.toLowerCase().includes(cat) ||
          c.body.toLowerCase().includes(cat)
        );
      })
      .filter((c) => {
        if (!caseSearchQuery.trim()) return true;
        const q = caseSearchQuery.toLowerCase().trim();
        return (
          c.title.toLowerCase().includes(q) ||
          c.body.toLowerCase().includes(q) ||
          (c.agent && c.agent.toLowerCase().includes(q))
        );
      });
  }, [casesList, archivedCaseTitles, caseSearchQuery, selectedSuggestedCategory]);

  const filteredSuggestedCases = useMemo(() => {
    if (selectedSuggestedCategory === "All") return suggestedCasesList;
    return suggestedCasesList.filter((c) => c.category === selectedSuggestedCategory);
  }, [selectedSuggestedCategory]);

  useEffect(() => {
    const handleOutsideClick = () => {
      setIsCategoryFilterOpen(false);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  // Modern Modal state for Add Case & AI Agent Assignment
  const [isAddCaseOpen, setIsAddCaseOpen] = useState(false);
  const [casePrompt, setCasePrompt] = useState("");
  const [caseDescription, setCaseDescription] = useState("");
  const [caseExpiryDate, setCaseExpiryDate] = useState("Until I stop");
  const [selectedAgentId, setSelectedAgentId] = useState<string>("pharmacy");

  const handleOpenSuggestedModal = (sug: SuggestedCase) => {
    setCasePrompt(sug.title);
    setCaseDescription(sug.description);
    const matchedAgent = AVAILABLE_AGENTS.find((a) => a.category === sug.category);
    if (matchedAgent) {
      setSelectedAgentId(matchedAgent.id);
    }
    setIsAddCaseOpen(true);
  };

  // Outlook-style layout selection state - default is unselected (null) as requested
  const [selectedCaseIndex, setSelectedCaseIndex] = useState<number>(-1);
  const [selectedActiveCase, setSelectedActiveCase] = useState<ActiveCaseItem | null>(null);
  const [mobileActiveView, setMobileActiveView] = useState<"list" | "detail">("list");
  const [isCaseLoading, setIsCaseLoading] = useState<boolean>(false);
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
    };
  }, []);

  const handleSelectCase = (caseItem: ActiveCaseItem, index: number) => {
    // If clicking the case currently displayed, avoid re-triggering loading
    if (selectedActiveCase?.title === caseItem.title && !isCaseLoading) {
      setMobileActiveView("detail");
      return;
    }

    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
    }

    setIsCaseLoading(true);
    setSelectedActiveCase(caseItem);
    setSelectedCaseIndex(index);
    setMobileActiveView("detail");

    // Snappy loading delay (320ms) as requested ("make a loading, then show the data, not too much loading time")
    loadingTimerRef.current = setTimeout(() => {
      setIsCaseLoading(false);
      loadingTimerRef.current = null;
    }, 320);
  };

  const mapTitleToCaseId = (title: string, index: number) => {
    const t = title.toLowerCase();
    if (t.includes("revenue") || t.includes("q3") || t.includes("margin")) return "case-1";
    if (t.includes("patient") || t.includes("wait") || t.includes("volume") || t.includes("consultation")) return "case-2";
    if (t.includes("cancellation") || t.includes("operating") || t.includes("turnaround") || t.includes("surgical")) return "case-3";
    if (t.includes("laboratory") || t.includes("claim") || t.includes("billing") || t.includes("reconciliation")) return "case-4";
    return `case-${((index >= 0 ? index : 0) % 4) + 1}`;
  };

  const currentCaseId = useMemo(() => {
    if (!selectedActiveCase) return "case-1";
    return mapTitleToCaseId(selectedActiveCase.title, selectedCaseIndex);
  }, [selectedActiveCase, selectedCaseIndex]);

  const handleAdoptCase = (item: SuggestedCase) => {
    const matchedAgent = AVAILABLE_AGENTS.find((a) => a.category === item.category);
    const newCase: ActiveCaseItem = {
      age: "Just now",
      title: item.title,
      body: `${item.description} (Estimated Impact: ${item.impactMetric})`,
      isLive: true,
      agent: matchedAgent?.name,
    };
    setCasesList([newCase, ...casesList]);
    handleSelectCase(newCase, 0);
    setSuggestedNotice(`Suggested case "${item.title}" added to active cases.`);
    setTimeout(() => setSuggestedNotice(null), 4000);
  };

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!casePrompt.trim()) return;

    const assignedAgent = AVAILABLE_AGENTS.find((a) => a.id === selectedAgentId);

    const newCase: ActiveCaseItem = {
      age: "Just now",
      title: casePrompt.trim(),
      body:
        caseDescription.trim() ||
        `${assignedAgent?.name || "AI Agent"} automated discovery scan initialized across clinical scheduling and billing repositories.`,
      expiryDate: caseExpiryDate ? caseExpiryDate : undefined,
      isLive: caseExpiryDate === "Until I stop" || !caseExpiryDate,
      agent: assignedAgent?.name,
    };
    setCasesList([newCase, ...casesList]);
    handleSelectCase(newCase, 0);
    setSuggestedNotice(`Case "${casePrompt.trim()}" activated with ${assignedAgent?.name || "AI Agent"}.`);
    setTimeout(() => setSuggestedNotice(null), 4000);
    setCasePrompt("");
    setCaseDescription("");
    setCaseExpiryDate("Until I stop");
    setIsAddCaseOpen(false);
  };

  return (
    <div className="h-screen bg-surface-tint font-sans text-foreground flex flex-col overflow-hidden">
      {/* Header with profile icon, name, and designation on right */}
      {/* Thinner top header with integrated Search and Filter */}
      <header className="sticky top-0 z-40 h-12 shrink-0 bg-[#072333] border-b border-[#0f354c] flex items-center justify-between px-3 sm:px-6 gap-3">
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/"
            className="text-base sm:text-lg font-bold tracking-tight text-white hover:opacity-85 transition cursor-pointer flex items-center gap-2 whitespace-nowrap"
            title="Inbox for CXO"
          >
            <span>Inbox for CXO</span>
          </Link>
        </div>

        {/* Search & Filter centered on top in the header */}
        <div className="flex-1 max-w-md sm:max-w-xl flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-sky-200/60 pointer-events-none" />
            <input
              type="text"
              value={caseSearchQuery}
              onChange={(e) => setCaseSearchQuery(e.target.value)}
              placeholder="Search active agents by title, description..."
              className="w-full h-8 rounded-lg border border-sky-400/20 bg-sky-950/50 pl-8.5 pr-8 text-xs sm:text-sm text-white placeholder:text-sky-200/50 focus:outline-none focus:ring-1 focus:ring-sky-400 focus:bg-sky-950/80 transition-all"
            />
            {caseSearchQuery && (
              <button
                type="button"
                onClick={() => setCaseSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sky-200/60 hover:text-white cursor-pointer p-0.5 rounded-full hover:bg-white/10 transition"
                aria-label="Clear search"
              >
                <X className="size-3" />
              </button>
            )}
          </div>

          {/* Category Filter Dropdown in Header */}
          <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setIsCategoryFilterOpen((prev) => !prev)}
              className={`h-8 inline-flex items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition cursor-pointer ${
                selectedSuggestedCategory !== "All"
                  ? "border-sky-400/50 bg-sky-500/25 text-white ring-1 ring-sky-400/30"
                  : "border-sky-400/20 bg-sky-950/40 text-sky-200/80 hover:bg-sky-900/50 hover:text-white"
              }`}
              title="Filter category"
            >
              <Filter className="size-3.5 text-sky-300" />
              <span className="hidden sm:inline">
                {selectedSuggestedCategory === "All" ? "Filter" : selectedSuggestedCategory}
              </span>
              <ChevronDown
                className={`size-3 text-sky-300/80 transition-transform duration-200 ${
                  isCategoryFilterOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isCategoryFilterOpen && (
              <div className="absolute right-0 top-full mt-1.5 z-50 w-52 rounded-xl border border-border/90 bg-surface p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/40 mb-1">
                  Filter by Category
                </div>
                <div className="space-y-0.5">
                  {SUGGESTED_CATEGORIES.map((cat) => {
                    const isSelected = selectedSuggestedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setSelectedSuggestedCategory(cat.id);
                          setIsCategoryFilterOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition cursor-pointer ${
                          isSelected
                            ? "bg-tile text-brand-blue font-semibold"
                            : "text-foreground hover:bg-tile/60"
                        }`}
                      >
                        <span>{cat.label}</span>
                        {isSelected && <Check className="size-3 text-brand-blue" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Profile on right top end */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-medium leading-none text-white">Robert</p>
            <p className="text-[10px] text-sky-200/70 mt-0.5">Chief Executive Officer</p>
          </div>
          <span className="grid size-7 sm:size-8 place-items-center rounded-full bg-[oklch(0.68_0.15_55)] text-xs sm:text-sm font-medium text-white shadow-xs">
            R
          </span>
        </div>
      </header>

      {/* Main Dual-Pane Workspace */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Navigation Rail */}
        <nav className="hidden w-[72px] shrink-0 flex-col items-center gap-2 pt-3 md:flex border-r border-border dark:border-zinc-800 overflow-visible bg-surface z-10">
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

        {/* OUTLOOK SPLIT INTERFACE */}
        <div className="flex-1 flex min-w-0 h-full overflow-hidden">
          {/* LEFT COLUMN: OUTLOOK-STYLE CASE & AGENT LIST (Increased Font & Visible Separation Lines) */}
          <aside
            className={`w-full lg:w-[450px] xl:w-[490px] shrink-0 border-r-2 border-border dark:border-zinc-800 bg-surface flex flex-col h-full overflow-hidden ${
              mobileActiveView === "detail" ? "hidden lg:flex" : "flex"
            }`}
          >
            {/* Toast Notices if present */}
            {(lastArchivedNotice || suggestedNotice) && (
              <div className="p-3 border-b border-border/80 space-y-2 bg-surface">
                {lastArchivedNotice && (
                  <div className="flex items-center justify-between rounded-xl bg-amber-500/10 border border-amber-500/30 p-2.5 text-xs text-foreground animate-in fade-in">
                    <div className="flex items-center gap-2 truncate">
                      <Archive className="size-3.5 text-amber-600 shrink-0" />
                      <span className="truncate">Archived "{lastArchivedNotice}"</span>
                    </div>
                    <button
                      onClick={() => restoreCase(lastArchivedNotice)}
                      className="text-xs font-semibold text-brand-blue hover:underline cursor-pointer shrink-0 ml-2"
                    >
                      Undo
                    </button>
                  </div>
                )}

                {suggestedNotice && (
                  <div className="flex items-center justify-between rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/60 p-2.5 text-xs text-blue-900 dark:text-blue-200 animate-in fade-in">
                    <div className="flex items-center gap-2 truncate">
                      <CheckCircle2 className="size-4 text-brand-blue shrink-0" />
                      <span className="truncate font-medium">{suggestedNotice}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSuggestedNotice(null)}
                      className="text-muted-foreground hover:text-foreground cursor-pointer shrink-0 ml-2"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Scrollable Outlook List Items: Active Agents Only with Generous Spacing & Visible Dividers */}
            <div className="flex-1 overflow-y-auto no-scrollbar divide-y-2 divide-border/80 dark:divide-zinc-800">
              {displayedCases.map((c, i) => {
                const isSelected = selectedActiveCase?.title === c.title;

                return (
                  <div
                    key={`${c.title}-${i}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      handleSelectCase(c, i);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleSelectCase(c, i);
                      }
                    }}
                    className={`w-full text-left p-5 sm:p-5.5 transition-all cursor-pointer relative group border-l-4 border-b border-border/80 dark:border-zinc-800 ${
                      isSelected
                        ? "border-l-brand-blue bg-blue-50/80 dark:bg-blue-950/45 shadow-xs"
                        : "border-l-transparent hover:bg-tile/75"
                    }`}
                  >
                    {/* Top Line: Age / Timestamp + Agent Badge + Status Dot */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {c.isLive && (
                          <span className="size-2 rounded-full bg-emerald-500 animate-pulse shrink-0" title="Live Continuous Monitoring" />
                        )}
                        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                          {c.age}
                        </span>
                        {c.agent && (
                          <span className="inline-flex items-center gap-1 text-xs rounded-full px-2.5 py-0.5 bg-brand-blue/10 text-brand-blue font-medium border border-brand-blue/20 truncate">
                            <Sparkles className="size-3 shrink-0" />
                            <span className="truncate">{c.agent}</span>
                          </span>
                        )}
                      </div>

                      {c.expiryDate && (
                        <span className="text-xs text-amber-700 dark:text-amber-300 font-medium px-2 py-0.5 rounded-md bg-amber-500/10 whitespace-nowrap">
                          {c.expiryDate}
                        </span>
                      )}
                    </div>

                    {/* Title on Left (Semi bold and a little bigger) */}
                    <h4
                      className={`text-lg sm:text-[18px] font-semibold leading-snug line-clamp-2 transition-colors ${
                        isSelected
                          ? "text-brand-blue"
                          : "text-foreground group-hover:text-brand-blue"
                      }`}
                    >
                      {c.title}
                    </h4>

                    {/* Part of Description on Left */}
                    <p className="mt-2 text-sm text-foreground/75 leading-relaxed line-clamp-2 font-normal">
                      {c.body}
                    </p>
                  </div>
                );
              })}

              {displayedCases.length === 0 && (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No active agents matching your search or category filter.
                </div>
              )}
            </div>
          </aside>

          {/* RIGHT COLUMN: OUTLOOK-STYLE READING PANE (DEFAULT UNSELECTED VIEW + INLINE DETAILS WITH CHAT HIDDEN BY DEFAULT) */}
          <section
            className={`flex-1 min-w-0 h-full overflow-hidden flex flex-col bg-surface-tint ${
              mobileActiveView === "list" ? "hidden lg:flex" : "flex"
            }`}
          >
            {isCaseLoading ? (
              <div className="flex-1 flex flex-col h-full bg-surface-tint overflow-hidden animate-in fade-in duration-150">
                {/* Simulated Header Bar Skeleton */}
                <div className="h-16 px-6 border-b border-border/80 dark:border-zinc-800 bg-surface flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-xl bg-muted/60 animate-pulse" />
                    <div className="space-y-1.5">
                      <div className="h-4 w-44 rounded-md bg-muted/70 animate-pulse" />
                      <div className="h-2.5 w-24 rounded-md bg-muted/40 animate-pulse" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-24 rounded-xl bg-muted/50 animate-pulse" />
                    <div className="size-8 rounded-xl bg-muted/40 animate-pulse" />
                  </div>
                </div>

                {/* Loading Content Area with Skeleton Cards */}
                <div className="flex-1 overflow-y-auto no-scrollbar p-6 sm:p-8 space-y-6">
                  {/* Snappy status indicator */}
                  <div className="flex items-center justify-center pt-2 pb-1">
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-surface border border-border/80 shadow-xs">
                      <Loader2 className="size-4 text-brand-blue animate-spin" />
                      <span className="text-xs sm:text-sm font-medium text-foreground">
                        Loading case analysis & telemetry...
                      </span>
                    </div>
                  </div>

                  {/* Top Executive Card Skeleton */}
                  <div className="rounded-3xl bg-surface border border-border/80 p-6 sm:p-7 space-y-4 animate-pulse">
                    <div className="flex items-center justify-between">
                      <div className="h-5 w-1/3 bg-muted/70 rounded-md" />
                      <div className="h-6 w-20 bg-muted/50 rounded-full" />
                    </div>
                    <div className="space-y-2 pt-1">
                      <div className="h-3.5 w-full bg-muted/50 rounded" />
                      <div className="h-3.5 w-5/6 bg-muted/40 rounded" />
                      <div className="h-3.5 w-4/6 bg-muted/40 rounded" />
                    </div>
                  </div>

                  {/* Metric Cards Skeleton Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-2xl bg-surface border border-border/80 p-5 space-y-3 animate-pulse">
                      <div className="h-3.5 w-2/5 bg-muted/60 rounded" />
                      <div className="h-6 w-3/5 bg-muted/70 rounded" />
                      <div className="h-2.5 w-4/5 bg-muted/40 rounded" />
                    </div>
                    <div className="rounded-2xl bg-surface border border-border/80 p-5 space-y-3 animate-pulse">
                      <div className="h-3.5 w-2/5 bg-muted/60 rounded" />
                      <div className="h-6 w-3/5 bg-muted/70 rounded" />
                      <div className="h-2.5 w-4/5 bg-muted/40 rounded" />
                    </div>
                    <div className="rounded-2xl bg-surface border border-border/80 p-5 space-y-3 animate-pulse">
                      <div className="h-3.5 w-2/5 bg-muted/60 rounded" />
                      <div className="h-6 w-3/5 bg-muted/70 rounded" />
                      <div className="h-2.5 w-4/5 bg-muted/40 rounded" />
                    </div>
                  </div>

                  {/* Action Items Skeleton */}
                  <div className="rounded-3xl bg-surface border border-border/80 p-6 space-y-3 animate-pulse">
                    <div className="h-4 w-1/4 bg-muted/70 rounded-md" />
                    <div className="space-y-2 pt-2">
                      <div className="h-10 w-full rounded-xl bg-muted/40" />
                      <div className="h-10 w-full rounded-xl bg-muted/30" />
                    </div>
                  </div>
                </div>
              </div>
            ) : selectedActiveCase ? (
              <CaseDetailsView
                selectedCaseId={currentCaseId}
                customCase={selectedActiveCase}
                onBack={() => setMobileActiveView("list")}
                initialShowChat={false}
              />
            ) : (
              /* DEFAULT EMPTY STATE WHEN NO ITEM IS SELECTED */
              <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 text-center bg-surface-tint overflow-y-auto no-scrollbar">
                <div className="max-w-2xl mx-auto space-y-6 my-auto w-full">
                  <div className="mx-auto size-16 rounded-2xl bg-brand-blue/10 border border-brand-blue/20 grid place-items-center text-brand-blue shadow-sm">
                    <Bot className="size-8" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight font-light" style={{ fontWeight: 300 }}>
                      Select an Agent to View Analysis
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
                      Choose any active agent from the left pane to view its executive summary, root cause telemetry, key financial metrics, and recommended actions.
                    </p>
                  </div>

                  {/* Low priority suggestions button */}
                  <div className="pt-2 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsSuggestionsVisible((prev) => !prev)}
                      className="inline-flex items-center gap-2 rounded-xl border border-border/90 bg-surface px-5 py-2.5 text-sm font-medium text-foreground shadow-2xs hover:bg-tile transition cursor-pointer active:scale-95"
                    >
                      <Sparkles className="size-4 text-brand-blue" />
                      <span>{isSuggestionsVisible ? "Hide Suggestions" : "Show Suggestions"}</span>
                    </button>
                  </div>

                  {/* Collapsible Low-Priority Suggestions Section */}
                  {isSuggestionsVisible && (
                    <div className="mt-6 pt-6 border-t border-border/80 text-left space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-foreground">Suggested Agent Opportunities</h4>
                          <p className="text-xs text-muted-foreground">Autonomous discovery signals available to activate</p>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-tile text-muted-foreground border border-border/60">
                          {suggestedCasesList.length} suggestions
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1 no-scrollbar">
                        {suggestedCasesList.map((sug) => (
                          <div
                            key={sug.id}
                            className="p-4 rounded-2xl bg-surface border border-border/80 shadow-xs hover:border-brand-blue/40 transition flex flex-col justify-between"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[11px] font-semibold text-brand-blue uppercase tracking-wider">
                                  {sug.department}
                                </span>
                                <span className="text-[11px] text-muted-foreground">{sug.signal}</span>
                              </div>
                              <h5 className="text-sm font-semibold text-foreground line-clamp-2">
                                {sug.title}
                              </h5>
                              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-normal">
                                {sug.description}
                              </p>
                            </div>

                            <div className="mt-3 pt-2.5 border-t border-border/50 flex items-center justify-between">
                              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                                {sug.impactMetric}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleAdoptCase(sug)}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-blue hover:underline cursor-pointer"
                              >
                                <Plus className="size-3.5" />
                                <span>Activate</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Modern Add Case Modal with AI Agents */}
      {isAddCaseOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsAddCaseOpen(false)}
        >
          <div
            className="w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl bg-surface p-6 sm:p-7 shadow-2xl border border-border/80 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Configure AI Discovery Agent</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Prefilled details and autonomous AI agent execution
                </p>
              </div>
              <button
                onClick={() => setIsAddCaseOpen(false)}
                className="rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-tile transition cursor-pointer"
                aria-label="Close"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleCreateCase} className="mt-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  What should AI find? <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={casePrompt}
                  onChange={(e) => setCasePrompt(e.target.value)}
                  placeholder="e.g. Detect revenue leakage in Cardiology consultations..."
                  className="w-full rounded-2xl border border-border/80 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-foreground outline-none focus:border-foreground focus:ring-1 focus:ring-foreground/20 transition placeholder:text-muted-foreground shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Description <span className="text-xs font-normal text-muted-foreground">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={caseDescription}
                  onChange={(e) => setCaseDescription(e.target.value)}
                  placeholder="Add context on departments, expected metrics, or historical baseline periods..."
                  className="w-full rounded-2xl border border-border/80 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-foreground outline-none focus:border-foreground focus:ring-1 focus:ring-foreground/20 transition resize-none placeholder:text-muted-foreground shadow-2xs"
                />
              </div>

              {/* Assigned AI Agent Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-foreground">
                    Assigned AI Agent <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs text-muted-foreground">
                    Pre-selected for this domain
                  </span>
                </div>

                <div className="space-y-2">
                  {AVAILABLE_AGENTS.map((agent) => {
                    const AgentIcon = agent.icon;
                    const isSelected = selectedAgentId === agent.id;
                    return (
                      <div
                        key={agent.id}
                        onClick={() => setSelectedAgentId(agent.id)}
                        className={`flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? "border-brand-blue bg-brand-blue/5 dark:bg-brand-blue/10 ring-1 ring-brand-blue/30 shadow-xs"
                            : "border-border/70 bg-tile/40 hover:bg-tile hover:border-border"
                        }`}
                      >
                        <div className={`grid size-9 shrink-0 place-items-center rounded-xl border ${agent.color}`}>
                          <AgentIcon className="size-4" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-semibold text-foreground">
                              {agent.name}
                            </span>
                            <span className="rounded-full px-2 py-0.5 text-[10px] font-medium bg-border/60 text-muted-foreground">
                              {agent.category}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {agent.role}
                          </p>
                        </div>

                        <div className="shrink-0 pt-0.5">
                          <div
                            className={`size-4 rounded-full border flex items-center justify-center transition-colors ${
                              isSelected
                                ? "border-brand-blue bg-brand-blue text-white"
                                : "border-border/80 bg-surface"
                            }`}
                          >
                            {isSelected && <div className="size-1.5 rounded-full bg-white" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">
                  Case Duration
                </label>
                <p className="text-xs text-muted-foreground mb-2">
                  New insights will be generated until the duration expires.
                </p>
                <div className="relative">
                  <select
                    value={caseExpiryDate}
                    onChange={(e) => setCaseExpiryDate(e.target.value)}
                    className="w-full rounded-2xl border border-border/80 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-foreground outline-none focus:border-foreground focus:ring-1 focus:ring-foreground/20 transition shadow-2xs cursor-pointer appearance-none pr-10"
                  >
                    <option value="Until I stop">Until I stop</option>
                    <option value="10 days">10 days</option>
                    <option value="30 days">30 days</option>
                    <option value="60 days">60 days</option>
                    <option value="90 days">90 days</option>
                    <option value="1 year">1 year</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddCaseOpen(false)}
                  className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground hover:bg-tile transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-2.5 text-sm font-medium text-surface shadow-xs hover:opacity-90 transition cursor-pointer active:scale-95"
                >
                  <Sparkles className="size-4" />
                  <span>Deploy Agent</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}



function Panel({ children, className = "p-5 sm:p-6" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-3xl bg-surface ${className}`}>{children}</section>
  );
}
