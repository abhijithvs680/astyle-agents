/**
 * Chart colours, read from the stylesheet rather than hardcoded.
 *
 * Recharts wants real colour strings for strokes, fills and inline tooltip
 * styles, so `var(--chart-1)` is not reliably enough on its own. The computed
 * values are read off `<html>` after mount and handed to the chart as plain
 * colours, so retuning the palette in `styles.css` retunes every chart with it
 * and no chart carries its own copy of the brand.
 */
import { useEffect, useState } from "react";

export type ChartTheme = {
  /** Categorical series colours, in assignment order. */
  series: Array<string>;
  /** Tone colours for sparklines and thresholds. */
  tone: Record<"critical" | "warning" | "info" | "good" | "neutral", string>;
  grid: string;
  axis: string;
  surface: string;
  border: string;
  popover: string;
  popoverForeground: string;
  cursor: string;
};

/** Values used until the first measurement lands (SSR and the first paint). */
const FALLBACK: ChartTheme = {
  series: [
    "oklch(0.45 0.16 276)",
    "oklch(0.6 0.1 175)",
    "oklch(0.7 0.13 70)",
    "oklch(0.6 0.15 22)",
    "oklch(0.55 0.02 270)",
    "oklch(0.58 0.165 278)",
  ],
  tone: {
    critical: "oklch(0.55 0.17 22)",
    warning: "oklch(0.7 0.14 68)",
    info: "oklch(0.49 0.17 276)",
    good: "oklch(0.53 0.105 165)",
    neutral: "oklch(0.555 0.012 70)",
  },
  grid: "oklch(0.912 0.007 80)",
  axis: "oklch(0.5 0.012 70)",
  surface: "oklch(1 0 0)",
  border: "oklch(0.912 0.007 80)",
  popover: "oklch(1 0 0)",
  popoverForeground: "oklch(0.2 0.012 270)",
  cursor: "oklch(0.966 0.006 85)",
};

function read(styles: CSSStyleDeclaration, name: string, fallback: string): string {
  const value = styles.getPropertyValue(name).trim();
  return value === "" ? fallback : value;
}

function measure(): ChartTheme {
  const styles = getComputedStyle(document.documentElement);
  return {
    series: [
      read(styles, "--chart-1", FALLBACK.series[0]!),
      read(styles, "--chart-2", FALLBACK.series[1]!),
      read(styles, "--chart-3", FALLBACK.series[2]!),
      read(styles, "--chart-4", FALLBACK.series[3]!),
      read(styles, "--chart-5", FALLBACK.series[4]!),
      read(styles, "--brand-blue", FALLBACK.series[5]!),
    ],
    tone: {
      critical: read(styles, "--negative", FALLBACK.tone.critical),
      warning: read(styles, "--chart-3", FALLBACK.tone.warning),
      info: read(styles, "--brand-blue", FALLBACK.tone.info),
      good: read(styles, "--positive", FALLBACK.tone.good),
      neutral: read(styles, "--muted-foreground", FALLBACK.tone.neutral),
    },
    grid: read(styles, "--border", FALLBACK.grid),
    axis: read(styles, "--muted-foreground", FALLBACK.axis),
    surface: read(styles, "--surface", FALLBACK.surface),
    border: read(styles, "--border", FALLBACK.border),
    popover: read(styles, "--popover", FALLBACK.popover),
    popoverForeground: read(styles, "--popover-foreground", FALLBACK.popoverForeground),
    cursor: read(styles, "--tile", FALLBACK.cursor),
  };
}

/** The chart palette, measured from the stylesheet once the DOM exists. */
export function useChartTheme(): ChartTheme {
  const [colors, setColors] = useState<ChartTheme>(FALLBACK);

  useEffect(() => {
    setColors(measure());
  }, []);

  return colors;
}
