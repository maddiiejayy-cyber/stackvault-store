import React, { useMemo, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, Lock } from 'lucide-react';

function InnerCardForm({
  customerName,
  customerEmail,
  cart,
  appliedPromo,
  total,
  onSuccess,
  onError
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  async function handlePay(e) {
    e.preventDefault();
    onError('');

    if (!customerName.trim()) {
      onError('Please enter your full name.');
      return;
    }
    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      onError('Please enter a valid email address.');
      return;
    }
    if (!stripe || !elements) {
      onError('Stripe card form is still loading. Please wait a second.');
      return;
    }

    setProcessing(true);
    try {
      // 1. Create server-authoritative PaymentIntent
      const intentRes = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          promoCode: appliedPromo?.code || null,
          items: cart.map((item) => ({ productId: item.id }))
        })
      });
      const intentData = await intentRes.json();
      if (!intentRes.ok || !intentData.clientSecret) {
        onError(intentData.error || 'Could not initialize payment.');
        setProcessing(false);
        return;
      }

      // 2. Confirm card payment right inside the page (no redirect!)
      const cardElement = elements.getElement(CardElement);
      const { error, paymentIntent } = await stripe.confirmCardPayment(intentData.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: customerName.trim(),
            email: customerEmail.trim()
          }
        }
      });

      if (error) {
        onError(error.message || 'Card payment failed.');
        setProcessing(false);
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        const confirmRes = await fetch('/api/stripe/confirm-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentIntentId: paymentIntent.id })
        });
        const confirmData = await confirmRes.json();
        if (!confirmRes.ok || !confirmData.order) {
          onError(confirmData.error || 'Payment succeeded, but order unlock failed.');
          setProcessing(false);
          return;
        }
        onSuccess(confirmData.order);
      } else {
        onError(`Payment status: ${paymentIntent?.status || 'incomplete'}`);
      }
    } catch {
      onError('Network error processing card payment.');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-white/15 bg-[#070B14] px-3.5 py-3">
        <CardElement
          options={{
            hidePostalCode: false,
            style: {
              base: {
                color: '#F8FAFC',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '14px',
                iconColor: '#22D3EE',
                '::placeholder': { color: '#64748B' }
              },
              invalid: {
                color: '#FB7185',
                iconColor: '#FB7185'
              }
            }
          }}
        />
      </div>

      <button
        type="button"
        onClick={handlePay}
        disabled={processing || !stripe}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:brightness-110 disabled:opacity-60"
      >
        <CreditCard className="h-4 w-4" />
        <span>{processing ? 'Processing Payment...' : `Pay $${total.toFixed(2)} Now`}</span>
      </button>

      <p className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
        <Lock className="h-3 w-3" />
        Secured in-page by Stripe • Instant .ZIP unlock
      </p>
    </div>
  );
}

export function StripeEmbeddedForm({
  publishableKey,
  customerName,
  customerEmail,
  cart,
  appliedPromo,
  total,
  onSuccess,
  onError
}) {
  const stripePromise = useMemo(
    () => (publishableKey ? loadStripe(publishableKey) : null),
    [publishableKey]
  );

  if (!stripePromise) return null;

  return (
    <Elements stripe={stripePromise}>
      <InnerCardForm
        customerName={customerName}
        customerEmail={customerEmail}
        cart={cart}
        appliedPromo={appliedPromo}
        total={total}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
}
