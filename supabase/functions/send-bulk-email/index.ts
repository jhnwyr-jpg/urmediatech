import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BulkEmailRequest {
  recipients: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  textContent?: string;
}

interface ResendEmailPayload {
  from: string;
  to: string[];
  subject: string;
  html: string;
  text?: string;
}

async function sendEmail(payload: ResendEmailPayload) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${error}`);
  }

  return await response.json();
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipients, subject, htmlContent, textContent }: BulkEmailRequest = await req.json();

    // Validate required fields
    if (!recipients || recipients.length === 0) {
      throw new Error("No recipients provided");
    }
    if (!subject || !htmlContent) {
      throw new Error("Subject and HTML content are required");
    }

    console.log(`Sending bulk email to ${recipients.length} recipients`);

    // Send emails in batches to avoid rate limits
    const results = [];
    const batchSize = 10;
    
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (recipient) => {
        try {
          const emailResponse = await sendEmail({
            from: "UR Media <noreply@urmedia.tech>",
            to: [recipient.email],
            subject: subject,
            html: htmlContent.replace(/\{\{name\}\}/g, recipient.name || "Valued Customer"),
            text: textContent?.replace(/\{\{name\}\}/g, recipient.name || "Valued Customer"),
          });
          
          return {
            email: recipient.email,
            success: true,
            messageId: emailResponse.id,
          };
        } catch (error: any) {
          console.error(`Failed to send to ${recipient.email}:`, error.message);
          return {
            email: recipient.email,
            success: false,
            error: error.message,
          };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Small delay between batches
      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failedCount = results.filter(r => !r.success).length;

    console.log(`Bulk email completed: ${successCount} sent, ${failedCount} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        totalSent: successCount,
        totalFailed: failedCount,
        results,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-bulk-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
