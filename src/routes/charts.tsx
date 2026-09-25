import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  TrendingUp,
  TrendingDown,
  Activity,
  ArrowLeft,
  Copy,
  Check,
  Sparkles,
  Info,
  Calendar,
  Layers,
  Filter,
  BarChart2,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Eye,
  SlidersHorizontal,
  Clock,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

export const Route = createFileRoute("/charts")({
  head: () => ({
    meta: [
      { title: "Charts & Visualizations Reference Guide — Merchandising Intelligence" },
      {
        name: "description",
        content:
          "Comprehensive reference directory of UI charts, telemetry graphs, bar charts from report format, pie/donut charts, and trend analytics.",
      },
    ],
  }),
  component: ChartsReferencePage,
});

// Sample Data for Report-Style Bar Chart
const reportBarDataSets = {
  inventoryExposure: [
    { label: "Cargo Pants", subtext: "Excess deadstock", value: 340000, formattedValue: "$340K", heightPercent: 88 },
    { label: "Linen Shirts", subtext: "Critical stockout", value: 85000, formattedValue: "$85K", heightPercent: 28 },
    { label: "Denim Jackets", subtext: "Healthy pacing", value: 210000, formattedValue: "$210K", heightPercent: 62 },
    { label: "Knit Polos", subtext: "Low velocity", value: 165000, formattedValue: "$165K", heightPercent: 50 },
    { label: "Pleated Trousers", subtext: "High deadstock", value: 290000, formattedValue: "$290K", heightPercent: 78 },
  ],
  stockoutRisk: [
    { label: "Linen Blend Tops", subtext: "3.2 days remaining", value: 94, formattedValue: "94% Risk", heightPercent: 94 },
    { label: "Silk Resort Shirts", subtext: "5.5 days remaining", value: 82, formattedValue: "82% Risk", heightPercent: 82 },
    { label: "Striped Poplin", subtext: "12 days remaining", value: 45, formattedValue: "45% Risk", heightPercent: 45 },
    { label: "Organic Rib Tanks", subtext: "28 days remaining", value: 20, formattedValue: "20% Risk", heightPercent: 20 },
    { label: "Oxford Button-Down", subtext: "Normal inventory", value: 12, formattedValue: "12% Risk", heightPercent: 14 },
  ],
};

// Line & Area Chart Data
const timelineData = [
  { day: "Sep 01", actualSales: 1240, predictedDemand: 1100, safetyStock: 800, returnRate: 4.2 },
  { day: "Sep 05", actualSales: 1380, predictedDemand: 1250, safetyStock: 800, returnRate: 3.9 },
  { day: "Sep 10", actualSales: 1590, predictedDemand: 1400, safetyStock: 800, returnRate: 4.8 },
  { day: "Sep 15", actualSales: 1420, predictedDemand: 1600, safetyStock: 800, returnRate: 5.1 },
  { day: "Sep 20", actualSales: 980, predictedDemand: 1750, safetyStock: 800, returnRate: 6.3 },
  { day: "Sep 25", actualSales: 820, predictedDemand: 1850, safetyStock: 800, returnRate: 7.0 },
  { day: "Sep 30", actualSales: 750, predictedDemand: 1950, safetyStock: 800, returnRate: 7.8 },
];

// Donut & Pie Chart Data
const categoryDistributionData = [
  { name: "Pants & Trousers", value: 420000, share: 38, color: "#0e7490", highlight: "Trapped Deadstock" },
  { name: "Linen & Shirts", value: 280000, share: 25, color: "#06b6d4", highlight: "High Demand Velocity" },
  { name: "Denim & Outerwear", value: 210000, share: 19, color: "#6366f1", highlight: "Stable Turnover" },
  { name: "Knitwear & Polos", value: 120000, share: 11, color: "#10b981", highlight: "Seasonal Transition" },
  { name: "Accessories", value: 80000, share: 7, color: "#f59e0b", highlight: "Consistent Margins" },
];

// Grouped Comparison Data
const multiBarComparisonData = [
  { category: "Trousers", currentStockVal: 380, reorderThreshold: 140, idealStock: 190 },
  { category: "Linen Tops", currentStockVal: 65, reorderThreshold: 180, idealStock: 220 },
  { category: "Denim", currentStockVal: 240, reorderThreshold: 200, idealStock: 210 },
  { category: "Outerwear", currentStockVal: 310, reorderThreshold: 160, idealStock: 175 },
  { category: "Activewear", currentStockVal: 150, reorderThreshold: 130, idealStock: 140 },
];

// Horizontal Ranking Data
const horizontalSkuRanking = [
  { sku: "SKU-9924 Loose Utility Cargo", trappedCapital: "$184,200", units: "4,210 pcs", pct: 92, status: "Critical Excess", statusColor: "rose" },
  { sku: "SKU-8812 Relaxed Pleated Chino", trappedCapital: "$126,800", units: "2,890 pcs", pct: 74, status: "High Excess", statusColor: "amber" },
  { sku: "SKU-3120 Oversized Denim Shacket", trappedCapital: "$94,500", units: "1,520 pcs", pct: 56, status: "Moderate", statusColor: "blue" },
  { sku: "SKU-7741 Fine Gauge Merino Polo", trappedCapital: "$62,300", units: "980 pcs", pct: 38, status: "Normal", statusColor: "emerald" },
  { sku: "SKU-1049 Relaxed Linen Band Shirt", trappedCapital: "$12,400", units: "140 pcs", pct: 14, status: "Stockout Alert", statusColor: "rose" },
];

// Radar Supply Chain Health
const radarHealthData = [
  { subject: "Fulfillment Speed", score: 86, fullMark: 100 },
  { subject: "Inventory Turnover", score: 48, fullMark: 100 },
  { subject: "Forecast Accuracy", score: 62, fullMark: 100 },
  { subject: "Margin Retention", score: 78, fullMark: 100 },
  { subject: "Vendor Lead Time", score: 55, fullMark: 100 },
  { subject: "Stockout Resilience", score: 39, fullMark: 100 },
];

function ChartsReferencePage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedReportDataset, setSelectedReportDataset] = useState<"inventoryExposure" | "stockoutRisk">("inventoryExposure");

  const handleCopyCode = (id: string, snippet: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const navFilters = [
    { id: "all", label: "All Charts", count: 7 },
    { id: "report-bar", label: "Report-Style Bar Chart", count: 1 },
    { id: "line-area", label: "Line & Area Trends", count: 2 },
    { id: "pie-donut", label: "Donut & Pie Charts", count: 2 },
    { id: "grouped-bars", label: "Grouped & Multi-Bar", count: 1 },
    { id: "horizontal-ranked", label: "Horizontal Progress Bars", count: 1 },
    { id: "radar-health", label: "Supply Chain Radar", count: 1 },
  ];

  return (
    <div className="h-screen w-full overflow-y-auto bg-[#fafbfc] text-slate-900 font-sans pb-28 selection:bg-cyan-100 selection:text-cyan-900">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/ask-ai"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500" />
              <span>Back to AI Assistant</span>
            </Link>
            <div className="h-4 w-px bg-slate-200 hidden sm:block" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 border border-cyan-200/80 px-2 py-0.5 rounded-md">
                  Reference UI Playbook
                </span>
                <span className="text-xs text-slate-600 hidden md:inline">/charts</span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight flex items-center gap-2">
                Analytics & Chart Components Gallery
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/cases"
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors"
            >
              Cases
            </Link>
            <Link
              to="/data-center"
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors"
            >
              Data Center
            </Link>
          </div>
        </div>

        {/* Filter Navigation Pills */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3 pt-1 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 min-w-max">
            {navFilters.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === tab.id ? "bg-slate-700 text-slate-200" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-12">

        {/* ------------------------------------------------------------------------- */}
        {/* CHART 1: REPORT-STYLE BAR CHART (FROM CXO DASHBOARD REPORTS) */}
        {/* ------------------------------------------------------------------------- */}
        {(activeTab === "all" || activeTab === "report-bar") && (
          <section id="report-bar" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-cyan-100 text-cyan-800">
                    <BarChart3 className="w-5 h-5" />
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-950 font-['Archivo']">
                    1. Report-Format Vertical Bar Chart
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  The exact high-contrast bar chart layout used in the AI Executive Report. Features custom cyan gradients,
                  floating numeric badge pills, dashed horizontal guidelines, and category sub-labels.
                </p>
              </div>

              {/* Dataset Toggle */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold self-start sm:self-auto">
                <button
                  onClick={() => setSelectedReportDataset("inventoryExposure")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    selectedReportDataset === "inventoryExposure"
                      ? "bg-white text-slate-900 shadow-2xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Capital Exposure ($)
                </button>
                <button
                  onClick={() => setSelectedReportDataset("stockoutRisk")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    selectedReportDataset === "stockoutRisk"
                      ? "bg-white text-slate-900 shadow-2xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Stockout Velocity (%)
                </button>
              </div>
            </div>

            {/* The Live Component */}
            <div className="space-y-2">
              <div>
                <span className="inline-flex items-center rounded-full text-xs sm:text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200/80 px-3 py-1">
                  {selectedReportDataset === "inventoryExposure"
                    ? "Inventory Exposure Concentration ($)"
                    : "Stockout Vulnerability Index (%)"}
                </span>
              </div>

              <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs">
                <div className="overflow-x-auto pb-1">
                  <div className="min-w-[500px]">
                    <div className="relative h-44 sm:h-52 w-full flex items-end justify-around px-4 sm:px-8 pt-8">
                      {/* Horizontal Dashed Guidelines */}
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                        <div className="border-b border-dashed border-slate-300 w-full" />
                        <div className="border-b border-dashed border-slate-300 w-full" />
                        <div className="border-b border-dashed border-slate-300 w-full" />
                        <div className="border-b border-dashed border-slate-300 w-full" />
                      </div>

                      {/* Columns */}
                      {reportBarDataSets[selectedReportDataset].map((bar, bIdx) => (
                        <div
                          key={bIdx}
                          className="flex flex-col items-center h-full justify-end group relative z-20 cursor-pointer"
                        >
                          {/* Floating Value Pill */}
                          <div className="mb-2 px-2.5 py-0.5 rounded-full bg-white border border-slate-200/90 text-xs font-bold text-slate-800 shadow-2xs whitespace-nowrap tabular-nums font-['Archivo'] group-hover:scale-105 group-hover:border-cyan-400 group-hover:text-cyan-800 transition-transform">
                            {bar.formattedValue}
                          </div>

                          {/* Gradient Bar Column */}
                          <div
                            style={{ height: `${bar.heightPercent}%` }}
                            className={`w-12 sm:w-16 rounded-t-lg transition-all duration-500 shadow-xs relative flex flex-col justify-start overflow-hidden ${
                              selectedReportDataset === "inventoryExposure"
                                ? "bg-gradient-to-t from-[#0e7490] via-[#0891b2] to-cyan-400 border-t border-x border-cyan-200"
                                : "bg-gradient-to-t from-rose-700 via-rose-600 to-amber-400 border-t border-x border-rose-200"
                            } group-hover:brightness-105`}
                          >
                            <div className="h-1.5 w-full bg-white/40 rounded-t-lg" />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Baseline axis */}
                    <div className="border-t border-slate-200 w-full" />

                    {/* Category Labels */}
                    <div className="flex items-start justify-around px-2 sm:px-6 pt-3">
                      {reportBarDataSets[selectedReportDataset].map((bar, bIdx) => (
                        <div key={bIdx} className="w-24 sm:w-32 text-center space-y-0.5">
                          <span className="text-xs sm:text-sm font-bold text-slate-950 block truncate leading-tight">
                            {bar.label}
                          </span>
                          <span className="text-[11px] sm:text-xs text-slate-600 font-medium block leading-tight">
                            {bar.subtext}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Implementation Details Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-600 shrink-0" />
                <span>
                  <strong>Implementation:</strong> Pure Tailwind CSS flexbox column model with{" "}
                  <code className="text-cyan-700 font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    bg-gradient-to-t from-[#0e7490] via-[#0891b2] to-cyan-400
                  </code>
                  . Ideal for crisp PDF exports and zero bundle overhead.
                </span>
              </div>
              <button
                onClick={() =>
                  handleCopyCode(
                    "report-bar",
                    `<div className="w-12 sm:w-16 rounded-t-lg bg-gradient-to-t from-[#0e7490] via-[#0891b2] to-cyan-400 border-t border-x border-cyan-200">\n  <div className="h-1.5 w-full bg-white/40 rounded-t-lg" />\n</div>`
                  )
                }
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-md font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                {copiedId === "report-bar" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === "report-bar" ? "Copied Snippet" : "Copy Bar CSS"}</span>
              </button>
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* CHART 2: DONUT & PIE CHARTS */}
        {/* ------------------------------------------------------------------------- */}
        {(activeTab === "all" || activeTab === "pie-donut") && (
          <section id="pie-donut" className="space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-800">
                  <PieChartIcon className="w-5 h-5" />
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-950 font-['Archivo']">
                  2. Pie & Donut Distribution Charts
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Merchandising portfolio allocation, inventory exposure breakdowns, and category capital distribution.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Donut Chart with Center Metric */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">
                        Capital Allocation
                      </span>
                      <h4 className="text-base font-bold text-slate-950">Category Donut Breakdown</h4>
                    </div>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                      5 Categories
                    </span>
                  </div>

                  <div className="h-64 w-full relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length && payload[0]) {
                              const data = payload[0].payload;
                              if (!data) return null;
                              return (
                                <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs shadow-lg space-y-1">
                                  <div className="font-bold">{data.name}</div>
                                  <div className="text-cyan-300 font-['Archivo'] font-semibold">
                                    ${(data.value / 1000).toFixed(0)}K ({data.share}%)
                                  </div>
                                  <div className="text-slate-400 text-[11px]">{data.highlight}</div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Pie
                          data={categoryDistributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={65}
                          outerRadius={95}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {categoryDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>

                    {/* Center Stat Cutout */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xs text-slate-500 font-medium">Total Capital</span>
                      <span className="text-xl font-bold text-slate-950 font-['Archivo']">$1.42M</span>
                      <span className="text-[10px] text-cyan-700 font-bold bg-cyan-50 px-1.5 py-0.2 rounded mt-0.5">
                        Active SKUs
                      </span>
                    </div>
                  </div>
                </div>

                {/* Donut Legend */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-xs">
                  {categoryDistributionData.map((cat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                      <div className="truncate">
                        <span className="font-semibold text-slate-800 truncate block">{cat.name}</span>
                        <span className="text-[11px] text-slate-500 font-['Archivo']">
                          ${(cat.value / 1000).toFixed(0)}K · {cat.share}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Classic Filled Pie with Explanatory Insights */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider block">
                        Exposure Distribution
                      </span>
                      <h4 className="text-base font-bold text-slate-950">Solid Segmented Pie Chart</h4>
                    </div>
                    <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                      38% At-Risk Deadstock
                    </span>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Tooltip
                          formatter={(value: any, name: any) => [`$${Number(value).toLocaleString()}`, name]}
                        />
                        <Pie
                          data={categoryDistributionData}
                          cx="50%"
                          cy="50%"
                          outerRadius={95}
                          dataKey="value"
                          labelLine={false}
                          label={({ name, percent }: any) =>
                            `${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {categoryDistributionData.map((entry, index) => (
                            <Cell key={`cell-solid-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Micro Table for Category Insight */}
                <div className="space-y-1.5 pt-4 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-500 font-medium px-1">
                    <span>Category Segment</span>
                    <span>Status / Risk</span>
                    <span>Capital Share</span>
                  </div>
                  {categoryDistributionData.slice(0, 3).map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50/70 border border-slate-100"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="font-semibold text-slate-800">{item.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-600 font-medium">{item.highlight}</span>
                      <span className="font-bold font-['Archivo'] text-slate-900">{item.share}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* CHART 3: LINE & AREA TRENDS */}
        {/* ------------------------------------------------------------------------- */}
        {(activeTab === "all" || activeTab === "line-area") && (
          <section id="line-area" className="space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                  <LineChartIcon className="w-5 h-5" />
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-950 font-['Archivo']">
                  3. Line & Smooth Area Trend Charts
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Time-series sales velocity, predictive forecast models, and safety stock threshold benchmarks.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Area Chart: Sales Velocity vs Forecast */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                      30-Day Velocity
                    </span>
                    <h4 className="text-base font-bold text-slate-950">Smooth Area Curve with Threshold</h4>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-1 bg-cyan-600 rounded-full" />
                      <span className="text-slate-600">Actual Units</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-1 bg-indigo-500 rounded-full" />
                      <span className="text-slate-600">Forecast</span>
                    </div>
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="cyanAreaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0891b2" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#0891b2" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="indigoAreaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.7} />
                      <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          border: "none",
                          borderRadius: "8px",
                          color: "#fff",
                          fontSize: "12px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="actualSales"
                        stroke="#0891b2"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#cyanAreaGradient)"
                        name="Actual Sales"
                      />
                      <Area
                        type="monotone"
                        dataKey="predictedDemand"
                        stroke="#6366f1"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        fillOpacity={1}
                        fill="url(#indigoAreaGradient)"
                        name="Demand Model"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Multi-Line Chart: Actual vs Safety Baseline */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block">
                      Supply Telemetry
                    </span>
                    <h4 className="text-base font-bold text-slate-950">Safety Stock Breach Analysis</h4>
                  </div>
                  <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                    Deficit Alert (Sep 20-30)
                  </span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.7} />
                      <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          border: "none",
                          borderRadius: "8px",
                          color: "#fff",
                          fontSize: "12px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="actualSales"
                        stroke="#0e7490"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "#0e7490" }}
                        activeDot={{ r: 6 }}
                        name="Inventory Velocity"
                      />
                      <Line
                        type="step"
                        dataKey="safetyStock"
                        stroke="#f43f5e"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                        name="Safety Threshold (800 units)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* CHART 4: GROUPED / MULTI-METRIC BAR CHARTS */}
        {/* ------------------------------------------------------------------------- */}
        {(activeTab === "all" || activeTab === "grouped-bars") && (
          <section id="grouped-bars" className="space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                  <BarChart2 className="w-5 h-5" />
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-950 font-['Archivo']">
                  4. Grouped & Comparative Multi-Bar Charts
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Comparing multiple metrics per category (e.g. Current On-Hand Capital vs Reorder Threshold vs Ideal Target).
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider block">
                    Comparative Variance
                  </span>
                  <h4 className="text-base font-bold text-slate-950">
                    On-Hand Stock vs. Reorder Threshold vs. Ideal Target
                  </h4>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-[#0e7490]" />
                    <span className="text-slate-700">On-Hand Stock ($K)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-amber-500" />
                    <span className="text-slate-700">Reorder Threshold</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-slate-300" />
                    <span className="text-slate-700">Ideal Benchmark</span>
                  </div>
                </div>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={multiBarComparisonData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.7} />
                    <XAxis dataKey="category" tick={{ fontSize: 12, fill: "#475569" }} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
                    <Tooltip
                      formatter={(val: any) => [`$${val}K`, ""]}
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "none",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="currentStockVal" fill="#0e7490" radius={[4, 4, 0, 0]} name="Current Stock" />
                    <Bar dataKey="reorderThreshold" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Reorder Point" />
                    <Bar dataKey="idealStock" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Ideal Model" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* CHART 5: HORIZONTAL RANKED PROGRESS BARS */}
        {/* ------------------------------------------------------------------------- */}
        {(activeTab === "all" || activeTab === "horizontal-ranked") && (
          <section id="horizontal-ranked" className="space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-rose-100 text-rose-800">
                  <SlidersHorizontal className="w-5 h-5" />
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-950 font-['Archivo']">
                  5. Horizontal Ranked Progress & Exposure Bars
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Highest capital risk SKUs ranked by trapped inventory exposure, optimal for compact tables and sidebars.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block">
                    Exposure Ranking
                  </span>
                  <h4 className="text-base font-bold text-slate-950">Top 5 Trapped Inventory SKUs</h4>
                </div>
                <span className="text-xs text-slate-500 font-medium">Ranked by Dollar Exposure</span>
              </div>

              <div className="space-y-3.5">
                {horizontalSkuRanking.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-white border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-slate-950">{item.sku}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500 font-medium">{item.units}</span>
                        <span className="text-xs font-bold font-['Archivo'] text-slate-900">
                          {item.trappedCapital}
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                            item.statusColor === "rose"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : item.statusColor === "amber"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : item.statusColor === "blue"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar Track */}
                    <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden relative">
                      <div
                        style={{ width: `${item.pct}%` }}
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.statusColor === "rose"
                            ? "bg-gradient-to-r from-rose-500 to-rose-600"
                            : item.statusColor === "amber"
                            ? "bg-gradient-to-r from-amber-400 to-amber-500"
                            : item.statusColor === "blue"
                            ? "bg-gradient-to-r from-cyan-500 to-blue-600"
                            : "bg-gradient-to-r from-emerald-400 to-emerald-500"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* CHART 6: RADAR / SPIDER CHART */}
        {/* ------------------------------------------------------------------------- */}
        {(activeTab === "all" || activeTab === "radar-health") && (
          <section id="radar-health" className="space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-purple-100 text-purple-800">
                  <Activity className="w-5 h-5" />
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-950 font-['Archivo']">
                  6. Supply Chain Radar / Spider Diagnostic
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Multi-dimensional supply chain telemetry evaluating lead time resilience, stockout risk, and turnover.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block">
                        Diagnostic Polygon
                      </span>
                      <h4 className="text-base font-bold text-slate-950">Supply Chain Health Index</h4>
                    </div>
                    <span className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md">
                      Overall Score: 61/100
                    </span>
                  </div>

                  <div className="h-64 sm:h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarHealthData}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#475569" }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" />
                        <Radar
                          name="Current Health Score"
                          dataKey="score"
                          stroke="#7c3aed"
                          fill="#8b5cf6"
                          fillOpacity={0.4}
                        />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Explanatory telemetry diagnostic notes */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-bold text-slate-950 mb-3">Diagnostic Telemetry Scores</h4>
                  <div className="space-y-3">
                    {radarHealthData.map((metric, mIdx) => (
                      <div key={mIdx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-800">{metric.subject}</span>
                          <span
                            className={`font-bold font-['Archivo'] ${
                              metric.score >= 75
                                ? "text-emerald-600"
                                : metric.score >= 50
                                ? "text-amber-600"
                                : "text-rose-600"
                            }`}
                          >
                            {metric.score} / 100
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${metric.score}%` }}
                            className={`h-full rounded-full ${
                              metric.score >= 75 ? "bg-emerald-500" : metric.score >= 50 ? "bg-amber-500" : "bg-rose-500"
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 p-3 bg-purple-50/70 border border-purple-200/80 rounded-lg text-xs text-purple-900">
                  <strong>Recommendation:</strong> Prioritize vendor lead-time buffer renegotiations for linen fabrics
                  to restore stockout resilience score above 70 threshold.
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* CHART 7: MINI SPARKLINES & KPI STATS */}
        {/* ------------------------------------------------------------------------- */}
        {activeTab === "all" && (
          <section className="space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-cyan-100 text-cyan-800">
                  <Activity className="w-5 h-5" />
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-950 font-['Archivo']">
                  7. KPI Metric Cards with Mini Sparklines
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Embedded micro-charts for high-density dashboard header ribbons and executive KPI summaries.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Card 1 */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-500 block">Weekly Sell-Through</span>
                  <span className="text-xl font-bold text-slate-950 font-['Archivo']">68.4%</span>
                  <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                    <TrendingUp className="w-3 h-3" /> +4.2% week-on-week
                  </span>
                </div>
                <div className="w-24 h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timelineData}>
                      <Line type="monotone" dataKey="actualSales" stroke="#10b981" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-500 block">Deadstock Capital</span>
                  <span className="text-xl font-bold text-rose-600 font-['Archivo']">$340.2K</span>
                  <span className="text-[11px] font-semibold text-rose-600 flex items-center gap-0.5 mt-0.5">
                    <TrendingDown className="w-3 h-3" /> Trapped in 4 SKUs
                  </span>
                </div>
                <div className="w-24 h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timelineData}>
                      <Area type="monotone" dataKey="returnRate" stroke="#f43f5e" fill="#fecdd3" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-500 block">Customer Return Rate</span>
                  <span className="text-xl font-bold text-slate-950 font-['Archivo']">5.2%</span>
                  <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-0.5 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-cyan-600" /> Below 6% ceiling
                  </span>
                </div>
                <div className="w-24 h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timelineData}>
                      <Line type="monotone" dataKey="safetyStock" stroke="#0891b2" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
