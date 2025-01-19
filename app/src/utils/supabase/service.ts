import { Database } from "@/types/database";
import { createClient } from "@supabase/supabase-js";

export function createService() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  );
}
