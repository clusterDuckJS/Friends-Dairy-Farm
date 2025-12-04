import { supabase } from "./supabaseClient";

export async function getProfile(userId) {
  const { data, error, status } = await supabase
    .from("profiles")
    .select("id, full_name, phone, delivery_address")
    .eq("id", userId)
    .maybeSingle(); // <-- THIS FIXES 406 CLEANLY

  if (error && status !== 406) {
    throw error; // real error
  }

  return data || null; // no row = null
}


export async function upsertProfile({ userId, full_name, phone, delivery_address }) {
  const { data, error } = await supabase
    .from("profiles")
    .upsert({
      id: userId,
      full_name,
      phone,
      delivery_address,
      updated_at: new Date().toISOString()
    }, { onConflict: "id" })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getSubscriptionsForUser(userId) {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("id, product_name, qty, schedule_type, schedule_meta, is_active, next_delivery_date, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}
