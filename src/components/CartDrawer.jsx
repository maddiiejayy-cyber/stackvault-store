import React, { useState, useEffect } from 'react';
import {
  X,
  Trash2,
  Tag,
  Lock,
  CheckCircle2,
  Download,
  CreditCard,
  Sparkles,
  Plus,
  KeyRound,
  ArrowRight,
  ExternalLink,
  AlertCircle,
  Copy,
  Check,
  RefreshCw
} from 'lucide-react';
import { StripeEmbeddedForm } from './StripeEmbeddedForm.jsx';

export function CartDrawer({
  isOpen,
  onClose,
  cart,
  allProducts,
  onRemoveFromCart,
  onAddToCart,
  onClearCart,
  initialPromoCode,
  onOrderCompleted,
  paymentConfig,
  onPaymentConfigChanged,
  externalCompletedOrder,
  onClearExternalOrder,
  canceledNotice
}) {
  const [promoInput, setPromoInput] = useState(initialPromoCode || '');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Card (Instant Demo)');
  const [submitting, setSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [pendingStripe, setPendingStripe] = useState(null); // { url, sessionId }
  const [copiedLink, setCopiedLink] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [pubKeyInput, setPubKeyInput] = useState('');
  const [savingPubKey, setSavingPubKey] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  useEffect(() => {
    if (externalCompletedOrder) {
      setCompletedOrder(externalCompletedOrder);
      setPendingStripe(null);
    }
  }, [externalCompletedOrder]);

  useEffect(() => {
    if (initialPromoCode && !appliedPromo) {
      setPromoInput(initialPromoCode);
      validatePromo(initialPromoCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPromoCode]);

  if (!isOpen) return null;

  const stripeEnabled = Boolean(paymentConfig?.stripeEnabled);
  const embeddedReady = Boolean(paymentConfig?.embeddedReady && paymentConfig?.publishableKey);
  const subtotal = cart.reduce((sum, item) => sum + Number(item.price), 0);
  const discountAmount = appliedPromo
    ? Number(((subtotal * appliedPromo.discountPercent) / 100).toFixed(2))
    : 0;
  const total = Math.max(0, Number((subtotal - discountAmount).toFixed(2)));

  const upsellProduct = allProducts.find(
    (p) => p.active !== false && !cart.some((c) => c.id === p.id)
  );

  async function validatePromo(codeToTest) {
    const code = (codeToTest ?? promoInput).trim();
    if (!code) return;
    setPromoError('');
    try {
      const res = await fetch('/api/promo/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      if (!res.ok) {
        setAppliedPromo(null);
        setPromoError(data.error || 'Invalid promo code');
        return;
      }
      setAppliedPromo(data.promo);
      setPromoInput(data.promo.code);
    } catch {
      setPromoError('Could not validate promo code.');
    }
  }

  async function runDemoCheckout() {
    setCheckoutError('');
    if (!customerName.trim() || !customerEmail.trim()) {
      setCheckoutError('Please enter your name and email above first.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          paymentMethod,
          promoCode: appliedPromo?.code || null,
          items: cart.map((item) => ({ productId: item.id }))
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setCheckoutError(data.error || 'Checkout failed.');
        return;
      }
      setCompletedOrder(data.order);
      setPendingStripe(null);
      onClearCart();
      onOrderCompleted?.(data.order);
    } catch {
      setCheckoutError('Network error during checkout.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCheckout(e) {
    e.preventDefault();
    if (!cart.length) return;
    setCheckoutError('');

    if (!customerName.trim()) {
      setCheckoutError('Please enter your full name.');
      return;
    }
    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      setCheckoutError('Please enter a valid email address.');
      return;
    }

    if (!stripeEnabled) {
      await runDemoCheckout();
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          promoCode: appliedPromo?.code || null,
          items: cart.map((item) => ({ productId: item.id }))
        })
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setCheckoutError(data.error || 'Could not start Stripe Checkout.');
        setSubmitting(false);
        return;
      }

      if (window.self !== window.top) {
        // Inside preview iframe: Stripe blocks iframes, so show a dedicated payment launch screen + open new tab
        setPendingStripe({ url: data.url, sessionId: data.sessionId });
        try {
          window.open(data.url, '_blank', 'noopener,noreferrer');
        } catch {
          // Popup blocked; user can click button or copy link
        }
        setSubmitting(false);
      } else {
        window.location.href = data.url;
      }
    } catch {
      setCheckoutError('Network error starting Stripe Checkout.');
      setSubmitting(false);
    }
  }

  async function handleVerifyStripePayment() {
    if (!pendingStripe?.sessionId) return;
    setCheckingPayment(true);
    setCheckoutError('');
    try {
      const res = await fetch(
        `/api/stripe/verify-session?session_id=${encodeURIComponent(pendingStripe.sessionId)}`
      );
      const data = await res.json();
      if (!res.ok || !data.order) {
        setCheckoutError(
          data.error || 'Payment not completed yet. Finish paying on Stripe first, then click again.'
        );
        return;
      }
      setCompletedOrder(data.order);
      setPendingStripe(null);
      onClearCart();
      onOrderCompleted?.(data.order);
    } catch {
      setCheckoutError('Could not verify payment status yet.');
    } finally {
      setCheckingPayment(false);
    }
  }

  function handleCopyStripeLink() {
    if (!pendingStripe?.url) return;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(pendingStripe.url).catch(() => {});
    }
    try {
      const input = document.getElementById('stripe-checkout-url-box');
      if (input) {
        input.select();
        document.execCommand('copy');
      }
    } catch {
      // Ignore fallback error
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  }

  async function handleSavePublishableKey() {
    if (!pubKeyInput.trim()) return;
    setCheckoutError('');
    setSavingPubKey(true);
    try {
      const res = await fetch('/api/payments/configure-stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publishableKey: pubKeyInput.trim() })
      });
      const data = await res.json();
      if (!res.ok) {
        setCheckoutError(data.error || 'Invalid Publishable Key.');
        return;
      }
      onPaymentConfigChanged?.(data);
      setPubKeyInput('');
    } catch {
      setCheckoutError('Could not save Publishable Key.');
    } finally {
      setSavingPubKey(false);
    }
  }

  function handleResetAndClose() {
    setCompletedOrder(null);
    setPendingStripe(null);
    setCheckoutError('');
    onClearExternalOrder?.();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm"
      onClick={handleResetAndClose}
    >
      <aside
        className="flex h-full w-full max-w-md flex-col border-l border-white/15 bg-[#0B1120] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h3 className="text-lg font-bold text-white">
              {completedOrder
                ? 'Order Confirmed!'
                : pendingStripe
                ? 'Complete Payment on Stripe'
                : 'Your Digital Cart'}
            </h3>
            <p className="text-xs text-slate-400">
              {completedOrder
                ? `Receipt & instant downloads for ${completedOrder.customerEmail}`
                : pendingStripe
                ? 'Stripe Checkout session ready'
                : `${cart.length} ${cart.length === 1 ? 'item' : 'items'} • Instant .ZIP delivery`}
            </p>
          </div>
          <button
            onClick={handleResetAndClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Screen 1: Completed Order */}
        {completedOrder ? (
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-7 w-7 shrink-0 text-emerald-400" />
                <div>
                  <p className="text-sm font-bold text-white">
                    Payment Verified — {completedOrder.id}
                  </p>
                  <p className="text-xs text-emerald-200/80">
                    Total paid: ${Number(completedOrder.total).toFixed(2)}{' '}
                    {completedOrder.discountCode && `(Saved with ${completedOrder.discountCode})`}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Instant Downloads & License Keys
              </h4>
              <div className="space-y-3">
                {completedOrder.items.map((item) => (
                  <div
                    key={item.productId}
                    className="rounded-xl border border-white/10 bg-[#0F1629] p-4"
                  >
                    <p className="font-semibold text-white">{item.title}</p>
                    <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-[#070B14] px-2.5 py-1.5 font-mono text-[11px] text-indigo-300">
                      <KeyRound className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
                      <span>{item.licenseKey}</span>
                    </div>
                    <a
                      href={`/api/orders/${completedOrder.id}/download/${item.productId}`}
                      download
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 px-3 py-2 text-xs font-semibold text-white transition hover:brightness-110"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download Package (.ZIP)
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/10"
            >
              Continue Browsing Store
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : pendingStripe ? (
          /* Screen 2: Pending Stripe Checkout (iframe-safe!) */
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-5">
              <p className="text-sm font-bold text-white">
                Your Stripe Checkout page is ready (${total.toFixed(2)})
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                Stripe’s payment page cannot load inside a preview frame, so it opens in a separate browser tab. Click below to open it or copy the link:
              </p>

              <div className="mt-4 space-y-2.5">
                <div className="rounded-xl border border-white/15 bg-[#070B14] p-2.5">
                  <p className="mb-1.5 text-[11px] font-medium text-slate-400">
                    Copy this link and paste it into a new browser tab to pay:
                  </p>
                  <input
                    id="stripe-checkout-url-box"
                    type="text"
                    readOnly
                    value={pendingStripe.url}
                    onClick={(e) => e.target.select()}
                    className="w-full rounded-lg border border-white/10 bg-[#0B1120] px-2.5 py-2 font-mono text-[11px] text-cyan-300 focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleCopyStripeLink}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:brightness-110"
                >
                  {copiedLink ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-300" />
                      Copied! Paste into a new browser tab
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Stripe Payment Link
                    </>
                  )}
                </button>

                <a
                  href={pendingStripe.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-[#070B14] py-2.5 text-xs font-semibold text-slate-200 hover:bg-white/5"
                >
                  Open Stripe Checkout Page
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0F1629] p-4 space-y-3">
              <p className="text-xs font-semibold text-white">Already finished paying in the other tab?</p>
              <p className="text-xs text-slate-400">
                Click below to verify your Stripe payment right here and unlock your .ZIP downloads:
              </p>
              <button
                type="button"
                onClick={handleVerifyStripePayment}
                disabled={checkingPayment}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 disabled:opacity-60"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${checkingPayment ? 'animate-spin' : ''}`} />
                {checkingPayment ? 'Checking Stripe...' : "I've Paid — Unlock Downloads"}
              </button>
              {checkoutError && (
                <p className="rounded-lg bg-rose-500/10 p-2 text-xs text-rose-400">
                  {checkoutError}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setPendingStripe(null);
                  setCheckoutError('');
                }}
                className="text-slate-400 hover:text-white"
              >
                ← Back to cart
              </button>
              <button
                type="button"
                onClick={runDemoCheckout}
                className="text-cyan-400 hover:underline"
              >
                Test Demo Checkout instead
              </button>
            </div>
          </div>
        ) : cart.length === 0 ? (
          /* Screen 3: Empty Cart */
          <div className="flex flex-1 flex-col items-center justify-center p-5 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-[#0F1629]">
              <Sparkles className="h-6 w-6 text-indigo-400" />
            </div>
            <p className="mt-4 text-base font-semibold text-white">Your cart is empty</p>
            <p className="mt-1 max-w-xs text-xs text-slate-400">
              Add high-demand templates, AI prompt packs, or UI kits to unlock instant download.
            </p>
          </div>
        ) : (
          /* Screen 4: Cart & Checkout Form */
          <form onSubmit={handleCheckout} noValidate className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {canceledNotice && (
                <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                  <span>Stripe checkout was canceled. Your cart items are still saved below.</span>
                </div>
              )}

              {/* Cart Items */}
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0F1629] p-3"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-14 w-16 shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">{item.title}</p>
                      <p className="text-[11px] text-slate-400">{item.category}</p>
                      <p className="mt-0.5 text-sm font-bold tabular-nums text-indigo-300">
                        ${item.price}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveFromCart(item.id)}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-400"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Smart Upsell */}
              {upsellProduct && (
                <div className="rounded-xl border border-indigo-500/25 bg-indigo-950/20 p-3.5">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-indigo-300">
                    Creators Also Added
                  </p>
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-white">
                        {upsellProduct.title}
                      </p>
                      <p className="text-xs text-slate-400">${upsellProduct.price} • Instant ZIP</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onAddToCart(upsellProduct)}
                      className="flex shrink-0 items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add
                    </button>
                  </div>
                </div>
              )}

              {/* Promo Code */}
              <div className="rounded-xl border border-white/10 bg-[#0F1629]/70 p-3.5">
                <label className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-300">
                  <Tag className="h-3.5 w-3.5 text-cyan-400" />
                  Promo Code (Try <span className="font-mono text-indigo-300">LAUNCH20</span> or{' '}
                  <span className="font-mono text-indigo-300">VIP50</span>)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    placeholder="Enter code..."
                    className="flex-1 rounded-lg border border-white/10 bg-[#070B14] px-3 py-2 font-mono text-xs uppercase text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => validatePromo()}
                    className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="mt-1.5 text-xs text-rose-400">{promoError}</p>}
                {appliedPromo && (
                  <p className="mt-1.5 text-xs text-emerald-400">
                    Applied {appliedPromo.code} — {appliedPromo.discountPercent}% off (-$
                    {discountAmount.toFixed(2)})
                  </p>
                )}
              </div>

              {/* Delivery Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Customer Delivery Details
                  </h4>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      stripeEnabled
                        ? 'bg-indigo-500/20 text-indigo-300'
                        : 'bg-amber-500/15 text-amber-300'
                    }`}
                  >
                    {stripeEnabled
                      ? `Stripe (${paymentConfig.stripeMode.toUpperCase()})`
                      : 'Demo Mode'}
                  </span>
                </div>

                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full rounded-xl border border-white/10 bg-[#070B14] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Email for receipt & license key"
                  className="w-full rounded-xl border border-white/10 bg-[#070B14] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />

                {stripeEnabled && !embeddedReady && (
                  <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-3 space-y-2">
                    <p className="text-[11px] font-semibold text-cyan-200">
                      Enable In-Page Card Box (Recommended for Preview)
                    </p>
                    <p className="text-[11px] text-slate-300">
                      Paste your Stripe <strong>Publishable key</strong> (starts with <code>pk_test_...</code>) so buyers pay directly here without leaving the page:
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={pubKeyInput}
                        onChange={(e) => setPubKeyInput(e.target.value)}
                        placeholder="pk_test_..."
                        className="flex-1 rounded-lg border border-white/15 bg-[#070B14] px-2.5 py-1.5 font-mono text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleSavePublishableKey}
                        disabled={savingPubKey}
                        className="rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-cyan-500 disabled:opacity-60"
                      >
                        {savingPubKey ? 'Saving...' : 'Enable'}
                      </button>
                    </div>
                  </div>
                )}

                {!stripeEnabled && (
                  <div className="grid grid-cols-3 gap-2">
                    {['Card (Instant Demo)', 'Apple Pay (Demo)', 'Crypto (Demo)'].map((method) => (
                      <button
                        type="button"
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`rounded-lg border px-2 py-2 text-[11px] font-medium transition ${
                          paymentMethod === method
                            ? 'border-indigo-500 bg-indigo-500/20 text-white'
                            : 'border-white/10 bg-[#070B14] text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {method.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="border-t border-white/10 bg-[#070B14] p-5">
              {checkoutError && (
                <p className="mb-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-2.5 text-xs font-medium text-rose-300">
                  {checkoutError}
                </p>
              )}

              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="tabular-nums">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({appliedPromo?.code})</span>
                    <span className="tabular-nums">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-white/10 pt-2 text-base font-bold text-white">
                  <span>Total</span>
                  <span className="tabular-nums">${total.toFixed(2)}</span>
                </div>
              </div>

              {embeddedReady ? (
                <div className="mt-4">
                  <StripeEmbeddedForm
                    publishableKey={paymentConfig.publishableKey}
                    customerName={customerName}
                    customerEmail={customerEmail}
                    cart={cart}
                    appliedPromo={appliedPromo}
                    total={total}
                    onError={setCheckoutError}
                    onSuccess={(order) => {
                      setCompletedOrder(order);
                      setPendingStripe(null);
                      onClearCart();
                      onOrderCompleted?.(order);
                    }}
                  />
                </div>
              ) : (
                <>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:brightness-110 disabled:opacity-60"
                  >
                    {submitting ? (
                      <span>{stripeEnabled ? 'Connecting to Stripe...' : 'Generating License & Files...'}</span>
                    ) : stripeEnabled ? (
                      <>
                        <CreditCard className="h-4 w-4" />
                        <span>Pay ${total.toFixed(2)} with Stripe</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4" />
                        <span>Complete Demo Order & Unlock Downloads</span>
                      </>
                    )}
                  </button>
                  <p className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                    <Lock className="h-3 w-3" />
                    {stripeEnabled
                      ? 'Powered by Stripe Checkout • Instant .ZIP fulfillment'
                      : '256-bit demo checkout • Stripe-ready backend'}
                  </p>
                </>
              )}
            </div>
          </form>
        )}
      </aside>
    </div>
  );
}
