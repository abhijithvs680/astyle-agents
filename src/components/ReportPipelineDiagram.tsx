import { Fragment } from "react";
import { Table2, ArrowDown } from "lucide-react";

export interface ReportPipelineEvidence {
  id: string;
  name: string;
  badge?: string;
}

export interface ReportPipelineDiagramProps {
  caseId?: string;
  reportTitle?: string;
  className?: string;
  datasets?: ReportPipelineEvidence[] | undefined;
  onSelectDataset?: ((datasetId: string) => void) | undefined;
}

interface FlowStep {
  step: string;
  title: string;
  description: string;
}

function getFlowSteps(caseId?: string, reportTitle?: string): FlowStep[] {
  const normTitle = (reportTitle || "").toLowerCase();
  const id = (caseId || "").toLowerCase();

  // CASE 1: Inventory Exposure
  if (id.includes("case-1") || normTitle.includes("exposure") || normTitle.includes("inventory")) {
    return [
      {
        step: "STEP 1",
        title: "Scanned 90-day store sales bills & warehouse stock ledgers",
        description: "24,190 bills across 42 stores and regional depots",
      },
      {
        step: "STEP 2",
        title: "Deducted customer returns & sizing exchanges",
        description: "₹6.8 Cr in returned items removed to get real net sales",
      },
      {
        step: "STEP 3",
        title: "Checked shelf age against 60-day turnover speed",
        description: "42 products have been sitting beyond the 60-day limit",
      },
      {
        step: "STEP 4",
        title: "Calculated total capital locked in slow items",
        description: "₹18.4 Cr exposure, with ₹11.2 Cr (61%) in top 10 items",
      },
    ];
  }

  // CASE 2: Launch Performance
  if (id.includes("case-2") || normTitle.includes("launch") || normTitle.includes("newly")) {
    return [
      {
        step: "STEP 1",
        title: "Tracked first 18 days of sales bills across stores and web",
        description: "₹6.4 Cr total sales across 4 new launch categories",
      },
      {
        step: "STEP 2",
        title: "Audited customer return reason codes and tags",
        description: "34% of cargo pants returned due to waist fit issues",
      },
      {
        step: "STEP 3",
        title: "Benchmarked sell-through speed against launch targets",
        description: "Linen shirts sold 3.2x faster while cargo pants lagged",
      },
      {
        step: "STEP 4",
        title: "Correlated digital ad spending with product demand",
        description: "Ad budget was spent pushing slow cargos instead of linen",
      },
    ];
  }

  // CASE 3: Mill Supplier Concentration
  if (id.includes("case-3") || normTitle.includes("mill") || normTitle.includes("revenue") || normTitle.includes("dependent")) {
    return [
      {
        step: "STEP 1",
        title: "Extracted monthly sales ledgers and fabric Bill of Materials",
        description: "4 core denim lines drive 42.6% of all apparel revenue",
      },
      {
        step: "STEP 2",
        title: "Mapped fabric yardage to supplier procurement purchase orders",
        description: "78.5% of all denim yardage relies on a single Coimbatore mill",
      },
      {
        step: "STEP 3",
        title: "Simulated factory delivery stoppage and stress tests",
        description: "A delivery halt risks ₹8.5 Cr in lost monthly sales",
      },
      {
        step: "STEP 4",
        title: "Evaluated dual-sourcing alternatives and buffer inventory",
        description: "45-day greige buffer and secondary Vietnam mill needed",
      },
    ];
  }

  // CASE 4: Markdowns & Lifecycle Decline
  if (id.includes("case-4") || normTitle.includes("decline") || normTitle.includes("lifecycle") || normTitle.includes("markdown")) {
    return [
      {
        step: "STEP 1",
        title: "Analyzed 12 months of register receipts and aging stock",
        description: "8,420 unsold knit polo units sitting on store racks",
      },
      {
        step: "STEP 2",
        title: "Audited realized selling prices and size distributions",
        description: "In-store discounting dragged realized prices down by 38%",
      },
      {
        step: "STEP 3",
        title: "Tracked consecutive month-over-month volume drops",
        description: "3 straight months of 35% drops put line into decline stage",
      },
      {
        step: "STEP 4",
        title: "Formulated structured clearance pricing schedule",
        description: "2-tier 25%/40% clearance schedule needed with sizes moved online",
      },
    ];
  }

  // CASE 5: Stockouts & Lost Demand
  if (id.includes("case-5") || normTitle.includes("stockout") || normTitle.includes("loss")) {
    return [
      {
        step: "STEP 1",
        title: "Logged store associate lost-sales and zero-result site searches",
        description: "4,120 customers searched for sizes M and L with zero stock",
      },
      {
        step: "STEP 2",
        title: "Checked store inventory balances across downtown vs suburbs",
        description: "420 surplus units sitting idle in suburbs while downtown had none",
      },
      {
        step: "STEP 3",
        title: "Multiplied unfulfilled shopper traffic by normal conversion",
        description: "₹8.6 Cr direct revenue lost over 30 days due to stockouts",
      },
      {
        step: "STEP 4",
        title: "Traced inbound freight logs and factory order manifests",
        description: "15-day ocean delay found; 2,000 units expedited by air freight",
      },
    ];
  }

  // DEFAULT
  return [
    {
      step: "STEP 1",
      title: "Ingested store sales bills and warehouse inventory ledgers",
      description: "All store billing transactions and stock balances consolidated",
    },
    {
      step: "STEP 2",
      title: "Cleaned data, removed returns, and standardized dates",
      description: "Clean net sales ledger with zero duplicate entries",
    },
    {
      step: "STEP 3",
      title: "Benchmarked sales velocity against category targets",
      description: "Key sales gaps, velocity drops, and aging items flagged",
    },
    {
      step: "STEP 4",
      title: "Calculated financial impact and generated recommendations",
      description: "Executive report created with verified data citations",
    },
  ];
}

export function ReportPipelineDiagram({
  caseId,
  reportTitle,
  className = "",
  datasets = [],
  onSelectDataset,
}: ReportPipelineDiagramProps) {
  const steps = getFlowSteps(caseId, reportTitle);

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Single card container without individual step boxes */}
      <div className="relative z-0 rounded-xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs">
        {steps.map((item, idx) => {
          const isFirst = idx === 0;
          return (
            <Fragment key={item.step}>
              {/* Individual step without outer box, with readable medium fonts */}
              <div className="py-2 sm:py-2.5">
                <div className="flex items-start gap-3.5">
                  <div className="size-7 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center shrink-0 text-xs sm:text-sm font-bold text-slate-800">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <h5 className="text-sm sm:text-[15px] font-semibold text-slate-900 leading-snug">
                      {item.title}
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                      {item.description}
                    </p>
                    {isFirst && datasets.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {datasets.map((d) => (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => onSelectDataset?.(d.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-cyan-50/80 hover:border-cyan-600/30 text-xs sm:text-sm font-semibold text-slate-800 hover:text-cyan-700 transition cursor-pointer shadow-2xs"
                          >
                            <Table2 className="size-4 text-slate-600" />
                            <span>{d.badge || d.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Centered arrow indicator on separation line */}
              {idx < steps.length - 1 && (
                <div className="relative flex items-center justify-center my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative z-10 flex items-center justify-center size-6 rounded-full bg-white border border-slate-300 shadow-2xs">
                    <ArrowDown className="size-3.5 text-slate-500" />
                  </div>
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
