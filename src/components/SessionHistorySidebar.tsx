import { useState, useMemo } from "react";
import { Search, Clock, Trash2, Calendar } from "lucide-react";
import type { GeminiMessageItem } from "./CxoDashboard";
import { useLanguage } from "../context/LanguageContext";
import { TranslatableText } from "./TranslatableText";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

export interface HistorySession {
  id: string;
  title: string;
  timestamp: string;
  group: "Today" | "Yesterday" | "Previous 7 Days";
  agentName?: string;
  category?: string;
  summarySnippet: string;
  impactMetric?: string;
  messages: GeminiMessageItem[];
}

interface SessionHistorySidebarProps {
  activeSessionId: string | null;
  onSelectSession: (session: HistorySession) => void;
  historySessions: HistorySession[];
  /** Runs only after the user confirms. Rejects if the delete fails. */
  onDeleteSession?: (sessionId: string) => Promise<void> | void;
}

export function SessionHistorySidebar({
  activeSessionId,
  onSelectSession,
  historySessions,
  onDeleteSession,
}: SessionHistorySidebarProps) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  /** The session awaiting confirmation. Deleting cannot be undone, so it is
   *  never done on the click itself. */
  const [pendingDelete, setPendingDelete] = useState<HistorySession | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const groupLabels: Record<string, string> = {
    Today: t("sidebar.today", { defaultValue: "Today" }),
    Yesterday: t("sidebar.yesterday", { defaultValue: "Yesterday" }),
    "Previous 7 Days": t("sidebar.previous7Days", { defaultValue: "Previous 7 Days" }),
  };

  // Filter sessions by search query across all sessions (unified, no mode split)
  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return historySessions;
    const q = searchQuery.toLowerCase();
    return historySessions.filter(
      (session) =>
        session.title.toLowerCase().includes(q) ||
        session.summarySnippet.toLowerCase().includes(q) ||
        (session.agentName && session.agentName.toLowerCase().includes(q)) ||
        (session.category && session.category.toLowerCase().includes(q)),
    );
  }, [historySessions, searchQuery]);

  // Group sessions by date
  const groupedSessions = useMemo(() => {
    const groups: { group: "Today" | "Yesterday" | "Previous 7 Days"; items: HistorySession[] }[] =
      [
        { group: "Today", items: [] },
        { group: "Yesterday", items: [] },
        { group: "Previous 7 Days", items: [] },
      ];

    filteredSessions.forEach((session) => {
      const g = groups.find((grp) => grp.group === session.group);
      if (g) {
        g.items.push(session);
      } else {
        groups[0]?.items.push(session);
      }
    });

    return groups.filter((g) => g.items.length > 0);
  }, [filteredSessions]);

  return (
    <aside
      id="ask-ai-session-history"
      aria-label={t("nav.chatHistory", { defaultValue: "Chat History" })}
      className="absolute left-14 md:left-auto md:relative h-full w-[260px] sm:w-[280px] max-w-[calc(100vw-3.5rem)] md:max-w-none shrink-0 flex flex-col border-r border-[#0f354c]/30 dark:border-zinc-800 bg-[#f4f9fb] z-20 overflow-hidden select-none"
    >
      {/* Search stays at the top; session actions live in the main menu. */}
      <div className="px-3 pt-2.5 pb-2 bg-slate-50/60 border-b border-slate-200/60 shrink-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("sidebar.searchPlaceholder", { defaultValue: "Search previous sessions..." })}
            className="w-full h-8 pl-8 pr-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0e7490] focus:ring-1 focus:ring-[#0e7490]/20 transition"
          />
        </div>
      </div>

      {/* Sessions grouped by date. */}
      <div className="subtle-scrollbar flex-1 min-h-0 overflow-y-auto px-2.5 py-2 space-y-4">
        {groupedSessions.length === 0 ? (
          <div className="text-center py-8 px-4 text-slate-400 space-y-2">
            <Clock className="size-8 mx-auto text-slate-300" />
            <p className="text-xs font-medium text-slate-600">
              {searchQuery
                ? t("sidebar.noMatchingSessions", { defaultValue: "No matching sessions found." })
                : t("sidebar.noPreviousSessions", { defaultValue: "No previous sessions yet." })}
            </p>
            <p className="text-[11px] text-slate-400">
              {t("sidebar.askQuestion", { defaultValue: "Ask a question on the right to start an analysis." })}
            </p>
          </div>
        ) : (
          groupedSessions.map(({ group, items }) => (
            <div key={group} className="space-y-1.5">
              <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3 text-slate-400" />
                  <span>{groupLabels[group] ?? group}</span>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">{items.length}</span>
              </div>

              <div className="space-y-1">
                {items.map((session) => {
                  const isActive = activeSessionId === session.id;

                  return (
                    <div
                      key={session.id}
                      onClick={() => onSelectSession(session)}
                      className={`group relative border-b px-2.5 py-2.5 text-left transition-colors cursor-pointer ${
                        isActive
                          ? "bg-white text-[#0e7490]"
                          : "bg-transparent text-slate-800 hover:bg-white/70"
                      }`}
                    >
                      {/* Active Left Indicator Bar */}
                      {isActive && (
                        <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#0e7490]" />
                      )}

                      <div className="flex items-start justify-between gap-1.5">
                        <h4
                          className={`text-xs font-semibold leading-snug line-clamp-2 ${
                            isActive
                              ? "text-[#0e7490]"
                              : "text-slate-800 group-hover:text-slate-900"
                          }`}
                        >
                          <TranslatableText text={session.title} />
                        </h4>

                        {/* Delete session button on hover */}
                        {onDeleteSession && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteError(null);
                              setPendingDelete(session);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition cursor-pointer shrink-0"
                            title={t("sidebar.deleteSession", { defaultValue: "Delete this session" })}
                            aria-label={t("sidebar.deleteSession", { defaultValue: "Delete this session" })}
                          >
                            <Trash2 className="size-3" />
                          </button>
                        )}
                      </div>

                      <div className="mt-1 text-[10px] text-slate-400">
                        <span>{session.timestamp}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 4. FOOTER INFO */}
      <div className="p-2 border-t border-slate-200/80 bg-white/70 text-center shrink-0">
        <p className="text-[10px] text-slate-400 font-medium">
          {`${t("sidebar.sessionHistory", { defaultValue: "ASTYLE Session History" })} · ${historySessions.length} ${t("sidebar.sessions", { defaultValue: "Sessions" })}`}
        </p>
      </div>

      {/* Deleting is permanent, so it is always confirmed. The session is
          named in the prompt: with several similar titles in the list, "this
          session" is not enough to act on. */}
      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setPendingDelete(null);
            setDeleteError(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("sidebar.deleteTitle", { defaultValue: "Delete this session?" })}</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete === null ? null : (
                <>
                  <span className="font-semibold text-slate-900">{pendingDelete.title}</span>{" "}
                  {t("sidebar.deleteDescription", { defaultValue: "and every message in it will be permanently deleted. This cannot be retrieved." })}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {deleteError !== null ? (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {deleteError}
            </p>
          ) : null}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{t("common.cancel", { defaultValue: "Cancel" })}</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              className="bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-600"
              onClick={(event) => {
                // The dialog closes itself on action; hold it open until the
                // delete has actually succeeded, so a failure stays visible.
                event.preventDefault();
                if (pendingDelete === null || onDeleteSession === undefined) return;

                setIsDeleting(true);
                setDeleteError(null);
                void Promise.resolve(onDeleteSession(pendingDelete.id))
                  .then(() => {
                    setPendingDelete(null);
                  })
                  .catch((error: unknown) => {
                    setDeleteError(
                      error instanceof Error
                        ? `${t("sidebar.deleteErrorPrefix", { defaultValue: "It could not be deleted:" })} ${error.message}`
                        : t("sidebar.deleteErrorGeneric", { defaultValue: "It could not be deleted. Nothing was removed." }),
                    );
                  })
                  .finally(() => {
                    setIsDeleting(false);
                  });
              }}
            >
              {isDeleting
                ? t("sidebar.deleting", { defaultValue: "Deleting…" })
                : t("sidebar.deleteButton", { defaultValue: "Delete session" })}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </aside>
  );
}
