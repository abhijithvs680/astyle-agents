import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Menu,
  Home,
  Briefcase,
  Compass,
  FolderKanban,
  FileText,
  Server,
  Sparkles,
  Send,
  RotateCcw,
} from "lucide-react";
import { AIAssistantDefaultView } from "../components/AIAssistantDefaultView";
import { MainMenuDrawer } from "../components/MainMenuDrawer";

export const Route = createFileRoute("/ai-tools")({
  head: () => ({
    meta: [
      { title: "AI Assistant — CXO Platform" },
      {
        name: "description",
        content:
          "Intelligent data engineering and clinical insights assistant powered by generative AI.",
      },
      { property: "og:title", content: "AI Assistant — CXO Platform" },
      {
        property: "og:description",
        content: "Ask anything about schemas, channel mapping, data connections, and clinical metrics.",
      },
    ],
  }),
  component: AIAssistantPage,
});

const railIcons = [
  { icon: Home, label: "Home", to: "/" },
  { icon: Briefcase, label: "Cases", to: "/cases" },
  { icon: Compass, label: "Explore", to: "/explore" },
  { icon: FolderKanban, label: "Folders", to: "/folders" },
  { icon: FileText, label: "Files", to: "/files" },
  { icon: Server, label: "Data Center", to: "/data-center" },
  { icon: Sparkles, label: "AI Assistant", to: "/ai-tools", active: true },
];

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  content: string;
}

function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState<string>("");
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);

  const handleSendMessage = (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const userText = (customPrompt ?? chatInput).trim();
    if (!userText) return;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: "user",
      content: userText,
    };
    setMessages((prev) => [...prev, newMsg]);
    setChatInput("");

    // Simulate AI response
    setTimeout(() => {
      let replyContent = "";
      const lower = userText.toLowerCase();

      if (lower.includes("analyze schema") || lower.includes("schema and optimize")) {
        replyContent = `Analyzed schemas across connected tables:
• Primary keys aligned: 'catalog_id' in Amazon catalog successfully mapped to 'procurement_item_id'.
• Identified 2 unindexed foreign keys in InboundShipmentPlan causing query latency.
• Recommended action: Created composite index on '(shipment_id, sku_code)' and validated nullability constraints. Query response improved by 42%.`;
      } else if (lower.includes("create a new table") || lower.includes("table schema")) {
        replyContent = `I have drafted the schema for 'procurement_inventory_sync':
• item_id (VARCHAR PRIMARY KEY)
• sku_catalog_ref (VARCHAR, FK -> amazon_catalog)
• stock_available_units (INTEGER)
• lead_time_days (INTEGER)
• reorder_threshold (INTEGER)

Ready to commit and deploy this schema definition to your active data center branch.`;
      } else if (lower.includes("channel mapping")) {
        replyContent = `Channel mapping validation complete:
• 98.4% of product SKUs match across Amazon and Hospital Inbound feeds.
• 2 unmapped SKUs identified: 'A TO Z NS + TAB' and 'SOFT SWAB 10*10 8PLY'.
• Matched against catalog batch IDs #B-4089 and #B-4092 with 99.1% confidence score.`;
      } else if (lower.includes("smart metrics")) {
        replyContent = `Added 3 real-time smart metrics to your data pipeline:
1. Stock Turnover Velocity (STV): Current rate 0.64% vs 2.80% target benchmark.
2. Recoverable Margin Opportunity: +€18,400 / yr via bundle optimization.
3. Lead Time Volatility: Standard deviation normalized to 1.2 days across primary suppliers.`;
      } else {
        replyContent = `I've analyzed the live connected data feeds regarding "${userText}". All schema dependencies are verified and synchronized across your clinical data center.`;
      }

      const aiReply: ChatMessage = {
        id: `m-ai-${Date.now()}`,
        sender: "ai",
        content: replyContent,
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-surface-tint font-sans text-foreground flex flex-col">
      {/* Header matching CXO app */}
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
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-200 border border-cyan-400/30 font-medium">
            AI Assistant
          </span>
        </div>

        {/* Profile icon, name, and designation */}
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

      <div className="flex flex-1 min-h-0">
        {/* Navigation Rail */}
        <nav className="hidden w-[72px] shrink-0 flex-col items-center gap-2 pt-3 md:flex sticky top-16 h-[calc(100vh-4rem)] border-r border-border/40">
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

        {/* Main Assistant Body */}
        <main className="flex-1 flex flex-col min-w-0 bg-background/50">
          {messages.length === 0 ? (
            /* Default Centered Layout Matching User Design Reference */
            <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
              <AIAssistantDefaultView
                onSendMessage={(prompt) => handleSendMessage(undefined, prompt)}
              />
            </div>
          ) : (
            /* Active Conversation View */
            <div className="flex-1 flex flex-col max-w-3xl w-full mx-auto p-4 sm:p-6 min-h-0">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <span>Active Session</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    ({messages.length} messages)
                  </span>
                </h2>
                <button
                  type="button"
                  onClick={() => setMessages([])}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-lg border border-border hover:bg-tile transition cursor-pointer"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Start new prompt</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-4 min-h-0">
                {messages.map((m) =>
                  m.sender === "user" ? (
                    <div key={m.id} className="flex justify-end">
                      <div className="max-w-[80%] rounded-2xl bg-brand-blue px-4 py-3 text-base text-white leading-relaxed shadow-xs">
                        {m.content}
                      </div>
                    </div>
                  ) : (
                    <div key={m.id} className="flex justify-start">
                      <div className="max-w-[90%] rounded-2xl bg-surface border border-border/70 p-4 text-base leading-relaxed text-foreground/90 whitespace-pre-line shadow-2xs space-y-2.5">
                        {m.content}
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Chat Input */}
              <div className="pt-3 border-t border-border/70">
                <form onSubmit={handleSendMessage} className="relative flex items-center">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask a question or request an action..."
                    className="w-full rounded-2xl border border-border/80 bg-surface pl-4 pr-12 py-3 text-base text-foreground outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20 transition placeholder:text-muted-foreground shadow-2xs"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 grid size-9 place-items-center rounded-full bg-brand-blue text-white hover:opacity-90 transition cursor-pointer"
                    aria-label="Send message"
                  >
                    <Send className="size-4" />
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Main Navigation Drawer with Files & Add File capability */}
      <MainMenuDrawer
        isOpen={isMainMenuOpen}
        onClose={() => setIsMainMenuOpen(false)}
      />
    </div>
  );
}

export default AIAssistantPage;
