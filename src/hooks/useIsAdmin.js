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
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData?.user) {
          if (mounted) {
            setIsAdmin(false);
            setIsLoading(false);
          }
          return;
        }
        const userId = userData.user.id;

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

    // run once on mount
    check();

    // subscribe to auth changes so we re-run check when user signs in/out
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      // events: SIGNED_IN, SIGNED_OUT, TOKEN_REFRESH, USER_UPDATED, etc.
      // re-check admin status (debounce tiny bit if racey)
      check();
    });

    return () => {
      mounted = false;
      // cleanup subscription
      try { sub?.subscription?.unsubscribe(); } catch (e) { /* ignore */ }
    };
  }, []);

  return { isLoading, isAdmin };
}
