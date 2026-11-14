import React, { useState } from 'react';
import {
  FolderDown,
  Search,
  Download,
  KeyRound,
  Calendar,
  Mail,
  Sparkles
} from 'lucide-react';

export function LibraryView({ sessionOrders, onBrowseStore }) {
  const [emailQuery, setEmailQuery] = useState('');
  const [lookupOrders, setLookupOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const displayedOrders = hasSearched ? lookupOrders : sessionOrders;

  async function handleLookup(e, presetEmail) {
    e?.preventDefault();
    const targetEmail = (presetEmail ?? emailQuery).trim();
    if (!targetEmail) return;
    setEmailQuery(targetEmail);
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?email=${encodeURIComponent(targetEmail)}`);
      const data = await res.json();
      setLookupOrders(data.orders || []);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-6 rounded-2xl border border-white/10 bg-[#0F1629]/70 p-6 sm:flex-row sm:items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-medium text-cyan-300">
            <FolderDown className="h-3.5 w-3.5" />
            Customer Digital Vault
          </span>
          <h1 className="mt-2 text-2xl font-bold text-white">My Purchased Library</h1>
          <p className="mt-1 text-sm text-slate-400">
            Download your .ZIP product bundles and copy license keys anytime.
          </p>
        </div>

        <form onSubmit={handleLookup} className="flex w-full max-w-sm gap-2">
          <div className="relative flex-1">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="email"
              value={emailQuery}
              onChange={(e) => setEmailQuery(e.target.value)}
              placeholder="Lookup by email..."
              className="w-full rounded-xl border border-white/10 bg-[#070B14] py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            <Search className="h-4 w-4" />
            Find
          </button>
        </form>
      </div>

      {/* Quick demo lookup helper */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex flex-wrap items-center gap-2">
          <span>Try sample buyer email:</span>
          <button
            onClick={() => handleLookup(null, 'alex@demo-creator.io')}
            className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-indigo-300 hover:bg-white/10"
          >
            alex@demo-creator.io
          </button>
          <button
            onClick={() => handleLookup(null, 'maya@studio-labs.dev')}
            className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-indigo-300 hover:bg-white/10"
          >
            maya@studio-labs.dev
          </button>
        </div>
        {hasSearched && (
          <button
            onClick={() => {
              setHasSearched(false);
              setEmailQuery('');
            }}
            className="text-cyan-400 hover:underline"
          >
            Show my session purchases ({sessionOrders.length})
          </button>
        )}
      </div>

      {/* Orders list */}
      <div className="mt-8 space-y-6">
        {displayedOrders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-[#0B1120]/50 p-12 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-indigo-400" />
            <h3 className="mt-3 text-lg font-semibold text-white">
              {hasSearched ? 'No orders found for that email' : 'No purchases in this session yet'}
            </h3>
            <p className="mx-auto mt-1 max-w-md text-sm text-slate-400">
              Complete a fast demo checkout in the Marketplace (or click one of the sample buyer emails above) to test instant .ZIP downloads.
            </p>
            <button
              onClick={onBrowseStore}
              className="mt-5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110"
            >
              Explore Digital Products
            </button>
          </div>
        ) : (
          displayedOrders.map((order) => (
            <div
              key={order.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#0F1629]/80"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-[#0B1120] px-5 py-3.5 text-xs">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="font-mono font-semibold text-white">{order.id}</span>
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-slate-400">{order.customerEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 font-semibold text-emerald-300">
                    Paid ${Number(order.total).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="divide-y divide-white/5">
                {order.items.map((item) => (
                  <div
                    key={`${order.id}-${item.productId}`}
                    className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"
                  >
                    <div>
                      <h4 className="font-semibold text-white">{item.title}</h4>
                      <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#070B14] px-2.5 py-1 font-mono text-xs text-indigo-300">
                        <KeyRound className="h-3.5 w-3.5 text-cyan-400" />
                        <span>License: {item.licenseKey}</span>
                      </div>
                    </div>

                    <a
                      href={`/api/orders/${order.id}/download/${item.productId}`}
                      download
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-500"
                    >
                      <Download className="h-4 w-4" />
                      Download .ZIP
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
