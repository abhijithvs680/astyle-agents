import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Menu,
  Home,
  Briefcase,
  Compass,
  FolderKanban,
  Server,
  Sparkles,
  Archive,
  RotateCcw,
  Search,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/cases")({
  head: () => ({
    meta: [
      { title: "All Cases — Clinical Analytics & Insights" },
      {
        name: "description",
        content:
          "Compact tabular case registry showing active and archived clinical cases with detected insights.",
      },
    ],
  }),
  component: CasesPage,
});

const railIcons = [
  { icon: Home, label: "Home", to: "/" },
  { icon: Briefcase, label: "Cases", to: "/cases", active: true },
  { icon: Compass, label: "Explore", to: "/explore" },
  { icon: FolderKanban, label: "Folders", to: "/folders" },
  { icon: Server, label: "Data Center", to: "/data-center" },
];

export interface CaseRow {
  id: string;
  title: string;
  department: string;
  timestamp: string;
  status: "Active" | "In Progress" | "In Review" | "Live" | "Archived";
  impactMetric: string;
  impactPositive: boolean;
  newInsightsCount: number;
  severity: "High" | "Medium" | "Low";
  archived: boolean;
}

const initialCases: CaseRow[] = [
  {
    id: "case-1",
    title: "Q3 Revenue Drop & Margin Compression Analysis",
    department: "Executive Office",
    timestamp: "04 Sept 2026, 05:57 am",
    status: "In Progress",
    impactMetric: "-11.4% MoM Revenue",
    impactPositive: false,
    newInsightsCount: 4,
    severity: "High",
    archived: false,
  },
  {
    id: "case-2",
    title: "Patient volume dropped by 14%",
    department: "Outpatient Surgery",
    timestamp: "02 Sept 2026, 11:20 am",
    status: "In Review",
    impactMetric: "↓ 14% inflow drop",
    impactPositive: false,
    newInsightsCount: 3,
    severity: "High",
    archived: false,
  },
  {
    id: "case-3",
    title: "OP cancellations increased by 18%",
    department: "Cardiology Clinics",
    timestamp: "28 Aug 2026, 02:15 pm",
    status: "Active",
    impactMetric: "42 recovered slots",
    impactPositive: false,
    newInsightsCount: 2,
    severity: "Medium",
    archived: false,
  },
  {
    id: "case-4",
    title: "Laboratory claim reconciliation",
    department: "Revenue Cycle & Lab",
    timestamp: "24 Aug 2026, 09:30 am",
    status: "Active",
    impactMetric: "€38,000 unbilled gap",
    impactPositive: false,
    newInsightsCount: 4,
    severity: "High",
    archived: false,
  },
  {
    id: "case-5",
    title: "Overstocking of Medicines",
    department: "Pharmacy & Dispensary",
    timestamp: "2 hrs ago",
    status: "In Review",
    impactMetric: "$5,000 locked capital",
    impactPositive: false,
    newInsightsCount: 1,
    severity: "High",
    archived: false,
  },
  {
    id: "case-6",
    title: "Increasing Patient Wait Time",
    department: "Triage & Registration",
    timestamp: "2 hrs ago",
    status: "Live",
    impactMetric: "↓ 15 mins faster",
    impactPositive: true,
    newInsightsCount: 3,
    severity: "Medium",
    archived: false,
  },
  {
    id: "case-7",
    title: "Inpatient Bed Discharge Lag",
    department: "Inpatient Bed Flow",
    timestamp: "1 day ago",
    status: "Active",
    impactMetric: "↓ 1.8 days turnaround",
    impactPositive: true,
    newInsightsCount: 2,
    severity: "Medium",
    archived: false,
  },
  {
    id: "case-8",
    title: "7 doctors show low utilization",
    department: "Provider Rota Audit",
    timestamp: "2 days ago",
    status: "Active",
    impactMetric: "↑ 6.5% capacity lift",
    impactPositive: true,
    newInsightsCount: 1,
    severity: "Low",
    archived: false,
  },
  {
    id: "case-9",
    title: "Dispensary supplier lead-time variance",
    department: "Pharmacy Procurement",
    timestamp: "12 Aug 2026, 04:10 pm",
    status: "Archived",
    impactMetric: "+3.2 days buffer",
    impactPositive: false,
    newInsightsCount: 1,
    severity: "Low",
    archived: true,
  },
  {
    id: "case-10",
    title: "Q2 Telehealth service margin audit",
    department: "Virtual Care Operations",
    timestamp: "05 Aug 2026, 10:45 am",
    status: "Archived",
    impactMetric: "€12,500 parity balanced",
    impactPositive: true,
    newInsightsCount: 2,
    severity: "Low",
    archived: true,
  },
];

function CasesPage() {
  const [cases, setCases] = useState<CaseRow[]>(initialCases);
  const [activeTab, setActiveTab] = useState<"active" | "archived" | "all">("active");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCaseIds, setSelectedCaseIds] = useState<string[]>([]);
  const [lastActionNotice, setLastActionNotice] = useState<string | null>(null);

  // Counts for tabs
  const activeCount = cases.filter((c) => !c.archived).length;
  const archivedCount = cases.filter((c) => c.archived).length;
  const totalInsightsCount = cases
    .filter((c) => !c.archived)
    .reduce((acc, curr) => acc + curr.newInsightsCount, 0);

  // Filtered rows based on tab and search
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      // Tab filter
      if (activeTab === "active" && c.archived) return false;
      if (activeTab === "archived" && !c.archived) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = c.title.toLowerCase().includes(q);
        const matchId = c.id.toLowerCase().includes(q);
        if (!matchTitle && !matchId) return false;
      }

      return true;
    });
  }, [cases, activeTab, searchQuery]);

  const handleToggleArchive = (id: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const newArchived = !c.archived;
          const status = newArchived ? "Archived" : "Active";
          setLastActionNotice(
            newArchived
              ? `Case "${c.title}" moved to Archive.`
              : `Case "${c.title}" restored to Active cases.`
          );
          setTimeout(() => setLastActionNotice(null), 4000);
          return { ...c, archived: newArchived, status };
        }
        return c;
      })
    );
  };

  const handleSelectAll = () => {
    if (selectedCaseIds.length === filteredCases.length) {
      setSelectedCaseIds([]);
    } else {
      setSelectedCaseIds(filteredCases.map((c) => c.id));
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedCaseIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-surface-tint font-sans text-foreground">
      {/* Header with profile icon, name, and designation on right (Fixed on scroll) */}
      <header className="sticky top-0 z-40 h-16 bg-background/95 backdrop-blur-md border-b border-border/60 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button className="rounded-full p-2 hover:bg-tile" aria-label="Main menu">
            <Menu className="size-6 text-muted-foreground" />
          </button>
          <Link to="/" className="text-xl sm:text-[22px] font-semibold text-foreground">
            CXO
          </Link>
        </div>

        {/* Profile on right top end */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium leading-none text-foreground">Robert</p>
            <p className="text-xs text-muted-foreground mt-1">Chief Executive Officer</p>
          </div>
          <span className="grid size-9 place-items-center rounded-full bg-[oklch(0.68_0.15_55)] text-sm font-medium text-surface shadow-xs">
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
                className={`relative grid size-12 place-items-center rounded-full transition-all duration-200 cursor-pointer ${active
                    ? "bg-chip-active text-chip-active-foreground shadow-xs hover:scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-tile/90 hover:scale-110 hover:shadow-xs active:scale-95"
                  }`}
              >
                <Icon className="size-5 transition-transform duration-200 group-hover:scale-110" />
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
        <main className="min-w-0 flex-1 px-4 pt-6 pb-12 sm:px-8 sm:pt-8 max-w-7xl mx-auto space-y-6">
          {/* Page Title */}
          <div className="flex items-center gap-2">
            <Briefcase className="size-6 text-brand-blue" />
            <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-foreground">
              All Cases
            </h1>
          </div>

          {/* Toast / Notification for Archive & Restore */}
          {lastActionNotice && (
            <div className="flex items-center justify-between rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 p-3 text-xs text-blue-900 dark:text-blue-200 shadow-2xs animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-brand-blue" />
                <span>{lastActionNotice}</span>
              </div>
            </div>
          )}

          {/* Table Container Card */}
          <div className="rounded-3xl bg-surface border border-border/80 shadow-xs overflow-hidden">
            {/* Control Bar: Tabs, Search, Filter */}
            <div className="p-4 sm:p-5 border-b border-border/60 flex flex-wrap items-center justify-between gap-4">
              {/* Active vs Archived Tabs */}
              <div className="flex items-center gap-1.5 rounded-2xl bg-tile/70 p-1 border border-border/50">
                <button
                  onClick={() => setActiveTab("active")}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${activeTab === "active"
                      ? "bg-surface text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  Active Cases ({activeCount})
                </button>
                <button
                  onClick={() => setActiveTab("archived")}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${activeTab === "archived"
                      ? "bg-surface text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <Archive className="size-3.5 text-muted-foreground" />
                  Archived ({archivedCount})
                </button>
                <button
                  onClick={() => setActiveTab("all")}
                  className={`rounded-xl px-3 py-1.5 text-xs font-medium transition cursor-pointer ${activeTab === "all"
                      ? "bg-surface text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  All ({cases.length})
                </button>
              </div>

              {/* Search Filter */}
              <div className="flex flex-wrap items-center gap-2.5 flex-1 max-w-sm justify-end">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search cases..."
                    className="w-full rounded-xl border border-border/70 bg-tile/50 pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand-blue"
                  />
                </div>
              </div>
            </div>

            {/* Compact Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-border/60 bg-slate-50/70 dark:bg-zinc-800/50 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-3.5 w-12 text-center">
                      <input
                        type="checkbox"
                        checked={
                          filteredCases.length > 0 &&
                          selectedCaseIds.length === filteredCases.length
                        }
                        onChange={handleSelectAll}
                        className="rounded border-border text-brand-blue focus:ring-brand-blue cursor-pointer size-3.5"
                        aria-label="Select all cases"
                      />
                    </th>
                    <th className="px-6 py-3.5 w-full min-w-[380px]">Case Name</th>
                    <th className="px-6 py-3.5 whitespace-nowrap">Updated</th>
                    <th className="px-6 py-3.5 text-center whitespace-nowrap">Insights</th>
                    <th className="px-6 py-3.5 text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 text-foreground">
                  {filteredCases.map((row) => {
                    const isSelected = selectedCaseIds.includes(row.id);
                    const isLive = row.status === "Live";

                    return (
                      <tr
                        key={row.id}
                        className={`hover:bg-tile/70 transition-colors group ${isSelected ? "bg-brand-blue/5" : ""
                          }`}
                      >
                        {/* Checkbox */}
                        <td className="px-4 py-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(row.id)}
                            className="rounded border-border text-brand-blue focus:ring-brand-blue cursor-pointer size-3.5"
                            aria-label={`Select ${row.title}`}
                          />
                        </td>

                        {/* Case Name with Generous Width */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            {row.archived && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-zinc-700 px-2 py-0.5 text-[10px] font-medium shrink-0">
                                <Archive className="size-3" />
                                Archived
                              </span>
                            )}
                            {isLive && (
                              <span className="relative flex size-2 shrink-0">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                                <span className="relative inline-flex size-2 rounded-full bg-red-500" />
                              </span>
                            )}
                            <Link
                              to="/details"
                              className="text-sm sm:text-base font-semibold text-foreground group-hover:text-brand-blue transition-colors hover:underline"
                              title={row.title}
                            >
                              {row.title}
                            </Link>
                          </div>
                          <span className="text-[11px] text-muted-foreground font-mono block mt-1">
                            ID: {row.id.toUpperCase()}
                          </span>
                        </td>

                        {/* Timestamp */}
                        <td className="px-6 py-4 text-xs text-muted-foreground font-mono whitespace-nowrap">
                          {row.timestamp}
                        </td>

                        {/* In the table at the end: X new insights badge */}
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          <Link
                            to="/details"
                            className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 text-brand-blue dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/50 px-3 py-1 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/80 transition-colors shadow-2xs"
                            title={`${row.newInsightsCount} new insights detected by AI diagnostic engine`}
                          >
                            <Sparkles className="size-3.5 text-brand-blue dark:text-blue-300" />
                            <span>{row.newInsightsCount} new insights</span>
                          </Link>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-2">
                            <Link
                              to="/details"
                              className="rounded-lg border border-border/80 bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-tile hover:text-brand-blue transition shadow-2xs"
                            >
                              Details
                            </Link>

                            <button
                              onClick={() => handleToggleArchive(row.id)}
                              className="p-1.5 rounded-lg border border-border/60 hover:bg-tile text-muted-foreground hover:text-foreground transition cursor-pointer"
                              title={row.archived ? "Restore to Active" : "Archive Case"}
                              aria-label={row.archived ? "Restore Case" : "Archive Case"}
                            >
                              {row.archived ? (
                                <RotateCcw className="size-4 text-emerald-600" />
                              ) : (
                                <Archive className="size-4 text-muted-foreground hover:text-amber-600" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredCases.length === 0 && (
              <div className="py-12 text-center text-xs sm:text-sm text-muted-foreground">
                {activeTab === "archived"
                  ? "No archived cases found."
                  : "No cases match the selected filter or search query."}
              </div>
            )}

            {/* Table Footer */}
            <div className="px-4 py-3 bg-slate-50/50 dark:bg-zinc-800/30 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Showing <strong>{filteredCases.length}</strong> of <strong>{cases.length}</strong>{" "}
                cases
              </span>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium">
                  {selectedCaseIds.length > 0 && `${selectedCaseIds.length} selected • `}
                  Audit date: 2026-09-11
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
