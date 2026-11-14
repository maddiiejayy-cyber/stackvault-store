import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Star,
  Zap,
  ShieldCheck,
  Download,
  Sparkles,
  ShoppingCart,
  Eye,
  ArrowUpRight,
  Flame,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';
import { Navbar } from './components/Navbar.jsx';
import { ProductModal } from './components/ProductModal.jsx';
import { CartDrawer } from './components/CartDrawer.jsx';
import { LibraryView } from './components/LibraryView.jsx';
import { AdminView } from './components/AdminView.jsx';

const CATEGORIES = [
  'All',
  'AI & Automation',
  'Notion Systems',
  'UI & Design Kits',
  'Courses & Playbooks'
];

export default function App() {
  const [activeTab, setActiveTab] = useState('store'); // store | library | admin
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [paymentConfig, setPaymentConfig] = useState({
    stripeEnabled: false,
    webhookConfigured: false,
    stripeMode: 'unconfigured',
    checkoutMode: 'demo'
  });
  const [externalCompletedOrder, setExternalCompletedOrder] = useState(null);
  const [canceledNotice, setCanceledNotice] = useState(false);

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('stackvault_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [promoToApply, setPromoToApply] = useState('');

  const [sessionOrders, setSessionOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('stackvault_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('');

  async function fetchProducts() {
    setLoading(true);
    try {
      let token = '';
      try {
        token = sessionStorage.getItem('stackvault_admin_token') || '';
      } catch {
        // ignore
      }
      const res = await fetch('/api/products?includeInactive=true', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json();
      setProducts(data.products || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
    fetch('/api/payments/config')
      .then((r) => r.json())
      .then((cfg) => setPaymentConfig(cfg))
      .catch(() => {});

    // Handle redirect back from Stripe Checkout
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('stripe_session_id');
    const canceled = params.get('checkout_canceled');

    if (sessionId) {
      fetch(`/api/stripe/verify-session?session_id=${encodeURIComponent(sessionId)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.order) {
            setExternalCompletedOrder(data.order);
            setSessionOrders((prev) =>
              prev.some((o) => o.id === data.order.id) ? prev : [data.order, ...prev]
            );
            setCart([]);
            setCartOpen(true);
            fetchProducts();
          }
        })
        .finally(() => {
          window.history.replaceState({}, document.title, window.location.pathname);
        });
    } else if (canceled) {
      setCanceledNotice(true);
      setCartOpen(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('stackvault_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('stackvault_orders', JSON.stringify(sessionOrders));
  }, [sessionOrders]);

  const activeProducts = useMemo(
    () => products.filter((p) => p.active !== false),
    [products]
  );

  const filteredProducts = useMemo(() => {
    let list = [...activeProducts];

    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.format || '').toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating || b.salesCount - a.salesCount);
        break;
      case 'newest':
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'popular':
      default:
        list.sort((a, b) => b.salesCount - a.salesCount);
        break;
    }

    return list;
  }, [activeProducts, selectedCategory, searchQuery, sortBy]);

  const featuredSpotlight = useMemo(
    () => activeProducts.find((p) => p.featured) || activeProducts[0],
    [activeProducts]
  );

  function addToCart(product) {
    setCart((prev) => {
      if (prev.some((item) => item.id === product.id)) return prev;
      return [...prev, product];
    });
  }

  function buyNow(product) {
    addToCart(product);
    setSelectedProduct(null);
    setCartOpen(true);
  }

  function removeFromCart(productId) {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  }

  function handleAddTopBundle() {
    const topThree = [...activeProducts]
      .sort((a, b) => b.salesCount - a.salesCount)
      .slice(0, 3);
    setCart((prev) => {
      const ids = new Set(prev.map((i) => i.id));
      const merged = [...prev];
      for (const p of topThree) {
        if (!ids.has(p.id)) merged.push(p);
      }
      return merged;
    });
    setPromoToApply('LAUNCH20');
    setCartOpen(true);
  }

  async function handleNewsletterSubmit(e) {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail })
      });
      const data = await res.json();
      if (res.ok) {
        setNewsletterStatus(data.message || 'Subscribed!');
        setNewsletterEmail('');
      } else {
        setNewsletterStatus(data.error || 'Please enter a valid email.');
      }
    } catch {
      setNewsletterStatus('Could not subscribe right now.');
    }
  }

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100">
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.18),_rgba(6,182,212,0.06)_45%,_transparent_75%)]" />

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cart.length}
        onOpenCart={() => setCartOpen(true)}
        onApplyLaunchPromo={(code) => {
          setPromoToApply(code);
          if (cart.length > 0) setCartOpen(true);
        }}
      />

      {activeTab === 'store' && (
        <main>
          {/* Hero Section */}
          <section className="mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 lg:px-8 lg:pt-14">
            <div className="grid items-center gap-10 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
                  <Flame className="h-3.5 w-3.5 text-amber-400" />
                  <span>Top-Selling Digital Kits • Instant .ZIP Fulfillment</span>
                </div>

                <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-[54px] lg:leading-[1.08]">
                  High-Demand Digital Products Built to{' '}
                  <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                    Ship & Scale
                  </span>
                </h1>

                <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                  Skip months of building from scratch. Grab battle-tested AI prompt packs,
                  Notion operating systems, React + Tailwind UI kits, and launch playbooks—with
                  commercial rights and instant download.
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3.5">
                  <a
                    href="#catalog"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:brightness-110"
                  >
                    Browse All Products
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                  <button
                    onClick={handleAddTopBundle}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-[#0F1629] px-5 py-3.5 text-sm font-semibold text-white transition hover:border-indigo-400/40 hover:bg-[#161F38]"
                  >
                    <Sparkles className="h-4 w-4 text-cyan-400" />
                    Grab Top 3 Bundle (20% Off)
                  </button>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 sm:grid-cols-4">
                  {[
                    { icon: Download, label: 'Instant .ZIP', sub: 'Zero wait delivery' },
                    { icon: ShieldCheck, label: 'Commercial Rights', sub: 'Client & SaaS safe' },
                    { icon: Star, label: '4.9 / 5 Rating', sub: '2,100+ verified reviews' },
                    { icon: Zap, label: 'Stripe Ready', sub: 'Secure checkout' }
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-start gap-2.5">
                        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                        <div>
                          <p className="text-xs font-semibold text-white">{item.label}</p>
                          <p className="text-[11px] text-slate-400">{item.sub}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Hero Featured Spotlight Card */}
              {featuredSpotlight && (
                <div className="lg:col-span-5">
                  <div className="group relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-[#111931] to-[#0B1120] p-5 shadow-2xl shadow-indigo-950/50">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300">
                        <Flame className="h-3 w-3" />
                        #1 Trending This Week
                      </span>
                      <span className="font-mono text-xs text-slate-400">
                        {featuredSpotlight.salesCount.toLocaleString()}+ sold
                      </span>
                    </div>

                    <div
                      onClick={() => setSelectedProduct(featuredSpotlight)}
                      className="cursor-pointer overflow-hidden rounded-2xl border border-white/10"
                    >
                      <img
                        src={featuredSpotlight.image}
                        alt={featuredSpotlight.title}
                        className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="mt-4">
                      <p className="text-xs font-medium text-cyan-300">
                        {featuredSpotlight.category}
                      </p>
                      <h3 className="mt-1 text-xl font-bold text-white">
                        {featuredSpotlight.title}
                      </h3>
                      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-400">
                        {featuredSpotlight.tagline}
                      </p>

                      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-extrabold tabular-nums text-white">
                            ${featuredSpotlight.price}
                          </span>
                          {featuredSpotlight.compareAtPrice > featuredSpotlight.price && (
                            <span className="text-xs tabular-nums text-slate-500 line-through">
                              ${featuredSpotlight.compareAtPrice}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedProduct(featuredSpotlight)}
                            className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10"
                          >
                            Preview
                          </button>
                          <button
                            onClick={() => buyNow(featuredSpotlight)}
                            className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
                          >
                            Get Instant Access
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Catalog Filter & Search Bar */}
          <section id="catalog" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-[#0F1629]/75 p-4 lg:flex-row lg:items-center">
              <div className="flex flex-wrap items-center gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                <div className="relative flex-1 sm:w-64">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search prompts, Notion, UI..."
                    className="w-full rounded-xl border border-white/10 bg-[#070B14] py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none sm:text-sm"
                  />
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#070B14] px-3 py-2">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-xs font-medium text-slate-200 focus:outline-none sm:text-sm"
                  >
                    <option value="popular" className="bg-[#0B1120]">
                      Most Popular
                    </option>
                    <option value="rating" className="bg-[#0B1120]">
                      Highest Rated
                    </option>
                    <option value="price-asc" className="bg-[#0B1120]">
                      Price: Low to High
                    </option>
                    <option value="price-desc" className="bg-[#0B1120]">
                      Price: High to Low
                    </option>
                    <option value="newest" className="bg-[#0B1120]">
                      Newest Drops
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="h-96 animate-pulse rounded-2xl border border-white/10 bg-[#0F1629]/50"
                  />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="mt-10 rounded-2xl border border-dashed border-white/15 bg-[#0B1120]/50 p-14 text-center">
                <p className="text-lg font-semibold text-white">No matching digital products</p>
                <p className="mt-1 text-sm text-slate-400">
                  Try clearing your search or switching back to All categories.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => {
                  const inCart = cart.some((item) => item.id === product.id);
                  return (
                    <article
                      key={product.id}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0F1629]/80 transition duration-300 hover:-translate-y-1 hover:border-indigo-400/40 hover:shadow-xl hover:shadow-indigo-950/40"
                    >
                      <div
                        onClick={() => setSelectedProduct(product)}
                        className="relative cursor-pointer overflow-hidden bg-[#070B14]"
                      >
                        <img
                          src={product.image}
                          alt={product.title}
                          className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                        {product.badge && (
                          <span className="absolute left-3 top-3 rounded-full border border-indigo-400/30 bg-[#070B14]/85 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-200 backdrop-blur">
                            {product.badge}
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProduct(product);
                          }}
                          className="absolute bottom-3 right-3 flex items-center gap-1 rounded-lg border border-white/15 bg-[#070B14]/85 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 backdrop-blur transition group-hover:opacity-100"
                        >
                          <Eye className="h-3.5 w-3.5 text-cyan-400" />
                          Live Preview
                        </button>
                      </div>

                      <div className="flex flex-1 flex-col justify-between p-5">
                        <div>
                          <div className="flex items-center justify-between gap-2 text-[11px]">
                            <span className="font-medium text-cyan-300">{product.category}</span>
                            <span className="flex items-center gap-1 text-slate-300">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              {product.rating}
                              <span className="text-slate-500">
                                ({product.salesCount.toLocaleString()})
                              </span>
                            </span>
                          </div>

                          <h3
                            onClick={() => setSelectedProduct(product)}
                            className="mt-2 cursor-pointer text-base font-bold leading-snug text-white transition group-hover:text-indigo-300"
                          >
                            {product.title}
                          </h3>
                          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-400">
                            {product.tagline}
                          </p>
                        </div>

                        <div className="mt-5 border-t border-white/10 pt-4">
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-xl font-extrabold tabular-nums text-white">
                                  ${product.price}
                                </span>
                                {product.compareAtPrice > product.price && (
                                  <span className="text-xs tabular-nums text-slate-500 line-through">
                                    ${product.compareAtPrice}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-500">{product.format}</p>
                            </div>

                            <button
                              onClick={() =>
                                inCart ? setCartOpen(true) : addToCart(product)
                              }
                              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                                inCart
                                  ? 'border border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                                  : 'bg-indigo-600 text-white hover:bg-indigo-500'
                              }`}
                            >
                              {inCart ? (
                                <>
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  In Cart
                                </>
                              ) : (
                                <>
                                  <ShoppingCart className="h-3.5 w-3.5" />
                                  Add
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {/* Free Weekly Drop / Newsletter CTA */}
          <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl border border-indigo-500/25 bg-gradient-to-br from-[#121A34] via-[#0B1120] to-[#0B1D2E] p-8 sm:p-10">
              <div className="grid items-center gap-8 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-semibold text-cyan-300">
                    Free Creator Drop Every Friday
                  </span>
                  <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                    Get 1 Free High-Demand Template + 20% Off Your First Order
                  </h2>
                  <p className="mt-2 max-w-xl text-sm text-slate-300">
                    Join 14,000+ indie builders, designers, and operators receiving weekly AI
                    workflows, Notion modules, and digital product breakdowns.
                  </p>
                </div>

                <form onSubmit={handleNewsletterSubmit} className="lg:col-span-5">
                  <div className="flex flex-col gap-2.5 sm:flex-row">
                    <input
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="flex-1 rounded-xl border border-white/15 bg-[#070B14]/90 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-5 py-3 text-sm font-bold text-white transition hover:brightness-110"
                    >
                      Send Free Kit
                    </button>
                  </div>
                  {newsletterStatus && (
                    <p className="mt-2.5 text-xs font-medium text-emerald-400">
                      {newsletterStatus}
                    </p>
                  )}
                </form>
              </div>
            </div>
          </section>
        </main>
      )}

      {activeTab === 'library' && (
        <LibraryView
          sessionOrders={sessionOrders}
          onBrowseStore={() => setActiveTab('store')}
        />
      )}

      {activeTab === 'admin' && (
        <AdminView
          products={products}
          onProductsChanged={fetchProducts}
          paymentConfig={paymentConfig}
          onPaymentConfigChanged={setPaymentConfig}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#050810] py-8 text-xs text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">StackVault</span>
            <span>•</span>
            <span>High-Demand Digital Products Storefront</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button onClick={() => setActiveTab('store')} className="hover:text-white">
              Marketplace
            </button>
            <button onClick={() => setActiveTab('library')} className="hover:text-white">
              My Library
            </button>
            <button onClick={() => setActiveTab('admin')} className="hover:text-white">
              Seller Admin
            </button>
            <span className="text-slate-600">|</span>
            <span>
              Checkout: {paymentConfig.stripeEnabled ? `Stripe (${paymentConfig.stripeMode})` : 'Demo Mode'}
            </span>
          </div>
        </div>
      </footer>

      <ProductModal
        product={selectedProduct}
        inCart={selectedProduct ? cart.some((c) => c.id === selectedProduct.id) : false}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
        onBuyNow={buyNow}
      />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => {
          setCartOpen(false);
          setCanceledNotice(false);
        }}
        cart={cart}
        allProducts={activeProducts}
        onRemoveFromCart={removeFromCart}
        onAddToCart={addToCart}
        onClearCart={() => setCart([])}
        initialPromoCode={promoToApply}
        paymentConfig={paymentConfig}
        onPaymentConfigChanged={setPaymentConfig}
        externalCompletedOrder={externalCompletedOrder}
        onClearExternalOrder={() => setExternalCompletedOrder(null)}
        canceledNotice={canceledNotice}
        onOrderCompleted={(newOrder) => {
          setSessionOrders((prev) => [newOrder, ...prev]);
          fetchProducts();
        }}
      />
    </div>
  );
}
