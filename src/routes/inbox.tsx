import { createFileRoute } from "@tanstack/react-router";
import { CxoDashboard } from "../components/CxoDashboard";

export const Route = createFileRoute("/inbox")({
  head: () => ({
    meta: [
      { title: "A style — Case Analytics & Insights Dashboard" },
      {
        name: "description",
        content:
          "A style showing newly detected garment cases, active inventory exposure analytics, and supply chain stockouts.",
      },
      { property: "og:title", content: "A style — Case Analytics Dashboard" },
      {
        property: "og:description",
        content:
          "Explore active apparel cases across inventory exposure, product launches, core revenue dependency, and stockouts.",
      },
    ],
  }),
  component: InboxPage,
});

function InboxPage() {
  return <CxoDashboard initialView="inbox" />;
}
