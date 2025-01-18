"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { full_name } from "@/lib/form-schema";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/utils/supabase/client";
import { useGetAuth, useUpdateAuth } from "@/hooks/auth/use-auth";
import { useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import ChangePhotoForm from "@/components/change-photo-form";

const FormSchema = z.object({
  full_name: full_name,
});

export default function ProfilePage() {
  const supabase = useSupabase();
  const { data: user } = useGetAuth(supabase);
  const query = useQueryClient();
  const { mutateAsync, isPending } = useUpdateAuth(supabase, query);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    values: {
      full_name: (user?.user_metadata.full_name as string | undefined) ?? "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    await mutateAsync(data);
  };

  return (
    <div className="w-full flex-1 lg:max-w-2xl">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Profile</h3>
          <p className="text-sm text-muted-foreground">
            This is how others will see you on the site.
          </p>
        </div>
        <Separator orientation="horizontal" />
        <ChangePhotoForm user={user} />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Hasbiy Robbiy" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isPending || !form.formState.isDirty}
            >
              Update
              {isPending && <Loader className="animate-spin" />}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
