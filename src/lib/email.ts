export interface SendOtpPayload {
  to: string;
  code: string;
  subject?: string;
}

export async function sendOtpEmail(payload: SendOtpPayload): Promise<void> {
  console.log("📧 Starting email send process...");
  console.log("📧 Payload:", { to: payload.to, subject: payload.subject, codeLength: payload.code.length });
  
  // Use API endpoint - VITE_API_URL from environment, fallback to same origin
  const apiUrl = import.meta.env.VITE_API_URL || `${window.location.origin}/api/send-email`;
  console.log("🌐 Using API endpoint:", apiUrl);
  console.log("🌐 Current origin:", window.location.origin);
  
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: payload.to,
      code: payload.code,
      subject: payload.subject || "Your W-Access verification code",
    }),
  });

  console.log("📊 Response status:", response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ Server Error Response:", errorText);
    throw new Error(`Email server error: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  console.log("✅ Email sent successfully:", result);
}
