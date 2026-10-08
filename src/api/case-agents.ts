import { createServerFn } from "@tanstack/react-start";

import { postAuthenticated } from "./client.server";

export type Specialist = {
  id: string;
  title: string;
  role: string | null;
  description: string | null;
  prompt: string | null;
  status: string | null;
  dataSources: Array<string>;
};

const ENVELOPE_KEYS = new Set(["jscodes", "workflowlogid", "echo", "time", "errors", "value"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizedKey(key: string): string {
  return key.replace(/[^a-z0-9]/gi, "").toLowerCase();
}

function read(row: Record<string, unknown>, ...aliases: string[]): unknown {
  const match = Object.keys(row).find((key) => aliases.includes(normalizedKey(key)));
  return match === undefined ? undefined : row[match];
}

function display(value: unknown): string | null {
  if (typeof value === "string") return value.trim() || null;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return null;
}

function unpack(value: unknown): Array<Record<string, unknown>> {
  if (typeof value === "string") {
    try {
      return unpack(JSON.parse(value));
    } catch {
      return [];
    }
  }
  if (Array.isArray(value)) return value.flatMap(unpack);
  if (!isRecord(value)) return [];

  for (const key of ["agents", "caseagents", "data", "results", "rows", "body", "response"]) {
    const nested = read(value, key);
    if (nested !== undefined && nested !== null) {
      const rows = unpack(nested);
      if (rows.length > 0) return rows;
    }
  }

  const keys = Object.keys(value).filter((key) => !ENVELOPE_KEYS.has(normalizedKey(key)));
  return keys.length === 0 ? [] : [value];
}

function toSpecialist(row: Record<string, unknown>, index: number): Specialist {
  const id = display(read(row, "agentid", "caseagentid", "id", "rowid")) ?? `specialist-${index}`;
  const title =
    display(read(row, "title", "agenttitle", "name", "agentname", "caseagentname")) ??
    `Specialist ${index + 1}`;
  const role = display(read(row, "role", "category", "agentcategory", "type"));
  const description = display(read(row, "description", "agentdescription", "summary", "objective"));
  const prompt = display(read(row, "prompt", "instructions", "agentprompt"));
  const status = display(read(row, "status", "agentstatus", "isactive", "state"));
  const access = display(read(row, "dbaccess", "datasources", "dataaccess"));
  const dataSources =
    access === null
      ? []
      : [...new Set(access.split(",").map((item) => item.trim()))].filter(Boolean);

  return { id, title, role, description, prompt, status, dataSources };
}

/** Read the live specialist catalog using the existing signed-in session. */
export const fetchCaseAgents = createServerFn({ method: "POST" }).handler(
  async (): Promise<Array<Specialist>> => {
    const response = await postAuthenticated("getCaseAgents");
    return unpack(response).map(toSpecialist);
  },
);
