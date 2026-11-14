import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import Stripe from 'stripe';
import { readDb, writeDb, generateLicenseKey } from './server/db.js';
import { buildProductZip } from './server/deliverables.js';
import {
  requireAdmin,
  createAdminToken,
  verifyAdminToken,
  extractTokenFromRequest,
  getAdminPassword
} from './server/auth.js';
import { sendOrderReceiptEmail, isEmailConfigured } from './server/mailer.js';

const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';
const IS_PROD = process.env.NODE_ENV === 'production';

let stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim() || '';
let stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY?.trim() || '';
let stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim() || '';
let stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

function saveEnvValue(key, value) {
  const envPath = path.resolve(process.cwd(), '.env');
  let content = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf-8') : '';
  const regex = new RegExp(`^${key}=.*$`, 'm');
  if (regex.test(content)) {
    content = content.replace(regex, `${key}=${value}`);
  } else {
    content = content.trimEnd() + `\n${key}=${value}\n`;
  }
  fs.writeFileSync(envPath, content, 'utf-8');
}

function getRequestOrigin(req) {
  if (process.env.PUBLIC_URL?.trim()) {
    return process.env.PUBLIC_URL.trim().replace(/\/$/, '');
  }
  const proto = (req.headers['x-forwarded-proto'] || req.protocol || 'http').toString().split(',')[0].trim();
  const host = (req.headers['x-forwarded-host'] || req.get('host') || `localhost:${PORT}`).toString().split(',')[0].trim();
  return `${proto}://${host}`;
}

function fulfillStripeOrder(session, origin = '') {
  const db = readDb();

  const existing = db.orders.find((o) => o.stripeSessionId === session.id);
  if (existing) {
    return existing;
  }

  let productIds = [];
  try {
    productIds = JSON.parse(session.metadata?.productIds || '[]');
  } catch {
    productIds = [];
  }

  const orderItems = [];
  let subtotal = 0;

  for (const pid of productIds) {
    const product = db.products.find((p) => p.id === pid);
    if (!product) continue;
    subtotal += Number(product.price);
    product.salesCount = (product.salesCount || 0) + 1;
    orderItems.push({
      productId: product.id,
      title: product.title,
      price: Number(product.price),
      licenseKey: generateLicenseKey('SV')
    });
  }

  const total = Number(((session.amount_total || 0) / 100).toFixed(2));
  const discountAmount = Number(Math.max(0, subtotal - total).toFixed(2));

  const order = {
    id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
    stripeSessionId: session.id,
    customerName:
      session.metadata?.customerName ||
      session.customer_details?.name ||
      'Stripe Customer',
    customerEmail: (
      session.customer_details?.email ||
      session.customer_email ||
      session.metadata?.customerEmail ||
      'customer@stripe.com'
    ).toLowerCase(),
    items: orderItems,
    subtotal: Number(subtotal.toFixed(2)),
    discountCode: session.metadata?.promoCode || null,
    discountAmount,
    total,
    paymentMethod: 'Stripe Checkout',
    status: 'completed',
    createdAt: new Date().toISOString()
  };

  db.orders.unshift(order);
  writeDb(db);
  sendOrderReceiptEmail({ order, origin }).catch(() => {});
  return order;
}

function fulfillStripePaymentIntent(pi, origin = '') {
  const db = readDb();
  const existing = db.orders.find((o) => o.stripePaymentIntentId === pi.id);
  if (existing) {
    return existing;
  }

  let productIds = [];
  try {
    productIds = JSON.parse(pi.metadata?.productIds || '[]');
  } catch {
    productIds = [];
  }

  const orderItems = [];
  let subtotal = 0;

  for (const pid of productIds) {
    const product = db.products.find((p) => p.id === pid);
    if (!product) continue;
    subtotal += Number(product.price);
    product.salesCount = (product.salesCount || 0) + 1;
    orderItems.push({
      productId: product.id,
      title: product.title,
      price: Number(product.price),
      licenseKey: generateLicenseKey('SV')
    });
  }

  const total = Number(((pi.amount_received || pi.amount || 0) / 100).toFixed(2));
  const discountAmount = Number(Math.max(0, subtotal - total).toFixed(2));

  const order = {
    id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
    stripePaymentIntentId: pi.id,
    customerName: pi.metadata?.customerName || 'Stripe Customer',
    customerEmail: (pi.receipt_email || pi.metadata?.customerEmail || 'customer@stripe.com').toLowerCase(),
    items: orderItems,
    subtotal: Number(subtotal.toFixed(2)),
    discountCode: pi.metadata?.promoCode || null,
    discountAmount,
    total,
    paymentMethod: 'Stripe Card (In-Page)',
    status: 'completed',
    createdAt: new Date().toISOString()
  };

  db.orders.unshift(order);
  writeDb(db);
  sendOrderReceiptEmail({ order, origin }).catch(() => {});
  return order;
}

async function startServer() {
  const app = express();
  app.set('trust proxy', true);

  // Stripe Webhook MUST receive raw body before express.json()
  app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), (req, res) => {
    if (!stripe || !stripeWebhookSecret) {
      return res.status(400).json({ error: 'Stripe webhook is not configured.' });
    }

    const sig = req.headers['stripe-signature'];
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, stripeWebhookSecret);
    } catch (err) {
      console.error('Stripe webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const origin = getRequestOrigin(req);
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      if (session.payment_status === 'paid') {
        const order = fulfillStripeOrder(session, origin);
        console.log(`Fulfilled Stripe order ${order.id} for ${order.customerEmail}`);
      }
    } else if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object;
      if (pi.metadata?.productIds) {
        const order = fulfillStripePaymentIntent(pi, origin);
        console.log(`Fulfilled Stripe PaymentIntent order ${order.id} for ${order.customerEmail}`);
      }
    }

    res.json({ received: true });
  });

  app.use(express.json({ limit: '5mb' }));
  app.use('/images', express.static(path.resolve(process.cwd(), 'public/images')));

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      ok: true,
      service: 'StackVault API',
      mode: IS_PROD ? 'production' : 'development',
      timestamp: new Date().toISOString()
    });
  });

  // Admin Authentication
  app.get('/api/admin/session', (req, res) => {
    const token = extractTokenFromRequest(req);
    res.json({ authenticated: verifyAdminToken(token) });
  });

  app.post('/api/admin/login', (req, res) => {
    const submitted = String(req.body?.password || '');
    if (!submitted || submitted !== getAdminPassword()) {
      return res.status(401).json({ error: 'Incorrect admin password.' });
    }
    const token = createAdminToken();
    res.setHeader(
      'Set-Cookie',
      `sv_admin_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`
    );
    res.json({ ok: true, token });
  });

  app.post('/api/admin/logout', (_req, res) => {
    res.setHeader('Set-Cookie', 'sv_admin_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
    res.json({ ok: true });
  });

  app.post('/api/admin/change-password', requireAdmin, (req, res) => {
    const nextPassword = String(req.body?.newPassword || '').trim();
    if (nextPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters.' });
    }
    process.env.ADMIN_PASSWORD = nextPassword;
    saveEnvValue('ADMIN_PASSWORD', nextPassword);
    const token = createAdminToken();
    res.setHeader(
      'Set-Cookie',
      `sv_admin_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`
    );
    res.json({ ok: true, token });
  });

  // Public payment & email capability flags (never exposes secrets)
  app.get('/api/payments/config', (_req, res) => {
    const isTestMode = stripeSecretKey.startsWith('sk_test_') || stripeSecretKey.startsWith('rk_test_');
    res.json({
      stripeEnabled: Boolean(stripe),
      embeddedReady: Boolean(stripe && stripePublishableKey),
      publishableKey: stripePublishableKey || '',
      webhookConfigured: Boolean(stripe && stripeWebhookSecret),
      emailConfigured: isEmailConfigured(),
      stripeMode: !stripe ? 'unconfigured' : isTestMode ? 'test' : 'live',
      checkoutMode: stripe ? 'stripe' : 'demo'
    });
  });

  // Admin-only: Configure Stripe & Email keys
  app.post('/api/payments/configure-stripe', requireAdmin, async (req, res) => {
    try {
      const key = String(req.body?.secretKey || '').trim();
      const pubKey = String(req.body?.publishableKey || '').trim();
      const webhookSecret = String(req.body?.webhookSecret || '').trim();
      const resendKey = String(req.body?.resendApiKey || '').trim();

      const nextSk = key || stripeSecretKey;
      const nextPk = pubKey || stripePublishableKey;
      if (nextSk && nextPk && nextSk.startsWith('sk_') && nextPk.startsWith('pk_')) {
        const skAcct = nextSk.replace(/^sk_(test|live)_/, '').slice(0, 14);
        const pkAcct = nextPk.replace(/^pk_(test|live)_/, '').slice(0, 14);
        if (skAcct && pkAcct && skAcct !== pkAcct) {
          return res.status(400).json({
            error:
              'Mismatch: Your Secret Key and Publishable Key belong to two different Stripe accounts or sandboxes. Copy BOTH keys from the same Stripe sandbox/account.'
          });
        }
      }

      if (key) {
        if (!/^(sk|rk)_(test|live)_/.test(key)) {
          return res.status(400).json({
            error: 'Secret Key should start with sk_test_ or sk_live_ (not pk_).'
          });
        }
        const testClient = new Stripe(key);
        await testClient.products.list({ limit: 1 });

        stripeSecretKey = key;
        stripe = testClient;
        saveEnvValue('STRIPE_SECRET_KEY', key);
      }

      if (pubKey) {
        if (!/^pk_(test|live)_/.test(pubKey)) {
          return res.status(400).json({
            error: 'Publishable Key should start with pk_test_ or pk_live_.'
          });
        }
        stripePublishableKey = pubKey;
        saveEnvValue('STRIPE_PUBLISHABLE_KEY', pubKey);
      }

      if (webhookSecret) {
        if (!webhookSecret.startsWith('whsec_')) {
          return res.status(400).json({
            error: 'Webhook signing secret should start with whsec_.'
          });
        }
        stripeWebhookSecret = webhookSecret;
        saveEnvValue('STRIPE_WEBHOOK_SECRET', webhookSecret);
      }

      if (resendKey) {
        if (!resendKey.startsWith('re_')) {
          return res.status(400).json({
            error: 'Resend API key should start with re_.'
          });
        }
        process.env.RESEND_API_KEY = resendKey;
        saveEnvValue('RESEND_API_KEY', resendKey);
      }

      const isTestMode = stripeSecretKey.startsWith('sk_test_') || stripeSecretKey.startsWith('rk_test_');
      res.json({
        ok: true,
        stripeEnabled: Boolean(stripe),
        embeddedReady: Boolean(stripe && stripePublishableKey),
        publishableKey: stripePublishableKey || '',
        webhookConfigured: Boolean(stripe && stripeWebhookSecret),
        emailConfigured: isEmailConfigured(),
        stripeMode: !stripe ? 'unconfigured' : isTestMode ? 'test' : 'live',
        checkoutMode: stripe ? 'stripe' : 'demo'
      });
    } catch (err) {
      res.status(400).json({
        error: err.message || 'Stripe rejected that key. Double-check you copied the full key.'
      });
    }
  });

  // Create PaymentIntent for in-page embedded Stripe Card checkout
  app.post('/api/stripe/create-payment-intent', async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ error: 'Stripe secret key is not configured.' });
    }
    try {
      const db = readDb();
      const { customerName, customerEmail, items, promoCode } = req.body || {};
      if (!customerName || !customerEmail || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Name, email, and at least one cart item are required.' });
      }

      let subtotal = 0;
      const productIds = [];
      for (const item of items) {
        const product = db.products.find((p) => p.id === item.productId && p.active !== false);
        if (!product) {
          return res.status(404).json({ error: `Product ${item.productId} not found.` });
        }
        subtotal += Number(product.price);
        productIds.push(product.id);
      }

      let appliedPromo = null;
      let discountAmount = 0;
      if (promoCode) {
        const normalized = String(promoCode).trim().toUpperCase();
        appliedPromo = db.promoCodes.find((p) => p.code === normalized && p.active) || null;
        if (appliedPromo) {
          discountAmount = (subtotal * appliedPromo.discountPercent) / 100;
        }
      }

      const total = Math.max(0.5, Number((subtotal - discountAmount).toFixed(2)));
      const pi = await stripe.paymentIntents.create({
        amount: Math.round(total * 100),
        currency: 'usd',
        automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
        receipt_email: String(customerEmail).trim().toLowerCase(),
        description: `StackVault Order (${productIds.length} digital item${productIds.length > 1 ? 's' : ''})`,
        metadata: {
          customerName: String(customerName).trim(),
          customerEmail: String(customerEmail).trim().toLowerCase(),
          productIds: JSON.stringify(productIds),
          promoCode: appliedPromo ? appliedPromo.code : ''
        }
      });

      res.json({
        clientSecret: pi.client_secret,
        paymentIntentId: pi.id,
        amount: total
      });
    } catch (err) {
      console.error('PaymentIntent error:', err);
      res.status(500).json({ error: err.message || 'Could not initialize card payment.' });
    }
  });

  // Confirm PaymentIntent and unlock instant .ZIP downloads
  app.post('/api/stripe/confirm-payment-intent', async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ error: 'Stripe is not configured.' });
    }
    try {
      const paymentIntentId = String(req.body?.paymentIntentId || '').trim();
      if (!paymentIntentId) {
        return res.status(400).json({ error: 'Missing paymentIntentId' });
      }
      const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (pi.status !== 'succeeded') {
        return res.status(402).json({ error: `Payment status is ${pi.status}, not succeeded.` });
      }
      const order = fulfillStripePaymentIntent(pi, getRequestOrigin(req));
      res.json({ order });
    } catch (err) {
      console.error('Confirm PaymentIntent error:', err);
      res.status(500).json({ error: err.message || 'Failed to verify card payment.' });
    }
  });

  // Create Stripe Checkout Session (redirect mode fallback)
  app.post('/api/stripe/create-checkout-session', async (req, res) => {
    if (!stripe) {
      return res.status(503).json({
        error: 'Stripe is not configured yet. Add STRIPE_SECRET_KEY in Seller Admin.'
      });
    }

    try {
      const db = readDb();
      const { customerName, customerEmail, items, promoCode } = req.body || {};

      if (!customerName || !customerEmail || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Name, email, and at least one cart item are required.' });
      }

      const lineItems = [];
      const productIds = [];

      for (const item of items) {
        const product = db.products.find((p) => p.id === item.productId && p.active !== false);
        if (!product) {
          return res.status(404).json({ error: `Product ${item.productId} not found.` });
        }
        productIds.push(product.id);
        lineItems.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.title,
              description: product.tagline,
              tax_code: 'txcd_10000000'
            },
            unit_amount: Math.round(Number(product.price) * 100)
          },
          quantity: 1
        });
      }

      let appliedPromo = null;
      const discounts = [];
      if (promoCode) {
        const normalized = String(promoCode).trim().toUpperCase();
        appliedPromo = db.promoCodes.find((p) => p.code === normalized && p.active) || null;
        if (appliedPromo) {
          const coupon = await stripe.coupons.create({
            percent_off: appliedPromo.discountPercent,
            duration: 'once',
            name: appliedPromo.code
          });
          discounts.push({ coupon: coupon.id });
        }
      }

      const origin = getRequestOrigin(req);
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        customer_email: String(customerEmail).trim().toLowerCase(),
        line_items: lineItems,
        ...(discounts.length > 0 ? { discounts } : {}),
        metadata: {
          customerName: String(customerName).trim(),
          customerEmail: String(customerEmail).trim().toLowerCase(),
          productIds: JSON.stringify(productIds),
          promoCode: appliedPromo ? appliedPromo.code : ''
        },
        success_url: `${origin}/?stripe_session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/?checkout_canceled=1`
      });

      res.json({ url: session.url, sessionId: session.id });
    } catch (err) {
      console.error('Stripe session error:', err);
      res.status(500).json({ error: err.message || 'Failed to create Stripe Checkout session.' });
    }
  });

  // Verify completed Stripe Checkout session
  app.get('/api/stripe/verify-session', async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ error: 'Stripe is not configured.' });
    }
    const sessionId = String(req.query.session_id || '').trim();
    if (!sessionId) {
      return res.status(400).json({ error: 'Missing session_id' });
    }

    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status !== 'paid') {
        return res.status(402).json({ error: 'Payment has not completed yet.' });
      }
      const order = fulfillStripeOrder(session, getRequestOrigin(req));
      res.json({ order });
    } catch (err) {
      console.error('Stripe verify-session error:', err);
      res.status(500).json({ error: 'Could not verify Stripe session.' });
    }
  });

  // Public product listing (only returns inactive if admin authenticated)
  app.get('/api/products', (req, res) => {
    const db = readDb();
    const { category, q, sort, includeInactive } = req.query;
    const isAdmin = verifyAdminToken(extractTokenFromRequest(req));

    let items = [...db.products];
    if (!(includeInactive === 'true' && isAdmin)) {
      items = items.filter((p) => p.active !== false);
    }

    if (category && category !== 'All') {
      items = items.filter((p) => p.category.toLowerCase() === String(category).toLowerCase());
    }

    if (q) {
      const needle = String(q).toLowerCase().trim();
      items = items.filter(
        (p) =>
          p.title.toLowerCase().includes(needle) ||
          p.tagline.toLowerCase().includes(needle) ||
          p.category.toLowerCase().includes(needle) ||
          (p.format || '').toLowerCase().includes(needle)
      );
    }

    switch (sort) {
      case 'price-asc':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        items.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        items.sort((a, b) => b.rating - a.rating || b.salesCount - a.salesCount);
        break;
      case 'newest':
        items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'popular':
      default:
        items.sort((a, b) => b.salesCount - a.salesCount);
        break;
    }

    res.json({ products: items });
  });

  // Admin-only product mutations
  app.post('/api/products', requireAdmin, (req, res) => {
    const db = readDb();
    const body = req.body || {};

    if (!body.title || !body.price || !body.category) {
      return res.status(400).json({ error: 'Title, category, and price are required.' });
    }

    const price = Number(body.price);
    if (!Number.isFinite(price) || price <= 0) {
      return res.status(400).json({ error: 'Price must be a positive number.' });
    }

    const slug = String(body.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const categoryDefaultImage = {
      'AI & Automation': '/images/ai-vault.png',
      'Notion Systems': '/images/notion-os.png',
      'UI & Design Kits': '/images/darkforge-ui.png',
      'Courses & Playbooks': '/images/launch-playbook.png'
    };

    const newProduct = {
      id: `prod-${Date.now()}`,
      slug,
      title: String(body.title).trim(),
      tagline: String(body.tagline || 'High-demand digital kit ready for instant download.').trim(),
      description: String(
        body.description ||
          'Built for modern creators and operators. Includes instant ZIP delivery, commercial rights, and lifetime updates.'
      ).trim(),
      category: String(body.category).trim(),
      price,
      compareAtPrice: body.compareAtPrice ? Number(body.compareAtPrice) : Math.round(price * 1.8),
      badge: String(body.badge || 'New Drop').trim(),
      rating: 5.0,
      reviewCount: 1,
      salesCount: 0,
      image: body.image || categoryDefaultImage[body.category] || '/images/ai-vault.png',
      format: String(body.format || 'ZIP • Digital Kit + Docs').trim(),
      fileSize: String(body.fileSize || '14.2 MB').trim(),
      featured: Boolean(body.featured),
      active: true,
      createdAt: new Date().toISOString(),
      highlights: Array.isArray(body.highlights) && body.highlights.length
        ? body.highlights
        : [
            'Instant ZIP download after checkout',
            'Commercial & personal usage license included',
            'Step-by-step quick-start documentation',
            'Lifetime free product updates'
          ],
      deliverables: Array.isArray(body.deliverables) && body.deliverables.length
        ? body.deliverables
        : ['01_Main_Resource.md', '02_Templates_and_Assets.json'],
      previewSnippet: {
        title: 'Included Resource Overview',
        language: 'markdown',
        code:
          body.previewCode ||
          `# ${String(body.title).trim()}\n- Ready for immediate implementation\n- Verified StackVault commercial asset`
      }
    };

    db.products.unshift(newProduct);
    writeDb(db);
    res.status(201).json({ product: newProduct });
  });

  app.patch('/api/products/:id', requireAdmin, (req, res) => {
    const db = readDb();
    const idx = db.products.findIndex((p) => p.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const allowedFields = [
      'title',
      'tagline',
      'description',
      'category',
      'price',
      'compareAtPrice',
      'badge',
      'featured',
      'active',
      'format'
    ];
    const updated = { ...db.products[idx] };
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updated[key] =
          key === 'price' || key === 'compareAtPrice' ? Number(req.body[key]) : req.body[key];
      }
    }

    db.products[idx] = updated;
    writeDb(db);
    res.json({ product: updated });
  });

  app.delete('/api/products/:id', requireAdmin, (req, res) => {
    const db = readDb();
    const exists = db.products.some((p) => p.id === req.params.id);
    if (!exists) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    db.products = db.products.filter((p) => p.id !== req.params.id);
    writeDb(db);
    res.json({ ok: true });
  });

  // Public promo validation; Admin-only promo management
  app.post('/api/promo/validate', (req, res) => {
    const db = readDb();
    const code = String(req.body?.code || '').trim().toUpperCase();
    const found = db.promoCodes.find((c) => c.code.toUpperCase() === code && c.active);
    if (!found) {
      return res.status(404).json({ error: 'Invalid or expired promo code.' });
    }
    res.json({ promo: found });
  });

  app.get('/api/promos', requireAdmin, (_req, res) => {
    const db = readDb();
    res.json({ promoCodes: db.promoCodes });
  });

  app.post('/api/promos', requireAdmin, (req, res) => {
    const db = readDb();
    const code = String(req.body?.code || '').trim().toUpperCase();
    const discountPercent = Number(req.body?.discountPercent);
    if (!code || !Number.isFinite(discountPercent) || discountPercent <= 0 || discountPercent > 95) {
      return res.status(400).json({ error: 'Provide a valid code and discount between 1% and 95%.' });
    }
    if (db.promoCodes.some((p) => p.code === code)) {
      return res.status(409).json({ error: 'Promo code already exists.' });
    }
    const promo = {
      code,
      discountPercent,
      label: String(req.body?.label || `${discountPercent}% Off`),
      active: true
    };
    db.promoCodes.push(promo);
    writeDb(db);
    res.status(201).json({ promo });
  });

  app.delete('/api/promos/:code', requireAdmin, (req, res) => {
    const db = readDb();
    const target = String(req.params.code).toUpperCase();
    db.promoCodes = db.promoCodes.filter((p) => p.code !== target);
    writeDb(db);
    res.json({ ok: true });
  });

  // Demo checkout fallback (when Stripe is not configured)
  app.post('/api/checkout', (req, res) => {
    const db = readDb();
    const { customerName, customerEmail, items, promoCode, paymentMethod } = req.body || {};

    if (!customerName || !customerEmail || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Name, email, and at least one cart item are required.' });
    }

    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = db.products.find((p) => p.id === item.productId);
      if (!product) {
        return res.status(404).json({ error: `Product ${item.productId} not found.` });
      }
      subtotal += Number(product.price);
      product.salesCount = (product.salesCount || 0) + 1;

      orderItems.push({
        productId: product.id,
        title: product.title,
        price: Number(product.price),
        licenseKey: generateLicenseKey('SV')
      });
    }

    let appliedPromo = null;
    let discountAmount = 0;
    if (promoCode) {
      const normalized = String(promoCode).trim().toUpperCase();
      appliedPromo = db.promoCodes.find((p) => p.code === normalized && p.active) || null;
      if (appliedPromo) {
        discountAmount = Number(((subtotal * appliedPromo.discountPercent) / 100).toFixed(2));
      }
    }

    const total = Number(Math.max(0, subtotal - discountAmount).toFixed(2));
    const order = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      customerName: String(customerName).trim(),
      customerEmail: String(customerEmail).trim().toLowerCase(),
      items: orderItems,
      subtotal: Number(subtotal.toFixed(2)),
      discountCode: appliedPromo ? appliedPromo.code : null,
      discountAmount,
      total,
      paymentMethod: String(paymentMethod || 'Card (Demo)'),
      status: 'completed',
      createdAt: new Date().toISOString()
    };

    db.orders.unshift(order);
    writeDb(db);
    sendOrderReceiptEmail({ order, origin: getRequestOrigin(req) }).catch(() => {});

    res.status(201).json({ order });
  });

  // Orders lookup: buyers can filter by exact email; full orders list requires Admin
  app.get('/api/orders', (req, res) => {
    const db = readDb();
    const email = req.query.email ? String(req.query.email).trim().toLowerCase() : null;
    if (!email) {
      const token = extractTokenFromRequest(req);
      if (!verifyAdminToken(token)) {
        return res.status(401).json({ error: 'Admin authentication required for full order list.' });
      }
      return res.json({ orders: db.orders });
    }
    const orders = db.orders.filter((o) => o.customerEmail.toLowerCase() === email);
    res.json({ orders });
  });

  // Real .ZIP digital product download endpoint
  app.get('/api/orders/:orderId/download/:productId', async (req, res) => {
    try {
      const db = readDb();
      const order = db.orders.find((o) => o.id === req.params.orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found.' });
      }
      const orderItem = order.items.find((i) => i.productId === req.params.productId);
      if (!orderItem) {
        return res.status(403).json({ error: 'Product not included in this order.' });
      }
      const product = db.products.find((p) => p.id === req.params.productId);
      if (!product) {
        return res.status(404).json({ error: 'Product catalog entry not found.' });
      }

      const zipBuffer = await buildProductZip({
        product,
        order,
        licenseKey: orderItem.licenseKey
      });

      const filename = `${product.slug || product.id}.zip`;
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(zipBuffer);
    } catch (err) {
      console.error('Download generation error:', err);
      res.status(500).json({ error: 'Failed to generate download package.' });
    }
  });

  // Newsletter signup
  app.post('/api/newsletter', (req, res) => {
    const db = readDb();
    const email = String(req.body?.email || '').trim().toLowerCase();
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required.' });
    }
    if (!db.subscribers.includes(email)) {
      db.subscribers.push(email);
      writeDb(db);
    }
    res.json({ ok: true, message: 'Subscribed! Check your inbox for your weekly free drop.' });
  });

  // Admin-only overview analytics
  app.get('/api/admin/stats', requireAdmin, (_req, res) => {
    const db = readDb();
    const totalRevenue = db.orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
    const totalOrders = db.orders.length;
    const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;
    const activeProducts = db.products.filter((p) => p.active !== false).length;

    const categorySales = {};
    for (const p of db.products) {
      categorySales[p.category] = (categorySales[p.category] || 0) + (p.salesCount || 0) * Number(p.price || 0);
    }

    res.json({
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalOrders,
      avgOrderValue: Number(avgOrderValue.toFixed(2)),
      activeProducts,
      subscriberCount: db.subscribers.length,
      categorySales
    });
  });

  // Production static bundle vs. Development Vite middleware
  if (IS_PROD) {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        allowedHosts: true
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, HOST, () => {
    console.log(
      `StackVault (${IS_PROD ? 'PRODUCTION' : 'DEV'}) at http://${HOST}:${PORT} | Checkout: ${
        stripe ? `Stripe (${stripeSecretKey.startsWith('sk_test_') ? 'TEST' : 'LIVE'})` : 'Demo'
      }`
    );
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
