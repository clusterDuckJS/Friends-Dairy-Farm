import { supabase } from "./supabaseClient";

/**
 * createOrder - inserts an order row (one-time purchase).
 * items: array of { id, name, price, qty } (we store full snapshot)
 * schedule_type: 'one-time' or 'none'
 * schedule_meta: { date } or null
 */
export async function createOrder({ userId, items, total_amount, schedule_type = "one-time", schedule_meta = null }) {
  const payload = {
    user_id: userId,
    items,
    total_amount,
    schedule_type,
    schedule_meta,
    payment_method: "cod",
  };
  const { data, error } = await supabase
    .from("orders")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("createOrder error:", error);
    throw error;
  }
  return data;
}


// <-- add this function
export async function getOrdersForUser(userId) {
  const { data, error } = await supabase
    .from("orders")
    .select("id, items, total_amount, schedule_type, schedule_meta, payment_method, status, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getOrdersForUser error:", error);
    throw error;
  }
  return data || [];
}