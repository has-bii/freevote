import { getPublicUrl } from "./get-public-url";
import { TSupabaseClient } from "./supabase/server";

type Params = {
  url: string;
  supabase: TSupabaseClient;
  bucket: "avatars" | "choices";
};

export const removeFile = async ({ bucket, supabase, url }: Params) =>
  await supabase.storage
    .from("choice")
    .remove([url.replace(getPublicUrl({ bucket, supabase, url: "" }), "")]);
