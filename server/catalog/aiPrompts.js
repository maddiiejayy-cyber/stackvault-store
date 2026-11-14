export const AI_PROMPTS_LIST = [
  // Copywriting & Marketing (15)
  { id: 'OP-001', category: 'Copywriting', title: '5-Second Hero Clarity Rewrite', model: 'Claude / GPT-4o', prompt: 'Analyze {{current_hero_copy}} for {{product_name}} targeting {{icp}}. Identify friction in clarity, specificity, and urgency. Output 3 Hero Headline + Subheadline + Primary CTA combinations using: (1) Outcome + Timeframe, (2) Pain Elimination, (3) Metric Proof.' },
  { id: 'OP-002', category: 'Copywriting', title: 'Objection-Crushing FAQ Generator', model: 'Claude / GPT-4o', prompt: 'List the top 7 buyer objections preventing {{icp}} from purchasing {{offer}} at {{price}}. For each objection, write a concise 2-3 sentence FAQ answer that reframes risk using concrete proof or guarantees.' },
  { id: 'OP-003', category: 'Copywriting', title: 'AIDA Launch Email Writer', model: 'Claude / GPT-4o', prompt: 'Write a 220-word launch email for {{product_name}} using Attention-Interest-Desire-Action. Open with a relatable mistake {{icp}} makes, introduce the solution in 2 sentences, show 3 bulleted outcomes, and close with a single clear CTA.' },
  { id: 'OP-004', category: 'Copywriting', title: 'Case Study Story Arc Builder', model: 'Claude / GPT-4o', prompt: 'Turn these raw customer notes: {{notes}} into a 400-word conversion case study structured as: Before State, Turning Point, Implementation, Measurable After State, and Pull Quote.' },
  { id: 'OP-005', category: 'Copywriting', title: 'Meta & TikTok Ad Hook Matrix', model: 'GPT-4o', prompt: 'Generate 12 scroll-stopping 3-second video ad hooks for {{product}} across 4 angles: Contrarian, Curiosity Gap, Direct Callout, and Before/After Transformation.' },
  { id: 'OP-006', category: 'Copywriting', title: 'Pricing Tier Anchor Copy', model: 'Claude', prompt: 'Write names, 1-line positioning statements, and 5 feature bullets for 3 pricing tiers (Starter, Pro, Team) for {{product}} so the middle Pro tier feels like the obvious highest-value choice.' },
  { id: 'OP-007', category: 'Copywriting', title: 'High-Retention X/LinkedIn Thread', model: 'Claude', prompt: 'Convert {{topic_or_article}} into an 8-post social thread. Post 1 must deliver a concrete metric or contrarian insight. Posts 2-7 use 1 clear takeaway + 1 tactical example each. Post 8 summarizes and invites discussion.' },
  { id: 'OP-008', category: 'Copywriting', title: 'Cart Abandonment Recovery Email', model: 'GPT-4o', prompt: 'Write a 3-email cart recovery sequence (1hr, 24hr, 72hr) for {{product}} at {{price}}. Tone: helpful founder, zero sleazy urgency. Include a FAQ check in Email 2 and a limited bonus in Email 3.' },
  { id: 'OP-009', category: 'Copywriting', title: 'Product Hunt Launch Kit Copy', model: 'Claude', prompt: 'Create a complete Product Hunt listing for {{product}}: 60-char tagline, 260-char description, maker first comment (story + what problem it solves + special community offer), and 3 gallery slide captions.' },
  { id: 'OP-010', category: 'Copywriting', title: 'Landing Page Tear-Down Audit', model: 'Claude', prompt: 'Act as a CRO specialist. Audit {{landing_page_text}} across 6 criteria: Value Prop Clarity, Visual Hierarchy, Social Proof Placement, Offer Framing, Risk Reversal, and CTA Friction. Score each 1-10 with exact rewrite suggestions.' },
  { id: 'OP-011', category: 'Copywriting', title: 'Lead Magnet Title Optimizer', model: 'GPT-4o', prompt: 'Brainstorm 15 irresistible lead magnet titles for {{niche}} using formats: Cheat Sheet, Swipe File, Calculator, 5-Minute Audit, and Blueprint. Avoid generic words like "Ultimate Guide".' },
  { id: 'OP-012', category: 'Copywriting', title: 'YouTube CTR Title & Thumbnail Brief', model: 'GPT-4o', prompt: 'For video topic {{topic}}, write 10 high-CTR YouTube titles under 55 characters paired with concise 3-word thumbnail text overlays and visual composition ideas.' },
  { id: 'OP-013', category: 'Copywriting', title: 'SaaS Onboarding Welcome Email', model: 'Claude', prompt: 'Write a Day-0 welcome email for new buyers of {{product}}. Goal: get them to their first quick win in under 5 minutes. Include 3 numbered steps and a reply-back prompt.' },
  { id: 'OP-014', category: 'Copywriting', title: 'Testimonial Request Script', model: 'GPT-4o', prompt: 'Write a short 3-question customer check-in email sent 7 days after purchasing {{product}} designed to naturally elicit specific, quotable before/after testimonials.' },
  { id: 'OP-015', category: 'Copywriting', title: 'Brand Voice Style Guide Extractor', model: 'Claude', prompt: 'Analyze these 3 writing samples: {{samples}}. Extract a concise Brand Voice Guide covering: Tone Attributes, Sentence Rhythm, Forbidden Clichés, Vocabulary Rules, and 3 Do/Don’t examples.' },

  // Engineering & Dev (15)
  { id: 'OP-016', category: 'Engineering', title: 'Full-Stack Security & Auth Audit', model: 'Claude / o1', prompt: 'Review the following backend routes and middleware: {{code}}. Identify vulnerabilities (IDOR, injection, missing auth checks, secret exposure, rate-limit gaps) ranked by Critical/High/Medium with patched code.' },
  { id: 'OP-017', category: 'Engineering', title: 'SQL Query & Index Optimizer', model: 'Claude / GPT-4o', prompt: 'Analyze this slow SQL query and table schema: {{sql_and_schema}}. Explain the bottleneck (full table scan, N+1, bad join order), propose exact composite indexes, and rewrite the query.' },
  { id: 'OP-018', category: 'Engineering', title: 'React Component Performance Refactor', model: 'Claude', prompt: 'Inspect this React component: {{component_code}}. Eliminate unnecessary re-renders, extract clean custom hooks, fix stale closure risks, and ensure accessible keyboard/ARIA support.' },
  { id: 'OP-019', category: 'Engineering', title: 'Zero-Downtime DB Migration Plan', model: 'Claude / o1', prompt: 'Design an expand-and-contract zero-downtime database migration plan to change {{schema_change}} on a live production table with 10M+ rows. Include rollback steps.' },
  { id: 'OP-020', category: 'Engineering', title: 'API Contract & OpenAPI Spec Builder', model: 'GPT-4o', prompt: 'Generate a clean REST API specification (endpoints, request bodies, status codes, error payloads, pagination format) for {{feature_description}} in OpenAPI 3.1 YAML.' },
  { id: 'OP-021', category: 'Engineering', title: 'Edge-Case Unit Test Suite Generator', model: 'Claude', prompt: 'Write comprehensive unit tests (happy path, boundary values, malformed inputs, concurrency/async failures) for {{function_code}} using Vitest/Jest without brittle mocks.' },
  { id: 'OP-022', category: 'Engineering', title: 'Stripe Webhook Idempotency Reviewer', model: 'Claude', prompt: 'Review this Stripe webhook handler: {{webhook_code}}. Verify signature checking, raw body parsing, idempotent event deduplication, and failure retry handling.' },
  { id: 'OP-023', category: 'Engineering', title: 'Root-Cause Stack Trace Debugger', model: 'Claude / o1', prompt: 'Given error log {{error_log}} and context {{file_snippet}}, list the top 3 probable root causes ordered by likelihood, the fastest diagnostic command to confirm each, and the minimal fix.' },
  { id: 'OP-024', category: 'Engineering', title: 'Dockerfile Production Hardener', model: 'GPT-4o', prompt: 'Optimize this Dockerfile: {{dockerfile}} using multi-stage builds, non-root user, minimal base image, proper layer caching for package-lock.json, and healthcheck.' },
  { id: 'OP-025', category: 'Engineering', title: 'TypeScript Strict Typing Converter', model: 'Claude', prompt: 'Convert this JavaScript module {{js_code}} into strict TypeScript with discriminated unions, explicit return types, and Zod runtime validation at boundaries.' },
  { id: 'OP-026', category: 'Engineering', title: 'Regex Builder & Plain-English Explainer', model: 'GPT-4o', prompt: 'Write a safe, non-backtracking regex for {{pattern_requirement}}. Provide 5 passing test strings, 5 failing test strings, and a token-by-token explanation.' },
  { id: 'OP-027', category: 'Engineering', title: 'PR Diff Reviewer Checklist', model: 'Claude', prompt: 'Review this git diff: {{diff}}. Flag subtle bugs, missing error handling, breaking API changes, and readability improvements. Keep feedback concise and actionable.' },
  { id: 'OP-028', category: 'Engineering', title: 'Tailwind Responsive Layout Fixer', model: 'GPT-4o', prompt: 'Diagnose why this Tailwind layout overflows or misaligns on mobile (<640px): {{jsx_snippet}}. Provide the corrected responsive classes using mobile-first breakpoints.' },
  { id: 'OP-029', category: 'Engineering', title: 'Technical Architecture Decision Record', model: 'Claude', prompt: 'Write an ADR (Architecture Decision Record) comparing {{option_a}} vs {{option_b}} for {{system_context}}. Cover: Context, Decision, Trade-offs, Cost at 10x scale, and Reversibility.' },
  { id: 'OP-030', category: 'Engineering', title: 'CLI Tool Documentation Writer', model: 'GPT-4o', prompt: 'Turn this source code {{cli_code}} into a crisp README.md with Installation, Quick Start, Flags table, Exit Codes, and 3 real-world usage examples.' },

  // Sales & Outbound (10)
  { id: 'OP-031', category: 'Sales', title: 'Hyper-Personalized Cold Email (3 Sentences)', model: 'Claude', prompt: 'Using prospect context {{company_news_or_bio}}, write a 3-sentence cold email pitching {{offer}}. Sentence 1: specific observation. Sentence 2: relevant problem + proof. Sentence 3: low-friction interest check.' },
  { id: 'OP-032', category: 'Sales', title: 'Discovery Call Question Bank', model: 'GPT-4o', prompt: 'Generate 10 SPIN-style discovery call questions for selling {{service_or_product}} to {{buyer_role}} to uncover budget, urgency, current workflow cost, and decision criteria.' },
  { id: 'OP-033', category: 'Sales', title: 'Proposal Executive Summary Generator', model: 'Claude', prompt: 'Turn these discovery call notes {{notes}} into a 1-page proposal executive summary: Prospect Goals, Cost of Inaction, Proposed Scope, Timeline, Investment, and Next Step.' },
  { id: 'OP-034', category: 'Sales', title: 'No-Ghosting Follow-Up Sequence', model: 'GPT-4o', prompt: 'Write 4 polite, value-add follow-up messages (Day 3, Day 7, Day 14, Breakup Day 25) after sending a proposal for {{offer}} with zero "just checking in" phrasing.' },
  { id: 'OP-035', category: 'Sales', title: 'Price Objection Reframe Scripts', model: 'Claude', prompt: 'Write 5 calm, confident responses when a prospect says "{{offer}} is too expensive" by anchoring against ROI, time saved, and phased starter options.' },
  { id: 'OP-036', category: 'Sales', title: 'LinkedIn DM Warm Outreach Opener', model: 'GPT-4o', prompt: 'Draft 5 natural LinkedIn DM openers for people who liked or commented on a post about {{topic}}. No instant pitch—focus on starting a relevant conversation.' },
  { id: 'OP-037', category: 'Sales', title: 'B2B Battlecard Competitor Matrix', model: 'Claude', prompt: 'Create a sales battlecard comparing our product {{our_product}} against {{competitor}}. Include: Where We Win, Where They Win, Trap-Setting Questions, and Switcher Proof Points.' },
  { id: 'OP-038', category: 'Sales', title: 'Partnership & Affiliate Pitch Email', model: 'GPT-4o', prompt: 'Write an outreach email inviting {{creator_or_newsletter}} to promote {{digital_product}} for a {{commission_pct}}% recurring/per-sale commission. Highlight audience fit and pre-made swipe assets.' },
  { id: 'OP-039', category: 'Sales', title: 'Renewal & Expansion Upsell Script', model: 'Claude', prompt: 'Draft a QBR check-in email for an existing customer who got {{result}} using {{product}}, smoothly introducing an upgrade to {{higher_tier}}.' },
  { id: 'OP-040', category: 'Sales', title: 'Demo Call Agenda & Closing Script', model: 'GPT-4o', prompt: 'Outline a tight 20-minute product demo script: 3-min agenda & pain confirm, 12-min tailored workflow walkthrough (benefits first), 5-min pricing & next-step lock.' },

  // Growth, SEO & Product Strategy (10)
  { id: 'OP-041', category: 'Growth', title: 'SEO Topic Cluster & Intent Map', model: 'Claude', prompt: 'Build a 15-article SEO content cluster around core topic {{pillar_topic}} for {{audience}}. For each piece, specify: Target Keyword, Search Intent (BOFU/MOFU/TOFU), Working Title, and Internal Link Target.' },
  { id: 'OP-042', category: 'Growth', title: 'Programmatic SEO Page Blueprint', model: 'GPT-4o', prompt: 'Design a programmatic SEO template for "[Tool A] vs [Tool B]" or "Best [Niche] Templates for [Use Case]". Specify unique data fields required so pages avoid thin-content penalties.' },
  { id: 'OP-043', category: 'Growth', title: '72-Hour Digital Product Validation Plan', model: 'Claude', prompt: 'Create a 72-hour validation sprint for product idea {{idea}} without writing full code or building the full asset. Include landing page test, pre-order offer, and 3 traffic channels.' },
  { id: 'OP-044', category: 'Growth', title: 'Customer Churn Survey & Win-Back Flow', model: 'GPT-4o', prompt: 'Write a 3-question cancellation exit survey and tailored automated save offers for the top 3 churn reasons (Too Expensive, Missing Feature, Not Using Enough).' },
  { id: 'OP-045', category: 'Growth', title: 'Viral Referral Loop Designer', model: 'Claude', prompt: 'Design a two-sided referral program for {{product}} (digital product or SaaS). Specify reward structure, share trigger moment, pre-written share message, and fraud prevention checks.' },
  { id: 'OP-046', category: 'Growth', title: 'Competitor Review Mining Prompt', model: 'Claude', prompt: 'Analyze these 1-star to 3-star competitor reviews: {{reviews_text}}. Extract: Top 5 Unmet Pain Points, Exact Customer Phrases to mirror in ads, and 3 Quick-Win Product Differentiators.' },
  { id: 'OP-047', category: 'Growth', title: 'Newsletter Sponsorship Media Kit', model: 'GPT-4o', prompt: 'Draft the copy for a 1-page newsletter media kit for {{newsletter_name}} ({{subs}} subscribers, {{open_rate}}% open rate). Include audience demographics, ad slots, and package pricing.' },
  { id: 'OP-048', category: 'Growth', title: 'Free Tool / Mini-App Lead Magnet Ideator', model: 'Claude', prompt: 'Propose 5 simple single-page web calculators or generators that {{icp}} would bookmark and share, each naturally leading into paid product {{paid_offer}}.' },
  { id: 'OP-049', category: 'Growth', title: 'Pricing Elasticity & Bundle Simulator', model: 'GPT-4o', prompt: 'Given current products {{product_list}}, design 2 high-margin bundles and 1 order-bump offer ($9-$19) to increase average order value by 25%+.' },
  { id: 'OP-050', category: 'Growth', title: 'Quarterly Growth Experiment Backlog', model: 'Claude', prompt: 'Generate 12 growth experiments for {{business}} scored by ICE (Impact, Confidence, Ease 1-10), covering Acquisition, Activation, Monetization, and Retention.' },

  // Operations, Research & Productivity (10)
  { id: 'OP-051', category: 'Operations', title: 'SOP Documentation Generator', model: 'Claude', prompt: 'Turn this messy Loom transcript or bullet list {{process_notes}} into a clean, repeatable Standard Operating Procedure with: Trigger, Owner, Tools Required, Numbered Steps, and Quality Check.' },
  { id: 'OP-052', category: 'Operations', title: 'Weekly CEO Review & Priority Filter', model: 'GPT-4o', prompt: 'Review my task list {{tasks}} and revenue goals {{goals}}. Categorize tasks into: High-Leverage Revenue (Do First), Delegate/Automate, and Delete/Defer. Output a focused 5-day schedule.' },
  { id: 'OP-053', category: 'Operations', title: 'Meeting Notes to Action Matrix', model: 'Claude', prompt: 'Extract from this meeting transcript {{transcript}}: (1) Key Decisions Made, (2) Action Items table [Owner | Task | Deadline], (3) Open Questions needing follow-up.' },
  { id: 'OP-054', category: 'Operations', title: 'Vendor & SaaS Stack Cost Auditor', model: 'GPT-4o', prompt: 'Audit this list of software subscriptions {{tools_and_prices}}. Flag overlapping tools, suggest cheaper or self-hosted alternatives, and estimate annual savings.' },
  { id: 'OP-055', category: 'Operations', title: 'Contractor Onboarding Brief', model: 'Claude', prompt: 'Create a 1-page freelancer/contractor onboarding brief for {{role}} covering: Project Goal, Definition of Done, Communication Cadence, File Naming Rules, and Access Checklist.' },
  { id: 'OP-056', category: 'Operations', title: 'Deep Market Research Synthesizer', model: 'Claude', prompt: 'Synthesize these research notes/articles {{sources}} into an executive brief: Market Size & Trends, Key Buyer Triggers, Emerging Threats, and 3 Strategic Recommendations.' },
  { id: 'OP-057', category: 'Operations', title: 'Customer Support Macro Library', model: 'GPT-4o', prompt: 'Write 8 empathetic, concise customer support canned responses for a digital product store: Download Link Missing, License Reset, Refund Request, Upgrade/Bundle Credit, Invoice/VAT Receipt, Bug Report.' },
  { id: 'OP-058', category: 'Operations', title: '90-Day Product Roadmap Builder', model: 'Claude', prompt: 'Organize these feature ideas {{ideas}} into a 90-day Now / Next / Later roadmap weighted by customer revenue impact and engineering effort.' },
  { id: 'OP-059', category: 'Operations', title: 'Financial Runway & Scenario Modeler', model: 'GPT-4o', prompt: 'Given monthly burn {{burn}}, cash on hand {{cash}}, and MRR {{mrr}} growing at {{growth_pct}}%/mo, calculate Base, Conservative, and Bull 12-month cash trajectories.' },
  { id: 'OP-060', category: 'Operations', title: 'Personal Knowledge PARA Tagger', model: 'Claude', prompt: 'Take these raw notes {{notes}} and classify each into PARA (Project, Area, Resource, Archive) with 3 standardized tags and a 1-sentence actionable summary.' }
];

export function buildAiPromptsFiles(root, product, licenseKey) {
  root.file(
    '01_Operator_Prompts_Master.json',
    JSON.stringify(
      {
        product: product.title,
        version: '2.5.0',
        totalPrompts: AI_PROMPTS_LIST.length,
        licenseKey,
        categories: ['Copywriting', 'Engineering', 'Sales', 'Growth', 'Operations'],
        prompts: AI_PROMPTS_LIST
      },
      null,
      2
    )
  );

  const copyPrompts = AI_PROMPTS_LIST.filter((p) => p.category === 'Copywriting');
  root.file(
    '02_Copywriting_and_Conversion_Prompts.md',
    `# Copywriting & Conversion Prompts (${copyPrompts.length} Prompts)\n\nReplace \`{{variables}}\` inside double curly braces before running in Claude, ChatGPT, or Gemini.\n\n` +
      copyPrompts
        .map((p) => `## ${p.id}: ${p.title}\n- **Recommended Model:** ${p.model}\n\n\`\`\`text\n${p.prompt}\n\`\`\`\n`)
        .join('\n')
  );

  const engPrompts = AI_PROMPTS_LIST.filter((p) => p.category === 'Engineering');
  root.file(
    '03_Engineering_and_Debug_Prompts.md',
    `# Engineering, Security & Architecture Prompts (${engPrompts.length} Prompts)\n\n` +
      engPrompts
        .map((p) => `## ${p.id}: ${p.title}\n- **Recommended Model:** ${p.model}\n\n\`\`\`text\n${p.prompt}\n\`\`\`\n`)
        .join('\n')
  );

  const csvRows = [
    ['ID', 'Category', 'Title', 'Recommended Model', 'Prompt'],
    ...AI_PROMPTS_LIST.map((p) => [
      p.id,
      p.category,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.model.replace(/"/g, '""')}"`,
      `"${p.prompt.replace(/"/g, '""')}"`
    ])
  ];
  root.file('04_Notion_CSV_Import.csv', csvRows.map((r) => r.join(',')).join('\n'));
}
