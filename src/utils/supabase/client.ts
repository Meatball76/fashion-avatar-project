import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

// Cache the instance with strict typing
let supabaseInstance: SupabaseClient | null = null;

// Track the active session promise to prevent concurrent lock requests
// Using ReturnType ensures it perfectly matches Supabase's expected discriminated union types
let activeSessionPromise: ReturnType<SupabaseClient["auth"]["getSession"]> | null =
  null;

export function createClient(): SupabaseClient {
  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    // Intercept and deduplicate getSession calls
    const originalGetSession =
      supabaseInstance.auth.getSession.bind(supabaseInstance.auth);

    supabaseInstance.auth.getSession = () => {
      if (!activeSessionPromise) {
        activeSessionPromise = originalGetSession();
        activeSessionPromise.finally(() => {
          activeSessionPromise = null;
        });
      }
      return activeSessionPromise;
    };
  }

  return supabaseInstance;
}

