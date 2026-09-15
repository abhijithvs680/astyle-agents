import { useState, useRef, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Menu,
  Home,
  Briefcase,
  Database,
  Compass,
  FolderKanban,
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
  MoreVertical,
  ChevronDown,
  FileText,
} from "lucide-react";
import { ScanningRadarIcon } from "../components/ScanningRadarIcon";
import { MainMenuDrawer } from "../components/MainMenuDrawer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CXO — Case Analytics & Insights Dashboard" },
      {
        name: "description",
        content:
          "CXO dashboard showing newly detected cases, active case analytics, and operational anomalies across departments.",
      },
      { property: "og:title", content: "CXO — Case Analytics Dashboard" },
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
  { icon: Briefcase, label: "Cases", to: "/cases" },
  { icon: Compass, label: "Explore", to: "/explore" },
  { icon: FolderKanban, label: "Folders", to: "/folders" },
  { icon: FileText, label: "Files", to: "/files" },
  { icon: Server, label: "Data Center", to: "/data-center" },
];

// Colors matched exactly to the attached reference image
const newCases = [
  {
    up: true,
    tint: "bg-gradient-to-br from-[#e8fbee] via-[#d8f6de] to-[#c2eed0]",
    hoverGradient: "bg-gradient-to-br from-[#d4f6dc] via-[#bbf0c8] to-[#9ee5b0]",
    iconTint: "bg-[#107f47]",
    title: "3 Cross-sell opportunity identified",
    titleWeight: "font-medium",
    body: "Prescription attach rate analysis identified high-conversion ancillary lab and wellness packages.",
    bodyColor: "text-[#264431]",
  },
  {
    up: false,
    tint: "bg-gradient-to-br from-[#faecfd] via-[#f4dbf8] to-[#e8c7f2]",
    hoverGradient: "bg-gradient-to-br from-[#f6ddfc] via-[#eebeef] to-[#e3a4e4]",
    iconTint: "bg-[#dc2626]",
    title: "OP cancellations increased by 18%",
    titleWeight: "font-medium",
    body: "A sudden rise in appointment cancellations was detected in selected departments.",
    bodyColor: "text-[#4c2f57]",
  },
  {
    up: false,
    tint: "bg-gradient-to-br from-[#eaf4fe] via-[#d8ecfe] to-[#bfdffa]",
    hoverGradient: "bg-gradient-to-br from-[#d7ebfd] via-[#bfdefc] to-[#9ecbf9]",
    iconTint: "bg-[#dc2626]",
    title: "Complaint volume increased by 16%",
    titleWeight: "font-semibold",
    body: "Patient complaints grew across front-desk and billing touchpoints this quarter.",
    bodyColor: "text-[#284661]",
  },
  {
    up: true,
    tint: "bg-gradient-to-br from-[#e8fbee] via-[#d8f6de] to-[#c2eed0]",
    hoverGradient: "bg-gradient-to-br from-[#d4f6dc] via-[#bbf0c8] to-[#9ee5b0]",
    iconTint: "bg-[#107f47]",
    title: "2 Discount leakage identified",
    titleWeight: "font-medium",
    body: "Unapproved concession overrides and compounding pharmacy discounts exceeded departmental margin thresholds.",
    bodyColor: "text-[#264431]",
  },
  {
    up: false,
    tint: "bg-gradient-to-br from-[#fff0e2] via-[#fedfc3] to-[#fbcfa8]",
    hoverGradient: "bg-gradient-to-br from-[#ffe4cc] via-[#fecda4] to-[#fdb57d]",
    iconTint: "bg-[#dc2626]",
    title: "4 lab revenue anomalies found",
    titleWeight: "font-medium",
    body: "Differences were detected between ordered, completed, and billed laboratory services.",
    bodyColor: "text-[#55361e]",
  },
];

interface ActiveCaseItem {
  age: string;
  title: string;
  body: string;
  expiryDate?: string | undefined;
  isLive?: boolean | undefined;
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
  const [mainTab, setMainTab] = useState<"investigations" | "insights">("investigations");
  const [timeFilter, setTimeFilter] = useState<"all" | "today" | "week" | "month">("all");
  const [casesList, setCasesList] = useState(initialActiveCases);
  const [archivedCaseTitles, setArchivedCaseTitles] = useState<string[]>([]);
  const [openCaseMenu, setOpenCaseMenu] = useState<string | null>(null);
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

  const displayedCases = casesList.filter((c) => !archivedCaseTitles.includes(c.title));

  useEffect(() => {
    const handleOutsideClick = () => setOpenCaseMenu(null);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  // Modern Modal state for Add Case
  const [isAddCaseOpen, setIsAddCaseOpen] = useState(false);
  const [casePrompt, setCasePrompt] = useState("");
  const [caseDescription, setCaseDescription] = useState("");
  const [caseExpiryDate, setCaseExpiryDate] = useState("Until I stop");
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);

  // Ref and scrolling for top Explore cards carousel
  const exploreScrollRef = useRef<HTMLDivElement>(null);

  const scrollExplore = (direction: "left" | "right") => {
    if (exploreScrollRef.current) {
      exploreScrollRef.current.scrollBy({
        left: direction === "left" ? -320 : 320,
        behavior: "smooth",
      });
    }
  };

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!casePrompt.trim()) return;

    const newCase: ActiveCaseItem = {
      age: "Just now",
      title: casePrompt.trim(),
      body:
        caseDescription.trim() ||
        "AI automated discovery scan initialized across clinical scheduling and billing repositories.",
      expiryDate: caseExpiryDate ? caseExpiryDate : undefined,
      isLive: caseExpiryDate === "Until I stop" || !caseExpiryDate,
    };
    setCasesList([newCase, ...casesList]);
    setCasePrompt("");
    setCaseDescription("");
    setCaseExpiryDate("Until I stop");
    setIsAddCaseOpen(false);
  };

  const filteredCards = smallInsights.filter(
    (c) => timeFilter === "all" || c.timeframe === timeFilter
  );

  return (
    <div className="min-h-screen bg-surface-tint font-sans text-foreground">
      {/* Header with profile icon, name, and designation on right (Fixed on scroll) */}
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

        {/* Profile on right top end */}
        <div className="flex items-center gap-3">
          <Link
            to="/welcome"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/15 transition"
          >
            New user setup
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

      <div className="flex">
        {/* Navigation Rail (Fixed while scrolling) */}
        <nav className="hidden w-[72px] shrink-0 flex-col items-center gap-2 pt-3 md:flex sticky top-16 h-[calc(100vh-4rem)] border-r border-border/40 overflow-visible">
          {railIcons.map(({ icon: Icon, label, to, active }) => (
            <div key={label} className="relative group flex items-center justify-center">
              <Link
                to={to}
                aria-label={label}
                className={`relative grid size-12 place-items-center rounded-full transition-colors duration-200 cursor-pointer ${active
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

        <main className="min-w-0 flex-1 px-3 pt-4 pb-12 sm:px-6 sm:pt-6">
          {/* Main Tabs: Investigations & Insights + Top Actions */}
          <div className="flex flex-wrap items-center gap-3 pb-4">
            <Chip
              icon={FolderKanban}
              label="Investigations"
              active={mainTab === "investigations"}
              onClick={() => setMainTab("investigations")}
            />
            <Chip
              icon={Sparkles}
              label="My feed"
              active={mainTab === "insights"}
              onClick={() => setMainTab("insights")}
            />

            {/* Top Right: Add Case button with filled type */}
            <div className="ml-auto flex items-center gap-3">
              <button
                onClick={() => {
                  setCasePrompt("");
                  setCaseDescription("");
                  setIsAddCaseOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-surface shadow-xs hover:opacity-90 transition cursor-pointer"
              >
                <Plus className="size-4" />
                Add Case
              </button>
            </div>
          </div>

          {/* TAB 1: INVESTIGATIONS VIEW */}
          {mainTab === "investigations" && (
            <div className="space-y-4">
              <Panel className="p-3.5 sm:p-4">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-medium text-foreground">Explore Insights</h2>
                  </div>

                  {/* Left & Right Arrow Navigation (Replacing scrollbar) */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => scrollExplore("left")}
                      className="grid size-8 place-items-center rounded-full border border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-tile transition shadow-xs cursor-pointer active:scale-95"
                      aria-label="Previous cases"
                      title="Scroll Left"
                    >
                      <ChevronLeft className="size-4" />
                    </button>
                    <button
                      onClick={() => scrollExplore("right")}
                      className="grid size-8 place-items-center rounded-full border border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-tile transition shadow-xs cursor-pointer active:scale-95"
                      aria-label="Next cases"
                      title="Scroll Right"
                    >
                      <ChevronRight className="size-4" />
                    </button>
                  </div>
                </div>

                {/* Carousel with hidden scrollbar and smooth scroll */}
                <div
                  ref={exploreScrollRef}
                  className="flex gap-3.5 overflow-x-auto pb-1 scroll-smooth no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                >
                  {newCases.map((c, idx) => (
                    <div
                      key={c.title}
                      onClick={() => {
                        setCasePrompt(c.title);
                        setCaseDescription(c.body);
                        setIsAddCaseOpen(true);
                      }}
                      role="button"
                      tabIndex={0}
                      className={`group relative overflow-hidden flex w-72 sm:w-[290px] shrink-0 flex-col justify-between rounded-2xl sm:rounded-[22px] p-3.5 sm:p-4 cursor-pointer ${c.tint}`}
                    >
                      {/* Hover Gradient Overlay (Smoothly shifts gradient color on hover) */}
                      <div
                        className={`pointer-events-none absolute inset-0 rounded-2xl sm:rounded-[22px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${c.hoverGradient}`}
                      />

                      {/* Minimal Top-Side Light Background Pattern (3x3 Dot Grid matching OP cancellations card) */}
                      <svg
                        className="pointer-events-none absolute top-2.5 right-2.5 size-7 text-black/15 dark:text-white/15"
                        viewBox="0 0 36 36"
                        fill="none"
                        aria-hidden="true"
                      >
                        <circle cx="6" cy="6" r="1.5" fill="currentColor" />
                        <circle cx="18" cy="6" r="1.5" fill="currentColor" />
                        <circle cx="30" cy="6" r="1.5" fill="currentColor" />
                        <circle cx="6" cy="18" r="1.5" fill="currentColor" />
                        <circle cx="18" cy="18" r="1.5" fill="currentColor" />
                        <circle cx="30" cy="18" r="1.5" fill="currentColor" />
                        <circle cx="6" cy="30" r="1.5" fill="currentColor" />
                        <circle cx="18" cy="30" r="1.5" fill="currentColor" />
                        <circle cx="30" cy="30" r="1.5" fill="currentColor" />
                      </svg>

                      {/* Foreground Content */}
                      <div className="relative z-10">
                        <span
                          className={`grid size-7 place-items-center rounded-full text-white shadow-xs ${c.iconTint}`}
                        >
                          {c.up ? (
                            <TrendingUp className="size-3.5 text-white" />
                          ) : (
                            <TrendingDown className="size-3.5 text-white" />
                          )}
                        </span>
                        <h4
                          className={`mt-2 text-[18px] leading-snug text-[#111827] ${c.titleWeight}`}
                        >
                          {c.title}
                        </h4>
                        <p className={`mt-1 text-sm leading-relaxed line-clamp-2 ${c.bodyColor}`}>
                          {c.body}
                        </p>
                      </div>

                      {/* Prompt to create case with prefilled details */}
                      <div className="relative z-10 mt-2.5 pt-2 border-t border-black/10 flex items-center justify-between text-[11px] font-medium text-[#111827]/75 group-hover:text-black transition-colors">
                        <span>Create case</span>
                        <Plus className="size-3" />
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel>
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-[22px] font-medium text-foreground">Cases</h2>
                    <button
                      onClick={() => {
                        setCasePrompt("");
                        setCaseDescription("");
                        setIsAddCaseOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs sm:text-sm font-medium hover:bg-tile cursor-pointer text-foreground transition shadow-2xs active:scale-95"
                    >
                      <Plus className="size-4 text-foreground" />
                      <span>New Case</span>
                    </button>
                  </div>

                  <button aria-label="Expand" className="rounded-full p-1.5 hover:bg-tile text-muted-foreground hover:text-foreground transition cursor-pointer">
                    <Expand className="size-4" />
                  </button>
                </div>

                {lastArchivedNotice && (
                  <div className="mb-4 flex items-center justify-between rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-foreground shadow-2xs animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <Archive className="size-3.5 text-amber-600 dark:text-amber-400" />
                      <span>Case <strong>"{lastArchivedNotice}"</strong> has been archived.</span>
                    </div>
                    <button
                      onClick={() => restoreCase(lastArchivedNotice)}
                      className="text-xs font-semibold text-brand-blue hover:underline cursor-pointer ml-3"
                    >
                      Undo
                    </button>
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {displayedCases.map((c, i) => {
                    const isLive = c.isLive ?? (c.title === "Increasing Patient Wait Time" || c.title === "Q3 Revenue Drop & Margin Compression Analysis");
                    return (
                      <div
                        key={`${c.title}-${i}`}
                        onClick={() => navigate({ to: "/details" })}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            navigate({ to: "/details" });
                          }
                        }}
                        className="flex flex-col rounded-2xl bg-tile p-5 relative group cursor-pointer hover:shadow-md hover:border-border/80 border border-transparent transition-all duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{c.age || "\u00A0"}</span>
                            {c.expiryDate && (
                              <span className="inline-flex items-center gap-1 text-[11px] rounded-md px-1.5 py-0.5 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-medium border border-amber-500/20">
                                Duration: {c.expiryDate}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 relative">
                            {isLive && (
                              <span
                                className="inline-flex items-center gap-1.5 rounded-full bg-[#f0f8ff] px-2.5 py-0.5 text-emerald-800 dark:text-emerald-900 border border-emerald-500/30 text-[11px] font-medium shadow-2xs"
                                title="Continuous monitoring — Auditing mode is active"
                                aria-label="Continuous monitoring — Auditing mode is active"
                              >
                                <ScanningRadarIcon size={18} />
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-900">Auditing</span>
                              </span>
                            )}

                            {/* Three dot action menu containing Archive and Auditing toggle */}
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenCaseMenu(openCaseMenu === c.title ? null : c.title);
                                }}
                                className="p-1 rounded-full hover:bg-surface border border-transparent hover:border-border/60 text-muted-foreground hover:text-foreground transition cursor-pointer"
                                title="Case actions"
                                aria-label="Case actions"
                              >
                                <MoreVertical className="size-4" />
                              </button>

                              {openCaseMenu === c.title && (
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  className="absolute right-0 top-full mt-1 z-30 w-48 rounded-xl border border-border/80 bg-surface p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-100"
                                >
                                  <button
                                    onClick={() => {
                                      toggleLiveMonitoring(c.title);
                                      setOpenCaseMenu(null);
                                    }}
                                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-foreground hover:bg-tile hover:text-emerald-700 dark:hover:text-emerald-300 transition cursor-pointer"
                                  >
                                    <ScanningRadarIcon size={15} />
                                    <span>{isLive ? "Pause Auditing" : "Enable Auditing"}</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      archiveCase(c.title);
                                      setOpenCaseMenu(null);
                                    }}
                                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-foreground hover:bg-tile hover:text-amber-700 dark:hover:text-amber-300 transition cursor-pointer"
                                  >
                                    <Archive className="size-3.5 text-amber-600 dark:text-amber-400" />
                                    <span>Archive Case</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <h4 className="mt-5 text-lg font-medium text-foreground group-hover:text-brand-blue transition-colors">
                          {c.title}
                        </h4>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground/75">
                          {c.body}
                        </p>

                        <div className="mt-5 flex items-center justify-between gap-2">
                          <span
                            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-brand-blue hover:bg-tile transition cursor-pointer group-hover:border-brand-blue/30 shadow-2xs"
                          >
                            Case details
                            <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {displayedCases.length === 0 && (
                  <div className="py-12 text-center rounded-2xl bg-surface border border-border/60 p-6 text-sm text-muted-foreground">
                    No active cases found. You can create a case using the "New Case" button.
                  </div>
                )}

                {displayedCases.length > 0 && (
                  <div className="mt-8 text-center">
                    <button className="text-lg text-foreground hover:text-brand-blue">
                      Load more
                    </button>
                  </div>
                )}
              </Panel>
            </div>
          )}

          {/* TAB 2: MINIMAL AUTOMATED RESULTS INSIGHTS */}
          {mainTab === "insights" && (
            <div className="w-full space-y-6">
              {/* Header & Time Period Filters */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-[22px] font-semibold text-foreground">
                    Continuous Auditing
                  </h2>
                  <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground">
                    Continuous comparative findings across previous runs and active cases.
                  </p>
                </div>

                {/* Timeframe separation: Today, This Week, This Month */}
                <div className="flex items-center gap-1 rounded-2xl bg-surface p-1 border border-border">
                  <button
                    onClick={() => setTimeFilter("all")}
                    className={`rounded-xl px-3 py-1.5 text-xs font-medium transition cursor-pointer ${timeFilter === "all"
                      ? "bg-chip-active text-chip-active-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    All ({smallInsights.length})
                  </button>
                  <button
                    onClick={() => setTimeFilter("today")}
                    className={`rounded-xl px-3 py-1.5 text-xs font-medium transition cursor-pointer ${timeFilter === "today"
                      ? "bg-chip-active text-chip-active-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    Today ({smallInsights.filter((c) => c.timeframe === "today").length})
                  </button>
                  <button
                    onClick={() => setTimeFilter("week")}
                    className={`rounded-xl px-3 py-1.5 text-xs font-medium transition cursor-pointer ${timeFilter === "week"
                      ? "bg-chip-active text-chip-active-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    This Week ({smallInsights.filter((c) => c.timeframe === "week").length})
                  </button>
                  <button
                    onClick={() => setTimeFilter("month")}
                    className={`rounded-xl px-3 py-1.5 text-xs font-medium transition cursor-pointer ${timeFilter === "month"
                      ? "bg-chip-active text-chip-active-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    This Month ({smallInsights.filter((c) => c.timeframe === "month").length})
                  </button>
                </div>
              </div>

              {/* Pinterest-like Masonry Columns - Cards without images have reduced height */}
              <div className="columns-1 sm:columns-2 lg:columns-4 gap-4 sm:gap-5 w-full [column-fill:_balance]">
                {filteredCards.map((card) => {
                  return (
                    <div key={card.id} className="break-inside-avoid mb-4 sm:mb-5">
                      <Link
                        to="/details"
                        className="group rounded-3xl bg-surface border border-border/70 p-4.5 sm:p-5 shadow-xs hover:border-foreground/30 hover:shadow-md transition-all duration-200 block cursor-pointer"
                      >
                        <div className="space-y-3">
                          {/* Optional subtle medical image */}
                          {card.image && (
                            <div className="overflow-hidden rounded-2xl bg-tile aspect-[16/9] w-full border border-border/40">
                              <img
                                src={card.image}
                                alt={card.headline}
                                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}

                          {/* Automated Comparative Statement */}
                          <h3 className="text-lg sm:text-xl font-normal text-foreground leading-snug group-hover:text-brand-blue transition-colors">
                            {card.headline}
                          </h3>

                          {/* Previous vs Current Comparison Strip */}
                          <div className="rounded-2xl bg-tile/60 p-3 border border-border/40 space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Previous Run</span>
                              <span className="font-medium text-foreground">{card.previous}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Current status</span>
                              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                {card.current}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Footer: Time Badge, Delta & Direct Click to Details */}
                        <div className="mt-3.5 pt-3 border-t border-border/40 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="shrink-0 rounded-full bg-tile px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground border border-border/50">
                              {card.timeLabel}
                            </span>
                            <span className="inline-block rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 px-2.5 py-0.5 text-[11px] font-medium">
                              {card.delta}
                            </span>
                          </div>
                          <span className="inline-flex items-center gap-1 font-medium text-brand-blue group-hover:underline shrink-0 ml-2">
                            View details
                            <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>

              {filteredCards.length === 0 && (
                <div className="py-12 text-center rounded-3xl bg-surface border border-border p-6 text-sm text-muted-foreground">
                  No automated results match the selected time range ({timeFilter}).
                </div>
              )}
            </div>
          )}


        </main>
      </div>

      {/* Modern Add Case Modal */}
      {isAddCaseOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsAddCaseOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-surface p-6 sm:p-7 shadow-2xl border border-border/80 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header without icon and description paragraph */}
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <h3 className="text-lg font-semibold text-foreground">Create New Case</h3>
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
                  rows={3}
                  value={caseDescription}
                  onChange={(e) => setCaseDescription(e.target.value)}
                  placeholder="Add context on departments, expected metrics, or historical baseline periods..."
                  className="w-full rounded-2xl border border-border/80 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-foreground outline-none focus:border-foreground focus:ring-1 focus:ring-foreground/20 transition resize-none placeholder:text-muted-foreground shadow-2xs"
                />
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
                    className="w-full rounded-2xl border border-border/80 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-foreground outline-none focus:border-foreground focus:ring-1 focus:ring-foreground/20 transition shadow-2xs cursor-pointer appearance-none pr-10"
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
                  className="inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-2.5 text-sm font-medium text-surface shadow-xs hover:opacity-90 transition cursor-pointer"
                >
                  <Sparkles className="size-4" />
                  Start AI Discovery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Navigation Drawer with Files & Add File capability */}
      <MainMenuDrawer
        isOpen={isMainMenuOpen}
        onClose={() => setIsMainMenuOpen(false)}
      />
    </div>
  );
}

function Chip({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition cursor-pointer ${active
        ? "border-transparent bg-chip-active text-chip-active-foreground font-medium shadow-xs"
        : "border-border bg-surface text-foreground hover:bg-tile"
        }`}
    >
      <Icon className="size-4" />
      {label}
    </button>
  );
}

function Panel({ children, className = "p-5 sm:p-6" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-3xl bg-surface ${className}`}>{children}</section>
  );
}
