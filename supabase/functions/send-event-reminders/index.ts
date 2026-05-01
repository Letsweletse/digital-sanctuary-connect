// Scheduled twice-weekly reminders for the upcoming event.
// Triggered by pg_cron (Tuesday 09:00 + Friday 09:00 UTC by default).
// Sends EMAIL + WHATSAPP to:
//   • Everyone in event_registrations (past attendees) → invitation
//   • Anyone already registered for the upcoming event → reminder

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const UPCOMING_EVENT = {
  name: "Perspectives On The Apostolic with Thamo Naidoo",
  date: "Saturday, 9 May 2026",
  time: "09:00 - 13:30",
  location: "Gate Gaborone, Plot 54014, Gaborone West",
  matchKeyword: "perspectives on the apostolic",
};

function normalizePhone(raw?: string | null): string | null {
  if (!raw) return null;
  let p = String(raw).replace(/[\s\-()]/g, "").trim();
  if (!p) return null;
  if (p.startsWith("+")) return p;
  if (p.startsWith("00")) return "+" + p.slice(2);
  if (/^[67]\d{7}$/.test(p)) return "+267" + p;
  if (p.startsWith("267")) return "+" + p;
  if (/^\d{10,15}$/.test(p)) return "+" + p;
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: registrations, error } = await supabase
      .from("event_registrations")
      .select("attendee_name, attendee_email, attendee_phone, event_name")
      .order("created_at", { ascending: false });

    if (error) throw error;
    if (!registrations || registrations.length === 0) {
      return new Response(JSON.stringify({ ok: true, message: "No registrants" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const alreadyRegistered = new Set<string>(
      registrations
        .filter((r: any) => (r.event_name || "").toLowerCase().includes(UPCOMING_EVENT.matchKeyword))
        .map((r: any) => (r.attendee_email || "").toLowerCase()),
    );

    const unique = new Map<string, any>();
    for (const reg of registrations) {
      const email = (reg.attendee_email || "").toLowerCase();
      if (!email) continue;
      if (!unique.has(email)) unique.set(email, reg);
    }

    let emails = 0, wa = 0, errs = 0, reminders = 0;

    for (const [email, reg] of unique) {
      const isReminder = alreadyRegistered.has(email);
      if (isReminder) reminders++;
      try {
        await supabase.functions.invoke("send-email", {
          body: {
            type: isReminder ? "event_reminder" : "event_invitation",
            recipientName: reg.attendee_name,
            recipientEmail: email,
            recipientPhone: reg.attendee_phone,
            eventName: UPCOMING_EVENT.name,
            eventDate: UPCOMING_EVENT.date,
            eventTime: UPCOMING_EVENT.time,
            eventLocation: UPCOMING_EVENT.location,
          },
        });
        emails++;

        const phone = normalizePhone(reg.attendee_phone);
        if (phone) {
          const message = isReminder
            ? `Hi ${reg.attendee_name}! 🙌\n\nA gentle reminder — you're registered for *${UPCOMING_EVENT.name}*.\n\n📅 ${UPCOMING_EVENT.date}\n⏰ ${UPCOMING_EVENT.time}\n📍 ${UPCOMING_EVENT.location}\n\nWe look forward to seeing you!\n\n— Gate Gaborone`
            : `Hi ${reg.attendee_name}! 👋\n\nYou're invited to *${UPCOMING_EVENT.name}*!\n\n📅 ${UPCOMING_EVENT.date}\n⏰ ${UPCOMING_EVENT.time}\n📍 ${UPCOMING_EVENT.location}\n\nRegister: https://www.gategaborone.co.bw/events\n\nIf you have already registered, kindly ignore this message.\n\n— Gate Gaborone`;
          const { error: waErr } = await supabase.functions.invoke("send-whatsapp", {
            body: { phone, message },
          });
          if (!waErr) wa++;
        }

        await new Promise((r) => setTimeout(r, 400));
      } catch (e) {
        console.error("reminder failed for", email, e);
        errs++;
      }
    }

    return new Response(
      JSON.stringify({ ok: true, total: unique.size, emails, whatsapp: wa, reminders, errors: errs }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e: any) {
    console.error(e);
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
