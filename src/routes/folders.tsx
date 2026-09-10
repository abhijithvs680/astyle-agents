import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Menu,
  Home,
  Server,
  Compass,
  FolderKanban,
  FileText,
  Folder,
  FolderPlus,
  Plus,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  Clock,
  Briefcase,
  Layers,
  Sparkles,
  Pill,
  Receipt,
  FileSpreadsheet,
} from "lucide-react";

export const Route = createFileRoute("/folders")({
  head: () => ({
    meta: [
      { title: "Organize Cases in Folders — CXO Platform" },
      {
        name: "description",
        content: "Organize and manage clinical and operational cases by departmental folders.",
      },
    ],
  }),
  component: FoldersPage,
});

const railIcons = [
  { icon: Server, label: "Data Center", to: "/data-center" },
  { icon: Home, label: "Home", to: "/" },
  { icon: Compass, label: "Explore", to: "/explore" },
  { icon: FolderKanban, label: "Folders", to: "/folders", active: true },
  { icon: FileText, label: "Reports", to: "/details" },
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
  color: string;
  bgColor: string;
  icon: "pharmacy" | "billing" | "general";
  cases: CaseItem[];
}

const initialFolders: CaseFolder[] = [
  {
    id: "folder-pharmacy",
    name: "Pharmacy",
    department: "Clinical Pharmacy & Supply Chain",
    description: "Inventory conversion audits, SKU pricing deltas, and outpatient medicine basket analysis.",
    color: "text-emerald-700 dark:text-emerald-300",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60",
    icon: "pharmacy",
    cases: [
      {
        id: "case-p1",
        title: "Low sales share despite moderate stock",
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
    id: "folder-billing",
    name: "Billing",
    department: "Revenue Cycle & Accounts Reconciliation",
    description: "Insurance clearinghouse reconciliation, unbilled diagnostics, and pre-authorization cycle times.",
    color: "text-blue-700 dark:text-blue-300",
    bgColor: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/60",
    icon: "billing",
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
    ],
  },
];

function FoldersPage() {
  const [folders, setFolders] = useState<CaseFolder[]>(initialFolders);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    "folder-pharmacy": true,
    "folder-billing": true,
  });

  // Modal state for Create New Folder
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [folderDepartment, setFolderDepartment] = useState("");
  const [folderDescription, setFolderDescription] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    const newFolder: CaseFolder = {
      id: `folder-${Date.now()}`,
      name: folderName.trim(),
      department: folderDepartment.trim() || "General Operations",
      description:
        folderDescription.trim() ||
        "Custom departmental collection for managing linked clinical investigations.",
      color: "text-purple-700 dark:text-purple-300",
      bgColor: "bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/60",
      icon: "general",
      cases: [],
    };

    setFolders((prev) => [...prev, newFolder]);
    setExpandedFolders((prev) => ({ ...prev, [newFolder.id]: true }));
    setFolderName("");
    setFolderDepartment("");
    setFolderDescription("");
    setIsNewFolderOpen(false);

    setNotification(`Folder "${newFolder.name}" created successfully.`);
    setTimeout(() => setNotification(null), 3000);
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
              className={`grid size-12 place-items-center rounded-full transition-colors ${
                active
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
          {notification && (
            <div className="rounded-2xl bg-emerald-600 text-white text-xs sm:text-sm py-2 px-4 flex items-center justify-between shadow-xs animate-in fade-in">
              <span className="flex items-center gap-2">
                <Check className="size-4" />
                {notification}
              </span>
              <button onClick={() => setNotification(null)} className="text-white/80 hover:text-white">
                <X className="size-4" />
              </button>
            </div>
          )}

          {/* Page Title & Create New Folder Action */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Link to="/" className="hover:text-foreground transition flex items-center gap-1">
                  <ArrowLeft className="size-3.5" />
                  Home
                </Link>
                <span>/</span>
                <span className="text-foreground font-medium">Folders</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Organize Cases in Folders
              </h1>
              <p className="text-sm text-muted-foreground">
                Group active cases and investigations by clinical department or workflow.
              </p>
            </div>

            {/* Create New Folder Button */}
            <button
              onClick={() => setIsNewFolderOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-surface shadow-xs hover:opacity-90 transition cursor-pointer"
            >
              <FolderPlus className="size-4" />
              Create New Folder
            </button>
          </div>

          {/* Folders List: Pharmacy, Billing, and User-Created Folders */}
          <div className="space-y-5">
            {folders.map((folder) => {
              const isExpanded = !!expandedFolders[folder.id];

              return (
                <div
                  key={folder.id}
                  className="rounded-3xl bg-surface border border-border/80 overflow-hidden shadow-xs transition-all duration-200"
                >
                  {/* Folder Header Row */}
                  <div
                    onClick={() => toggleFolder(folder.id)}
                    className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6 cursor-pointer hover:bg-tile/50 transition"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`grid size-12 shrink-0 place-items-center rounded-2xl border ${folder.bgColor}`}>
                        {folder.icon === "pharmacy" ? (
                          <Pill className={`size-6 ${folder.color}`} />
                        ) : folder.icon === "billing" ? (
                          <Receipt className={`size-6 ${folder.color}`} />
                        ) : (
                          <Folder className={`size-6 ${folder.color}`} />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2.5">
                          <h2 className="text-xl font-semibold text-foreground truncate">
                            {folder.name}
                          </h2>
                          <span className="rounded-full bg-tile border border-border/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                            {folder.cases.length} {folder.cases.length === 1 ? "case" : "cases"}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">
                          {folder.department}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground hidden sm:block">
                        {isExpanded ? "Click to collapse" : "Click to view cases"}
                      </span>
                      <div className="grid size-8 place-items-center rounded-full bg-tile text-muted-foreground">
                        {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Folder Cases Accordion Body */}
                  {isExpanded && (
                    <div className="border-t border-border/60 bg-tile/20 p-5 sm:p-6 space-y-4 animate-in fade-in duration-150">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {folder.description}
                      </p>

                      {folder.cases.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {folder.cases.map((c) => (
                            <div
                              key={c.id}
                              className="rounded-2xl bg-surface border border-border/80 p-4.5 shadow-2xs flex flex-col justify-between space-y-3 hover:border-foreground/30 transition"
                            >
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1.5">
                                    <Clock className="size-3" />
                                    {c.age}
                                  </span>
                                  {c.severity && (
                                    <span
                                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                        c.severity === "High"
                                          ? "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                                          : c.severity === "Medium"
                                          ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                                          : "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                                      }`}
                                    >
                                      {c.severity}
                                    </span>
                                  )}
                                </div>
                                <h3 className="text-sm font-semibold text-foreground leading-snug">
                                  {c.title}
                                </h3>
                              </div>

                              <Link
                                to="/details"
                                className="inline-flex items-center gap-1 text-xs font-medium text-brand-blue hover:underline pt-2 border-t border-border/40"
                              >
                                View Case Details
                                <ArrowRight className="size-3.5" />
                              </Link>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-2xl bg-surface border border-dashed border-border/80 p-6 text-center space-y-2">
                          <Folder className="size-8 text-muted-foreground mx-auto" />
                          <p className="text-sm font-medium text-foreground">No cases in this folder yet</p>
                          <p className="text-xs text-muted-foreground">
                            Move active cases or create a new investigation into this folder.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>

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
                  Folder Name
                </label>
                <input
                  type="text"
                  required
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="e.g. Cardiology & Vascular"
                  className="w-full rounded-xl border border-border/80 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20 transition placeholder:text-muted-foreground shadow-2xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Department / Unit
                </label>
                <input
                  type="text"
                  value={folderDepartment}
                  onChange={(e) => setFolderDepartment(e.target.value)}
                  placeholder="e.g. Inpatient Operations & Diagnostics"
                  className="w-full rounded-xl border border-border/80 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20 transition placeholder:text-muted-foreground shadow-2xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Description (optional)
                </label>
                <textarea
                  rows={3}
                  value={folderDescription}
                  onChange={(e) => setFolderDescription(e.target.value)}
                  placeholder="What types of investigations belong in this folder..."
                  className="w-full rounded-xl border border-border/80 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20 transition placeholder:text-muted-foreground shadow-2xs resize-none"
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
