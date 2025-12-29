// /src/utils/auth.js
import { supabase } from "./supabaseClient";

/**
 * SIGN UP USER
 * - Creates auth user (email + password)
 * - Passes metadata for DB trigger
 * - Profiles row is created by DB trigger (NOT frontend)
 */
export async function signUpUser({ email, password, fullName, phone }) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        full_name: fullName?.trim() || null,
        phone: phone?.trim() || null,
      },
    },
  });

  if (error) throw error;

  return data;
}

/**
 * LOGIN USER
 */
export async function loginUser({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * LOGOUT USER
 */
export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return { success: true };
}
