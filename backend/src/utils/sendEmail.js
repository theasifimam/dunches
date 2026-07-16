import transporter from '../config/email.js';

const ADMIN_EMAIL = 'theasifimam@gmail.com';

export const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `"Dunches" <noreply@dunches.com>`,
    to,
    subject,
    html,
  });
};

export const sendOTPEmail = async (to, otp, purpose) => {
  const isVerify = purpose === 'verify';
  const isReset = purpose === 'reset';
  const subject = isVerify
    ? 'Verify Your Email – Rajul Eye'
    : isReset
      ? 'Password Reset OTP – Rajul Eye'
      : 'Account Deletion OTP – Rajul Eye';
  const heading = isVerify ? 'Email Verification' : isReset ? 'Password Reset' : 'Account Deletion';
  const message = isVerify
    ? 'Use the OTP below to verify your email address.'
    : isReset
      ? 'Use the OTP below to reset your password.'
      : 'Use the OTP below to confirm your account deletion. This action is irreversible.';

  const html = `
    
    
    
      
      
        body { font-family: 'Segoe UI', sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 520px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .header { background: #1a1a2e; padding: 32px; text-align: center; }
        .header h1 { color: #e2b96f; margin: 0; font-size: 24px; letter-spacing: 1px; }
        .body { padding: 36px 32px; }
        .body h2 { color: #1a1a2e; margin-top: 0; }
        .body p { color: #555; line-height: 1.6; }
        .otp-box { background: #f0f0f0; border-radius: 8px; text-align: center; padding: 20px; margin: 24px 0; }
        .otp { font-size: 36px; font-weight: 700; letter-spacing: 10px; color: #1a1a2e; }
        .expiry { color: #888; font-size: 13px; margin-top: 8px; }
        .footer { background: #f9f9f9; padding: 16px 32px; text-align: center; color: #aaa; font-size: 12px; border-top: 1px solid #eee; }
      
    
    
      
        👓 Rajul Eye
        
          ${heading}
          ${message}
          
            ${otp}
            Expires in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes
          
          If you did not request this, please ignore this email.
        
        © ${new Date().getFullYear()} Rajul Eye. All rights reserved.
      
    
    
  `;

  await sendEmail({ to, subject, html });
};

// ─── Admin Alert: New Order ───────────────────────────────────────────────────
export const sendNewOrderAdminEmail = async (order, user) => {
  const itemRows = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:10px 16px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#333;">${item.name}</td>
          <td style="padding:10px 16px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#555;text-align:center;">x${item.qty}</td>
          <td style="padding:10px 16px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#333;text-align:right;">Rs.${(item.price * item.qty).toFixed(2)}</td>
        </tr>`
    )
    .join('');

  const orderId = String(order._id).slice(-8).toUpperCase();
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>New Order Alert</title></head>
    <body style="margin:0;padding:0;background:#f4f6f8;font-family:'Segoe UI',Arial,sans-serif;">
      <div style="max-width:560px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <div style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);padding:32px;text-align:center;">
          <div style="font-size:42px;margin-bottom:12px;">&#128717;</div>
          <h1 style="color:#e2b96f;margin:0;font-size:22px;letter-spacing:1px;">New Order Received</h1>
          <p style="color:rgba(255,255,255,0.6);margin:8px 0 0;font-size:12px;text-transform:uppercase;letter-spacing:2px;">Dunches Admin Alert</p>
        </div>
        <div style="padding:32px;">
          <p style="color:#555;font-size:14px;margin:0 0 24px;">A new order has been placed on your store. Here are the details:</p>
          <div style="background:#f8f9ff;border-radius:12px;padding:20px;margin-bottom:24px;border-left:4px solid #e2b96f;">
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:4px 0;font-size:12px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:1px;width:140px;">Order ID</td><td style="padding:4px 0;font-size:13px;color:#333;font-weight:700;">#${orderId}</td></tr>
              <tr><td style="padding:4px 0;font-size:12px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Customer</td><td style="padding:4px 0;font-size:13px;color:#333;">${user?.name || order.shippingAddress?.fullName || 'Guest'}</td></tr>
              <tr><td style="padding:4px 0;font-size:12px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Email</td><td style="padding:4px 0;font-size:13px;color:#333;">${user?.email || '-'}</td></tr>
              <tr><td style="padding:4px 0;font-size:12px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Payment</td><td style="padding:4px 0;font-size:13px;color:#333;text-transform:uppercase;">${order.paymentMethod}</td></tr>
              <tr><td style="padding:4px 0;font-size:12px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Ship To</td><td style="padding:4px 0;font-size:13px;color:#333;">${order.shippingAddress?.city}, ${order.shippingAddress?.state} ${order.shippingAddress?.pincode}</td></tr>
            </table>
          </div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <thead><tr style="background:#f0f0f0;">
              <th style="padding:10px 16px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#666;text-align:left;">Item</th>
              <th style="padding:10px 16px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#666;text-align:center;">Qty</th>
              <th style="padding:10px 16px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#666;text-align:right;">Amount</th>
            </tr></thead>
            <tbody>${itemRows}</tbody>
          </table>
          <div style="text-align:right;border-top:2px solid #e2b96f;padding-top:16px;">
            <span style="font-size:13px;color:#888;">Order Total: </span>
            <span style="font-size:22px;font-weight:800;color:#1a1a2e;">Rs.${order.finalAmount.toFixed(2)}</span>
          </div>
          <div style="text-align:center;margin-top:32px;">
            <a href="http://localhost:4001/orders" style="display:inline-block;background:#e2b96f;color:#1a1a2e;text-decoration:none;padding:14px 32px;border-radius:50px;font-weight:700;font-size:13px;letter-spacing:1px;text-transform:uppercase;">View in Admin Panel</a>
          </div>
        </div>
        <div style="background:#f9f9f9;padding:16px 32px;text-align:center;border-top:1px solid #eee;">
          <p style="color:#aaa;font-size:11px;margin:0;">Dunches Admin - Automated alert. Do not reply.</p>
        </div>
      </div>
    </body></html>`;

  try {
    await sendEmail({
      to: ADMIN_EMAIL,
      subject: `New Order #${orderId} - Rs.${order.finalAmount.toFixed(2)} (${order.paymentMethod.toUpperCase()})`,
      html,
    });
  } catch (err) {
    console.error('[AdminEmail] Failed to send new order alert:', err.message);
  }
};

// ─── Admin Alert: New Review / Complaint ─────────────────────────────────────
export const sendNewComplaintAdminEmail = async (review, user, product) => {
  const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
  const isLowRating = review.rating <= 2;
  const accentColor = isLowRating ? '#ef4444' : '#e2b96f';
  const typeLabel = isLowRating ? 'Low Rating Alert' : 'New Review Submitted';
  const emoji = isLowRating ? '&#9888;' : '&#128172;';

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>New Review Alert</title></head>
    <body style="margin:0;padding:0;background:#f4f6f8;font-family:'Segoe UI',Arial,sans-serif;">
      <div style="max-width:560px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <div style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);padding:32px;text-align:center;">
          <div style="font-size:42px;margin-bottom:12px;">${emoji}</div>
          <h1 style="color:${accentColor};margin:0;font-size:22px;letter-spacing:1px;">${typeLabel}</h1>
          <p style="color:rgba(255,255,255,0.6);margin:8px 0 0;font-size:12px;text-transform:uppercase;letter-spacing:2px;">Dunches Admin Alert</p>
        </div>
        <div style="padding:32px;">
          <div style="background:#f8f9ff;border-radius:12px;padding:20px;margin-bottom:24px;border-left:4px solid ${accentColor};">
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:4px 0;font-size:12px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:1px;width:140px;">Customer</td><td style="padding:4px 0;font-size:13px;color:#333;font-weight:700;">${user?.name || 'Unknown'}</td></tr>
              <tr><td style="padding:4px 0;font-size:12px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Email</td><td style="padding:4px 0;font-size:13px;color:#333;">${user?.email || '-'}</td></tr>
              <tr><td style="padding:4px 0;font-size:12px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Product</td><td style="padding:4px 0;font-size:13px;color:#333;">${product?.name || 'Unknown Product'}</td></tr>
              <tr><td style="padding:4px 0;font-size:12px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Rating</td><td style="padding:4px 0;font-size:16px;color:${accentColor};letter-spacing:2px;">${stars} (${review.rating}/5)</td></tr>
              ${review.title ? `<tr><td style="padding:4px 0;font-size:12px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Title</td><td style="padding:4px 0;font-size:13px;color:#333;font-style:italic;">"${review.title}"</td></tr>` : ''}
            </table>
          </div>
          <div style="background:#fff8f0;border-radius:12px;padding:20px;margin-bottom:24px;border:1px solid #f0e0c0;">
            <p style="font-size:11px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">Review Comment</p>
            <p style="font-size:14px;color:#333;line-height:1.7;margin:0;font-style:italic;">"${review.comment}"</p>
          </div>
          <div style="text-align:center;margin-top:24px;">
            <a href="http://localhost:4001/customers" style="display:inline-block;background:${accentColor};color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:50px;font-weight:700;font-size:13px;letter-spacing:1px;text-transform:uppercase;">View in Admin Panel</a>
          </div>
        </div>
        <div style="background:#f9f9f9;padding:16px 32px;text-align:center;border-top:1px solid #eee;">
          <p style="color:#aaa;font-size:11px;margin:0;">Dunches Admin - Automated alert. Do not reply.</p>
        </div>
      </div>
    </body></html>`;

  try {
    await sendEmail({
      to: ADMIN_EMAIL,
      subject: `${isLowRating ? '[Low Rating]' : '[New Review]'} "${product?.name || 'a product'}" - ${review.rating} stars by ${user?.name || 'a customer'}`,
      html,
    });
  } catch (err) {
    console.error('[AdminEmail] Failed to send review alert:', err.message);
  }
};
