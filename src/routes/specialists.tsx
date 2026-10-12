import { createFileRoute, useRouteContext } from "@tanstack/react-router";

import { CxoDashboard } from "../components/CxoDashboard";

export const Route = createFileRoute("/specialists")({
  // Set when a report's agent pill is used to open one of its agents.
  validateSearch: (search: Record<string, unknown>): { agent?: string } => {
    // A numeric id round-trips as a number when the URL is typed by hand and
    // as a quoted string when the router wrote it, so accept both.
    const raw = search["agent"];
    const agent =
      typeof raw === "string" ? raw.trim() : typeof raw === "number" ? String(raw) : "";
    return agent === "" ? {} : { agent };
  },
  head: () => ({
    meta: [
      { title: "ASTYLE — Specialists" },
      {
        name: "description",
        content: "View the specialists available to analyze your business data.",
      },
    ],
  }),
  component: SpecialistsPage,
});

function SpecialistsPage() {
  const { sessions } = useRouteContext({ from: "__root__" });
  const { agent } = Route.useSearch();
  return (
    <CxoDashboard initialView="inbox" initialSessions={sessions} initialAgentId={agent ?? null} />
  );
}
