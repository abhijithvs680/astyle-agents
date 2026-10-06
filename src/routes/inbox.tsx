import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { CxoDashboard } from "../components/CxoDashboard";

export const Route = createFileRoute("/inbox")({
  head: () => ({
    meta: [
      { title: "ASTYLE — Case Analytics & Insights Dashboard" },
      {
        name: "description",
        content:
          "ASTYLE showing newly detected garment cases, active inventory exposure analytics, and supply chain stockouts.",
      },
      { property: "og:title", content: "ASTYLE — Case Analytics Dashboard" },
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
  const { sessions } = useRouteContext({ from: "__root__" });

  return <CxoDashboard initialView="inbox" initialSessions={sessions} />;
}
