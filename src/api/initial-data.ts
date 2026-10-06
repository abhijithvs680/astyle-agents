/**
 * Landing-page bootstrap data (session history).
 *
 * Runs on the server: the bearer token comes from the session cookie and the
 * user's email is read out of that token's claims, so the client never supplies
 * either.
 */
import { createServerFn } from "@tanstack/react-start";

import { postAuthenticated } from "./client.server";
import { decodeTokenClaims } from "./jwt.server";
import { requireSessionToken } from "./session.server";
import type { SessionSummary } from "./types";

/**
 * One row as `astylev2getinitialdata...` returns it. The platform appends
 * `jsCodes` / `workflow_log_id` to every row; those are transport noise.
 *
 * Every field is optional because the live endpoint currently answers with
 * placeholder rows (`"test"` strings, empty dates), so nothing here is load
 * bearing until real data lands.
 */
type InitialDataRow = {
  SessionID?: number | string;
  UserID?: number | string;
  Title?: string;
  Model?: string;
  CreatedBy?: string;
  CreatedOn?: string;
  UpdatedBy?: string;
  UpdatedOn?: string;
  IsArchived?: string;
  Source?: string;
  rowID?: string;
};

function toSessionSummary(row: InitialDataRow, index: number): SessionSummary {
  const id =
    row.rowID ?? (row.SessionID !== undefined ? String(row.SessionID) : `session-${index}`);

  return {
    id,
    title: row.Title?.trim() ? row.Title : "Untitled session",
    model: row.Model ?? null,
    source: row.Source ?? null,
    createdOn: row.CreatedOn?.trim() ? row.CreatedOn : null,
    updatedOn: row.UpdatedOn?.trim() ? row.UpdatedOn : null,
    archived: isArchived(row.IsArchived),
  };
}

/**
 * `IsArchived` arrives as a string. Treat only explicit affirmatives as
 * archived — the placeholder value `"test"` must not hide a row.
 */
function isArchived(value: string | undefined): boolean {
  if (value === undefined) return false;
  const v = value.trim().toLowerCase();
  return v === "true" || v === "1" || v === "yes";
}

export const fetchInitialData = createServerFn({ method: "POST" }).handler(
  async (): Promise<Array<SessionSummary>> => {
    const token = await requireSessionToken();
    const email = decodeTokenClaims(token)?.email;

    if (email === undefined) {
      throw new Error("Session token carries no email claim.");
    }

    const rows = (await postAuthenticated("getInitialData", { email })) as Array<InitialDataRow>;

    return rows.map(toSessionSummary).filter((session) => !session.archived);
  },
);
