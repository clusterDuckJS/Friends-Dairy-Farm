// /src/utils/auth.js
import { supabase } from "./supabaseClient";

async function _ensureProfileRow(
  userId,
  { full_name = "", phone_number = "", email = "" } = {}
) {
  if (!userId) return null;

  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: userId,
        full_name,
        phone: phone_number,
        email,                     // ⭐ added here
        delivery_address: null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    )
    .select()
    .maybeSingle();

  if (error) {
    console.error("ensureProfileRow error:", error);
    return null;
  }

  return data;
}


export async function signUpUser({ email, password, fullName, phone }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone_number: phone,
      },
    },
  });

  if (error) throw error;

  // ---- IMPORTANT ----
  // Immediately create the profile row after sign up
  const userId = data?.user?.id;
  if (userId) {
    try {
      await _ensureProfileRow(userId, {
        full_name: fullName,
        phone_number: phone,
      });
    } catch (err) {
      console.error("Failed to auto-create profile:", err);
    }
  } else {
    console.warn("signUpUser: No user.id returned from signUp");
  }

  return data;
}

export async function loginUser({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return { success: true };
}
