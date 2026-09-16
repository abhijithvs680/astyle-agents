import React, { useState, useRef, useEffect, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Home,
  Bot,
  FileText,
  Server,
  Sparkles,
  UploadCloud,
  Plus,
  Trash2,
  Download,
  Eye,
  Search,
  CheckCircle2,
  FileSpreadsheet,
  FileCode,
  FileCheck,
  ArrowUpDown,
  Filter,
  Check,
  X,
  Clock,
  HardDrive,
} from "lucide-react";

export const Route = createFileRoute("/files")({
  head: () => ({
    meta: [
      { title: "Files & Documents — CXO Platform" },
      {
        name: "description",
        content:
          "Manage, upload, and inspect supplemental workspace documents, audit records, and models.",
      },
    ],
  }),
  component: FilesPage,
});

export interface WorkspaceFile {
  id: string;
  name: string;
  size: string;
  sizeBytes?: number;
  uploadedAt: string;
  type: string;
  category: "spreadsheet" | "pdf" | "csv" | "data" | "document";
}

const INITIAL_WORKSPACE_FILES: WorkspaceFile[] = [
  {
    id: "f-1",
    name: "Q3_Revenue_Performance_Model.xlsx",
    size: "1.8 MB",
    sizeBytes: 1.8 * 1024 * 1024,
    uploadedAt: "Sep 12, 2026, 09:14 AM",
    type: "xlsx",
    category: "spreadsheet",
  },
  {
    id: "f-2",
    name: "Clinical_Scheduling_Logs_Aug26.csv",
    size: "840 KB",
    sizeBytes: 840 * 1024,
    uploadedAt: "Sep 13, 2026, 02:30 PM",
    type: "csv",
    category: "csv",
  },
  {
    id: "f-3",
    name: "Ambulatory_Care_Quality_Report.pdf",
    size: "3.2 MB",
    sizeBytes: 3.2 * 1024 * 1024,
    uploadedAt: "Sep 14, 2026, 11:45 AM",
    type: "pdf",
    category: "pdf",
  },
  {
    id: "f-4",
    name: "Pharmacy_Dead_Stock_Valuation.xlsx",
    size: "2.4 MB",
    sizeBytes: 2.4 * 1024 * 1024,
    uploadedAt: "Sep 14, 2026, 04:18 PM",
    type: "xlsx",
    category: "spreadsheet",
  },
  {
    id: "f-5",
    name: "Inpatient_Discharge_Turnaround_Audit.parquet",
    size: "4.1 MB",
    sizeBytes: 4.1 * 1024 * 1024,
    uploadedAt: "Sep 15, 2026, 08:20 AM",
    type: "parquet",
    category: "data",
  },
  {
    id: "f-6",
    name: "OP_Cancellation_Patterns_Analysis.pdf",
    size: "1.5 MB",
    sizeBytes: 1.5 * 1024 * 1024,
    uploadedAt: "Sep 15, 2026, 09:05 AM",
    type: "pdf",
    category: "pdf",
  },
];

const railIcons = [
  { icon: Home, label: "Home", to: "/" },
  { icon: Bot, label: "Agents", to: "/cases" },
  { icon: FileText, label: "Files", to: "/files", active: true },
  { icon: Server, label: "Data Center", to: "/data-center" },
];

function getCategoryFromFilename(filename: string): "spreadsheet" | "pdf" | "csv" | "data" | "document" {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  if (["xlsx", "xls"].includes(ext)) return "spreadsheet";
  if (["pdf"].includes(ext)) return "pdf";
  if (["csv"].includes(ext)) return "csv";
  if (["parquet", "json"].includes(ext)) return "data";
  return "document";
}

function getFileIcon(category: string) {
  switch (category) {
    case "spreadsheet":
      return { icon: FileSpreadsheet, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/50" };
    case "pdf":
      return { icon: FileText, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-950/50" };
    case "csv":
      return { icon: FileCode, color: "text-sky-600 dark:text-sky-400", bg: "bg-sky-50 dark:bg-sky-950/50" };
    case "data":
      return { icon: HardDrive, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950/50" };
    default:
      return { icon: FileCheck, color: "text-brand-blue", bg: "bg-brand-blue/10" };
  }
}

function FilesPage() {
  const [files, setFiles] = useState<WorkspaceFile[]>(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("cxo_workspace_files");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((item) => ({
              ...item,
              category: item.category || getCategoryFromFilename(item.name),
            }));
          }
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_WORKSPACE_FILES;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [notification, setNotification] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<WorkspaceFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("cxo_workspace_files", JSON.stringify(files));
        window.dispatchEvent(new Event("cxo_files_changed"));
      }
    } catch {
      // ignore
    }
  }, [files]);

  // Listen for changes from MainMenuDrawer
  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem("cxo_workspace_files");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setFiles(parsed.map((item) => ({
              ...item,
              category: item.category || getCategoryFromFilename(item.name),
            })));
          }
        }
      } catch {
        // ignore
      }
    };
    window.addEventListener("cxo_files_changed", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("cxo_files_changed", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const handleUploadFiles = (uploadedList: FileList | File[]) => {
    const fileArray = Array.from(uploadedList);
    if (fileArray.length === 0) return;

    const allowedExtensions = [".csv", ".xlsx", ".xls", ".pdf", ".parquet", ".json", ".txt", ".doc", ".docx"];
    const valid = fileArray.filter((f) => {
      const ext = "." + (f.name.split(".").pop()?.toLowerCase() || "");
      return allowedExtensions.includes(ext);
    });

    if (valid.length === 0) {
      setNotification("Please upload supported files (.csv, .xlsx, .pdf, .parquet, .json, .doc).");
      setTimeout(() => setNotification(null), 3500);
      return;
    }

    const now = new Date();
    const dateFormatted = `${now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}, ${now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })}`;

    const newItems: WorkspaceFile[] = valid.map((f) => {
      const sizeStr =
        f.size > 1024 * 1024
          ? `${(f.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(f.size / 1024)} KB`;

      return {
        id: `f-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: f.name,
        size: sizeStr,
        sizeBytes: f.size,
        uploadedAt: dateFormatted,
        type: f.name.split(".").pop()?.toLowerCase() || "file",
        category: getCategoryFromFilename(f.name),
      };
    });

    setFiles((prev) => [...newItems, ...prev]);
    setNotification(`Successfully uploaded ${valid.length} file${valid.length > 1 ? "s" : ""}`);
    setTimeout(() => setNotification(null), 3500);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDeleteFile = (id: string, name: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setNotification(`Deleted "${name}"`);
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredFiles = useMemo(() => {
    return files.filter((f) => {
      const matchesSearch =
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategory === "all" || f.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [files, searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-surface-tint font-sans text-foreground">
      {/* Header matching CXO app */}
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

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files) handleUploadFiles(e.target.files);
        }}
        multiple
        className="hidden"
        accept=".csv,.xlsx,.xls,.pdf,.parquet,.json,.txt,.doc,.docx"
      />

      <div className="flex">
        {/* Navigation Rail */}
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
              <div className="pointer-events-none absolute left-[calc(100%+12px)] z-50 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1 text-xs font-medium text-background opacity-0 shadow-lg transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0.5">
                {label}
                <span className="absolute -left-1 top-1/2 -translate-y-1/2 border-4 border-transparent border-r-foreground" />
              </div>
            </div>
          ))}
        </nav>

        {/* Main Content Area */}
        <main className="min-w-0 flex-1 px-4 pt-6 pb-12 sm:px-8 sm:pt-8 w-full space-y-6">
          {/* Header Banner & Upload Trigger */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-foreground">
                  Workspace Files
                </h1>
                <span className="rounded-full bg-tile border border-border/60 px-3 py-0.5 text-xs font-semibold text-foreground">
                  {files.length}
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                Supplemental data sets, operational models, and audit files indexed for CXO intelligence.
              </p>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-surface hover:opacity-90 transition shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <Plus className="size-4" />
              <span>Upload Files</span>
            </button>
          </div>

          {/* Toast Notification */}
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



          {/* Controls: Search & Category Chips */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {[
                { id: "all", label: "All Files", count: files.length },
                { id: "spreadsheet", label: "Excel", count: files.filter((f) => f.category === "spreadsheet").length },
                { id: "csv", label: "CSV", count: files.filter((f) => f.category === "csv").length },
                { id: "pdf", label: "PDFs", count: files.filter((f) => f.category === "pdf").length },
                { id: "data", label: "Data feeds", count: files.filter((f) => f.category === "data").length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                    activeCategory === tab.id
                      ? "bg-foreground text-surface shadow-2xs"
                      : "bg-surface border border-border/70 text-muted-foreground hover:text-foreground hover:bg-tile"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="text-[10px] font-['Archivo'] tabular-nums opacity-80">
                    ({tab.count})
                  </span>
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files..."
                className="w-full rounded-xl border border-border/80 bg-surface pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20 transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>
          </div>

          {/* Files Table / List */}
          <div className="rounded-3xl bg-surface border border-border/80 shadow-xs overflow-hidden">
            {filteredFiles.length === 0 ? (
              <div className="py-16 text-center">
                <FileText className="size-10 text-muted-foreground/50 mx-auto mb-3" />
                <h4 className="text-sm font-semibold text-foreground">No files found</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {searchQuery ? "Try refining your search keyword." : "Upload your first file above to get started."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border/70 bg-tile/40 text-muted-foreground font-medium">
                      <th className="py-3 px-4 sm:px-6">Document Name</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Size</th>
                      <th className="py-3 px-4 hidden md:table-cell">Uploaded Date</th>
                      <th className="py-3 px-4 hidden sm:table-cell">Status</th>
                      <th className="py-3 px-4 text-right pr-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredFiles.map((file) => {
                      const iconInfo = getFileIcon(file.category);
                      const Icon = iconInfo.icon;

                      return (
                        <tr
                          key={file.id}
                          className="hover:bg-tile/50 transition-colors group"
                        >
                          {/* File Name & Icon */}
                          <td className="py-3.5 px-4 sm:px-6">
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={`grid size-8 shrink-0 place-items-center rounded-xl ${iconInfo.bg} ${iconInfo.color}`}
                              >
                                <Icon className="size-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-foreground truncate text-xs sm:text-sm">
                                  {file.name}
                                </p>
                                <p className="text-[10px] text-muted-foreground md:hidden mt-0.5">
                                  {file.uploadedAt}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* File Type */}
                          <td className="py-3.5 px-4">
                            <span className="inline-block uppercase text-[10px] font-semibold px-2 py-0.5 rounded-md bg-tile border border-border/60 text-muted-foreground font-['Archivo']">
                              {file.type}
                            </span>
                          </td>

                          {/* File Size */}
                          <td className="py-3.5 px-4 font-['Archivo'] tabular-nums text-foreground font-medium">
                            {file.size}
                          </td>

                          {/* Uploaded Date */}
                          <td className="py-3.5 px-4 text-muted-foreground hidden md:table-cell">
                            {file.uploadedAt}
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4 hidden sm:table-cell">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                              <span className="size-1.5 rounded-full bg-emerald-500" />
                              Synced
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right pr-6">
                            <div className="inline-flex items-center gap-1">
                              {/* Preview */}
                              <button
                                type="button"
                                onClick={() => setPreviewFile(file)}
                                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-tile transition cursor-pointer"
                                title="Inspect document details"
                              >
                                <Eye className="size-3.5" />
                              </button>

                              {/* Download */}
                              <a
                                href={`#download-${file.name}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setNotification(`Downloading "${file.name}"...`);
                                  setTimeout(() => setNotification(null), 2500);
                                }}
                                className="p-1.5 rounded-lg text-muted-foreground hover:text-brand-blue hover:bg-tile transition cursor-pointer"
                                title="Download file"
                              >
                                <Download className="size-3.5" />
                              </a>

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() => handleDeleteFile(file.id, file.name)}
                                className="p-1.5 rounded-lg text-muted-foreground/60 hover:text-destructive hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                                title="Delete file"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Document Inspector Modal */}
      {previewFile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setPreviewFile(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-surface border border-border/90 p-6 shadow-2xl animate-in zoom-in-95 duration-150 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-border/60">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-2xl bg-brand-blue/15 text-brand-blue">
                  <FileText className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm sm:text-base truncate max-w-xs">
                    {previewFile.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {previewFile.size} • {previewFile.type.toUpperCase()}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewFile(null)}
                className="rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-tile cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 py-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Upload Timestamp</span>
                <span className="font-medium text-foreground">{previewFile.uploadedAt}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Document Category</span>
                <span className="font-medium capitalize text-foreground">{previewFile.category}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Security & Integrity</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="size-3" />
                  TLS 1.3 encrypted & SHA-256 verified
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">AI Ingestion</span>
                <span className="font-medium text-foreground">Active in Executive Case Grounding</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPreviewFile(null)}
                className="rounded-xl border border-border bg-surface px-4 py-2 text-xs font-medium text-foreground hover:bg-tile transition cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setNotification(`Downloading "${previewFile.name}"...`);
                  setTimeout(() => setNotification(null), 2500);
                  setPreviewFile(null);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-foreground px-4 py-2 text-xs font-semibold text-surface hover:opacity-90 transition cursor-pointer"
              >
                <Download className="size-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default FilesPage;
