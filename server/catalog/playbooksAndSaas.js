export function buildPlaybookAndSaasFiles(root, product, licenseKey) {
  root.file(
    '01_Complete_Launch_Playbook.md',
    `# The Digital Product Launch Playbook & Micro-SaaS Guide

**License Key:** \`${licenseKey}\`

---

## Chapter 1: Picking High-Demand Digital Niches
High-converting digital products solve **urgent, quantifiable workflow bottlenecks**:
1. **Time Compression:** AI prompt packs, n8n workflows, UI kits (save 10–50 hours).
2. **Revenue / Career Leverage:** Sales scripts, launch playbooks, client CRM templates.
3. **Pain Removal:** Tax/finance trackers, compliance checklists, starter codebases.

**Validation Rule:** Never build a product for more than 72 hours without confirming buyers already spend money on adjacent tools or courses in that niche.

---

## Chapter 2: The 72-Hour MVP Build Sprint
- **Hours 1–8:** Define the exact deliverable list (e.g., 50 prompts, 10 templates, or 12 components). Write the sales page headline *first* so the product stays tightly scoped.
- **Hours 9–48:** Build the core asset. Focus on clarity, clean formatting, and an immediate "first 5 minutes" quick-start guide.
- **Hours 49–64:** Package into a clean \`.zip\` with \`README.md\`, screenshots, and a live preview snippet.
- **Hours 65–72:** Set up checkout, test a $0 or 100%-off promo transaction end-to-end, and publish.

---

## Chapter 3: Pricing Psychology & The 3-Tier Value Ladder
- **Tier 1 ($19 – $39) — Impulse Starter:** Low friction, solves one specific pain (e.g., Prompt Pack, Social Kit).
- **Tier 2 ($49 – $99) — Flagship System:** Complete toolkit + bonus calculators/templates (highest volume + margin).
- **Tier 3 ($149+) — Bundle / Commercial Team License:** Combine 3+ assets at 25–35% off to lift Average Order Value (AOV).

---

## Chapter 4: High-Converting Storefront Anatomy
1. **Above-the-Fold Clarity:** State *what it is*, *who it’s for*, and *what format it comes in* within 5 seconds.
2. **Live Preview Inside the Product:** Show 1 real sample prompt, component, or database schema before checkout—trust jumps dramatically when buyers can inspect quality.
3. **Promo Anchor + Urgency:** Use a clean launch promo (\`LAUNCH20\`) and show compare-at pricing honestly.

---

## Chapter 5: Traffic Engines Without Paid Ads
- **Build-in-Public Breakdowns (X / LinkedIn):** Share a visual tear-down of one piece inside your product and link the full kit below.
- **Free Mini-Tool Lead Magnets:** Give away a single interactive HTML calculator or 10 free prompts via email capture, then pitch your flagship kit on the thank-you page.
- **Affiliate Partners:** Offer 30–40% commission to newsletter writers in your niche.

---

## Chapter 6: Post-Purchase Retention & Upsells
Every buyer is 5x more likely to buy again than a cold visitor. Include a \`README.md\` inside every download with:
1. Immediate quick-start instructions.
2. A link to your library / support email.
3. A 20% loyalty code for your flagship bundle.
`
  );

  root.file(
    '02_7_Day_Launch_Email_Sequence.md',
    `# 7-Day Digital Product Launch Email Sequence

Replace \`[Bracketed Placeholders]\` with your product specifics.

---

### Day 1 — The Pain & Teaser
**Subject:** The annoying bottleneck I finally fixed
**Body:**
Hey [First Name],
Over the past few months I kept losing hours doing [Manual Painful Task] from scratch.
So I packaged my exact system into a clean, copy-paste kit: **[Product Name]**.
I'm opening early access on [Launch Day] with a 20% launch code. Reply "IN" if you want early access before it goes public.
— [Your Name]

---

### Day 2 — Launch Day (Doors Open)
**Subject:** [Product Name] is live (20% off with LAUNCH20)
**Body:**
It's officially live.
Inside **[Product Name]**, you get:
- [Deliverable 1]
- [Deliverable 2]
- [Deliverable 3]
Instant .ZIP download + commercial license included.
Grab it here with code **LAUNCH20** for 20% off: [Checkout Link]

---

### Day 3 — Inside Look (Show, Don't Tell)
**Subject:** Quick peek inside [Product Name]
**Body:**
Instead of just telling you what's in **[Product Name]**, here's an exact excerpt you can use today:
[Paste 1 high-value prompt, checklist, or template snippet]
Get the entire kit here (LAUNCH20 still active): [Checkout Link]

---

### Day 4 — Use Case / Transformation Story
**Subject:** From 6 hours of setup to 15 minutes
**Body:**
[Describe specific before/after workflow using your digital product].
If you want to skip the trial-and-error and start from a proven baseline, **[Product Name]** is ready for instant download: [Checkout Link]

---

### Day 5 — FAQ & Objection Busting
**Subject:** "Will this work for me?" (3 quick answers)
**Body:**
A few buyers asked:
1. *What format are the files?* -> Instant .ZIP with Markdown, JSON, and CSV/HTML—no locked proprietary software required.
2. *Can I use this for client projects?* -> Yes, commercial rights are included.
3. *Do I get future updates?* -> Yes, lifetime updates are included at no extra charge.
Grab your copy: [Checkout Link]

---

### Day 6 — Bundle Value Reminder
**Subject:** How to save even more on [Product Name]
**Body:**
If you're planning to grab **[Product Name]**, check out our Top 3 Bundle—stack it with **LAUNCH20** at checkout to lock in the lowest price per asset.
View bundle: [Store Link]

---

### Day 7 — Final Hours for Launch Code
**Subject:** Final hours for LAUNCH20 (20% off ends tonight)
**Body:**
Quick heads-up: the 20% launch discount (**LAUNCH20**) wraps up tonight at midnight.
After tonight, [Product Name] stays at regular price ($[Price]).
Unlock instant access here: [Checkout Link]
`
  );

  root.file(
    '03_Revenue_and_Pricing_Simulator.html',
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Digital Product Revenue & Funnel Simulator</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #070B14; color: #F1F5F9; margin: 0; padding: 32px 16px; }
    .box { max-width: 780px; margin: 0 auto; background: #0F1629; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 28px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; margin-top: 18px; }
    label { display: block; font-size: 12px; color: #CBD5E1; margin-bottom: 6px; }
    input { width: 100%; box-sizing: border-box; background: #070B14; border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; padding: 10px; color: #fff; }
    .out { margin-top: 24px; display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 14px; }
    .card { background: #070B14; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 16px; }
    .k { font-size: 11px; color: #94A3B8; text-transform: uppercase; }
    .v { font-size: 26px; font-weight: 800; color: #34D399; margin-top: 6px; }
  </style>
</head>
<body>
  <div class="box">
    <h1 style="margin:0 0 6px;">Digital Product Funnel Simulator</h1>
    <p style="margin:0;color:#94A3B8;font-size:14px;">Model monthly store visitors, conversion rate, price, and bundle order bumps.</p>
    <div class="grid">
      <div><label>Monthly Visitors</label><input id="vis" type="number" value="5000" /></div>
      <div><label>Conversion Rate (%)</label><input id="cr" type="number" step="0.1" value="2.5" /></div>
      <div><label>Core Product Price ($)</label><input id="price" type="number" value="39" /></div>
      <div><label>Order Bump Uptake (%)</label><input id="bumpRate" type="number" value="30" /></div>
      <div><label>Order Bump Price ($)</label><input id="bumpPrice" type="number" value="19" /></div>
    </div>
    <div class="out">
      <div class="card"><div class="k">Monthly Orders</div><div class="v" id="ordersOut" style="color:#38BDF8;">0</div></div>
      <div class="card"><div class="k">Effective AOV</div><div class="v" id="aovOut" style="color:#A5B4FC;">$0</div></div>
      <div class="card"><div class="k">Monthly Gross Revenue</div><div class="v" id="revOut">$0</div></div>
      <div class="card"><div class="k">Annual Run Rate</div><div class="v" id="arrOut">$0</div></div>
    </div>
  </div>
  <script>
    function run() {
      const orders = Math.round((Number(vis.value)||0) * ((Number(cr.value)||0)/100));
      const aov = (Number(price.value)||0) + ((Number(bumpRate.value)||0)/100) * (Number(bumpPrice.value)||0);
      const rev = orders * aov;
      ordersOut.textContent = orders.toLocaleString();
      aovOut.textContent = '$' + aov.toFixed(2);
      revOut.textContent = '$' + Math.round(rev).toLocaleString();
      arrOut.textContent = '$' + Math.round(rev * 12).toLocaleString();
    }
    ['vis','cr','price','bumpRate','bumpPrice'].forEach(id => document.getElementById(id).addEventListener('input', run));
    run();
  </script>
</body>
</html>`
  );

  // Runnable Node + Express + Stripe Starter Kit
  root.file(
    '04_Starter_Micro_SaaS/package.json',
    JSON.stringify(
      {
        name: 'micro-saas-starter-kit',
        version: '1.0.0',
        type: 'module',
        scripts: { start: 'node server.js' },
        dependencies: {
          express: '^4.21.2',
          stripe: '^17.0.0',
          dotenv: '^16.4.5'
        }
      },
      null,
      2
    )
  );

  root.file(
    '04_Starter_Micro_SaaS/.env.example',
    `PORT=4000
APP_URL=http://localhost:4000
STRIPE_SECRET_KEY=sk_test_replace_me
STRIPE_WEBHOOK_SECRET=whsec_replace_me
STRIPE_PRICE_ID=price_replace_me
`
  );

  root.file(
    '04_Starter_Micro_SaaS/lib/licenses.js',
    `import crypto from 'crypto';

export function createLicenseKey(prefix = 'SV') {
  const seg = () => crypto.randomBytes(2).toString('hex').toUpperCase();
  return \`\${prefix}-\${seg()}-\${seg()}-\${seg()}\`;
}

export function isValidLicenseFormat(key) {
  return /^[A-Z]{2,4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}$/.test(String(key || '').trim());
}
`
  );

  root.file(
    '04_Starter_Micro_SaaS/server.js',
    `import 'dotenv/config';
import express from 'express';
import Stripe from 'stripe';
import { createLicenseKey } from './lib/licenses.js';

const app = express();
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const orders = new Map();

// Raw body required for Stripe Webhook verification
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(400).send('Stripe env vars not configured');
  }
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(\`Webhook Error: \${err.message}\`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const licenseKey = createLicenseKey('PRO');
    orders.set(session.id, {
      email: session.customer_details?.email,
      licenseKey,
      paid: true,
      createdAt: new Date().toISOString()
    });
    console.log('Fulfilled license:', licenseKey, 'for', session.customer_details?.email);
  }

  res.json({ received: true });
});

app.use(express.json());

app.post('/api/create-checkout-session', async (req, res) => {
  if (!stripe) return res.status(500).json({ error: 'Configure STRIPE_SECRET_KEY in .env' });
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
    success_url: \`\${process.env.APP_URL}/success?session_id={CHECKOUT_SESSION_ID}\`,
    cancel_url: \`\${process.env.APP_URL}/cancel\`
  });
  res.json({ url: session.url });
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.listen(process.env.PORT || 4000, () => {
  console.log('Micro-SaaS Starter listening on port', process.env.PORT || 4000);
});
`
  );

  root.file(
    '04_Starter_Micro_SaaS/DEPLOYMENT_GUIDE.md',
    `# Micro-SaaS Starter Kit — Quick Start

1. \`cd 04_Starter_Micro_SaaS\`
2. \`npm install\`
3. Copy \`.env.example\` to \`.env\` and add your Stripe test keys.
4. Forward local webhooks with Stripe CLI:
   \`stripe listen --forward-to localhost:4000/api/stripe/webhook\`
5. Run \`npm start\`.
`
  );
}
