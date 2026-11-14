const UI_COMPONENTS = {
  'Navbar.jsx': `import React, { useState } from 'react';

export function DarkForgeNavbar({ brand = 'DarkForge', links = ['Features', 'Pricing', 'Docs'], onCta }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070B14]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
        <a href="#" className="flex items-center gap-2 font-bold text-white">
          <span className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400" />
          <span>{brand}</span>
        </a>
        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          {links.map((l) => (
            <a key={l} href={'#' + l.toLowerCase()} className="hover:text-white transition">{l}</a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button onClick={onCta} className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition">
            Get Started
          </button>
          <button onClick={() => setOpen(!open)} className="md:hidden text-slate-300 text-sm">Menu</button>
        </div>
      </div>
      {open && (
        <div className="border-t border-white/10 px-4 py-3 space-y-2 md:hidden">
          {links.map((l) => (
            <a key={l} href={'#' + l.toLowerCase()} className="block text-sm text-slate-300">{l}</a>
          ))}
        </div>
      )}
    </header>
  );
}
`,
  'HeroSection.jsx': `import React from 'react';

export function DarkForgeHero({ badge = 'New v2.0 Release', title = 'Ship your AI SaaS in days, not months', subtitle = 'Production-grade dark UI blocks built with Tailwind CSS and accessible React primitives.', onPrimary, onSecondary }) {
  return (
    <section className="relative overflow-hidden bg-[#070B14] px-4 py-20 text-center">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.22),_transparent_70%)]" />
      <div className="relative mx-auto max-w-3xl">
        <span className="inline-block rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">{badge}</span>
        <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">{title}</h1>
        <p className="mt-5 text-base text-slate-300 sm:text-lg">{subtitle}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={onPrimary} className="rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 hover:brightness-110">Start Building</button>
          <button onClick={onSecondary} className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">Live Demo</button>
        </div>
      </div>
    </section>
  );
}
`,
  'PricingTable.jsx': `import React, { useState } from 'react';

export function PricingTable({ onSelectPlan }) {
  const [annual, setAnnual] = useState(true);
  const plans = [
    { name: 'Starter', monthly: 19, annual: 15, desc: 'For solo makers shipping MVP 1', features: ['1 Workspace', 'Unlimited Projects', 'Email Support'] },
    { name: 'Pro', monthly: 49, annual: 39, popular: true, desc: 'For growing SaaS & creator teams', features: ['10 Workspaces', 'API & Webhooks', 'Priority Support', 'Custom Domain'] },
    { name: 'Scale', monthly: 129, annual: 99, desc: 'For high-volume operations', features: ['Unlimited Seats', 'SSO / SAML', 'Dedicated SLA', 'Audit Logs'] }
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <div className="flex justify-center gap-2 mb-10">
        <button onClick={() => setAnnual(false)} className={\`px-4 py-1.5 rounded-lg text-xs font-semibold \${!annual ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400'}\`}>Monthly</button>
        <button onClick={() => setAnnual(true)} className={\`px-4 py-1.5 rounded-lg text-xs font-semibold \${annual ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400'}\`}>Annual (Save 20%)</button>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <div key={p.name} className={\`rounded-2xl border p-6 \${p.popular ? 'border-indigo-500 bg-[#121A33]' : 'border-white/10 bg-[#0F1629]'}\`}>
            {p.popular && <span className="inline-block mb-2 rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-300">Most Popular</span>}
            <h3 className="text-lg font-bold text-white">{p.name}</h3>
            <p className="text-xs text-slate-400 mt-1">{p.desc}</p>
            <p className="mt-5 text-4xl font-extrabold text-white">\${annual ? p.annual : p.monthly}<span className="text-xs font-normal text-slate-400">/mo</span></p>
            <ul className="mt-5 space-y-2 text-xs text-slate-300">
              {p.features.map((f) => <li key={f}>✓ {f}</li>)}
            </ul>
            <button onClick={() => onSelectPlan?.(p.name)} className="mt-6 w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500">Choose {p.name}</button>
          </div>
        ))}
      </div>
    </section>
  );
}
`,
  'MetricCard.jsx': `import React from 'react';

export function MetricCard({ label, value, delta, positive = true }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0F1629] p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>
      <div className="mt-2 flex items-baseline justify-between gap-2">
        <p className="text-3xl font-extrabold tabular-nums text-white">{value}</p>
        {delta && (
          <span className={\`rounded-full px-2 py-0.5 text-xs font-semibold \${positive ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'}\`}>
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}
`,
  'FeatureGrid.jsx': `import React from 'react';

export function FeatureGrid({ items = [] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-2xl border border-white/10 bg-[#0F1629]/80 p-6 hover:border-indigo-500/40 transition">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300 font-bold">{i + 1}</div>
          <h3 className="text-base font-bold text-white">{item.title}</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
`,
  'CommandPaletteModal.jsx': `import React, { useState } from 'react';

export function CommandPaletteModal({ open, onClose, commands = [], onSelect }) {
  const [query, setQuery] = useState('');
  if (!open) return null;
  const filtered = commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 pt-24 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/15 bg-[#0B1120] shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Type a command or search..." className="w-full border-b border-white/10 bg-transparent px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none" />
        <div className="max-h-72 overflow-y-auto p-2">
          {filtered.map((cmd) => (
            <button key={cmd.id} onClick={() => { onSelect?.(cmd); onClose(); }} className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm text-slate-200 hover:bg-indigo-600/20">
              <span>{cmd.label}</span>
              <span className="font-mono text-[11px] text-slate-500">{cmd.shortcut || '↵'}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
`,
  'DataTable.jsx': `import React from 'react';

export function DataTable({ columns = [], rows = [] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0F1629]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-[#0B1120] text-xs uppercase text-slate-400">
            <tr>{columns.map((c) => <th key={c.key} className="px-4 py-3">{c.label}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-white/[0.02]">
                {columns.map((c) => <td key={c.key} className="px-4 py-3 text-slate-200">{row[c.key]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
`,
  'TestimonialWall.jsx': `import React from 'react';

export function TestimonialWall({ quotes = [] }) {
  return (
    <div className="columns-1 gap-5 space-y-5 sm:columns-2 lg:columns-3">
      {quotes.map((q, idx) => (
        <figure key={idx} className="break-inside-avoid rounded-2xl border border-white/10 bg-[#0F1629] p-5">
          <blockquote className="text-sm leading-relaxed text-slate-300">“{q.text}”</blockquote>
          <figcaption className="mt-4 flex items-center justify-between text-xs">
            <span className="font-semibold text-white">{q.author}</span>
            <span className="text-slate-400">{q.role}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
`,
  'AuthCard.jsx': `import React, { useState } from 'react';

export function AuthCard({ onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit?.({ email, password }); }} className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0F1629] p-6">
      <h2 className="text-xl font-bold text-white">Welcome back</h2>
      <p className="mt-1 text-xs text-slate-400">Sign in to your DarkForge workspace</p>
      <div className="mt-5 space-y-3">
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="w-full rounded-xl border border-white/10 bg-[#070B14] px-3.5 py-2.5 text-sm text-white" />
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-xl border border-white/10 bg-[#070B14] px-3.5 py-2.5 text-sm text-white" />
        <button type="submit" className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500">Continue</button>
      </div>
    </form>
  );
}
`,
  'FaqAccordion.jsx': `import React, { useState } from 'react';

export function FaqAccordion({ items = [] }) {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <div className="space-y-2.5">
      {items.map((item, idx) => (
        <div key={idx} className="rounded-xl border border-white/10 bg-[#0F1629]">
          <button onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)} className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-semibold text-white">
            <span>{item.q}</span>
            <span className="text-indigo-400">{openIdx === idx ? '−' : '+'}</span>
          </button>
          {openIdx === idx && <p className="border-t border-white/5 px-4 py-3 text-xs leading-relaxed text-slate-300">{item.a}</p>}
        </div>
      ))}
    </div>
  );
}
`,
  'ToastNotification.jsx': `import React from 'react';

export function ToastNotification({ message, type = 'success', onClose }) {
  if (!message) return null;
  const styles = type === 'error' ? 'border-rose-500/40 bg-rose-950/90 text-rose-200' : 'border-emerald-500/40 bg-emerald-950/90 text-emerald-200';
  return (
    <div className={\`fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 text-xs font-semibold shadow-xl \${styles}\`}>
      <span>{message}</span>
      <button onClick={onClose} className="opacity-70 hover:opacity-100">✕</button>
    </div>
  );
}
`,
  'Footer.jsx': `import React from 'react';

export function DarkForgeFooter({ brand = 'DarkForge' }) {
  return (
    <footer className="border-t border-white/10 bg-[#050810] px-4 py-8 text-xs text-slate-400">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        <span className="font-bold text-white">{brand}</span>
        <div className="flex gap-5">
          <a href="#" className="hover:text-white">Terms</a>
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Support</a>
        </div>
      </div>
    </footer>
  );
}
`
};

export function buildDesignKitFiles(root, product, licenseKey) {
  root.file(
    'tokens/darkforge-theme.css',
    `/* DarkForge SaaS Design Tokens — License: ${licenseKey} */
:root {
  --df-bg-canvas: #070B14;
  --df-bg-surface: #0F1629;
  --df-bg-elevated: #161F38;
  --df-border-hairline: rgba(255, 255, 255, 0.08);
  --df-border-strong: rgba(255, 255, 255, 0.16);
  --df-text-primary: #F8FAFC;
  --df-text-secondary: #94A3B8;
  --df-accent-indigo: #6366F1;
  --df-accent-cyan: #06B6D4;
  --df-accent-emerald: #10B981;
  --df-radius-card: 16px;
  --df-shadow-glow: 0 0 40px -10px rgba(99, 102, 241, 0.45);
}
`
  );

  for (const [name, code] of Object.entries(UI_COMPONENTS)) {
    root.file(`components/${name}`, code);
  }

  root.file(
    'showcase.html',
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DarkForge UI Kit — Component Showcase</title>
  <style>
    body { margin: 0; font-family: system-ui, -apple-system, sans-serif; background: #070B14; color: #F8FAFC; padding: 36px 20px; }
    .wrap { max-width: 960px; margin: 0 auto; }
    .hero { text-align: center; padding: 40px 20px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); background: radial-gradient(circle at top, rgba(99,102,241,0.22), #0F1629 65%); }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 12px; background: rgba(99,102,241,0.2); color: #A5B4FC; border: 1px solid rgba(99,102,241,0.35); }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-top: 24px; }
    .card { background: #0F1629; border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 18px; }
    .btn { display: inline-block; margin-top: 14px; padding: 10px 18px; border-radius: 10px; background: linear-gradient(90deg, #4F46E5, #0891B2); color: #fff; text-decoration: none; font-weight: 600; font-size: 13px; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="hero">
      <span class="badge">DarkForge Design System</span>
      <h1>12 Production React + Tailwind Components</h1>
      <p style="color:#94A3B8;max-width:560px;margin:10px auto;">Copy any file from <code>components/</code> directly into your React or Next.js project alongside <code>tokens/darkforge-theme.css</code>.</p>
    </div>
    <div class="grid">
      <div class="card"><h3>Navbar & Hero</h3><p style="color:#94A3B8;font-size:13px;">Responsive sticky navigation + radial glow hero block.</p></div>
      <div class="card"><h3>Pricing & Metrics</h3><p style="color:#94A3B8;font-size:13px;">Monthly/annual toggle pricing table + KPI cards.</p></div>
      <div class="card"><h3>Command Palette & Table</h3><p style="color:#94A3B8;font-size:13px;">Searchable Cmd+K modal and clean SaaS data table.</p></div>
    </div>
  </div>
</body>
</html>`
  );

  root.file(
    'README_Integration.md',
    `# ${product.title} — Integration Guide

## Included Files
- \`tokens/darkforge-theme.css\` — CSS variables for the obsidian dark palette
- \`components/\` — 12 standalone React + Tailwind CSS components:
  - \`Navbar.jsx\`, \`HeroSection.jsx\`, \`PricingTable.jsx\`, \`MetricCard.jsx\`
  - \`FeatureGrid.jsx\`, \`CommandPaletteModal.jsx\`, \`DataTable.jsx\`, \`TestimonialWall.jsx\`
  - \`AuthCard.jsx\`, \`FaqAccordion.jsx\`, \`ToastNotification.jsx\`, \`Footer.jsx\`
- \`showcase.html\` — Offline visual preview

## Quick Setup
1. Import \`tokens/darkforge-theme.css\` in your app entry (\`main.jsx\` or \`layout.tsx\`).
2. Copy the components you need from \`components/\` into \`src/components/\`.
3. Customize accent colors (\`indigo-600\`, \`cyan-500\`) to match your brand.
`
  );
}
