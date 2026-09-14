import React, { useState } from "react";
import { ArrowUp, ArrowRight } from "lucide-react";

export interface AIAssistantDefaultViewProps {
  onSendMessage: (text: string) => void;
  suggestions?: string[];
  className?: string;
}

const fallbackSuggestions = [
  "Analyze underperforming SKUs and shelf visibility",
  "How to recover the €18,400 annual margin delta?",
  "Suggest promotional bundling for A to Z NS + Tab",
  "Check dispensary reorder threshold buffers",
];

// Radial dotted circle icon matching the attached design
export function RadialDotsIcon({ className = "size-10" }: { className?: string }) {
  const dotsCount = 16;
  const radius = 13;
  const center = 20;

  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {Array.from({ length: dotsCount }).map((_, i) => {
        const angle = (i * 360) / dotsCount;
        const rad = (angle * Math.PI) / 180;
        const cx = center + radius * Math.cos(rad);
        const cy = center + radius * Math.sin(rad);
        // Subtle rhythmic size variation for the premium AI aesthetic
        const r = 1.3 + (i % 3 === 0 ? 0.5 : i % 2 === 0 ? 0.3 : 0);
        const opacity = 0.5 + ((i * 7) % 50) / 100;

        return (
          <circle
            key={i}
            cx={cx.toFixed(2)}
            cy={cy.toFixed(2)}
            r={r}
            className="fill-slate-700 dark:fill-slate-300"
            opacity={opacity}
          />
        );
      })}
    </svg>
  );
}

export function AIAssistantDefaultView({
  onSendMessage,
  suggestions = fallbackSuggestions,
  className = "",
}: AIAssistantDefaultViewProps) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;
    onSendMessage(inputValue.trim());
    setInputValue("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSendMessage(suggestion);
  };

  return (
    <div
      className={`w-full flex flex-col items-center justify-center px-4 py-8 sm:py-12 select-none ${className}`}
    >
      <div className="w-full max-w-[420px] flex flex-col items-center">
        {/* Radial Dotted Icon */}
        <div className="mb-4 flex items-center justify-center animate-in fade-in zoom-in-90 duration-300">
          <RadialDotsIcon className="size-11 sm:size-12 text-slate-700 dark:text-slate-300" />
        </div>

        {/* Heading requested by user */}
        <h2 className="text-xl sm:text-[22px] text-foreground text-center mb-6 tracking-tight">
          What can I help you with?
        </h2>

        {/* Chat Box Container (Clean input area with send button only) */}
        <div
          className={`w-full rounded-[22px] bg-white dark:bg-zinc-900 border transition-all duration-200 p-3.5 sm:p-4 shadow-xs ${isFocused
              ? "border-blue-400 ring-2 ring-blue-100 dark:ring-blue-950 shadow-sm"
              : "border-[#bfdbfe] hover:border-blue-300 dark:border-blue-900/60"
            }`}
        >
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="relative w-full mb-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Continue, ask anything"
                className="w-full bg-transparent text-sm sm:text-base text-foreground placeholder:text-slate-400 dark:placeholder:text-zinc-500 outline-none py-1"
              />
            </div>

            {/* Bottom Action Bar: ONLY Send Icon */}
            <div className="flex items-center justify-end pt-1">
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className={`grid size-7 sm:size-8 place-items-center rounded-full text-white transition-all cursor-pointer shadow-2xs ${inputValue.trim()
                    ? "bg-[#4a4744] hover:bg-[#33312f] dark:bg-zinc-200 dark:text-zinc-900 active:scale-95"
                    : "bg-[#716e6a] dark:bg-zinc-700 opacity-90 hover:opacity-100"
                  }`}
                aria-label="Send prompt"
              >
                <ArrowUp className="size-4" strokeWidth={2.5} />
              </button>
            </div>
          </form>
        </div>

        {/* Suggestions List (grounded in the report on the left) */}
        <div className="w-full mt-6 space-y-2.5 px-0.5">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="group w-full flex items-center gap-2.5 text-left text-xs sm:text-sm text-slate-600 dark:text-slate-400 hover:text-foreground transition-colors py-1 cursor-pointer"
            >
              <ArrowRight className="size-3.5 text-slate-400 dark:text-zinc-500 group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
              <span className="leading-snug">{suggestion}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AIAssistantDefaultView;
