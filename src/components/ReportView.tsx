/**
 * Renders a generated report.
 *
 * Every block in `docs/report-template.json` has a component here, and the
 * visual language follows the rest of the product.
 *
 * Colour is owned here, never by the agent: blocks carry a `tone`, and this
 * file decides what that looks like. Agent-chosen hex values would drift
 * between blocks and break contrast.
 */
import { AlertTriangle, Minus, TrendingDown, TrendingUp } from "lucide-react";
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

/** Categorical palette, in the order series and slices are assigned. */
const SERIES_COLORS = ["#0e7490", "#06b6d4", "#6366f1", "#10b981", "#f59e0b", "#8b5cf6"];

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
  info: { text: "text-sky-700", bg: "bg-sky-50", border: "border-sky-200", dot: "bg-sky-500" },
  good: {
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  neutral: {
    text: "text-slate-600",
    bg: "bg-slate-50",
    border: "border-slate-200",
    dot: "bg-slate-400",
  },
};

const TONE_STROKE: Record<Tone, string> = {
  critical: "#e11d48",
  warning: "#f59e0b",
  info: "#0284c7",
  good: "#10b981",
  neutral: "#64748b",
};

function color(index: number): string {
  return SERIES_COLORS[index % SERIES_COLORS.length] ?? "#0e7490";
}

const AXIS = { fontSize: 11, fill: "#64748b" } as const;

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs sm:p-6">
      {children}
    </div>
  );
}

function ChartFrame({ children }: { children: React.ReactElement }) {
  return (
    <div className="h-64 w-full sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

function TrendLegend({ series }: { series: Array<SeriesSpec> }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-4 text-xs font-medium">
      {series.map((entry, index) => (
        <span key={entry.key} className="flex items-center gap-1.5">
          <span className="size-3 rounded" style={{ background: color(index) }} />
          <span className="text-slate-700">{entry.label}</span>
        </span>
      ))}
    </div>
  );
}

// ------------------------------------------------------------------ the blocks

function ReportBarChart({
  data,
}: {
  data: Extract<ReportBlock, { component: "reportBar" }>["data"];
}) {
  // Heights are derived here, never sent: an agent computing layout is an
  // agent that will eventually compute it wrong.
  const max = Math.max(...data.bars.map((bar) => Math.abs(bar.value)), 1);

  return (
    <Card>
      {data.valueLabel !== undefined ? (
        <span className="mb-3 inline-flex items-center rounded-full border border-blue-200/80 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {data.valueLabel}
        </span>
      ) : null}

      <div className="overflow-x-auto pb-1">
        <div className="min-w-[500px]">
          <div className="relative flex h-44 w-full items-end justify-around px-4 pt-8 sm:h-52 sm:px-8">
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between opacity-40">
              {[0, 1, 2, 3].map((line) => (
                <div key={line} className="w-full border-b border-dashed border-slate-300" />
              ))}
            </div>

            {data.bars.map((bar) => (
              <div
                key={bar.label}
                className="group relative z-20 flex h-full flex-col items-center justify-end"
              >
                <div className="mb-2 whitespace-nowrap rounded-full border border-slate-200/90 bg-white px-2.5 py-0.5 text-xs font-bold tabular-nums text-slate-800 shadow-2xs">
                  {bar.formattedValue}
                </div>
                <div
                  style={{ height: `${Math.max(4, (Math.abs(bar.value) / max) * 100)}%` }}
                  className="relative w-12 overflow-hidden rounded-t-lg border-x border-t border-cyan-200 bg-gradient-to-t from-[#0e7490] via-[#0891b2] to-cyan-400 shadow-xs transition-all duration-500 sm:w-16"
                >
                  <div className="h-1.5 w-full rounded-t-lg bg-white/40" />
                </div>
              </div>
            ))}
          </div>

          <div className="w-full border-t border-slate-200" />

          <div className="flex items-start justify-around px-2 pt-3 sm:px-6">
            {data.bars.map((bar) => (
              <div key={bar.label} className="w-24 space-y-0.5 text-center sm:w-32">
                <span className="block truncate text-xs font-bold leading-tight text-slate-950 sm:text-sm">
                  {bar.label}
                </span>
                {bar.subtext !== undefined ? (
                  <span className="block text-[11px] font-medium leading-tight text-slate-600 sm:text-xs">
                    {bar.subtext}
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

function KpiRibbon({ data }: { data: Extract<ReportBlock, { component: "kpiRibbon" }>["data"] }) {
  // The schema allows 2-4 cards, so the grid follows the count. A fixed
  // three-column grid leaves the fourth card stranded on its own row.
  const columns =
    data.cards.length === 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : data.cards.length === 2
        ? "sm:grid-cols-2"
        : "sm:grid-cols-3";

  return (
    <div className={`grid grid-cols-1 gap-4 ${columns}`}>
      {data.cards.map((card) => {
        const stroke = TONE_STROKE[card.sparkline?.tone ?? "info"];
        const points = (card.sparkline?.points ?? []).map((value, index) => ({ index, value }));
        const Icon =
          card.deltaDirection === "down"
            ? TrendingDown
            : card.deltaDirection === "flat"
              ? Minus
              : TrendingUp;

        return (
          <div
            key={card.label}
            className="flex items-center justify-between rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs"
          >
            <div className="min-w-0">
              <span className="block text-xs font-medium text-slate-500">{card.label}</span>
              <span className="block text-xl font-bold text-slate-950">{card.value}</span>
              {card.delta !== undefined ? (
                /* Coloured by the agent's tone, not by the arrow direction:
                   whether a number going up is good depends on the number. */
                <span
                  className={`mt-0.5 flex items-center gap-0.5 text-[11px] font-semibold ${
                    TONE_STYLES[card.sparkline?.tone ?? "neutral"].text
                  }`}
                >
                  <Icon className="size-3" aria-hidden="true" />
                  {card.delta}
                </span>
              ) : null}
            </div>

            {points.length > 1 ? (
              <div className="h-12 w-20 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={points}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={stroke}
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function SliceChart({
  slices,
  centerMetric,
  donut,
}: {
  slices: Array<Slice>;
  centerMetric?: { label: string; value: string; caption?: string };
  donut: boolean;
}) {
  return (
    <Card>
      <div className="relative">
        <ChartFrame>
          <PieChart>
            <Tooltip
              contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
            />
            <Pie
              data={slices}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={donut ? "58%" : 0}
              outerRadius="82%"
              paddingAngle={donut ? 2 : 0}
            >
              {slices.map((slice, index) => (
                <Cell key={slice.name} fill={color(index)} stroke="#ffffff" strokeWidth={2} />
              ))}
            </Pie>
          </PieChart>
        </ChartFrame>

        {donut && centerMetric !== undefined ? (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
              {centerMetric.label}
            </span>
            <span className="text-2xl font-bold text-slate-950">{centerMetric.value}</span>
            {centerMetric.caption !== undefined ? (
              <span className="text-[11px] text-slate-500">{centerMetric.caption}</span>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="mt-4 space-y-2">
        {slices.map((slice, index) => (
          <div key={slice.name} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex min-w-0 items-center gap-2">
              <span className="size-2.5 shrink-0 rounded-sm" style={{ background: color(index) }} />
              <span className="truncate font-medium text-slate-800">{slice.name}</span>
              {slice.highlight !== undefined ? (
                <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
                  {slice.highlight}
                </span>
              ) : null}
            </span>
            <span className="shrink-0 tabular-nums text-slate-600">
              {slice.share !== undefined ? `${slice.share}%` : slice.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Trend({ data, filled }: { data: TrendData; filled: boolean }) {
  const Chart = filled ? AreaChart : LineChart;

  return (
    <Card>
      <TrendLegend series={data.series} />
      <ChartFrame>
        <Chart data={data.rows} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            {data.series.map((entry, index) => (
              <linearGradient key={entry.key} id={`fill-${entry.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color(index)} stopOpacity={0.35} />
                <stop offset="95%" stopColor={color(index)} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey={data.xKey} tick={AXIS} tickLine={false} axisLine={false} />
          <YAxis tick={AXIS} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
          {data.threshold !== undefined ? (
            <ReferenceLine
              y={data.threshold.value}
              stroke="#94a3b8"
              strokeDasharray="4 4"
              label={{ value: data.threshold.label, position: "insideTopRight", ...AXIS }}
            />
          ) : null}
          {data.series.map((entry, index) =>
            filled ? (
              <Area
                key={entry.key}
                type="monotone"
                dataKey={entry.key}
                name={entry.label}
                stroke={color(index)}
                strokeWidth={entry.emphasis === "primary" ? 2.5 : 1.5}
                fill={`url(#fill-${entry.key})`}
                dot={false}
              />
            ) : (
              <Line
                key={entry.key}
                type="monotone"
                dataKey={entry.key}
                name={entry.label}
                stroke={color(index)}
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

function GroupedBars({ data }: { data: Omit<TrendData, "threshold"> }) {
  return (
    <Card>
      <TrendLegend series={data.series} />
      <ChartFrame>
        <BarChart data={data.rows} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey={data.xKey} tick={AXIS} tickLine={false} axisLine={false} />
          <YAxis tick={AXIS} tickLine={false} axisLine={false} />
          <Tooltip
            cursor={{ fill: "#f1f5f9" }}
            contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
          />
          <Legend wrapperStyle={{ display: "none" }} />
          {data.series.map((entry, index) => (
            <Bar
              key={entry.key}
              dataKey={entry.key}
              name={entry.label}
              fill={color(index)}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ChartFrame>
    </Card>
  );
}

function RankedBars({
  data,
}: {
  data: Extract<ReportBlock, { component: "horizontalRanked" }>["data"];
}) {
  return (
    <Card>
      <div className="space-y-3.5">
        {data.items.map((item, index) => {
          const styles = TONE_STYLES[item.statusTone ?? "neutral"];

          return (
            <div
              key={item.label}
              className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3"
            >
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <span className="flex size-5 items-center justify-center rounded-md border border-slate-200 bg-white text-xs font-bold text-slate-700">
                    {index + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-950 sm:text-sm">{item.label}</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-sm font-bold tabular-nums text-slate-900">
                    {item.primaryValue}
                  </span>
                  {item.status !== undefined ? (
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${styles.bg} ${styles.border} ${styles.text}`}
                    >
                      {item.status}
                    </span>
                  ) : null}
                </span>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full ${styles.dot}`}
                  style={{ width: `${item.percent}%` }}
                />
              </div>

              {item.secondaryValue !== undefined ? (
                <span className="mt-1.5 block text-[11px] font-medium text-slate-600">
                  {item.secondaryValue}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function RadarDiagnostic({ data }: { data: Extract<ReportBlock, { component: "radar" }>["data"] }) {
  const max = Math.max(...data.axes.map((axis) => axis.fullMark), 1);

  return (
    <Card>
      {data.overallScore !== undefined ? (
        <div className="mb-2 flex justify-end">
          <span className="rounded-md border border-purple-200 bg-purple-50 px-2 py-0.5 text-xs font-bold text-purple-700">
            Overall score: {data.overallScore}/{data.scoreOutOf ?? 100}
          </span>
        </div>
      ) : null}

      <ChartFrame>
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data.axes}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" tick={AXIS} />
          <PolarRadiusAxis domain={[0, max]} tick={false} axisLine={false} />
          <Radar name="Score" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.35} />
          <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
        </RadarChart>
      </ChartFrame>
    </Card>
  );
}

function DataTable({ data }: { data: Extract<ReportBlock, { component: "table" }>["data"] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200/90 bg-white shadow-2xs">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80">
            {data.columns.map((column) => (
              <th
                key={column.key}
                className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-600 ${
                  column.align === "right" ? "text-right" : "text-left"
                }`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200/80">
          {data.rows.map((row, index) => (
            <tr key={index} className="hover:bg-slate-50/60">
              {data.columns.map((column) => (
                <td
                  key={column.key}
                  className={`px-4 py-2.5 ${column.align === "right" ? "text-right tabular-nums" : "text-left"} ${
                    column.emphasis === true ? "font-semibold text-slate-900" : "text-slate-700"
                  }`}
                >
                  {cellText(row[column.key])}
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
function cellText(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return value.toLocaleString();
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return value === null || value === undefined ? "—" : JSON.stringify(value);
}

function BlockBody({ block }: { block: ReportBlock }) {
  switch (block.component) {
    case "narrative":
      return (
        <div className="space-y-3">
          {block.data.paragraphs.map((paragraph, index) => (
            <p key={index} className="text-sm leading-relaxed text-slate-700">
              {paragraph}
            </p>
          ))}
        </div>
      );
    case "kpiRibbon":
      return <KpiRibbon data={block.data} />;
    case "reportBar":
      return <ReportBarChart data={block.data} />;
    case "groupedBar":
      return <GroupedBars data={block.data} />;
    case "horizontalRanked":
      return <RankedBars data={block.data} />;
    case "donut":
      return (
        <SliceChart
          slices={block.data.slices}
          donut
          {...(block.data.centerMetric !== undefined
            ? { centerMetric: block.data.centerMetric }
            : {})}
        />
      );
    case "pie":
      return <SliceChart slices={block.data.slices} donut={false} />;
    case "lineTrend":
      return <Trend data={block.data} filled={false} />;
    case "areaTrend":
      return <Trend data={block.data} filled />;
    case "radar":
      return <RadarDiagnostic data={block.data} />;
    case "table":
      return <DataTable data={block.data} />;
    case "callout": {
      const styles = TONE_STYLES[block.data.tone];
      return (
        <div
          className={`flex items-start gap-3 rounded-xl border p-4 ${styles.bg} ${styles.border}`}
        >
          <AlertTriangle className={`mt-0.5 size-4 shrink-0 ${styles.text}`} aria-hidden="true" />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900">{block.data.heading}</div>
            <p className="mt-0.5 text-sm text-slate-700">{block.data.body}</p>
          </div>
        </div>
      );
    }
    case "insightList":
      return (
        <ul className="space-y-2.5">
          {block.data.items.map((item, index) => (
            <li key={index} className="flex items-start gap-2.5 text-sm text-slate-700">
              <span
                className={`mt-1.5 size-2 shrink-0 rounded-full ${TONE_STYLES[item.tone ?? "neutral"].dot}`}
              />
              <span>
                {item.label !== undefined ? (
                  <span className="font-semibold text-slate-900">{item.label}: </span>
                ) : null}
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      );
  }
}

function Block({ block }: { block: ReportBlock }) {
  // The ribbon is the page header's companion; a title above it would repeat
  // what the cards already say.
  const bare = block.component === "kpiRibbon";

  return (
    <section id={block.id} className="space-y-3 scroll-mt-6">
      {bare ? null : (
        <div>
          {block.eyebrow !== undefined ? (
            <span className="block text-xs font-bold uppercase tracking-wider text-[#0e7490]">
              {block.eyebrow}
            </span>
          ) : null}
          <h3 className="text-base font-bold tracking-tight text-slate-950 sm:text-lg">
            {block.title}
          </h3>
          {block.caption !== undefined ? (
            <p className="mt-0.5 text-xs text-slate-500">{block.caption}</p>
          ) : null}
        </div>
      )}

      <BlockBody block={block} />

      {block.insight !== undefined ? (
        <p className="border-l-2 border-[#0e7490]/30 pl-3 text-sm leading-relaxed text-slate-700">
          {block.insight}
        </p>
      ) : null}

      {block.dataSources !== undefined ? (
        <div className="flex flex-wrap items-center gap-1.5">
          {block.dataSources.map((source) => (
            <span
              key={source}
              className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
            >
              {source}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
}

const PRIORITY_STYLES: Record<string, string> = {
  high: "bg-rose-50 border-rose-200 text-rose-700",
  medium: "bg-amber-50 border-amber-200 text-amber-700",
  low: "bg-slate-50 border-slate-200 text-slate-600",
};

export function ReportView({ report }: { report: Report }) {
  return (
    <article className="mb-5 space-y-7 rounded-2xl border border-sky-200/80 bg-gradient-to-b from-white via-sky-50/20 to-white p-5 shadow-2xs animate-in fade-in duration-300 sm:p-7">
      <header className="border-b border-slate-200/70 pb-4">
        <h2 className="text-lg font-bold tracking-tight text-slate-950 sm:text-xl">
          {report.reportTitle}
        </h2>
        {report.reportSubtitle !== undefined ? (
          <p className="mt-1 text-sm text-slate-600">{report.reportSubtitle}</p>
        ) : null}
      </header>

      {report.status === "error" ? (
        <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-rose-600" aria-hidden="true" />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900">
              The report could not be completed
            </div>
            <p className="mt-0.5 text-sm text-slate-700">
              {report.error ?? "No detail was given."}
            </p>
          </div>
        </div>
      ) : null}

      {report.executiveSummary !== undefined ? (
        <section className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs">
          <span className="block text-xs font-bold uppercase tracking-wider text-[#0e7490]">
            Executive summary
          </span>
          <p className="mt-1.5 text-base font-semibold leading-snug text-slate-950">
            {report.executiveSummary.headline}
          </p>
          {report.executiveSummary.narrative !== "" ? (
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              {report.executiveSummary.narrative}
            </p>
          ) : null}
          {report.executiveSummary.keyFindings.length > 0 ? (
            <ul className="mt-3 space-y-1.5">
              {report.executiveSummary.keyFindings.map((finding, index) => (
                <li key={index} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#0e7490]" />
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {report.blocks.map((block) => (
        <Block key={block.id} block={block} />
      ))}

      {report.recommendations.length > 0 ? (
        <section className="space-y-3">
          <h3 className="text-base font-bold tracking-tight text-slate-950 sm:text-lg">
            Recommendations
          </h3>
          <div className="divide-y divide-slate-200/80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
            {report.recommendations.map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">{item.title}</span>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
                        PRIORITY_STYLES[item.priority] ?? PRIORITY_STYLES["low"]
                      }`}
                    >
                      {item.priority}
                    </span>
                    {item.owner !== undefined ? (
                      <span className="text-[11px] font-medium text-slate-500">{item.owner}</span>
                    ) : null}
                  </div>
                  {item.detail !== "" ? (
                    <p className="mt-1 text-sm text-slate-700">{item.detail}</p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {report.appendix !== undefined ? (
        <section className="space-y-3 border-t border-slate-200/70 pt-4">
          {report.appendix.dataGaps.length > 0 ? (
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-amber-700">
                Data gaps
              </span>
              <ul className="mt-1.5 space-y-1">
                {report.appendix.dataGaps.map((gap, index) => (
                  <li key={index} className="text-sm text-slate-600">
                    {gap}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {report.appendix.assumptions.length > 0 ? (
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Assumptions
              </span>
              <ul className="mt-1.5 space-y-1">
                {report.appendix.assumptions.map((assumption, index) => (
                  <li key={index} className="text-sm text-slate-600">
                    {assumption}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}
    </article>
  );
}
