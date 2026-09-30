import { useState, useMemo } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Plus,
  Search,
  MessageSquare,
  Clock,
  Trash2,
  TrendingDown,
  Bot,
  Calendar,
} from "lucide-react";
import type { GeminiMessageItem } from "./CxoDashboard";

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
  isExpanded: boolean;
  onToggleExpand: () => void;
  activeSessionId: string | null;
  onSelectSession: (session: HistorySession) => void;
  onNewSession: () => void;
  historySessions: HistorySession[];
  onDeleteSession?: (sessionId: string) => void;
}

export function SessionHistorySidebar({
  isExpanded,
  onToggleExpand,
  activeSessionId,
  onSelectSession,
  onNewSession,
  historySessions,
  onDeleteSession,
}: SessionHistorySidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter sessions by search query across all sessions (unified, no mode split)
  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return historySessions;
    const q = searchQuery.toLowerCase();
    return historySessions.filter(
      (session) =>
        session.title.toLowerCase().includes(q) ||
        session.summarySnippet.toLowerCase().includes(q) ||
        (session.agentName && session.agentName.toLowerCase().includes(q)) ||
        (session.category && session.category.toLowerCase().includes(q))
    );
  }, [historySessions, searchQuery]);

  // Group sessions by date
  const groupedSessions = useMemo(() => {
    const groups: { group: "Today" | "Yesterday" | "Previous 7 Days"; items: HistorySession[] }[] = [
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
      className={`relative h-full shrink-0 flex flex-col border-r border-[#0f354c]/30 dark:border-zinc-800 bg-[#f4f9fb] transition-all duration-300 ease-in-out z-20 overflow-hidden select-none ${
        isExpanded ? "w-[390px] sm:w-[410px]" : "w-[260px] sm:w-[280px]"
      }`}
    >
      {/* 1. TOP HEADER - NEW SESSION & EXPAND/COLLAPSE */}
      <div className="p-3 border-b border-slate-200/80 bg-white/70 backdrop-blur-xs flex items-center justify-between gap-2 shrink-0">
        <button
          type="button"
          onClick={onNewSession}
          className="flex-1 inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg bg-[#0e7490] hover:bg-[#0c627a] text-white text-xs font-semibold shadow-2xs hover:shadow-xs active:scale-98 transition cursor-pointer"
          title="Start a new session"
        >
          <Plus className="size-3.5 stroke-[2.5]" />
          <span>New Session</span>
        </button>

        {/* Expand / Collapse Button (as marked in user request) */}
        <button
          type="button"
          onClick={onToggleExpand}
          className="size-8 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition cursor-pointer shadow-2xs shrink-0"
          title={isExpanded ? "Collapse session history sidebar (<-)" : "Expand session history sidebar (->)"}
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isExpanded ? (
            <ChevronLeft className="size-4 stroke-[2.2]" />
          ) : (
            <ChevronRight className="size-4 stroke-[2.2]" />
          )}
        </button>
      </div>

      {/* 2. SEARCH INPUT (Visible when expanded or compact search bar) */}
      <div className="px-3 pt-2.5 pb-2 bg-slate-50/60 border-b border-slate-200/60 shrink-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search previous sessions..."
            className="w-full h-8 pl-8 pr-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0e7490] focus:ring-1 focus:ring-[#0e7490]/20 transition"
          />
        </div>
      </div>

      {/* 3. SESSIONS LIST (Grouped by Today, Yesterday, Previous 7 Days) */}
      <div className="flex-1 min-h-0 overflow-y-auto px-2.5 py-2 space-y-4">
        {groupedSessions.length === 0 ? (
          <div className="text-center py-8 px-4 text-slate-400 space-y-2">
            <Clock className="size-8 mx-auto text-slate-300" />
            <p className="text-xs font-medium text-slate-600">
              {searchQuery ? "No matching sessions found." : "No previous sessions yet."}
            </p>
            <p className="text-[11px] text-slate-400">
              Ask a question on the right to start an analysis.
            </p>
          </div>
        ) : (
          groupedSessions.map(({ group, items }) => (
            <div key={group} className="space-y-1.5">
              <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3 text-slate-400" />
                  <span>{group}</span>
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
                      className={`group relative rounded-xl border p-2.5 text-left transition-all cursor-pointer ${
                        isActive
                          ? "bg-white border-[#0e7490] ring-1 ring-[#0e7490]/30 shadow-xs"
                          : "bg-white/80 hover:bg-white border-slate-200/80 hover:border-sky-300 shadow-2xs hover:shadow-xs"
                      }`}
                    >
                      {/* Active Left Indicator Bar */}
                      {isActive && (
                        <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#0e7490]" />
                      )}

                      <div className="flex items-start justify-between gap-1.5">
                        <h4
                          className={`text-xs font-semibold leading-snug line-clamp-2 ${
                            isActive ? "text-[#0e7490]" : "text-slate-800 group-hover:text-slate-900"
                          }`}
                        >
                          {session.title}
                        </h4>

                        {/* Delete session button on hover */}
                        {onDeleteSession && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteSession(session.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition cursor-pointer shrink-0"
                            title="Delete this session"
                            aria-label="Delete session"
                          >
                            <Trash2 className="size-3" />
                          </button>
                        )}
                      </div>

                      {/* COMPACT VIEW METADATA */}
                      {!isExpanded ? (
                        <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400">
                          <span className="truncate flex items-center gap-1">
                            <MessageSquare className="size-2.5 text-[#0e7490] shrink-0" />
                            <span className="truncate text-slate-500 font-medium">
                              {session.agentName || session.category || "Intelligence"}
                            </span>
                          </span>
                          <span className="shrink-0 text-[10px]">{session.timestamp}</span>
                        </div>
                      ) : (
                        /* EXPANDED VIEW RICH DETAILS */
                        <div className="mt-2 space-y-1.5 animate-in fade-in duration-150">
                          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                            {session.summarySnippet}
                          </p>

                          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                            {session.agentName && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-medium text-slate-700">
                                <Bot className="size-2.5 text-[#0e7490]" />
                                <span className="truncate max-w-[130px]">{session.agentName}</span>
                              </span>
                            )}

                            {session.impactMetric && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-[10px] font-semibold text-rose-700">
                                <TrendingDown className="size-2.5" />
                                <span>{session.impactMetric}</span>
                              </span>
                            )}

                            {session.category && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-sky-50 border border-sky-200 text-[10px] font-medium text-sky-700">
                                <span>{session.category}</span>
                              </span>
                            )}
                          </div>

                          <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100">
                            <span>{session.messages.length} message{session.messages.length > 1 ? "s" : ""}</span>
                            <span>{session.timestamp}</span>
                          </div>
                        </div>
                      )}
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
          ASTYLE Session History &middot; {historySessions.length} Sessions
        </p>
      </div>
    </aside>
  );
}
