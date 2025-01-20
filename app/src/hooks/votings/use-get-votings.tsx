import { TSupabaseClient } from "@/utils/supabase/server";
import { useQuery } from "@tanstack/react-query";
import { compareDesc } from "date-fns";
import { toast } from "sonner";

export const useGetVotings = (supabase: TSupabaseClient) =>
  useQuery({
    queryKey: ["votings"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Log in first");
        throw new Error("User is not authenticated");
      }

      const { data, error } = await supabase
        .from("votings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error(error.message);
        throw new Error(error.message);
      }

      return data;
    },
  });

export const useGetVotingById = (supabase: TSupabaseClient, id: string) =>
  useQuery({
    queryKey: ["voting", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("votings")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        toast.error(error.message);
        throw new Error(error.message);
      }

      return data;
    },
  });

export const useGetJoinedVotes = (supabase: TSupabaseClient) =>
  useQuery({
    queryKey: ["all votes"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Log in first");
        throw new Error("User is not authenticated");
      }

      const { data: votings, error: errorVoting } = await supabase
        .from("votings")
        .select("*,profiles!inner(full_name,avatar)")
        .eq("user_id", user.id);

      if (errorVoting) {
        toast.error("Failed to get votings data");
        throw new Error("Failed to get votings data");
      }

      const { data: joinedVotes, error: joinedVotesError } = await supabase
        .from("voters")
        .select("*,votings!inner(*,profiles!inner(full_name,avatar))");

      if (joinedVotesError) {
        toast.error("Failed to get joined votes data");
        throw new Error("Failed to get joined votes data");
      }

      const temp = [...votings, ...joinedVotes.map((d) => d.votings)];

      temp.sort((a, b) => compareDesc(a.created_at, b.created_at));

      return temp;
    },
  });
