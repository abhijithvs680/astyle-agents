import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { CxoDashboard } from "../components/CxoDashboard";

export const Route = createFileRoute("/ask-ai")({
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

  return <CxoDashboard initialView="chat" initialSessions={sessions} />;
}
