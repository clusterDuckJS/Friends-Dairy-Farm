// src/hooks/useIsAdmin.js
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function useIsAdmin() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function check() {
      setIsLoading(true);
      try {
        // Supabase v2: getUser() returns { data: { user } }
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError || !userData?.user) {
          if (mounted) {
            setIsAdmin(false);
            setIsLoading(false);
          }
          return;
        }

        const userId = userData.user.id;

        // Fetch the profile row's is_admin flag
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", userId)
          .maybeSingle();

        if (profileError) {
          console.error("useIsAdmin profile error:", profileError);
          if (mounted) setIsAdmin(false);
        } else {
          if (mounted) setIsAdmin(Boolean(profile?.is_admin));
        }
      } catch (err) {
        console.error("useIsAdmin exception:", err);
        if (mounted) setIsAdmin(false);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    check();

    return () => {
      mounted = false;
    };
  }, []);

  return { isLoading, isAdmin };
}
