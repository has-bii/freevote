import { TSupabaseClient } from "./supabase/server";

type Params = {
  url: string;
  supabase: TSupabaseClient;
  bucket: "avatars";
};

export const getPublicUrl = ({ bucket, supabase, url }: Params) =>
  supabase.storage.from(bucket).getPublicUrl(url).data.publicUrl;
