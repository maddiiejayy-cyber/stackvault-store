import React, { useState, useEffect, useCallback } from 'react';
import {
  DollarSign,
  ShoppingCart,
  Package,
  TrendingUp,
  Plus,
  Trash2,
  Tag,
  Eye,
  EyeOff,
  Star,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Lock,
  LogOut,
  Mail,
  KeyRound
} from 'lucide-react';

export function AdminView({ products, onProductsChanged, paymentConfig, onPaymentConfigChanged }) {
  const [adminToken, setAdminToken] = useState(() => {
    try {
      return sessionStorage.getItem('stackvault_admin_token') || '';
    } catch {
      return '';
    }
  });
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [promos, setPromos] = useState([]);
  const [subTab, setSubTab] = useState('products');

  // New Product form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('AI & Automation');
  const [price, setPrice] = useState('49');
  const [badge, setBadge] = useState('New Drop');
  const [tagline, setTagline] = useState('');
  const [format, setFormat] = useState('ZIP • Notion + PDF + JSON');
  const [saving, setSaving] = useState(false);

  // Promo form state
  const [promoCode, setPromoCode] = useState('');
  const [promoPct, setPromoPct] = useState('25');

  // Stripe & Email configuration state
  const [stripeKeyInput, setStripeKeyInput] = useState('');
  const [stripePubInput, setStripePubInput] = useState('');
  const [webhookInput, setWebhookInput] = useState('');
  const [resendKeyInput, setResendKeyInput] = useState('');
  const [stripeSaving, setStripeSaving] = useState(false);
  const [stripeMsg, setStripeMsg] = useState({ type: '', text: '' });

  // Password update state
  const [newPassword, setNewPassword] = useState('');
  const [pwMsg, setPwMsg] = useState({ type: '', text: '' });

  const adminHeaders = useCallback(
    (extra = {}) => {
      const h = { ...extra };
      if (adminToken) h.Authorization = `Bearer ${adminToken}`;
      return h;
    },
    [adminToken]
  );

  const checkSession = useCallback(async () => {
    setCheckingAuth(true);
    try {
      const res = await fetch('/api/admin/session', { headers: adminHeaders() });
      const data = await res.json();
      setAuthenticated(Boolean(data.authenticated));
    } catch {
      setAuthenticated(false);
    } finally {
      setCheckingAuth(false);
    }
  }, [adminHeaders]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const loadAdminData = useCallback(async () => {
    if (!authenticated) return;
    const [statsRes, ordersRes, promosRes] = await Promise.all([
      fetch('/api/admin/stats', { headers: adminHeaders() }),
      fetch('/api/orders', { headers: adminHeaders() }),
      fetch('/api/promos', { headers: adminHeaders() })
    ]);
    if (statsRes.status === 401) {
      setAuthenticated(false);
      return;
    }
    const [statsData, ordersData, promosData] = await Promise.all([
      statsRes.json(),
      ordersRes.json(),
      promosRes.json()
    ]);
    setStats(statsData);
    setOrders(ordersData.orders || []);
    setPromos(promosData.promoCodes || []);
  }, [authenticated, adminHeaders]);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData, products]);

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: loginPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || 'Invalid password.');
        return;
      }
      if (data.token) {
        try {
          sessionStorage.setItem('stackvault_admin_token', data.token);
        } catch {
          // ignore
        }
        setAdminToken(data.token);
      }
      setAuthenticated(true);
      setLoginPassword('');
      onProductsChanged?.();
    } catch {
      setLoginError('Network error signing in.');
    } finally {
      setLoggingIn(false);
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' }).catch(() => {});
    try {
      sessionStorage.removeItem('stackvault_admin_token');
    } catch {
      // ignore
    }
    setAdminToken('');
    setAuthenticated(false);
  }

  async function handleCreateProduct(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: adminHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          title,
          category,
          price: Number(price),
          badge,
          tagline,
          format,
          featured: true
        })
      });
      if (res.ok) {
        setTitle('');
        setTagline('');
        setPrice('49');
        await onProductsChanged();
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(product) {
    await fetch(`/api/products/${product.id}`, {
      method: 'PATCH',
      headers: adminHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ active: product.active === false })
    });
    await onProductsChanged();
  }

  async function handleToggleFeatured(product) {
    await fetch(`/api/products/${product.id}`, {
      method: 'PATCH',
      headers: adminHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ featured: !product.featured })
    });
    await onProductsChanged();
  }

  async function handleDeleteProduct(id) {
    await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: adminHeaders()
    });
    await onProductsChanged();
  }

  async function handleCreatePromo(e) {
    e.preventDefault();
    if (!promoCode.trim()) return;
    const res = await fetch('/api/promos', {
      method: 'POST',
      headers: adminHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        code: promoCode.trim().toUpperCase(),
        discountPercent: Number(promoPct)
      })
    });
    if (res.ok) {
      setPromoCode('');
      await loadAdminData();
    }
  }

  async function handleDeletePromo(code) {
    await fetch(`/api/promos/${code}`, {
      method: 'DELETE',
      headers: adminHeaders()
    });
    await loadAdminData();
  }

  async function handleSaveStripeConfig(e) {
    e.preventDefault();
    setStripeMsg({ type: '', text: '' });
    if (
      !stripeKeyInput.trim() &&
      !stripePubInput.trim() &&
      !webhookInput.trim() &&
      !resendKeyInput.trim()
    ) {
      return;
    }
    setStripeSaving(true);
    try {
      const res = await fetch('/api/payments/configure-stripe', {
        method: 'POST',
        headers: adminHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          secretKey: stripeKeyInput.trim(),
          publishableKey: stripePubInput.trim(),
          webhookSecret: webhookInput.trim(),
          resendApiKey: resendKeyInput.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setStripeMsg({ type: 'error', text: data.error || 'Could not save configuration.' });
        return;
      }
      onPaymentConfigChanged?.(data);
      setStripeKeyInput('');
      setStripePubInput('');
      setWebhookInput('');
      setResendKeyInput('');
      setStripeMsg({
        type: 'success',
        text: data.embeddedReady
          ? `Configuration saved! Stripe (${data.stripeMode.toUpperCase()}) in-page checkout is active.`
          : 'Configuration saved!'
      });
    } catch {
      setStripeMsg({ type: 'error', text: 'Network error saving configuration.' });
    } finally {
      setStripeSaving(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setPwMsg({ type: '', text: '' });
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: adminHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ newPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        setPwMsg({ type: 'error', text: data.error || 'Could not update password.' });
        return;
      }
      if (data.token) {
        try {
          sessionStorage.setItem('stackvault_admin_token', data.token);
        } catch {
          // ignore
        }
        setAdminToken(data.token);
      }
      setNewPassword('');
      setPwMsg({ type: 'success', text: 'Admin password updated and saved to .env!' });
    } catch {
      setPwMsg({ type: 'error', text: 'Network error updating password.' });
    }
  }

  if (checkingAuth) {
    return (
      <section className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="rounded-2xl border border-white/10 bg-[#0F1629]/80 p-8 text-sm text-slate-400">
          Checking admin session...
        </div>
      </section>
    );
  }

  if (!authenticated) {
    return (
      <section className="mx-auto max-w-md px-4 py-16">
        <form
          onSubmit={handleLogin}
          className="rounded-2xl border border-white/15 bg-[#0F1629]/90 p-7 shadow-2xl"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-400/30 bg-indigo-500/15">
            <Lock className="h-5 w-5 text-indigo-300" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-white">Seller Admin Sign In</h1>
          <p className="mt-1 text-xs text-slate-400">
            Protected dashboard for managing products, orders, promo codes, and Stripe keys.
          </p>

          <div className="mt-5 space-y-3">
            <input
              type="password"
              required
              autoFocus
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full rounded-xl border border-white/15 bg-[#070B14] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
            {loginError && (
              <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
                {loginError}
              </p>
            )}
            <button
              type="submit"
              disabled={loggingIn}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 py-2.5 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60"
            >
              {loggingIn ? 'Verifying...' : 'Unlock Seller Admin'}
            </button>
          </div>
          <p className="mt-4 text-[11px] text-slate-500">
            Starter password in <code>.env</code> is <code className="text-slate-300">stackvault2026</code> — change it under <strong>Stripe & Security</strong> after signing in.
          </p>
        </form>
      </section>
    );
  }

  const categoryEntries = Object.entries(stats?.categorySales || {});
  const maxCategorySale = Math.max(1, ...categoryEntries.map(([, val]) => val));

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-300">
            Seller Command Center
          </span>
          <h1 className="mt-2 text-2xl font-bold text-white">Store Analytics & Product Manager</h1>
          <p className="mt-1 text-sm text-slate-400">
            Launch digital products, manage promo codes, and configure Stripe & email delivery.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1.5 rounded-xl border border-white/10 bg-[#0F1629] p-1">
            {[
              { id: 'products', label: 'Products' },
              { id: 'orders', label: `Orders (${orders.length})` },
              { id: 'promos', label: `Promo Codes (${promos.length})` },
              { id: 'stripe', label: 'Stripe & Security' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSubTab(t.id)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                  subTab === t.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#0F1629] px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" />
            Lock
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-[#0F1629]/80 p-5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Recent Order Revenue</span>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-2 text-3xl font-extrabold tabular-nums text-white">
            ${(stats?.totalRevenue || 0).toFixed(2)}
          </p>
          <p className="mt-1 text-xs text-emerald-400">0% marketplace fee kept by you</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0F1629]/80 p-5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Orders Fulfilled</span>
            <ShoppingCart className="h-4 w-4 text-cyan-400" />
          </div>
          <p className="mt-2 text-3xl font-extrabold tabular-nums text-white">
            {stats?.totalOrders || 0}
          </p>
          <p className="mt-1 text-xs text-slate-400">Automated .ZIP delivery</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0F1629]/80 p-5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Avg. Order Value</span>
            <TrendingUp className="h-4 w-4 text-indigo-400" />
          </div>
          <p className="mt-2 text-3xl font-extrabold tabular-nums text-white">
            ${(stats?.avgOrderValue || 0).toFixed(2)}
          </p>
          <p className="mt-1 text-xs text-slate-400">Boosted by bundle upsells</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0F1629]/80 p-5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Active Listings</span>
            <Package className="h-4 w-4 text-violet-400" />
          </div>
          <p className="mt-2 text-3xl font-extrabold tabular-nums text-white">
            {stats?.activeProducts || 0}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {stats?.subscriberCount || 0} newsletter leads
          </p>
        </div>
      </div>

      {/* Category Revenue Bar Breakdown */}
      {categoryEntries.length > 0 && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-[#0F1629]/60 p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Historical Lifetime Gross Volume by Niche
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categoryEntries.map(([cat, amount]) => (
              <div key={cat} className="rounded-xl border border-white/5 bg-[#070B14] p-3.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-200">{cat}</span>
                  <span className="font-mono font-semibold text-cyan-300">
                    ${amount.toLocaleString()}
                  </span>
                </div>
                <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                    style={{ width: `${Math.round((amount / maxCategorySale) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab: Products Manager */}
      {subTab === 'products' && (
        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          <form
            onSubmit={handleCreateProduct}
            className="h-fit rounded-2xl border border-white/10 bg-[#0F1629]/80 p-5 lg:col-span-4"
          >
            <h3 className="flex items-center gap-2 text-base font-bold text-white">
              <Plus className="h-4 w-4 text-cyan-400" />
              Publish New Digital Product
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Adds directly to your storefront with an auto-generated .ZIP download package.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs text-slate-300">Product Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., AI Agency Cold Outreach Kit"
                  className="w-full rounded-xl border border-white/10 bg-[#070B14] px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-slate-300">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#070B14] px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option>AI & Automation</option>
                    <option>Notion Systems</option>
                    <option>UI & Design Kits</option>
                    <option>Courses & Playbooks</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-300">Price ($ USD)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#070B14] px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-slate-300">Badge</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="Bestseller"
                    className="w-full rounded-xl border border-white/10 bg-[#070B14] px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-300">File Format</label>
                  <input
                    type="text"
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#070B14] px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs text-slate-300">Short Tagline</label>
                <textarea
                  rows={2}
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Describe the core outcome buyers get in one sentence..."
                  className="w-full rounded-xl border border-white/10 bg-[#070B14] px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
              >
                {saving ? 'Publishing...' : 'Publish to Storefront'}
              </button>
            </div>
          </form>

          <div className="space-y-3 lg:col-span-8">
            {products.map((p) => (
              <div
                key={p.id}
                className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-[#0F1629]/70 p-4 sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-14 w-16 shrink-0 rounded-xl border border-white/10 object-cover"
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-semibold text-white">{p.title}</h4>
                      {p.active === false && (
                        <span className="rounded bg-slate-700 px-2 py-0.5 text-[10px] text-slate-300">
                          Hidden
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">
                      {p.category} • <span className="font-semibold text-indigo-300">${p.price}</span> •{' '}
                      {p.salesCount.toLocaleString()} sales
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleFeatured(p)}
                    title="Toggle Featured"
                    className={`rounded-lg border p-2 transition ${
                      p.featured
                        ? 'border-amber-500/40 bg-amber-500/15 text-amber-300'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Star className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleToggleActive(p)}
                    title={p.active === false ? 'Show in Store' : 'Hide from Store'}
                    className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 hover:bg-white/10"
                  >
                    {p.active === false ? (
                      <EyeOff className="h-4 w-4 text-slate-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-emerald-400" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    title="Delete Product"
                    className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-400 hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab: Orders */}
      {subTab === 'orders' && (
        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#0F1629]/80">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 bg-[#0B1120] text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-3.5">Order ID</th>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Items</th>
                  <th className="px-5 py-3.5">Method</th>
                  <th className="px-5 py-3.5">Total</th>
                  <th className="px-5 py-3.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-white/[0.02]">
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold text-indigo-300">
                      {o.id}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-white">{o.customerName}</p>
                      <p className="text-xs text-slate-400">{o.customerEmail}</p>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-300">
                      {o.items.map((i) => i.title).join(', ')}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-cyan-300">
                      {o.paymentMethod || 'Demo'}
                    </td>
                    <td className="px-5 py-3.5 font-bold tabular-nums text-emerald-400">
                      ${Number(o.total).toFixed(2)}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-400">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-tab: Promo Codes */}
      {subTab === 'promos' && (
        <div className="mt-8 grid gap-6 md:grid-cols-12">
          <form
            onSubmit={handleCreatePromo}
            className="rounded-2xl border border-white/10 bg-[#0F1629]/80 p-5 md:col-span-5"
          >
            <h3 className="flex items-center gap-2 text-base font-bold text-white">
              <Tag className="h-4 w-4 text-cyan-400" />
              Create Promo Code
            </h3>
            <div className="mt-4 space-y-3">
              <input
                type="text"
                required
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="Code (e.g. BLACKFRIDAY40)"
                className="w-full rounded-xl border border-white/10 bg-[#070B14] px-3 py-2 font-mono text-sm uppercase text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
              <input
                type="number"
                min="1"
                max="95"
                required
                value={promoPct}
                onChange={(e) => setPromoPct(e.target.value)}
                placeholder="Discount %"
                className="w-full rounded-xl border border-white/10 bg-[#070B14] px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Activate Promo Code
              </button>
            </div>
          </form>

          <div className="space-y-3 md:col-span-7">
            {promos.map((p) => (
              <div
                key={p.code}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0F1629]/70 px-4 py-3.5"
              >
                <div>
                  <span className="rounded-md bg-indigo-500/20 px-2.5 py-1 font-mono text-sm font-bold text-indigo-300">
                    {p.code}
                  </span>
                  <span className="ml-3 text-sm text-slate-300">
                    {p.discountPercent}% off ({p.label})
                  </span>
                </div>
                <button
                  onClick={() => handleDeletePromo(p.code)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab: Stripe, Email & Admin Security */}
      {subTab === 'stripe' && (
        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-2xl border border-white/10 bg-[#0F1629]/80 p-6">
              <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                <CreditCard className="h-5 w-5 text-indigo-400" />
                Live Connection Status
              </h3>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#070B14] px-4 py-3">
                  <span className="text-slate-300">Stripe Keys</span>
                  {paymentConfig?.embeddedReady ? (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />
                      Connected ({paymentConfig.stripeMode})
                    </span>
                  ) : paymentConfig?.stripeEnabled ? (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-amber-300">
                      <AlertTriangle className="h-4 w-4" />
                      Add Publishable Key
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-amber-300">
                      <AlertTriangle className="h-4 w-4" />
                      Demo Mode
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#070B14] px-4 py-3">
                  <span className="text-slate-300">Webhook Secret</span>
                  {paymentConfig?.webhookConfigured ? (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />
                      Verified
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">Optional in testing</span>
                  )}
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#070B14] px-4 py-3">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Mail className="h-4 w-4 text-cyan-400" />
                    Auto Email Receipts
                  </span>
                  {paymentConfig?.emailConfigured ? (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />
                      Active (Resend)
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">Optional</span>
                  )}
                </div>

                <div className="rounded-xl border border-white/10 bg-[#070B14] p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Webhook Endpoint URL
                  </p>
                  <p className="mt-1.5 break-all font-mono text-xs text-cyan-300">
                    {typeof window !== 'undefined' ? window.location.origin : ''}/api/stripe/webhook
                  </p>
                  <p className="mt-1.5 text-[11px] text-slate-500">
                    Events: <code>payment_intent.succeeded</code>, <code>checkout.session.completed</code>
                  </p>
                </div>
              </div>
            </div>

            {/* Change Admin Password */}
            <form
              onSubmit={handleChangePassword}
              className="rounded-2xl border border-white/10 bg-[#0F1629]/80 p-6"
            >
              <h3 className="flex items-center gap-2 text-base font-bold text-white">
                <KeyRound className="h-4 w-4 text-cyan-400" />
                Change Admin Password
              </h3>
              <div className="mt-3 space-y-3">
                <input
                  type="password"
                  minLength={6}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password (min 6 chars)"
                  className="w-full rounded-xl border border-white/15 bg-[#070B14] px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
                {pwMsg.text && (
                  <p
                    className={`text-xs font-medium ${
                      pwMsg.type === 'success' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {pwMsg.text}
                  </p>
                )}
                <button
                  type="submit"
                  className="w-full rounded-xl border border-white/15 bg-white/5 py-2 text-xs font-semibold text-white hover:bg-white/10"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0F1629]/80 p-6 lg:col-span-7">
            <h3 className="text-lg font-bold text-white">Stripe & Email Keys</h3>
            <p className="mt-1 text-xs text-slate-400">
              Update your Stripe Test/Live keys or add a free Resend API key so buyers automatically receive download links by email.
            </p>

            <form onSubmit={handleSaveStripeConfig} className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-300">
                  Stripe Secret Key (<code>sk_test_...</code> or <code>sk_live_...</code>)
                </label>
                <input
                  type="password"
                  value={stripeKeyInput}
                  onChange={(e) => setStripeKeyInput(e.target.value)}
                  placeholder={paymentConfig?.stripeEnabled ? 'Already connected (leave blank to keep)' : 'sk_test_51...'}
                  className="w-full rounded-xl border border-white/15 bg-[#070B14] px-3.5 py-2.5 font-mono text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-300">
                  Stripe Publishable Key (<code>pk_test_...</code> or <code>pk_live_...</code>)
                </label>
                <input
                  type="text"
                  value={stripePubInput}
                  onChange={(e) => setStripePubInput(e.target.value)}
                  placeholder={paymentConfig?.publishableKey ? 'Already connected (leave blank to keep)' : 'pk_test_51...'}
                  className="w-full rounded-xl border border-white/15 bg-[#070B14] px-3.5 py-2.5 font-mono text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-300">
                  Webhook Signing Secret (Required for production — <code>whsec_...</code>)
                </label>
                <input
                  type="password"
                  value={webhookInput}
                  onChange={(e) => setWebhookInput(e.target.value)}
                  placeholder={paymentConfig?.webhookConfigured ? 'Already connected (leave blank to keep)' : 'whsec_...'}
                  className="w-full rounded-xl border border-white/15 bg-[#070B14] px-3.5 py-2.5 font-mono text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-300">
                  Resend API Key (Optional for automated email receipts — <code>re_...</code>)
                </label>
                <input
                  type="password"
                  value={resendKeyInput}
                  onChange={(e) => setResendKeyInput(e.target.value)}
                  placeholder={paymentConfig?.emailConfigured ? 'Already connected (leave blank to keep)' : 're_...'}
                  className="w-full rounded-xl border border-white/15 bg-[#070B14] px-3.5 py-2.5 font-mono text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {stripeMsg.text && (
                <div
                  className={`rounded-xl border px-3.5 py-2.5 text-xs font-medium ${
                    stripeMsg.type === 'success'
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                      : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                  }`}
                >
                  {stripeMsg.text}
                </div>
              )}

              <button
                type="submit"
                disabled={stripeSaving}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
              >
                {stripeSaving ? 'Verifying & Saving...' : 'Save Configuration'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
