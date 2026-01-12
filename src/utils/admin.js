// src/utils/admin.js
import { supabase } from "./supabaseClient";

/* =======================
   Orders
======================= */

export async function adminGetAllOrders() {
  // 1. Fetch orders
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("id, user_id, items, total_amount, schedule_type, schedule_meta, payment_method, status, created_at")
    .order("created_at", { ascending: false });

  if (ordersError) throw ordersError;
  if (!orders || orders.length === 0) return [];

  // 2. Collect unique user_ids
  const userIds = [...new Set(orders.map(o => o.user_id).filter(Boolean))];

  // 3. Fetch profiles
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, full_name, phone")
    .in("id", userIds);

  if (profilesError) throw profilesError;

  const profileMap = new Map(
    (profiles || []).map(p => [p.id, p])
  );

  // 4. Merge profiles into orders
  return orders.map(o => ({
    ...o,
    user: profileMap.get(o.user_id) || null,
  }));
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

/* =======================
   Subscriptions
======================= */

export async function adminGetAllSubscriptions() {
  const { data, error } = await supabase
    .from("subscriptions")
    .select(`
      id,
      user_id,
      product_name,
      qty,
      schedule_type,
      schedule_meta,
      is_active,
      next_delivery_date,
      created_at,
      profiles (
        full_name,
        phone,
        email
      )
    `)
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

/* =======================
   Products
======================= */

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
