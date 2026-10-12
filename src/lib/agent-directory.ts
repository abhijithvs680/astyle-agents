/**
 * The agent catalog, resolved once and shared.
 *
 * A report names the agents that produced it only by id — `agentId` on each
 * block, or the ids on the plan it ran from. Turning those into something a
 * reader recognises needs the catalog, and every report on screen needs the
 * same one, so the fetch is cached at module scope rather than repeated per
 * report card.
 *
 * It fails soft: callers fall back to whatever name they already had, or to
 * the id, so a report still renders when the catalog is unreachable.
 */
import { useEffect, useState } from "react";

import { fetchCaseAgents, type Specialist } from "../api/case-agents";

export type AgentDirectory = Map<string, Specialist>;

const EMPTY: AgentDirectory = new Map();

let cached: AgentDirectory | null = null;
let inFlight: Promise<AgentDirectory> | null = null;

function load(): Promise<AgentDirectory> {
  if (cached !== null) return Promise.resolve(cached);
  inFlight ??= fetchCaseAgents()
    .then((items) => {
      cached = new Map(items.map((item) => [item.id, item]));
      return cached;
    })
    .catch((reason: unknown) => {
      console.error("[agent-directory] could not load the agent catalog", reason);
      // Not cached: a later report gets to try again.
      return EMPTY;
    })
    .finally(() => {
      inFlight = null;
    });
  return inFlight;
}

/** The catalog keyed by agent id. Empty until the first fetch lands. */
export function useAgentDirectory(): AgentDirectory {
  const [directory, setDirectory] = useState<AgentDirectory>(cached ?? EMPTY);

  useEffect(() => {
    if (cached !== null) return;
    let active = true;
    void load().then((next) => {
      if (active) setDirectory(next);
    });
    return () => {
      active = false;
    };
  }, []);

  return directory;
}
