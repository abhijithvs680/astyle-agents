/**
 * Renders a generated report as a document.
 *
 * Every block in `docs/report-template.json` has a component here, and the
 * visual language follows the rest of the product: a numbered spine, serif
 * section titles, and figures set in the numeric face so columns line up.
 *
 * Colour is owned here, never by the agent: blocks carry a `tone`, and this
 * file decides what that looks like. Agent-chosen hex values would drift
 * between blocks and break contrast. Chart colours come from the theme via
 * `useChartTheme`, so a chart is legible in dark mode without a second palette.
 */
import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minus,
  Table2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { Report, ReportBlock, SeriesSpec, Slice, Tone, TrendData } from "../lib/report";
import { useAgentDirectory } from "../lib/agent-directory";
import { useChartTheme, type ChartTheme } from "../lib/chart-theme";
import { axisTick, compactStatValue, formatDisplayValue } from "../lib/report-format";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useLanguage } from "../context/LanguageContext";
import { TranslatableText } from "./TranslatableText";
import { useTranslate } from "../hooks/useTranslate";

/** Tone styling for chips, callouts and list markers. Paired for both themes. */
const TONE_STYLES: Record<Tone, { text: string; bg: string; border: string; dot: string }> = {
  critical: {
    text: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
    dot: "bg-rose-500",
  },
  warning: {
    text: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  info: {
    text: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  good: {
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  neutral: {
    text: "text-muted-foreground",
    bg: "bg-tile",
    border: "border-border",
    dot: "bg-muted-foreground",
  },
};

/** Priority on an action card: a ring marker plus one word, never a chip. */
const PRIORITY_DOTS: Record<string, string> = {
  high: "border-rose-400",
  medium: "border-amber-400",
  low: "border-border",
};

const PRIORITY_TEXT: Record<string, string> = {
  high: "text-rose-600",
  medium: "text-amber-600",
  low: "text-muted-foreground",
};

/**
 * Short label for a section whose own eyebrow is missing or just repeats
 * the heading.
 *
 * The capsule is there to say what kind of thing the section is before the
 * heading says what it found, so echoing the heading wastes the slot.
 */
const COMPONENT_EYEBROW: Record<string, string> = {
  narrative: "Context",
  callout: "Note",
  insightList: "Findings",
  kpiRibbon: "Key figures",
  table: "Detail",
  reportBar: "Comparison",
  groupedBar: "Comparison",
  donut: "Breakdown",
  pie: "Breakdown",
  lineTrend: "Trend",
  areaTrend: "Trend",
  forecastTrend: "Forecast",
  scenarioCompare: "Scenarios",
  varianceBridge: "Variance",
  paceTracker: "Pace",
  radar: "Diagnostic",
};

function blockEyebrow(block: ReportBlock): string {
  const fallback = COMPONENT_EYEBROW[block.component] ?? "Section";
  const eyebrow = block.eyebrow?.trim();
  if (eyebrow === undefined || eyebrow === "") return fallback;
  // An eyebrow that only restates the heading tells the reader nothing.
  return eyebrow.toLowerCase() === block.title.trim().toLowerCase() ? fallback : eyebrow;
}

/** Two-digit section index: "01", "02", … */
function sectionNumber(index: number): string {
  return String(index + 1).padStart(2, "0");
}

// ------------------------------------------------------------------- primitives

/** Large stat that never wraps: compact headline plus the exact value under it. */
function StatValue({
  value,
  className,
  fullClassName = "text-muted-foreground",
}: {
  value: string | null | undefined;
  className: string;
  fullClassName?: string;
}) {
  const { short, full } = compactStatValue(value);
  return (
    <>
      <span className={`block truncate whitespace-nowrap ${className}`} title={full ?? short}>
        {short}
      </span>
      {full !== null ? (
        <span
          className={`mt-1.5 block truncate whitespace-nowrap text-xs font-medium tabular-nums ${fullClassName}`}
        >
          {full}
        </span>
      ) : null}
    </>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/80 bg-surface p-5 shadow-2xs sm:p-6">
      {children}
    </div>
  );
}

function CountPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-tile/60 px-3 py-1 text-xs font-medium tabular-nums text-muted-foreground">
      {label}
    </span>
  );
}

function ChartFrame({
  children,
  expanded = false,
}: {
  children: React.ReactElement;
  expanded?: boolean;
}) {
  return (
    <div className={expanded ? "h-[min(62vh,600px)] w-full" : "h-40 w-full sm:h-48"}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

function TrendLegend({ series, colors }: { series: Array<SeriesSpec>; colors: ChartTheme }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-4 text-xs font-medium">
      {series.map((entry, index) => (
        <span key={entry.key} className="flex items-center gap-1.5">
          <span
            className="size-3 rounded"
            style={{ background: colors.series[index % colors.series.length] }}
          />
          <span className="text-foreground/80">
            <TranslatableText text={entry.label} />
          </span>
        </span>
      ))}
    </div>
  );
}

/** Shared Recharts chrome, themed. */
function useChartChrome(colors: ChartTheme) {
  return useMemo(
    () => ({
      axis: { fontSize: 11, fill: colors.axis } as const,
      tooltip: {
        borderRadius: 12,
        border: `1px solid ${colors.border}`,
        background: colors.popover,
        color: colors.popoverForeground,
        fontSize: 12,
        boxShadow: "0 6px 16px -6px rgb(28 25 23 / 0.18)",
      },
      itemStyle: { color: colors.popoverForeground },
      labelStyle: { color: colors.popoverForeground, fontWeight: 600 },
    }),
    [colors],
  );
}

// ------------------------------------------------------------------ the blocks

function ReportBarChart({
  data,
  expanded = false,
}: {
  data: Extract<ReportBlock, { component: "reportBar" }>["data"];
  expanded?: boolean;
}) {
  // Heights are derived here, never sent: an agent computing layout is an
  // agent that will eventually compute it wrong.
  const max = Math.max(...data.bars.map((bar) => Math.abs(bar.value)), 1);
  const colors = useChartTheme();

  return (
    <Card>
      {data.valueLabel !== undefined ? (
        <span className="mb-4 inline-flex items-center rounded-full border border-border bg-tile/60 px-3 py-1 text-xs font-medium text-muted-foreground">
          <TranslatableText text={data.valueLabel} />
        </span>
      ) : null}

      <div className="no-scrollbar overflow-x-auto pb-1">
        <div className="min-w-[300px]">
          <div
            className={`relative flex w-full items-end justify-around px-4 pt-10 sm:px-8 ${expanded ? "h-[min(52vh,500px)]" : "h-32 sm:h-40"}`}
          >
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
              {[0, 1, 2, 3].map((line) => (
                <div key={line} className="w-full border-b border-dashed border-border/70" />
              ))}
            </div>

            {data.bars.map((bar) => (
              <div
                key={bar.label}
                className="group relative z-20 flex h-full min-w-0 flex-1 flex-col items-center justify-end"
              >
                <div className="mb-2 whitespace-nowrap font-numeric-compact text-base tabular-nums text-foreground">
                  {bar.formattedValue}
                </div>
                <div
                  style={{
                    height: `${Math.max(4, (Math.abs(bar.value) / max) * 100)}%`,
                    background: colors.series[0],
                  }}
                  className="w-full max-w-10 rounded-t-md transition-all duration-500 sm:max-w-14"
                />
              </div>
            ))}
          </div>

          <div className="w-full border-t border-border" />

          <div className="flex items-start justify-around px-2 pt-3 sm:px-6">
            {data.bars.map((bar) => (
              <div key={bar.label} className="min-w-0 flex-1 space-y-0.5 px-1 text-center">
                <span className="block truncate text-xs font-semibold leading-tight text-foreground sm:text-sm">
                  <TranslatableText text={bar.label} />
                </span>
                {bar.subtext !== undefined ? (
                  <span className="block text-[11px] leading-tight text-muted-foreground sm:text-xs">
                    <TranslatableText text={bar.subtext} />
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

/** Standalone KPI ribbon, used when a kpiRibbon is not the report's opener. */
function KpiRibbon({ data }: { data: Extract<ReportBlock, { component: "kpiRibbon" }>["data"] }) {
  const columns =
    data.cards.length === 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : data.cards.length === 2
        ? "sm:grid-cols-2"
        : "sm:grid-cols-3";

  return (
    <div className={`grid grid-cols-1 gap-4 ${columns}`}>
      {data.cards.map((card) => (
        <div key={card.label} className="rounded-2xl border border-border/80 bg-surface p-5">
          <KpiCardBody
            card={card}
            valueClass="font-numeric text-[30px] leading-none tracking-tight tabular-nums text-foreground"
          />
        </div>
      ))}
    </div>
  );
}

type KpiCard = Extract<ReportBlock, { component: "kpiRibbon" }>["data"]["cards"][number];

/**
 * Headline figure for the summary strip: number first, then what it is.
 *
 * Reading order is deliberate — the figure is the point, the label only tells
 * you which figure it was. A critical reading is set in the negative colour so
 * the strip can be scanned without reading any of the captions.
 */
function StatCell({ card }: { card: KpiCard }) {
  const { short, full } = compactStatValue(card.value);
  const caption = card.delta ?? full;

  return (
    <div className="min-w-0">
      <span
        className={`block truncate whitespace-nowrap font-numeric text-[25px] leading-none sm:text-[29px] ${
          card.deltaTone === "critical" ? "text-negative" : "text-foreground"
        }`}
        title={full ?? short}
      >
        {short}
      </span>
      <span
        className="mt-2.5 block text-[10px] font-semibold uppercase leading-tight tracking-[0.13em] text-foreground/70"
        title={card.label}
      >
        <TranslatableText text={card.label} />
      </span>
      {caption !== null && caption !== undefined ? (
        <span className="mt-1 block text-[11px] leading-snug text-muted-foreground">
          {caption}
        </span>
      ) : null}
    </div>
  );
}

/** The four-up headline strip that closes the summary card. */
function StatStrip({ cards }: { cards: Array<KpiCard> }) {
  return (
    <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-9 border-t border-border/70 pt-9 sm:grid-cols-4 sm:gap-x-0 sm:divide-x sm:divide-border/70">
      {cards.map((card) => (
        <div key={card.label} className="min-w-0 sm:px-5 sm:first:pl-0 sm:last:pr-0">
          <StatCell card={card} />
        </div>
      ))}
    </dl>
  );
}

function KpiCardBody({ card, valueClass }: { card: KpiCard; valueClass: string }) {
  const Icon =
    card.deltaDirection === "down"
      ? TrendingDown
      : card.deltaDirection === "flat"
        ? Minus
        : TrendingUp;

  return (
    <>
      <span
        className="block min-h-[2lh] text-[11px] font-semibold uppercase leading-tight tracking-[0.14em] text-muted-foreground"
        title={card.label}
      >
        <TranslatableText text={card.label} />
      </span>
      <div className="mt-2 min-w-0">
        <StatValue value={card.value} className={valueClass} />
      </div>
      {card.delta !== undefined ? (
        /* Coloured by the agent's tone, not by the arrow direction: whether a
 number going up is good depends on the number. */
        <div
          className={`mt-2 flex items-center gap-1 text-[11px] font-semibold tabular-nums ${
            TONE_STYLES[card.deltaTone ?? "neutral"].text
          }`}
        >
          <Icon className="size-3" aria-hidden="true" />
          <span>{card.delta}</span>
        </div>
      ) : null}
    </>
  );
}

function SliceChart({
  slices,
  centerMetric,
  donut,
  expanded = false,
}: {
  slices: Array<Slice>;
  centerMetric?: { label: string; value: string; caption?: string };
  donut: boolean;
  expanded?: boolean;
}) {
  const colors = useChartTheme();
  const chrome = useChartChrome(colors);

  return (
    <Card>
      <div
        className="grid items-center gap-6"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))" }}
      >
        <div className="relative min-w-0">
          <ChartFrame expanded={expanded}>
            <PieChart>
              <Tooltip
                contentStyle={chrome.tooltip}
                itemStyle={chrome.itemStyle}
                labelStyle={chrome.labelStyle}
              />
              <Pie
                data={slices}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={donut ? "66%" : 0}
                outerRadius="88%"
                paddingAngle={donut ? 2 : 0}
              >
                {slices.map((slice, index) => (
                  <Cell
                    key={slice.name}
                    fill={colors.series[index % colors.series.length]}
                    stroke={colors.surface}
                    strokeWidth={2}
                  />
                ))}
              </Pie>
            </PieChart>
          </ChartFrame>

          {donut && centerMetric !== undefined ? (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                <TranslatableText text={centerMetric.label} />
              </span>
              <span className="font-numeric text-[22px] leading-tight tabular-nums text-foreground">
                <TranslatableText text={centerMetric.value} />
              </span>
              {centerMetric.caption !== undefined ? (
                <span className="text-[10px] leading-tight text-muted-foreground">
                  <TranslatableText text={centerMetric.caption} />
                </span>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="min-w-0 space-y-3">
          {slices.map((slice, index) => (
            <div key={slice.name} className="flex items-start justify-between gap-3 text-sm">
              <span className="flex min-w-0 flex-wrap items-center gap-2">
                <span
                  className="size-2.5 shrink-0 rounded-sm"
                  style={{ background: colors.series[index % colors.series.length] }}
                />
                <span className="min-w-0 font-medium text-foreground">
                  <TranslatableText text={slice.name} />
                </span>
                {slice.highlight !== undefined ? (
                  <span className="rounded-full bg-tile px-2 py-0.5 text-[11px] text-muted-foreground">
                    <TranslatableText text={slice.highlight} />
                  </span>
                ) : null}
              </span>
              <span className="shrink-0 font-numeric-compact tabular-nums text-muted-foreground">
                {slice.share !== undefined ? `${slice.share}%` : slice.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function Trend({
  data,
  filled,
  expanded = false,
}: {
  data: TrendData;
  filled: boolean;
  expanded?: boolean;
}) {
  const Chart = filled ? AreaChart : LineChart;
  const gradientId = useId().replace(/:/g, "");
  const colors = useChartTheme();
  const chrome = useChartChrome(colors);
  const seriesColor = (index: number) => colors.series[index % colors.series.length]!;

  return (
    <Card>
      <TrendLegend series={data.series} colors={colors} />
      <ChartFrame expanded={expanded}>
        <Chart data={data.rows} margin={{ top: 10, right: 10, left: -12, bottom: 0 }}>
          <defs>
            {data.series.map((entry, index) => (
              <linearGradient
                key={entry.key}
                id={`${gradientId}-fill-${entry.key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={seriesColor(index)} stopOpacity={0.35} />
                <stop offset="95%" stopColor={seriesColor(index)} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
          <XAxis dataKey={data.xKey} tick={chrome.axis} tickLine={false} axisLine={false} />
          <YAxis tick={chrome.axis} tickLine={false} axisLine={false} tickFormatter={axisTick} />
          <Tooltip
            contentStyle={chrome.tooltip}
            itemStyle={chrome.itemStyle}
            labelStyle={chrome.labelStyle}
          />
          {data.threshold !== undefined ? (
            <ReferenceLine
              y={data.threshold.value}
              stroke={colors.axis}
              strokeDasharray="4 4"
              label={{ value: data.threshold.label, position: "insideTopRight", ...chrome.axis }}
            />
          ) : null}
          {data.series.map((entry, index) =>
            filled ? (
              <Area
                key={entry.key}
                type="monotone"
                dataKey={entry.key}
                name={entry.label}
                stroke={seriesColor(index)}
                strokeWidth={entry.emphasis === "primary" ? 2.5 : 1.5}
                fill={`url(#${gradientId}-fill-${entry.key})`}
                dot={false}
              />
            ) : (
              <Line
                key={entry.key}
                type="monotone"
                dataKey={entry.key}
                name={entry.label}
                stroke={seriesColor(index)}
                strokeWidth={entry.emphasis === "primary" ? 2.5 : 1.5}
                strokeDasharray={entry.emphasis === "secondary" ? "5 4" : undefined}
                dot={false}
              />
            ),
          )}
        </Chart>
      </ChartFrame>
    </Card>
  );
}

function GroupedBars({
  data,
  expanded = false,
}: {
  data: Omit<TrendData, "threshold">;
  expanded?: boolean;
}) {
  const colors = useChartTheme();
  const chrome = useChartChrome(colors);

  return (
    <Card>
      <TrendLegend series={data.series} colors={colors} />
      <ChartFrame expanded={expanded}>
        <BarChart data={data.rows} margin={{ top: 10, right: 10, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
          <XAxis dataKey={data.xKey} tick={chrome.axis} tickLine={false} axisLine={false} />
          <YAxis tick={chrome.axis} tickLine={false} axisLine={false} tickFormatter={axisTick} />
          <Tooltip
            cursor={{ fill: colors.cursor }}
            contentStyle={chrome.tooltip}
            itemStyle={chrome.itemStyle}
            labelStyle={chrome.labelStyle}
          />
          <Legend wrapperStyle={{ display: "none" }} />
          {data.series.map((entry, index) => (
            <Bar
              key={entry.key}
              dataKey={entry.key}
              name={entry.label}
              fill={colors.series[index % colors.series.length]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ChartFrame>
    </Card>
  );
}

function RadarDiagnostic({
  data,
  expanded = false,
}: {
  data: Extract<ReportBlock, { component: "radar" }>["data"];
  expanded?: boolean;
}) {
  const max = Math.max(...data.axes.map((axis) => axis.fullMark), 1);
  const colors = useChartTheme();
  const chrome = useChartChrome(colors);
  const { t } = useLanguage();

  return (
    <Card>
      {data.overallScore !== undefined ? (
        <div className="mb-2 flex justify-end">
          <span className="rounded-full border border-border bg-tile/60 px-3 py-1 text-xs font-medium tabular-nums text-muted-foreground">
            {t("reportView.overallScore", { defaultValue: "Overall score" })}: {data.overallScore}/
            {data.scoreOutOf ?? 100}
          </span>
        </div>
      ) : null}

      <ChartFrame expanded={expanded}>
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data.axes}>
          <PolarGrid stroke={colors.grid} />
          <PolarAngleAxis dataKey="subject" tick={chrome.axis} />
          <PolarRadiusAxis domain={[0, max]} tick={false} axisLine={false} />
          <Radar
            name="Score"
            dataKey="score"
            stroke={colors.series[0]}
            fill={colors.series[0]}
            fillOpacity={0.3}
          />
          <Tooltip
            contentStyle={chrome.tooltip}
            itemStyle={chrome.itemStyle}
            labelStyle={chrome.labelStyle}
          />
        </RadarChart>
      </ChartFrame>
    </Card>
  );
}

/**
 * A column that only counts the rows.
 *
 * Agents sometimes lead a table with a 1..n index. It costs a column and
 * tells the reader nothing the row order does not, so it is dropped before
 * the table is laid out.
 */
function isRowNumberColumn(
  column: { key: string; label: string },
  rows: Array<Record<string, unknown>>,
): boolean {
  const label = column.label.trim().toLowerCase().replace(/[.\s]/g, "");
  const labelled = ["", "#", "no", "sno", "slno", "srno", "index", "row", "rowno"].includes(
    label,
  );
  if (!labelled) return false;
  // Only when the values really are the row numbers: a column called "No"
  // could legitimately hold something else.
  return rows.every((row, index) => {
    const value = row[column.key];
    return (
      value === index + 1 ||
      (typeof value === "string" && value.trim() === String(index + 1))
    );
  });
}

function DataTable({
  data,
  expanded = false,
}: {
  data: Extract<ReportBlock, { component: "table" }>["data"];
  expanded?: boolean;
}) {
  const columns = data.columns.filter(
    (column, index) => !(index === 0 && isRowNumberColumn(column, data.rows)),
  );

  return (
    <div
      className={`subtle-scrollbar overflow-hidden rounded-2xl border border-border/70 bg-surface ${expanded ? "max-h-[calc(90dvh-10rem)] overflow-auto" : "overflow-x-auto"}`}
    >
      <table className="w-full min-w-max text-sm">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`sticky top-0 bg-foreground px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.13em] text-background ${
                  column.align === "right" ? "text-right" : "text-left"
                }`}
              >
                <TranslatableText text={column.label} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/70">
          {data.rows.map((row, index) => (
            <tr key={index} className="transition-colors hover:bg-tile/40">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`px-6 py-4 ${column.align === "right" ? "text-right font-numeric-compact tabular-nums" : "text-left"} ${
                    column.emphasis === true
                      ? "font-semibold text-foreground"
                      : "text-foreground/80"
                  }`}
                >
                  {typeof row[column.key] === "string" ? (
                    <TranslatableText text={row[column.key] as string} />
                  ) : (
                    cellText(row[column.key])
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Cells arrive pre-formatted; anything else is shown rather than hidden. */
// ---------------------------------------------------------------- forecasting

/**
 * Actuals as a solid line, projection as a dashed one, uncertainty as a band.
 *
 * The split is the whole point: a projection drawn like history reads like
 * history. The two series never share a row, so the solid line simply stops
 * where the dashed one starts.
 */
function ForecastTrend({
  data,
  expanded = false,
}: {
  data: Extract<ReportBlock, { component: "forecastTrend" }>["data"];
  expanded?: boolean;
}) {
  const colors = useChartTheme();
  const chrome = useChartChrome(colors);
  const gradientId = useId().replace(/:/g, "");
  const { t } = useLanguage();

  // History and projection are the same measure, so they share a hue; the
  // projection is dashed and lightened to say "same thing, less certain".
  // A second hue would wrongly read as a second series.
  const measure = colors.series[0]!;
  const PROJECTED_OPACITY = 0.7;

  // Recharts draws a range area from a [low, high] tuple, and the join row
  // carries the last actual as a forecast too so the two lines meet.
  const rows = useMemo(() => {
    const prepared = data.rows.map((row) => ({
      ...row,
      band:
        row.lower !== undefined && row.upper !== undefined
          ? ([row.lower, row.upper] as [number, number])
          : undefined,
    }));
    const lastActual = prepared.filter((row) => row.actual !== undefined).pop();
    if (lastActual?.actual !== undefined && lastActual.forecast === undefined) {
      lastActual.forecast = lastActual.actual;
    }
    return prepared;
  }, [data.rows]);

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium">
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-5 rounded" style={{ background: measure }} />
          <span className="text-foreground/80">
            {t("reportView.actual", { defaultValue: "Actual" })}
          </span>
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="h-0.5 w-5 rounded"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, ${measure} 0 4px, transparent 4px 7px)`,
              opacity: PROJECTED_OPACITY,
            }}
          />
          <span className="text-foreground/80">
            {t("reportView.forecast", { defaultValue: "Forecast" })}
          </span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-5 rounded-sm opacity-30" style={{ background: measure }} />
          <span className="text-foreground/80">
            {t("reportView.range", { defaultValue: "Likely range" })}
          </span>
        </span>
        {data.horizonLabel !== undefined ? <CountPill label={data.horizonLabel} /> : null}
      </div>

      <ChartFrame expanded={expanded}>
        <AreaChart data={rows} margin={{ top: 10, right: 10, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id={`${gradientId}-band`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={measure} stopOpacity={0.22} />
              <stop offset="100%" stopColor={measure} stopOpacity={0.06} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
          <XAxis dataKey={data.xKey} tick={chrome.axis} tickLine={false} axisLine={false} />
          <YAxis tick={chrome.axis} tickLine={false} axisLine={false} tickFormatter={axisTick} />
          <Tooltip
            contentStyle={chrome.tooltip}
            itemStyle={chrome.itemStyle}
            labelStyle={chrome.labelStyle}
          />

          <Area
            type="monotone"
            dataKey="band"
            name={t("reportView.range", { defaultValue: "Likely range" })}
            stroke="none"
            fill={`url(#${gradientId}-band)`}
            isAnimationActive={false}
            connectNulls
          />
          <Area
            type="monotone"
            dataKey="actual"
            name={t("reportView.actual", { defaultValue: "Actual" })}
            stroke={measure}
            strokeWidth={2.5}
            fill="none"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="forecast"
            name={t("reportView.forecast", { defaultValue: "Forecast" })}
            stroke={measure}
            strokeOpacity={PROJECTED_OPACITY}
            strokeWidth={2.5}
            strokeDasharray="6 4"
            fill="none"
            dot={false}
            connectNulls
          />

          {/* Where measurement stops and projection begins. */}
          {data.actualsThrough !== undefined ? (
            <ReferenceLine
              x={data.actualsThrough}
              stroke={colors.axis}
              strokeDasharray="3 3"
              label={{
                value: t("reportView.actualsThrough", { defaultValue: "Actuals to here" }),
                position: "insideTopLeft",
                ...chrome.axis,
              }}
            />
          ) : null}
          {data.threshold !== undefined ? (
            <ReferenceLine
              y={data.threshold.value}
              stroke={colors.tone.critical}
              strokeDasharray="4 4"
              label={{ value: data.threshold.label, position: "insideTopRight", ...chrome.axis }}
            />
          ) : null}
        </AreaChart>
      </ChartFrame>

      {data.valueLabel !== undefined ? (
        <p className="mt-3 text-xs text-muted-foreground">
          <TranslatableText text={data.valueLabel} />
        </p>
      ) : null}
    </Card>
  );
}

/** Base / upside / downside side by side, with the likeliest column called out. */
function ScenarioCompare({
  data,
}: {
  data: Extract<ReportBlock, { component: "scenarioCompare" }>["data"];
}) {
  const { t } = useLanguage();

  return (
    <div className="subtle-scrollbar overflow-x-auto rounded-2xl border border-border/80 bg-surface">
      <table className="w-full min-w-[420px] text-left">
        <thead>
          <tr className="border-b border-border bg-tile/50">
            <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {t("reportView.scenario", { defaultValue: "Scenario" })}
            </th>
            {data.measures.map((measure) => (
              <th
                key={measure.key}
                className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
              >
                <TranslatableText text={measure.label} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/70">
          {data.scenarios.map((scenario) => (
            <tr
              key={scenario.name}
              className={
                scenario.likeliest === true ? "bg-blue-50/60" : "transition-colors hover:bg-tile/40"
              }
            >
              <td className="px-5 py-4 align-top">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    <TranslatableText text={scenario.name} />
                  </span>
                  {scenario.likeliest === true ? (
                    <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-blue-700">
                      {t("reportView.likeliest", { defaultValue: "Likeliest" })}
                    </span>
                  ) : null}
                  {scenario.probability !== undefined ? (
                    <span className="font-numeric-compact text-xs tabular-nums text-muted-foreground">
                      {scenario.probability}
                    </span>
                  ) : null}
                </div>
                {scenario.assumption !== undefined ? (
                  <p className="mt-1 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
                    <TranslatableText text={formatDisplayValue(scenario.assumption)} />
                  </p>
                ) : null}
              </td>
              {data.measures.map((measure) => (
                <td key={measure.key} className="px-5 py-4 text-right align-top">
                  <span
                    className={`font-numeric whitespace-nowrap text-[20px] leading-none tabular-nums ${
                      scenario.likeliest === true ? "text-foreground" : "text-foreground/70"
                    }`}
                  >
                    {formatDisplayValue(scenario.values[measure.key]) || "—"}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Waterfall from plan to actual: what moved, and by how much. */
function VarianceBridge({
  data,
}: {
  data: Extract<ReportBlock, { component: "varianceBridge" }>["data"];
}) {
  const colors = useChartTheme();
  const chrome = useChartChrome(colors);

  // Each step floats on the running total, so the bar shows the move alone.
  const { bars, domain } = useMemo(() => {
    let running = data.startValue;
    let low = Math.min(data.startValue, data.endValue);
    let high = Math.max(data.startValue, data.endValue);

    const list: Array<{
      label: string;
      base: number;
      delta: number;
      value: number;
      formatted: string;
      kind: "total" | "up" | "down";
    }> = [
      {
        label: data.startLabel,
        base: 0,
        delta: data.startValue,
        value: data.startValue,
        formatted: data.startFormatted ?? data.startValue.toLocaleString(),
        kind: "total",
      },
    ];

    for (const step of data.steps) {
      const from = running;
      running += step.value;
      low = Math.min(low, from, running);
      high = Math.max(high, from, running);
      list.push({
        label: step.label,
        base: Math.min(from, running),
        delta: Math.abs(step.value),
        value: step.value,
        formatted:
          step.formattedValue ?? `${step.value > 0 ? "+" : ""}${step.value.toLocaleString()}`,
        kind: step.value < 0 ? "down" : "up",
      });
    }

    list.push({
      label: data.endLabel,
      base: 0,
      delta: data.endValue,
      value: data.endValue,
      formatted: data.endFormatted ?? data.endValue.toLocaleString(),
      kind: "total",
    });

    const pad = (high - low || Math.abs(high) || 1) * 0.12;
    return { bars: list, domain: [Math.min(0, low - pad), high + pad] as [number, number] };
  }, [data]);

  const fill = (kind: "total" | "up" | "down") =>
    kind === "total" ? colors.series[4] : kind === "down" ? colors.tone.critical : colors.tone.good;

  return (
    <Card>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bars} margin={{ top: 20, right: 10, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
            <XAxis
              dataKey="label"
              tick={chrome.axis}
              tickLine={false}
              axisLine={false}
              interval={0}
            />
            <YAxis
              domain={domain}
              tick={chrome.axis}
              tickLine={false}
              axisLine={false}
              tickFormatter={axisTick}
            />
            {/* The invisible base is what makes each step float. */}
            <Bar dataKey="base" stackId="bridge" fill="transparent" isAnimationActive={false} />
            <Bar dataKey="delta" stackId="bridge" radius={[4, 4, 0, 0]} isAnimationActive={false}>
              {bars.map((bar) => (
                <Cell key={bar.label} fill={fill(bar.kind)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs">
        {bars.map((bar) => (
          <span key={bar.label} className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm" style={{ background: fill(bar.kind) }} />
            <span className="text-muted-foreground">
              <TranslatableText text={bar.label} />
            </span>
            <span className="font-numeric-compact tabular-nums text-foreground">{bar.formatted}</span>
          </span>
        ))}
      </div>
    </Card>
  );
}

const PACE_TONE: Record<"onTrack" | "atRisk" | "offTrack", { chip: string; bar: string }> = {
  onTrack: {
    chip: "border-emerald-200 bg-emerald-50 text-emerald-700",
    bar: "bg-emerald-500",
  },
  atRisk: {
    chip: "border-amber-200 bg-amber-50 text-amber-700",
    bar: "bg-amber-500",
  },
  offTrack: {
    chip: "border-rose-200 bg-rose-50 text-rose-700",
    bar: "bg-rose-500",
  },
};

/** Where the period lands if nothing changes. */
function PaceTracker({
  data,
}: {
  data: Extract<ReportBlock, { component: "paceTracker" }>["data"];
}) {
  const { t } = useLanguage();
  const status = data.statusTone ?? "onTrack";
  const tones = PACE_TONE[status];

  const scale = Math.max(data.target, data.projectedLanding, data.actualToDate, 1);
  const pct = (value: number) => Math.min(100, Math.max(0, (value / scale) * 100));

  const statusLabel = {
    onTrack: t("reportView.onTrack", { defaultValue: "On track" }),
    atRisk: t("reportView.atRisk", { defaultValue: "At risk" }),
    offTrack: t("reportView.offTrack", { defaultValue: "Off track" }),
  }[status];

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-foreground">
            <TranslatableText text={data.label} />
          </h4>
          {data.periodLabel !== undefined ? (
            <p className="text-xs text-muted-foreground">
              <TranslatableText text={data.periodLabel} />
            </p>
          ) : null}
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${tones.chip}`}>
          {statusLabel}
        </span>
      </div>

      {/* Track: filled to date, with the projected landing and target marked. */}
      <div className="relative mt-7 h-3 w-full rounded-full bg-tile">
        <div
          className={`absolute inset-y-0 left-0 rounded-full ${tones.bar}`}
          style={{ width: `${pct(data.actualToDate)}%` }}
        />
        <div
          className="absolute -top-1 h-5 w-0.5 rounded-full bg-foreground/70"
          style={{ left: `${pct(data.projectedLanding)}%` }}
          title={t("reportView.projectedLanding", { defaultValue: "Projected landing" })}
        />
        <div
          className="absolute -top-2 h-7 w-0.5 rounded-full bg-brand-blue"
          style={{ left: `${pct(data.target)}%` }}
          title={t("reportView.target", { defaultValue: "Target" })}
        />
      </div>

      <dl className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {[
          {
            label: t("reportView.toDate", { defaultValue: "To date" }),
            value: data.actualFormatted ?? data.actualToDate.toLocaleString(),
            emphasis: false,
          },
          {
            label: t("reportView.projectedLanding", { defaultValue: "Projected landing" }),
            value: data.projectedFormatted ?? data.projectedLanding.toLocaleString(),
            emphasis: true,
          },
          {
            label: t("reportView.target", { defaultValue: "Target" }),
            value: data.targetFormatted ?? data.target.toLocaleString(),
            emphasis: false,
          },
        ].map((item) => (
          <div key={item.label} className="min-w-0">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {item.label}
            </dt>
            <dd className="mt-1.5 min-w-0">
              <StatValue
                value={item.value}
                className={`font-numeric leading-none tabular-nums ${
                  item.emphasis ? "text-[28px] text-foreground" : "text-[22px] text-foreground/75"
                }`}
              />
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-5 text-xs text-muted-foreground">
        {t("reportView.elapsedShare", {
          defaultValue: "{{percent}}% of the period elapsed",
          percent: Math.round(data.elapsedShare),
        })}
      </p>
    </Card>
  );
}

/** Cells arrive pre-formatted; anything else is shown rather than hidden. */
function cellText(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return value.toLocaleString();
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return value === null || value === undefined ? "—" : JSON.stringify(value);
}

function BlockBody({ block, expanded = false }: { block: ReportBlock; expanded?: boolean }) {
  switch (block.component) {
    case "narrative":
      return (
        <div className="space-y-4">
          {block.data.paragraphs.map((paragraph, index) => (
            <p key={index} className="text-[15px] leading-[1.75] text-foreground/85">
              <TranslatableText text={formatDisplayValue(paragraph)} />
            </p>
          ))}
        </div>
      );
    case "kpiRibbon":
      return <KpiRibbon data={block.data} />;
    case "reportBar":
      return <ReportBarChart data={block.data} expanded={expanded} />;
    case "groupedBar":
      return <GroupedBars data={block.data} expanded={expanded} />;
    case "donut":
      return (
        <SliceChart
          slices={block.data.slices}
          donut
          expanded={expanded}
          {...(block.data.centerMetric !== undefined
            ? { centerMetric: block.data.centerMetric }
            : {})}
        />
      );
    case "pie":
      return <SliceChart slices={block.data.slices} donut={false} expanded={expanded} />;
    case "lineTrend":
      return <Trend data={block.data} filled={false} expanded={expanded} />;
    case "areaTrend":
      return <Trend data={block.data} filled expanded={expanded} />;
    case "radar":
      return <RadarDiagnostic data={block.data} expanded={expanded} />;
    case "table":
      return <DataTable data={block.data} expanded={expanded} />;
    case "callout": {
      const styles = TONE_STYLES[block.data.tone];
      return (
        <div
          className={`flex items-start gap-3 rounded-2xl border p-5 ${styles.bg} ${styles.border}`}
        >
          <AlertTriangle className={`mt-0.5 size-4 shrink-0 ${styles.text}`} aria-hidden="true" />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-foreground">
              <TranslatableText text={block.data.heading} />
            </div>
            <p className="mt-1 text-sm leading-relaxed text-foreground/80">
              <TranslatableText text={formatDisplayValue(block.data.body)} />
            </p>
          </div>
        </div>
      );
    }
    case "forecastTrend":
      return <ForecastTrend data={block.data} expanded={expanded} />;
    case "scenarioCompare":
      return <ScenarioCompare data={block.data} />;
    case "varianceBridge":
      return <VarianceBridge data={block.data} />;
    case "paceTracker":
      return <PaceTracker data={block.data} />;
    case "insightList":
      return (
        <ul className="space-y-3">
          {block.data.items.map((item, index) => (
            <li key={index} className="flex items-start gap-3 text-[15px] text-foreground/85">
              <span
                className={`mt-[0.45rem] size-2 shrink-0 rounded-full ${TONE_STYLES[item.tone ?? "neutral"].dot}`}
              />
              <span className="leading-relaxed">
                {item.label !== undefined ? (
                  <span className="font-semibold text-foreground">
                    <TranslatableText text={item.label} />:{" "}
                  </span>
                ) : null}
                <TranslatableText text={formatDisplayValue(item.text)} />
              </span>
            </li>
          ))}
        </ul>
      );
  }
}

function canExpand(block: ReportBlock): boolean {
  return [
    "reportBar",
    "groupedBar",
    "donut",
    "pie",
    "lineTrend",
    "areaTrend",
    "radar",
    "table",
    "forecastTrend",
    "scenarioCompare",
  ].includes(block.component);
}

/** Spread helper: keeps `role` absent rather than explicitly undefined. */
function optionalRole(role: string | null | undefined): { role?: string } {
  return role === null || role === undefined || role.trim() === "" ? {} : { role };
}

/** An agent credited on a report, as the cover pill shows it. */
export type ReportAgent = { id: string; name: string; role?: string };

/** Tile tints for the stacked avatars, picked per agent so they stay stable. */
const AGENT_TINTS = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-slate-200 text-slate-700",
];

function agentTint(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return AGENT_TINTS[hash % AGENT_TINTS.length]!;
}

/**
 * Abstract marks instead of initials.
 *
 * Two agents often share a first letter, so an initial identified nothing; a
 * pattern is at least reliably distinct at this size. The name is still
 * spelled out in the list the pill opens, which is where identification
 * actually happens.
 */
const AGENT_PATTERNS = [
  // grid
  "M0 3h12M0 6h12M0 9h12M3 0v12M6 0v12M9 0v12",
  // diagonal hatch
  "M-2 4L4 -2M0 10L10 0M2 14L14 2",
  // concentric
  "M6 1.5a4.5 4.5 0 100 9 4.5 4.5 0 100-9M6 4a2 2 0 100 4 2 2 0 100-4",
  // dot grid
  "M3 3h0.01M6 3h0.01M9 3h0.01M3 6h0.01M6 6h0.01M9 6h0.01M3 9h0.01M6 9h0.01M9 9h0.01",
  // waves
  "M0 4q1.5 -2 3 0t3 0t3 0t3 0M0 8q1.5 -2 3 0t3 0t3 0t3 0",
];

function agentPattern(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash * 17 + id.charCodeAt(i)) >>> 0;
  return AGENT_PATTERNS[hash % AGENT_PATTERNS.length]!;
}

function AgentTile({ agent, className = "" }: { agent: ReportAgent; className?: string }) {
  return (
    <span
      className={`grid place-items-center overflow-hidden rounded-lg ${agentTint(agent.id)} ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 12 12" className="size-full p-[3px]">
        <path
          d={agentPattern(agent.id)}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity={0.85}
        />
      </svg>
    </span>
  );
}

/**
 * The capsule that opens every section.
 *
 * It carries the section's index and kind in one short line, which is what
 * lets the heading underneath be the finding itself rather than a label.
 */
function SectionBadge({ num, label }: { num?: string; label: string }) {
  return (
    <span className="inline-flex max-w-full items-center gap-1.5 self-start rounded-full bg-section-badge px-3 py-[5px] text-[10px] font-semibold uppercase leading-none tracking-[0.13em] text-background">
      {num !== undefined ? <span className="tabular-nums">{num}.</span> : null}
      <span className="truncate">
        <TranslatableText text={label} />
      </span>
    </span>
  );
}

/**
 * Who produced this report, in place of the old status chip.
 *
 * The chip said "Report · Partial", which told the reader about the run
 * rather than about the work. The agents are the more useful thing to put at
 * the top, and each one opens its own conversation.
 */
function AgentsPill({
  agents,
  onSelectAgent,
}: {
  agents: Array<ReportAgent>;
  onSelectAgent?: ((agentId: string) => void) | undefined;
}) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent) {
        if (event.key === "Escape") setOpen(false);
        return;
      }
      if (event.target instanceof Node && containerRef.current?.contains(event.target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  const label =
    agents.length === 1
      ? t("reportView.oneAgent", { defaultValue: "1 agent" })
      : t("reportView.agentCount", { defaultValue: `${agents.length} agents`, count: agents.length });

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex cursor-pointer items-center gap-2.5 rounded-full border border-border bg-surface py-1 pl-1 pr-3 shadow-xs transition-colors hover:border-foreground/25 hover:bg-surface-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <span className="flex items-center">
          {agents.slice(0, 4).map((agent, index) => (
            <AgentTile
              key={agent.id}
              agent={agent}
              className={`size-7 ring-2 ring-surface ${index === 0 ? "" : "-ml-2"}`}
            />
          ))}
        </span>
        <span className="text-[13px] font-medium text-foreground">{label}</span>
        <ChevronDown
          className={`size-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div
          role="menu"
          aria-label={t("reportView.agentsOnReport", { defaultValue: "Agents on this report" })}
          className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-[min(22rem,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-border bg-popover p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-150"
        >
          <p className="px-2.5 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-[0.13em] text-muted-foreground">
            {t("reportView.agentsOnReport", { defaultValue: "Agents on this report" })}
          </p>
          {agents.map((agent) => (
            <button
              key={agent.id}
              type="button"
              role="menuitem"
              disabled={onSelectAgent === undefined}
              onClick={() => {
                setOpen(false);
                onSelectAgent?.(agent.id);
              }}
              className="flex w-full items-start gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-accent disabled:cursor-default disabled:hover:bg-transparent"
            >
              <AgentTile agent={agent} className="mt-0.5 size-7 shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-medium text-foreground">
                  <TranslatableText text={agent.name} />
                </span>
                {agent.role !== undefined && agent.role !== "" ? (
                  <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                    <TranslatableText text={agent.role} />
                  </span>
                ) : null}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Section({
  id,
  num,
  eyebrow,
  title,
  lede,
  meta,
  children,
}: {
  id: string;
  num?: string;
  eyebrow?: string;
  title: string;
  /** One muted line under the heading — the section's point, not a recap. */
  lede?: string;
  meta?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      data-report-section
      className="scroll-mt-24 rounded-3xl border border-border/60 bg-surface px-6 py-8 sm:px-10 sm:py-10"
    >
      <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex min-w-0 flex-col gap-4">
          <SectionBadge label={eyebrow ?? title} {...(num !== undefined ? { num } : {})} />
          <h2 className="max-w-2xl text-[20px] font-medium leading-[1.3] text-foreground sm:text-[24px]">
            <TranslatableText text={title} />
          </h2>
          {lede !== undefined && lede !== "" ? (
            <p className="max-w-2xl text-[14px] leading-[1.75] text-muted-foreground">
              <TranslatableText text={formatDisplayValue(lede)} />
            </p>
          ) : null}
        </div>
        {meta !== undefined ? <div className="shrink-0">{meta}</div> : null}
      </header>
      {children}
    </section>
  );
}

function Block({ block, num }: { block: ReportBlock; num: string }) {
  const { t } = useLanguage();
  const expandable = canExpand(block);
  const contentType = block.component === "table" ? "table" : "chart";
  const meta = (
    <div className="flex items-center gap-2">
      {expandable ? (
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              aria-label={`Expand ${contentType}: ${block.title}`}
              title={t("reportView.expand", { defaultValue: "Expand" })}
              className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-xl border border-border bg-surface text-muted-foreground shadow-2xs transition hover:border-brand-blue/40 hover:text-brand-blue"
            >
              <Maximize2 className="size-4" aria-hidden="true" />
            </button>
          </DialogTrigger>
          <DialogContent
            className={`flex w-[96vw] max-w-[1400px] flex-col gap-0 overflow-hidden p-0 sm:rounded-2xl ${
              block.component === "table" ? "max-h-[90dvh]" : "h-[90dvh] max-h-[900px]"
            }`}
          >
            <DialogHeader className="shrink-0 border-b border-border px-5 py-4 pr-14 text-left sm:px-6">
              <DialogTitle className="text-lg leading-snug sm:text-xl">
                <TranslatableText text={block.title} />
              </DialogTitle>
            </DialogHeader>
            <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-6">
              <BlockBody block={block} expanded />
            </div>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );

  return (
    <Section
      id={block.id}
      num={num}
      title={block.title}
      meta={meta}
      eyebrow={blockEyebrow(block)}
      {...(block.insight !== undefined ? { lede: block.insight } : {})}
    >
      <BlockBody block={block} />

      {block.dataSources !== undefined && block.dataSources.length > 0 ? (
        <div className="mt-7 flex flex-wrap items-center gap-2">
          {block.dataSources.map((source) => (
            <span
              key={source}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1 text-[11px] font-medium text-foreground/80"
            >
              <Table2 className="size-3 shrink-0 text-muted-foreground" aria-hidden="true" />
              <TranslatableText text={source} />
            </span>
          ))}
        </div>
      ) : null}
    </Section>
  );
}

/** Collapsible methodology panel: numbered steps, source chips, evidence. */
function EvidencePanel({
  id,
  num,
  method,
}: {
  id: string;
  num: string;
  method: NonNullable<Report["howDataFound"]>;
}) {
  const [open, setOpen] = useState(true);
  const { t } = useLanguage();

  return (
    <section
      id={id}
      data-report-section
      className="scroll-mt-24 rounded-3xl border border-border/60 bg-surface px-6 py-8 sm:px-10 sm:py-10"
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex min-w-0 flex-col gap-4">
          <SectionBadge num={num} label={t("reportView.evidence", { defaultValue: "Evidence" })} />
          <h2 className="text-[20px] font-medium leading-[1.25] text-foreground sm:text-[24px]">
            {t("reportView.howDataFound", { defaultValue: "How the data was found" })}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={`${id}-detail`}
          className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-border/70 px-3 py-1.5 text-[11px] font-semibold text-muted-foreground transition-colors hover:border-border hover:text-foreground"
        >
          {open
            ? t("reportView.hide", { defaultValue: "Hide" })
            : t("reportView.show", { defaultValue: "Show" })}
          {open ? (
            <ChevronUp className="size-3.5" aria-hidden="true" />
          ) : (
            <ChevronDown className="size-3.5" aria-hidden="true" />
          )}
        </button>
      </div>

      {open ? (
        <div id={`${id}-detail`} className="mt-8 space-y-8">
          {method.summary !== "" ? (
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
              <TranslatableText text={formatDisplayValue(method.summary)} />
            </p>
          ) : null}

          {method.steps.length > 0 ? (
            <ol className="relative space-y-6 pl-10 before:absolute before:bottom-2 before:left-[13px] before:top-2 before:w-px before:bg-border">
              {method.steps.map((step, index) => (
                <li key={`${step.title}-${index}`} className="relative">
                  <span className="absolute -left-10 top-0 grid size-7 place-items-center rounded-full border border-border bg-surface text-xs font-semibold tabular-nums text-foreground shadow-2xs">
                    {index + 1}
                  </span>
                  <div className="space-y-1">
                    {step.title !== "" ? (
                      <p className="text-sm font-semibold leading-snug text-foreground">
                        <TranslatableText text={step.title} />
                      </p>
                    ) : null}
                    {step.detail !== "" ? (
                      <p className="text-[13px] leading-relaxed text-muted-foreground">
                        <TranslatableText text={formatDisplayValue(step.detail)} />
                      </p>
                    ) : null}
                    {step.sources.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 pt-1.5">
                        {step.sources.map((source) => (
                          <span
                            key={source}
                            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1 text-[11px] font-medium text-foreground/80"
                          >
                            <Table2
                              className="size-3 shrink-0 text-muted-foreground"
                              aria-hidden="true"
                            />
                            <TranslatableText text={source} />
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

const CONFIDENCE_STYLES: Record<"high" | "medium" | "low", string> = {
  high: "border-emerald-200 bg-emerald-50 text-emerald-700",
  medium: "border-amber-200 bg-amber-50 text-amber-700",
  low: "border-rose-200 bg-rose-50 text-rose-700",
};

/**
 * Provenance for a forecast, directly under the cover.
 *
 * As-of date, horizon and method are what separate a forecast from a guess,
 * so they sit where the reader meets the numbers rather than in an appendix.
 */
function ForecastMetaStrip({ meta }: { meta: NonNullable<Report["forecastMeta"]> }) {
  const { t } = useLanguage();

  const facts = [
    { label: t("reportView.asOf", { defaultValue: "As of" }), value: meta.asOf },
    { label: t("reportView.horizon", { defaultValue: "Horizon" }), value: meta.horizon },
    { label: t("reportView.method", { defaultValue: "Method" }), value: meta.method },
  ].filter((fact): fact is { label: string; value: string } => fact.value !== undefined);

  if (facts.length === 0 && meta.confidence === undefined && meta.keyAssumptions.length === 0) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-border/60 bg-surface px-6 py-8 sm:px-10 sm:py-10">
      <div className="flex flex-wrap items-start gap-x-8 gap-y-4">
        {facts.map((fact) => (
          <div key={fact.label} className="min-w-0">
            <p className="eyebrow">{fact.label}</p>
            <p className="mt-1 text-[13px] font-medium text-foreground">
              <TranslatableText text={fact.value} />
            </p>
          </div>
        ))}

        {meta.confidence !== undefined ? (
          <div className="min-w-0">
            <p className="eyebrow">{t("reportView.confidence", { defaultValue: "Confidence" })}</p>
            <span
              className={`mt-1 inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize ${CONFIDENCE_STYLES[meta.confidence]}`}
            >
              {meta.confidence}
            </span>
          </div>
        ) : null}
      </div>

      {meta.confidenceRationale !== undefined ? (
        <p className="mt-4 max-w-3xl text-[13px] leading-relaxed text-muted-foreground">
          <TranslatableText text={formatDisplayValue(meta.confidenceRationale)} />
        </p>
      ) : null}

      {meta.keyAssumptions.length > 0 ? (
        <ul className="mt-3 space-y-1.5">
          {meta.keyAssumptions.map((assumption, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-[13px] leading-relaxed text-muted-foreground"
            >
              <span className="mt-[0.45rem] size-1 shrink-0 rounded-full bg-muted-foreground" />
              <TranslatableText text={formatDisplayValue(assumption)} />
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export function ReportView({
  report,
  planAgents,
  onSelectAgent,
}: {
  report: Report;
  /** The roster the run was dispatched with, when the caller still has it. */
  planAgents?: Array<ReportAgent> | undefined;
  onSelectAgent?: ((agentId: string) => void) | undefined;
}) {
  const { t } = useLanguage();
  const rootRef = useRef<HTMLElement>(null);
  const directory = useAgentDirectory();

  // The template tells agents to lead with a kpiRibbon. When they do, it
  // belongs to the cover as a headline strip rather than as a section of its
  // own — a numbered heading above the headline numbers says nothing.
  const [coverKpis, bodyBlocks] = useMemo(() => {
    const first = report.blocks[0];
    if (first !== undefined && first.component === "kpiRibbon") {
      return [first, report.blocks.slice(1)] as const;
    }
    return [null, report.blocks] as const;
  }, [report.blocks]);

  /**
   * Who to credit.
   *
   * The plan is the better source when the caller has it — it is the roster
   * the run was actually dispatched with. A report read back from history
   * has no plan in memory, so the block `agentId`s stand in; either way the
   * catalog supplies the name, falling back to the id so an unresolvable
   * agent is still listed rather than silently dropped.
   */
  const agents = useMemo<Array<ReportAgent>>(() => {
    const ids =
      planAgents !== undefined && planAgents.length > 0
        ? planAgents.map((agent) => agent.id)
        : report.blocks
            .map((block) => block.agentId)
            .filter((id): id is string => id !== undefined);

    const seen = new Set<string>();
    const list: Array<ReportAgent> = [];
    for (const id of ids) {
      if (seen.has(id)) continue;
      seen.add(id);
      const fromPlan = planAgents?.find((agent) => agent.id === id);
      const fromCatalog = directory.get(id);
      list.push({
        id,
        name: fromCatalog?.title ?? fromPlan?.name ?? id,
        ...optionalRole(fromCatalog?.role ?? fromPlan?.role),
      });
    }
    return list;
  }, [planAgents, report.blocks, directory]);

  const summaryId = `${report.sessionId}-summary`;
  const evidenceId = `${report.sessionId}-evidence`;
  const actionsId = `${report.sessionId}-actions`;

  // Numbering runs across the whole document, so the nav chip index and the
  // section's own eyebrow number agree.
  let num = 0;
  const nextNum = () => sectionNumber(num++);

  return (
    <article
      ref={rootRef}
      data-report-card
      className="mb-6 rounded-[28px] border border-border bg-report-canvas p-4 shadow-sm animate-in fade-in duration-300 sm:p-7"
    >
      {/* Cover: sits on the page tint, not in a card, so the title reads as the
          document's own rather than as the first section's. */}
      <header className="px-1 py-0 sm:px-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Who produced this, in place of the old report/partial chips. */}
          {agents.length > 0 ? (
            <AgentsPill agents={agents} onSelectAgent={onSelectAgent} />
          ) : (
            <SectionBadge label={t("reportView.reportLabel", { defaultValue: "Report" })} />
          )}
        </div>

        <h1 className="mt-5 max-w-3xl text-[27px] font-medium leading-[1.2] text-foreground sm:text-[33px]">
          <TranslatableText text={report.reportTitle} />
        </h1>

        {report.executiveSummary !== undefined && report.executiveSummary.narrative !== "" ? (
          <p className="mt-4 max-w-2xl text-[14px] leading-[1.75] text-muted-foreground">
            <TranslatableText text={formatDisplayValue(report.executiveSummary.narrative)} />
          </p>
        ) : null}
      </header>

      <div className="pt-4">
        <div className="space-y-5 pt-2 sm:space-y-6">
          {report.forecastMeta !== undefined ? (
            <ForecastMetaStrip meta={report.forecastMeta} />
          ) : null}

          {report.status === "error" ? (
            <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-rose-600" aria-hidden="true" />
              <div className="min-w-0">
                <div className="text-sm font-semibold text-foreground">
                  {t("reportView.runCouldNotComplete", {
                    defaultValue: "The report run could not be completed",
                  })}
                </div>
                <p className="mt-0.5 text-sm text-foreground/80">
                  <TranslatableText text={report.error ?? "No detail was given."} />
                </p>
              </div>
            </div>
          ) : null}

          {/* Executive summary */}
          {report.executiveSummary !== undefined ? (
            <Section
              id={summaryId}
              num={nextNum()}
              eyebrow={t("reportView.executiveSummary", { defaultValue: "Executive summary" })}
              title={report.executiveSummary.headline}
            >
              {/* No narrative here and no pull quote: the narrative is the
                  cover's standfirst, and the quote only ever repeated the
                  first key finding. */}
              {report.executiveSummary.keyFindings.length > 0 ? (
                <ul className="grid gap-x-10 gap-y-3.5 sm:grid-cols-2">
                  {report.executiveSummary.keyFindings.map((finding, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-[14px] leading-[1.7] text-foreground/85"
                    >
                      <CheckCircle2
                        className="mt-[3px] size-3.5 shrink-0 text-brand-blue"
                        aria-hidden="true"
                      />
                      <TranslatableText text={formatDisplayValue(finding)} />
                    </li>
                  ))}
                </ul>
              ) : null}

              {coverKpis !== null && coverKpis.data.cards.length > 0 ? (
                <StatStrip cards={coverKpis.data.cards} />
              ) : null}
            </Section>
          ) : null}

          {/* Headline figures ride in the summary card. Without one they still
              need a home, so they get a card of their own. */}
          {report.executiveSummary === undefined &&
          coverKpis !== null &&
          coverKpis.data.cards.length > 0 ? (
            <section className="rounded-3xl border border-border/60 bg-surface px-6 py-8 sm:px-10 sm:py-10">
              <SectionBadge
                num={nextNum()}
                label={t("reportView.headlineFigures", { defaultValue: "Headline figures" })}
              />
              <StatStrip cards={coverKpis.data.cards} />
            </section>
          ) : null}

          {/* Body */}
          {bodyBlocks.map((block) => (
            <Block key={block.id} block={block} num={nextNum()} />
          ))}

          {/* Evidence */}
          {report.howDataFound !== undefined ? (
            <EvidencePanel id={evidenceId} num={nextNum()} method={report.howDataFound} />
          ) : null}

          {/* Recommendations */}
          {report.recommendations.length > 0 ? (
            <Section
              id={actionsId}
              num={nextNum()}
              eyebrow={t("reportView.nextSteps", { defaultValue: "Next steps" })}
              title={t("reportView.recommendations", { defaultValue: "Recommendations" })}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {report.recommendations.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3.5 rounded-2xl border border-border/70 bg-surface-tint/70 p-5 sm:p-6"
                  >
                    <span
                      className={`mt-[3px] size-3.5 shrink-0 rounded-full border-2 ${
                        PRIORITY_DOTS[item.priority] ?? PRIORITY_DOTS["low"]
                      }`}
                      aria-hidden="true"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <span className="text-[14px] font-semibold text-foreground">
                          <TranslatableText text={item.title} />
                        </span>
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-[0.1em] ${
                            PRIORITY_TEXT[item.priority] ?? PRIORITY_TEXT["low"]
                          }`}
                        >
                          {item.priority}
                        </span>
                      </div>
                      {item.detail !== "" ? (
                        <p className="mt-2 text-[14px] leading-[1.7] text-muted-foreground">
                          <TranslatableText text={formatDisplayValue(item.detail)} />
                        </p>
                      ) : null}
                      {item.owner !== undefined ? (
                        <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                          <TranslatableText text={item.owner} />
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          ) : null}

          {/* Appendix */}
          {report.appendix !== undefined &&
          (report.appendix.dataGaps.length > 0 || report.appendix.assumptions.length > 0) ? (
            <section className="grid gap-5 md:grid-cols-2">
              {report.appendix.dataGaps.length > 0 ? (
                <div className="rounded-3xl border border-border/60 bg-surface p-6 sm:p-8">
                  <h4 className="eyebrow">
                    {t("reportView.dataGaps", { defaultValue: "Data gaps" })}
                  </h4>
                  <ul className="mt-4 space-y-3">
                    {report.appendix.dataGaps.map((gap, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2.5 text-[14px] leading-[1.75] text-foreground/80"
                      >
                        <span className="mt-[0.6rem] size-1.5 shrink-0 rounded-full bg-amber-500" />
                        <span>
                          <TranslatableText text={formatDisplayValue(gap)} />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {report.appendix.assumptions.length > 0 ? (
                <div className="rounded-3xl border border-border/60 bg-surface p-6 sm:p-8">
                  <h4 className="eyebrow">
                    {t("reportView.assumptions", { defaultValue: "Assumptions" })}
                  </h4>
                  <ul className="mt-4 space-y-3">
                    {report.appendix.assumptions.map((assumption, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2.5 text-[14px] leading-[1.75] text-foreground/80"
                      >
                        <span className="mt-[0.6rem] size-1.5 shrink-0 rounded-full bg-border" />
                        <span>
                          <TranslatableText text={formatDisplayValue(assumption)} />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
          ) : null}
        </div>
      </div>
    </article>
  );
}
