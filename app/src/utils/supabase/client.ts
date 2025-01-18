import { Database } from "@/types/database";
import { createBrowserClient } from "@supabase/ssr";
import { useMemo } from "react";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export const useSupabase = () => useMemo(() => createClient(), []);
