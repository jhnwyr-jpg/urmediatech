const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

interface MeetingInvitePayload {
  recipientEmail: string;
  recipientName: string;
  meetingDate: string;
  meetingTime: string;
  notes?: string;
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
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return json({ success: false, error: "Email service not configured" }, 500);
    }

    const payload: MeetingInvitePayload = await req.json();
    const { recipientEmail, recipientName, meetingDate, meetingTime, notes } = payload;

    if (!recipientEmail || !recipientName || !meetingDate || !meetingTime) {
      return json({ success: false, error: "Missing required fields" }, 400);
    }

    // Format date for display
    const formattedDate = new Date(meetingDate).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Meeting Invitation</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Meeting Scheduled!</h1>
              <p style="margin: 10px 0 0; color: #E9D5FF; font-size: 16px;">UR Media Tech</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                Hi <strong>${recipientName}</strong>,
              </p>
              <p style="margin: 0 0 30px; color: #374151; font-size: 16px; line-height: 1.6;">
                We're excited to inform you that a meeting has been scheduled with our team. Here are the details:
              </p>
              
              <!-- Meeting Details Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F5F3FF; border-radius: 12px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 24px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding-bottom: 16px;">
                          <p style="margin: 0; color: #6B7280; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">📅 Date</p>
                          <p style="margin: 4px 0 0; color: #1F2937; font-size: 18px; font-weight: 600;">${formattedDate}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 16px;">
                          <p style="margin: 0; color: #6B7280; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">⏰ Time</p>
                          <p style="margin: 4px 0 0; color: #1F2937; font-size: 18px; font-weight: 600;">${meetingTime}</p>
                        </td>
                      </tr>
                      ${notes ? `
                      <tr>
                        <td>
                          <p style="margin: 0; color: #6B7280; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">📝 Notes</p>
                          <p style="margin: 4px 0 0; color: #1F2937; font-size: 16px;">${notes}</p>
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                We look forward to speaking with you! If you need to reschedule, please contact us.
              </p>
              
              <!-- Contact Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
                <tr>
                  <td style="background: linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%); border-radius: 8px;">
                    <a href="https://wa.me/8801609252155" style="display: inline-block; padding: 14px 28px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px;">
                      Contact Us on WhatsApp
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #F9FAFB; padding: 24px 30px; text-align: center; border-top: 1px solid #E5E7EB;">
              <p style="margin: 0 0 8px; color: #6B7280; font-size: 14px;">
                UR Media Tech
              </p>
              <p style="margin: 0; color: #9CA3AF; font-size: 12px;">
                © 2024 All rights reserved
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

    // Send email via Resend
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "UR Media Tech <onboarding@resend.dev>",
        to: [recipientEmail],
        subject: `Meeting Scheduled - ${formattedDate} at ${meetingTime}`,
        html: emailHtml,
      }),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error("Resend API error:", resendData);
      return json({ success: false, error: resendData.message || "Failed to send email" }, 500);
    }

    console.log("Meeting invite sent successfully:", resendData);
    return json({ success: true, messageId: resendData.id });

  } catch (err) {
    const error = err as Error;
    console.error("Error in send-meeting-invite:", error);
    return json({ success: false, error: error.message || "An unexpected error occurred" }, 500);
  }
});
