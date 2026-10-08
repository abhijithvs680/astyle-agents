import { createServerFn } from "@tanstack/react-start";

import { postAuthenticated } from "./client.server";
import { normalizeConversationRows } from "./conversations";
import type { ConversationEntry } from "./types";

/** Load every message returned for the selected specialist, in transcript order. */
export const fetchSpecialistConversations = createServerFn({ method: "POST" })
  .validator((input: { agentId?: string | undefined }) => {
    const agentId = typeof input?.agentId === "string" ? input.agentId.trim() : "";
    if (agentId === "") throw new Error("A specialist ID is required.");
    return { agentId };
  })
  .handler(async ({ data }): Promise<Array<ConversationEntry>> => {
    const response = await postAuthenticated("getSpecialistConversations", {
      agent_id: data.agentId,
      session_id: data.agentId,
    });
    return normalizeConversationRows(response);
  });
