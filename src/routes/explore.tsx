import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Menu,
  Home,
  Server,
  Compass,
  FolderKanban,
  FileText,
  TrendingDown,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  Plus,
  Search,
  Check,
  X,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore Insights — CXO Platform" },
      {
        name: "description",
        content: "Explore newly detected anomalies, clinical findings, and growth insights.",
      },
    ],
  }),
  component: ExplorePage,
});

const railIcons = [
  { icon: Server, label: "Data Center", to: "/data-center" },
  { icon: Home, label: "Home", to: "/" },
  { icon: Compass, label: "Explore", to: "/explore", active: true },
  { icon: FolderKanban, label: "Folders", to: "/folders" },
  { icon: FileText, label: "Reports", to: "/details" },
];

interface ExploreInsight {
  id: string;
  category: "Clinical" | "Operational" | "Financial" | "Utilization";
  up: boolean;
  tint: string;
  iconTint: string;
  title: string;
  body: string;
  metric: string;
  tag: string;
}

const exploreInsightsList: ExploreInsight[] = [
  {
    id: "exp-1",
    category: "Clinical",
    up: true,
    tint: "bg-[#d8f6de]",
    iconTint: "bg-[#107f47]",
    title: "Patient volume dropped by 14%",
    body: "A significant decline in outpatient visits was detected compared with the previous period across trauma and general medicine.",
    metric: "-14% vs last cycle",
    tag: "High Priority",
  },
  {
    id: "exp-2",
    category: "Operational",
    up: false,
    tint: "bg-[#f4dbf8]",
    iconTint: "bg-[#dc2626]",
    title: "OP cancellations increased by 18%",
    body: "A sudden rise in appointment cancellations was detected in cardiology and outpatient surgical consults due to notification delays.",
    metric: "+18% cancellation rate",
    tag: "Operational Lag",
  },
  {
    id: "exp-3",
    category: "Clinical",
    up: false,
    tint: "bg-[#d8ecfe]",
    iconTint: "bg-[#dc2626]",
    title: "Complaint volume increased by 16%",
    body: "Patient complaints grew across front-desk registration and insurance billing touchpoints this quarter.",
    metric: "+16% complaints",
    tag: "Patient Experience",
  },
  {
    id: "exp-4",
    category: "Utilization",
    up: true,
    tint: "bg-[#d8f6de]",
    iconTint: "bg-[#107f47]",
    title: "7 doctors show low utilization",
    body: "Consultation room capacity is significantly underused for selected senior specialists in elective clinics.",
    metric: "32% idle clinic slots",
    tag: "Roster Audit",
  },
  {
    id: "exp-5",
    category: "Financial",
    up: false,
    tint: "bg-[#fedfc3]",
    iconTint: "bg-[#dc2626]",
    title: "4 lab revenue anomalies found",
    body: "Differences were detected between ordered, completed, and billed laboratory services for specialized molecular panels.",
    metric: "€42,000 unbilled delta",
    tag: "Revenue Leak",
  },
  {
    id: "exp-6",
    category: "Financial",
    up: true,
    tint: "bg-[#d8f6de]",
    iconTint: "bg-[#107f47]",
    title: "Pharmacy low sales share despite moderate stock",
    body: "High-value surgical dressings and vitamins maintain full inventory buffers but convert to less than 1% of outpatient basket share.",
    metric: "+€18,400 potential margin",
    tag: "Inventory Opportunity",
  },
  {
    id: "exp-7",
    category: "Operational",
    up: false,
    tint: "bg-[#f4dbf8]",
    iconTint: "bg-[#dc2626]",
    title: "Operating Room turnover delay by 18%",
    body: "Morning surgical suites experienced idle intervals between cases due to delayed sterilization and post-op transport.",
    metric: "+14 mins lag / room",
    tag: "OR Scheduling",
  },
  {
    id: "exp-8",
    category: "Clinical",
    up: false,
    tint: "bg-[#fedfc3]",
    iconTint: "bg-[#dc2626]",
    title: "Inpatient discharge summary turnaround lag",
    body: "Average inpatient discharge summary turnaround lengthened from 2.1 to 4.8 days, slowing bed reallocation in trauma wards.",
    metric: "4.8 days turnaround",
    tag: "Bed Flow",
  },
];

function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [casePrompt, setCasePrompt] = useState("");
  const [caseDescription, setCaseDescription] = useState("");
  const [createdNotification, setCreatedNotification] = useState<string | null>(null);

  const categories = ["All", "Clinical", "Operational", "Financial", "Utilization"];

  const filteredInsights = exploreInsightsList.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenCreateForInsight = (insightTitle: string, insightBody: string) => {
    setCasePrompt(insightTitle);
    setCaseDescription(insightBody);
    setIsCreateOpen(true);
  };

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!casePrompt.trim()) return;
    setCreatedNotification(`Case created: "${casePrompt}"`);
    setTimeout(() => setCreatedNotification(null), 3000);
    setIsCreateOpen(false);
    setCasePrompt("");
    setCaseDescription("");
  };

  return (
    <div className="min-h-screen bg-surface-tint font-sans text-foreground">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <button className="rounded-full p-2 hover:bg-tile" aria-label="Main menu">
            <Menu className="size-6 text-muted-foreground" />
          </button>
          <Link to="/" className="text-xl sm:text-[22px] font-semibold text-foreground">
            CXO
          </Link>
        </div>

        {/* Profile on right */}
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
        {/* Navigation Rail */}
        <nav className="hidden w-[72px] shrink-0 flex-col items-center gap-2 pt-2 md:flex">
          {railIcons.map(({ icon: Icon, label, to, active }) => (
            <Link
              key={label}
              to={to}
              aria-label={label}
              title={label}
              className={`grid size-12 place-items-center rounded-full transition-colors ${active
                  ? "bg-chip-active text-chip-active-foreground"
                  : "text-muted-foreground hover:bg-tile"
                }`}
            >
              <Icon className="size-5" />
            </Link>
          ))}
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 px-4 py-3 sm:px-6 space-y-6">
          {/* Notification banner */}
          {createdNotification && (
            <div className="rounded-2xl bg-emerald-600 text-white text-xs sm:text-sm py-2 px-4 flex items-center justify-between shadow-xs animate-in fade-in">
              <span className="flex items-center gap-2">
                <Check className="size-4" />
                {createdNotification}
              </span>
              <button onClick={() => setCreatedNotification(null)} className="text-white/80 hover:text-white">
                <X className="size-4" />
              </button>
            </div>
          )}

          {/* Top Header & Breadcrumb */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Link to="/" className="hover:text-foreground transition flex items-center gap-1">
                  <ArrowLeft className="size-3.5" />
                  Home
                </Link>
                <span>/</span>
                <span className="text-foreground font-medium">Explore Insights</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Explore Insights
              </h1>
              <p className="text-sm text-muted-foreground">
                Discover detected anomalies, operational drifts, and cross-departmental findings.
              </p>
            </div>

            {/* Quick Action: New Case */}
            <button
              onClick={() => {
                setCasePrompt("");
                setCaseDescription("");
                setIsCreateOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-surface shadow-xs hover:opacity-90 transition cursor-pointer"
            >
              <Plus className="size-4" />
              Create Case
            </button>
          </div>

          {/* Filter Bar: Categories + Search */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-surface p-3 border border-border/80">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => {
                const count =
                  cat === "All"
                    ? exploreInsightsList.length
                    : exploreInsightsList.filter((i) => i.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-medium transition cursor-pointer ${selectedCategory === cat
                        ? "bg-chip-active text-chip-active-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-tile"
                      }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search insights..."
                className="w-full rounded-xl border border-border/70 bg-tile/40 pl-9 pr-3 py-1.5 text-xs text-foreground outline-none focus:border-brand-blue transition placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Full Grid of Explore Insights Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredInsights.map((c) => (
              <div
                key={c.id}
                className={`flex flex-col justify-between rounded-3xl p-6 transition-all duration-200 hover:shadow-md ${c.tint}`}
              >
                <div className="space-y-4">
                  {/* Card Top: Trending Icon & Category */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`grid size-9 place-items-center rounded-xl text-white shadow-2xs ${c.iconTint}`}
                    >
                      {c.up ? <TrendingDown className="size-4" /> : <TrendingUp className="size-4" />}
                    </span>
                    <span className="rounded-full bg-white/70 dark:bg-black/30 border border-black/5 px-2.5 py-0.5 text-[11px] font-medium text-slate-800 dark:text-slate-200">
                      {c.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-medium tracking-tight text-slate-900 leading-snug">
                    {c.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm leading-relaxed text-slate-700/90 font-normal">
                    {c.body}
                  </p>

                  {/* Metric delta */}
                  <div className="inline-block rounded-xl bg-white/60 dark:bg-black/20 px-3 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {c.metric}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="mt-6 pt-4 border-t border-black/10 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenCreateForInsight(c.title, c.body)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90 px-3.5 py-1.5 text-xs font-medium text-slate-900 dark:text-slate-100 hover:bg-white transition cursor-pointer shadow-xs"
                  >
                    <Plus className="size-3.5" />
                    Create Case
                  </button>

                  <Link
                    to="/details"
                    className="inline-flex items-center gap-1 text-xs font-medium text-slate-800 dark:text-slate-200 hover:text-brand-blue transition cursor-pointer"
                  >
                    Details
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredInsights.length === 0 && (
            <div className="rounded-3xl bg-surface border border-border/80 p-12 text-center space-y-3">
              <Compass className="size-10 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-semibold text-foreground">No insights found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                No insights match your query "{searchQuery}". Try searching for another department or keyword.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* CREATE CASE MODAL */}
      {isCreateOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsCreateOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-surface p-6 sm:p-7 shadow-2xl border border-border/80 animate-in zoom-in-95 duration-200 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="text-lg font-semibold text-foreground">
                Create New Investigation Case
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="rounded-full p-1 text-muted-foreground hover:text-foreground hover:bg-tile transition cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  What should AI find?
                </label>
                <input
                  type="text"
                  required
                  value={casePrompt}
                  onChange={(e) => setCasePrompt(e.target.value)}
                  placeholder="e.g. Audit pharmacy dispensation discrepancies"
                  className="w-full rounded-xl border border-border/80 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20 transition placeholder:text-muted-foreground shadow-2xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Description (optional)
                </label>
                <textarea
                  rows={3}
                  value={caseDescription}
                  onChange={(e) => setCaseDescription(e.target.value)}
                  placeholder="Additional context or departments to inspect..."
                  className="w-full rounded-xl border border-border/80 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20 transition placeholder:text-muted-foreground shadow-2xs resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-tile transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-foreground px-5 py-2 text-xs font-medium text-surface shadow-xs hover:opacity-90 transition cursor-pointer"
                >
                  Initialize Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
