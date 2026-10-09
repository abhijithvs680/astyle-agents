/**
 * Number presentation for reports.
 *
 * Agents send figures as they come out of the data, which in practice means
 * `7742752.64`. Printed raw into a KPI slot that is one of four across, it
 * either overflows or wraps to three lines. These helpers split a figure into
 * a headline a reader can take in at a glance and the exact value underneath,
 * so nothing is hidden and nothing is unreadable.
 */

/** Thousands separators for any decimal run inside a longer string. */
export function formatDisplayValue(value: string | null | undefined): string {
  if (!value) return value ?? "";
  return value.replace(/-?\d+\.\d+/g, (m) => {
    const n = Number(m);
    if (!Number.isFinite(n)) return m;
    return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  });
}

/**
 * Values at or above this are shown compact (₹14.79K / ₹77.43L / $7.74M) in
 * large stat slots — five digits plus paise is already too wide for a
 * four-column KPI strip.
 */
const COMPACT_STAT_MIN = 10_000;

/** Up to two decimals, trailing zeros dropped: 77.40 → "77.4", 5.00 → "5". */
function shortNumber(n: number) {
  return n.toFixed(2).replace(/\.?0+$/, "");
}

/** Indian units (K / L / Cr) by default; K / M / B when the value is in $, €, £ or USD/EUR/GBP. */
export function compactNumber(n: number, western: boolean) {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  const units: Array<[number, string]> = western
    ? [
        [1e3, "K"],
        [1e6, "M"],
        [1e9, "B"],
      ]
    : [
        [1e3, "K"],
        [1e5, "L"],
        [1e7, "Cr"],
      ];
  // Largest unit that fits, then step up if rounding reaches the next one
  // (₹99,999.99 → "₹1L", not "₹100K").
  let i = 0;
  while (i < units.length - 1 && abs >= units[i + 1]![0]) i++;
  while (
    i < units.length - 1 &&
    Number(shortNumber(abs / units[i]![0])) * units[i]![0] >= units[i + 1]![0]
  )
    i++;
  const [size, label] = units[i]!;
  return `${sign}${shortNumber(abs / size)}${label}`;
}

export type CompactStat = { short: string; full: string | null };

/**
 * Split a big stat into a short headline and the exact figure, e.g.
 * "₹7742752.64" → { short: "₹77.43L", full: "₹77,42,752.64" },
 * "78912345 units" → { short: "7.89Cr units", full: "7,89,12,345 units" }.
 * Indian units and grouping by default; western (K / M / B) for $, €, £.
 * Text that isn't a single number with a short prefix/suffix is returned as-is.
 */
export function compactStatValue(value: string | null | undefined): CompactStat {
  const display = formatDisplayValue(value);
  const match = (value ?? "")
    .trim()
    .match(/^([^\d+-]{0,8}?)\s*([+-]?\d[\d,]*(?:\.\d+)?)(\s*[^\d]{0,20})$/);
  if (!match) return { short: display, full: null };

  const rawPrefix = (match[1] ?? "").trim();
  // Keep a space after word prefixes ("INR 1.5Cr", "Rs. 12Cr"), none after symbols ("₹77L").
  const prefix = /[a-z.]$/i.test(rawPrefix) ? `${rawPrefix} ` : rawPrefix;
  const suffix = match[3] ?? "";
  const n = Number((match[2] ?? "").replace(/,/g, ""));
  // A percentage is already compact, and "77.4%" must never become "77.4K%".
  if (!Number.isFinite(n) || suffix.includes("%")) return { short: display, full: null };

  const western = /[$€£]|usd|eur|gbp/i.test(prefix + suffix);
  const locale = western ? "en-US" : "en-IN";
  const full = `${prefix}${n.toLocaleString(locale, { maximumFractionDigits: 2 })}${suffix}`;
  if (Math.abs(n) < COMPACT_STAT_MIN) return { short: full, full: null };
  return { short: `${prefix}${compactNumber(n, western)}${suffix}`, full };
}

/** Axis ticks: compact so a 7-figure axis doesn't eat a third of the chart. */
export function axisTick(value: unknown): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return String(value ?? "");
  if (Math.abs(value) < 1000) return shortNumber(value);
  return compactNumber(value, false);
}
