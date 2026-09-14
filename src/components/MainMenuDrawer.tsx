import React, { useState, useRef } from "react";
import { Link } from "@tanstack/react-router";
import {
  X,
  Home,
  Briefcase,
  Compass,
  FolderKanban,
  FileText,
  Server,
  Sparkles,
  Plus,
  UploadCloud,
  Trash2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export interface WorkspaceFile {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  type: string;
}

const DEFAULT_WORKSPACE_FILES: WorkspaceFile[] = [
  {
    id: "f-1",
    name: "Q3_Revenue_Performance_Model.xlsx",
    size: "1.8 MB",
    uploadedAt: "Sep 12, 2026",
    type: "spreadsheet",
  },
  {
    id: "f-2",
    name: "Clinical_Scheduling_Logs_Aug26.csv",
    size: "840 KB",
    uploadedAt: "Sep 13, 2026",
    type: "csv",
  },
  {
    id: "f-3",
    name: "Ambulatory_Care_Quality_Report.pdf",
    size: "3.2 MB",
    uploadedAt: "Sep 14, 2026",
    type: "pdf",
  },
];

interface MainMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onFileAdded?: (file: File) => void;
}

export function MainMenuDrawer({ isOpen, onClose, onFileAdded }: MainMenuDrawerProps) {
  const [files, setFiles] = useState<WorkspaceFile[]>(DEFAULT_WORKSPACE_FILES);
  const [justUploadedName, setJustUploadedName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    Array.from(selectedFiles).forEach((f) => {
      const sizeStr =
        f.size > 1024 * 1024
          ? `${(f.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(f.size / 1024)} KB`;

      const newFileItem: WorkspaceFile = {
        id: `f-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: f.name,
        size: sizeStr,
        uploadedAt: "Just now",
        type: f.name.split(".").pop() || "file",
      };

      setFiles((prev) => [newFileItem, ...prev]);
      setJustUploadedName(f.name);
      onFileAdded?.(f);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setTimeout(() => {
      setJustUploadedName(null);
    }, 4000);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 cursor-pointer"
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        className="relative z-10 flex h-full w-full max-w-sm flex-col bg-surface border-r border-border/80 shadow-2xl transition-transform duration-300 ease-out"
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-border/60 px-5 bg-[#072333]">
          <div className="flex items-center gap-2.5">
            <Link
              to="/"
              onClick={onClose}
              className="text-xl font-bold tracking-tight text-white hover:opacity-90 transition"
            >
              CXO
            </Link>
            <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-sky-200 uppercase tracking-wide">
              Workspace
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-full text-sky-200 hover:bg-white/15 hover:text-white transition cursor-pointer"
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          multiple
          className="hidden"
          accept=".csv,.xlsx,.xls,.pdf,.json,.txt,.doc,.docx"
        />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {/* Navigation Links */}
          <nav className="space-y-1">
            <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
              Navigation
            </p>
            <Link
              to="/"
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-tile transition"
            >
              <Home className="size-4 text-muted-foreground" />
              <span>Home</span>
            </Link>
            <Link
              to="/cases"
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-tile transition"
            >
              <Briefcase className="size-4 text-muted-foreground" />
              <span>Cases</span>
            </Link>
            <Link
              to="/explore"
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-tile transition"
            >
              <Compass className="size-4 text-muted-foreground" />
              <span>Explore</span>
            </Link>
            <Link
              to="/folders"
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-tile transition"
            >
              <FolderKanban className="size-4 text-muted-foreground" />
              <span>Folders</span>
            </Link>

            {/* FILES OPTION IN THE MENU */}
            <Link
              to="/folders"
              onClick={onClose}
              className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-foreground bg-tile/80 hover:bg-tile transition group border border-border/50"
            >
              <div className="flex items-center gap-3">
                <FileText className="size-4 text-brand-blue" />
                <span className="font-semibold text-foreground">Files</span>
              </div>
              <span className="rounded-full bg-brand-blue/15 px-2 py-0.5 text-xs font-semibold text-brand-blue font-['Archivo'] tabular-nums">
                {files.length}
              </span>
            </Link>

            <Link
              to="/data-center"
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-tile transition"
            >
              <Server className="size-4 text-muted-foreground" />
              <span>Data Center</span>
            </Link>
            <Link
              to="/ai-tools"
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-tile transition"
            >
              <Sparkles className="size-4 text-muted-foreground" />
              <span>AI Assistant</span>
            </Link>
          </nav>

          {/* FILES MANAGEMENT & OPTION TO ADD FILE */}
          <div className="rounded-2xl border border-border/70 bg-tile/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Files & Docs
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Indexed supplemental documents
                </p>
              </div>

              {/* OPTION TO ADD FILE */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-surface hover:opacity-90 transition shadow-2xs cursor-pointer"
                title="Upload new file"
              >
                <Plus className="size-3.5 stroke-[2.5]" />
                <span>Add file</span>
              </button>
            </div>

            {/* Upload Notification Banner */}
            {justUploadedName && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-300 animate-in fade-in duration-300">
                <CheckCircle2 className="size-3.5 shrink-0 text-emerald-600" />
                <span className="truncate font-medium">Added "{justUploadedName}"</span>
              </div>
            )}

            {/* Quick Upload Drop Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border/80 bg-surface/60 px-3 py-2.5 text-center transition hover:bg-surface hover:border-brand-blue/50"
            >
              <UploadCloud className="size-4 text-brand-blue/80 shrink-0" />
              <span className="text-xs font-medium text-foreground">
                Click to add spreadsheets or PDFs
              </span>
            </div>

            {/* Files List */}
            <div className="space-y-1.5 pt-1 max-h-52 overflow-y-auto pr-0.5">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between gap-2 rounded-xl border border-border/50 bg-surface px-2.5 py-2 text-xs transition hover:bg-tile/70 group"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <FileText className="size-3.5 shrink-0 text-brand-blue" />
                    <span className="truncate font-medium text-foreground">
                      {file.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-['Archivo'] shrink-0">
                      {file.size}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFile(file.id)}
                    className="p-1 text-muted-foreground/60 hover:text-destructive transition opacity-60 group-hover:opacity-100 cursor-pointer"
                    title="Remove file"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
              ))}
            </div>

            <Link
              to="/folders"
              onClick={onClose}
              className="flex items-center justify-between pt-1 text-[11px] font-medium text-brand-blue hover:underline"
            >
              <span>View all files in Folders</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>

        {/* Footer Profile */}
        <div className="border-t border-border/60 p-4 bg-surface/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-full bg-[oklch(0.68_0.15_55)] text-xs font-semibold text-white shadow-2xs">
              R
            </span>
            <div>
              <p className="text-xs font-semibold text-foreground leading-none">
                Robert
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Chief Executive Officer
              </p>
            </div>
          </div>

          <Link
            to="/welcome"
            onClick={onClose}
            className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition underline underline-offset-2"
          >
            Setup
          </Link>
        </div>
      </aside>
    </div>
  );
}
