import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { CxoDashboard } from "../components/CxoDashboard";

export const Route = createFileRoute("/ask-ai")({
  validateSearch: (search: Record<string, unknown>) => ({
    history: search["history"] === "open" ? "open" : undefined,
  }),
  head: () => ({
    meta: [
      { title: "ASTYLE — Intelligent Garment & Merchandising Assistant" },
      {
        name: "description",
        content:
          "Autonomous garment and apparel merchandising intelligence, inventory exposure analysis, and supply chain telemetry.",
      },
      { property: "og:title", content: "ASTYLE" },
      {
        property: "og:description",
        content:
          "Autonomous garment and apparel merchandising intelligence, inventory exposure, and launch analytics.",
      },
    ],
  }),
  component: AskAiPage,
});

function AskAiPage() {
  const { sessions } = useRouteContext({ from: "__root__" });
  const { history } = Route.useSearch();

  return (
    <CxoDashboard
      initialView="chat"
      initialSessions={sessions}
      initialHistoryOpen={history === "open"}
    />
  );
}
