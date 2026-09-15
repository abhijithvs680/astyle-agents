import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Home,
  Briefcase,
  Server,
  Compass,
  FolderKanban,
  FileText,
  TrendingDown,
  TrendingUp,
  Plus,
  Search,
  Check,
  X,
  ChevronDown,
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
  { icon: Home, label: "Home", to: "/" },
  { icon: Briefcase, label: "Cases", to: "/cases" },
  { icon: Compass, label: "Explore", to: "/explore", active: true },
  { icon: FolderKanban, label: "Folders", to: "/folders" },
  { icon: FileText, label: "Files", to: "/files" },
  { icon: Server, label: "Data Center", to: "/data-center" },
];

interface ExploreCase {
  up: boolean;
  tint: string;
  hoverGradient: string;
  iconTint: string;
  title: string;
  titleWeight: string;
  body: string;
  bodyColor: string;
}

// Exactly same data structure and colors as Explore Insights section in home page
const exploreCases: ExploreCase[] = [
  {
    up: true,
    tint: "bg-gradient-to-br from-[#e8fbee] via-[#d8f6de] to-[#c2eed0]",
    hoverGradient: "bg-gradient-to-br from-[#d4f6dc] via-[#bbf0c8] to-[#9ee5b0]",
    iconTint: "bg-[#107f47]",
    title: "3 Cross-sell opportunity identified",
    titleWeight: "font-medium",
    body: "Prescription attach rate analysis identified high-conversion ancillary lab and wellness packages.",
    bodyColor: "text-[#3b5e48]",
  },
  {
    up: false,
    tint: "bg-gradient-to-br from-[#faecfd] via-[#f4dbf8] to-[#e8c7f2]",
    hoverGradient: "bg-gradient-to-br from-[#f6ddfc] via-[#eebeef] to-[#e3a4e4]",
    iconTint: "bg-[#dc2626]",
    title: "OP cancellations increased by 18%",
    titleWeight: "font-medium",
    body: "A sudden rise in appointment cancellations was detected in selected departments.",
    bodyColor: "text-[#694a74]",
  },
  {
    up: false,
    tint: "bg-gradient-to-br from-[#eaf4fe] via-[#d8ecfe] to-[#bfdffa]",
    hoverGradient: "bg-gradient-to-br from-[#d7ebfd] via-[#bfdefc] to-[#9ecbf9]",
    iconTint: "bg-[#dc2626]",
    title: "Complaint volume increased by 16%",
    titleWeight: "font-semibold",
    body: "Patient complaints grew across front-desk and billing touchpoints this quarter.",
    bodyColor: "text-[#3f617f]",
  },
  {
    up: true,
    tint: "bg-gradient-to-br from-[#e8fbee] via-[#d8f6de] to-[#c2eed0]",
    hoverGradient: "bg-gradient-to-br from-[#d4f6dc] via-[#bbf0c8] to-[#9ee5b0]",
    iconTint: "bg-[#107f47]",
    title: "2 Discount leakage identified",
    titleWeight: "font-medium",
    body: "Unapproved concession overrides and compounding pharmacy discounts exceeded departmental margin thresholds.",
    bodyColor: "text-[#3b5e48]",
  },
  {
    up: false,
    tint: "bg-gradient-to-br from-[#fff0e2] via-[#fedfc3] to-[#fbcfa8]",
    hoverGradient: "bg-gradient-to-br from-[#ffe4cc] via-[#fecda4] to-[#fdb57d]",
    iconTint: "bg-[#dc2626]",
    title: "4 lab revenue anomalies found",
    titleWeight: "font-medium",
    body: "Differences were detected between ordered, completed, and billed laboratory services.",
    bodyColor: "text-[#7a5840]",
  },
  {
    up: false,
    tint: "bg-gradient-to-br from-[#faecfd] via-[#f4dbf8] to-[#e8c7f2]",
    hoverGradient: "bg-gradient-to-br from-[#f6ddfc] via-[#eebeef] to-[#e3a4e4]",
    iconTint: "bg-[#dc2626]",
    title: "Operating Room turnover delay by 18%",
    titleWeight: "font-medium",
    body: "Morning surgical suites experienced idle intervals between cases due to delayed sterilization and post-op transport.",
    bodyColor: "text-[#694a74]",
  },
  {
    up: true,
    tint: "bg-gradient-to-br from-[#e8fbee] via-[#d8f6de] to-[#c2eed0]",
    hoverGradient: "bg-gradient-to-br from-[#d4f6dc] via-[#bbf0c8] to-[#9ee5b0]",
    iconTint: "bg-[#107f47]",
    title: "Pharmacy low sales share despite moderate stock",
    titleWeight: "font-medium",
    body: "High-value surgical dressings and vitamins maintain full inventory buffers but convert to less than 1% of outpatient basket share.",
    bodyColor: "text-[#3b5e48]",
  },
  {
    up: false,
    tint: "bg-gradient-to-br from-[#fff0e2] via-[#fedfc3] to-[#fbcfa8]",
    hoverGradient: "bg-gradient-to-br from-[#ffe4cc] via-[#fecda4] to-[#fdb57d]",
    iconTint: "bg-[#dc2626]",
    title: "Inpatient discharge turnaround lag",
    titleWeight: "font-medium",
    body: "Average inpatient discharge summary turnaround lengthened from 2.1 to 4.8 days, slowing bed reallocation in trauma wards.",
    bodyColor: "text-[#7a5840]",
  },
];

function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [casePrompt, setCasePrompt] = useState("");
  const [caseDescription, setCaseDescription] = useState("");
  const [caseExpiryDate, setCaseExpiryDate] = useState("Until I stop");
  const [createdNotification, setCreatedNotification] = useState<string | null>(null);

  const filteredInsights = exploreCases.filter((item) => {
    return (
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.body.toLowerCase().includes(searchQuery.toLowerCase())
    );
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
    setCaseExpiryDate("Until I stop");
  };

  return (
    <div className="min-h-screen bg-surface-tint font-sans text-foreground">
      {/* Header (Fixed on scroll) */}
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

        {/* Profile on right */}
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
        {/* Navigation Rail (Fixed while scrolling) */}
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
        <main className="flex-1 px-4 pt-4 pb-12 sm:px-6 sm:pt-6 space-y-6">
          {/* Notification banner */}
          {createdNotification && (
            <div className="rounded-2xl bg-emerald-600 text-white text-xs sm:text-sm py-2 px-4 flex items-center justify-between shadow-xs animate-in fade-in">
              <span className="flex items-center gap-2">
                <Check className="size-4" />
                {createdNotification}
              </span>
              <button
                onClick={() => setCreatedNotification(null)}
                className="text-white/80 hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>
          )}

          {/* Top Header matching home page style */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/60 pb-4">
            <div>
              <h1 className="text-2xl sm:text-[22px] font-semibold text-foreground">
                Explore Insights
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Search bar */}
              <div className="relative w-48 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search insights..."
                  className="w-full rounded-xl border border-border/80 bg-surface pl-9 pr-3 py-2 text-xs text-foreground outline-none focus:border-foreground transition placeholder:text-muted-foreground shadow-2xs"
                />
              </div>

              {/* Quick Action: New Case */}
              <button
                onClick={() => {
                  setCasePrompt("");
                  setCaseDescription("");
                  setIsCreateOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-surface shadow-xs hover:opacity-90 transition cursor-pointer"
              >
                <Plus className="size-4" />
                Add Case
              </button>
            </div>
          </div>

          {/* Grid of Explore Insights Cards (Same structure and data as home page) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredInsights.map((c) => (
              <div
                key={c.title}
                onClick={() => handleOpenCreateForInsight(c.title, c.body)}
                role="button"
                tabIndex={0}
                className={`group relative overflow-hidden flex flex-col justify-between rounded-2xl sm:rounded-[22px] p-3.5 sm:p-4 cursor-pointer ${c.tint}`}
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

          {filteredInsights.length === 0 && (
            <div className="rounded-3xl bg-surface border border-border/80 p-12 text-center space-y-3">
              <Compass className="size-10 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-semibold text-foreground">No insights found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                No insights match your query "{searchQuery}".
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Modern Create Case Modal */}
      {isCreateOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsCreateOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-surface p-6 sm:p-7 shadow-2xl border border-border/80 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <h3 className="text-lg font-semibold text-foreground">Create New Case</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
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
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground hover:bg-tile transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-foreground px-5 py-2.5 text-sm font-medium text-surface hover:opacity-90 transition cursor-pointer shadow-xs"
                >
                  Start AI Discovery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
