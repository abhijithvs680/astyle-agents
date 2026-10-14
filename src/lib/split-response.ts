/**
 * Repair for background-workflow envelopes whose `response` string was split.
 *
 * Seen in practice on both `report_gen_plan` and report events: the platform
 * splits `response` on `;` without escaping it, keeps the first piece as
 * `response` and emits every later piece as a null-valued key, in order. It
 * only happens when the agent's prose contains a semicolon, which is why it is
 * intermittent — and why the stored copy, which is not built this way, loads.
 */

/**
 * Fields the platform's background-workflow envelope is expected to carry.
 * Anything else is a fragment of `response` that leaked out of the string.
 */
const ENVELOPE_KEYS = new Set([
  "USER_ID",
  "Session_ID",
  "session_id",
  "response",
  "conversation_id",
  "userId",
  "tag",
  "jobId",
  "icon",
  "type",
  "data",
  "web_domain",
]);

/** Keys that are really fragments of a broken `response` string. */
export function strayEnvelopeKeys(envelope: Record<string, unknown>): Array<string> {
  return Object.keys(envelope).filter((key) => !ENVELOPE_KEYS.has(key));
}

/**
 * Stitch a split `response` back together and parse it.
 *
 * Object key order follows the wire order, so the fragments line up. The
 * separator itself is lost, so try the likely ones and keep the first join
 * that parses. Returns undefined when there is nothing to repair or no join
 * parses.
 */
export function repairSplitResponse(
  envelope: Record<string, unknown>,
  head: string,
  parse: (json: string) => unknown,
): unknown {
  const fragments = strayEnvelopeKeys(envelope).filter((key) => envelope[key] === null);
  if (fragments.length === 0) return undefined;

  for (const separator of [";", ",", ""]) {
    const parsed = parse([head, ...fragments].join(separator));
    if (parsed !== undefined) return parsed;
  }
  return undefined;
}
