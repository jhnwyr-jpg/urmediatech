// Public endpoint to forward contact form submissions to Google Apps Script (Sheets)

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function isValidEmail(email: string) {
  // Simple, safe validation (client already validates with zod)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json().catch(() => ({}));

    const name = String(payload?.name ?? "").trim();
    const email = String(payload?.email ?? "").trim();
    const message = String(payload?.message ?? "").trim();

    if (!name || name.length > 100) return json({ error: "Invalid name" }, 400);
    if (!email || email.length > 255 || !isValidEmail(email)) return json({ error: "Invalid email" }, 400);
    if (!message || message.length > 1000) return json({ error: "Invalid message" }, 400);

    const scriptUrl =
      "https://script.google.com/macros/s/AKfycbx3P-o84AKNPQrWl2YCHxs2EdjibYCl72MO3v-W17qazKeVif84Hn2YnGPgvnTvpSQ/exec";

    const form = new URLSearchParams({ name, email, message });

    const resp = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: form.toString(),
    });

    const text = await resp.text().catch(() => "");
    console.log("Apps Script response", { status: resp.status, preview: text.slice(0, 200) });

    if (!resp.ok) {
      return json(
        {
          error: "Google Sheets write failed",
          status: resp.status,
          responsePreview: text.slice(0, 200),
        },
        502
      );
    }

    return json({ ok: true });
  } catch (error) {
    console.error("contact-to-sheets error", error);
    return json({ error: "Unexpected error" }, 500);
  }
});
