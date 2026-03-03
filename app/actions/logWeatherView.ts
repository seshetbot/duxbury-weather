"use server";

import { createClient } from "@supabase/supabase-js";

export async function logWeatherView() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return { ok: false, reason: "missing_supabase" };
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { error } = await supabase.from("weather_views").insert({
    location: "Duxbury, MA",
    viewed_at: new Date().toISOString(),
  });

  if (error) {
    return { ok: false, reason: error.message };
  }

  return { ok: true };
}
