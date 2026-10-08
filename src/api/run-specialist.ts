import { createServerFn } from "@tanstack/react-start";

import { postAuthenticated } from "./client.server";

type RunSpecialistInput = { agentId?: string | undefined; prompt?: string | undefined };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function responseError(value: unknown): string | null {
  if (Array.isArray(value)) {
    for (const item of value) {
      const error = responseError(item);
      if (error !== null) return error;
    }
    return null;
  }
  if (!isRecord(value)) return null;

  const actions = value["Actions"];
  if (isRecord(actions)) {
    const messages = actions["messages"];
    if (isRecord(messages)) {
      const error = messages["error"];
      if (typeof error === "string" && error.trim() !== "") return error;
      if (Array.isArray(error)) {
        const first = error.find((item): item is string => typeof item === "string");
        if (first !== undefined) return first;
      }
    }
  }
  return null;
}

/** The socket delivers the answer; inspect quick HTTP failures before returning. */
export const runSpecialist = createServerFn({ method: "POST" })
  .validator((input: RunSpecialistInput) => {
    const agentId = typeof input?.agentId === "string" ? input.agentId.trim() : "";
    const prompt = typeof input?.prompt === "string" ? input.prompt.trim() : "";
    if (agentId === "") throw new Error("A specialist ID is required.");
    if (prompt === "") throw new Error("A message is required.");
    return { agentId, prompt };
  })
  .handler(async ({ data }): Promise<{ accepted: true }> => {
    const run = postAuthenticated("runSpecialist", {
      session_id: data.agentId,
      agent_id: data.agentId,
      new_session: false,
      prompt: data.prompt,
      mode: "chat",
    });

    // Valid agent runs can stay open while they work. Permission and input
    // failures return quickly, so catch those without blocking the chat UI.
    const pending = Symbol("pending");
    let timer: ReturnType<typeof setTimeout> | undefined;
    const response = await Promise.race([
      run,
      new Promise<typeof pending>((resolve) => {
        timer = setTimeout(() => resolve(pending), 3000);
      }),
    ]);
    if (timer !== undefined) clearTimeout(timer);
    if (response === pending) {
      void run.catch((error: unknown) => console.error("[specialists] run failed", error));
      return { accepted: true };
    }
    const error = responseError(response);
    if (error !== null) throw new Error(error);
    return { accepted: true };
  });
