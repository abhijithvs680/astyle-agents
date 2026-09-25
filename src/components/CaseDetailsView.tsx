import { useState, useEffect, useRef, useMemo } from "react";
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  Activity,
  Send,
  FileText,
  Clock,
  Check,
  RotateCw,
  Bell,
  CheckCircle2,
  MoreVertical,
  Sparkles,
  RotateCcw,
  Table2,
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ListFilter,
  History,
  ArrowLeft,
  Archive,
  X,
  Mic,
  MicOff,
  Pill,
  MessageSquare,
  Database,
  Cpu,
  GitMerge,
  ShieldCheck,
} from "lucide-react";
import { AIAssistantDefaultView } from "./AIAssistantDefaultView";
import { ScanningRadarIcon } from "./ScanningRadarIcon";
import { ReportPipelineDiagram } from "./ReportPipelineDiagram";

export interface HistoryItem {
  id: string;
  title: string;
  timestamp: string;
}

export const caseHistoryList: HistoryItem[] = [
  {
    id: "case-1",
    title: "Products are creating the highest inventory exposure",
    timestamp: "Today at 08:30 am · Outerwear Exposure",
  },
  {
    id: "case-2",
    title: "Newly launched products performing, and which ones need attention.",
    timestamp: "Today at 07:15 am · Sell-Through Velocity",
  },
  {
    id: "case-3",
    title: "Generate the largest share of revenue, and how dependent is the business on them.",
    timestamp: "Yesterday at 04:20 pm · Mill Concentration",
  },
  {
    id: "case-4",
    title: "Products are entering the decline stage of their lifecycle, and what actions should be considered",
    timestamp: "2 days ago at 11:45 am · Lifecycle Exit",
  },
  {
    id: "case-5",
    title: "Stockouts caused the greatest loss in sales or customer demand",
    timestamp: "3 days ago at 02:10 pm · Sizing Stockout",
  },
];

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  content: string;
}

export const initialMessages: ChatMessage[] = [
  {
    id: "m-1",
    sender: "user",
    content: "What drove the 11.4% MoM revenue drop and margin compression in August?",
  },
  {
    id: "m-2",
    sender: "ai",
    content:
      "Chain gross revenue declined 11.4% MoM in August (falling from $1.60M to $1.42M), compressing EBITDA margins from 14.2% down to 9.8%.\n\nPrimary Contributory Drivers:\n• Acute Chronic Medication Stockouts: Stockout rates on top-50 chronic prescription drugs (antidiabetics, cardiac, antihypertensives) surged to 18.2%, causing an estimated $142,000 in lost basket conversions.\n• Quick-Commerce App Footfall Churn: Launch of competing 10-minute delivery dark stores in suburban clusters triggered a 19% drop in walk-in footfall, lowering average basket size from 3.4 to 2.6 items.\n• Severe Inventory Imbalance: While prescription essentials were unavailable, non-pharma personal care accumulated excess holding stock, locking up $310,000 in idle working capital (pushing DOS to 54 days).\n\nImmediate Action: Auto-transfer surplus cardiac/diabetic stock to Central Zone within 48 hours and launch a promotional clearance for personal care stock >90 days old.",
  },
];

export interface CaseKpiItem {
  icon: typeof Activity;
  source: string;
  timeframe: string;
  headline: string;
  baselineLabel: string;
  baselineValue: string;
  automatedLabel: string;
  automatedValue: string;
  delta: string;
  status: string;
  positive: boolean;
}

export const defaultCaseKpis: [CaseKpiItem, CaseKpiItem] = [
  {
    icon: DollarSign,
    source: "Apparel Merchandising & Inventory Feed",
    timeframe: "End-of-Season Exposure Audit",
    headline: "Gross Inventory Exposure Deficit",
    baselineLabel: "Budgeted Exposure Cap",
    baselineValue: "$150,000 max cap",
    automatedLabel: "Current Exposure",
    automatedValue: "$420,000 tied up",
    delta: "+$270,000 over budget",
    status: "68 Days of Supply remaining",
    positive: false,
  },
  {
    icon: TrendingDown,
    source: "Warehouse Logistics & SKU Velocity",
    timeframe: "Regional Distribution Hubs",
    headline: "Outerwear Sell-Through Ratio",
    baselineLabel: "Target Benchmark",
    baselineValue: "78.0% full-price target",
    automatedLabel: "Current Sell-Through",
    automatedValue: "41.2% achieved",
    delta: "↓ 36.8% sell-through lag",
    status: "4,800 overcoat units at risk",
    positive: false,
  },
];

export const caseKpis: Record<string, [CaseKpiItem, CaseKpiItem]> = {
  "case-1": defaultCaseKpis,
  "case-2": [
    {
      icon: TrendingUp,
      source: "Spring Launch Sell-Through Engine",
      timeframe: "First 18 Days of Launch",
      headline: "Spring Linen Shirts Sell-Through",
      baselineLabel: "Forecast Target",
      baselineValue: "60.0% sell-through",
      automatedLabel: "Current Velocity",
      automatedValue: "84.2% full-price",
      delta: "↑ 24.2% outperformance",
      status: "3.2x reorder pace required",
      positive: true,
    },
    {
      icon: TrendingDown,
      source: "Apparel SKU Diagnostics",
      timeframe: "New Silhouette Launch",
      headline: "Utility Cargo Pants Conversion",
      baselineLabel: "Category Benchmark",
      baselineValue: "55.0% sell-through",
      automatedLabel: "Current Velocity",
      automatedValue: "28.0% sell-through",
      delta: "↓ 27.0% lag behind target",
      status: "Ad spend reallocation needed",
      positive: false,
    },
  ],
  "case-3": [
    {
      icon: DollarSign,
      source: "Revenue Portfolio Analytics",
      timeframe: "Monthly Gross Apparel Sales",
      headline: "Core Denim Revenue Share",
      baselineLabel: "Healthy Concentration",
      baselineValue: "25.0% revenue share",
      automatedLabel: "Current Share",
      automatedValue: "42.6% of total revenue",
      delta: "$1.28M monthly volume",
      status: "High portfolio dependency",
      positive: false,
    },
    {
      icon: TrendingDown,
      source: "Fabric Sourcing & Mill Allocation",
      timeframe: "Primary Fabric Mill Audit",
      headline: "Single-Mill Fabric Dependency",
      baselineLabel: "Diversification Target",
      baselineValue: "40.0% max mill share",
      automatedLabel: "Current Mill Share",
      automatedValue: "78.5% single origin",
      delta: "+38.5% mill exposure",
      status: "Dual-sourcing required",
      positive: false,
    },
  ],
  "case-4": [
    {
      icon: TrendingDown,
      source: "Product Lifecycle Monitor",
      timeframe: "MoM Sales Volume Trend",
      headline: "Knit Polos Velocity Drop",
      baselineLabel: "Prior Month Run-Rate",
      baselineValue: "3,800 units/mo",
      automatedLabel: "Current Volume",
      automatedValue: "2,450 units/mo",
      delta: "↓ 35.4% MoM contraction",
      status: "Lifecycle decline stage",
      positive: false,
    },
    {
      icon: DollarSign,
      source: "Inventory Valuation & Clearance",
      timeframe: "Remaining Seasonal Stock",
      headline: "Unsold Units at Decline",
      baselineLabel: "Exit Plan Target",
      baselineValue: "2,000 units target",
      automatedLabel: "Current Unsold Stock",
      automatedValue: "8,420 units trapped",
      delta: "+6,420 excess units",
      status: "Phased markdown recommended",
      positive: false,
    },
  ],
  "case-5": [
    {
      icon: TrendingDown,
      source: "Retail POS & Stockout Telemetry",
      timeframe: "Past 30 Days Across Stores",
      headline: "Lost Demand from Stockouts",
      baselineLabel: "Tolerable Stockout Loss",
      baselineValue: "$12,000 / month",
      automatedLabel: "Current Unfulfilled",
      automatedValue: "$86,400 lost sales",
      delta: "+$74,400 uncaptured demand",
      status: "Sizes M & L depleted",
      positive: false,
    },
    {
      icon: Activity,
      source: "E-Commerce Search & Conversion",
      timeframe: "High-Intent Out-of-Stock Traffic",
      headline: "Stockout Search Bounce Rate",
      baselineLabel: "Benchmark Bounce",
      baselineValue: "30.0% bounce rate",
      automatedLabel: "Current Bounce",
      automatedValue: "88.0% exit rate",
      delta: "+58.0% customer churn",
      status: "4,120 unfulfilled searches",
      positive: false,
    },
  ],

  "case-fever": [
    {
      icon: Pill,
      source: "Hospital Formulary & Dispensary",
      timeframe: "Real-time Inventory",
      headline: "Pediatric Paracetamol Stock",
      baselineLabel: "Safety Stock Buffer",
      baselineValue: "120 units",
      automatedLabel: "Current Stock",
      automatedValue: "184 units (100% fill)",
      delta: "+64 units surplus",
      status: "Verified Batch Exp 2028",
      positive: true,
    },
    {
      icon: Activity,
      source: "Pediatric Dosing Engine",
      timeframe: "Patient Age: 5y (19 kg)",
      headline: "Calculated Single Monotherapy Dose",
      baselineLabel: "Weight-Based Guideline",
      baselineValue: "15mg / kg bodyweight",
      automatedLabel: "Calculated Single Dose",
      automatedValue: "285mg (q4-6h)",
      delta: "Max 4 doses/24h",
      status: "Oral syringe recommended",
      positive: true,
    },
  ],
};

export interface CaseAssistantConfig {
  suggestions: string[];
}

export const caseAssistantConfigs: Record<string, CaseAssistantConfig> = {
  "case-1": {
    suggestions: [
      "Which outerwear styles have more than 60 days of supply?",
      "What markdown percentage clears the $420,000 excess inventory?",
      "Which regional warehouses have the highest overstock of overcoats?",
      "Can excess wool coats be transferred to cold-climate store clusters?",
    ],
  },
  "case-2": {
    suggestions: [
      "Why are Utility Cargo pants lagging at 28% sell-through?",
      "How fast should we re-order the Spring Linen shirt collection?",
      "What marketing channels are driving highest conversion for new launches?",
      "Recommend promotional bundles to lift cargo pant sales velocity",
    ],
  },
  "case-3": {
    suggestions: [
      "How vulnerable is gross margin if denim fabric supply is delayed?",
      "Which secondary product lines can reduce dependency on denim?",
      "What is the profit margin profile of our top 4 denim SKUs?",
      "Should we onboard a secondary denim fabric mill in Vietnam?",
    ],
  },
  "case-4": {
    suggestions: [
      "What is the recommended phased markdown schedule for knit polos?",
      "Should we liquidate declining inventory via outlet stores or online sale?",
      "What is the gross margin recovery estimate at 25% vs 40% discount?",
      "Which SKUs should be discontinued from next season's line sheet?",
    ],
  },
  "case-5": {
    suggestions: [
      "Which store locations lost the most sales due to size M and L stockouts?",
      "How much revenue can be recovered by automated inter-store stock transfers?",
      "What is the lead time from our primary manufacturer for restocking Oxford shirts?",
      "Can we set dynamic safety stock buffers for core size runs?",
    ],
  },
  "case-fever": {
    suggestions: [
      "What is the exact Paracetamol dosage for a 19kg 5-year-old?",
      "Can Ibuprofen and Paracetamol be alternated?",
      "Which nearby pharmacy branches have pediatric suspension?",
      "What are the red-flag fever symptoms needing ER care?",
    ],
  },
};

export interface CaseSectionData {
  keyDataPoints: string[];
  suggestedNextSteps: string[];
}

export interface KeyMetricRow {
  metric: string;
  current: string;
  target: string;
  variance: string;
  negative: boolean;
}

export const case1KeyMetrics: KeyMetricRow[] = [
  {
    metric: "Gross Inventory Exposure",
    current: "$420,000",
    target: "$150,000",
    variance: "+180%",
    negative: true,
  },
  {
    metric: "Outerwear Days of Supply",
    current: "68 Days",
    target: "32 Days",
    variance: "+36 Days",
    negative: true,
  },
  {
    metric: "Category Gross Margin",
    current: "41.2%",
    target: "58.0%",
    variance: "-16.8%",
    negative: true,
  },
  {
    metric: "Excess Unsold Outerwear Units",
    current: "4,800 Pcs",
    target: "1,200 Pcs",
    variance: "+3,600 Pcs",
    negative: true,
  },
  {
    metric: "Monthly Warehouse Holding Surcharge",
    current: "$18,400/mo",
    target: "$6,500/mo",
    variance: "+$11,900",
    negative: true,
  },
];

export interface SampleDataRecord {
  branchId: string;
  categoryItem: string;
  issueDetected: string;
  financialImpact: string;
  driver: string;
}

export const case1SampleData: SampleDataRecord[] = [
  {
    branchId: "WH-NORTH (Central Hub)",
    categoryItem: "Double-Breasted Wool Overcoat (Camel)",
    issueDetected: "1,840 units idle (74 DOS)",
    financialImpact: "$165,600 trapped cash",
    driver: "Mild winter weather anomaly",
  },
  {
    branchId: "STORE-014 (Downtown Flagship)",
    categoryItem: "Faux-Shearling Aviator Jacket (Black)",
    issueDetected: "Sell-through 31% vs 75% target",
    financialImpact: "$98,000 exposure",
    driver: "Price point resistance ($320 AUR)",
  },
  {
    branchId: "STORE-022 (Westfield Galleria)",
    categoryItem: "Belted Trench Coat (Houndstooth)",
    issueDetected: "Zero turnover past 45 days",
    financialImpact: "$84,400 exposure",
    driver: "Regional fashion fit preference",
  },
  {
    branchId: "WH-SOUTH (Dallas Depot)",
    categoryItem: "Quilted Down Winter Parkas",
    issueDetected: "Excess stock in warm climate zone",
    financialImpact: "$72,000 trapped cash",
    driver: "Initial allocation miscalculation",
  },
];

export const caseSectionData: Record<string, CaseSectionData> = {
  "case-1": {
    keyDataPoints: [
      "Severe Seasonal Overstock: 4,800 units of double-breasted wool overcoats and shearling jackets remain unsold past peak winter season, tying up $420,000 in working capital.",
      "Days of Supply (DOS) Distortion: Current outerwear DOS stands at 68 days compared to healthy operational benchmark of 32 days, creating warehouse storage surcharges.",
      "Geographic Imbalance: Northern regional distribution centers hold only 18% of overcoats while Southern and Western stores hold 82% where winter temperatures are unseasonably warm.",
      "Depreciation Risk: Holding seasonal styles past March will result in an estimated 55% write-down loss if carried forward into the next fiscal year.",
    ],
    suggestedNextSteps: [
      "Initiate Phased Flash Markdown: Launch a 30% VIP promotional markdown on overcoats for 10 days, followed by 45% clearance to recover at least $280,000 in cash.",
      "Inter-Regional Stock Transfer: Immediately re-route 1,600 units from Southern retail outlets to high-demand Northern and alpine resort flagship doors.",
      "Factory PO Curtailment: Freeze remaining late-season outerwear production commitments with primary garment manufacturers.",
      "Bundle Promotion: Pair slow-moving wool outerwear with high-margin cashmere accessories at a 20% combo incentive.",
    ],
  },
  "case-2": {
    keyDataPoints: [
      "Bifurcated Launch Trajectory: Spring Linen shirts reached 84.2% full-price sell-through within 18 days of release, outperforming initial merchandise forecasts by 3.2x.",
      "Underperforming Silhouette: High-Rise Utility Cargo pants recorded only 28.0% sell-through, severely lagging behind category benchmark due to customer fit feedback on pocket placement.",
      "Digital Ad Spend Misallocation: 62% of paid acquisition spend was directed toward cargo pants with a poor 1.4x ROAS, while high-converting linen shirts received only 18% ad budget.",
      "E-Commerce Return Rate: Cargo pants experienced an elevated 31% return rate citing inseam sizing inconsistency, whereas linen shirts maintained an industry-low 4.2% return rate.",
    ],
    suggestedNextSteps: [
      "Reallocate Ad Budget: Shift 40% of digital marketing spend immediately to top-performing Spring Linen lines to capture peak full-margin demand.",
      "Merchandising Styling Guide: Update e-commerce styling imagery for Utility Cargo pants featuring tailored tops and casual sneakers to improve styling appeal.",
      "Fit Specification Review: Meet with technical apparel design team to adjust cargo pant waist-to-hip grading before placing season 2 re-orders.",
      "Targeted Email Campaign: Send styling recommendations and customer reviews to shoppers who added cargo pants to cart but did not purchase.",
    ],
  },
  "case-3": {
    keyDataPoints: [
      "High Category Concentration: Four core denim SKUs (Slim Stretch Denim in Indigo, Black, Vintage Wash, and Relaxed Taper) account for 42.6% ($1.28M) of total monthly garment revenue.",
      "Single-Origin Fabric Mill: 78.5% of raw stretch denim fabric is procured from a single spinning mill in Coimbatore, creating severe vulnerability to supply chain shocks.",
      "Repeat Purchase Driver: 64% of first-time denim buyers return within 90 days to purchase a second pair, making denim the primary customer acquisition anchor.",
      "Margin Protection: Core denim maintains our highest gross margin at 62.4%, offsetting lower-margin seasonal fashion pieces.",
    ],
    suggestedNextSteps: [
      "Dual-Sourcing Onboarding: Qualify and onboard a secondary denim fabric supplier in Vietnam to eliminate the single-point dependency within 60 days.",
      "Strategic Buffer Inventory: Establish a rolling 45-day safety stock buffer of core denim greige fabric to insulate against raw cotton price fluctuations.",
      "Adjacent Category Cross-Selling: Leverage denim customer retention to cross-promote complementary woven shirts, leather belts, and knit tees.",
      "Long-Term Volume Pricing: Lock in a 12-month fixed cotton denim contract with the primary mill to protect against raw material inflation.",
    ],
  },
  "case-4": {
    keyDataPoints: [
      "Accelerated Volume Decline: Merino knit polo shirts and thermal waffle henleys recorded a 35.4% MoM drop in weekly sell-through across all retail channels.",
      "Unsold Inventory Accumulation: 8,420 units remain across regional distribution hubs, with customer footfall shifting rapidly toward lightweight spring knits.",
      "Margin Degradation Trend: Average realized selling price dropped from $78.00 to $54.20 as regional store managers initiated ad-hoc localized discounting.",
      "Size Breakdown Skew: Remaining inventory is heavily concentrated in extreme sizes (XS and XXL), which turnover at less than one-third the speed of core sizes.",
    ],
    suggestedNextSteps: [
      "Structured Clearance Cadence: Standardize a chain-wide 25% discount for 14 days, graduating to 40% final clearance on remaining XS/XXL units.",
      "Omnichannel Web Exclusive: Move remaining extreme sizes from physical store floors to centralized e-commerce fulfillment to lower store clutter.",
      "SKU Pruning for Next Season: Remove underperforming colorways (Mustard Yellow, Heather Rust) from the upcoming Autumn/Winter line sheet.",
      "Outlet Channel Liquidation: Package unsold stock over 60 days old for secondary outlet store distribution at cost-plus margin recovery.",
    ],
  },
  "case-5": {
    keyDataPoints: [
      "Core Size Breakdowns: Size Medium and Large stockouts across Waterproof Commuter Parkas and Classic White Oxford Shirts generated $86,400 in lost gross sales.",
      "High-Intent Abandonment: On-site e-commerce search logs show 4,120 searches for sizes M/L that returned 'Out of Stock' notices with an 88% bounce rate.",
      "Store-to-Store Stock Distortion: Five urban flagship stores experienced complete stockouts for 14 consecutive days while 6 suburban stores had surplus inventory.",
      "Customer Lifetime Value Threat: 24% of surveyed shoppers who encountered stockouts purchased an equivalent garment from a direct competitor.",
    ],
    suggestedNextSteps: [
      "Automated Inter-Store Balancing: Trigger immediate overnight transfers of 650 units of sizes M & L from overstocked suburban stores to top urban doors.",
      "Air-Freight Restock PO: Expedite a 2,000-unit replenishment run of Classic White Oxford Shirts via air freight to bridge the 3-week ocean shipping gap.",
      "Back-in-Stock Notification Engine: Activate automated SMS/email alerts for customers who signed up on out-of-stock product pages.",
      "Dynamic Safety Stock Recalibration: Increase baseline safety stock multipliers from 1.2x to 1.8x for core size runs (M, L) in fast-turning metropolitan doors.",
    ],
  },
  "case-fever": {
    keyDataPoints: [
      "First-Line Antipyretic: Pediatric Paracetamol (Acetaminophen) suspension (120mg/5ml or 250mg/5ml) at 15mg/kg every 4–6 hours (max 4 doses in 24 hours). For a 5-year-old child weighing ~19kg, target single dose is 285mg (~5.7ml of 250mg/5ml suspension).",
      "Alternative / Second-Line: Pediatric Ibuprofen suspension (100mg/5ml) at 10mg/kg every 6–8 hours with or after meals (target single dose ~190mg, or 9.5ml of 100mg/5ml).",
      "Strict Contraindication: Aspirin (acetylsalicylic acid) must NEVER be given to children under 16 years of age due to the risk of Reye's syndrome (acute encephalopathy and fatty liver).",
      "Inventory Telemetry: All 4 central and ambulatory hospital dispensaries currently have verified stock of sugar-free pediatric suspensions and calibrated oral measuring syringes.",
    ],
    suggestedNextSteps: [
      "Always verify child's current weight in kilograms rather than estimating solely by chronological age.",
      "Dispense with an oral dosing syringe to ensure accurate volumetric measurement; advise parents never to use household teaspoons.",
      "Advise caregiver to maintain adequate hydration with oral rehydration solutions or water, and dress child in light breathable layers.",
      "Instruct parents to seek immediate emergency medical care if the child exhibits lethargy, stiff neck, breathing difficulty, or an unexplained non-blanching rash.",
    ],
  },
};

export interface CaseSummaryConfig {
  narrative: string;
  points?: string[] | undefined;
  quote: string;
  metrics: { label: string; val: string; alert?: boolean }[];
}

export const caseSummaries: Record<string, CaseSummaryConfig> = {
  "case-1": {
    narrative:
      "Garment inventory analysis indicates that heavy outerwear (wool overcoats, shearling jackets, and winter trenches) represents the business's highest financial exposure, tying up $420,000 across regional distribution centers with 68 days of supply remaining past the seasonal peak. A mild winter and poor initial geographical allocation left high-price SKUs trapped in warm-climate stores, risking a 55% valuation write-down if not liquidated promptly.",
    points: [
      "Zero store turnover recorded in Southern regions over the past 45 days due to mild winter weather.",
      "4,800 unsold units face an estimated 55% valuation write-down if held past the spring floor-set date.",
      "Recommended action: Run an immediate 30% private VIP markdown and transfer 1,600 units to cold-climate flagships.",
    ],
    quote:
      "Outerwear exposure reached $420,000 with 68 days of supply remaining past the seasonal peak. Recommended intervention: an immediate 30% VIP promotional markdown combined with transferring 1,600 units from Southern depots to cold-weather flagship doors.",
    metrics: [
      { label: "Inventory Exposure", val: "$420,000", alert: true },
      { label: "Days of Supply", val: "68 Days (+36d)", alert: true },
      { label: "Gross Margin", val: "41.2% (-16.8%)", alert: true },
      { label: "Excess Stock", val: "4,800 Units", alert: true },
    ],
  },
  "case-2": {
    narrative:
      "Analysis of recent new product launches reveals a stark divide in performance. The Spring Linen Shirt collection is performing exceptionally well, achieving 84.2% full-price sell-through in its first 18 days (3.2x forecast velocity). In contrast, the High-Rise Utility Cargo pants are severely lagging at 28.0% sell-through, impacted by customer feedback regarding waist-to-hip fit and poorly targeted ad spend.",
    points: [
      "Spring Linen Shirts are selling at 3.2x forecast speed (84.2% sell-through) with fast stock depletion.",
      "Utility Cargo pants lag at 28% sell-through, with 68% of customer returns citing waist-to-hip fit issues.",
      "Recommended action: Shift $35,000 in top-of-funnel ad spend to linen and revise cargo fit patterns before batch 2.",
    ],
    quote:
      "Spring Linen Shirts exceeded forecast at 84.2% sell-through, while High-Rise Utility Cargo pants lag at 28.0% with a 31% return rate. Recommended action: shift 40% of digital marketing budget to linen shirts and revise cargo fit specifications before next production run.",
    metrics: [
      { label: "Linen Sell-Through", val: "84.2% (Top)", alert: false },
      { label: "Cargo Sell-Through", val: "28.0% (Lagging)", alert: true },
      { label: "Cargo Return Rate", val: "31.0%", alert: true },
      { label: "Linen ROAS", val: "4.8x", alert: false },
    ],
  },
  "case-3": {
    narrative:
      "Core denim products generate 42.6% ($1.28M monthly) of total apparel gross revenue, led by four signature fits: Slim Stretch, Relaxed Vintage, Straight Leg, and High-Taper. While denim provides the company's highest gross margins (62.4%) and drives 64% of repeat customer purchases, the business has a dangerous 78.5% reliance on a single denim fabric spinning mill in Coimbatore, creating acute operational vulnerability.",
    points: [
      "Core denim generates $1.28M monthly (42.6% of company revenue) at a healthy 62.4% gross margin.",
      "78.5% single-mill supplier reliance in Coimbatore creates a potential $850,000 monthly disruption risk.",
      "Recommended action: Onboard a secondary certified mill in Vietnam within 60 days and build a 45-day greige buffer.",
    ],
    quote:
      "Denim drives 42.6% of monthly revenue and 64% of customer retention, but 78.5% of fabric comes from a single mill. Critical action: onboard a qualified secondary denim mill in Vietnam within 60 days and establish a rolling 45-day safety buffer of core greige fabric.",
    metrics: [
      { label: "Revenue Share", val: "42.6% ($1.28M)", alert: true },
      { label: "Single-Mill Risk", val: "78.5%", alert: true },
      { label: "Denim Margin", val: "62.4%", alert: false },
      { label: "90-Day Retention", val: "64.0%", alert: false },
    ],
  },
  "case-4": {
    narrative:
      "Merino knit polo shirts and thermal henleys have officially entered the decline stage of their product lifecycle, exhibiting consecutive 35.4% MoM declines in unit sell-through across retail doors. 8,420 unsold units remain in inventory as seasonal demand transitions to spring weights. Realized selling prices have degraded to $54.20 (-30.5%) due to ad-hoc in-store discounting.",
    points: [
      "Volume contracted 35.4% MoM across three consecutive months, confirming terminal product lifecycle decline.",
      "8,420 unsold units remain, with 61.2% concentrated in fringe sizes (XS/XXL) causing store fixture clutter.",
      "Recommended action: Halt ad-hoc discounting, run a structured 25%/40% clearance, and centralize extreme sizes online.",
    ],
    quote:
      "Knit polos dropped 35.4% in volume with 8,420 unsold units trapped in decline. Corrective strategy: replace ad-hoc discounting with a structured 25%-then-40% chain-wide clearance schedule and consolidate extreme sizes (XS/XXL) into centralized e-commerce channels.",
    metrics: [
      { label: "Velocity Decline", val: "-35.4% MoM", alert: true },
      { label: "Unsold Units", val: "8,420 Pcs", alert: true },
      { label: "Realized AUR", val: "$54.20 (-$23.80)", alert: true },
      { label: "Extreme Size Share", val: "61.2%", alert: true },
    ],
  },
  "case-5": {
    narrative:
      "Stockouts in core garment sizes Medium and Large resulted in $86,400 in direct lost sales over the past 30 days. The shortages are concentrated in high-velocity essential garments, specifically Waterproof Commuter Parkas and Classic White Oxford Shirts. 4,120 e-commerce search sessions encountered out-of-stock messages with an 88% bounce rate, while 24% of surveyed shoppers bought from competitors.",
    points: [
      "Core sizes Medium and Large dropped to 71.2% in-stock availability in essential parkas and white shirts.",
      "4,120 zero-stock search sessions triggered an 88% customer bounce rate and $86,400 in lost revenue.",
      "Recommended action: Overnight transfer of 650 units from suburban stores and expedite 2,000 units via air freight.",
    ],
    quote:
      "Size M & L stockouts caused $86,400 in lost demand with an 88% bounce rate on out-of-stock search queries. Immediate resolution: overnight transfer of 650 units from suburban stores, expediting 2,000 units via air freight, and recalibrating core size safety stock multipliers to 1.8x.",
    metrics: [
      { label: "Lost Demand", val: "-$86,400", alert: true },
      { label: "Size Availability", val: "71.2% (-26.8%)", alert: true },
      { label: "Stockout Bounce", val: "88.0%", alert: true },
      { label: "Air-Freight Restock", val: "2,000 Units", alert: false },
    ],
  },
  "case-fever": {
    narrative:
      "Clinical protocol for managing fever in a 5-year-old child (approx. 18–20 kg). First-line recommended monotherapy is Pediatric Paracetamol (Acetaminophen) oral suspension at 15mg/kg every 4–6 hours (maximum 4 doses in 24 hours), or Pediatric Ibuprofen oral suspension at 10mg/kg every 6–8 hours with meals. Hospital inventory telemetry confirms full stock availability across all outpatient dispensaries with zero active lot recalls.",
    points: [
      "First-line monotherapy: Paracetamol 15mg/kg every 4–6h (max 4 doses/24h) or Ibuprofen 10mg/kg every 6–8h with food.",
      "Strict contraindication: Never administer Aspirin to children under 16 years due to fatal Reye's syndrome risk.",
      "Administration guidance: Use a calibrated oral dosing syringe rather than household spoons for accurate volume.",
    ],
    quote:
      "Clinical Warning: Never administer Aspirin to children under 16 years of age due to fatal Reye's syndrome risk. Use calibrated oral measuring syringes to avoid household spoon dosing inaccuracies.",
    metrics: [
      { label: "Paracetamol Stock", val: "184 Units (100%)", alert: false },
      { label: "Ibuprofen Stock", val: "96 Units (100%)", alert: false },
      { label: "Paracetamol Dose", val: "15mg/kg (q4-6h)", alert: true },
      { label: "Safety Warning", val: "No Aspirin <16y", alert: true },
    ],
  },
};

export const caseKeyMetricsData: Record<string, KeyMetricRow[]> = {
  "case-1": case1KeyMetrics,
  "case-2": [
    { metric: "Spring Linen Sell-Through", current: "84.2%", target: "60.0%", variance: "+24.2%", negative: false },
    { metric: "Utility Cargo Sell-Through", current: "28.0%", target: "55.0%", variance: "-27.0%", negative: true },
    { metric: "New Launch Blended ROAS", current: "2.4x", target: "3.5x", variance: "-1.1x", negative: true },
    { metric: "Full-Price Realization", current: "76.5%", target: "82.0%", variance: "-5.5%", negative: true },
    { metric: "Cargo Silhouette Return Rate", current: "31.0%", target: "10.0%", variance: "+21.0%", negative: true },
  ],
  "case-3": [
    { metric: "Core Denim Revenue Share", current: "42.6%", target: "25.0%", variance: "+17.6%", negative: true },
    { metric: "Primary Fabric Mill Dependency", current: "78.5%", target: "40.0%", variance: "+38.5%", negative: true },
    { metric: "Core Denim Gross Margin", current: "62.4%", target: "60.0%", variance: "+2.4%", negative: false },
    { metric: "90-Day Repeat Purchase Rate", current: "64.0%", target: "50.0%", variance: "+14.0%", negative: false },
    { metric: "Secondary Mill Sourced Volume", current: "21.5%", target: "60.0%", variance: "-38.5%", negative: true },
  ],
  "case-4": [
    { metric: "Knit Polo Sales Velocity", current: "-35.4% MoM", target: "0.0%", variance: "-35.4%", negative: true },
    { metric: "Remaining Unsold Seasonal Units", current: "8,420 Pcs", target: "2,000 Pcs", variance: "+6,420 Pcs", negative: true },
    { metric: "Realized Average Unit Retail", current: "$54.20", target: "$78.00", variance: "-$23.80", negative: true },
    { metric: "Extreme Size Proportion (XS/XXL)", current: "61.2%", target: "20.0%", variance: "+41.2%", negative: true },
    { metric: "Clearance Margin Recovery", current: "34.0%", target: "45.0%", variance: "-11.0%", negative: true },
  ],
  "case-5": [
    { metric: "Lost Demand Exposure", current: "-$86,400", target: "$0", variance: "-$86,400", negative: true },
    { metric: "Core Size (M & L) In-Stock Rate", current: "71.2%", target: "98.0%", variance: "-26.8%", negative: true },
    { metric: "Out-of-Stock Search Bounce", current: "88.0%", target: "30.0%", variance: "+58.0%", negative: true },
    { metric: "Store-to-Store Stock Disparity", current: "46.0%", target: "12.0%", variance: "+34.0%", negative: true },
    { metric: "Ocean Freight Restock Lead Time", current: "22 Days", target: "7 Days", variance: "+15 Days", negative: true },
  ],
  "case-fever": [
    { metric: "Paracetamol 250mg/5ml Stock", current: "184 Bottles", target: "100 Bottles", variance: "+84 Surplus", negative: false },
    { metric: "Ibuprofen 100mg/5ml Stock", current: "96 Bottles", target: "60 Bottles", variance: "+36 Surplus", negative: false },
    { metric: "Paracetamol Target Dose", current: "285mg (15mg/kg)", target: "15mg/kg", variance: "Exact", negative: false },
    { metric: "Ibuprofen Target Dose", current: "190mg (10mg/kg)", target: "10mg/kg", variance: "Exact", negative: false },
    { metric: "Safety Max Daily Limits", current: "Max 4 doses/24h", target: "4 doses max", variance: "Verified", negative: false },
  ],
};

export const caseSampleTelemetryData: Record<string, { records: SampleDataRecord[]; totalExposure: string; coverage: string }> = {
  "case-1": {
    records: case1SampleData,
    totalExposure: "$420,000",
    coverage: "Across 4 regional warehouses & flagship stores",
  },
  "case-2": {
    records: [
      { branchId: "SKU-LIN-01", categoryItem: "Spring Linen Band-Collar Shirt (Sky Blue)", issueDetected: "84.2% sell-through in 18d", financialImpact: "+$94,000 full price", driver: "Influencer viral traction" },
      { branchId: "SKU-CAR-04", categoryItem: "High-Rise Utility Cargo Pant (Olive)", issueDetected: "28.0% sell-through lag", financialImpact: "-$64,000 unbooked", driver: "Waist-to-hip fit grading" },
      { branchId: "SKU-LIN-03", categoryItem: "Relaxed French Linen Over-Shirt (Sand)", issueDetected: "Stock depleted in sizes S & M", financialImpact: "-$18,500 uncaptured", driver: "Conservative launch buy" },
      { branchId: "SKU-CAR-02", categoryItem: "Cropped Cargo Trousers (Washed Black)", issueDetected: "High e-commerce returns (34%)", financialImpact: "-$22,000 returns cost", driver: "Inseam length feedback" },
    ],
    totalExposure: "$86,000 variance",
    coverage: "Across 4 launch apparel silhouettes",
  },
  "case-3": {
    records: [
      { branchId: "SKU-DNM-01", categoryItem: "Slim Stretch Denim (Dark Indigo)", issueDetected: "380k units/mo (Single mill)", financialImpact: "$580,000 / mo", driver: "Core customer acquisition" },
      { branchId: "SKU-DNM-02", categoryItem: "Relaxed Vintage Denim (Light Wash)", issueDetected: "240k units/mo (Single mill)", financialImpact: "$390,000 / mo", driver: "Gen-Z demographic trend" },
      { branchId: "SKU-DNM-03", categoryItem: "Classic Straight Leg Denim (Raw Rinse)", issueDetected: "140k units/mo (Single mill)", financialImpact: "$210,000 / mo", driver: "Workwear staple cross-sell" },
      { branchId: "MILL-COIMB", categoryItem: "Primary Spinning Mill (Coimbatore)", issueDetected: "78.5% total fabric allocation", financialImpact: "$1.28M at risk", driver: "Single-origin concentration" },
    ],
    totalExposure: "$1,280,000 monthly",
    coverage: "Across top 4 denim lines & primary fabric supplier",
  },
  "case-4": {
    records: [
      { branchId: "SKU-POLO-02", categoryItem: "Merino Wool Knit Polo (Heather Rust)", issueDetected: "Sell-through -38% MoM", financialImpact: "$44,200 tied cash", driver: "Seasonal transition to spring" },
      { branchId: "SKU-HEN-01", categoryItem: "Thermal Waffle Henley (Charcoal Grey)", issueDetected: "Sell-through -33% MoM", financialImpact: "$38,000 tied cash", driver: "Consumer weight preference" },
      { branchId: "STORE-OUTLET", categoryItem: "Extreme Sizes (XS & XXL Knitwear)", issueDetected: "61.2% of remaining stock", financialImpact: "$52,000 trapped cash", driver: "Imbalanced size run exit" },
      { branchId: "WH-WEST", categoryItem: "Discontinued Colorways (Mustard)", issueDetected: "Zero movement past 60 days", financialImpact: "$28,500 exposure", driver: "Clearance bundle candidate" },
    ],
    totalExposure: "$162,700",
    coverage: "Across 4 declining knitwear SKU groups",
  },
  "case-5": {
    records: [
      { branchId: "STORE-NYC", categoryItem: "Waterproof Commuter Parka (Size M & L)", issueDetected: "Stockout for 14 straight days", financialImpact: "-$32,400 lost revenue", driver: "Urban transit surge" },
      { branchId: "STORE-CHI", categoryItem: "Classic White Oxford Shirt (Size M)", issueDetected: "Complete size break (0 units)", financialImpact: "-$24,000 lost revenue", driver: "Back-to-office demand" },
      { branchId: "ECOM-WEB", categoryItem: "Core Sizing Search Abandonment", issueDetected: "4,120 out-of-stock bounce hits", financialImpact: "-$18,500 direct loss", driver: "Zero stock redirect" },
      { branchId: "WH-DALLAS", categoryItem: "Suburban Surplus (Sizes M & L Parkas)", issueDetected: "420 units excess in warm climate", financialImpact: "$50,400 idle inventory", driver: "No automated store transfer" },
    ],
    totalExposure: "-$86,400 lost sales",
    coverage: "Across 18 retail doors & digital storefront",
  },
  "case-fever": {
    records: [
      { branchId: "DISP-CENTRAL", categoryItem: "Paracetamol 250mg/5ml (Calpol Six Plus)", issueDetected: "In Stock (78 units)", financialImpact: "$8.50 / bottle", driver: "Batch verified exp 2028" },
      { branchId: "DISP-CENTRAL", categoryItem: "Ibuprofen 100mg/5ml (Nurofen for Children)", issueDetected: "In Stock (42 units)", financialImpact: "$9.20 / bottle", driver: "Batch verified exp 2028" },
      { branchId: "DISP-NORTH", categoryItem: "Calibrated 5ml Oral Syringes", issueDetected: "In Stock (350 units)", financialImpact: "Complimentary", driver: "Included with dispensation" },
      { branchId: "EHR-SAFETY", categoryItem: "Pediatric Guideline Rule NG143", issueDetected: "Aspirin Contraindicated <16y", financialImpact: "Zero risk", driver: "Active clinical safety alert" },
    ],
    totalExposure: "Formulary Parity 100%",
    coverage: "Across all 4 hospital and outpatient dispensaries",
  },
};

export type CaseDetailsStatus = "Open" | "Hold" | "Close" | "Reopen";

export interface StatusOption {
  value: CaseDetailsStatus;
  label: string;
  badgeClass: string;
  dotClass: string;
  description: string;
}

export const statusOptions: StatusOption[] = [
  {
    value: "Open",
    label: "Open",
    badgeClass: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200/80 dark:border-blue-800/60",
    dotClass: "bg-blue-600 dark:bg-blue-400 animate-pulse",
    description: "Active investigation in progress",
  },
  {
    value: "Hold",
    label: "Hold",
    badgeClass: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60",
    dotClass: "bg-amber-500",
    description: "Temporarily paused pending data",
  },
  {
    value: "Close",
    label: "Close",
    badgeClass: "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 border-slate-300 dark:border-zinc-700",
    dotClass: "bg-slate-500",
    description: "Findings and actions finalized",
  },
  {
    value: "Reopen",
    label: "Reopen",
    badgeClass: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60",
    dotClass: "bg-emerald-500 animate-pulse",
    description: "Re-activated for follow-up audit",
  },
];

export interface CustomCaseItem {
  id?: string | undefined;
  title: string;
  body: string;
  age?: string | undefined;
  agent?: string | undefined;
  expiryDate?: string | undefined;
  isLive?: boolean | undefined;
  newFindingsCount?: number | undefined;
}

export interface CaseUpdateItem {
  tag: string;
  badge: string;
  badgeType: "danger" | "warning" | "success" | "info";
  headline: string;
  subtext: string;
}

export const caseThreeUpdates: Record<string, CaseUpdateItem[]> = {
  "case-3": [
    {
      tag: "Update 01",
      badge: "Concentration",
      badgeType: "danger",
      headline: "$1.28M Monthly Revenue Concentration in Denim Lines",
      subtext: "Top 4 core denim lines drive 42.6% of gross apparel volume, exceeding healthy portfolio risk thresholds.",
    },
    {
      tag: "Update 02",
      badge: "Supply Risk",
      badgeType: "warning",
      headline: "78.5% Single-Mill Exposure Alert in Coimbatore",
      subtext: "Acute supply vulnerability detected with over three-quarters of denim fabric sourced from a single spinning partner.",
    },
    {
      tag: "Update 03",
      badge: "Opportunity",
      badgeType: "success",
      headline: "64.0% Repeat Purchase Rate at 62.4% Gross Margin",
      subtext: "Customer retention driver operating as the primary profit engine; dual-sourcing onboarding in Vietnam recommended.",
    },
  ],
  "case-1": [
    {
      tag: "Update 01",
      badge: "Capital Exposure",
      badgeType: "danger",
      headline: "$420,000 Trapped Outerwear Exposure across Regional Hubs",
      subtext: "Heavyweight wool overcoats and faux-shearling jackets represent the primary capital freeze.",
    },
    {
      tag: "Update 02",
      badge: "Velocity",
      badgeType: "warning",
      headline: "68 Days of Supply Operating Past Seasonal Peak",
      subtext: "Zero turnover recorded past 45 days in warm-climate doors due to initial allocation errors.",
    },
    {
      tag: "Update 03",
      badge: "Action Required",
      badgeType: "success",
      headline: "30% Phased Private Markdown & Stock Transfer Recommended",
      subtext: "Immediate inter-store transfer of 1,600 units to cold-climate flagship doors.",
    },
  ],
  "case-5": [
    {
      tag: "Update 01",
      badge: "Revenue Leak",
      badgeType: "danger",
      headline: "$86,400 Lost Sales Demand in Sizes M and L",
      subtext: "Critical stockouts across Waterproof Commuter Parkas and White Oxford Shirts.",
    },
    {
      tag: "Update 02",
      badge: "Digital Bounce",
      badgeType: "warning",
      headline: "88.0% Customer Bounce Rate on Out-of-Stock Searches",
      subtext: "4,120 e-commerce search sessions encountered out-of-stock messages.",
    },
    {
      tag: "Update 03",
      badge: "Resolution",
      badgeType: "success",
      headline: "Overnight Suburban Stock Transfer and Air Freight Active",
      subtext: "Shift 650 units from suburban surplus and expedite 2,000 emergency restock units.",
    },
  ],
};

export interface CaseMethodologyText {
  title: string;
  paragraphs: string[];
}

export const caseMethodologyTexts: Record<string, CaseMethodologyText> = {
  "case-1": {
    title: "How Data Was Collected & How the Answer Was Found",
    paragraphs: [
      "Data for this analysis was collected by pulling live unit inventory balances and landed costs from the enterprise ERP system (SAP S/4HANA), coupled with real-time POS transaction streams from 38 flagship and regional stores, and warehouse distribution logs across 4 regional hubs.",
      "The answer was found by reconciling store-level sales velocity against seasonal benchmarks. The system detected that while winter had officially peaked, heavy overcoats and shearling jackets had accumulated 68 days of supply with zero turnover in warm-climate Southern stores over the past 45 days, compared to a seasonal baseline target of 32 days.",
      "By cross-referencing unsold unit quantities (4,800 units) with landed cost records, the AI engine quantified $420,000 in excess financial exposure and projected an impending 55% valuation write-down if held past the spring floor-set date, leading directly to the recommendation for an immediate 30% private VIP markdown and inter-store transfers to cold-weather locations.",
    ],
  },
  "case-2": {
    title: "How Data Was Collected & How the Answer Was Found",
    paragraphs: [
      "Data was gathered through continuous ingestion of 18-day launch sales telemetry across e-commerce and retail registers, alongside post-purchase customer return tickets, verified product reviews, and digital advertising spend data.",
      "The answer was determined by benchmarking the sell-through curves of both new silhouettes against category forecast baselines. The system observed that Spring Linen Shirts surged to an exceptional 84.2% full-price sell-through (3.2x forecast speed), whereas High-Rise Utility Cargo pants lagged severely at 28.0%.",
      "Natural language processing on customer return reason codes identified that 68% of cargo returns cited a waist-to-hip fit discrepancy, while marketing attribution revealed that $35,000 in digital ad spend was misallocated to the lagging silhouette. This enabled the AI to recommend shifting ad budget to linen shirts and revising cargo fit specifications before the next production run.",
    ],
  },
  "case-3": {
    title: "How Data Was Collected & How the Answer Was Found",
    paragraphs: [
      "Data was compiled by aggregating enterprise financial ledgers covering monthly gross apparel revenue, vendor procurement purchase orders, Bill of Materials (BOM) fabric records, and customer cohort repurchase history.",
      "The finding was uncovered through portfolio Pareto analysis. The model identified that four signature denim fits (Slim Stretch, Relaxed Vintage, Straight Leg, and High-Taper) account for 42.6% ($1.28M monthly) of total company revenue and deliver a 64% 90-day repeat customer rate.",
      "Cross-referencing fabric supply contracts revealed an acute single-point-of-failure risk: 78.5% of all denim yardage relies on a single spinning mill in Coimbatore. Stress-test simulations indicated a delivery halt would jeopardize $850,000 in monthly sales, establishing the urgent need to onboard a secondary mill in Vietnam and build a 45-day greige buffer.",
    ],
  },
  "case-4": {
    title: "How Data Was Collected & How the Answer Was Found",
    paragraphs: [
      "Data was collected by evaluating 12-month rolling sales transactions across all retail doors, store register markdown execution logs, warehouse aging inventory reports, and seasonal visual merchandising floor calendars.",
      "The conclusion was reached by analyzing month-over-month sales velocity trends. The analytics engine detected that Merino knit polo shirts and thermal henleys suffered three consecutive months of 35.4% volume contractions, officially classifying the category into the terminal 'Decline' stage.",
      "Audits showed 8,420 unsold units remained in stock—with 61.2% concentrated in extreme sizes (XS/XXL)—while uncoordinated in-store discounting had dragged realized prices down to $54.20. This formulated the recommendation to replace fragmented store discounts with a structured 25%/40% clearance schedule and centralize extreme sizes online.",
    ],
  },
  "case-5": {
    title: "How Data Was Collected & How the Answer Was Found",
    paragraphs: [
      "Data was gathered from retail store associate lost-sale logs, e-commerce zero-result and out-of-stock search telemetry, warehouse distribution inventories, and inbound ocean freight shipping tracking.",
      "The insight was discovered by tracking search impressions and store inquiries where customers attempted to buy core sizes Medium and Large in essential garments (Waterproof Commuter Parkas and White Oxford Shirts). Searches for out-of-stock sizes experienced an 88% bounce rate, with 24% of shoppers purchasing from competitors.",
      "Multiplying unfulfilled customer traffic by standard conversion rates revealed $86,400 in direct lost demand over 30 days. Tracing supply chain logistics isolated a 15-day ocean freight transit delay, prompting the recommended emergency response: overnight stock transfers of 650 units from suburban stores and 2,000 units via expedited air freight.",
    ],
  },
  "case-fever": {
    title: "How Data Was Collected & How the Answer Was Found",
    paragraphs: [
      "Data was collected by auditing hospital pharmacy dispensary inventory ledgers, pediatric clinical guidelines (AAP and BNFc), adverse drug reaction databases, and cold-chain lot verification streams.",
      "The recommendation was derived by validating weight-based therapeutic windows against formulary stock. Clinical protocols established Paracetamol at 15mg/kg every 4–6 hours and Ibuprofen at 10mg/kg every 6–8 hours as safe monotherapies for a 5-year-old child (~19kg).",
      "Safety screenings cross-checked contraindications, strictly excluding Aspirin to eliminate Reye's syndrome risk and advising parents to use calibrated oral measuring syringes for volumetric precision.",
    ],
  },
};

export interface CaseDetailsViewProps {
  selectedCaseId?: string;
  onCaseChange?: (caseId: string) => void;
  customCase?: CustomCaseItem | null;
  onBack?: () => void;
  hideHeader?: boolean;
  initialShowChat?: boolean; // defaults to false
}

export function CaseDetailsView({
  selectedCaseId = "case-1",
  onCaseChange,
  customCase,
  onBack,
  hideHeader = false,
  initialShowChat = false,
}: CaseDetailsViewProps) {
  const [internalCaseId, setInternalCaseId] = useState<string>(selectedCaseId);

  useEffect(() => {
    setInternalCaseId(selectedCaseId);
  }, [selectedCaseId]);

  const activeCaseId = internalCaseId;

  const hasThreeCircledUpdates =
    activeCaseId === "case-3" ||
    customCase?.newFindingsCount === 3 ||
    (customCase?.title ? customCase.title.toLowerCase().includes("largest share") : false);

  const updatesForActiveCase =
    caseThreeUpdates[activeCaseId] ||
    (customCase?.id && caseThreeUpdates[customCase.id]) ||
    caseThreeUpdates["case-3"];

  // Case History collapsed by default
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showConsolidatedModal, setShowConsolidatedModal] = useState<boolean>(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isArchived, setIsArchived] = useState<boolean>(false);
  const [projectStatus, setProjectStatus] = useState<CaseDetailsStatus>("Open");
  const [showStatusDropdown, setShowStatusDropdown] = useState<boolean>(false);
  const [showMoreMenu, setShowMoreMenu] = useState<boolean>(false);
  const [showIndexDropdown, setShowIndexDropdown] = useState<boolean>(false);

  // Chat option is hidden by default as requested!
  const [showAIAssistant, setShowAIAssistant] = useState<boolean>(initialShowChat);

  const slideDefs = useMemo(() => {
    const list = [];
    if (hasThreeCircledUpdates) {
      list.push({ id: "updates", shortTitle: "Updates", fullTitle: "Updates (3)" });
    }
    list.push(
      { id: "summary", shortTitle: "Summary", fullTitle: "Executive Summary" },
      { id: "telemetry", shortTitle: "Evidence", fullTitle: "Sample Data Records" },
      { id: "methodology", shortTitle: "Methodology", fullTitle: "Data Collection & Analysis" }
    );
    return list;
  }, [hasThreeCircledUpdates]);

  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeSlideId, setActiveSlideId] = useState<string>("summary");
  const [checkedActions, setCheckedActions] = useState<Record<number, boolean>>({});

  const handleMainScroll = (e: React.UIEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll > 0) {
      const pct = (el.scrollTop / maxScroll) * 100;
      setScrollProgress(Math.min(100, Math.max(0, pct)));
    } else {
      setScrollProgress(0);
    }

    const containerTop = el.getBoundingClientRect().top;
    let currentId = slideDefs[0]?.id ?? "summary";
    for (const slide of slideDefs) {
      const slideEl = document.getElementById(`slide-${slide.id}`);
      if (slideEl) {
        const rect = slideEl.getBoundingClientRect();
        if (rect.top - containerTop <= 160) {
          currentId = slide.id;
        }
      }
    }
    setActiveSlideId(currentId);
  };

  const scrollToSlide = (slideId: string) => {
    const el = document.getElementById(`slide-${slideId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setActiveSlideId(slideId);
  };

  const toggleAction = (idx: number) => {
    setCheckedActions((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  useEffect(() => {
    const handleOutsideClick = () => {
      setShowMoreMenu(false);
      setShowStatusDropdown(false);
      setShowIndexDropdown(false);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  // Reset checked actions when switching case
  useEffect(() => {
    setCheckedActions({});
  }, [activeCaseId, customCase]);

  const currentStatusConfig =
    statusOptions.find((s) => s.value === projectStatus) ?? statusOptions[0]!;

  // AI Assistant Chat & Message Box state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState<string>("");
  const [isAiReplying, setIsAiReplying] = useState<boolean>(false);
  const conversationEndRef = useRef<HTMLDivElement | null>(null);

  const handleCheckStatus = () => {
    setIsCheckingStatus(true);
    setStatusMessage("Checking data feeds across warehouse logistics, ERP & store POS...");
    setTimeout(() => {
      setIsCheckingStatus(false);
      setStatusMessage("Status verified: 100% up to date with real-time SKU inventory telemetry");
      setTimeout(() => setStatusMessage(null), 4000);
    }, 1200);
  };

  const [isBottomVoiceListening, setIsBottomVoiceListening] = useState<boolean>(false);

  const handleBottomVoiceClick = () => {
    if (isBottomVoiceListening) {
      setIsBottomVoiceListening(false);
      return;
    }
    setIsBottomVoiceListening(true);
    setChatInput("Listening...");
    setTimeout(() => {
      const simulatedVoiceQuery = "What is the recommended promotional markdown schedule for excess inventory?";
      setChatInput(simulatedVoiceQuery);
      setIsBottomVoiceListening(false);
      handleSendMessage(undefined, simulatedVoiceQuery);
    }, 1200);
  };

  const handleSendMessage = (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const userText = (customPrompt ?? chatInput).trim();
    if (!userText) return;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: "user",
      content: userText,
    };
    setMessages((prev) => [...prev, newMsg]);
    setChatInput("");
    setIsAiReplying(true);

    // Smooth scroll down to conversation box
    setTimeout(() => {
      conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    // Simulate AI contextual response grounded in garment telemetry and report findings
    setTimeout(() => {
      let replyContent = "";
      const lower = userText.toLowerCase();

      if (lower.includes("markdown") || lower.includes("clearance") || lower.includes("exposure") || lower.includes("overcoat") || lower.includes("winter")) {
        replyContent =
          "Autonomous Merchandising Recommendation:\n\n• Phase 1 Private Markdown: Execute a 30% VIP promotional discount on 4,800 overcoat and shearling units to accelerate sell-through without public brand degradation.\n• Geographical Re-balancing: Inter-store transfer of 1,600 units from warm-climate Southern doors to flagship stores in NYC, Boston, and Chicago.\n• Projected Working Capital: Cash recovery of $294,000 within 21 days, decreasing holding cost burn by $14,200/month.";
      } else if (lower.includes("launch") || lower.includes("linen") || lower.includes("cargo") || lower.includes("performance") || lower.includes("new")) {
        replyContent =
          "Launch Performance & Allocation Strategy:\n\n• Spring Linen Blend Shirts: Maintain full-price positioning at 84.2% sell-through. Issue a fast-turn 3,500 unit reorder with priority mill partners.\n• Utility Cargo Pants: Re-allocate $35,000 of top-of-funnel ad spend to video fit guides. Product team should revise hip-to-waist grading before next seasonal production drop.";
      } else if (lower.includes("revenue") || lower.includes("denim") || lower.includes("supplier") || lower.includes("risk") || lower.includes("mill")) {
        replyContent =
          "Revenue Concentration & Sourcing Plan:\n\n• Core Denim represents 42.6% ($1.28M monthly) of total gross revenue across top 4 fits.\n• Dual-Sourcing Escalation: Onboard secondary certified fabric mill in Vietnam within 60 days to reduce 78.5% reliance on single spinning mill.\n• Fabric Buffer: Establish a rolling 45-day greige denim buffer at regional bonded hub.";
      } else if (lower.includes("stockout") || lower.includes("lost") || lower.includes("demand") || lower.includes("size") || lower.includes("shortage")) {
        replyContent =
          "Stockout Resolution & Prevention Protocol:\n\n• Overnight Store Transfer: Shift 650 Medium and Large units from low-velocity suburban stores to high-demand flagship locations.\n• Air-Freight Expedite: Release 2,000 emergency units via air-freight arriving within 5 business days.\n• Safety Stock Multipliers: Recalibrate automated re-order multipliers for sizes M and L from 1.2x to 1.8x baseline to eliminate out-of-stock bounce.";
      } else if (lower.includes("fever") || lower.includes("paracetamol") || lower.includes("ibuprofen") || lower.includes("pediatric")) {
        replyContent =
          "Pediatric Protocol (5-Year-Old, ~19kg):\n\n• Paracetamol 250mg/5ml suspension: 5.7 ml (285 mg) every 4 to 6 hours (Max 4 doses/24h).\n• Ibuprofen 100mg/5ml suspension: 9.5 ml (190 mg) every 6 to 8 hours with food.\n• Stock Telemetry: 184 units Paracetamol, 96 units Ibuprofen in stock.\n• Clinical Warning: Aspirin strictly contraindicated under 16 years. Use calibrated syringes.";
      } else {
        replyContent = `AI Intelligence for "${userText}":\n\n• Case Context: ${selectedCase.title}\n• Telemetry Status: Live data feeds across ERP, warehouse logistics, and store POS are fully synchronized.\n• Recommended Next Step: Review the Executive Summary and Evidence Records above to sign off on suggested turnaround actions.`;
      }

      const aiReply: ChatMessage = {
        id: `m-reply-${Date.now()}`,
        sender: "ai",
        content: replyContent,
      };
      setMessages((prev) => [...prev, aiReply]);
      setIsAiReplying(false);

      setTimeout(() => {
        conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }, 850);
  };

  const defaultCase = {
    id: "case-1",
    title: "Q3 Revenue Drop & Margin Compression Analysis",
    timestamp: "04 Sept 2026, 05:57 am",
  };

  const selectedCase: HistoryItem = {
    id: customCase?.id ?? activeCaseId,
    title: customCase?.title ?? (caseHistoryList.find((c) => c.id === activeCaseId)?.title || defaultCase.title),
    timestamp: customCase?.age ?? (caseHistoryList.find((c) => c.id === activeCaseId)?.timestamp || defaultCase.timestamp),
  };

  const currentAssistantConfig: CaseAssistantConfig =
    caseAssistantConfigs[activeCaseId] ?? caseAssistantConfigs["case-1"]!;

  const currentCaseData: CaseSectionData =
    caseSectionData[activeCaseId] ?? {
      keyDataPoints: [
        customCase?.body
          ? `Primary Anomaly Detected: ${customCase.body}`
          : "Systemic breakdown vectors detected through automated reconciliation of records.",
        "Operational efficiency buffers running 18% below benchmark targets.",
        "Resource allocation variance identified across monitored clinical divisions.",
        "Documentation and verification delays impacting cycle time resolution.",
      ],
      suggestedNextSteps: [
        "Initiate automated multi-department workflow review within 24 hours.",
        "Escalate flagged discrepancies to department coordinators.",
        "Implement predictive monitoring buffers to prevent recurrence.",
        "Audit end-of-shift operational clearance summaries.",
      ],
    };

  const currentSummary: CaseSummaryConfig =
    caseSummaries[activeCaseId] ?? {
      narrative: customCase?.body || caseSummaries["case-1"]!.narrative,
      points: customCase?.body ? [customCase.body] : caseSummaries["case-1"]!.points,
      quote: `Actionable focus for ${selectedCase.title}: Rapid resolution of detected variance and cross-departmental coordination.`,
      metrics: [
        { label: "Status", val: "Active Audit", alert: true },
        { label: "Discrepancy", val: "Detected", alert: true },
        { label: "Confidence", val: "94.2%" },
        { label: "Impact", val: "Monitored" },
      ],
    };

  const currentMetrics: KeyMetricRow[] =
    caseKeyMetricsData[activeCaseId] ?? caseKeyMetricsData["case-1"]!;

  const currentTelemetry =
    caseSampleTelemetryData[activeCaseId] ?? caseSampleTelemetryData["case-1"]!;

  // AI-generated KPI executive answer for the Executive Summary headline
  const getCaseKpiAnswer = (): string => {
    const title = selectedCase.title.toLowerCase();
    const caseId = activeCaseId;

    if (
      caseId === "case-5" ||
      title.includes("stockout") ||
      title.includes("loss in sales") ||
      title.includes("customer demand")
    ) {
      return "₹10 Cr of inventory is concentrated in slow-moving garments. Several SKUs have remained below their normal sales velocity for more than 60 days.";
    }
    if (
      caseId === "case-1" ||
      title.includes("highest inventory exposure") ||
      title.includes("exposure")
    ) {
      return "₹4.2 Cr ($420,000) of inventory is concentrated in slow-moving garments. Heavyweight overcoats & shearling jackets hold 68 days of supply past peak.";
    }
    if (
      caseId === "case-2" ||
      title.includes("newly launched") ||
      title.includes("performing")
    ) {
      return "₹1.8 Cr generated by Spring Linen shirts at 84% full-price sell-through, while Utility Cargo pants lag at 28% with 38% sizing return rate.";
    }
    if (
      caseId === "case-3" ||
      title.includes("largest share of revenue") ||
      title.includes("dependent")
    ) {
      return "₹10.5 Cr (42.6% of gross revenue) concentrated in top 4 core denim lines, exposing the business to 78.5% single-mill supplier dependency.";
    }
    if (
      caseId === "case-4" ||
      title.includes("decline stage") ||
      title.includes("lifecycle")
    ) {
      return "₹6.4 Cr trapped in declining Merino polo and thermal henley lines showing 35% MoM drop; phased 20%-40% clearance markdown required.";
    }
    if (
      caseId === "case-fever" ||
      title.includes("fever") ||
      title.includes("paracetamol")
    ) {
      return "100% formulary parity verified across pediatric antipyretics. 184 units Paracetamol and 96 units Ibuprofen in stock with zero contraindications.";
    }

    if (customCase?.body) {
      return customCase.body;
    }
    return "Automated SKU telemetry reconciliation completed. Operational variance and inventory concentration detected across monitored divisions.";
  };

  const renderSlideCard = (slideIdx: number, anchorId?: string) => {
    switch (slideIdx) {
      case 0:
        return (
          <article
            key="slide-0"
            id={anchorId}
            className="rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden flex flex-col shadow-xs"
          >
            {/* Top Ambient Header Banner */}
            <div className="p-6 sm:p-8 border-b border-slate-200/80 dark:border-zinc-800 relative overflow-hidden bg-gradient-to-br from-[#dff2fe]/95 via-[#e5faf0]/90 to-[#fefae0]/95 dark:from-[#092237] dark:via-[#072a1b] dark:to-[#222110]">
              <div className="pointer-events-none absolute -top-16 -left-16 size-56 rounded-full bg-sky-300/35 dark:bg-sky-500/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -right-16 size-56 rounded-full bg-emerald-300/30 dark:bg-emerald-500/15 blur-3xl" />
              <div className="pointer-events-none absolute top-1/2 left-1/3 size-40 rounded-full bg-amber-200/25 dark:bg-amber-500/10 blur-2xl" />

              <div className="relative z-10 flex flex-col gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xs border border-white/60 dark:border-zinc-700/60 text-slate-800 dark:text-slate-200 shadow-2xs">
                    Executive Summary
                  </span>
                </div>

                <h2
                  style={{ fontWeight: 400 }}
                  className="text-xl sm:text-2xl lg:text-[25px] font-normal tracking-tight text-slate-900 dark:text-slate-100 leading-snug max-w-4xl"
                >
                  {getCaseKpiAnswer()}
                </h2>

              </div>
            </div>

            {/* Bottom Content Area: Executive Briefing Narrative + Quote + Metrics */}
            <div className="p-6 sm:p-8 bg-white dark:bg-zinc-900 flex-1 space-y-5">


              {/* Point by Point Briefing Breakdown */}
              <ul className="space-y-3 pt-1">
                {(currentSummary.points || [currentSummary.narrative]).map((pt, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-3">
                    <span className="mt-2 size-2 rounded-full bg-brand-blue shrink-0 ring-4 ring-brand-blue/15" />
                    <p
                      style={{ fontWeight: 400, color: "#41485e" }}
                      className="text-[15px] sm:text-[16px] leading-relaxed text-[#41485e] dark:text-slate-200"
                    >
                      {pt}
                    </p>
                  </li>
                ))}
              </ul>

              <blockquote className="rounded-2xl border-l-4 border-rose-500 bg-rose-50/80 dark:bg-rose-950/30 p-4 sm:p-5 border-y border-r border-rose-200/70 dark:border-rose-900/40 shadow-2xs">
                <p
                  style={{ fontWeight: 300, fontSize: "15px" }}
                  className="text-[15px] italic leading-relaxed text-foreground/95 font-light"
                >
                  {currentSummary.quote}
                </p>
              </blockquote>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                {currentSummary.metrics.map((m, mIdx) => {
                  const match = m.val.match(/^(.*?)\s*(\([+-]?\d+[^)]*\))$/);
                  const mainVal = match ? match[1] : m.val;
                  const changeVal = match ? match[2] : null;

                  return (
                    <div
                      key={mIdx}
                      className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-800/40 p-3.5 space-y-1"
                    >
                      <span className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        {m.label}
                      </span>
                      <div className="flex flex-wrap items-baseline gap-1">
                        <span
                          className={`text-sm sm:text-base font-['Archivo'] tabular-nums font-bold ${m.alert ? "text-rose-600 dark:text-rose-400" : "text-slate-800 dark:text-slate-200"
                            }`}
                        >
                          {mainVal}
                        </span>
                        {changeVal && (
                          <span
                            className={`text-[11px] font-['Archivo'] tabular-nums font-medium ${m.alert ? "text-rose-600/80 dark:text-rose-400/80" : "text-slate-500 dark:text-slate-400"
                              }`}
                          >
                            {changeVal}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </article>
        );

      case 1:
        return (
          <article
            key="slide-1"
            id={anchorId}
            className="rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden flex flex-col shadow-xs"
          >
            {/* Top Ambient Header Banner */}
            <div className="p-6 sm:p-8 border-b border-slate-200/80 dark:border-zinc-800 relative overflow-hidden bg-gradient-to-br from-[#dff2fe]/95 via-[#e5faf0]/90 to-[#fefae0]/95 dark:from-[#092237] dark:via-[#072a1b] dark:to-[#222110]">
              <div className="pointer-events-none absolute -top-16 -left-16 size-56 rounded-full bg-sky-300/35 dark:bg-sky-500/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -right-16 size-56 rounded-full bg-emerald-300/30 dark:bg-emerald-500/15 blur-3xl" />
              <div className="pointer-events-none absolute top-1/2 left-1/3 size-40 rounded-full bg-amber-200/25 dark:bg-amber-500/10 blur-2xl" />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                <div className="space-y-2 max-w-2xl">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xs border border-white/60 dark:border-zinc-700/60 text-slate-800 dark:text-slate-200 shadow-2xs">
                    Root Cause Analysis
                  </span>

                  <h2
                    style={{ fontWeight: 300 }}
                    className="text-2xl sm:text-3xl font-light tracking-tight text-slate-900 dark:text-slate-100 leading-snug"
                  >
                    High-Level Insights & Root Drivers
                  </h2>
                  <p
                    style={{ fontWeight: 300 }}
                    className="text-xs sm:text-sm text-slate-700/90 dark:text-slate-300/90 leading-relaxed font-light"
                  >
                    Primary systemic breakdown vectors detected through automated reconciliation of records and workflows.
                  </p>
                </div>

                {/* Right Highlight Banner */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 rounded-2xl bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xs border border-white/60 dark:border-zinc-700/60 p-4 shadow-2xs shrink-0">
                  <div>
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Identified Drivers
                    </span>
                    <span className="text-xl sm:text-2xl font-['Archivo'] tabular-nums font-bold text-amber-600 dark:text-amber-400">
                      {currentCaseData.keyDataPoints.length} Core Factors
                    </span>
                    <span className="block text-[11px] text-muted-foreground pt-0.5">
                      Telemetry validated
                    </span>
                  </div>
                  <div className="hidden sm:block h-9 w-px bg-slate-200 dark:bg-zinc-700" />
                  <div>
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Impact Severity
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-full mt-1">
                      High Operational Risk
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Content Area: 2-Column Insights */}
            <div className="p-6 sm:p-8 bg-white dark:bg-zinc-900 flex-1 space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-border/60">
                <TrendingDown className="size-4.5 text-brand-blue shrink-0" />
                <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  High-Level Insights & Breakdown Vectors
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {currentCaseData.keyDataPoints.map((point, idx) => {
                  const parts = point.split(":");
                  const title = parts.length > 1 ? parts[0] : `Systemic Driver ${idx + 1}`;
                  const description = parts.length > 1 ? parts.slice(1).join(":") : point;
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl bg-slate-50/80 dark:bg-zinc-800/50 border border-slate-200/70 dark:border-zinc-800 p-4 transition hover:border-slate-300 dark:hover:border-zinc-700 flex flex-col justify-between"
                    >
                      <div className="flex items-start gap-3.5">
                        <span className="grid size-7 shrink-0 place-items-center rounded-xl bg-blue-100 dark:bg-blue-900/60 text-brand-blue dark:text-blue-300 text-xs font-bold shadow-2xs">
                          {idx + 1}
                        </span>
                        <div className="space-y-1.5 flex-1">
                          <h4 className="text-sm sm:text-base font-semibold text-foreground leading-snug">
                            {title}
                          </h4>
                          <p className="text-xs sm:text-sm leading-relaxed text-foreground/85 font-normal">
                            {description.trim()}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </article>
        );

      case 2:
        return (
          <article
            key="slide-2"
            id={anchorId}
            className="rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden flex flex-col shadow-xs"
          >
            {/* Top Ambient Header Banner */}
            <div className="p-6 sm:p-8 border-b border-slate-200/80 dark:border-zinc-800 relative overflow-hidden bg-gradient-to-br from-[#dff2fe]/95 via-[#e5faf0]/90 to-[#fefae0]/95 dark:from-[#092237] dark:via-[#072a1b] dark:to-[#222110]">
              <div className="pointer-events-none absolute -top-16 -left-16 size-56 rounded-full bg-sky-300/35 dark:bg-sky-500/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -right-16 size-56 rounded-full bg-emerald-300/30 dark:bg-emerald-500/15 blur-3xl" />
              <div className="pointer-events-none absolute top-1/2 left-1/3 size-40 rounded-full bg-amber-200/25 dark:bg-amber-500/10 blur-2xl" />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                <div className="space-y-2 max-w-2xl">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xs border border-white/60 dark:border-zinc-700/60 text-slate-800 dark:text-slate-200 shadow-2xs">
                    Financial Performance
                  </span>

                  <h2
                    style={{ fontWeight: 300 }}
                    className="text-2xl sm:text-3xl font-light tracking-tight text-slate-900 dark:text-slate-100 leading-snug"
                  >
                    Key Metrics & Variances
                  </h2>
                  <p
                    style={{ fontWeight: 300 }}
                    className="text-xs sm:text-sm text-slate-700/90 dark:text-slate-300/90 leading-relaxed font-light"
                  >
                    Operating performance benchmarked against baseline targets and prior cycle run rates.
                  </p>
                </div>

                {/* Right Highlight Banner */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 rounded-2xl bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xs border border-white/60 dark:border-zinc-700/60 p-4 shadow-2xs shrink-0">
                  <div>
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Tracked Variance KPIs
                    </span>
                    <span className="text-xl sm:text-2xl font-['Archivo'] tabular-nums font-bold text-slate-800 dark:text-slate-200">
                      {currentMetrics.length} Metrics
                    </span>
                    <span className="block text-[11px] text-muted-foreground pt-0.5">
                      Continuous reconciliation
                    </span>
                  </div>
                  <div className="hidden sm:block h-9 w-px bg-slate-200 dark:bg-zinc-700" />
                  <div>
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Reconciliation Mode
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-1 rounded-full mt-1">
                      <span className="size-2 rounded-full bg-sky-500 animate-pulse" />
                      Live Feed Active
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Content Area: Key Metrics Table */}
            <div className="p-6 sm:p-8 bg-white dark:bg-zinc-900 flex-1 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <Table2 className="size-4.5 text-brand-blue shrink-0" />
                  <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Key Performance Indicators & Variances
                  </h3>
                </div>
                <span className="text-xs font-medium text-muted-foreground">Variance vs. Target</span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/70 text-slate-700 dark:text-slate-200 font-semibold text-xs uppercase tracking-wider">
                      <th className="px-4 py-3">Metric</th>
                      <th className="px-4 py-3 text-right">Current</th>
                      <th className="px-4 py-3 text-right">Target / Prior</th>
                      <th className="px-4 py-3 text-right">Variance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/80 dark:divide-zinc-800">
                    {currentMetrics.map((row, idx) => (
                      <tr
                        key={idx}
                        className={`transition-colors ${
                          idx % 2 === 0
                            ? "bg-white dark:bg-zinc-900"
                            : "bg-slate-50/80 dark:bg-zinc-800/40"
                        } hover:bg-slate-100/70 dark:hover:bg-zinc-800/70`}
                      >
                        <td className="px-4 py-3 text-xs sm:text-sm font-medium text-foreground">{row.metric}</td>
                        <td className="px-4 py-3 font-['Archivo'] tabular-nums text-xs sm:text-sm font-bold text-foreground text-right">{row.current}</td>
                        <td className="px-4 py-3 font-['Archivo'] tabular-nums text-xs sm:text-sm text-muted-foreground text-right">{row.target}</td>
                        <td className="px-4 py-3 text-right">
                          <span className="inline-flex items-center font-['Archivo'] tabular-nums font-medium text-xs px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                            {row.variance}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground italic pt-1">
                Variance flags are continuously updated by scheduled data reconciliations across ERP and warehouse logs.
              </p>
            </div>
          </article>
        );

      case 3:
        const completedCount = Object.values(checkedActions).filter(Boolean).length;
        const totalActions = currentCaseData.suggestedNextSteps.length;
        return (
          <article
            key="slide-3"
            id={anchorId}
            className="rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden flex flex-col shadow-xs"
          >
            {/* Top Ambient Header Banner */}
            <div className="p-6 sm:p-8 border-b border-slate-200/80 dark:border-zinc-800 relative overflow-hidden bg-gradient-to-br from-[#dff2fe]/95 via-[#e5faf0]/90 to-[#fefae0]/95 dark:from-[#092237] dark:via-[#072a1b] dark:to-[#222110]">
              <div className="pointer-events-none absolute -top-16 -left-16 size-56 rounded-full bg-sky-300/35 dark:bg-sky-500/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -right-16 size-56 rounded-full bg-emerald-300/30 dark:bg-emerald-500/15 blur-3xl" />
              <div className="pointer-events-none absolute top-1/2 left-1/3 size-40 rounded-full bg-amber-200/25 dark:bg-amber-500/10 blur-2xl" />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                <div className="space-y-2 max-w-2xl">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xs border border-white/60 dark:border-zinc-700/60 text-slate-800 dark:text-slate-200 shadow-2xs">
                    Strategic Action Plan
                  </span>

                  <h2
                    style={{ fontWeight: 300 }}
                    className="text-2xl sm:text-3xl font-light tracking-tight text-slate-900 dark:text-slate-100 leading-snug"
                  >
                    Recommended Action Plan
                  </h2>
                  <p
                    style={{ fontWeight: 300 }}
                    className="text-xs sm:text-sm text-slate-700/90 dark:text-slate-300/90 leading-relaxed font-light"
                  >
                    Targeted interventions to mitigate detected variance and streamline operational throughput.
                  </p>
                </div>

                {/* Right Highlight Banner */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 rounded-2xl bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xs border border-white/60 dark:border-zinc-700/60 p-4 shadow-2xs shrink-0">
                  <div>
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Action Progress
                    </span>
                    <span className="text-xl sm:text-2xl font-['Archivo'] tabular-nums font-bold text-emerald-600 dark:text-emerald-400">
                      {completedCount} of {totalActions} Complete
                    </span>
                    <span className="block text-[11px] text-muted-foreground pt-0.5">
                      Interactive checklist
                    </span>
                  </div>
                  <div className="hidden sm:block h-9 w-px bg-slate-200 dark:bg-zinc-700" />
                  <div>
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Execution State
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full mt-1">
                      {completedCount === totalActions ? "All Actions Signed Off" : "Turnaround In Progress"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Content Area: Action Items */}
            <div className="p-6 sm:p-8 bg-white dark:bg-zinc-900 flex-1 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <CheckSquare className="size-4.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Recommended Actions & Sign-Off Checklist
                  </h3>
                </div>
                <span className="text-xs text-muted-foreground">Click item to toggle completion</span>
              </div>

              <div className="space-y-3">
                {currentCaseData.suggestedNextSteps.map((step, idx) => {
                  const isDone = !!checkedActions[idx];
                  const parts = step.split(":");
                  const title = parts.length > 1 ? parts[0] : `Turnaround Action ${idx + 1}`;
                  const description = parts.length > 1 ? parts.slice(1).join(":") : step;
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleAction(idx)}
                      className={`rounded-2xl border p-4 transition cursor-pointer ${isDone
                        ? "bg-emerald-50/70 border-emerald-300/80 dark:bg-emerald-950/25 dark:border-emerald-800/60"
                        : "bg-slate-50/80 border-slate-200/70 hover:border-slate-300 dark:bg-zinc-800/50 dark:border-zinc-800 dark:hover:border-zinc-700"
                        }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAction(idx);
                          }}
                          className={`mt-0.5 size-5 rounded-lg border flex items-center justify-center transition shrink-0 cursor-pointer shadow-2xs ${isDone
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : "border-slate-300 bg-white dark:border-zinc-600 dark:bg-zinc-800"
                            }`}
                          aria-label={`Mark action ${idx + 1} as ${isDone ? "incomplete" : "complete"}`}
                        >
                          {isDone && <Check className="size-3.5 stroke-[3]" />}
                        </button>
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4
                              className={`text-sm sm:text-base font-semibold leading-snug ${isDone ? "text-emerald-800 dark:text-emerald-300 line-through" : "text-foreground"
                                }`}
                            >
                              {title}
                            </h4>
                            {isDone && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 shrink-0">
                                <Check className="size-3 stroke-[2.5]" /> Completed
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-xs sm:text-sm leading-relaxed font-normal ${isDone ? "text-foreground/75" : "text-foreground/85"
                              }`}
                          >
                            {description.trim()}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </article>
        );

      case 4:
        return (
          <article
            key="slide-4"
            id={anchorId}
            className="rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden flex flex-col shadow-xs"
          >
            {/* Top Ambient Header Banner */}
            <div className="p-6 sm:p-8 border-b border-slate-200/80 dark:border-zinc-800 relative overflow-hidden bg-gradient-to-br from-[#dff2fe]/95 via-[#e5faf0]/90 to-[#fefae0]/95 dark:from-[#092237] dark:via-[#072a1b] dark:to-[#222110]">
              <div className="pointer-events-none absolute -top-16 -left-16 size-56 rounded-full bg-sky-300/35 dark:bg-sky-500/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -right-16 size-56 rounded-full bg-emerald-300/30 dark:bg-emerald-500/15 blur-3xl" />
              <div className="pointer-events-none absolute top-1/2 left-1/3 size-40 rounded-full bg-amber-200/25 dark:bg-amber-500/10 blur-2xl" />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                <div className="space-y-2 max-w-2xl">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xs border border-white/60 dark:border-zinc-700/60 text-slate-800 dark:text-slate-200 shadow-2xs">
                    Evidence Telemetry
                  </span>

                  <h2
                    style={{ fontWeight: 300 }}
                    className="text-2xl sm:text-3xl font-light tracking-tight text-slate-900 dark:text-slate-100 leading-snug"
                  >
                    Evidence Records
                  </h2>
                  <p
                    style={{ fontWeight: 300 }}
                    className="text-xs sm:text-sm text-slate-700/90 dark:text-slate-300/90 leading-relaxed font-light"
                  >
                    Transaction telemetry capturing variances, delays, and capital exposure across monitored clusters.
                  </p>
                </div>
              </div>
            </div>

            {/* Telemetry Table */}
            <div className="p-4 sm:p-6 bg-white dark:bg-zinc-900 flex-1 space-y-3">
              <div className="flex items-center justify-between pb-1.5 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <Activity className="size-4 text-brand-blue shrink-0" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Sample Data Records (Underlying Evidence)
                  </h3>
                </div>
                <span className="text-[11px] font-medium text-muted-foreground">
                  Showing {currentTelemetry.records.length} Audited Clusters
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs rounded-xl">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/70 text-slate-700 dark:text-slate-200 font-semibold text-[11px] uppercase tracking-wider">
                      <th className="px-3.5 py-2 whitespace-nowrap">Identifier</th>
                      <th className="px-3.5 py-2 whitespace-nowrap">Category / Item</th>
                      <th className="px-3.5 py-2 whitespace-nowrap">Issue Detected</th>
                      <th className="px-3.5 py-2 text-right whitespace-nowrap">Financial Impact</th>
                      <th className="px-3.5 py-2">Root Driver</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/80 dark:divide-zinc-800">
                    {currentTelemetry.records.map((row, idx) => (
                      <tr
                        key={idx}
                        className={`transition-colors ${
                          idx % 2 === 0
                            ? "bg-white dark:bg-zinc-900"
                            : "bg-slate-50/80 dark:bg-zinc-800/40"
                        } hover:bg-slate-100/70 dark:hover:bg-zinc-800/70`}
                      >
                        <td className="px-3.5 py-2 font-['Archivo'] tabular-nums text-xs font-semibold text-foreground whitespace-nowrap">{row.branchId}</td>
                        <td className="px-3.5 py-2 text-xs font-medium text-foreground whitespace-nowrap">{row.categoryItem}</td>
                        <td className="px-3.5 py-2 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                            {row.issueDetected}
                          </span>
                        </td>
                        <td className="px-3.5 py-2 font-['Archivo'] tabular-nums text-right text-xs font-bold text-rose-600 dark:text-rose-400 whitespace-nowrap">
                          {row.financialImpact}
                        </td>
                        <td className="px-3.5 py-2 text-xs text-foreground/80">{row.driver}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-300 dark:border-zinc-700 bg-slate-50/90 dark:bg-zinc-800/80 font-semibold">
                      <td colSpan={3} className="px-3.5 py-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                        Total Sampled Exposure
                      </td>
                      <td className="px-3.5 py-2 font-['Archivo'] tabular-nums text-right text-xs text-rose-600 dark:text-rose-400 font-bold whitespace-nowrap">
                        {currentTelemetry.totalExposure}
                      </td>
                      <td className="px-3.5 py-2 text-[11px] text-muted-foreground">
                        {currentTelemetry.coverage}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </article>
        );

      default:
        return null;
    }
  };

  const renderMethodologyCard = (anchorId: string) => {
    const item =
      caseMethodologyTexts[activeCaseId] ||
      (customCase?.id && caseMethodologyTexts[customCase.id]) ||
      caseMethodologyTexts["case-1"]!;

    return (
      <article
        key="slide-methodology"
        id={anchorId}
        className="rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden flex flex-col shadow-xs"
      >
        {/* Top Header Banner */}
        <div className="p-6 sm:p-7 border-b border-slate-200/80 dark:border-zinc-800 relative overflow-hidden bg-gradient-to-br from-[#dff2fe]/95 via-[#e5faf0]/90 to-[#fefae0]/95 dark:from-[#092237] dark:via-[#072a1b] dark:to-[#222110]">
          <div className="pointer-events-none absolute -top-16 -left-16 size-56 rounded-full bg-sky-300/35 dark:bg-sky-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 size-56 rounded-full bg-emerald-300/30 dark:bg-emerald-500/15 blur-3xl" />

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <h2
                style={{ fontWeight: 400 }}
                className="text-xl sm:text-2xl font-normal tracking-tight text-slate-900 dark:text-slate-100 leading-snug pt-1"
              >
                {item.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8 bg-white dark:bg-zinc-900 space-y-6">
          {/* Visual Data Lineage & Report Generation Architecture */}
          <ReportPipelineDiagram
            caseId={activeCaseId || (customCase?.id ?? "case-1")}
            reportTitle={item.title}
          />

          <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-zinc-800">
            {item.paragraphs.map((para, pIdx) => (
              <p
                key={pIdx}
                style={{ color: "#41485e", lineHeight: 1.75 }}
                className="text-sm sm:text-[15px] text-[#41485e] dark:text-slate-200 font-normal"
              >
                {para}
              </p>
            ))}
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-surface-tint">
      {/* UNIFIED SINGLE HEADER BAR */}
      <section className="bg-surface/95 backdrop-blur-md border-b border-border/80 shrink-0 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left Side: Case Title (Light font text, aligned on left end) */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-4">
          <h2
            style={{ fontWeight: 300 }}
            className="text-sm sm:text-base font-light text-foreground truncate"
            title={selectedCase.title}
          >
            {selectedCase.title}
          </h2>
        </div>

        {/* Right Side of Title: Buttons set on the right end side */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 overflow-visible relative">
          {/* 1. Case History Button */}
          <button
            type="button"
            onClick={() => setShowHistory((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition cursor-pointer border shadow-2xs ${showHistory
              ? "border-blue-400/80 bg-blue-50/80 dark:bg-blue-950/60 text-brand-blue font-semibold ring-1 ring-brand-blue/20"
              : "border-border/80 bg-surface text-foreground hover:bg-tile"
              }`}
            title="View or hide Case History"
          >
            <History className={`size-3.5 ${showHistory ? "text-brand-blue" : "text-muted-foreground"}`} />
            <span className="hidden sm:inline">Case History</span>
          </button>

          {/* 2. Check Status Now Button */}
          <button
            type="button"
            onClick={handleCheckStatus}
            disabled={isCheckingStatus}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border border-border/80 bg-surface text-foreground hover:bg-tile transition cursor-pointer shadow-2xs disabled:opacity-60"
            title="Check Status Now"
          >
            <RotateCw
              className={`size-3.5 ${isCheckingStatus ? "animate-spin text-brand-blue" : "text-muted-foreground"
                }`}
            />
            <span className="hidden sm:inline">Check Status Now</span>
          </button>

          {/* 3. Continuous Auditing Toggle */}
          <button
            type="button"
            onClick={() => {
              setIsFollowing((prev) => {
                const next = !prev;
                setStatusMessage(
                  next
                    ? "Continuous auditing activated for this case"
                    : "Continuous auditing paused"
                );
                setTimeout(() => setStatusMessage(null), 3000);
                return next;
              });
            }}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition cursor-pointer border shadow-2xs ${isFollowing
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium"
              : "border-border/80 bg-surface text-foreground hover:bg-tile"
              }`}
            title={isFollowing ? "Continuous auditing active" : "Enable continuous auditing"}
          >
            {isFollowing ? (
              <>
                <ScanningRadarIcon size={14} />
                <span className="hidden sm:inline">Auditing Active</span>
              </>
            ) : (
              <>
                <Bell className="size-3.5 text-muted-foreground" />
                <span className="hidden sm:inline">Continuous Auditing</span>
              </>
            )}
          </button>

          {/* Status Dropdown */}
          <div className="relative inline-block">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowStatusDropdown((prev) => !prev);
              }}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition cursor-pointer border hover:opacity-90 active:scale-95 shadow-2xs ${currentStatusConfig.badgeClass}`}
              title="Click to change project status"
              aria-expanded={showStatusDropdown}
            >
              <span className={`size-2 rounded-full ${currentStatusConfig.dotClass}`} />
              <span>{currentStatusConfig.label}</span>
              <ChevronDown
                className={`size-3 text-current transition-transform duration-200 ${showStatusDropdown ? "rotate-180" : ""
                  }`}
              />
            </button>

            {showStatusDropdown && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-full mt-1.5 z-50 w-44 rounded-2xl border border-border/80 bg-surface p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/40 mb-1">
                  Change Status
                </div>
                {statusOptions.map((opt) => {
                  const isSelected = projectStatus === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setProjectStatus(opt.value);
                        setStatusMessage(`Status updated to "${opt.label}"`);
                        setTimeout(() => setStatusMessage(null), 3000);
                        setShowStatusDropdown(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition cursor-pointer ${isSelected
                        ? "bg-tile font-semibold text-foreground"
                        : "text-foreground/80 hover:bg-tile hover:text-foreground"
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`size-2 rounded-full ${opt.dotClass}`} />
                        <span className="font-medium text-foreground">{opt.label}</span>
                      </div>
                      {isSelected && <Check className="size-3.5 text-brand-blue shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Scroll Progress Bar (2px height) */}
      <div className="w-full h-0.5 bg-slate-200/80 dark:bg-zinc-800 overflow-hidden relative shrink-0">
        <div
          className="h-full bg-linear-to-r from-blue-600 via-indigo-600 to-blue-500 transition-[width] duration-100 ease-out shadow-xs"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Status notification banner */}
      {statusMessage && (
        <div className="bg-emerald-600 text-white text-xs py-1.5 px-4 text-center font-medium animate-in fade-in transition-all">
          {statusMessage}
        </div>
      )}

      {/* Main Split Body: Slides Report in Center + Collapsible AI Assistant Chat on Right */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        {/* CASE HISTORY SLIDE-OVER DRAWER */}
        {showHistory && (
          <aside className="w-72 xl:w-80 shrink-0 border-r border-border/80 bg-surface p-4 space-y-3 overflow-y-auto no-scrollbar hidden md:flex flex-col animate-in slide-in-from-left duration-200 z-20">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Clock className="size-3.5 text-brand-blue" />
                Case History & Audit Trail
              </span>
              <button
                type="button"
                onClick={() => setShowHistory(false)}
                className="size-6 rounded-lg text-muted-foreground hover:text-foreground hover:bg-tile flex items-center justify-center transition cursor-pointer"
                aria-label="Close history"
              >
                <X className="size-3.5" />
              </button>
            </div>

            <div className="space-y-2 pt-1 flex-1 overflow-y-auto no-scrollbar">
              {caseHistoryList.map((item) => {
                const isSelected = item.id === activeCaseId;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setInternalCaseId(item.id);
                    }}
                    className={`w-full text-left rounded-xl p-3 transition-all border relative cursor-pointer ${isSelected
                      ? "border-blue-400/80 bg-blue-50/70 dark:bg-blue-950/40 dark:border-blue-800 shadow-2xs"
                      : "border-border/60 bg-surface hover:bg-tile/70 text-muted-foreground"
                      }`}
                  >
                    <h4
                      className={`text-xs leading-snug line-clamp-2 ${isSelected ? "text-foreground font-semibold" : "text-foreground/85 font-medium"
                        }`}
                    >
                      {item.title}
                    </h4>
                    <span className="mt-1.5 block text-[10px] text-muted-foreground">
                      {item.timestamp}
                    </span>
                    {isSelected && (
                      <span className="absolute right-2.5 top-3 size-2 rounded-full bg-brand-blue" />
                    )}
                  </div>
                );
              })}
            </div>
          </aside>
        )}

        {/* CENTER REPORT CONTENT & BOTTOM CHAT BAR */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          <main
            onScroll={handleMainScroll}
            className="flex-1 overflow-y-auto no-scrollbar py-8 sm:py-10 px-8 sm:px-12 lg:px-16 xl:px-24 bg-surface-tint"
          >
            <div className="max-w-4xl xl:max-w-5xl mx-auto space-y-6 sm:space-y-7 pb-10">
              {/* Top Update Card for the 3 circled items highlighted on the left */}
              {hasThreeCircledUpdates && updatesForActiveCase && updatesForActiveCase.length > 0 && (
                <section
                  id="slide-updates"
                  className="rounded-3xl border border-sky-200/90 dark:border-sky-900/50 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden"
                >
                  {/* Card Header with Update Pill */}
                  <div className="px-6 py-4.5 sm:px-8 border-b border-sky-100 dark:border-zinc-800/80 bg-linear-to-r from-sky-50/80 via-blue-50/40 to-transparent dark:from-sky-950/30 dark:via-zinc-900 dark:to-transparent flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-brand-blue text-white shadow-2xs">
                        <Sparkles className="size-3.5" />
                        Update
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                        3 critical updates flagged on this item
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/50">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live Verified
                    </div>
                  </div>

                  {/* 3 Bigger Update Texts */}
                  <div className="p-6 sm:p-8 space-y-4">
                    {updatesForActiveCase.map((upd, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-slate-100 dark:border-zinc-800/80 bg-slate-50/60 dark:bg-zinc-800/30 p-5 sm:p-6 transition-all hover:border-sky-200 hover:bg-sky-50/30 dark:hover:bg-zinc-800/60 space-y-2.5"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-bold uppercase tracking-wider text-brand-blue bg-blue-100/70 dark:bg-blue-900/50 px-2.5 py-0.5 rounded-md">
                            {upd.tag}
                          </span>
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                              upd.badgeType === "danger"
                                ? "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300"
                                : upd.badgeType === "warning"
                                ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
                                : "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                            }`}
                          >
                            {upd.badge}
                          </span>
                        </div>

                        {/* Bigger update text headline */}
                        <h3 className="text-lg sm:text-xl lg:text-[21px] font-semibold text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
                          {upd.headline}
                        </h3>

                        {/* Supporting context */}
                        <p
                          style={{ color: "#41485e" }}
                          className="text-sm sm:text-[15px] leading-relaxed text-[#41485e] dark:text-slate-300 font-normal"
                        >
                          {upd.subtext}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              {renderSlideCard(0, "slide-summary")}
              {renderSlideCard(4, "slide-telemetry")}
              {renderMethodologyCard("slide-methodology")}

              {/* Case Follow-up Conversation & Message Box Stream */}
              <div id="case-conversation-box" className="pt-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-px bg-slate-200 dark:bg-zinc-800 flex-1" />
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-zinc-900 text-brand-blue border border-slate-200/90 dark:border-zinc-800 shadow-2xs">
                    <MessageSquare className="size-3.5" />
                    <span>Follow-up Discussion {messages.length > 0 ? `(${messages.length})` : ""}</span>
                  </span>
                  <div className="h-px bg-slate-200 dark:bg-zinc-800 flex-1" />
                </div>

                {/* If no messages yet, show conversation starter prompt with suggested questions */}
                {messages.length === 0 ? (
                  <div className="rounded-2xl sm:rounded-3xl border border-dashed border-slate-300 dark:border-zinc-700/80 bg-white/70 dark:bg-zinc-900/50 p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-2xl bg-brand-blue/10 text-brand-blue flex items-center justify-center shrink-0">
                        <Sparkles className="size-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">
                          Ask a follow-up question
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Inquire about markdown schedules, inventory re-balancing, or SKU allocation.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {currentAssistantConfig.suggestions.slice(0, 2).map((sugg, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSendMessage(undefined, sugg)}
                          className="px-3.5 py-1.5 rounded-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:border-brand-blue/60 text-xs font-medium text-foreground hover:text-brand-blue transition cursor-pointer shadow-2xs"
                        >
                          "{sugg}"
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((m) =>
                      m.sender === "user" ? (
                        <div key={m.id} className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-200">
                          <div className="max-w-2xl rounded-2xl sm:rounded-3xl bg-brand-blue text-white px-5 py-3.5 shadow-sm text-sm sm:text-base leading-relaxed">
                            <div className="flex items-center gap-2 mb-1 opacity-80 text-xs font-semibold">
                              <span>You (CXO)</span>
                            </div>
                            <p className="whitespace-pre-wrap">{m.content}</p>
                          </div>
                        </div>
                      ) : (
                        <div key={m.id} className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-200">
                          <div className="max-w-3xl w-full rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 p-5 sm:p-6 shadow-xs space-y-3">
                            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                              <div className="flex items-center gap-2">
                                <div className="size-6 rounded-lg bg-brand-blue/10 text-brand-blue flex items-center justify-center">
                                  <Sparkles className="size-3.5" />
                                </div>
                                <span className="text-xs font-bold text-foreground">
                                  AI Response
                                </span>
                              </div>

                            </div>
                            <div className="text-sm sm:text-[15px] leading-relaxed text-foreground/90 whitespace-pre-line font-normal space-y-2">
                              {m.content}
                            </div>
                          </div>
                        </div>
                      )
                    )}

                    {/* Agent Thinking / Calculating Indicator */}
                    {isAiReplying && (
                      <div className="flex justify-start animate-in fade-in duration-200">
                        <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 px-5 py-3.5 shadow-xs flex items-center gap-3">
                          <div className="size-6 rounded-lg bg-brand-blue/10 text-brand-blue flex items-center justify-center animate-pulse">
                            <Sparkles className="size-3.5" />
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>Agent analyzing case telemetry & calculating scenario</span>
                            <span className="inline-flex gap-1">
                              <span className="size-1.5 rounded-full bg-brand-blue animate-bounce [animation-delay:-0.3s]" />
                              <span className="size-1.5 rounded-full bg-brand-blue animate-bounce [animation-delay:-0.15s]" />
                              <span className="size-1.5 rounded-full bg-brand-blue animate-bounce" />
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={conversationEndRef} />
                  </div>
                )}
              </div>
            </div>
          </main>

          {/* Option chat (with voice icon) is in the bottom of the right side */}
          <div className="shrink-0 border-t border-border/80 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-8 sm:px-12 lg:px-16 xl:px-24 py-3.5 shadow-sm">
            <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center gap-2">
              <button
                type="button"
                onClick={handleBottomVoiceClick}
                className={`size-9 rounded-full border flex items-center justify-center transition shrink-0 cursor-pointer shadow-2xs ${isBottomVoiceListening
                  ? "border-rose-500 bg-rose-50 text-rose-600 animate-pulse"
                  : "border-teal-600/30 bg-teal-50/80 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 hover:bg-teal-100"
                  }`}
                title={isBottomVoiceListening ? "Listening... click to stop" : "Voice mode (click to speak)"}
              >
                <Mic className="size-4" />
              </button>
              <div className="relative flex-1">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={isBottomVoiceListening ? "Listening... speak now" : "Ask follow-up question or instruct the agent..."}
                  className="w-full rounded-2xl border border-border/80 bg-surface pl-3.5 pr-10 py-2 text-xs sm:text-sm text-foreground outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20 transition placeholder:text-muted-foreground shadow-2xs"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 grid size-7 place-items-center rounded-full bg-brand-blue text-white hover:opacity-90 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                  aria-label="Send"
                >
                  <Send className="size-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
