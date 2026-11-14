export function buildNotionAndFinanceFiles(root, product, licenseKey) {
  root.file(
    '01_Creator_OS_Database_Schemas.md',
    `# Creator OS & Solopreneur Finance Vault — Database Blueprints

**License Key:** \`${licenseKey}\`

Use these exact schemas to set up your interconnected Notion workspace (or import the included CSVs in \`03_Importable_Databases/\` directly into Notion via **Import -> CSV**).

---

## 1. Goals & Quarterly OKRs (\`Goals_DB\`)
| Property Name | Notion Type | Options / Formula |
|---|---|---|
| Goal Name | Title | e.g., "Reach $5,000/mo Digital Product Revenue" |
| Quarter | Select | Q1, Q2, Q3, Q4 |
| Status | Status | Not Started, On Track, At Risk, Achieved |
| Target Metric | Number | Target value (e.g., 5000) |
| Current Metric | Number | Current value |
| Progress | Formula | See \`02_Notion_Formula_2_Snippets.md\` |
| Projects | Relation | Two-way relation to \`Projects_DB\` |

## 2. Projects Command (\`Projects_DB\`)
| Property Name | Notion Type | Options / Formula |
|---|---|---|
| Project Name | Title | e.g., "Launch AI Prompt Pack v2" |
| Goal | Relation | Links to \`Goals_DB\` |
| Area | Select | Product, Marketing, Client Work, Operations |
| Priority | Select | P1 Critical, P2 High, P3 Normal |
| Due Date | Date | Target ship date |
| Tasks | Relation | Two-way relation to \`Tasks_DB\` |
| Task Completion | Rollup | Percent checked from \`Tasks_DB\` |

## 3. Content Pipeline (\`Content_DB\`)
| Property Name | Notion Type | Options / Formula |
|---|---|---|
| Hook / Working Title | Title | Main post or video headline |
| Platform | Multi-select | X/Twitter, LinkedIn, YouTube, Newsletter, TikTok |
| Stage | Status | Idea, Scripting, Asset Design, Scheduled, Published |
| Publish Date | Date | Scheduled date |
| Linked Product | Select | Product CTA promoted in post |
| Views / Clicks | Number | Performance metric |

## 4. Client CRM & Retainers (\`Clients_DB\`)
| Property Name | Notion Type | Options / Formula |
|---|---|---|
| Client / Company | Title | Client name |
| Pipeline Stage | Select | Lead, Discovery, Proposal Sent, Active Retainer, Completed |
| Monthly Value | Number (USD) | Retainer or project fee |
| Renewal / Due Date | Date | Next billing date |
| Portal Link | URL | Shared Notion client portal |

## 5. Revenue & Tax Ledger (\`Finance_DB\`)
| Property Name | Notion Type | Options / Formula |
|---|---|---|
| Entry Description | Title | e.g., "Stripe Payout - Week 2" |
| Type | Select | Income, Software Expense, Contractor, Ad Spend |
| Amount | Number (USD) | Positive dollar value |
| Date | Date | Transaction date |
| Tax Deductible | Checkbox | True for valid business expenses |
| Net Impact | Formula | \`if(prop("Type") == "Income", prop("Amount"), -prop("Amount"))\` |
`
  );

  root.file(
    '02_Notion_Formula_2_Snippets.md',
    `# Notion Formula 2.0 Copy-Paste Library (12 Formulas)

### 1. Visual Progress Bar (Goals & Projects)
\`\`\`notion
let(
  pct, min(round((prop("Current Metric") / max(prop("Target Metric"), 1)) * 100), 100),
  filled, round(pct / 10),
  repeat("█", filled) + repeat("░", 10 - filled) + " " + format(pct) + "%"
)
\`\`\`

### 2. Overdue Task Alert Badge
\`\`\`notion
if(
  prop("Done") == true,
  "✅ Completed",
  if(
    empty(prop("Due Date")),
    "No Deadline",
    if(
      dateBetween(now(), prop("Due Date"), "days") > 0,
      "🔴 Overdue by " + format(dateBetween(now(), prop("Due Date"), "days")) + "d",
      if(
        formatDate(prop("Due Date"), "YYYY-MM-DD") == formatDate(now(), "YYYY-MM-DD"),
        "🟡 Due Today",
        "🟢 On Track"
      )
    )
  )
)
\`\`\`

### 3. Solopreneur 25% Tax Set-Aside Estimator
\`\`\`notion
if(
  prop("Type") == "Income",
  round(prop("Amount") * 0.25 * 100) / 100,
  0
)
\`\`\`

### 4. Net Profit After Tax Reserve
\`\`\`notion
if(
  prop("Type") == "Income",
  prop("Amount") * 0.75,
  -prop("Amount")
)
\`\`\`

### 5. Priority Score (Impact / Effort Matrix)
\`\`\`notion
round((prop("Impact (1-10)") / max(prop("Effort (1-10)"), 1)) * 10) / 10
\`\`\`

### 6. Content Hook Character Counter Check (X / Title Safe)
\`\`\`notion
if(
  length(prop("Hook / Working Title")) > 60,
  "⚠️ Too Long (" + format(length(prop("Hook / Working Title"))) + " chars)",
  "✅ Crisp (" + format(length(prop("Hook / Working Title"))) + " chars)"
)
\`\`\`

### 7. Client Retainer Annualized Run Rate (ARR)
\`\`\`notion
if(prop("Pipeline Stage") == "Active Retainer", prop("Monthly Value") * 12, 0)
\`\`\`

### 8. Days Since Last Client Contact
\`\`\`notion
if(
  empty(prop("Last Contacted")),
  "Never",
  format(dateBetween(now(), prop("Last Contacted"), "days")) + " days ago"
)
\`\`\`
`
  );

  root.file(
    '03_Importable_Databases/Projects_Tracker.csv',
    `Project Name,Area,Priority,Status,Due Date,Target Revenue
Launch Digital Storefront v1,Product,P1 Critical,In Progress,2026-12-01,2500
Write 7-Day Launch Email Funnel,Marketing,P1 Critical,Not Started,2026-12-05,1500
Record 5 Short-Form Product Demos,Marketing,P2 High,Not Started,2026-12-10,1000
Automate Receipt & License Delivery,Operations,P2 High,Done,2026-11-20,0
Q4 Tax & Expense Reconciliation,Operations,P3 Normal,Not Started,2026-12-28,0`
  );

  root.file(
    '03_Importable_Databases/Content_Pipeline.csv',
    `Hook / Working Title,Platform,Stage,Publish Date,Linked Product
"How I packaged 60 AI prompts into a $29 digital kit",X/Twitter,Scripting,2026-11-18,Operator AI Prompt Pack
"Stop paying $99/mo for bloated CRM tools — use this setup",LinkedIn,Idea,2026-11-20,Creator OS & Finance Vault
"12 Dark-Mode Tailwind components every SaaS needs",YouTube,Asset Design,2026-11-23,DarkForge SaaS UI Kit
"72-hour digital product validation breakdown",Newsletter,Scheduled,2026-11-26,Launch Playbook`
  );

  root.file(
    '03_Importable_Databases/Monthly_PnL_Ledger.csv',
    `Date,Entry Description,Category,Type,Amount USD,Tax Reserve (25%),Net After Tax
2026-11-01,Digital Product Sales (Stripe),Digital Sales,Income,1450.00,362.50,1087.50
2026-11-03,Domain & Cloud Hosting,Infrastructure,Expense,-24.00,0.00,-24.00
2026-11-05,Client Retainer - Acme Studio,Consulting,Income,2000.00,500.00,1500.00
2026-11-08,Email Marketing Tool,Software,Expense,-29.00,0.00,-29.00
2026-11-12,Bundle Upsell Revenue,Digital Sales,Income,680.00,170.00,510.00`
  );

  root.file(
    '03_Importable_Databases/Client_CRM_Pipeline.csv',
    `Client Name,Company,Stage,Monthly Value USD,Next Action,Last Contacted
Alex Rivera,Rivera Media,Active Retainer,1800,Send November analytics report,2026-11-10
Elena Vance,Vance Labs,Proposal Sent,3200,Follow up on SOW signature,2026-11-11
Marcus Cole,Northstar SaaS,Discovery,2500,Prepare UI audit deck,2026-11-12`
  );

  root.file(
    '04_Quarterly_Tax_and_Pricing_Calculator.html',
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Solopreneur Finance & Tax Calculator — StackVault</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #070B14; color: #F1F5F9; margin: 0; padding: 32px 16px; }
    .wrap { max-width: 760px; margin: 0 auto; background: #0F1629; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 28px; }
    h1 { margin: 0 0 6px; font-size: 24px; }
    p.sub { color: #94A3B8; margin: 0 0 24px; font-size: 14px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
    label { display: block; font-size: 12px; color: #CBD5E1; margin-bottom: 6px; }
    input { width: 100%; box-sizing: border-box; background: #070B14; border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; padding: 10px 12px; color: #fff; font-size: 15px; }
    .results { margin-top: 24px; display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 14px; }
    .card { background: #070B14; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 16px; }
    .card .k { font-size: 11px; text-transform: uppercase; color: #94A3B8; letter-spacing: .05em; }
    .card .v { font-size: 24px; font-weight: 700; margin-top: 6px; color: #38BDF8; }
    .card .v.green { color: #34D399; }
    .card .v.amber { color: #FBBF24; }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>Solopreneur Profit & Quarterly Tax Calculator</h1>
    <p class="sub">Offline interactive tool included with your Creator OS & Finance Vault.</p>
    <div class="grid">
      <div><label>Monthly Digital Product Revenue ($)</label><input id="prodRev" type="number" value="3500" /></div>
      <div><label>Monthly Client / Service Revenue ($)</label><input id="svcRev" type="number" value="2500" /></div>
      <div><label>Monthly Software & Ad Expenses ($)</label><input id="exp" type="number" value="450" /></div>
      <div><label>Estimated Tax Rate (%)</label><input id="tax" type="number" value="25" /></div>
    </div>
    <div class="results">
      <div class="card"><div class="k">Monthly Net Profit</div><div class="v" id="netOut">$0</div></div>
      <div class="card"><div class="k">Quarterly Tax Reserve</div><div class="v amber" id="qTaxOut">$0</div></div>
      <div class="card"><div class="k">Monthly Take-Home</div><div class="v green" id="takeHomeOut">$0</div></div>
      <div class="card"><div class="k">Annualized Take-Home</div><div class="v green" id="annualOut">$0</div></div>
    </div>
  </div>
  <script>
    const ids = ['prodRev', 'svcRev', 'exp', 'tax'];
    const fmt = (n) => '$' + Math.round(n).toLocaleString();
    function calc() {
      const p = Number(prodRev.value) || 0;
      const s = Number(svcRev.value) || 0;
      const e = Number(exp.value) || 0;
      const t = (Number(tax.value) || 0) / 100;
      const net = Math.max(0, p + s - e);
      const monthlyTax = net * t;
      const takeHome = net - monthlyTax;
      netOut.textContent = fmt(net);
      qTaxOut.textContent = fmt(monthlyTax * 3);
      takeHomeOut.textContent = fmt(takeHome);
      annualOut.textContent = fmt(takeHome * 12);
    }
    ids.forEach(id => document.getElementById(id).addEventListener('input', calc));
    calc();
  </script>
</body>
</html>`
  );
}
