import React, { useState } from 'react';
import {
  ShoppingBag,
  Layers,
  FolderDown,
  BarChart3,
  Sparkles,
  Check,
  Copy
} from 'lucide-react';

export function Navbar({ activeTab, setActiveTab, cartCount, onOpenCart, onApplyLaunchPromo }) {
  const [copied, setCopied] = useState(false);

  const handleCopyPromo = () => {
    navigator.clipboard?.writeText('LAUNCH20').catch(() => {});
    onApplyLaunchPromo?.('LAUNCH20');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navItems = [
    { id: 'store', label: 'Marketplace', icon: Layers },
    { id: 'library', label: 'My Library', icon: FolderDown },
    { id: 'admin', label: 'Seller Admin', icon: BarChart3 }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070B14]/85 backdrop-blur-xl">
      {/* Promo strip */}
      <div className="border-b border-white/5 bg-gradient-to-r from-indigo-950/70 via-slate-900/90 to-cyan-950/70 px-4 py-1.5 text-center text-xs text-slate-300">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 font-medium text-indigo-300">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            Creator Launch Drop:
          </span>
          <span>Get 20% off any digital kit or bundle with code</span>
          <button
            onClick={handleCopyPromo}
            className="inline-flex items-center gap-1 rounded-md border border-indigo-400/30 bg-indigo-500/15 px-2 py-0.5 font-mono text-[11px] font-semibold text-indigo-200 transition hover:bg-indigo-500/25"
            title="Click to copy & apply LAUNCH20"
          >
            LAUNCH20
            {copied ? (
              <Check className="h-3 w-3 text-emerald-400" />
            ) : (
              <Copy className="h-3 w-3 text-indigo-300" />
            )}
          </button>
        </div>
      </div>

      {/* Main Nav */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <button
          onClick={() => setActiveTab('store')}
          className="group flex items-center gap-2.5 text-left"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-lg shadow-indigo-500/25 transition group-hover:scale-105">
            <Layers className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white">StackVault</span>
              <span className="hidden rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300 sm:inline-block">
                Instant Delivery
              </span>
            </div>
            <p className="hidden text-[11px] text-slate-400 sm:block">
              High-Demand Digital Assets & Systems
            </p>
          </div>
        </button>

        <nav className="flex items-center gap-1 rounded-xl border border-white/10 bg-[#0F1629]/80 p-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition sm:text-sm ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <button
          onClick={onOpenCart}
          className="relative flex items-center gap-2 rounded-xl border border-white/10 bg-[#0F1629] px-3.5 py-2 text-sm font-semibold text-white transition hover:border-indigo-400/50 hover:bg-[#151E36]"
        >
          <ShoppingBag className="h-4 w-4 text-indigo-400" />
          <span className="hidden sm:inline">Cart</span>
          <span
            className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold tabular-nums ${
              cartCount > 0
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {cartCount}
          </span>
        </button>
      </div>
    </header>
  );
}
