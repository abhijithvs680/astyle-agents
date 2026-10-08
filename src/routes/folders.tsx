import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Home,
  Folder,
  FolderPlus,
  Plus,
  ArrowRight,
  MoreVertical,
  X,
  Check,
  CheckCircle2,
  Clock,
} from "lucide-react";

export const Route = createFileRoute("/folders")({
  head: () => ({
    meta: [
      { title: "Folders — CXO Platform" },
      {
        name: "description",
        content: "Organize and manage clinical and operational cases by departmental folders.",
      },
    ],
  }),
  component: FoldersPage,
});

const railIcons: { icon: typeof Home; label: string; to: string; active?: boolean }[] = [
  { icon: Home, label: "Home", to: "/ask-ai" },
];

interface CaseItem {
  id: string;
  title: string;
  age: string;
  severity?: "High" | "Medium" | "Low";
}

interface CaseFolder {
  id: string;
  name: string;
  department: string;
  description: string;
  tabBg: string;
  bodyBg: string;
  borderColor: string;
  iconBg: string;
  iconColor: string;
  cases: CaseItem[];
}

// Initial 3 folders matching the attached image colors and structure
const initialFolders: CaseFolder[] = [
  {
    id: "folder-task-automation",
    name: "Pharmacy",
    department: "Clinical Pharmacy & Dispensation Automation",
    description: "Automated inventory conversion audits, dispensation tracking, and algorithmic stock buffers.",
    tabBg: "bg-[#e2daf8] dark:bg-[#342852]",
    bodyBg: "bg-[#f4f0fd] dark:bg-[#201836]",
    borderColor: "border-[#d9cef7] dark:border-[#423467]",
    iconBg: "bg-[#e0d6f8] dark:bg-[#433568]",
    iconColor: "text-[#523799] dark:text-[#c4b5fd]",
    cases: [
      {
        id: "case-p1",
        title: "Q3 Revenue Drop & Margin Compression Analysis",
        age: "04 Sept 2026, 05:57 am",
        severity: "High",
      },
      {
        id: "case-p2",
        title: "Pharmacy Revenue Anomaly",
        age: "2 hrs ago",
        severity: "Medium",
      },
      {
        id: "case-p3",
        title: "Prescription fulfillment variance audit",
        age: "Yesterday",
        severity: "Low",
      },
    ],
  },
  {
    id: "folder-notes-highlights",
    name: "Insurance",
    department: "Cross-Departmental Clinical Insights",
    description: "Clinical outpatient consultation notes, triage trends, and physician capacity highlights.",
    tabBg: "bg-[#d8ecfb] dark:bg-[#1a3650]",
    bodyBg: "bg-[#edf6fd] dark:bg-[#122538]",
    borderColor: "border-[#c8e4fa] dark:border-[#27496a]",
    iconBg: "bg-[#cbe5fa] dark:bg-[#244b70]",
    iconColor: "text-[#1e6091] dark:text-[#93c5fd]",
    cases: [
      {
        id: "case-n1",
        title: "3 Cross-sell opportunity identified",
        age: "02 Sept 2026, 11:20 am",
        severity: "High",
      },
      {
        id: "case-n2",
        title: "2 Discount leakage identified",
        age: "Yesterday",
        severity: "Medium",
      },
      {
        id: "case-n3",
        title: "Increasing Patient Wait Time",
        age: "2 hrs ago",
        severity: "High",
      },
    ],
  },
  {
    id: "folder-billing-invoicing",
    name: "Billing & Invoicing",
    department: "Revenue Cycle Assurance & Claims Reconciliation",
    description: "Insurance clearinghouse reconciliation, diagnostic claims discrepancies, and billing recovery.",
    tabBg: "bg-[#fde5d2] dark:bg-[#482e18]",
    bodyBg: "bg-[#fef4ec] dark:bg-[#2e1d0f]",
    borderColor: "border-[#fad9be] dark:border-[#5c3b20]",
    iconBg: "bg-[#fad7bb] dark:bg-[#5c3b20]",
    iconColor: "text-[#a75a22] dark:text-[#fdba74]",
    cases: [
      {
        id: "case-b1",
        title: "Laboratory Claim Reconciliation",
        age: "4 hrs ago",
        severity: "High",
      },
      {
        id: "case-b2",
        title: "Insurance pre-authorization lag cycle",
        age: "3 days ago",
        severity: "Medium",
      },
      {
        id: "case-b3",
        title: "4 lab revenue anomalies found",
        age: "Yesterday",
        severity: "High",
      },
      {
        id: "case-b4",
        title: "Overstocking of Medicines",
        age: "2 hrs ago",
        severity: "Medium",
      },
      {
        id: "case-b5",
        title: "Unbilled diagnostic panels audit",
        age: "5 days ago",
        severity: "Low",
      },
    ],
  },
  {
    id: "folder-operations",
    name: "Operations",
    department: "Capacity & Scheduling Workflow",
    description: "Bed occupancy optimization, surgical theater turnaround, and discharge triage queue analytics.",
    tabBg: "bg-[#d5f2e3] dark:bg-[#1b3d2b]",
    bodyBg: "bg-[#edfbf4] dark:bg-[#132b1e]",
    borderColor: "border-[#c3ecd5] dark:border-[#26533c]",
    iconBg: "bg-[#c5eed7] dark:bg-[#26533c]",
    iconColor: "text-[#1b7a4b] dark:text-[#86efac]",
    cases: [
      {
        id: "case-op1",
        title: "Increasing Patient Wait Time",
        age: "2 hrs ago",
        severity: "High",
      },
      {
        id: "case-op2",
        title: "Surgical theater turnaround delays",
        age: "Yesterday",
        severity: "Medium",
      },
      {
        id: "case-op3",
        title: "ER triage admission bottleneck",
        age: "3 days ago",
        severity: "High",
      },
      {
        id: "case-op4",
        title: "ICU discharge clearance lag",
        age: "04 Sept 2026",
        severity: "Low",
      },
    ],
  },
];

const pastelThemes = [
  {
    tabBg: "bg-[#e2daf8] dark:bg-[#342852]",
    bodyBg: "bg-[#f4f0fd] dark:bg-[#201836]",
    borderColor: "border-[#d9cef7] dark:border-[#423467]",
    iconBg: "bg-[#e0d6f8] dark:bg-[#433568]",
    iconColor: "text-[#523799] dark:text-[#c4b5fd]",
  },
  {
    tabBg: "bg-[#d8ecfb] dark:bg-[#1a3650]",
    bodyBg: "bg-[#edf6fd] dark:bg-[#122538]",
    borderColor: "border-[#c8e4fa] dark:border-[#27496a]",
    iconBg: "bg-[#cbe5fa] dark:bg-[#244b70]",
    iconColor: "text-[#1e6091] dark:text-[#93c5fd]",
  },
  {
    tabBg: "bg-[#fde5d2] dark:bg-[#482e18]",
    bodyBg: "bg-[#fef4ec] dark:bg-[#2e1d0f]",
    borderColor: "border-[#fad9be] dark:border-[#5c3b20]",
    iconBg: "bg-[#fad7bb] dark:bg-[#5c3b20]",
    iconColor: "text-[#a75a22] dark:text-[#fdba74]",
  },
  {
    tabBg: "bg-[#d5f2e3] dark:bg-[#1b3d2b]",
    bodyBg: "bg-[#edfbf4] dark:bg-[#132b1e]",
    borderColor: "border-[#c3ecd5] dark:border-[#26533c]",
    iconBg: "bg-[#c5eed7] dark:bg-[#26533c]",
    iconColor: "text-[#1b7a4b] dark:text-[#86efac]",
  },
];

function FoldersPage() {
  const navigate = useNavigate();
  const [folders, setFolders] = useState<CaseFolder[]>(initialFolders);
  // Folder selected to display cases inside a modern popup
  const [selectedFolder, setSelectedFolder] = useState<CaseFolder | null>(null);

  // Modal state for Create New Folder
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [folderDepartment, setFolderDepartment] = useState("");
  const [folderDescription, setFolderDescription] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    const theme = pastelThemes[folders.length % pastelThemes.length]!;
    const newFolder: CaseFolder = {
      id: `folder-${Date.now()}`,
      name: folderName.trim(),
      department: folderDepartment.trim() || "General Clinical Operations",
      description:
        folderDescription.trim() ||
        "Organized folder collection for active investigations and operational drift cases.",
      ...theme,
      cases: [],
    };

    setFolders([...folders, newFolder]);
    setNotification(`Folder "${folderName.trim()}" created successfully`);
    setTimeout(() => setNotification(null), 3000);
    setFolderName("");
    setFolderDepartment("");
    setFolderDescription("");
    setIsNewFolderOpen(false);
  };

  return (
    <div className="min-h-screen bg-surface-tint font-sans text-foreground">
      {/* Header (Fixed on scroll) */}
      <header className="sticky top-0 z-40 h-16 bg-[#072333] border-b border-[#0f354c] flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link
            to="/ask-ai"
            search={{ history: undefined }}
            className="text-xl sm:text-[22px] font-semibold text-white hover:opacity-85 transition cursor-pointer"
            title="Ask AI"
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

        {/* Main Content Area */}
        <main className="min-w-0 flex-1 px-4 pt-6 pb-12 sm:px-8 sm:pt-8 w-full space-y-6">
          {/* Notification banner */}
          {notification && (
            <div className="flex items-center justify-between rounded-xl bg-blue-50/90 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/60 p-3 text-xs text-blue-900 dark:text-blue-200 shadow-2xs animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-brand-blue shrink-0" />
                <span className="font-medium">{notification}</span>
              </div>
              <button
                type="button"
                onClick={() => setNotification(null)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            </div>
          )}

          {/* Header Banner & Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-foreground">
                  Folders
                </h1>
                <span className="rounded-full bg-tile border border-border/60 px-3 py-0.5 text-xs font-semibold text-foreground">
                  {folders.length}
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                Organize and manage case investigations by departmental clusters.
              </p>
            </div>

            {/* Create New Folder Button */}
            <button
              type="button"
              onClick={() => setIsNewFolderOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-surface shadow-xs hover:opacity-90 transition cursor-pointer self-start sm:self-auto"
            >
              <FolderPlus className="size-4" />
              <span>New Folder</span>
            </button>
          </div>

          {/* Grid of Folder-shaped Cards: 4 folders in a row with reduced width */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 pt-2">
            {folders.map((folder) => (
              <div
                key={folder.id}
                onClick={() => setSelectedFolder(folder)}
                role="button"
                tabIndex={0}
                className="group relative pt-4 cursor-pointer transition-all duration-200 hover:-translate-y-1 active:scale-[0.98]"
              >
                {/* Back Tab of the File Folder */}
                <div
                  className={`absolute top-0 left-0 w-28 sm:w-32 h-7 rounded-t-xl border-t border-l border-r ${folder.tabBg} ${folder.borderColor} transition-colors`}
                />

                {/* Main Folder Front Body */}
                <div
                  className={`relative rounded-2xl rounded-tl-none border ${folder.borderColor} ${folder.bodyBg} p-4.5 sm:p-5 shadow-xs group-hover:shadow-md transition-all min-h-[168px] flex flex-col justify-between`}
                >
                  {/* Top Row: Folder Icon Badge & Three-dots Menu */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`grid size-8 place-items-center rounded-lg ${folder.iconBg} ${folder.iconColor} shadow-2xs`}
                    >
                      <Folder className="size-4" />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFolder(folder);
                      }}
                      className="grid size-7 place-items-center rounded-full bg-white/80 dark:bg-black/30 border border-black/5 text-muted-foreground hover:text-foreground transition cursor-pointer"
                      aria-label="Folder options"
                    >
                      <MoreVertical className="size-3.5" />
                    </button>
                  </div>

                  {/* Folder Name & Department */}
                  <div className="py-2">
                    <h3 className="text-lg font-semibold tracking-tight text-foreground leading-snug line-clamp-1">
                      {folder.name}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                      {folder.department}
                    </p>
                  </div>

                  {/* Bottom Row: Item Count (No profile icon as instructed) */}
                  <div className="pt-2.5 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs text-muted-foreground font-medium">
                    <span className="font-semibold text-foreground/80">
                      {folder.cases.length} {folder.cases.length === 1 ? "item" : "items"}
                    </span>
                    <span className="text-brand-blue group-hover:underline flex items-center gap-1 font-medium text-xs">
                      View cases
                      <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* POPUP MODAL: Cases Inside Folder */}
      {selectedFolder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedFolder(null)}
        >
          <div
            className="w-full max-w-2xl rounded-3xl bg-surface p-6 sm:p-8 shadow-2xl border border-border/80 animate-in zoom-in-95 duration-200 space-y-6 max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-border/60 pb-4">
              <div className="flex items-center gap-3.5">
                <div
                  className={`grid size-11 place-items-center rounded-2xl ${selectedFolder.iconBg} ${selectedFolder.iconColor}`}
                >
                  <Folder className="size-5.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                      {selectedFolder.name}
                    </h2>
                    <span className="rounded-full bg-tile border border-border/60 px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                      {selectedFolder.cases.length} {selectedFolder.cases.length === 1 ? "case" : "cases"}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    {selectedFolder.department}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedFolder(null)}
                className="rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-tile transition cursor-pointer"
                aria-label="Close"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Description */}
            {selectedFolder.description && (
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {selectedFolder.description}
              </p>
            )}

            {/* Cases Inside Folder List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {selectedFolder.cases.length > 0 ? (
                selectedFolder.cases.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => navigate({ to: "/details" })}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        navigate({ to: "/details" });
                      }
                    }}
                    className="rounded-2xl bg-tile/40 hover:bg-tile/70 border border-border/60 hover:border-border p-4 sm:p-5 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs cursor-pointer group"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="size-3" />
                          {c.age}
                        </span>
                        {c.severity && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${c.severity === "High"
                              ? "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                              : c.severity === "Medium"
                                ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                                : "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                              }`}
                          >
                            {c.severity} Priority
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm sm:text-base font-semibold text-foreground group-hover:text-brand-blue transition-colors leading-snug">
                        {c.title}
                      </h4>
                    </div>

                    <span
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-surface border border-border px-3.5 py-2 text-xs font-medium text-brand-blue hover:bg-tile transition shrink-0 shadow-2xs group-hover:border-brand-blue/30"
                    >
                      <span>View Details</span>
                      <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center rounded-2xl bg-tile/30 border border-dashed border-border/80 p-6 space-y-2">
                  <Folder className="size-8 text-muted-foreground mx-auto" />
                  <p className="text-sm font-medium text-foreground">No cases in this folder yet</p>
                  <p className="text-xs text-muted-foreground">
                    Add active cases or create a new investigation into this folder.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="pt-4 border-t border-border/40 flex items-center justify-between">
              <button
                onClick={() => {
                  const caseTitle = prompt("Enter new case title for " + selectedFolder.name);
                  if (caseTitle && caseTitle.trim()) {
                    const newCase: CaseItem = {
                      id: `case-${Date.now()}`,
                      title: caseTitle.trim(),
                      age: "Just now",
                      severity: "Medium",
                    };
                    setFolders((prev) =>
                      prev.map((f) =>
                        f.id === selectedFolder.id ? { ...f, cases: [newCase, ...f.cases] } : f
                      )
                    );
                    setSelectedFolder((prev) =>
                      prev ? { ...prev, cases: [newCase, ...prev.cases] } : null
                    );
                  }
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-medium text-foreground hover:bg-tile transition cursor-pointer"
              >
                <Plus className="size-3.5" />
                Add Case to Folder
              </button>

              <button
                onClick={() => setSelectedFolder(null)}
                className="rounded-xl bg-foreground px-5 py-2 text-xs font-medium text-surface hover:opacity-90 transition cursor-pointer shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW FOLDER MODAL */}
      {isNewFolderOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsNewFolderOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-surface p-6 sm:p-7 shadow-2xl border border-border/80 animate-in zoom-in-95 duration-200 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="text-lg font-semibold text-foreground">
                Create New Folder
              </h3>
              <button
                onClick={() => setIsNewFolderOpen(false)}
                className="rounded-full p-1 text-muted-foreground hover:text-foreground hover:bg-tile transition cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFolder} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Folder Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="e.g. Surgical Services, Trauma Triage..."
                  className="w-full rounded-xl border border-border/80 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-foreground focus:ring-1 focus:ring-foreground/20 transition placeholder:text-muted-foreground shadow-2xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Department
                </label>
                <input
                  type="text"
                  value={folderDepartment}
                  onChange={(e) => setFolderDepartment(e.target.value)}
                  placeholder="e.g. Surgery & Anesthesia"
                  className="w-full rounded-xl border border-border/80 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-foreground focus:ring-1 focus:ring-foreground/20 transition placeholder:text-muted-foreground shadow-2xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={folderDescription}
                  onChange={(e) => setFolderDescription(e.target.value)}
                  placeholder="Brief description of the cases to be grouped here..."
                  className="w-full rounded-xl border border-border/80 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-foreground focus:ring-1 focus:ring-foreground/20 transition placeholder:text-muted-foreground shadow-2xs resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewFolderOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-tile transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-foreground px-5 py-2 text-xs font-medium text-surface shadow-xs hover:opacity-90 transition cursor-pointer"
                >
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
