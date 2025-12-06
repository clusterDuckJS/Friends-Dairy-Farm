import { supabase } from "./supabaseClient";

export async function createSubscription({
  userId,
  product_name,
  qty,
  schedule_type,
  schedule_meta,
  next_delivery_date,
}) {
  const { data, error } = await supabase
    .from("subscriptions")
    .insert([
      {
        user_id: userId,
        product_name,
        qty,
        schedule_type,
        schedule_meta,
        next_delivery_date,
        is_active: true,
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("createSubscription error:", error);
    throw error;
  }

  return data;
}

export async function cancelSubscription(subscriptionId) {
  const { data, error } = await supabase
    .from("subscriptions")
    .update({ is_active: false })
    .eq("id", subscriptionId)
    .select()
    .single();

  if (error) {
    console.error("cancelSubscription error:", error);
    throw error;
  }

  return data;
}

