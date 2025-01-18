import { TSupabaseClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetAuth = (supabase: TSupabaseClient) =>
  useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    },
  });

type TUpdateAuthPayload = {
  email?: string;
  full_name?: string;
  password?: string;
  avatar?: string;
};

export const useUpdateAuth = (
  supabase: TSupabaseClient,
  query: QueryClient,
  onSuccess?: () => void,
) =>
  useMutation({
    mutationFn: async (payload: TUpdateAuthPayload) => {
      const { data, error } = await supabase.auth.updateUser({
        email: payload.email,
        password: payload.password,
        data: {
          full_name: payload.full_name,
          avatar: payload.avatar,
        },
      });

      if (error) throw new Error(error.name);

      return data.user;
    },
    onSuccess: (data) => {
      query.setQueryData<User>(["auth"], () => data);
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
