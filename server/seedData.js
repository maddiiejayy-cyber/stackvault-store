export const INITIAL_DATA = {
  products: [
    {
      id: 'prod-ai-vault',
      slug: 'operator-ai-prompt-pack',
      title: 'Operator AI Prompt Pack (60 Production Prompts)',
      tagline: '60 variable-driven prompts for Claude & GPT-4o across Copywriting, Engineering, Sales, Growth & Ops.',
      description:
        'A complete, zero-fluff library of 60 production-tested prompts organized into 5 business categories. Delivered as a searchable Master JSON, dedicated Copywriting & Engineering Markdown playbooks, and a ready-to-import Notion CSV database.',
      category: 'AI & Automation',
      price: 29,
      compareAtPrice: 59,
      badge: 'Bestseller',
      rating: 4.9,
      reviewCount: 412,
      salesCount: 1840,
      image: '/images/ai-vault.png',
      format: 'ZIP • JSON + 2 MD Guides + Notion CSV',
      fileSize: '48 KB (Uncompressed Assets)',
      featured: true,
      active: true,
      createdAt: '2026-09-10T12:00:00.000Z',
      highlights: [
        '60 complete {{variable}}-driven prompts (15 Copywriting, 15 Engineering, 10 Sales, 10 Growth, 10 Ops)',
        'Master JSON library (01_Operator_Prompts_Master.json) ready for apps or scripts',
        'Two deep-dive Markdown manuals for Copywriting & Engineering workflows',
        '1-click importable Notion CSV table (04_Notion_CSV_Import.csv) + commercial license'
      ],
      deliverables: [
        'README.md',
        '01_Operator_Prompts_Master.json',
        '02_Copywriting_and_Conversion_Prompts.md',
        '03_Engineering_and_Debug_Prompts.md',
        '04_Notion_CSV_Import.csv'
      ],
      previewSnippet: {
        title: 'Prompt OP-001 — 5-Second Hero Clarity Rewrite',
        language: 'markdown',
        code: `Analyze {{current_hero_copy}} for {{product_name}} targeting {{icp}}.
Identify friction in clarity, specificity, and urgency.
Output 3 Hero Headline + Subheadline + Primary CTA combinations using:
(1) Outcome + Timeframe
(2) Pain Elimination
(3) Metric Proof.`
      }
    },
    {
      id: 'prod-notion-os',
      slug: 'creator-os-solopreneur-finance-vault',
      title: 'Creator OS & Solopreneur Finance Vault',
      tagline: 'Notion relational schemas, 8 Formula 2.0 snippets, 4 importable CSVs & an offline Tax/Profit Calculator.',
      description:
        'Run your entire digital product and freelance business from one clean system. Includes exact Notion schemas for Goals, Projects, Content, Client CRM, and Revenue Ledger, 4 import-ready CSV starter databases, Formula 2.0 snippets, and an interactive HTML profit & quarterly tax calculator.',
      category: 'Notion Systems',
      price: 34,
      compareAtPrice: 69,
      badge: 'Complete System',
      rating: 4.9,
      reviewCount: 519,
      salesCount: 2310,
      image: '/images/notion-os.png',
      format: 'ZIP • Notion Schemas + 4 CSVs + HTML Tool',
      fileSize: '62 KB (Ready-to-Import)',
      featured: true,
      active: true,
      createdAt: '2026-09-18T12:00:00.000Z',
      highlights: [
        'Full relational Notion blueprints for 5 core databases (Goals, Projects, Content, CRM, Finance)',
        '8 copy-paste Notion Formula 2.0 snippets (progress bars, overdue alerts, 25% tax set-aside)',
        '4 importable CSV files for Notion, Excel, or Google Sheets',
        'Interactive offline HTML Solopreneur Profit & Quarterly Tax Calculator'
      ],
      deliverables: [
        'README.md',
        '01_Creator_OS_Database_Schemas.md',
        '02_Notion_Formula_2_Snippets.md',
        '03_Importable_Databases/ (4 CSVs)',
        '04_Quarterly_Tax_and_Pricing_Calculator.html'
      ],
      previewSnippet: {
        title: 'Included Notion Formula 2.0 — Visual Progress Bar',
        language: 'javascript',
        code: `let(
  pct, min(round((prop("Current Metric") / max(prop("Target Metric"), 1)) * 100), 100),
  filled, round(pct / 10),
  repeat("█", filled) + repeat("░", 10 - filled) + " " + format(pct) + "%"
)`
      }
    },
    {
      id: 'prod-darkforge-ui',
      slug: 'darkforge-saas-ui-kit',
      title: 'DarkForge SaaS UI Kit (12 React + Tailwind Components)',
      tagline: '12 production-ready dark-mode React + Tailwind components, CSS design tokens & HTML showcase.',
      description:
        'Ship sleek dark-mode SaaS interfaces in minutes. DarkForge gives you 12 clean, copy-paste React + Tailwind components (Navbar, Hero, Pricing Table with Annual Toggle, Metric Cards, Command Palette, Data Table, Auth Card, FAQ, Toast & more) plus CSS custom properties.',
      category: 'UI & Design Kits',
      price: 49,
      compareAtPrice: 99,
      badge: 'Pro Kit',
      rating: 4.9,
      reviewCount: 305,
      salesCount: 1120,
      image: '/images/darkforge-ui.png',
      format: 'ZIP • 12 JSX Components + CSS Tokens + HTML',
      fileSize: '54 KB (Clean Source Code)',
      featured: true,
      active: true,
      createdAt: '2026-10-15T12:00:00.000Z',
      highlights: [
        '12 standalone React + Tailwind JSX components ready to drop into any project',
        'Interactive PricingTable with Monthly/Annual toggle & searchable CommandPaletteModal',
        'Obsidian dark design token stylesheet (darkforge-theme.css)',
        'Offline showcase.html preview + unlimited commercial & client usage rights'
      ],
      deliverables: [
        'README.md',
        'tokens/darkforge-theme.css',
        'components/ (12 JSX files)',
        'showcase.html',
        'README_Integration.md'
      ],
      previewSnippet: {
        title: 'Included Design Tokens — DarkForge Obsidian Palette',
        language: 'css',
        code: `:root {
  --df-bg-canvas: #070B14;
  --df-bg-surface: #0F1629;
  --df-bg-elevated: #161F38;
  --df-border-hairline: rgba(255, 255, 255, 0.08);
  --df-accent-indigo: #6366F1;
  --df-accent-cyan: #06B6D4;
}`
      }
    },
    {
      id: 'prod-launch-playbook',
      slug: 'digital-product-launch-playbook-saas-kit',
      title: 'Digital Product Launch Playbook & Micro-SaaS Kit',
      tagline: '6-chapter Launch Playbook, 7-Day Email Sequence, Revenue Simulator & runnable Node/Stripe starter.',
      description:
        'Everything needed to validate, price, launch, and accept real Stripe payments for your digital product. Includes a complete 6-chapter Playbook, 7 copy-paste launch emails, an interactive browser Revenue & Order-Bump Simulator, and a working Node.js + Express + Stripe Webhook starter codebase.',
      category: 'Courses & Playbooks',
      price: 39,
      compareAtPrice: 89,
      badge: 'Developer + Creator',
      rating: 4.9,
      reviewCount: 374,
      salesCount: 1625,
      image: '/images/launch-playbook.png',
      format: 'ZIP • Playbook + Emails + HTML + Node/Stripe Code',
      fileSize: '76 KB (Docs + Starter Repo)',
      featured: true,
      active: true,
      createdAt: '2026-10-20T12:00:00.000Z',
      highlights: [
        '6-chapter Playbook covering 72-Hour MVP validation, 3-Tier Pricing & Traffic Loops',
        'Complete 7-Day Launch Email Sequence (Day 1 Teaser through Day 7 Final Hours)',
        'Interactive HTML Revenue, Conversion & Order-Bump Simulator',
        'Runnable Node/Express + Stripe Checkout & Webhook License Starter Kit'
      ],
      deliverables: [
        'README.md',
        '01_Complete_Launch_Playbook.md',
        '02_7_Day_Launch_Email_Sequence.md',
        '03_Revenue_and_Pricing_Simulator.html',
        '04_Starter_Micro_SaaS/ (Node + Stripe)'
      ],
      previewSnippet: {
        title: 'Included Stripe Webhook Fulfillment Handler (server.js)',
        language: 'javascript',
        code: `if (event.type === 'checkout.session.completed') {
  const session = event.data.object;
  const licenseKey = createLicenseKey('PRO');
  orders.set(session.id, {
    email: session.customer_details?.email,
    licenseKey,
    paid: true
  });
}`
      }
    }
  ],
  promoCodes: [
    { code: 'LAUNCH20', discountPercent: 20, label: '20% Launch Offer', active: true },
    { code: 'VIP50', discountPercent: 50, label: '50% VIP Creator Pass', active: true },
    { code: 'BUNDLE15', discountPercent: 15, label: '15% Bundle Discount', active: true }
  ],
  orders: [
    {
      id: 'ORD-84921',
      customerName: 'Alex Rivera',
      customerEmail: 'alex@demo-creator.io',
      items: [
        {
          productId: 'prod-ai-vault',
          title: 'Operator AI Prompt Pack (60 Production Prompts)',
          price: 29,
          licenseKey: 'SV-AIVT-9482-X7K1'
        },
        {
          productId: 'prod-notion-os',
          title: 'Creator OS & Solopreneur Finance Vault',
          price: 34,
          licenseKey: 'SV-NTOS-3319-M4P2'
        }
      ],
      subtotal: 63,
      discountCode: 'LAUNCH20',
      discountAmount: 12.6,
      total: 50.4,
      paymentMethod: 'Card (Demo)',
      status: 'completed',
      createdAt: '2026-11-11T16:40:00.000Z'
    },
    {
      id: 'ORD-84922',
      customerName: 'Maya Chen',
      customerEmail: 'maya@studio-labs.dev',
      items: [
        {
          productId: 'prod-darkforge-ui',
          title: 'DarkForge SaaS UI Kit (12 React + Tailwind Components)',
          price: 49,
          licenseKey: 'SV-DFUI-7721-Q9R5'
        }
      ],
      subtotal: 49,
      discountCode: null,
      discountAmount: 0,
      total: 49,
      paymentMethod: 'Apple Pay (Demo)',
      status: 'completed',
      createdAt: '2026-11-12T10:15:00.000Z'
    }
  ],
  subscribers: []
};
