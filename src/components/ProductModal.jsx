import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Star,
  FileArchive,
  ShieldCheck,
  Code2,
  ShoppingCart,
  Zap,
  Sparkles
} from 'lucide-react';

export function ProductModal({ product, inCart, onClose, onAddToCart, onBuyNow }) {
  const [tab, setTab] = useState('overview');

  if (!product) return null;

  const discountPct =
    product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0B1120] shadow-2xl shadow-indigo-950/50"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#070B14]/80 text-slate-300 backdrop-blur transition hover:border-white/25 hover:text-white"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid overflow-y-auto md:grid-cols-12">
          {/* Left visual + meta */}
          <div className="border-b border-white/10 bg-[#070B14]/60 p-6 md:col-span-5 md:border-b-0 md:border-r">
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0F1629]">
              <img
                src={product.image}
                alt={product.title}
                className="aspect-[4/3] w-full object-cover"
              />
              {product.badge && (
                <span className="absolute left-3 top-3 rounded-full border border-indigo-400/30 bg-indigo-950/85 px-2.5 py-1 text-[11px] font-semibold text-indigo-200 backdrop-blur">
                  {product.badge}
                </span>
              )}
            </div>

            <div className="mt-5 space-y-3 rounded-xl border border-white/10 bg-[#0F1629]/70 p-4 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-2 text-slate-400">
                  <FileArchive className="h-4 w-4 text-cyan-400" />
                  Format
                </span>
                <span className="font-medium text-white">{product.format}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Package Size</span>
                <span className="font-mono text-white">{product.fileSize}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Total Sales</span>
                <span className="font-semibold text-emerald-400">
                  {product.salesCount.toLocaleString()}+ buyers
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">License</span>
                <span className="flex items-center gap-1 font-medium text-indigo-300">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Commercial Use
                </span>
              </div>
            </div>

            <div className="mt-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Files Included in .ZIP
              </p>
              <ul className="space-y-1.5 font-mono text-[11px] text-slate-300">
                {(product.deliverables || []).map((file) => (
                  <li
                    key={file}
                    className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-2.5 py-1.5"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    <span className="truncate">{file}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right details & interactive preview */}
          <div className="flex flex-col justify-between p-6 md:col-span-7">
            <div>
              <div className="flex flex-wrap items-center gap-2 pr-8">
                <span className="rounded-md border border-cyan-500/25 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-medium text-cyan-300">
                  {product.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-amber-400">
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                  <span className="font-semibold text-white">{product.rating}</span>
                  <span className="text-slate-400">({product.reviewCount} reviews)</span>
                </span>
              </div>

              <h2 className="mt-3 text-2xl font-bold tracking-tight text-white">
                {product.title}
              </h2>
              <p className="mt-1.5 text-sm text-slate-300">{product.tagline}</p>

              {/* Tabs */}
              <div className="mt-5 flex gap-2 border-b border-white/10 pb-3">
                <button
                  onClick={() => setTab('overview')}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    tab === 'overview'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  Overview & Inclusions
                </button>
                <button
                  onClick={() => setTab('preview')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    tab === 'preview'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <Code2 className="h-3.5 w-3.5" />
                  Live Sample Preview
                </button>
              </div>

              {tab === 'overview' ? (
                <div className="mt-4 space-y-4">
                  <p className="text-sm leading-relaxed text-slate-300">{product.description}</p>
                  <div>
                    <h4 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      What you get immediately
                    </h4>
                    <ul className="space-y-2">
                      {(product.highlights || []).map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-slate-200">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                  <div className="flex items-center justify-between rounded-t-xl border border-b-0 border-white/10 bg-[#131C33] px-3.5 py-2">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-cyan-300">
                      <Sparkles className="h-3.5 w-3.5" />
                      {product.previewSnippet?.title || 'Sample Inside the Pack'}
                    </span>
                    <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-slate-300">
                      {product.previewSnippet?.language || 'preview'}
                    </span>
                  </div>
                  <pre className="max-h-64 overflow-auto rounded-b-xl border border-white/10 bg-[#050810] p-4 font-mono text-xs leading-relaxed text-slate-200">
                    <code>{product.previewSnippet?.code}</code>
                  </pre>
                  <p className="mt-2 text-xs text-slate-400">
                    Full editable files + license key unlock immediately upon checkout.
                  </p>
                </div>
              )}
            </div>

            {/* Footer Buy Bar */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
              <div>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl font-extrabold tabular-nums text-white">
                    ${product.price}
                  </span>
                  {product.compareAtPrice > product.price && (
                    <>
                      <span className="text-sm tabular-nums text-slate-500 line-through">
                        ${product.compareAtPrice}
                      </span>
                      <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-300">
                        Save {discountPct}%
                      </span>
                    </>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">One-time payment • Lifetime updates</p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => onAddToCart(product)}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                    inCart
                      ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                      : 'border-white/15 bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {inCart ? 'In Cart' : 'Add to Cart'}
                </button>
                <button
                  onClick={() => onBuyNow(product)}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:brightness-110"
                >
                  <Zap className="h-4 w-4" />
                  Instant Buy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
