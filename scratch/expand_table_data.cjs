const fs = require('fs');
const path = 'c:/Users/Arjun/Downloads/pixel-perfect-playbook-948-main/pixel-perfect-playbook-948-main/src/components/CxoDashboard.tsx';

let content = fs.readFileSync(path, 'utf8');

// 1. Expand c1-sales-ledger
const oldSalesRowsRegex = /id:\s*"c1-sales-ledger"[\s\S]*?columns:\s*\["Invoice #", "Date", "Store \/ Region", "Product", "Units Sold", "Net Amount", "Sales Trend"\],\s*rows:\s*\[[\s\S]*?\],/m;

const newSalesChunk = `id: "c1-sales-ledger",
          name: "Sales Invoices Ledger (90 Days)",
          badge: "Sales Table",
          period: "Jun 25 – Sep 23, 2026",
          totalSum: "₹48.20 Cr",
          recordCount: "24,190 Invoices",
          sourceSystem: "Store POS & ERP Invoicing Feed",
          citationId: "CIT-2026-SLS-42",
          description: "All store and digital invoices used to compute revenue velocity and sales run-rates.",
          columns: ["Invoice #", "Date", "Store / Region", "Product", "Units Sold", "Net Amount", "Sales Trend"],
          rows: [
            { "Invoice #": "INV-2026-8841", "Date": "23 Sep 2026", "Store / Region": "Delhi Flagship (DL-01)", "Product": "Men's Denim Jacket", "Units Sold": "4", "Net Amount": "₹15,996", "Sales Trend": "Slow (-42%)" },
            { "Invoice #": "INV-2026-8820", "Date": "23 Sep 2026", "Store / Region": "Mumbai Phoenix (MH-04)", "Product": "Women's Kurti", "Units Sold": "6", "Net Amount": "₹11,994", "Sales Trend": "Slow (-35%)" },
            { "Invoice #": "INV-2026-8794", "Date": "22 Sep 2026", "Store / Region": "Bengaluru Indiranagar", "Product": "Slim Fit Shirt", "Units Sold": "8", "Net Amount": "₹15,192", "Sales Trend": "Sluggish (-28%)" },
            { "Invoice #": "INV-2026-8750", "Date": "22 Sep 2026", "Store / Region": "Hyderabad Banjara", "Product": "Casual Trousers", "Units Sold": "5", "Net Amount": "₹11,495", "Sales Trend": "Lagging (-24%)" },
            { "Invoice #": "INV-2026-8692", "Date": "21 Sep 2026", "Store / Region": "Kolkata Park St", "Product": "Printed T-shirt", "Units Sold": "12", "Net Amount": "₹11,988", "Sales Trend": "Lagging (-19%)" },
            { "Invoice #": "INV-2026-8610", "Date": "20 Sep 2026", "Store / Region": "Pune Viman Nagar", "Product": "Linen Casual Shirt", "Units Sold": "28", "Net Amount": "₹69,972", "Sales Trend": "Fast (+32%)" },
            { "Invoice #": "INV-2026-8540", "Date": "19 Sep 2026", "Store / Region": "Chennai Express", "Product": "Chino Shorts", "Units Sold": "18", "Net Amount": "₹26,982", "Sales Trend": "Normal (+4%)" },
            { "Invoice #": "INV-2026-8492", "Date": "19 Sep 2026", "Store / Region": "Ahmedabad Alpha", "Product": "Relaxed Utility Cargo", "Units Sold": "3", "Net Amount": "₹8,997", "Sales Trend": "Slow (-31%)" },
            { "Invoice #": "INV-2026-8430", "Date": "18 Sep 2026", "Store / Region": "Jaipur World Trade", "Product": "Heavyweight Wool Overcoat", "Units Sold": "2", "Net Amount": "₹15,998", "Sales Trend": "Stagnant (-48%)" },
            { "Invoice #": "INV-2026-8380", "Date": "18 Sep 2026", "Store / Region": "Chandigarh Elante", "Product": "Merino Knit Polo", "Units Sold": "7", "Net Amount": "₹19,593", "Sales Trend": "Sluggish (-16%)" },
            { "Invoice #": "INV-2026-8312", "Date": "17 Sep 2026", "Store / Region": "Lucknow Phoenix", "Product": "Vintage Straight Denim", "Units Sold": "14", "Net Amount": "₹41,986", "Sales Trend": "Stable (+8%)" },
            { "Invoice #": "INV-2026-8270", "Date": "17 Sep 2026", "Store / Region": "Kochi Lulu Mall", "Product": "Band-Collar Linen Shirt", "Units Sold": "32", "Net Amount": "₹79,968", "Sales Trend": "Surging (+88%)" },
            { "Invoice #": "INV-2026-8215", "Date": "16 Sep 2026", "Store / Region": "Indore Treasure", "Product": "Quilted Puffer Vest", "Units Sold": "4", "Net Amount": "₹11,996", "Sales Trend": "Lagging (-22%)" },
            { "Invoice #": "INV-2026-8170", "Date": "16 Sep 2026", "Store / Region": "Surat VR Mall", "Product": "Tailored Stretch Chino", "Units Sold": "19", "Net Amount": "₹43,681", "Sales Trend": "Healthy (+11%)" },
            { "Invoice #": "INV-2026-8104", "Date": "15 Sep 2026", "Store / Region": "Delhi Saket (DL-02)", "Product": "Silk Blend Resort Shirt", "Units Sold": "22", "Net Amount": "₹87,978", "Sales Trend": "Fast (+74%)" },
            { "Invoice #": "INV-2026-8051", "Date": "15 Sep 2026", "Store / Region": "Mumbai Palladium", "Product": "Oversized Fleece Hoodie", "Units Sold": "5", "Net Amount": "₹12,495", "Sales Trend": "Slow (-17%)" },
            { "Invoice #": "INV-2026-7992", "Date": "14 Sep 2026", "Store / Region": "Bengaluru Koramangala", "Product": "Ribbed Modal Tank Top", "Units Sold": "38", "Net Amount": "₹37,962", "Sales Trend": "Stable (+15%)" },
            { "Invoice #": "INV-2026-7935", "Date": "14 Sep 2026", "Store / Region": "Noida DLF Mall", "Product": "Classic Bomber Jacket", "Units Sold": "3", "Net Amount": "₹11,997", "Sales Trend": "Stagnant (-33%)" },
            { "Invoice #": "INV-2026-7880", "Date": "13 Sep 2026", "Store / Region": "Gurugram Ambience", "Product": "Corduroy Overshirt", "Units Sold": "6", "Net Amount": "₹17,994", "Sales Trend": "Slow (-12%)" },
            { "Invoice #": "INV-2026-7822", "Date": "13 Sep 2026", "Store / Region": "Nagpur Empress", "Product": "Lightweight Windbreaker", "Units Sold": "15", "Net Amount": "₹44,985", "Sales Trend": "Normal (+6%)" },
            { "Invoice #": "INV-2026-7760", "Date": "12 Sep 2026", "Store / Region": "Bhopal DB City", "Product": "Premium Leather Belt", "Units Sold": "24", "Net Amount": "₹35,976", "Sales Trend": "Strong (+19%)" },
            { "Invoice #": "INV-2026-7710", "Date": "12 Sep 2026", "Store / Region": "Patna City Centre", "Product": "Striped Poplin Shirt", "Units Sold": "16", "Net Amount": "₹39,984", "Sales Trend": "Healthy (+10%)" },
            { "Invoice #": "INV-2026-7654", "Date": "11 Sep 2026", "Store / Region": "Guwahati City Square", "Product": "Double-Breasted Trench", "Units Sold": "1", "Net Amount": "₹7,999", "Sales Trend": "Frozen (-52%)" },
            { "Invoice #": "INV-2026-7601", "Date": "11 Sep 2026", "Store / Region": "Vadodara Inorbit", "Product": "Cable-Knit Cardigan", "Units Sold": "4", "Net Amount": "₹9,996", "Sales Trend": "Slow (-27%)" },
            { "Invoice #": "INV-2026-7540", "Date": "10 Sep 2026", "Store / Region": "Online D2C Webstore", "Product": "Canvas Chore Jacket", "Units Sold": "11", "Net Amount": "₹38,489", "Sales Trend": "Healthy (+9%)" },
          ],`;

content = content.replace(oldSalesRowsRegex, newSalesChunk);

// 2. Expand c1-inventory-ledger
const oldInvRegex = /id:\s*"c1-inventory-ledger"[\s\S]*?columns:\s*\["Product Name", "Units in Stock", "Avg Age", "Unit Cost", "Total Exposure", "Risk Level"\],\s*rows:\s*\[[\s\S]*?\],/m;

const newInvChunk = `id: "c1-inventory-ledger",
          name: "Warehouse Inventory Age & Exposure Ledger",
          badge: "Inventory Table",
          period: "As of Sep 23, 2026",
          totalSum: "₹18.40 Cr",
          recordCount: "42 Products",
          sourceSystem: "Warehouse WMS & Stock Balances",
          citationId: "CIT-2026-INV-87",
          description: "Inventory age distribution and exposure valuation across central and regional hubs.",
          columns: ["Product Name", "Units in Stock", "Avg Age", "Unit Cost", "Total Exposure", "Risk Level"],
          rows: [
            { "Product Name": "Men's Denim Jacket", "Units in Stock": "7,000 pcs", "Avg Age": "124 days", "Unit Cost": "₹4,000", "Total Exposure": "₹2.80 Cr", "Risk Level": "High Risk" },
            { "Product Name": "Women's Kurti", "Units in Stock": "10,500 pcs", "Avg Age": "109 days", "Unit Cost": "₹2,000", "Total Exposure": "₹2.10 Cr", "Risk Level": "High Risk" },
            { "Product Name": "Slim Fit Shirt", "Units in Stock": "8,950 pcs", "Avg Age": "96 days", "Unit Cost": "₹1,900", "Total Exposure": "₹1.70 Cr", "Risk Level": "Moderate Risk" },
            { "Product Name": "Casual Trousers", "Units in Stock": "6,080 pcs", "Avg Age": "91 days", "Unit Cost": "₹2,300", "Total Exposure": "₹1.40 Cr", "Risk Level": "Moderate Risk" },
            { "Product Name": "Printed T-shirt", "Units in Stock": "12,000 pcs", "Avg Age": "86 days", "Unit Cost": "₹1,000", "Total Exposure": "₹1.20 Cr", "Risk Level": "Moderate Risk" },
            { "Product Name": "Relaxed Fit Utility Cargo", "Units in Stock": "4,200 pcs", "Avg Age": "82 days", "Unit Cost": "₹2,740", "Total Exposure": "₹1.15 Cr", "Risk Level": "High Risk" },
            { "Product Name": "Heavyweight Wool Overcoat", "Units in Stock": "2,450 pcs", "Avg Age": "118 days", "Unit Cost": "₹4,000", "Total Exposure": "₹98.0 L", "Risk Level": "High Risk" },
            { "Product Name": "Fine Gauge Merino Knit Polo", "Units in Stock": "3,100 pcs", "Avg Age": "74 days", "Unit Cost": "₹2,740", "Total Exposure": "₹85.0 L", "Risk Level": "Moderate Risk" },
            { "Product Name": "Vintage Wash Straight Jeans", "Units in Stock": "2,600 pcs", "Avg Age": "65 days", "Unit Cost": "₹3,000", "Total Exposure": "₹78.0 L", "Risk Level": "Watching" },
            { "Product Name": "French Linen Band-Collar Shirt", "Units in Stock": "1,850 pcs", "Avg Age": "18 days", "Unit Cost": "₹3,510", "Total Exposure": "₹65.0 L", "Risk Level": "Stockout Risk" },
            { "Product Name": "Quilted Puffer Vest", "Units in Stock": "1,930 pcs", "Avg Age": "94 days", "Unit Cost": "₹3,000", "Total Exposure": "₹58.0 L", "Risk Level": "High Risk" },
            { "Product Name": "Tailored Stretch Chino Pants", "Units in Stock": "2,400 pcs", "Avg Age": "58 days", "Unit Cost": "₹2,250", "Total Exposure": "₹54.0 L", "Risk Level": "Watching" },
            { "Product Name": "Silk Blend Resort Shirt", "Units in Stock": "1,220 pcs", "Avg Age": "22 days", "Unit Cost": "₹4,010", "Total Exposure": "₹49.0 L", "Risk Level": "Stockout Risk" },
            { "Product Name": "Oversized Fleece Hoodie", "Units in Stock": "1,800 pcs", "Avg Age": "88 days", "Unit Cost": "₹2,500", "Total Exposure": "₹45.0 L", "Risk Level": "Moderate Risk" },
            { "Product Name": "Ribbed Modal Tank Top", "Units in Stock": "4,200 pcs", "Avg Age": "45 days", "Unit Cost": "₹1,000", "Total Exposure": "₹42.0 L", "Risk Level": "Watching" },
            { "Product Name": "Classic Bomber Jacket", "Units in Stock": "1,150 pcs", "Avg Age": "105 days", "Unit Cost": "₹3,390", "Total Exposure": "₹39.0 L", "Risk Level": "High Risk" },
            { "Product Name": "Stretch Cotton Bermuda Shorts", "Units in Stock": "2,000 pcs", "Avg Age": "92 days", "Unit Cost": "₹1,800", "Total Exposure": "₹36.0 L", "Risk Level": "Moderate Risk" },
            { "Product Name": "Corduroy Overshirt", "Units in Stock": "1,100 pcs", "Avg Age": "68 days", "Unit Cost": "₹3,000", "Total Exposure": "₹33.0 L", "Risk Level": "Watching" },
            { "Product Name": "Lightweight Windbreaker", "Units in Stock": "1,000 pcs", "Avg Age": "62 days", "Unit Cost": "₹3,000", "Total Exposure": "₹30.0 L", "Risk Level": "Watching" },
            { "Product Name": "Premium Leather Dress Belt", "Units in Stock": "1,860 pcs", "Avg Age": "55 days", "Unit Cost": "₹1,500", "Total Exposure": "₹28.0 L", "Risk Level": "Watching" },
            { "Product Name": "Striped Poplin Work Shirt", "Units in Stock": "1,040 pcs", "Avg Age": "48 days", "Unit Cost": "₹2,500", "Total Exposure": "₹26.0 L", "Risk Level": "Watching" },
            { "Product Name": "Double-Breasted Trench Coat", "Units in Stock": "600 pcs", "Avg Age": "112 days", "Unit Cost": "₹4,000", "Total Exposure": "₹24.0 L", "Risk Level": "High Risk" },
            { "Product Name": "Cable-Knit Wool Cardigan", "Units in Stock": "880 pcs", "Avg Age": "95 days", "Unit Cost": "₹2,500", "Total Exposure": "₹22.0 L", "Risk Level": "Moderate Risk" },
            { "Product Name": "Athleisure Jogger Pants", "Units in Stock": "1,250 pcs", "Avg Age": "42 days", "Unit Cost": "₹1,600", "Total Exposure": "₹20.0 L", "Risk Level": "Watching" },
            { "Product Name": "Canvas Chore Jacket", "Units in Stock": "514 pcs", "Avg Age": "76 days", "Unit Cost": "₹3,500", "Total Exposure": "₹18.0 L", "Risk Level": "Watching" },
            { "Product Name": "Chambray Casual Button-Down", "Units in Stock": "620 pcs", "Avg Age": "51 days", "Unit Cost": "₹2,400", "Total Exposure": "₹14.9 L", "Risk Level": "Watching" },
            { "Product Name": "Waxed Cotton Field Parka", "Units in Stock": "310 pcs", "Avg Age": "116 days", "Unit Cost": "₹4,200", "Total Exposure": "₹13.0 L", "Risk Level": "High Risk" },
            { "Product Name": "Relaxed Linen Drawstring Trouser", "Units in Stock": "480 pcs", "Avg Age": "24 days", "Unit Cost": "₹2,500", "Total Exposure": "₹12.0 L", "Risk Level": "Stockout Risk" },
            { "Product Name": "Brushed Flannel Plaid Shirt", "Units in Stock": "440 pcs", "Avg Age": "72 days", "Unit Cost": "₹2,200", "Total Exposure": "₹9.7 L", "Risk Level": "Watching" },
            { "Product Name": "Pima Cotton Crew Undershirt (3-Pack)", "Units in Stock": "650 pcs", "Avg Age": "30 days", "Unit Cost": "₹1,400", "Total Exposure": "₹9.1 L", "Risk Level": "Optimal" },
          ],`;

content = content.replace(oldInvRegex, newInvChunk);

// 3. Expand customDs generation in "Open Table" button
const oldCustomDsRegex = /const customDs: CxoEvidenceDataset = \{[\s\S]*?rows:\s*msg\.structuredAnswer\.topProducts\.map[\s\S]*?\}\),\s*\};/m;

const newCustomDsChunk = `const masterRows = [
                                                    { "SKU": "SKU-DNM-8821", "Product": "Men's Denim Jacket", "Category": "Outerwear", "Inventory Value": "₹2.80 Cr", "Units in Stock": "7,000 pcs", "Inventory Age": "124 days", "Sales Trend": "↓ 42%", "Status": "Critical Exposure" },
                                                    { "SKU": "SKU-KRT-4102", "Product": "Women's Kurti", "Category": "Ethnic Wear", "Inventory Value": "₹2.10 Cr", "Units in Stock": "10,500 pcs", "Inventory Age": "109 days", "Sales Trend": "↓ 35%", "Status": "Critical Exposure" },
                                                    { "SKU": "SKU-SHT-9931", "Product": "Slim Fit Shirt", "Category": "Shirts", "Inventory Value": "₹1.70 Cr", "Units in Stock": "8,950 pcs", "Inventory Age": "96 days", "Sales Trend": "↓ 28%", "Status": "High Exposure" },
                                                    { "SKU": "SKU-TRS-5520", "Product": "Casual Trousers", "Category": "Pants", "Inventory Value": "₹1.40 Cr", "Units in Stock": "6,080 pcs", "Inventory Age": "91 days", "Sales Trend": "↓ 24%", "Status": "High Exposure" },
                                                    { "SKU": "SKU-TEE-1184", "Product": "Printed T-shirt", "Category": "Tees", "Inventory Value": "₹1.20 Cr", "Units in Stock": "12,000 pcs", "Inventory Age": "86 days", "Sales Trend": "↓ 19%", "Status": "Moderate Risk" },
                                                    { "SKU": "SKU-CRG-9022", "Product": "Relaxed Fit Utility Cargo", "Category": "Pants", "Inventory Value": "₹1.15 Cr", "Units in Stock": "4,200 pcs", "Inventory Age": "82 days", "Sales Trend": "↓ 22%", "Status": "Moderate Risk" },
                                                    { "SKU": "SKU-COT-7740", "Product": "Heavyweight Wool Overcoat", "Category": "Outerwear", "Inventory Value": "₹98.0 L", "Units in Stock": "2,450 pcs", "Inventory Age": "118 days", "Sales Trend": "↓ 38%", "Status": "Critical Exposure" },
                                                    { "SKU": "SKU-POL-3391", "Product": "Fine Gauge Merino Knit Polo", "Category": "Knitwear", "Inventory Value": "₹85.0 L", "Units in Stock": "3,100 pcs", "Inventory Age": "74 days", "Sales Trend": "↓ 15%", "Status": "Moderate Risk" },
                                                    { "SKU": "SKU-JNS-6612", "Product": "Vintage Wash Straight Jeans", "Category": "Denim", "Inventory Value": "₹78.0 L", "Units in Stock": "2,600 pcs", "Inventory Age": "65 days", "Sales Trend": "↑ 12%", "Status": "Optimal Run Rate" },
                                                    { "SKU": "SKU-LNN-2290", "Product": "French Linen Band-Collar Shirt", "Category": "Shirts", "Inventory Value": "₹65.0 L", "Units in Stock": "1,850 pcs", "Inventory Age": "18 days", "Sales Trend": "↑ 84%", "Status": "Stockout Risk" },
                                                    { "SKU": "SKU-VST-8819", "Product": "Quilted Puffer Vest", "Category": "Outerwear", "Inventory Value": "₹58.0 L", "Units in Stock": "1,930 pcs", "Inventory Age": "94 days", "Sales Trend": "↓ 26%", "Status": "High Exposure" },
                                                    { "SKU": "SKU-CHN-4401", "Product": "Tailored Stretch Chino Pants", "Category": "Pants", "Inventory Value": "₹54.0 L", "Units in Stock": "2,400 pcs", "Inventory Age": "58 days", "Sales Trend": "↑ 8%", "Status": "Optimal Run Rate" },
                                                    { "SKU": "SKU-SLK-1982", "Product": "Silk Blend Resort Shirt", "Category": "Shirts", "Inventory Value": "₹49.0 L", "Units in Stock": "1,220 pcs", "Inventory Age": "22 days", "Sales Trend": "↑ 78%", "Status": "Stockout Risk" },
                                                    { "SKU": "SKU-HOD-5509", "Product": "Oversized Fleece Hoodie", "Category": "Knitwear", "Inventory Value": "₹45.0 L", "Units in Stock": "1,800 pcs", "Inventory Age": "88 days", "Sales Trend": "↓ 18%", "Status": "Moderate Risk" },
                                                    { "SKU": "SKU-TNK-3312", "Product": "Ribbed Modal Tank Top", "Category": "Basics", "Inventory Value": "₹42.0 L", "Units in Stock": "4,200 pcs", "Inventory Age": "45 days", "Sales Trend": "↑ 14%", "Status": "Optimal Run Rate" },
                                                    { "SKU": "SKU-BMB-7721", "Product": "Classic Bomber Jacket", "Category": "Outerwear", "Inventory Value": "₹39.0 L", "Units in Stock": "1,150 pcs", "Inventory Age": "105 days", "Sales Trend": "↓ 31%", "Status": "High Exposure" },
                                                    { "SKU": "SKU-SHT-6610", "Product": "Stretch Cotton Bermuda Shorts", "Category": "Bottoms", "Inventory Value": "₹36.0 L", "Units in Stock": "2,000 pcs", "Inventory Age": "92 days", "Sales Trend": "↓ 29%", "Status": "High Exposure" },
                                                    { "SKU": "SKU-CRD-8840", "Product": "Corduroy Overshirt", "Category": "Shirts", "Inventory Value": "₹33.0 L", "Units in Stock": "1,100 pcs", "Inventory Age": "68 days", "Sales Trend": "↓ 11%", "Status": "Moderate Risk" },
                                                    { "SKU": "SKU-WND-2219", "Product": "Lightweight Windbreaker", "Category": "Outerwear", "Inventory Value": "₹30.0 L", "Units in Stock": "1,000 pcs", "Inventory Age": "62 days", "Sales Trend": "↑ 5%", "Status": "Optimal Run Rate" },
                                                    { "SKU": "SKU-BLT-9901", "Product": "Premium Leather Dress Belt", "Category": "Accessories", "Inventory Value": "₹28.0 L", "Units in Stock": "1,860 pcs", "Inventory Age": "55 days", "Sales Trend": "↑ 18%", "Status": "Optimal Run Rate" },
                                                    { "SKU": "SKU-PPL-4432", "Product": "Striped Poplin Work Shirt", "Category": "Shirts", "Inventory Value": "₹26.0 L", "Units in Stock": "1,040 pcs", "Inventory Age": "48 days", "Sales Trend": "↑ 10%", "Status": "Optimal Run Rate" },
                                                    { "SKU": "SKU-TRN-7715", "Product": "Double-Breasted Trench Coat", "Category": "Outerwear", "Inventory Value": "₹24.0 L", "Units in Stock": "600 pcs", "Inventory Age": "112 days", "Sales Trend": "↓ 40%", "Status": "Critical Exposure" },
                                                    { "SKU": "SKU-CRD-3382", "Product": "Cable-Knit Wool Cardigan", "Category": "Knitwear", "Inventory Value": "₹22.0 L", "Units in Stock": "880 pcs", "Inventory Age": "95 days", "Sales Trend": "↓ 25%", "Status": "High Exposure" },
                                                    { "SKU": "SKU-JGR-6629", "Product": "Athleisure Jogger Pants", "Category": "Pants", "Inventory Value": "₹20.0 L", "Units in Stock": "1,250 pcs", "Inventory Age": "42 days", "Sales Trend": "↑ 22%", "Status": "Optimal Run Rate" },
                                                    { "SKU": "SKU-CHR-5511", "Product": "Canvas Chore Jacket", "Category": "Outerwear", "Inventory Value": "₹18.0 L", "Units in Stock": "514 pcs", "Inventory Age": "76 days", "Sales Trend": "↓ 14%", "Status": "Moderate Risk" },
                                                  ];

                                                  const customDs: CxoEvidenceDataset = {
                                                    id: \`\${msg.id}-products\`,
                                                    name: \`\${msg.structuredAnswer.reportTitle} - Products Master Table\`,
                                                    badge: "Products Table",
                                                    period: msg.structuredAnswer.reportDate || "Current Period",
                                                    totalSum: msg.structuredAnswer.kpiStats?.[0]?.value || "₹18.4 Cr",
                                                    recordCount: \`\${masterRows.length} Products\`,
                                                    sourceSystem: "Store POS & Warehouse ERP Balances",
                                                    citationId: \`CIT-\${msg.caseId || "DATA"}-PROD\`,
                                                    description: \`Complete item-level inventory valuation, turnover age, and sales performance records for \${msg.structuredAnswer.reportTitle}.\`,
                                                    columns: ["SKU", "Product", "Category", "Units in Stock", "Inventory Value", "Inventory Age", "Sales Trend", "Status"],
                                                    rows: masterRows,
                                                  };`;

content = content.replace(oldCustomDsRegex, newCustomDsChunk);

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully expanded table popup data in CxoDashboard.tsx!');
