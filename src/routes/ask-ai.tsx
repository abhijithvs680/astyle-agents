import { createFileRoute } from "@tanstack/react-router";
import { CxoDashboard } from "../components/CxoDashboard";

export const Route = createFileRoute("/ask-ai")({
  head: () => ({
    meta: [
      { title: "A style — Intelligent Garment & Merchandising Assistant" },
      {
        name: "description",
        content:
          "Autonomous garment and apparel merchandising intelligence, inventory exposure analysis, and supply chain telemetry.",
      },
      { property: "og:title", content: "A style" },
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
  return <CxoDashboard initialView="chat" />;
}
