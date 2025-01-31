import { TSupabaseClient } from "@/utils/supabase/server";
import React from "react";
import { LogOut } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {
  supabase: TSupabaseClient;
};

export default function LogoutButton({ supabase }: Props) {
  const query = useQueryClient();
  const router = useRouter();

  const logoutHandler = async () => {
    const toastId = toast.loading("Logging out...", {
      duration: Infinity,
    });
    const { error } = await supabase.auth.signOut({ scope: "local" });
    toast.dismiss(toastId);

    if (error) toast.error(error.message);

    query.removeQueries();
    router.refresh();
  };

  return (
    <DropdownMenuItem onClick={logoutHandler}>
      <LogOut />
      Log out
    </DropdownMenuItem>
  );
}
