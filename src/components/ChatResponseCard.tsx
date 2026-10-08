import { Sparkles } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { ChatAnswer } from "../lib/chat-response";

export function ChatResponseCard({ answer }: { answer: ChatAnswer }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#0e7490] text-white shadow-2xs">
        <Sparkles className="size-4" aria-hidden="true" />
      </div>
      <div className="min-w-0 max-w-2xl flex-1 rounded-2xl border border-slate-200/90 bg-white p-4 text-sm text-slate-800 shadow-2xs sm:p-5">
        <div className="break-words leading-relaxed">
          <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h4 className="mt-5 mb-2 text-xl font-bold text-slate-900 first:mt-0">
                  {children}
                </h4>
              ),
              h2: ({ children }) => (
                <h4 className="mt-5 mb-2 text-lg font-bold text-slate-900 first:mt-0">
                  {children}
                </h4>
              ),
              h3: ({ children }) => (
                <h4 className="mt-5 mb-2 text-base font-bold text-slate-900 first:mt-0">
                  {children}
                </h4>
              ),
              h4: ({ children }) => (
                <h4 className="mt-4 mb-2 font-bold text-slate-900 first:mt-0">{children}</h4>
              ),
              h5: ({ children }) => (
                <h5 className="mt-4 mb-2 font-semibold text-slate-900 first:mt-0">{children}</h5>
              ),
              h6: ({ children }) => (
                <h6 className="mt-4 mb-2 font-semibold text-slate-900 first:mt-0">{children}</h6>
              ),
              p: ({ children }) => <p className="my-2 first:mt-0 last:mb-0">{children}</p>,
              ul: ({ children }) => (
                <ul className="my-2 list-outside list-disc space-y-1 pl-5">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="my-2 list-outside list-decimal space-y-1 pl-5">{children}</ol>
              ),
              li: ({ children }) => <li className="pl-0.5">{children}</li>,
              strong: ({ children }) => (
                <strong className="font-semibold text-slate-900">{children}</strong>
              ),
              a: ({ children, href }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#0e7490] underline underline-offset-2 hover:text-[#075d73]"
                >
                  {children}
                </a>
              ),
              blockquote: ({ children }) => (
                <blockquote className="my-3 border-l-2 border-cyan-600 pl-4 text-slate-600">
                  {children}
                </blockquote>
              ),
              hr: () => <hr className="my-4 border-slate-200" />,
              pre: ({ children }) => (
                <pre className="my-3 overflow-x-auto rounded-lg bg-slate-100 p-3 text-xs leading-relaxed [&>code]:bg-transparent [&>code]:p-0">
                  {children}
                </pre>
              ),
              code: ({ children }) => (
                <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">
                  {children}
                </code>
              ),
              table: ({ children }) => (
                <div className="my-3 overflow-x-auto">
                  <table className="w-full min-w-max border-collapse text-left text-xs">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="border border-slate-200 bg-slate-50 px-3 py-2 font-semibold text-slate-900">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-slate-200 px-3 py-2">{children}</td>
              ),
            }}
          >
            {answer.response}
          </Markdown>
        </div>
      </div>
    </div>
  );
}
