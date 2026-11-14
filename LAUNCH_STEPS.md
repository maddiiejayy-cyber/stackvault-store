# How to Launch StackVault Publicly (10 Minutes)

## Option A: Deploy with Render.com (Recommended — uses `render.yaml`)
1. Create a free private repository on **GitHub.com** and upload all files from this folder (do NOT upload `.env`).
2. Sign up at **Render.com** and connect your GitHub account.
3. Click **New + → Blueprint** and select your repository. Render reads `render.yaml` automatically and sets up:
   - Build: `npm install && npm run build`
   - Start: `npm start`
   - Persistent disk for `data/store.json`
4. In Render **Environment Variables**, set:
   - `ADMIN_PASSWORD` = choose a strong password
   - `STRIPE_SECRET_KEY` = your `sk_live_...` key (after activating Stripe Live mode)
   - `STRIPE_PUBLISHABLE_KEY` = your `pk_live_...` key
   - `STRIPE_WEBHOOK_SECRET` = your `whsec_...` key from Stripe Webhooks
   - `PUBLIC_URL` = your live URL (e.g. `https://yourstore.onrender.com` or `https://yourdomain.com`)
   - *(Optional)* `RESEND_API_KEY` = your `re_...` key for automatic email receipts

## Option B: Connect Stripe Webhook for Live Payments
1. In your **Stripe Dashboard** (Live mode ON), go to **Developers → Webhooks → Add endpoint**.
2. Endpoint URL: `https://YOUR-LIVE-DOMAIN/api/stripe/webhook`
3. Select events: `payment_intent.succeeded` and `checkout.session.completed`.
4. Copy the Signing Secret (`whsec_...`) into `STRIPE_WEBHOOK_SECRET`.
