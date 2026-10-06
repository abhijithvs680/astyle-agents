import { AlertTriangle } from "lucide-react";

import type { InvalidReason } from "../api/types";

const MESSAGES: Record<InvalidReason, { title: string; detail: string }> = {
  "missing-token": {
    title: "Invalid configuration",
    detail:
      "This app must be opened with an access token. Return to your portal and launch ASTYLE from there.",
  },
  rejected: {
    title: "Invalid configuration",
    detail:
      "The access token this link carries was not accepted. It may have expired or been revoked — launch ASTYLE again from your portal to get a fresh one.",
  },
  configuration: {
    title: "Invalid configuration",
    detail:
      "This deployment is missing its backend settings, so the access token could not be checked. Contact your administrator.",
  },
  unreachable: {
    title: "Invalid configuration",
    detail:
      "The access token could not be verified because the service did not respond. Try again in a moment.",
  },
};

export function InvalidConfiguration({ reason }: { reason: InvalidReason }) {
  const { title, detail } = MESSAGES[reason];

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-6 w-6 text-destructive" aria-hidden="true" />
        </div>
        <h1 className="mt-6 text-xl font-semibold tracking-tight text-card-foreground">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{detail}</p>
        <p className="mt-6 text-xs text-muted-foreground/70">Reference: {reason}</p>
      </div>
    </main>
  );
}
