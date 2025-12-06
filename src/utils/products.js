// src/utils/products.js
import { supabase } from "./supabaseClient";

export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, slug, description, features, images, variants")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getProducts error:", error);
    throw error;
  }
  // parse variants if supabase returns as string (should be JSON)
  return (data || []).map(p => ({
    ...p,
    variants: p.variants || [],
    images: p.images || []
  }));
}

export async function getProductById(id) {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, slug, description, features, images, variants")
    .eq("id", id)
    .single();

  if (error) throw error;
  return { ...data, variants: data.variants || [], images: data.images || [] };
}
