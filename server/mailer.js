export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export async function sendOrderReceiptEmail({ order, origin }) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey || !order?.customerEmail) {
    return { sent: false, reason: 'RESEND_API_KEY not configured' };
  }

  const fromEmail = process.env.FROM_EMAIL?.trim() || 'StackVault <onboarding@resend.dev>';
  const baseUrl = (process.env.PUBLIC_URL?.trim() || origin || '').replace(/\/$/, '');

  const itemsHtml = order.items
    .map((item) => {
      const downloadUrl = `${baseUrl}/api/orders/${order.id}/download/${item.productId}`;
      return `
        <div style="padding:14px;border:1px solid #1e293b;border-radius:10px;background:#0f1629;margin-bottom:12px;">
          <div style="font-weight:700;color:#ffffff;font-size:15px;">${item.title}</div>
          <div style="margin-top:6px;font-family:monospace;font-size:12px;color:#a5b4fc;">License Key: ${item.licenseKey}</div>
          <div style="margin-top:10px;">
            <a href="${downloadUrl}" style="display:inline-block;padding:8px 14px;background:#4f46e5;color:#ffffff;text-decoration:none;border-radius:8px;font-size:12px;font-weight:600;">Download .ZIP Package</a>
          </div>
        </div>
      `;
    })
    .join('');

  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;background:#070b14;color:#f1f5f9;padding:32px 16px;">
      <div style="max-width:560px;margin:0 auto;background:#0b1120;border:1px solid #1e293b;border-radius:16px;padding:24px;">
        <h2 style="margin:0 0 8px;color:#ffffff;">Thank you for your StackVault order!</h2>
        <p style="margin:0 0 20px;color:#94a3b8;font-size:14px;">Order <strong>${order.id}</strong> • Paid $${Number(order.total).toFixed(2)}</p>
        ${itemsHtml}
        <p style="margin-top:20px;color:#64748b;font-size:12px;">Keep this email for your license keys and anytime re-downloads.</p>
      </div>
    </div>
  `;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [order.customerEmail],
        subject: `Your StackVault Downloads & License Key (${order.id})`,
        html
      })
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error('Resend email error:', errText);
      return { sent: false, reason: errText };
    }
    return { sent: true };
  } catch (err) {
    console.error('Failed to send receipt email:', err);
    return { sent: false, reason: err.message };
  }
}
