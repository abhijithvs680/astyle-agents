import { createFileRoute } from "@tanstack/react-router";
import { CxoDashboard } from "../components/CxoDashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ASTYLE — Case Analytics & Insights Dashboard" },
      {
        name: "description",
        content:
          "ASTYLE showing newly detected garment cases, active inventory exposure analytics, and supply chain anomalies.",
      },
      { property: "og:title", content: "ASTYLE — Case Analytics Dashboard" },
      {
        property: "og:description",
        content:
          "Explore new detected cases and track active apparel cases across inventory exposure, launches, revenue dependency, and stockouts.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <CxoDashboard initialView="chat" />;
}
