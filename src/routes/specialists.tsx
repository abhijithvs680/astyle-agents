import { createFileRoute, useRouteContext } from "@tanstack/react-router";

import { CxoDashboard } from "../components/CxoDashboard";

export const Route = createFileRoute("/specialists")({
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
  return <CxoDashboard initialView="inbox" initialSessions={sessions} />;
}
