// src/utils/products.js
import { supabase } from "./supabaseClient";

export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, slug, description, features, images, variants, coming_soon")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getProducts error:", error);
    throw error;
  }

  return (data || []).map(p => ({
    ...p,
    variants: p.variants || [],
    images: p.images || [],
    coming_soon: !!p.coming_soon,
  }));
}


export async function getProductById(id) {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, slug, description, features, images, variants, coming_soon")
    .eq("id", id)
    .single();

  if (error) throw error;

  return {
    ...data,
    variants: data.variants || [],
    images: data.images || [],
    coming_soon: !!data.coming_soon,
  };
}

