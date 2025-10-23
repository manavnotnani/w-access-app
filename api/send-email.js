// Vercel serverless function for ZeptoMail email sending
// This file will be automatically deployed as a serverless function on Vercel

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, code, subject } = req.body;
    
    if (!to || !code) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const token = process.env.ZEPTO_ZOHO_TOKEN;
    if (!token) {
      return res.status(500).json({ error: 'ZEPTO_ZOHO_TOKEN not configured' });
    }

    // Your beautiful HTML template
    const html = `
    <!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>W-Access Verification Code</title>
  <style>
    @media only screen and (max-width: 600px) {
      .otp-code {
        font-size: 36px !important;
        letter-spacing: 8px !important;
        padding: 20px !important;
        background-color: #000000 !important;
        color: #ffffff !important;
        border: 2px solid #ffffff !important;
        border-radius: 12px !important;
        text-shadow: 0 0 10px rgba(255,255,255,0.5) !important;
      }
      .otp-container {
        padding: 24px !important;
        margin: 0 16px 32px 16px !important;
      }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background-color:#111111;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.4);border:1px solid #1f1f1f;">
    
    <!-- Header with Logo -->
    <div style="background-color:#000000;padding:48px 24px;text-align:center;position:relative;">
      <img src="https://ik.imagekit.io/waccess/transparent_logo.png" alt="W-Access" style="height:96px;width:auto;margin-bottom:16px;filter:brightness(1.2);" />
      <h1 style="color:#ffffff;margin:0;font-size:32px;font-weight:700;letter-spacing:-0.025em;">W-Access</h1>
      <p style="color:#a1a1aa;margin:8px 0 0 0;font-size:16px;font-weight:500;">Secure Wallet Recovery</p>
    </div>
    
    <!-- Main Content -->
    <div style="padding:48px 32px;background-color:#111111;">
      <h2 style="color:#ffffff;margin:0 0 20px 0;font-size:24px;font-weight:600;text-align:center;letter-spacing:-0.025em;">Your Verification Code</h2>
      <p style="color:#a1a1aa;margin:0 0 40px 0;font-size:16px;line-height:1.6;text-align:center;">
        Use the following code to complete your verification:
      </p>
      
      <!-- OTP Code Box -->
      <div class="otp-container" style="background:linear-gradient(135deg,#1a1a1a 0%,#2d2d2d 100%);border:2px solid #374151;border-radius:16px;padding:32px;text-align:center;margin:0 0 40px 0;position:relative;box-shadow:0 4px 16px rgba(0,0,0,0.2);">
        <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:radial-gradient(circle at 50% 50%, rgba(99,102,241,0.05) 0%, transparent 70%);border-radius:14px;"></div>
        <div class="otp-code" style="position:relative;z-index:1;font-size:42px;font-weight:700;letter-spacing:14px;color:#ffffff !important;font-family:'Courier New',monospace;text-shadow:0 2px 8px rgba(0,0,0,0.3);background-color:#000000;padding:16px;border-radius:8px;border:1px solid #ffffff;">
          ${code}
        </div>
      </div>
      
      <!-- Security Notice -->
      <div style="background:linear-gradient(135deg,#1f2937 0%,#111827 100%);border:1px solid #374151;border-radius:12px;padding:20px;margin:0 0 32px 0;position:relative;">
        <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:radial-gradient(circle at 20% 20%, rgba(251,191,36,0.1) 0%, transparent 50%);border-radius:11px;"></div>
        <p style="color:#fbbf24;margin:0;font-size:14px;line-height:1.5;position:relative;z-index:1;">
          <strong style="color:#fcd34d;">🔒 Security Notice:</strong> This code expires in 10 minutes and can only be used once. 
          If you didn't request this code, please ignore this email.
        </p>
      </div>
      
      <!-- Footer Text -->
      <p style="color:#71717a;margin:0;font-size:14px;line-height:1.5;text-align:center;">
        This email was sent by W-Access. For security reasons, please do not share this code with anyone.
      </p>
    </div>
    
    <!-- Footer -->
    <div style="background:linear-gradient(135deg,#0a0a0a 0%,#1a1a1a 100%);padding:32px 24px;text-align:center;border-top:1px solid #1f1f1f;position:relative;">
      <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:radial-gradient(circle at 50% 0%, rgba(99,102,241,0.05) 0%, transparent 50%);"></div>
      <div style="position:relative;z-index:1;">
        <p style="color:#71717a;margin:0 0 8px 0;font-size:12px;font-weight:500;">
          © 2025 W-Access. All rights reserved.
        </p>
        <p style="color:#52525b;margin:0;font-size:12px;">
          Secure • Private • Decentralized
        </p>
      </div>
    </div>
    
  </div>
</body>
</html>
    `;

    // Prepare request data - matching the working format
    const requestData = {
      from: {
        address: "admin.w-access@w-access.xyz"
      },
      to: [
        {
          email_address: {
            address: to,
            name: "W-Access"
          }
        }
      ],
      subject: subject || 'Your W-Access verification code',
      htmlbody: html,
    };

    // Call ZeptoMail API - token already includes Zoho-enczapikey prefix
    const response = await fetch('https://api.zeptomail.in/v1.1/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ZeptoMail API error: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    res.status(200).json({ success: true, data: result });

  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ error: error.message });
  }
}
