const WORKFLOWS = [
  {
    filename: '01_stripe_purchase_license_fulfillment.json',
    data: {
      name: '01 - Stripe Purchase to License Key & Delivery Email',
      nodes: [
        { id: '1', name: 'Stripe Webhook', type: 'n8n-nodes-base.stripeTrigger', parameters: { events: ['checkout.session.completed'] }, position: [200, 300] },
        { id: '2', name: 'Generate License Key', type: 'n8n-nodes-base.code', parameters: { jsCode: "const block = () => Math.random().toString(36).substring(2,6).toUpperCase();\nreturn [{ json: { ...$json, licenseKey: `SV-${block()}-${block()}-${block()}` } }];" }, position: [440, 300] },
        { id: '3', name: 'Upsert Customer in Notion', type: 'n8n-nodes-base.notion', parameters: { operation: 'create', databaseId: '{{NOTION_CUSTOMERS_DB_ID}}' }, position: [680, 220] },
        { id: '4', name: 'Send Delivery Email', type: 'n8n-nodes-base.emailSend', parameters: { toEmail: '={{$json.customer_email}}', subject: 'Your Digital Product & License Key', text: 'License: {{$json.licenseKey}}' }, position: [680, 380] }
      ],
      connections: { 'Stripe Webhook': { main: [[{ node: 'Generate License Key', type: 'main', index: 0 }]] }, 'Generate License Key': { main: [[{ node: 'Upsert Customer in Notion', type: 'main', index: 0 }, { node: 'Send Delivery Email', type: 'main', index: 0 }]] } }
    }
  },
  {
    filename: '02_ai_lead_enrichment_and_scoring.json',
    data: {
      name: '02 - Inbound Lead AI Enrichment & Slack Alert',
      nodes: [
        { id: '1', name: 'Inbound Lead Webhook', type: 'n8n-nodes-base.webhook', parameters: { path: 'inbound-lead', httpMethod: 'POST' }, position: [200, 300] },
        { id: '2', name: 'Score Fit with LLM', type: 'n8n-nodes-base.httpRequest', parameters: { method: 'POST', url: 'https://api.openai.com/v1/chat/completions', body: { model: 'gpt-4o-mini', messages: [{ role: 'user', content: 'Score ICP fit 1-10 for: {{$json.company}} {{$json.role}}' }] } }, position: [450, 300] },
        { id: '3', name: 'If Score >= 7', type: 'n8n-nodes-base.if', parameters: { conditions: { number: [{ value1: '={{$json.score}}', operation: 'largerEqual', value2: 7 }] } }, position: [680, 300] },
        { id: '4', name: 'Notify Sales Slack', type: 'n8n-nodes-base.slack', parameters: { channel: '#hot-leads', text: 'High-fit lead: {{$json.email}} (Score: {{$json.score}})' }, position: [920, 240] }
      ]
    }
  },
  {
    filename: '03_content_repurposer_blog_to_social.json',
    data: {
      name: '03 - Blog Post to X Thread + LinkedIn Carousel Draft',
      nodes: [
        { id: '1', name: 'RSS Feed Trigger', type: 'n8n-nodes-base.rssFeedReadTrigger', parameters: { pollTimes: { item: [{ mode: 'everyHour' }] }, feedUrl: '{{YOUR_BLOG_RSS_URL}}' }, position: [200, 300] },
        { id: '2', name: 'Generate Social Variants', type: 'n8n-nodes-base.httpRequest', parameters: { method: 'POST', url: 'https://api.anthropic.com/v1/messages', body: { model: 'claude-3-5-sonnet-latest', max_tokens: 1200 } }, position: [460, 300] },
        { id: '3', name: 'Save Drafts to Notion', type: 'n8n-nodes-base.notion', parameters: { operation: 'create', databaseId: '{{NOTION_CONTENT_DB_ID}}' }, position: [720, 300] }
      ]
    }
  },
  {
    filename: '04_abandoned_cart_recovery_sequence.json',
    data: {
      name: '04 - Automated Cart Abandonment 24h Recovery',
      nodes: [
        { id: '1', name: 'Checkout Expired Trigger', type: 'n8n-nodes-base.stripeTrigger', parameters: { events: ['checkout.session.expired'] }, position: [200, 300] },
        { id: '2', name: 'Wait 2 Hours', type: 'n8n-nodes-base.wait', parameters: { amount: 2, unit: 'hours' }, position: [420, 300] },
        { id: '3', name: 'Send 15% Recovery Code', type: 'n8n-nodes-base.emailSend', parameters: { toEmail: '={{$json.customer_details.email}}', subject: 'Forgot something? Use BUNDLE15 for 15% off' }, position: [660, 300] }
      ]
    }
  },
  {
    filename: '05_support_ticket_ai_triage.json',
    data: {
      name: '05 - Support Email AI Triage & Draft Reply',
      nodes: [
        { id: '1', name: 'IMAP Support Trigger', type: 'n8n-nodes-base.emailReadImap', position: [200, 300] },
        { id: '2', name: 'Classify Ticket Intent', type: 'n8n-nodes-base.code', parameters: { jsCode: "// Classify: license_reset, download_issue, refund, billing\nreturn items;" }, position: [440, 300] },
        { id: '3', name: 'Create Draft in Helpdesk', type: 'n8n-nodes-base.httpRequest', parameters: { method: 'POST', url: '{{HELPDESK_API_URL}}/drafts' }, position: [680, 300] }
      ]
    }
  },
  {
    filename: '06_weekly_kpi_slack_digest.json',
    data: {
      name: '06 - Weekly Store Revenue & KPI Slack Digest',
      nodes: [
        { id: '1', name: 'Every Monday 9AM', type: 'n8n-nodes-base.cron', parameters: { triggerTimes: { item: [{ mode: 'everyWeek', weekday: '1', hour: 9 }] } }, position: [200, 300] },
        { id: '2', name: 'Fetch Store Stats', type: 'n8n-nodes-base.httpRequest', parameters: { method: 'GET', url: '{{YOUR_STORE_URL}}/api/admin/stats' }, position: [440, 300] },
        { id: '3', name: 'Post Slack Digest', type: 'n8n-nodes-base.slack', parameters: { channel: '#metrics', text: 'Weekly Revenue: ${{$json.totalRevenue}} | Orders: {{$json.totalOrders}}' }, position: [680, 300] }
      ]
    }
  },
  {
    filename: '07_notion_crm_auto_onboarding.json',
    data: {
      name: '07 - Client Signed Contract to Notion Portal Setup',
      nodes: [
        { id: '1', name: 'Contract Signed Webhook', type: 'n8n-nodes-base.webhook', parameters: { path: 'contract-signed' }, position: [200, 300] },
        { id: '2', name: 'Create Client Portal Page', type: 'n8n-nodes-base.notion', parameters: { operation: 'create', databaseId: '{{NOTION_CLIENTS_DB}}' }, position: [440, 300] },
        { id: '3', name: 'Create Slack Channel', type: 'n8n-nodes-base.slack', parameters: { resource: 'channel', operation: 'create', name: 'client-{{$json.slug}}' }, position: [680, 300] }
      ]
    }
  },
  {
    filename: '08_testimonial_collector_and_publisher.json',
    data: {
      name: '08 - Day-7 Buyer Check-In & Testimonial Collector',
      nodes: [
        { id: '1', name: 'Daily Check Schedule', type: 'n8n-nodes-base.cron', position: [200, 300] },
        { id: '2', name: 'Query 7-Day-Old Orders', type: 'n8n-nodes-base.httpRequest', parameters: { url: '{{YOUR_STORE_URL}}/api/orders' }, position: [440, 300] },
        { id: '3', name: 'Send Feedback Form Link', type: 'n8n-nodes-base.emailSend', parameters: { subject: 'Quick 30-second question about your kit' }, position: [680, 300] }
      ]
    }
  },
  {
    filename: '09_competitor_changelog_monitor.json',
    data: {
      name: '09 - Competitor Pricing & Changelog Monitor',
      nodes: [
        { id: '1', name: 'Every Morning 8AM', type: 'n8n-nodes-base.cron', position: [200, 300] },
        { id: '2', name: 'Fetch Competitor Feed', type: 'n8n-nodes-base.httpRequest', parameters: { url: '{{COMPETITOR_CHANGELOG_URL}}' }, position: [440, 300] },
        { id: '3', name: 'Summarize Changes with AI', type: 'n8n-nodes-base.httpRequest', parameters: { method: 'POST', url: 'https://api.openai.com/v1/chat/completions' }, position: [680, 300] }
      ]
    }
  },
  {
    filename: '10_invoice_overdue_reminder_flow.json',
    data: {
      name: '10 - Automated Politeness-First Invoice Chaser',
      nodes: [
        { id: '1', name: 'Daily 10AM Check', type: 'n8n-nodes-base.cron', position: [200, 300] },
        { id: '2', name: 'Fetch Open Invoices', type: 'n8n-nodes-base.stripe', parameters: { resource: 'invoice', operation: 'getAll', status: 'open' }, position: [440, 300] },
        { id: '3', name: 'Send Gentle Reminder', type: 'n8n-nodes-base.emailSend', parameters: { subject: 'Friendly reminder: Invoice {{$json.number}}' }, position: [680, 300] }
      ]
    }
  }
];

export function buildAutomationFiles(root, product) {
  for (const wf of WORKFLOWS) {
    root.file(`workflows/${wf.filename}`, JSON.stringify(wf.data, null, 2));
  }

  root.file(
    'README_Setup_Guide.md',
    `# ${product.title} — Setup & Import Guide

## Included Workflows (10 Importable JSON Blueprints)
${WORKFLOWS.map((w, i) => `${i + 1}. \`workflows/${w.filename}\` — ${w.data.name}`).join('\n')}

## How to Import into n8n
1. Open your n8n workspace and create a **New Workflow**.
2. Click the **\`...\`** menu (top right) -> **Import from File...**
3. Select any \`.json\` file from the \`workflows/\` folder.
4. Replace placeholder tokens wrapped in \`{{...}}\` (like \`{{NOTION_CUSTOMERS_DB_ID}}\` or \`{{YOUR_STORE_URL}}\`) with your real API credentials.
5. Click **Test Workflow** before toggling **Active**.

## Using with Make.com
Each JSON outlines the exact trigger, data transformation, condition branching, and HTTP/API endpoints so you can mirror the module chain in Make's scenario builder in under 5 minutes.
`
  );
}
