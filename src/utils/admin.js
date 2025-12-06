// src/utils/admin.js
import { supabase } from "./supabaseClient";

/* Orders */
export async function adminGetAllOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("id, user_id, items, total_amount, schedule_type, schedule_meta, payment_method, status, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function adminUpdateOrderStatus(orderId, status) {
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/* Subscriptions */
export async function adminGetAllSubscriptions() {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("id, user_id, product_name, qty, schedule_type, schedule_meta, is_active, next_delivery_date, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function adminCancelSubscription(subscriptionId) {
  const { data, error } = await supabase
    .from("subscriptions")
    .update({ is_active: false })
    .eq("id", subscriptionId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/* Products */
export async function adminGetProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function adminUpsertProduct(payload) {
  const { data, error } = await supabase
    .from("products")
    .upsert(payload, { onConflict: "id" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function adminDeleteProduct(id) {
  const { data, error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
