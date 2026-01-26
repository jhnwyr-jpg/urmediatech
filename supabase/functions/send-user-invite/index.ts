const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InviteRequest {
  email: string;
  role: "admin" | "moderator" | "user";
  inviterName?: string;
  siteUrl: string;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return json({ success: false, error: "Email service not configured" }, 500);
    }

    const { email, role, inviterName, siteUrl }: InviteRequest = await req.json();

    // Validate required fields
    if (!email || !role || !siteUrl) {
      return json({ success: false, error: "Missing required fields: email, role, or siteUrl" }, 400);
    }

    const roleLabels = {
      admin: "Admin (Full Access)",
      moderator: "Moderator (Limited Access)",
      user: "User (Basic Access)",
    };

    const roleLabel = roleLabels[role] || "User";
    const loginUrl = `${siteUrl}/admin/login`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; background-color: #f4f4f5;">
          <tr>
            <td style="padding: 40px 20px;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">UR Media Tech</h1>
                    <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">Admin Panel Invitation</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 20px; color: #18181b; font-size: 24px; font-weight: 600;">You're Invited! 🎉</h2>
                    
                    <p style="margin: 0 0 20px; color: #3f3f46; font-size: 16px; line-height: 1.6;">
                      ${inviterName ? `<strong>${inviterName}</strong> has` : "You've been"} invited you to join the UR Media Tech admin panel with the following role:
                    </p>
                    
                    <!-- Role Badge -->
                    <div style="background-color: #f4f4f5; border-radius: 8px; padding: 20px; margin-bottom: 24px; text-align: center;">
                      <span style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff; padding: 8px 20px; border-radius: 20px; font-weight: 600; font-size: 14px;">
                        ${roleLabel}
                      </span>
                    </div>
                    
                    <p style="margin: 0 0 30px; color: #3f3f46; font-size: 16px; line-height: 1.6;">
                      To get started, please sign up using this email address (<strong>${email}</strong>) and then log in to access your dashboard.
                    </p>
                    
                    <!-- CTA Button -->
                    <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%;">
                      <tr>
                        <td style="text-align: center;">
                          <a href="${loginUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                            Go to Login
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 30px 0 0; color: #71717a; font-size: 14px; line-height: 1.6;">
                      If you didn't expect this invitation, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f4f4f5; padding: 24px 30px; text-align: center;">
                    <p style="margin: 0; color: #71717a; font-size: 14px;">
                      © ${new Date().getFullYear()} UR Media Tech. All rights reserved.
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Send email using Resend API directly via fetch
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "UR Media Tech <onboarding@resend.dev>",
        to: [email],
        subject: `You've been invited as ${roleLabel} - UR Media Tech`,
        html: emailHtml,
      }),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error("Resend API error:", resendData);
      return json({ success: false, error: resendData.message || "Failed to send email" }, 500);
    }

    console.log("Invitation email sent successfully:", resendData);
    return json({ success: true, data: resendData });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in send-user-invite function:", error);
    return json({ success: false, error: errorMessage }, 500);
  }
});
